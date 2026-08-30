import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const DECISION_LOG = resolve(process.cwd(), "docs/DECISION_LOG.md");
const LEDGER_MARKER = "<!-- DECISION_LEDGER_ROWS -->";

function readArgument(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function localIsoTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offset = `${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(absoluteOffset % 60)}`;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${offset}`;
}

function incrementVersion(version, level) {
  const [major, minor, patch] = version.split(".").map(Number);

  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function safeCell(value) {
  return value.replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();
}

const summary = readArgument("summary");
const approvedBy = readArgument("approved-by");
const level = readArgument("level") ?? "patch";

if (!summary || !approvedBy) {
  console.error(
    "Usage: npm run decision:record -- --summary \"Approved change\" --approved-by \"Name\" [--level patch|minor|major]",
  );
  process.exit(1);
}

if (!new Set(["patch", "minor", "major"]).has(level)) {
  console.error("--level must be patch, minor, or major");
  process.exit(1);
}

let document = await readFile(DECISION_LOG, "utf8");
const versionMatch = document.match(/\*\*Document Version:\*\* `(\d+\.\d+\.\d+)`/);

if (!versionMatch || !document.includes(LEDGER_MARKER)) {
  console.error("Decision log metadata or ledger marker is missing; refusing to write.");
  process.exit(1);
}

const previousVersion = versionMatch[1];
const nextVersion = incrementVersion(previousVersion, level);
const timestamp = localIsoTimestamp();
const ledgerRow = `| ${nextVersion} | ${timestamp} | ${safeCell(approvedBy)} | ${safeCell(summary)} |`;

document = document
  .replace(
    /^(# 💞 MyFive — Approved Product Decision Log v)\d+\.\d+\.\d+( \(Δ Update\) — Drift-Safe \/ Canonical Source)$/m,
    `$1${nextVersion}$2`,
  )
  .replace(/\*\*Document Version:\*\* `\d+\.\d+\.\d+`/, `**Document Version:** \`${nextVersion}\``)
  .replace(/\*\*Last Updated:\*\* `[^`]+`/, `**Last Updated:** \`${timestamp}\``)
  .replace(LEDGER_MARKER, `${LEDGER_MARKER}\n${ledgerRow}`);

await writeFile(DECISION_LOG, document, "utf8");
console.log(`Recorded decision-log version ${nextVersion} at ${timestamp}.`);
