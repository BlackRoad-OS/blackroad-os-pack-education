#!/usr/bin/env node

/**
 * 🧬 Schema Validation Tests
 * Validates all content objects against their schemas
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Cache for compiled schemas to avoid re-compilation
const schemaCache = new Map();

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}: ${error.message}`);
    return null;
  }
}

function getValidator(schemaPath) {
  if (schemaCache.has(schemaPath)) {
    return schemaCache.get(schemaPath);
  }

  const schema = loadJSON(schemaPath);
  if (!schema) {
    return null;
  }

  // Create new Ajv instance for each schema to avoid $id conflicts
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  
  const validate = ajv.compile(schema);
  schemaCache.set(schemaPath, validate);
  return validate;
}

function testSchema(schemaPath, instancePath, description) {
  totalTests++;
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`   Schema: ${schemaPath}`);
  console.log(`   Instance: ${instancePath}`);

  const validate = getValidator(schemaPath);
  const instance = loadJSON(instancePath);

  if (!validate || !instance) {
    failedTests++;
    console.log(`   ❌ FAILED: Could not load files`);
    return false;
  }

  const valid = validate(instance);

  if (valid) {
    passedTests++;
    console.log(`   ✅ PASSED`);
    return true;
  } else {
    failedTests++;
    console.log(`   ❌ FAILED: Validation errors:`);
    validate.errors.forEach(err => {
      console.log(`      - ${err.instancePath || '/'}: ${err.message}`);
      if (err.params) {
        console.log(`        Params: ${JSON.stringify(err.params)}`);
      }
    });
    return false;
  }
}

console.log('🧬 ============================================');
console.log('🧬 Schema Validation Tests');
console.log('🧬 ============================================\n');

// Test course schema
testSchema(
  path.join(__dirname, '../schemas/course.schema.json'),
  path.join(__dirname, '../examples/intro-to-blackroad-os/course.json'),
  'Example course validates against course schema'
);

// Test lesson schema
testSchema(
  path.join(__dirname, '../schemas/lesson.schema.json'),
  path.join(__dirname, '../examples/intro-to-blackroad-os/lessons/philosophy-intro.lesson.json'),
  'Example lesson validates against lesson schema'
);

// Test lesson template
testSchema(
  path.join(__dirname, '../schemas/lesson.schema.json'),
  path.join(__dirname, '../templates/lesson-tutorial.template.json'),
  'Tutorial lesson template validates against lesson schema'
);

// Test activity schema
testSchema(
  path.join(__dirname, '../schemas/activity.schema.json'),
  path.join(__dirname, '../examples/intro-to-blackroad-os/activities/philosophy-reflection.activity.json'),
  'Example activity validates against activity schema'
);

// Test activity templates
testSchema(
  path.join(__dirname, '../schemas/activity.schema.json'),
  path.join(__dirname, '../templates/activity-quiz.template.json'),
  'Quiz activity template validates against activity schema'
);

testSchema(
  path.join(__dirname, '../schemas/activity.schema.json'),
  path.join(__dirname, '../templates/activity-project.template.json'),
  'Project activity template validates against activity schema'
);

testSchema(
  path.join(__dirname, '../schemas/activity.schema.json'),
  path.join(__dirname, '../templates/activity-reflection.template.json'),
  'Reflection activity template validates against activity schema'
);

// Test rubric schema
testSchema(
  path.join(__dirname, '../schemas/rubric.schema.json'),
  path.join(__dirname, '../templates/rubric-project.template.json'),
  'Project rubric template validates against rubric schema'
);

// Test tutor agent schema
testSchema(
  path.join(__dirname, '../schemas/tutor-agent.schema.json'),
  path.join(__dirname, '../agents/explainer-tutor.json'),
  'Explainer tutor validates against tutor-agent schema'
);

testSchema(
  path.join(__dirname, '../schemas/tutor-agent.schema.json'),
  path.join(__dirname, '../agents/socratic-coach.json'),
  'Socratic coach validates against tutor-agent schema'
);

testSchema(
  path.join(__dirname, '../schemas/tutor-agent.schema.json'),
  path.join(__dirname, '../agents/grader-assistant.json'),
  'Grader assistant validates against tutor-agent schema'
);

// Test flow schema
testSchema(
  path.join(__dirname, '../schemas/flow.schema.json'),
  path.join(__dirname, '../flows/start-course.flow.json'),
  'Start course flow validates against flow schema'
);

testSchema(
  path.join(__dirname, '../schemas/flow.schema.json'),
  path.join(__dirname, '../flows/resume-learning.flow.json'),
  'Resume learning flow validates against flow schema'
);

testSchema(
  path.join(__dirname, '../schemas/flow.schema.json'),
  path.join(__dirname, '../flows/review-and-revise.flow.json'),
  'Review and revise flow validates against flow schema'
);

// Summary
console.log('\n🧬 ============================================');
console.log('🧬 Test Summary');
console.log('🧬 ============================================');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${failedTests}`);
console.log('🧬 ============================================\n');

process.exit(failedTests > 0 ? 1 : 0);
