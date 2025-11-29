# 🎓 BlackRoad OS - Education Pack

**Turn BlackRoad OS into a teaching & learning engine.**

The Education Pack enables BlackRoad OS to power structured learning experiences - from simple tutorials to comprehensive courses to regulated compliance training.

## 🎯 Mission

- Encode courses, lessons, labs, and feedback loops as structured flows
- Make it easy to teach *anything* (coding, math, finance, compliance, etc.)
- Enable human + agent collaboration in education
- Ensure learning progress is trackable, auditable, and meaningful

## 📦 What's Inside

### 📚 Learning Flows
Structured flows for learning journeys:
- **Start a course** - Initialize learner enrollment with prerequisite checks
- **Resume learning** - Pick up where you left off
- **Review & revise** - Revisit content for mastery

See: `/flows/`

### 🧬 Content Schemas
JSON schemas defining the structure of educational content:
- **Course** - Complete course structure with modules and outcomes
- **Lesson** - Individual lesson with content and activities
- **Activity** - Learning activities (quizzes, projects, reflections, labs)
- **Assessment** - Formal evaluations with questions and scoring
- **Rubric** - Evaluation criteria for grading
- **Progress** - Learner progress tracking with state management

See: `/schemas/`

### 📊 Progress States
Learning progress follows a clear state machine:
```
not-started → in-progress → completed → mastered
```

- **No skipping allowed** - Each state must be earned
- **Retry supported** - Can retry from completed → in-progress
- **Mastery is permanent** - Once mastered, always mastered (in history)

See: `/docs/progress-states.md`

### 📓 Templates
Ready-to-use templates for creating content:
- **Lesson templates** - Tutorial, lecture, lab formats
- **Activity templates** - Quiz, project, reflection activities
- **Rubric templates** - Project, participation, checklist rubrics
- **Course playbook** - Guide for converting existing content to courses

See: `/templates/`

### 🤖 Tutor & Coach Agents
Pre-configured agents for learning support:

- **Explainer Tutor** - Clear explanations and concept clarification
- **Socratic Coach** - Question-driven learning and critical thinking
- **Grader Assistant** - Rubric-based grading support (requires human approval)

**Guardrails:**
- 🚫 No access to learner PII
- 🧍‍♀️ Cannot auto-pass learners without rubric
- 💬 Must provide constructive next steps in all feedback

See: `/agents/`

### 📊 Integration Points

#### 🕹️ Prism Console (Dashboards)
- Learning progress visualization
- Course catalog
- Achievement tracking
- Learning streaks

#### 🧾 Archive (Compliance)
- Completion records
- Certificates
- Required training audit trails
- Compliance-tagged course completion

#### 💼 Other Packs
- Finance Pack → Financial literacy courses
- Legal Pack → Compliance training
- Infra Pack → DevOps academy
- Any Pack can host courses

See: `/docs/integrations.md`

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

Individual test suites:
```bash
npm run test:schemas    # Validate schemas
npm run test:states     # Test state transitions
npm run test:agents     # Validate agent configs
```

### 3. Create a Course

Use the course playbook as a guide:
```bash
cat templates/course-playbook.md
```

See example course:
```bash
cat examples/intro-to-blackroad-os/course.json
```

### 4. Validate Your Content
```bash
npm run validate
```

## 📖 Documentation

- **[Integration Guide](docs/integrations.md)** - How Education Pack connects to other systems
- **[Progress States](docs/progress-states.md)** - State transition rules and validation
- **[Course Playbook](templates/course-playbook.md)** - How to create courses

## 🎓 Example Course

The repository includes a complete example course: **Introduction to BlackRoad OS**

Location: `/examples/intro-to-blackroad-os/`

This course demonstrates:
- Multi-module structure
- Various lesson types
- Mixed activity formats
- Proper schema usage
- Integration points

## 🧪 Testing & Quality

### Schema Tests
✅ All content objects validate against schemas  
✅ Templates are valid instances  
✅ Required fields are enforced  

### Progress State Tests
✅ Valid transitions are allowed  
✅ Invalid transitions (skipping) are blocked  
✅ State metadata is preserved  
✅ Retry/review behaviors work correctly  

### Agent Configuration Tests
✅ All agents validate against schema  
✅ Guardrails are properly configured  
✅ No agent can auto-pass without rubric  
✅ All agents provide constructive feedback  
✅ Data access restrictions are enforced  

## 🔐 Safety & Ethics

Educational content can be sensitive:

- **No PII storage** - Use learner IDs, not personal information
- **Compliance tracking** - Required training flows are auditable
- **Agent boundaries** - Clear limits on what agents can do
- **Human oversight** - Critical decisions require human review
- **Privacy first** - Progress data protected, opt-in sharing

