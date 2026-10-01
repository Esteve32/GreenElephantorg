import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('rendered primary menu exposes labelled links, outline icons and language switch', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'ge-navigation-'));
  try {
    const outfile = join(dir, 'render.cjs');
    await build({
      stdin: {
        contents: `
          import React from 'react';
          import { renderToStaticMarkup } from 'react-dom/server';
          import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
          import { Router } from 'wouter';
          import Header from './client/src/components/Header';
          import { TooltipProvider } from './client/src/components/ui/tooltip';
          const client = new QueryClient({ defaultOptions: { queries: { enabled: false, retry: false } } });
          client.setQueryData(['/api/portal/settings/public'], { portalLoginEnabled: true, saasEnabled: false });
          client.setQueryData(['/api/portal/me'], { authenticated: false });
          const html = renderToStaticMarkup(<QueryClientProvider client={client}><Router ssrPath="/"><TooltipProvider><Header /></TooltipProvider></Router></QueryClientProvider>);
          process.stdout.write(html);
        `,
        resolveDir: process.cwd(), loader: 'tsx',
      },
      loader: { '.css': 'empty' },
      bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
      outfile, logLevel: 'silent',
    });
    const html = execFileSync(process.execPath, [outfile], { encoding: 'utf8' });
    assert.match(html, /aria-label="Main navigation"/);
    assert.match(html, /href="\/fr"/);
    assert.match(html, /aria-hidden="true"/);
    const stack = [];
    const voids = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline']);
    for (const token of html.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b[^>]*>/gi)) {
      const [, close, tag] = token;
      if (close) {
        const index = stack.lastIndexOf(tag);
        if (index >= 0) stack.length = index;
      } else {
        if (tag === 'button' || tag === 'a') {
          assert.ok(!stack.includes('button') && !stack.includes('a'), `Nested interactive control: ${token[0]}`);
        }
        if (!voids.has(tag) && !token[0].endsWith('/>')) stack.push(tag);
      }
    }
    for (const route of ['/#training', '/#approach', '/#about']) {
      assert.ok(html.includes(`href="${route}"`), `Retained navigation destination ${route}`);
    }
    for (const route of ['/webinar', '/webinars', '/calendar']) {
      assert.ok(!html.includes(`href="${route}"`), `Parked route ${route} remains hidden`);
    }

    // This verifies generated semantics only. Interactive keyboard behavior and
    // computed CSS visibility still require an actual browser.
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('skip link and focusable main landmark remain present', () => {
  const app = readFileSync('client/src/App.tsx', 'utf8');
  assert.match(app, /href="#main"/);
  assert.match(app, /<main id="main" tabIndex=\{-1\}/);
});
