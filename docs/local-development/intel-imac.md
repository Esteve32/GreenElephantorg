# Local development on the Intel desktop Mac

## Scope: this desktop only

Apply this note only when the user identifies the current machine as their older Intel desktop/iMac. Check `uname -s`, `uname -m` and `sw_vers -productVersion` locally before choosing tools. Architecture alone does not identify a computer: an x86_64 process can also run under Rosetta. The exact macOS version has not yet been verified.

Do not apply these machine-specific workarounds to the user's newer laptop, Replit, Linux or CI. If the current device is unclear, ask desktop or laptop. Do not record IP/MAC addresses, serial numbers or the user's account name as a device identifier.

## Evidence from the user's 2026-10-05 terminal output

- Cloning ArboraPartnersWebsite into `~/Desktop/Arbora website` succeeded. Earlier missing-file messages concerned absent setup scripts. Do not repeat the clone or assume the remaining setup checks ran.
- The targeted `gh` upgrade from 2.101.0 to 2.102.0 succeeded by building from source. Homebrew reported Intel support/bottle limitations and used the prefix `/usr/local`. Those warnings did not prevent this operation.
- The Command Line Tools notice did not block that clone or upgrade. Preserve working tools. Do not remove Command Line Tools, change the login shell, install a different package manager or upgrade every Homebrew package merely to silence a notice.
- Check actual macOS/tool compatibility before a necessary installation. These are dated observations, not guarantees of future support.

## Terminal and Git habits

- Resolve this repository's existing checkout before running scripts. Use its actual Git root, quote paths containing spaces, and keep the user's preferred checkouts visible on the Desktop. Do not create a duplicate clone, relocate an existing checkout or assume a folder name for another repository.
- Before local work, inspect `pwd`, `git rev-parse --show-toplevel`, `git status --short --branch` and local branches. Confirm repository identity without displaying credential-bearing remotes. Preserve the current branch, uncommitted files, untracked files and local-only commits.
- Do not automatically switch to main, pull, reset, clean, force-push, stash or overwrite work during setup checks. Use a named feature branch and reviewed PR. Fetch only after checking the remote safely; fetching refreshes references, it does not update the checkout.
- A script path must exist before `bash` can run it. Terminal may start in the home directory; relative paths require changing to the right root first.
- The zsh startup banner is informational. Scripts can explicitly use Bash without changing the login shell. Keep copy-paste examples compatible with the installed shell.
- A `>` continuation prompt is normal while entering a multiline block. If it persists unexpectedly after the complete block, cancel incomplete input with Ctrl+C and inspect the paste. Do not paste Markdown link syntax or the terminal prompt as shell code.
- Prefer short fenced commands. Put fail-fast setup in a subshell or an actual script so `exit` and shell options do not unexpectedly close or change the interactive shell.
- Never dump environment variables, authentication state, credential files or raw remote URLs. Do not put tokens into commands, URLs or documentation. Follow root AGENTS.md for secret handling.
- Follow each project's current pinned runtime and lockfile. Do not rewrite dependencies merely to fit this desktop, substitute a global compiler, or assume Nix/version managers can bypass an unsupported OS. If a required runtime cannot run locally, use an appropriate supported remote environment and report the local limitation.

## This repository: Green Elephant website

- Locate this repository's own existing Desktop checkout; its exact folder name is unverified. Do not use the Arbora website folder as this repository's root.
- Read `docs/ENVIRONMENT.md`, `.nvmrc` and `flake.nix`. At this review the project pins Node.js 24. The Nix shell includes `x86_64-darwin`; `.nvmrc` provides the documented fallback for a suitable version manager. Verify host compatibility before installing either.
- Merged PR #28 records the cross-device build approach. Reuse the repository's environment rather than upgrading unrelated system packages or changing its lockfile to fit this desktop.
- Follow documented checks such as `npm ci` and `npm run repo:check` once the runtime is ready. Do not casually start `npm start`: it can activate scheduled work.
- Follow `docs/operations/replit-deployment.md` and the manual release reminder. Merging documentation is not evidence of a Replit publication. The OS repository has its own per-project runtimes.

## Verified repository precedents

- [GreenElephantOS PR #25](https://github.com/Esteve32/GreenElephantOS/pull/25), merged as `e95a36ae187a7c298b71b3105e2f6644bcde686f`: separate iMac and MacBook progress.
- [GreenElephantOS PR #29](https://github.com/Esteve32/GreenElephantOS/pull/29), merged as `4c2139d5866356c616c2bf972fa4e126c2a6a395`: resolve the real checkout before invoking scripts.
- [GreenElephantorg PR #28](https://github.com/Esteve32/GreenElephantorg/pull/28), merged as `4a0ce30db6a8e0f2f70d58ad0a7365f40e235fbe`: pinned cross-device development environment.

Keep this operational note separate from product requirements and approvals. Update it through review when verified machine or toolchain facts change.