### Required Training Flows
Mark compliance-critical courses:
```javascript
// REQUIRED TRAINING FLOW – COMPLETION MUST BE AUDITABLE
{
  "metadata": {
    "complianceCategory": "security-training",
    "archiveRequired": true
  }
}
```

## 📏 Design Principles

### 1️⃣ Who is this for?
Every course/lesson clearly states:
- Target audience
- Required level
- Prerequisites

### 2️⃣ What will they achieve?
Clear learning outcomes:
- Skills to be gained
- Knowledge to be mastered
- Artifacts to be created

### 3️⃣ How is success measured?
Explicit evaluation:
- Rubrics for projects
- Passing scores for assessments
- Archive hooks for compliance
- Progress logged and visible

## 💼 Who Uses This?

### Teachers & Instructional Designers
Create structured courses with:
- Standard schemas for consistency
- Flexible content formats
- Built-in assessment tools
- Agent support for scaling

### Learners
Experience learning with:
- Clear progress tracking
- Immediate feedback from agents
- Retry and mastery paths
- Achievement recognition

### Pack Developers
Integrate domain-specific education:
- Finance courses in Finance Pack
- Legal training in Legal Pack
- Technical academies in Infra Pack

### Compliance Officers
Ensure required training:
- Audit trails in Archive
- Completion verification
- Certificate management
- Retention policies

## 🧬 Local Emoji Legend

- 💼 pack / vertical
- 🎓 learning / courses
- 📚 curriculum / modules
- 🧬 schemas / progress states
- 🤖 tutor/coach agents
- 📊 dashboards / progress
- 🧾 certificates / records
- ✅ rubrics / evaluation
- 🔁 flows / state machines
- 💬 feedback patterns
- 🧍‍♀️ human review required
- 🚫 forbidden / restricted

## 🏗️ Repository Structure

```
blackroad-os-pack-education/
├── schemas/              # 🧬 JSON schemas for all content types
│   ├── course.schema.json
│   ├── lesson.schema.json
│   ├── activity.schema.json
│   ├── assessment.schema.json
│   ├── rubric.schema.json
│   ├── progress.schema.json
│   ├── tutor-agent.schema.json
│   └── flow.schema.json
├── flows/                # 🔁 Learning flow definitions
│   ├── start-course.flow.json
│   ├── resume-learning.flow.json
│   ├── review-and-revise.flow.json
│   └── state-transitions.json
├── templates/            # 📓 Templates for content creation
│   ├── lesson-tutorial.template.json
│   ├── activity-quiz.template.json
│   ├── activity-project.template.json
│   ├── activity-reflection.template.json
│   ├── rubric-project.template.json
│   └── course-playbook.md
├── agents/               # 🤖 Tutor and coach agent configs
│   ├── explainer-tutor.json
│   ├── socratic-coach.json
│   └── grader-assistant.json
├── docs/                 # 📖 Documentation
│   ├── integrations.md
│   └── progress-states.md
├── tests/                # 🧪 Test suites
│   ├── schema-validation.test.js
│   ├── progress-states.test.js
│   ├── agent-config.test.js
│   └── run-all-tests.js
├── examples/             # 📚 Example courses
│   └── intro-to-blackroad-os/
│       ├── course.json
│       ├── lessons/
│       └── activities/
└── README.md             # This file
```

## 🤝 Contributing

When adding new content or features:

1. **Follow schemas** - All content must validate
2. **Test state transitions** - Ensure flows are valid
3. **Configure agents properly** - Guardrails are mandatory
4. **Document integrations** - Update integration docs
5. **Add examples** - Show how it works
6. **Run tests** - `npm test` before committing

## 📚 What This Pack DOES NOT Own

- ❌ Core app logic → `blackroad-os-core`
- ❌ UI shell → `blackroad-os-web`
- ❌ Workflow engine → `blackroad-os-operator`
- ❌ Brand system → `blackroad-os-brand`
- ❌ General docs → `blackroad-os-docs` / `blackroad-os-home`
- ❌ Research → `blackroad-os-research`

## 🎯 Success Criteria

You know this Pack is working when:

✅ A teacher can define a new course using standard schemas  
✅ Tutor/coach agents can be wired into courses safely  
✅ Learner progress is visible in dashboards (Prism Console)  
✅ Completion records are properly archived for compliance  
✅ State transitions follow the rules (no skipping)  
✅ All tests pass  

## 📄 License

MIT

## 🌟 Questions?

- See `/docs/` for detailed documentation
- Check `/examples/` for reference implementations
- Review `/templates/` for starting points
- Run tests to validate your work

---

**Built with 💚 by the BlackRoad OS Education Team**
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
