#!/usr/bin/env node

/**
 * 🔁 Progress State Transition Tests
 * Ensures state transitions follow the defined rules
 */

const fs = require('fs');
const path = require('path');

const stateConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../flows/state-transitions.json'), 'utf8')
);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

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

function isValidTransition(fromState, toState) {
  const allowed = stateConfig.stateTransitions[fromState]?.allowedNext || [];
  return allowed.includes(toState);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🔁 ============================================');
console.log('🔁 Progress State Transition Tests');
console.log('🔁 ============================================\n');

// Test valid transitions
test('not-started → in-progress is valid', () => {
  assert(
    isValidTransition('not-started', 'in-progress'),
    'Should allow transition from not-started to in-progress'
  );
});

test('in-progress → completed is valid', () => {
  assert(
    isValidTransition('in-progress', 'completed'),
    'Should allow transition from in-progress to completed'
  );
});

test('completed → mastered is valid', () => {
  assert(
    isValidTransition('completed', 'mastered'),
    'Should allow transition from completed to mastered'
  );
});

test('completed → in-progress is valid (retry)', () => {
  assert(
    isValidTransition('completed', 'in-progress'),
    'Should allow transition from completed to in-progress for retry'
  );
});

test('mastered → in-progress is valid (review)', () => {
  assert(
    isValidTransition('mastered', 'in-progress'),
    'Should allow transition from mastered to in-progress for review'
  );
});

test('in-progress → not-started is valid (reset)', () => {
  assert(
    isValidTransition('in-progress', 'not-started'),
    'Should allow transition from in-progress to not-started for reset'
  );
});

// Test invalid transitions (no skipping)
test('not-started → completed is INVALID', () => {
  assert(
    !isValidTransition('not-started', 'completed'),
    'Should NOT allow skipping from not-started to completed'
  );
});

test('not-started → mastered is INVALID', () => {
  assert(
    !isValidTransition('not-started', 'mastered'),
    'Should NOT allow skipping from not-started to mastered'
  );
});

test('in-progress → mastered is INVALID', () => {
  assert(
    !isValidTransition('in-progress', 'mastered'),
    'Should NOT allow skipping from in-progress to mastered'
  );
});

test('completed → not-started is INVALID', () => {
  assert(
    !isValidTransition('completed', 'not-started'),
    'Should NOT allow un-completing work'
  );
});

test('mastered → not-started is INVALID', () => {
  assert(
    !isValidTransition('mastered', 'not-started'),
    'Should NOT allow downgrading from mastered to not-started'
  );
});

test('mastered → completed is INVALID', () => {
  assert(
    !isValidTransition('mastered', 'completed'),
    'Should NOT allow downgrading from mastered to completed'
  );
});

// Test that all states are defined
test('All states have transition rules', () => {
  const states = ['not-started', 'in-progress', 'completed', 'mastered'];
  states.forEach(state => {
    assert(
      stateConfig.stateTransitions[state],
      `State ${state} should have transition rules`
    );
    assert(
      Array.isArray(stateConfig.stateTransitions[state].allowedNext),
      `State ${state} should have allowedNext array`
    );
  });
});

// Test transition rules exist for allowed transitions
test('Transition rules exist for all allowed transitions', () => {
  const states = Object.keys(stateConfig.stateTransitions);
  states.forEach(fromState => {
    const allowed = stateConfig.stateTransitions[fromState].allowedNext;
    allowed.forEach(toState => {
      const ruleKey = `${fromState}->${toState}`;
      assert(
        stateConfig.transitionRules[ruleKey],
        `Transition rule should exist for ${ruleKey}`
      );
      assert(
        Array.isArray(stateConfig.transitionRules[ruleKey].conditions),
        `Transition ${ruleKey} should have conditions array`
      );
      assert(
        Array.isArray(stateConfig.transitionRules[ruleKey].effects),
        `Transition ${ruleKey} should have effects array`
      );
    });
  });
});

// Test validation rules are defined
test('Validation rules are properly configured', () => {
  assert(
    stateConfig.validationRules.noSkipping,
    'noSkipping validation rule should exist'
  );
  assert(
    stateConfig.validationRules.masteryIsPermanent,
    'masteryIsPermanent validation rule should exist'
  );
  assert(
    stateConfig.validationRules.preserveHistory,
    'preserveHistory validation rule should exist'
  );
});

// Summary
console.log('\n🔁 ============================================');
console.log('🔁 Test Summary');
console.log('🔁 ============================================');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${failedTests}`);
console.log('🔁 ============================================\n');

process.exit(failedTests > 0 ? 1 : 0);
