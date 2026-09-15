---
name: agent-workflow-setup
description: Initialize a minimal, self-contained multi-agent software-development workflow in a new or existing project. Inspect the project safely, normalize project documentation, generate AGENTS.md plus Leader/Builder/Verifier role files, preserve legacy material, and hand off to a Leader session. Use for one-time workflow setup only; do not use for ongoing workflow maintenance or application development.
---

# Agent Workflow Setup

Create a minimal, project-local multi-agent workflow that remains usable after this skill is no longer available.

The setup is intentionally narrow:

- set up workflow governance and role files;
- organize existing project documentation;
- preserve legacy information;
- prepare a clean handoff to the first Leader session.

Do **not** perform application development, ongoing workflow maintenance, or project planning beyond what is necessary to establish the workflow.

## Core Setup Principles

- Inspect before creating.
- Preserve existing intent.
- Normalize ownership, not every internal detail.
- Prefer adaptation over replacement.
- Never delete legacy information during setup.
- Never overwrite conflicting uncommitted work.
- Do not modify application behavior.
- Do not create files or directories merely for completeness.
- Keep generated governance minimal.
- One plan, one approval, then autonomous execution.
- Fail safely and report partial progress.
- The generated workflow must be self-contained and must not depend on this skill afterward.

## 1. Resolve the Target Project Root

Infer the most likely project root from the current working context.

Useful signals include:

- Git repository root;
- README files;
- project manifests such as `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`;
- existing source directories;
- existing project documentation.

Do not silently operate in a guessed directory.

The proposed target root must appear in the Setup Plan and must be approved by the user before structural changes are made.

## 2. Progressive Inspection

Inspect only enough project context to set up the workflow.

Start with:

- project-root contents;
- Git state, if Git is present;
- README;
- existing `AGENTS.md` or `CLAUDE.md`;
- existing `docs/`;
- obvious Markdown documentation;
- PLAN, TODO, ROADMAP, TASKS, PRD, design, architecture, or similar files;
- primary project manifests/configuration.

Inspect application code or Git history only when needed to understand documentation, identify the project state at a coarse level, or avoid an unsafe migration.

Do not perform a full project audit.

## 3. Git Safety

If the project is a Git repository, inspect:

- current branch;
- working-tree status;
- files tracked by Git that may be moved or rewritten.

Do not initialize Git.

Do not create commits.

If uncommitted changes exist:

- continue when setup operations clearly do not overlap those changes;
- stop the conflicting operation when setup would touch or overwrite them;
- report the conflict to the user.

Use Git-aware moves when appropriate, but preserve content over history cosmetics.

## 4. Discover Existing Project Documentation

Use these defaults when the project has no established documentation ownership:

```text
docs/
├── REQUIREMENTS.md
├── ARCHITECTURE.md
└── TASKS.md
```

Preserve established authoritative document and task locations. Record their actual paths in a short source-of-truth index in the generated `AGENTS.md`, and adapt all generated role files and the handoff prompt consistently. Do not create parallel sources merely to match these defaults.

Interpret documents by approximate meaning, not filename alone.

Typical mapping:

- product intent, behavior, scope, PRD content -> `docs/REQUIREMENTS.md`;
- technical design, system structure, architectural constraints -> `docs/ARCHITECTURE.md`;
- roadmap, milestones, backlog, long-term plan -> `docs/TASKS.md`.

### Existing canonical documents

Identify authoritative sources from the user's current instructions, then explicit project governance/indexes, then documented approval and supersession relationships. Location or filename alone does not establish authority. If authority remains unclear, preserve the alternatives for Leader review.

Legacy documents may supplement clearly missing, non-conflicting information.

Do not resolve substantive conflicts between canonical documents and legacy material. Preserve the conflict for Leader review.

### When canonical documents are missing

If reliable project facts exist, create only a minimal document grounded in those facts.

Do not invent future requirements, architecture, or tasks. Label facts inferred from code as observed implementation, not approved requirements.

