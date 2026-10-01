import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const failures = [];

for (const required of [
  "AGENTS.md",
  "README.md",
  ".replit",
  ".nvmrc",
  "flake.nix",
  "flake.lock",
  "replit.nix",
  "package-lock.json",
  ".github/workflows/replit-release-reminder.yml",
  "docs/PRD.md",
  "docs/DECISION_LOG.md",
  "docs/ENVIRONMENT.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/requirement-decision.yml",
  "docs/project-index.json",
  "docs/operations/replit-deployment.md",
  "docs/operations/secrets.md",
]) {
  if (!existsSync(required)) failures.push(`Missing required file: ${required}`);
}

const projectIndex = JSON.parse(readFileSync("docs/project-index.json", "utf8"));
for (const pathWithAnchor of Object.values(projectIndex.canonical_documents ?? {})) {
  const path = String(pathWithAnchor).split("#", 1)[0];
  if (!existsSync(path)) failures.push(`Project index points to missing file: ${path}`);
}

const replitConfig = readFileSync(".replit", "utf8");
const nodeVersion = readFileSync(".nvmrc", "utf8").trim();
if (!/^\d+$/.test(nodeVersion)) {
  failures.push(".nvmrc must contain one Node.js major version number");
} else {
  const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
  if (!new RegExp(`node-version:\\s*${nodeVersion}\\s*(?:#.*)?$`, "m").test(workflow)) {
    failures.push(`GitHub Actions must use the Node.js ${nodeVersion} major from .nvmrc`);
  }
  const replitNix = readFileSync("replit.nix", "utf8");
  if (!new RegExp(`pkgs\\.nodejs-${nodeVersion}_x\\b`).test(replitNix)) {
    failures.push(`replit.nix must install Node.js ${nodeVersion}.x from .nvmrc`);
  }
  const flake = readFileSync("flake.nix", "utf8");
  if (!new RegExp(`pkgs\\.nodejs_${nodeVersion}\\b`).test(flake)) {
    failures.push(`flake.nix must provide Node.js ${nodeVersion}.x for local development`);
  }
  const release = flake.match(/nixpkgs\.url\s*=\s*["']github:NixOS\/nixpkgs\/nixos-(\d{2})\.(\d{2})["']/);
  if (!release) {
    failures.push("flake.nix must pin a NixOS release branch");
  } else {
    const channel = `stable-${release[1]}_${release[2]}`;
    if (!new RegExp(`channel\\s*=\\s*["']${channel}["']`).test(replitConfig)) {
      failures.push(`.replit Nix channel must match flake.nix (${channel})`);
    }
    const lock = JSON.parse(readFileSync("flake.lock", "utf8"));
    if (lock.nodes?.nixpkgs?.original?.ref !== `nixos-${release[1]}.${release[2]}`) {
      failures.push("flake.lock must pin the Nixpkgs release selected by flake.nix");
    }
  }
}

for (const [label, pattern] of [
  ["development command", /^run\s*=\s*["']npm run dev["']\s*$/m],
  ["deployment build command", /^build\s*=\s*["']npm ci && npm run build["']\s*$/m],
  ["deployment start command", /^run\s*=\s*["']npm start["']\s*$/m],
]) {
  if (!pattern.test(replitConfig)) failures.push(`.replit is missing the expected ${label}`);
}

const trackedDist = execFileSync("git", ["ls-files", "dist"], { encoding: "utf8" }).trim();
if (trackedDist) failures.push("Generated dist/ output is tracked by Git");

for (const retired of ["server/github-client.ts", "server/github-push.ts"]) {
  if (existsSync(retired)) failures.push(`Retired reverse-sync path still exists: ${retired}`);
}

function sourceFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) files.push(...sourceFiles(path));
    else if ([".js", ".jsx", ".ts", ".tsx"].includes(extname(path))) files.push(path);
  }
  return files;
}

function trackedMarkdownFiles() {
  return execFileSync("git", ["ls-files", "-z", "--", "*.md"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
}

const assetPattern = /["']@assets\/(.+?)["']/g;
for (const sourcePath of sourceFiles("client")) {
  const source = readFileSync(sourcePath, "utf8");
  for (const match of source.matchAll(assetPattern)) {
    const assetPath = join("attached_assets", match[1]);
    if (!existsSync(assetPath)) failures.push(`${sourcePath} imports missing ${assetPath}`);
  }
}

const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
for (const markdownPath of trackedMarkdownFiles()) {
  const markdown = readFileSync(markdownPath, "utf8");
  for (const match of markdown.matchAll(linkPattern)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const filePart = decodeURIComponent(target.split("#", 1)[0]);
    if (!filePart) continue;
    const resolved = resolve(dirname(markdownPath), filePart);
    if (!existsSync(resolved)) failures.push(`${markdownPath} links to missing ${target}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Repository structure and source-asset checks passed.");
