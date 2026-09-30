import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const failures = [];

for (const required of [
  "AGENTS.md",
  "README.md",
  ".replit",
  "docs/PRD.md",
  "docs/DECISION_LOG.md",
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

function markdownFiles(root) {
  const ignored = new Set([".git", "node_modules", "dist", ".local-sources"]);
  if (!existsSync(root)) return [];
  const files = [];
  for (const name of readdirSync(root)) {
    if (ignored.has(name)) continue;
    const path = join(root, name);
    if (statSync(path).isDirectory()) files.push(...markdownFiles(path));
    else if (extname(path) === ".md") files.push(path);
  }
  return files;
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
for (const markdownPath of markdownFiles(".")) {
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
