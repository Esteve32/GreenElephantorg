import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, join } from "node:path";

function filesUnder(root) {
  const files = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) files.push(...filesUnder(path));
    else files.push(path);
  }
  return files.sort();
}

function evidence(path) {
  const content = readFileSync(path);
  return {
    path: path.replaceAll("\\", "/"),
    bytes: content.byteLength,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}

function sourceFiles(root) {
  return filesUnder(root).filter((path) => /\.(?:js|jsx|ts|tsx)$/.test(path));
}

const sources = sourceFiles("client").map((path) => [path, readFileSync(path, "utf8")]);
const assets = filesUnder("attached_assets").map((path) => {
  const asset = evidence(path);
  const importName = relative("attached_assets", path).replaceAll("\\", "/");
  return {
    ...asset,
    used_by: sources
      .filter(([, content]) => content.includes(`@assets/${importName}`))
      .map(([sourcePath]) => sourcePath.replaceAll("\\", "/")),
  };
});

mkdirSync("docs/evidence/manifests", { recursive: true });
writeFileSync(
  "docs/evidence/manifests/recovered-replit-assets.v1.json",
  `${JSON.stringify({
    schema_version: 1,
    source_repository: "Esteve32/GreenElephantorg",
    recovery_branch: "replit/reconcile-20260930",
    recovery_commit: "87ea3c3b8a99e6581c064cc7dad972c43bdb26c7",
    treatment: "Recovered build inputs only; no paused MY5 code was merged.",
    rights_status: "REVIEW_REQUIRED: repository presence and existing runtime use do not establish redistribution or reuse rights.",
    assets,
  }, null, 2)}\n`,
);

const screenshotRoot = "docs/evidence/screenshots/legacy-main-2026-09-02";
const screenshots = filesUnder(screenshotRoot).map(evidence);
writeFileSync(
  "docs/evidence/manifests/legacy-main-screenshots.v1.json",
  `${JSON.stringify({
    schema_version: 1,
    source_commit: "31f299c047d3d0fab80b8f33c7e049bc9fbbb2a4",
    status: "Historical visual captures; unverified; not release acceptance evidence.",
    screenshots,
  }, null, 2)}\n`,
);

console.log(`Recorded ${assets.length} assets and ${screenshots.length} screenshots.`);

