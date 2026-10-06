import assert from 'node:assert/strict';
import { test } from 'node:test';
import { request } from 'node:http';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, preview } from 'vite';
import { previewNetwork } from './preview-hosts';

test('local previews stay on loopback; Replit uses only exact configured hosts', () => {
  assert.deepEqual(previewNetwork({}), { allowedHosts: [], host: '127.0.0.1', remote: false });
  assert.deepEqual(previewNetwork({ REPLIT_DEV_DOMAIN: 'Workspace.spock.replit.dev', GE_PREVIEW_HOST: 'workspace.spock.replit.dev' }), {
    allowedHosts: ['workspace.spock.replit.dev'], host: '0.0.0.0', remote: true,
  });
  assert.equal(previewNetwork({ REPL_ID: 'test-workspace' }).host, '0.0.0.0');
});

test('invalid preview host settings fail without echoing the value', () => {
  for (const host of ['*', '.replit.dev', 'https://workspace.replit.dev', 'workspace.replit.dev:5000',
    'one.replit.dev,two.replit.dev', 'user:private@example.test', '-invalid.test', 'invalid..test', 'x'.repeat(64) + '.test']) {
    assert.throws(() => previewNetwork({ GE_PREVIEW_HOST: host }), { message: 'Preview hostname must be a bare exact hostname, without a URL, port or wildcard.' });
  }
});

function status(port: number, host: string) {
  return new Promise<number | undefined>((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path: '/', headers: { host } }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end();
  });
}

test('real Vite dev and build preview accept the workspace and reject unrelated hosts', async () => {
  const previous = { REPLIT_DEV_DOMAIN: process.env.REPLIT_DEV_DOMAIN, GE_PREVIEW_HOST: process.env.GE_PREVIEW_HOST, NODE_ENV: process.env.NODE_ENV };
  process.env.REPLIT_DEV_DOMAIN = 'release-test.spock.replit.dev';
  delete process.env.GE_PREVIEW_HOST;
  process.env.NODE_ENV = 'production'; // Do not load Replit editor plugins in this isolated test.
  const output = await mkdtemp(join(tmpdir(), 'ge-preview-hosts-'));
  try {
    await writeFile(join(output, 'index.html'), '<!doctype html><title>Preview host test</title>');
    const { default: repoConfig } = await import('../vite.config');
    // Exercise the real host configuration without starting unrelated asset plugins.
    const config = { ...repoConfig, configFile: false as const, plugins: [], root: output };
    const built = await preview({ ...config, logLevel: 'silent', build: { outDir: output }, preview: { ...config.preview, host: '127.0.0.1', port: 0, open: false } });
    try {
      const address = built.httpServer.address();
      assert.ok(address && typeof address !== 'string');
      assert.equal(await status(address.port, 'release-test.spock.replit.dev'), 200);
      assert.equal(await status(address.port, 'unrelated.spock.replit.dev'), 403);
      assert.equal(await status(address.port, 'sub.release-test.spock.replit.dev'), 403);
      assert.equal(await status(address.port, 'localhost'), 200);
    } finally { await built.close(); }
    const dev = await createServer({ ...config, logLevel: 'silent', server: { ...config.server, host: '127.0.0.1', port: 0, open: false, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
    try {
      await dev.listen();
      const address = dev.httpServer!.address();
      assert.ok(address && typeof address !== 'string');
      assert.equal(await status(address.port, 'release-test.spock.replit.dev:5000'), 200);
      assert.equal(await status(address.port, 'unrelated.spock.replit.dev'), 403);
      assert.equal(await status(address.port, 'localhost'), 200);
      assert.equal(dev.config.server.fs.strict, true);
    } finally { await dev.close(); }
  } finally {
    await rm(output, { recursive: true, force: true });
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
