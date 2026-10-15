import { db } from './db';
import { createMarketingPermissionGate } from './marketing-permission-store';
export const withConfirmedMarketingPermission=createMarketingPermissionGate(db);
/** A legacy flag or a previous address check cannot create a new grant. */
export async function confirmedMarketingPermission(contactId:string):Promise<boolean>{
 return (await withConfirmedMarketingPermission(contactId,undefined,async()=>true)).allowed;
}
