/** Exact development hostnames only; never allow every replit.dev workspace. */
export function previewNetwork(env: Record<string, string | undefined> = process.env) {
  const allowedHosts = Array.from(new Set(
    [env.REPLIT_DEV_DOMAIN, env.GE_PREVIEW_HOST].filter((value) => value?.trim()).map((value) => {
      const host = value!.trim().toLowerCase();
      if (host.length > 253 || !host.split('.').every((label) =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
        throw new Error('Preview hostname must be a bare exact hostname, without a URL, port or wildcard.');
      }
      return host;
    }),
  ));
  const remote = Boolean(env.REPL_ID) || allowedHosts.length > 0;
  return { allowedHosts, host: remote ? '0.0.0.0' : '127.0.0.1', remote };
}
