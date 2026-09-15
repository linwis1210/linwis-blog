# AGENTS.md

Project-level governance for all agents working in this repository.

## Core Principles

1. **Controlled Autonomy**  
   Agents should work autonomously within approved product goals, architecture, and project rules. Escalate only when a protected user decision is required.

2. **Clear Responsibility and Independent Verification**  
   Leader coordinates, Builder implements, and Verifier independently reviews. Agents must not redefine or expand their own authority.

3. **Risk-Proportional Process**  
   Use the lightest process that is safe for the work. Higher-risk work requires stronger planning and verification; trivial work should not inherit unnecessary ceremony.

4. **Evidence Over Claims**  
   Completion must be supported by real evidence. Agent statements alone do not establish that work is complete.

5. **Controlled Change**  
   Do not change requirements, acceptance criteria, validation logic, governance, or protected boundaries merely to make an implementation pass.

6. **Single Source of Truth**  
   Keep each kind of project information in its proper authoritative source. Avoid maintaining duplicate rules or duplicate project truth.

7. **Evidence-Based Evolution**  
   Improve the workflow from observed failures and useful evidence, not from preference or theoretical completeness.

8. **Minimal Sufficiency**  
   Use the simplest process that safely satisfies the current need. Avoid unnecessary roles, documents, matrices, abstractions, contracts, and edge-case machinery. Complexity must be earned by evidence.

## Project Source of Truth

Authoritative project documents at their established locations:

- Product requirements: `docs/REQUIREMENTS.md`
- Architecture and technical constraints: `docs/ARCHITECTURE.md`
- Long-term planning and task backlog: `docs/TASKS.md`
- Design system (Quiet Engineering): `DESIGN.md` (project root; also referenced by `src/config/effects.ts`)
- Project overview and writing guide: `README.md`
- Role definitions: `.agents/roles/leader.md`, `.agents/roles/builder.md`, `.agents/roles/verifier.md`
- Task Records (execution truth, organized by TASKS.md phase): `.agents/tasks/` — conventions in `.agents/tasks/README.md`; archived records under `.agents/tasks/archive/` are excluded from subagent context by default
- Temporary workspace for intermediate artifacts (gitignored): `.agents/tmp/`

## Roles

This workflow uses three fixed roles:

- **Leader**
- **Builder**
- **Verifier**

Role definitions live in:

- `.agents/roles/leader.md`
- `.agents/roles/builder.md`
- `.agents/roles/verifier.md`

Each agent execution context must have an explicitly assigned role and read this file and its complete role file before acting. A runtime execution unit or subagent does not create a new role; it operates within the authority of its assigned role and scope.

## User Authority

The user may provide new requirements at any time.

Explicit user-directed requirement changes may legitimately trigger replanning, documentation updates, task changes, architecture review, or a new Validation Contract.

Agents must not use frozen plans or validation rules to block a user-directed change.

Agents must not unilaterally change:

- product scope;
- core architecture;
- user approval boundaries;
- protected project governance.

Changes to project-level core principles must always be disclosed to the user. Changes that alter their meaning or authority require user approval.

## Validation

Formal Features require verification in an execution context independent of the implementation context before objective acceptance. A Builder cannot satisfy this requirement by relabeling its own context as Verifier.

Agent judgment may determine readiness for validation, but formal PASS/FAIL must be based on deterministic, reproducible, or objectively measurable evidence.

Validation standards must not be weakened merely to make an implementation pass.
