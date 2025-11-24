# BlackRoad OS Pack: Education

The Education Pack provides plug-and-play agents, workflows, and starter data
for designing courses, aligning assessments, and supporting learner success.
It is designed to slot into any BlackRoad OS deployment alongside the pack
index and Agent Catalog.

## What is included
- Agent implementations for syllabus design, assessment creation, and student
  success monitoring.
- Workflows for launching courses and running continuous improvement cycles.
- Example curricula and rubric data to help teams get started quickly.
- CI pipeline and validation scripts for pack consistency.

## Relationship to BlackRoad OS
This pack depends on `blackroad-os-api` and `blackroad-os-core` for routing
agent calls and workflow execution. It is console-ready for
`blackroad-os-prism-console`, where learner progress signals and risk flags can
be surfaced to operators.

## Installation / Registration
1. Add `pack.yaml` to your BlackRoad pack index or registry.
2. (Optional) Run `./scripts/install.sh /srv/blackroad` to scaffold a target
   directory and copy core metadata.
3. Ensure the Agent Catalog references the included agent metadata files in
   `agents/*.agent.yaml`.

## Usage: Launching a course
- Trigger the `course_launch` workflow with a payload containing `goals` and
  optional `constraints`. The workflow will sequence syllabus design,
  assessment generation, and success monitoring setup.
- For iteration, run `continuous_improvement` with updated learner outcomes to
  refresh objectives and assessments.

## Wiring Student Success Bot into events
- Stream learner events (logins, scores, submissions) into
  `edu-student-success-bot-01` using your messaging or event pipeline.
- Use the returned risk profiles and intervention plans to drive notifications
  or human follow-up via Prism dashboards.

## Running tests
- Python: `pytest`
- TypeScript: `npm run test:ts` (Vitest)
- YAML validation: `npm run lint:yaml`
