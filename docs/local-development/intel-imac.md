# Local development on the Intel iMac

## Scope

This note applies only to the user's older Intel desktop iMac during local macOS work. Use it only when the shell reports Darwin from uname -s and x86_64 from uname -m, and the task is running on that physical iMac. Do not apply it to the user's newer MacBook, Replit, Linux, GitHub Actions, or another computer. If the device is uncertain, ask which machine is being used.

Do not store or use a MAC address, serial number, account name, or IP address to identify this computer in repository instructions.

## Confirmed setup facts from 2026-10-06

- A GitHub CLI clone of ArboraPartnersWebsite completed successfully at the visible Desktop path ~/Desktop/Arbora website. The folder now exists. Do not run the clone setup again or overwrite it; inspect its current Git state first.
- Homebrew reported this host as Intel x86_64 and warned that its support is limited for this configuration and that it builds without bottles. The targeted gh upgrade from 2.101.0 to 2.102.0 completed successfully by building from source. This warning did not prevent the repository clone.
- Homebrew also reported many outdated formulae. Do not run a broad brew upgrade as routine setup. Upgrade or install only a required tool after checking whether the current macOS can use it.
- The Command Line Tools notice did not block the clone or gh upgrade. Do not remove or reinstall Command Line Tools, upgrade macOS, or change hardware based only on that notice. In particular, do not run a suggested sudo rm -rf command unless a real toolchain failure is confirmed and the human has reviewed the recovery plan.

Recheck current versions and support when needed; these are a dated observation, not permanent version guarantees.

## Safe Terminal habits for this iMac

- The Terminal opens in the home folder. A relative path such as ./scripts/check.sh works only after changing into the repository root. This is the issue documented in [GreenElephantOS PR #29](https://github.com/Esteve32/GreenElephantOS/pull/29).
- For ArboraPartnersWebsite, the expected root is ~/Desktop/Arbora website. Quote paths because the folder name contains a space. Before working, confirm pwd and git rev-parse --show-toplevel, then inspect git status --short --branch and git branch -vv.
- A missing script path means the file is not at that location. Check the exact Finder/download path before running bash; a downloaded setup script is separate from the cloned project folder.
- The zsh startup notice about changing shells is informational. Do not run chsh just to use a script with bash.
- If the prompt changes to a continuation prompt such as > while pasting a multiline command, press Ctrl+C once to cancel the incomplete input, then restart with a clean command. Do not assume an incomplete pasted block ran.
- Chat may render URLs as Markdown links. Do not paste linkified Markdown into shell code. Prefer short plain-text commands or a downloaded script file, and inspect the file path before running it.

## Keep local and repository toolchains separate

- Follow the toolchain pinned by the active repository. Do not change package manifests or lockfiles just to compensate for this iMac's older operating system. If the local OS cannot run a required tool, report that limit and use the repository's documented CI or remote environment where suitable.
- ArboraPartnersWebsite uses Node.js 20 in its Replit and GitHub Actions configuration. Use its lockfile and npm ci; do not use a global npm upgrade as a substitute for its pinned project toolchain.
- GreenElephantorg has a shared Nix development shell for x86_64-darwin and an .nvmrc fallback for Node.js 24. Follow its current environment guide and check whether Nix is supported on this host before using it. Its merged cross-device precedent is [GreenElephantorg PR #28](https://github.com/Esteve32/GreenElephantorg/pull/28).
- ArboraOSv0.1 currently has scripts that hardcode Apple Silicon Homebrew paths under /opt/homebrew, while this iMac's Homebrew installation reported the Intel prefix /usr/local. Do not run bootstrap_notion_sync.sh or the default VS Code task on this iMac as-is. First use command -v python3 and python3 --version, then choose a project-compatible interpreter. Any portability fix belongs in a reviewed PR; do not create global symlinks or use sudo by default.
- GreenElephantOS has no single runtime for every folder. Read its environment guide and the selected project's own setup guide. Its README's ge-check alias uses a Documents path; if this checkout is elsewhere, resolve the actual Git root before changing or using that alias.

## Preserve the working copy

- The Desktop clone is the single Arbora website working root. Confirm its path and branch before every local check. If it contains changes or local-only commits, preserve them and report them; do not reset, clean, force-push, overwrite, or reclone.
- A clone completing does not prove which commit is checked out. Verify main and compare it with origin/main before starting code changes. The known PR #8 merge commit is 5dc1a608f93cfccfbd867d9cb19ef58f78a63e9.
- Use a named feature branch and a GitHub pull request. GitHub Actions validates the Arbora website; Replit publication remains a separate human-controlled step.

## Prior device-specific precedents

- [GreenElephantOS PR #25](https://github.com/Esteve32/GreenElephantOS/pull/25) separated completed MacBook Pro work from the iMac-only steps.
- [GreenElephantOS PR #29](https://github.com/Esteve32/GreenElephantOS/pull/29) replaced fragile home-folder relative paths with a full path or alias.
- [GreenElephantorg PR #28](https://github.com/Esteve32/GreenElephantorg/pull/28) pinned a cross-device runtime and documented a version-manager fallback.
