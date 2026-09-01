export type FlowOctant =
  | "flow"
  | "control"
  | "relaxation"
  | "boredom"
  | "apathy"
  | "worry"
  | "anxiety"
  | "arousal";

export interface PrivateCheckInInput {
  octant: FlowOctant;
  reflection: string;
}

export interface PrivateCheckInPayload extends PrivateCheckInInput {
  id: string;
  createdAt: string;
  schemaVersion: 1;
}

interface EncryptedCheckInRecord {
  id: string;
  createdAt: string;
  algorithm: "AES-GCM";
  keyVersion: 1;
  iv: ArrayBuffer;
  ciphertext: ArrayBuffer;
}

const DATABASE_NAME = "myfive-private-vault";
const DATABASE_VERSION = 1;
const KEY_STORE = "keys";
const CHECK_IN_STORE = "check-ins";
const CHECK_IN_KEY_ID = "check-ins-aes-gcm-v1";
const AUTHENTICATED_CONTEXT = new TextEncoder().encode("myfive-private-check-in:v1");
const FLOW_OCTANTS = new Set<FlowOctant>(["flow", "control", "relaxation", "boredom", "apathy", "worry", "anxiety", "arousal"]);

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("Vault transaction was aborted"));
    transaction.onerror = () => reject(transaction.error ?? new Error("Vault transaction failed"));
  });
}

function openVault(): Promise<IDBDatabase> {
  if (!globalThis.indexedDB || !globalThis.crypto?.subtle) {
    return Promise.reject(new Error("Encrypted local storage is unavailable in this browser"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(KEY_STORE)) {
        database.createObjectStore(KEY_STORE);
      }
      if (!database.objectStoreNames.contains(CHECK_IN_STORE)) {
        database.createObjectStore(CHECK_IN_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open the private vault"));
    request.onblocked = () => reject(new Error("Private vault upgrade is blocked by another tab"));
  });
}

async function getOrCreateCheckInKey(database: IDBDatabase): Promise<CryptoKey> {
  const candidateKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  const transaction = database.transaction(KEY_STORE, "readwrite");
  const store = transaction.objectStore(KEY_STORE);
  const completion = transactionComplete(transaction);
  const existingKey = await requestResult<CryptoKey | undefined>(store.get(CHECK_IN_KEY_ID));

  if (!existingKey) store.put(candidateKey, CHECK_IN_KEY_ID);
  await completion;
  return existingKey ?? candidateKey;
}

function createRecordId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Encrypts the complete check-in before writing it to IndexedDB.
 * No partner identifier or server request is involved. The non-extractable
 * CryptoKey is origin-bound storage, protecting records at rest; it does not
 * claim to protect against malicious script already executing on this origin.
 */
export async function savePrivateCheckIn(input: PrivateCheckInInput): Promise<string> {
  const database = await openVault();

  try {
    const key = await getOrCreateCheckInKey(database);
    const id = createRecordId();
    const createdAt = new Date().toISOString();
    const payload: PrivateCheckInPayload = {
      id,
      createdAt,
      schemaVersion: 1,
      octant: input.octant,
      reflection: input.reflection,
    };
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(payload));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: AUTHENTICATED_CONTEXT },
      key,
      plaintext,
    );
    const record: EncryptedCheckInRecord = {
      id,
      createdAt,
      algorithm: "AES-GCM",
      keyVersion: 1,
      iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer,
      ciphertext,
    };
    const transaction = database.transaction(CHECK_IN_STORE, "readwrite");
    transaction.objectStore(CHECK_IN_STORE).add(record);
    await transactionComplete(transaction);
    return id;
  } finally {
    database.close();
  }
}

/**
 * Decrypts records from this browser only for an explicit user-requested export.
 * The origin-bound key and plaintext never leave the client except in the file
 * the user chooses to download.
 */
export async function exportPrivateVault(): Promise<PrivateCheckInPayload[]> {
  const database = await openVault();

  try {
    const keyTransaction = database.transaction(KEY_STORE, "readonly");
    const keyCompletion = transactionComplete(keyTransaction);
    const key = await requestResult<CryptoKey | undefined>(keyTransaction.objectStore(KEY_STORE).get(CHECK_IN_KEY_ID));
    await keyCompletion;

    const recordTransaction = database.transaction(CHECK_IN_STORE, "readonly");
    const recordCompletion = transactionComplete(recordTransaction);
    const records = await requestResult<EncryptedCheckInRecord[]>(recordTransaction.objectStore(CHECK_IN_STORE).getAll());
    await recordCompletion;

    if (records.length === 0) return [];
    if (!key) throw new Error("The private-vault key is unavailable in this browser");

    const decoded = await Promise.all(records.map(async (record) => {
      const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: record.iv, additionalData: AUTHENTICATED_CONTEXT },
        key,
        record.ciphertext,
      );
      const payload = JSON.parse(new TextDecoder().decode(plaintext)) as Partial<PrivateCheckInPayload>;
      if (
        payload.id !== record.id
        || payload.createdAt !== record.createdAt
        || payload.schemaVersion !== 1
        || typeof payload.octant !== "string"
        || !FLOW_OCTANTS.has(payload.octant as FlowOctant)
        || typeof payload.reflection !== "string"
      ) {
        throw new Error("A private-vault record failed integrity validation");
      }
      return payload as PrivateCheckInPayload;
    }));

    return decoded.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  } finally {
    database.close();
  }
}

export async function wipePrivateVault(): Promise<void> {
  if (!globalThis.indexedDB) return;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Private vault deletion failed"));
    request.onblocked = () => reject(new Error("Close other MyFive tabs before deleting the private vault"));
  });
}
