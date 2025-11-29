#!/usr/bin/env node

/**
 * 🧪 Run All Tests
 * Orchestrates running all test suites
 */

const { spawn } = require('child_process');
const path = require('path');

function runTest(testScript, testName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🏃 Running ${testName}...`);
    const child = spawn('node', [path.join(__dirname, testScript)], {
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ ${testName} passed\n`);
        resolve();
      } else {
        console.log(`❌ ${testName} failed with code ${code}\n`);
        reject(new Error(`${testName} failed`));
      }
    });

    child.on('error', (err) => {
      console.log(`❌ ${testName} error: ${err.message}\n`);
      reject(err);
    });
  });
}

async function runAllTests() {
  console.log('🧪 ============================================');
  console.log('🧪 Running All Education Pack Tests');
  console.log('🧪 ============================================\n');

  const tests = [
    ['schema-validation.test.js', 'Schema Validation Tests'],
    ['progress-states.test.js', 'Progress State Tests'],
    ['agent-config.test.js', 'Agent Configuration Tests']
  ];

  let allPassed = true;

  for (const [script, name] of tests) {
    try {
      await runTest(script, name);
    } catch (error) {
      allPassed = false;
    }
  }

  console.log('\n🧪 ============================================');
  if (allPassed) {
    console.log('🧪 ✅ ALL TESTS PASSED');
  } else {
    console.log('🧪 ❌ SOME TESTS FAILED');
  }
  console.log('🧪 ============================================\n');

  process.exit(allPassed ? 0 : 1);
}

runAllTests().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
