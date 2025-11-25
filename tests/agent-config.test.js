#!/usr/bin/env node

/**
 * 🤖 Agent Configuration Validation Tests
 * Ensures agent configs are valid and follow guardrails
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}: ${error.message}`);
    return null;
  }
}

function test(description, testFn) {
  totalTests++;
  console.log(`\n🧪 Testing: ${description}`);
  try {
    testFn();
    passedTests++;
    console.log(`   ✅ PASSED`);
    return true;
  } catch (error) {
    failedTests++;
    console.log(`   ❌ FAILED: ${error.message}`);
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🤖 ============================================');
console.log('🤖 Agent Configuration Validation Tests');
console.log('🤖 ============================================\n');

const agentSchema = loadJSON(path.join(__dirname, '../schemas/tutor-agent.schema.json'));
const validate = ajv.compile(agentSchema);

// Test each agent config
const agentsDir = path.join(__dirname, '../agents');
const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.json'));

agentFiles.forEach(agentFile => {
  const agentPath = path.join(agentsDir, agentFile);
  const agent = loadJSON(agentPath);
  
  test(`${agentFile} validates against schema`, () => {
    const valid = validate(agent);
    if (!valid) {
      console.log('   Validation errors:', JSON.stringify(validate.errors, null, 2));
    }
    assert(valid, 'Agent config must validate against schema');
  });

  test(`${agentFile} has proper guardrails`, () => {
    assert(
      agent.guardrails !== undefined,
      'Agent must have guardrails defined'
    );
    assert(
      typeof agent.guardrails.requiresHumanReview === 'boolean',
      'requiresHumanReview must be specified'
    );
    assert(
      typeof agent.guardrails.cannotPass === 'boolean',
      'cannotPass must be specified'
    );
  });

  test(`${agentFile} provides constructive feedback`, () => {
    assert(
      agent.guardrails.mustProvideNextSteps === true,
      'Agent must provide next steps in all feedback'
    );
  });

  test(`${agentFile} has data access restrictions`, () => {
    assert(
      agent.guardrails.dataAccessRestrictions !== undefined,
      'Agent must have data access restrictions'
    );
    assert(
      agent.guardrails.dataAccessRestrictions.noPII === true,
      'Agent must not access PII'
    );
  });

  test(`${agentFile} has allowed Packs configured`, () => {
    assert(
      Array.isArray(agent.guardrails.allowedPacks),
      'Agent must have allowedPacks array'
    );
    assert(
      agent.guardrails.allowedPacks.length > 0,
      'Agent must have at least one allowed Pack'
    );
  });
});

// Test that grader assistant requires human review
const graderAssistant = loadJSON(path.join(__dirname, '../agents/grader-assistant.json'));
test('Grader assistant requires human review', () => {
  assert(
    graderAssistant.guardrails.requiresHumanReview === true,
    'Grader assistant must require human review'
  );
  assert(
    graderAssistant.capabilities.canAutoGrade === false,
    'Grader assistant cannot auto-grade'
  );
});

// Test that all agents cannot pass without rubric
agentFiles.forEach(agentFile => {
  const agent = loadJSON(path.join(agentsDir, agentFile));
  test(`${agentFile} cannot pass learners without rubric`, () => {
    assert(
      agent.guardrails.cannotPass === true,
      'Agent cannot pass learner without going through defined rubric'
    );
  });
});

// Summary
console.log('\n🤖 ============================================');
console.log('🤖 Test Summary');
console.log('🤖 ============================================');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${failedTests}`);
console.log('🤖 ============================================\n');

process.exit(failedTests > 0 ? 1 : 0);