If the project contains too little information, do not create empty `REQUIREMENTS.md`, `ARCHITECTURE.md`, or `TASKS.md`. Create `docs/` only when needed and clearly tell the user which core documents could not be established.

## 5. Legacy Plans, Tasks, and Notes

Existing PLAN/TODO/ROADMAP/TASKS-like material requires coarse semantic handling only.

- long-term planning information may be consolidated into `docs/TASKS.md`;
- detailed historical implementation plans should normally be preserved for later Leader review rather than converted directly into active Task Records;
- mixed or ambiguous historical notes should not be aggressively split.

Never delete the original legacy document during setup.

When legacy material has been integrated or superseded, move the original into `docs/archive/`.

Use the project's existing archive location, or `docs/archive/` if none is established. Create it only when needed. Preserve source content and distinguish colliding archive names; never overwrite another archive. On a rerun, inspect completed setup work and skip already established migrations rather than creating duplicates.

The Leader, not this setup skill, reconstructs real task completion state after reading the full project.

## 6. Existing Agent Rules and Existing `.agents/`

If the project already contains agent instructions or workflow structures, do not overwrite them blindly.

Examples include:

- `AGENTS.md`;
- `CLAUDE.md`;
- old agent instruction files;
- existing `.agents/` contents.

Apply the rule:

> Preserve intent; normalize ownership.

Classify useful existing rules by responsibility:

- project-wide agent governance -> `AGENTS.md`;
- product requirements -> `docs/REQUIREMENTS.md`;
- technical constraints -> `docs/ARCHITECTURE.md`;
- stable role-specific authority or limits -> the relevant role file.

Archive superseded legacy instruction files under `docs/archive/`; do not delete them.

For an existing `.agents/`, use minimal standardization:

- preserve compatible working structure;
- establish the stable role entry points when needed;
- add only missing workflow structure that has immediate use;
- do not reorganize internal details simply to make every project look identical.

Standardize the interface, not every internal detail.

## Codex Directory Convention

Use `.agents/` as the project-local workflow directory.

Codex automatically discovers repository-scoped skills from `.agents/skills/`. Other workflow files under `.agents/`, such as role definitions and task records, are not assumed to be auto-loaded; agents must read them explicitly when required by `AGENTS.md`, their assigned role, or the current task.

## 7. Setup Structure

The minimal default setup is:

```text
/
├── AGENTS.md
├── docs/                       # only as needed
└── .agents/
    └── roles/
        ├── leader.md
        ├── builder.md
        └── verifier.md
```

Do not create these during setup unless they already exist for a legitimate reason:

```text
.agents/tasks/active/
.agents/tasks/archive/
.agents/hooks/
.agents/reports/
```

The Leader creates task directories, including the default `.agents/tasks/`, only when the first real Task Record needs them, and other infrastructure only when justified. Follow existing project locations.

Do not create `.gitkeep`.

Do not create a project temporary workspace. The Leader chooses a project-specific temporary/intermediate workspace later if needed.

Do not create specialist-role directories, agent registries, capability registries, metrics directories, governance directories, or other speculative structure.

## 8. Templates

Use the stable templates packaged with this skill:

```text
templates/
├── AGENTS.md
├── leader.md
├── builder.md
└── verifier.md
```

Keep the stable governance and role boundaries intact.

Adapt only what is necessary to integrate with existing project intent.

Do not inject project-specific product or architecture rules into role templates. Put those in their proper project sources of truth.

## 9. Claude Code Adapter

Create `CLAUDE.md` only when Claude Code usage is clearly detected or explicitly requested.

Prefer:

```text
CLAUDE.md -> AGENTS.md
```

as a symbolic link when the operating system, filesystem, and Git configuration support symlinks reliably.

If symlinks are unsupported or unreliable:

1. explicitly inform the user;
2. do not silently downgrade;
3. create the smallest supported adapter that references `AGENTS.md`;
4. state clearly that `AGENTS.md` remains the canonical governance source and governance edits must be made there.

