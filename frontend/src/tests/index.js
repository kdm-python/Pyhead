/**
 * Simple test runner for frontend utilities
 * 
 * This file provides a simple way to run tests for the utility functions
 * without requiring a full testing framework setup.
 * 
 * Usage:
 * 1. Start your backend server (python -m uvicorn pyhead.main:app --reload)
 * 2. Open this file in a browser or run with Node.js
 * 3. Check the console for test results
 * 
 * Note: This requires the backend to be running on localhost:8000
 */

import { runDiaryTests } from './diary.test.js';
import { runMedicationTests } from './medication.test.js';

// Helper function to set up a mock environment for browser testing
function setupMockEnvironment() {
  // Mock Jest functions for browser environment
  if (typeof window !== 'undefined') {
    window.jest = {
      fn: () => ({
        mockResolvedValue: (value) => Promise.resolve(value),
        mockResolvedValueOnce: (value) => Promise.resolve(value)
      })
    };
    
    window.global = window;
  }
}

// Run all tests
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('Running Frontend Utility Tests');
  console.log('='.repeat(50));
  
  setupMockEnvironment();
  
  try {
    // Run diary tests
    console.log('\n📝 DIARY TESTS');
    console.log('-'.repeat(30));
    const diaryResults = await runDiaryTests();
    
    // Run medication tests
    console.log('\n💊 MEDICATION TESTS');
    console.log('-'.repeat(30));
    const medicationResults = await runMedicationTests();
    
    // Summary
    const totalPassed = diaryResults.passed + medicationResults.passed;
    const totalFailed = diaryResults.failed + medicationResults.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log('\n' + '='.repeat(50));
    console.log('FINAL RESULTS');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log(`❌ ${totalFailed} test(s) failed`);
    }
    
    return {
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      successRate: (totalPassed / totalTests) * 100
    };
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
    return {
      total: 0,
      passed: 0,
      failed: 1,
      successRate: 0,
      error: error.message
    };
  }
}

// Instructions for setting up proper testing
function showTestingInstructions() {
  console.log('\n' + '='.repeat(50));
  console.log('SETTING UP PROPER TESTING FRAMEWORK');
  console.log('='.repeat(50));
  
  console.log('\n1. Install Vitest (recommended for Vite projects):');
  console.log('   npm install --save-dev vitest jsdom @vitest/ui');
  
  console.log('\n2. Add to package.json scripts:');
  console.log('   "scripts": {');
  console.log('     "test": "vitest",');
  console.log('     "test:ui": "vitest --ui",');
  console.log('     "test:coverage": "vitest --coverage"');
  console.log('   }');
  
  console.log('\n3. Create vitest.config.js:');
  console.log('   import { defineConfig } from "vitest/config"');
  console.log('   export default defineConfig({');
  console.log('     test: {');
  console.log('       environment: "jsdom",');
  console.log('       globals: true,');
  console.log('     },');
  console.log('   })');
  
  console.log('\n4. Run tests:');
  console.log('   npm run test');
  console.log('   npm run test:ui  # For UI interface');
  
  console.log('\n' + '='.repeat(50));
}

// Health check for API
async function checkApiHealth() {
  try {
    const response = await fetch('http://localhost:8000/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✓ API Health Check:', data.message);
      return true;
    } else {
      console.log('❌ API Health Check Failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ API Health Check Error:', error.message);
    console.log('Make sure your backend is running on localhost:8000');
    return false;
  }
}

// Main execution
async function main() {
  console.log('Starting test suite...');
  
  // Check if API is running
  const apiHealthy = await checkApiHealth();
  if (!apiHealthy) {
    console.log('\n⚠️  Warning: API appears to be offline.');
    console.log('Some integration tests may fail.');
    console.log('To start the backend:');
    console.log('cd pyhead && python -m uvicorn pyhead.main:app --reload');
  }
  
  // Run all tests
  const results = await runAllTests();
  
  // Show setup instructions
  showTestingInstructions();
  
  return results;
}

// Export functions for manual use
export {
  runAllTests,
  checkApiHealth,
  showTestingInstructions,
  setupMockEnvironment
};

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  document.addEventListener('DOMContentLoaded', main);
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  main();
}
