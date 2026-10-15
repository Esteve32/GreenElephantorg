import { eq } from 'drizzle-orm';
import { db } from './db';
import { adminUsers, auditLogs } from '@shared/schema';
import { isTeamEmail, normalizeAdminEmail } from '@shared/admin-access-policy';
import { TeamChangeError, type TeamChange } from './admin-team-routes';
import type { PrivacyAdminIdentity } from './privacy-admin-access';

export async function changeAdminTeamAudited(actor: PrivacyAdminIdentity, change: TeamChange, owner: string | undefined) {
  return db.transaction(async tx => {
    const [currentOwner] = await tx.select().from(adminUsers).where(eq(adminUsers.id, actor.id)).limit(1).for('update');
    if (!normalizeAdminEmail(owner) || !currentOwner || currentOwner.isActive !== 'true'
        || currentOwner.role !== 'super_admin' || normalizeAdminEmail(currentOwner.email) !== normalizeAdminEmail(owner)
        || !currentOwner.googleId || currentOwner.googleId !== actor.googleId)
      throw new TeamChangeError(403, 'Owner access is no longer valid.');
    let result;
    let before: { role: string; isActive: string } | null = null;
    if (change.kind === 'invite') {
      if (!isTeamEmail(change.email) || normalizeAdminEmail(change.email) === normalizeAdminEmail(owner))
        throw new TeamChangeError(400, 'Owner access cannot be created through team invitations.');
      [result] = await tx.insert(adminUsers).values({
        email: change.email, name: change.name, role: change.role, invitedBy: currentOwner.email,
        isActive:'true', googleId:null, avatarUrl:null,
      }).onConflictDoNothing({target:adminUsers.email}).returning();
      if (!result) throw new TeamChangeError(409, 'This account already exists. Review or reactivate it instead.');
    } else {
      const [target] = await tx.select().from(adminUsers).where(eq(adminUsers.id, change.id)).limit(1).for('update');
      if (!target) throw new TeamChangeError(404, 'Account not found.');
      if (normalizeAdminEmail(target.email) === normalizeAdminEmail(owner))
        throw new TeamChangeError(403, 'The sole owner cannot be changed or deactivated here.');
      const activating = change.kind === 'update' && change.isActive === 'true';
      if (activating && !isTeamEmail(target.email))
        throw new TeamChangeError(400, 'Only @greenelephant.org team accounts can be activated.');
      before = {role:target.role,isActive:target.isActive};
      const patch = change.kind === 'deactivate' ? {isActive:'false'} : {
        ...(change.role ? {role:change.role} : {}), ...(change.isActive ? {isActive:change.isActive} : {}),
      };
      [result] = await tx.update(adminUsers).set(patch).where(eq(adminUsers.id, target.id)).returning();
    }
    await tx.insert(auditLogs).values({
      userEmail:currentOwner.email, actionType:'admin_access_' + change.kind, resource:'admin_users',
      details:{actorId:actor.id,targetId:result.id,before,after:{role:result.role,isActive:result.isActive}},
      ipAddress:null,
    });
    return result;
  });
}
