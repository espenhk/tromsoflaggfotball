# Agent config

## Public repo — no secrets, no personal data

This repository is intended to be publishable as **public** at any time.
Never commit anything that would be unsafe or embarrassing to expose:

- No API keys, tokens, service-role keys, database passwords, signing
  secrets, private URLs, or any credential. Runtime secrets go through
  Lovable's secret storage, not into source files or committed `.env`.
- No personal information about real people (emails, phone numbers,
  addresses, birthdates, private chat logs, unredacted signup exports).
  Example/mock data must be clearly fake.
- No private plans, internal notes, or strategy docs — see `plans/` below.
- No licensed assets that aren't cleared for redistribution (fonts already
  handled in `.gitignore`).

If unsure whether something is safe to commit, treat it as unsafe.

## `plans/` folder — local-only stored plans

`plans/` is git-ignored. It holds markdown files with reusable instructions
or task specs the user wants to keep locally but not sync to the repo
(they count as "secret" under the public-repo rule above).

How to use it:

- The user can drop a plan into `plans/<name>.md` and later ask the agent
  to "run the plan in `plans/<name>.md`" or just point at the folder.
- When asked to execute a stored plan, read the referenced file from
  `plans/` and follow it as if the user had pasted its contents into chat.
- Never move a plan file into a tracked location, and never quote large
  sections of a plan into commit messages or code comments that would end
  up in git.
