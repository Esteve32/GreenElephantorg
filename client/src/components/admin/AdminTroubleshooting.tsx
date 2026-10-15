import { useId } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Help = { title: string; first: string; expected: string; who: string; steps: string[]; href: string; label: string };
const support = 'mailto:esteve@greenelephant.org';
const recovery: Help = {
  title: 'My phone is lost or the text message did not arrive',
  first: 'On Google’s sign-in screen, choose “Try another way” when offered.',
  expected: 'Google offers a method you already set up, such as another passkey or an offline backup code.',
  who: 'You; your Workspace administrator for a managed account; the website operator for an approved repair.',
  steps: ['Use an enrolled method you can reach without the missing phone. Enter codes only on Google’s own sign-in page.',
    'If no method works, use Google account recovery. A recovery email helps recover the account; it is not proof of MFA for this website.',
    'Ask your Workspace administrator for managed-account recovery. If the website owner is locked out, the operator must verify identity, obtain explicit repair approval, preserve history and revoke affected sessions.',
    'Do not share a login, send backup codes to support or use a shared website password. SMS availability depends on Google and your carrier.'],
  href: 'https://support.google.com/accounts/answer/185834?hl=en', label: 'Google: SMS and lost-phone help',
};
const unavailable: Help = {
  title: 'The website could not finish the access check', first: 'Wait a few minutes, then try once from the login page.',
  expected: 'The sign-in completes or a specific help message appears. Repeated attempts should not be needed.',
  who: 'The website operator, if one retry fails.',
  steps: ['Keep this page open and check your internet connection.', 'If the same problem returns, contact support with the time and the short message shown here.',
    'The operator checks Google availability, website configuration and session storage. Never send the full sign-in URL, browser cookies or codes.'],
  href: support, label: 'Contact website support',
};
const expired: Help = {
  title: 'Sign in again to continue', first: 'Start a new Google sign-in using your approved account.',
  expected: 'Ordinary admin tools open. Owner and privacy tools still need their separate permission.',
  who: 'You; the website owner if your approved account still cannot enter.',
  steps: ['Use the button below once. Do not reuse a saved Google return address.', 'The owner/privacy website window lasts 30 minutes. Renewing it does not prove Google asked for a fresh second factor.',
    'If access is still denied, use the help message on the login page. Do not keep signing in in a loop.'],
  href: '/api/admin/auth/google', label: 'Start Google sign-in',
};
const permission: Help = {
  title: 'Privacy access is restricted', first: 'Return to the Admin Hub for your ordinary tools and training.',
  expected: 'Your ordinary administrator access still works. Private records remain hidden.', who: 'The owner confirms privacy responsibilities.',
  steps: ['RoPA means a record of processing activities: a register of how personal information is used.',
    'Privacy records have separate named permissions. Ordinary admin access and training do not grant them.',
    'If you have an assigned privacy responsibility, ask the owner to check it. Repeated sign-ins cannot add permission.'],
  href: '/admin/submissions', label: 'Return to Admin Hub',
};
const help: Record<string, Help> = {
  privacy_configuration_required: {title:'This privacy workflow is not activated',first:'Keep the existing request or evidence reference. Ask the owner to finish the activation review.',expected:'The workflow opens after its storage, named access and configuration are checked.',who:'The owner and website operator.',steps:['The older withdrawal history is a separate service and can still be available.','No new subscription or case is saved by this failed request.','The operator must use an isolated database check before enabling new storage. Do not use a populated database as a test target.'],href:support,label:'Contact website support'},
  privacy_request_not_applied: {title:'This action needs another review',first:'Read the current saved record before trying again.',expected:'You can compare the current version with your intended action.',who:'You; the owner for notice, mail approval and policy changes.',steps:['Check the required fields and evidence reference.','Another action may have changed this record. Start from its current version.','A held or unresolved case cannot be treated as finished without the required identity and outcome evidence.'],href:support,label:'Contact website support'},

  ropa_unavailable: { title: 'The activity register could not finish the request', first: 'For a read, check the register once more. For a save, use the saved-request guidance below.', expected: 'The register shows saved records after a successful check. A missing response does not prove a save failed.', who: 'The website operator if a retry fails.', steps: ['Do not create a replacement activity just because a save response was lost.', 'A retry of the same saved request uses its original reference to avoid duplicate versions.', 'If the database or audit is unavailable, ask the operator to restore it. Never bypass the audit or access check.'], href: support, label: 'Contact website support' },
  ropa_conflict: { title: 'This activity changed or the save reference conflicts', first: 'Read the saved activity before editing again.', expected: 'You see the current version and can prepare a new deliberate change.', who: 'You; the website operator if the conflict persists.', steps: ['Open the saved activity and inspect its version history.', 'Compare it with the change you intended.', 'Start a new draft from the current version. Older versions are preserved.'], href: support, label: 'Contact website support' },
  ropa_invalid: { title: 'The activity could not be accepted', first: 'Check the required fields, links and review evidence.', expected: 'The draft saves after valid values are supplied; review labels require explicit human evidence.', who: 'You; the website operator for repeated failures.', steps: ['Use HTTPS reference links without secrets.', 'Complete or explain each required field before marking reviewed.', 'Do not claim a live check that has not been performed.'], href: support, label: 'Contact website support' },
  ropa_origin_required: { title: 'The save did not come from the configured website', first: 'Ask the operator to check the website address.', expected: 'Writes work only from the reviewed configured origin.', who: 'The website operator.', steps: ['Do not disable browser security or bypass the origin check.', 'Give the operator the site address and time, without cookies or tokens.'], href: support, label: 'Contact website support' },
  ropa_not_found: { title: 'This activity was not found', first: 'Return to the register and read the current activities.', expected: 'Available records are listed after access is checked.', who: 'The website operator if an expected record is missing.', steps: ['Do not create a replacement without checking the register.', 'Ask the operator to check the record reference if needed.'], href: '/admin/ropa', label: 'Return to register' },
  email_access_unavailable: { title: 'Email Control Room access could not be checked',
    first: 'Check access once more.', expected: 'The workspace opens after your account is checked. No email is sent by this check.', who: 'The website operator if the check fails again.',
    steps: ['Use “Check access again” once.', 'If the problem remains, tell support the page name, time and this short message.', 'Do not share cookies, addresses, message bodies or the full sign-in URL.'], href: support, label: 'Contact website support' },
  email_history_unavailable: { title: 'Batch email history is unavailable',
    first: 'Read the history once more. Do not resend an email to test this.', expected: 'Saved batch attempts appear, or the page confirms no records were returned. An error does not mean no email was sent.', who: 'The website operator if history cannot be read.',
    steps: ['Use “Check history again”. This reads records and sends no email.', 'If you are checking an uncertain send, ask the operator to reconcile the recorded attempt with the email provider before sending again.', 'Share only the time and short message, not recipient lists or message bodies.'], href: support, label: 'Contact website support' },
  email_access_required: { title: 'Your account cannot open this email information',
    first: 'Return to the Admin Hub for your permitted tools.', expected: 'The owner can check your assigned role. Repeated sign-ins cannot grant permission.', who: 'The website owner.',
    steps: ['Return to the Admin Hub.', 'Ask the owner to check access if this information is needed for your work.', 'Do not borrow someone else’s sign-in.'], href: '/admin/submissions', label: 'Return to Admin Hub' },
  settings_unavailable: { title: 'Current settings could not be loaded',
    first: 'Check the current settings once more.', expected: 'The connected controls show their saved values. An unavailable setting does not mean it is off.',
    who: 'The website operator, if the check fails again.',
    steps: ['Use “Check current settings” once. This only reads the saved values.',
      'Wait for the check to finish before changing a connected control.',
      'If it fails again, contact support with the page name, time and this short message. Never send cookies or private settings.'],
    href: support, label: 'Contact website support' },
  settings_save_unconfirmed: { title: 'The change could not be confirmed',
    first: 'Read the current settings before trying another change.',
    expected: 'You see what the website saved. A lost response does not tell us whether the change reached the server.',
    who: 'The website operator, if the current value cannot be checked.',
    steps: ['Use “Check current settings”. This reads the values without sending the change again.',
      'Compare the saved value with the change you intended.',
      'If the value is still different, make one deliberate change. If checking fails, contact support.'],
    href: support, label: 'Contact website support' },
  settings_access_required: { title: 'Your account cannot use these settings',
    first: 'Return to the Admin Hub for the tools available to your account.',
    expected: 'Your permitted tools remain available. Signing in repeatedly cannot add permission.',
    who: 'The website owner can check your assigned role.',
    steps: ['Viewer accounts cannot change settings.', 'Ask the owner to check your role if your work requires a change.',
      'Do not borrow another person’s sign-in.'], href: '/admin/submissions', label: 'Return to Admin Hub' },
  sign_in_required: expired, google_sign_in_required: expired,
  privacy_access_required: permission,
  owner_required: { ...permission, title: 'These controls are reserved for the owner',
    expected: 'Ordinary admins can use the Admin Hub and training. Team management and security audit stay owner-only.',
    who: 'The designated website owner.', steps: ['If you are an ordinary administrator, return to the Admin Hub.',
      'If you are the owner, start a new Google sign-in from the login page. The website owner window lasts 30 minutes.',
      'If that fails once, contact the operator. Signing in cannot promote an ordinary account to owner.'] },
  not_configured: { ...unavailable, title: 'Google sign-in is not ready on this website', first: 'Contact the website operator.',
    expected: 'The operator confirms the reviewed setup before asking you to try again.',
    steps: ['There is no browser setting you need to change for this message.',
      'The operator checks that the Google client ID and secret are present and belong to the intended project.',
      'The operator compares the allowed return address in Google with the website address. A return address is where Google sends you after sign-in.'],
    href: support, label: 'Contact website support' },
  not_authorized: { ...permission, title: 'This account could not enter the admin area',
    first: 'Check that you chose the Google account approved for your website role.',
    expected: 'An active approved account opens its permitted tools.', who: 'The website owner.',
    steps: ['If you chose the wrong account, use “Sign in with Google” once and choose the approved one.',
      'If it is the right account, ask the owner to check your invitation, active status and Google identity.',
      'An account may be inactive or outside the permitted group. This public page does not list approved accounts.'], href: support, label: 'Ask the owner for help' },
  mfa_unverified: { title: 'Google did not provide the required MFA evidence',
    first: 'Ask the Google project administrator to check the website’s MFA evidence setup.',
    expected: 'The administrator confirms project eligibility and enabled claims before another sign-in test.',
    who: 'The Google project administrator and website developer.',
    steps: ['MFA means multi-factor authentication: Google checks more than one factor to protect an account.',
      'A claim is a fact in Google’s signed sign-in result. The website needs an explicit MFA claim and a valid Google sign-in time.',
      'In Google Auth Platform, check Audience → Publishing status, Verification Center, then Settings → Advanced Settings for authentication-strength and session-age claims.',
      'If the feature or evidence is unavailable, stop and review the setup. A passkey alone, recovery email or another website login is not a substitute for the required evidence.'],
    href: 'https://developers.google.com/identity/siwg/security-bundle', label: 'Google: check MFA evidence setup' },
  state_mismatch: { ...expired, title: 'The sign-in attempt expired or could not be matched',
    first: 'Close old sign-in tabs, then start once from this login page.',
    expected: 'You return to the same browser and website after Google sign-in.',
    steps: ['Use one sign-in tab and finish within 10 minutes.', 'Allow this website’s own cookies, which keep the sign-in attempt connected. Do not disable browser security or allow all third-party cookies.',
      'If one fresh attempt fails, contact the website operator to check cookies, the return address and session storage.'] },
  session_failed: { ...unavailable, title: 'The website could not keep your sign-in session',
    first: 'Check that this website may save its own cookies, then try once.',
    steps: ['A session lets the website remember your successful sign-in. Its cookie is a small browser record.',
      'Use the same browser throughout sign-in. Do not disable security settings or allow all third-party cookies.',
      'If it fails again, contact the operator. They check website session storage and HTTPS settings; you should not send browser cookies.'] },
  google_auth_failed: { ...expired, title: 'Google sign-in was cancelled or not allowed',
    first: 'If you cancelled by mistake, start Google sign-in once more.',
    steps: ['Choose the approved account and finish Google’s prompts.', 'If Google says access is blocked, ask the Google project administrator to check the app audience and account policy.',
      'For a lost phone or missing SMS, open the recovery help below. Never send the whole Google error URL to support.'] },
  invalid_identity: { ...unavailable, title: 'The website could not verify Google’s sign-in result' },
  dev_google: { ...unavailable, title: 'This preview cannot provide Google admin access',
    first: 'Ask the operator for the configured sign-in site.', expected: 'The operator gives you the reviewed site address.',
    steps: ['A local preview is for reviewing page layout.', 'Google needs a registered website return address and working server settings. Do not add credentials to a preview or paste them into chat.'] },
  recovery,
};

