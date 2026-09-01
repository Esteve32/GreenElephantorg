export const MYFIVE_EXPORT_SCHEMA_VERSION = "myfive-gdpr-article-20.v1" as const;

export interface PortableLocalCheckIn {
  id: string;
  createdAt: string;
  schemaVersion: 1;
  octant: string;
  reflection: string;
}

export interface MyFiveDataExport {
  metadata: {
    schemaVersion: typeof MYFIVE_EXPORT_SCHEMA_VERSION;
    exportedAt: string;
    dataSubject: {
      accountId: string;
      email: string;
      name: string | null;
    };
    scope: string[];
    provenance: {
      serverData: string;
      localBrowserVault: string;
    };
  };
  privacy: {
    classification: "PRIVATE - DATA SUBJECT COPY";
    intendedRecipient: string;
    handlingNotice: string;
  };
  data: {
    account: Record<string, unknown>;
    connectionSlots: Array<Record<string, unknown>>;
    privateServerCheckIns: Array<Record<string, unknown>>;
    connectionProfiles: Array<Record<string, unknown>>;
    agreementVersions: Array<Record<string, unknown>>;
    consentReceipts: Array<Record<string, unknown>>;
    membership: {
      myfive: Record<string, unknown> | null;
      linkedPortal: Array<Record<string, unknown>>;
    };
    linkedPortal: {
      context: Array<Record<string, unknown>>;
      timeline: Array<Record<string, unknown>>;
    };
  };
  localBrowserVault: {
    status: "not_accessible_to_server" | "included_by_browser" | "unavailable_in_browser";
    description: string;
    combinedAt?: string;
    recordCount?: number;
    checkIns?: PortableLocalCheckIn[];
  };
  omissions: Array<{
    category: string;
    reason: string;
  }>;
}

function escapeInline(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/([|*_`[\]<>])/g, "\\$1")
    .replace(/\r?\n/g, " ");
}

function jsonBlock(value: unknown): string {
  const serialized = JSON.stringify(value, null, 2);
  const longestFence = Math.max(3, ...Array.from(serialized.matchAll(/`+/g), (match) => match[0].length + 1));
  const fence = "`".repeat(longestFence);
  return `${fence}json\n${serialized}\n${fence}`;
}

function recordSections(title: string, records: Array<Record<string, unknown>>): string {
  if (records.length === 0) return `## ${title}\n\nNo records.`;
  return `## ${title}\n\n${records.map((record, index) => `### Record ${index + 1}\n\n${jsonBlock(record)}`).join("\n\n")}`;
}

export function renderMyFiveExportMarkdown(dataExport: MyFiveDataExport): string {
  const { metadata, privacy, data, localBrowserVault, omissions } = dataExport;
  const localRecords = localBrowserVault.checkIns ?? [];

  return [
    "# MyFive GDPR Article 20 Data Export",
    "",
    `> ${privacy.classification}`,
    `> Intended recipient: ${escapeInline(privacy.intendedRecipient)}`,
    `> ${privacy.handlingNotice}`,
    "",
    "## Export metadata",
    "",
    `- Schema version: ${escapeInline(metadata.schemaVersion)}`,
    `- Exported at: ${escapeInline(metadata.exportedAt)}`,
    `- Data subject account ID: ${escapeInline(metadata.dataSubject.accountId)}`,
    `- Data subject email: ${escapeInline(metadata.dataSubject.email)}`,
    `- Data subject name: ${escapeInline(metadata.dataSubject.name)}`,
    `- Scope: ${metadata.scope.map(escapeInline).join("; ")}`,
    `- Server provenance: ${escapeInline(metadata.provenance.serverData)}`,
    `- Local-vault provenance: ${escapeInline(metadata.provenance.localBrowserVault)}`,
    "",
    "## Account",
    "",
    jsonBlock(data.account),
    "",
    recordSections("Connection slots", data.connectionSlots),
    "",
    recordSections("Private server check-ins", data.privateServerCheckIns),
    "",
    recordSections("Private connection-profile snapshots", data.connectionProfiles),
    "",
    recordSections("Agreement versions created by you", data.agreementVersions),
    "",
    recordSections("Consent receipts", data.consentReceipts),
    "",
    "## Membership",
    "",
    jsonBlock(data.membership),
    "",
    recordSections("Linked portal context", data.linkedPortal.context),
    "",
    recordSections("Linked portal timeline", data.linkedPortal.timeline),
    "",
    "## Encrypted local browser vault",
    "",
    `- Status: ${escapeInline(localBrowserVault.status)}`,
    `- Description: ${escapeInline(localBrowserVault.description)}`,
    `- Combined at: ${escapeInline(localBrowserVault.combinedAt)}`,
    `- Record count: ${escapeInline(localBrowserVault.recordCount)}`,
    "",
    ...(localRecords.length > 0
      ? localRecords.flatMap((record, index) => [`### Local check-in ${index + 1}`, "", jsonBlock(record), ""])
      : ["No local-vault records were included.", ""]),
    "## Deliberate omissions and privacy boundaries",
    "",
    ...omissions.flatMap((omission) => [
      `- **${escapeInline(omission.category)}:** ${escapeInline(omission.reason)}`,
    ]),
    "",
  ].join("\n");
}