Do not create synchronization scripts.

## 10. References Affected by Migration

When documents are moved:

- search for references to the specific paths proposed for migration;
- update obvious and safe documentation references;
- update clear agent-instruction references to moved documents;
- if scripts, CI, or application behavior depend on an old path and the dependency cannot be safely handled within setup scope, retain that path and defer the migration.

Any potentially broken or unresolved references must be called out:

- in the Setup Plan when known before execution;
- in the completion summary;
- in the Leader Bootstrap Prompt when the Leader may need to resolve them.

Do not add workflow advertising sections to project README files.

## 11. Setup Plan

Before modifying project structure, present one concise plan and wait for user approval.

Use this shape:

```text
Target project root:
...

Create:
- ...

Migrate:
- ...

Archive:
- ...

Warnings / Git state:
- ...
```

Include:

- proposed root;
- files/directories to create;
- document migrations;
- legacy archives;
- existing-agent-rule integration;
- Git conflicts or dirty-state concerns;
- references that may become unresolved;
- Claude adapter behavior when applicable.

Do not produce a verbose migration matrix or full diff unless the user asks.

After approval, execute autonomously.

## 12. Execution Boundaries

The setup skill may inspect application code when needed for understanding.

It must not:

- modify application behavior;
- fix business bugs;
- refactor product code;
- upgrade dependencies;
- alter application tests as development work;
- create application source structure;
- reorganize application directories;
- start product implementation;
- promote itself to the Leader role.

Bootstrap owns workflow setup, not application development.

## 13. Failure Handling

Do not build a filesystem transaction or rollback framework.

Instead:

- preserve original information until migration is safely established;
- never delete legacy source material;
- stop dependent operations after a relevant failure;
- report what succeeded, what failed, and what was not executed;
- preserve the current Git/file state clearly.

If a partial failure affects Leader takeover, include it in the Leader Bootstrap Prompt.

## 14. Minimal Verification

After setup, verify only that the approved setup was safely established.

Check:

- target root is correct;
- required generated role files exist and are non-empty;
- `AGENTS.md` exists and is non-empty;
- approved migrations/archives occurred;
- no legacy file was unintentionally deleted;
- conflicting uncommitted work was not overwritten;
- missing core project documents are clearly identified;
- generated references resolve or are explicitly marked missing;
- role authority, validation responsibilities, and completion rules agree across generated files;
- existing protected rules retain their meaning after integration.

Do not build a second validation system for setup itself.

## 15. Completion Output

Do not create a bootstrap report file.

Return a concise conversational summary with:

```text
Created:
...

Migrated:
...

Archived:
...

Skipped / Missing:
...

Warnings / Git state:
...
```

The final block must always be a self-contained **Leader Bootstrap Prompt**.

All unresolved findings that the Leader needs must be embedded inside that prompt itself, because the user may copy only the prompt.

### Leader Bootstrap Prompt

Generate a project-specific prompt with this shape. Resolve paths before delivery, and replace the findings slot with actual findings or "None". Keep general execution rules in the generated role files.

```text
You are the Leader for this project.
Project root: [resolved absolute project root]

Read and follow:
- [actual AGENTS.md path]
- [actual Leader role path]

Use the source-of-truth index in AGENTS.md to find project documents and Task Records.

On initial takeover:
1. reconstruct the project's current phase and real progress from relevant documents, code, Git evidence, and archived plans; distinguish completed, active, unfinished, and obsolete work;
2. organize Task Records at the project's designated location, creating directories only when needed;
3. discover available skills, tools, plugins, and agent-runtime capabilities; load detailed instructions only when relevant;
4. coordinate the next work within approved goals and the Leader role. If a required execution context is unavailable, provide the handoff specified in that role.

Unresolved setup findings:
[Missing documents, conflicting sources, possible documentation/code drift, Git concerns, deferred migrations, unresolved references, and partial failures needed for takeover.]
```

Do not automatically become the Leader after emitting this prompt.
