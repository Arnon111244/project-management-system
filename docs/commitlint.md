# Commit message linting

This repo enforces Conventional Commits via commitlint + husky.

## Why

- Consistent commit history across apps/packages
- Better `CHANGELOG` and release automation compatibility

## Quick usage

- No extra step: commit as usual and the commit message will be validated automatically.
- If the hook fails, edit your message to follow the format and re-run the commit.

## Format

```
<type>(<scope>): <subject>

```

- type: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- scope: optional; e.g. `web`, `mobile`, `ui`, `api`, `state`, `localization`, `shared_mono_app`
- subject: short imperative description

## Examples

- `feat(web): add OTP screen route guards`
- `fix(mobile): prevent splash deadlock on font load error`
- `refactor(ui): centralize SvgIcon tinting logic`
- `chore(repo): bump Turbo to ^2`

## Skipping lint (not recommended)

Use `--no-verify` on `git commit` if you must bypass hooks.

```sh

```