export function AdminTroubleshooting({ code, onCheckSettings, onRetry, retryLabel = 'Try once more' }: { code: string; onCheckSettings?: () => void; onRetry?: () => void; retryLabel?: string }) {
  const item = Object.hasOwn(help, code) ? help[code] : unavailable;
  const id = useId();
  const action = onCheckSettings ?? onRetry;
  return <section aria-labelledby={id} className="rounded-xl border border-amber-200/30 bg-[#182326] p-5 text-white text-base leading-relaxed my-4" data-testid="admin-troubleshooting">
    <h2 id={id} className="text-lg font-semibold text-amber-100">{item.title}</h2>
    <p className="mt-3" role="status"><strong>Do this first: </strong>{item.first}</p>
    <p className="mt-3 text-white/80"><strong>Check the result: </strong>{item.expected}</p>
    <details className="mt-4">
      <summary className="cursor-pointer text-teal-200 underline underline-offset-4 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">Still stuck? Show the steps and who can help</summary>
      <ol className="list-decimal pl-6 mt-3 space-y-3">{item.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <p className="mt-3"><strong>Who can fix it: </strong>{item.who}</p>
      {code === 'recovery' && <a className="block underline text-teal-200 mt-3" href="https://accounts.google.com/signin/recovery" rel="noreferrer">Open Google account recovery</a>}
    </details>
    {action ? <button type="button" onClick={action} className="inline-block mt-4 rounded border border-teal-200/40 px-4 py-3 text-teal-100 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">{onCheckSettings ? 'Check current settings' : retryLabel}</button>
      : <a href={item.href} rel="noreferrer" className="inline-block mt-4 rounded border border-teal-200/40 px-4 py-3 text-teal-100 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">{item.label}</a>}
    {action && <p className="mt-3">If the check fails again, <a href={support} className="text-teal-200 underline">contact website support</a>.</p>}
  </section>;
}

export function AdminLoginHelp() {
  return <details className="mt-6 rounded-xl border border-white/20 p-4 text-white text-base">
    <summary className="cursor-pointer font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">Need help signing in or recovering access?</summary>
    <p className="mt-4 text-white/80">Choose the problem you see. You do not need to sign in to read this help.</p>
    <Tooltip><TooltipTrigger asChild><button type="button" className="my-3 underline text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300" aria-label="Define MFA: multi-factor authentication">What does MFA mean?</button></TooltipTrigger>
      <TooltipContent className="max-w-72 text-base">Multi-factor authentication: Google checks more than one factor to protect your account.</TooltipContent></Tooltip>
    <p className="text-white/80">MFA means multi-factor authentication. Google calls its account feature 2-Step Verification.</p>
    {['recovery', 'mfa_unverified', 'state_mismatch', 'not_authorized', 'not_configured'].map(code => <details key={code} className="my-3">
      <summary className="cursor-pointer py-2 text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300">{help[code].title}</summary>
      <AdminTroubleshooting code={code} />
    </details>)}
    <p className="text-white/70 mt-4">For support, share only the short message and time. Never share passwords, codes, cookies, recovery contacts or the full sign-in URL.</p>
  </details>;
}
