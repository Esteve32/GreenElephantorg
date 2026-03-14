import { storage } from "../storage";

export async function isConnectorEnabled(name: string): Promise<boolean> {
  return storage.isConnectorEnabled(name);
}
