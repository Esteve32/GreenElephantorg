// GitHub push utility for syncing Replit codebase to GitHub
// Pushes all source code, configs, and dependencies to Esteve32/GreenElephantorg
// Note: attached_assets/ (408MB+) excluded from API push due to size limits.
// Binary assets are managed by Replit and referenced via @assets imports at build time.
import { getUncachableGitHubClient } from './github-client.ts';
import * as fs from 'fs';
import * as path from 'path';

const OWNER = 'Esteve32';
const REPO = 'GreenElephantorg';
const BRANCH = 'main';

const EXCLUDED_DIRS = [
  '.git', 'node_modules', '.cache', '.config', '.local', '.upm',
  '.breakpoints',
  'attached_assets'
];

const EXCLUDED_FILES = ['.replit', 'replit.nix'];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB GitHub API limit per blob

function shouldInclude(filePath: string): boolean {
  const parts = filePath.split('/');
  for (const dir of EXCLUDED_DIRS) {
    if (parts.includes(dir)) return false;
  }
  for (const f of EXCLUDED_FILES) {
    if (path.basename(filePath) === f) return false;
  }
  if (filePath === '.replit' || filePath === 'replit.nix' || filePath === '.breakpoints') return false;
  return true;
}

function getFiles(dir: string, base: string = ''): string[] {
  const result: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        result.push(...getFiles(path.join(dir, entry.name), rel));
      }
    } else if (entry.isFile() && shouldInclude(rel)) {
      const fullPath = path.join(dir, entry.name);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size <= MAX_FILE_SIZE_BYTES) {
          result.push(rel);
        } else {
          console.log(`  Skipping ${rel} (${(stat.size / 1024 / 1024).toFixed(1)}MB exceeds limit)`);
        }
      } catch {
        result.push(rel);
      }
    }
  }
  return result;
}

const BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webp'];

function isBinary(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.includes(ext);
}

export async function pushToGitHub(commitMessage: string) {
  const { isConnectorEnabled } = await import('./lib/connectorGuard');
  if (!(await isConnectorEnabled("github"))) {
    console.log('⏸️ GitHub connector disabled — skipping push');
    throw new Error('GitHub connector is currently disabled. Enable it in Admin > Connected Tools.');
  }
  const octokit = await getUncachableGitHubClient();
  const rootDir = '/home/runner/workspace';

  console.log('Collecting files...');
  const files = getFiles(rootDir);
  console.log(`Found ${files.length} files to push`);

  const ref = await octokit.rest.git.getRef({ owner: OWNER, repo: REPO, ref: `heads/${BRANCH}` });
  const baseSha = ref.data.object.sha;
  console.log(`Base commit: ${baseSha}`);

  const treeItems: any[] = [];
  let blobCount = 0;

  for (const file of files) {
    const fullPath = path.join(rootDir, file);
    const binary = isBinary(file);

    try {
      if (binary) {
        const content = fs.readFileSync(fullPath);
        const blob = await octokit.rest.git.createBlob({
          owner: OWNER,
          repo: REPO,
          content: content.toString('base64'),
          encoding: 'base64'
        });
        treeItems.push({
          path: file,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.data.sha
        });
      } else {
        const content = fs.readFileSync(fullPath, 'utf8');
        const blob = await octokit.rest.git.createBlob({
          owner: OWNER,
          repo: REPO,
          content: content,
          encoding: 'utf-8'
        });
        treeItems.push({
          path: file,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.data.sha
        });
      }

      blobCount++;
      if (blobCount % 20 === 0) {
        console.log(`  Created ${blobCount}/${files.length} blobs...`);
      }
    } catch (e: any) {
      console.error(`Failed to create blob for ${file}: ${e.message}`);
    }
  }

  console.log(`Creating tree with ${treeItems.length} items...`);
  const tree = await octokit.rest.git.createTree({
    owner: OWNER,
    repo: REPO,
    tree: treeItems,
    base_tree: undefined
  });

  console.log('Creating commit...');
  const commit = await octokit.rest.git.createCommit({
    owner: OWNER,
    repo: REPO,
    message: commitMessage,
    tree: tree.data.sha,
    parents: [baseSha]
  });

  console.log('Updating ref...');
  await octokit.rest.git.updateRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${BRANCH}`,
    sha: commit.data.sha
  });

  console.log(`Push complete! Commit: ${commit.data.sha}`);
  return commit.data.sha;
}
