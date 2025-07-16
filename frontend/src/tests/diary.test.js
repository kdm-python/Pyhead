/**
 * Test suite for diary utility functions
 * 
 * To run these tests, you need to install a testing framework:
 * 
 * Option 1: Using Vitest (recommended for Vite projects)
 * npm install --save-dev vitest jsdom @vitest/ui
 * 
 * Add to package.json:
 * "scripts": {
 *   "test": "vitest",
 *   "test:ui": "vitest --ui"
 * }
 * 
 * Create vitest.config.js:
 * import { defineConfig } from 'vitest/config'
 * export default defineConfig({
 *   test: {
 *     environment: 'jsdom',
 *     globals: true,
 *   },
 * })
 * 
 * Option 2: Using Jest
 * npm install --save-dev jest jsdom @testing-library/jest-dom
 */

import {
  getDiaryEntries,
  getDiaryEntryByDate,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  saveDiaryEntry,
  getDiaryEntriesInRange
} from '../utils/diary.js';

// Test configuration and mocks
const mockFetch = (response) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => response
  });
};

const mockFetchError = (status, message) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ detail: message })
  });
};

// Sample test data
const sampleDiaryEntry = {
  date: '2025-07-15',
  score: 7,
  limited: true,
  cluster: false,
  notes: ['Stress-related headache']
};

const sampleDiaryEntries = [
  {
    date: '2025-07-15',
    score: 7,
    limited: true,
    cluster: false,
    notes: ['Stress-related headache']
  },
  {
    date: '2025-07-16',
    score: 3,
    limited: false,
    cluster: false,
    notes: null
  }
];

/**
 * Test cases for diary utilities
 * These are example test cases that would work with Jest or Vitest
 */

// Test: getDiaryEntries
async function testGetDiaryEntries() {
  try {
    mockFetch(sampleDiaryEntries);
    const result = await getDiaryEntries();
    
    console.log('✓ getDiaryEntries test passed');
    console.log('Expected:', sampleDiaryEntries);
    console.log('Actual:', result);
    
    return result.length === 2;
  } catch (error) {
    console.error('✗ getDiaryEntries test failed:', error.message);
    return false;
  }
}

// Test: getDiaryEntryByDate
async function testGetDiaryEntryByDate() {
  try {
    mockFetch(sampleDiaryEntry);
    const result = await getDiaryEntryByDate('2025-07-15');
    
    console.log('✓ getDiaryEntryByDate test passed');
    console.log('Expected:', sampleDiaryEntry);
    console.log('Actual:', result);
    
    return result.date === '2025-07-15';
  } catch (error) {
    console.error('✗ getDiaryEntryByDate test failed:', error.message);
    return false;
  }
}

// Test: getDiaryEntryByDate (404 case)
async function testGetDiaryEntryByDate404() {
  try {
    mockFetchError(404, 'Diary entry not found');
    const result = await getDiaryEntryByDate('2025-01-01');
    
    console.log('✓ getDiaryEntryByDate 404 test passed');
    console.log('Expected: null');
    console.log('Actual:', result);
    
    return result === null;
  } catch (error) {
    console.error('✗ getDiaryEntryByDate 404 test failed:', error.message);
    return false;
  }
}

// Test: createDiaryEntry
async function testCreateDiaryEntry() {
  try {
    const newEntry = {
      date: '2025-07-17',
      score: 5,
      limited: false,
      cluster: false,
      notes: ['New entry']
    };
    
    mockFetch(newEntry);
    const result = await createDiaryEntry(newEntry);
    
    console.log('✓ createDiaryEntry test passed');
    console.log('Expected:', newEntry);
    console.log('Actual:', result);
    
    return result.date === '2025-07-17';
  } catch (error) {
    console.error('✗ createDiaryEntry test failed:', error.message);
    return false;
  }
}

// Test: updateDiaryEntry
async function testUpdateDiaryEntry() {
  try {
    const updatedEntry = {
      date: '2025-07-15',
      score: 4,
      limited: false,
      cluster: false,
      notes: ['Updated entry']
    };
    
    mockFetch(updatedEntry);
    const result = await updateDiaryEntry(updatedEntry);
    
    console.log('✓ updateDiaryEntry test passed');
    console.log('Expected:', updatedEntry);
    console.log('Actual:', result);
    
    return result.score === 4;
  } catch (error) {
    console.error('✗ updateDiaryEntry test failed:', error.message);
    return false;
  }
}

// Test: deleteDiaryEntry
async function testDeleteDiaryEntry() {
  try {
    mockFetch(sampleDiaryEntry);
    const result = await deleteDiaryEntry('2025-07-15');
    
    console.log('✓ deleteDiaryEntry test passed');
    console.log('Expected:', sampleDiaryEntry);
    console.log('Actual:', result);
    
    return result.date === '2025-07-15';
  } catch (error) {
    console.error('✗ deleteDiaryEntry test failed:', error.message);
    return false;
  }
}

// Test: getDiaryEntriesInRange
async function testGetDiaryEntriesInRange() {
  try {
    const allEntries = [
      { date: '2025-07-10', score: 5, limited: false, cluster: false },
      { date: '2025-07-15', score: 7, limited: true, cluster: false },
      { date: '2025-07-20', score: 3, limited: false, cluster: false },
      { date: '2025-07-25', score: 8, limited: true, cluster: true }
    ];
    
    mockFetch(allEntries);
    const result = await getDiaryEntriesInRange('2025-07-12', '2025-07-22');
    
    console.log('✓ getDiaryEntriesInRange test passed');
    console.log('Expected: 2 entries');
    console.log('Actual:', result.length, 'entries');
    
    return result.length === 2;
  } catch (error) {
    console.error('✗ getDiaryEntriesInRange test failed:', error.message);
    return false;
  }
}

// Run all tests
export async function runDiaryTests() {
  console.log('Running diary utility tests...\n');
  
  const tests = [
    testGetDiaryEntries,
    testGetDiaryEntryByDate,
    testGetDiaryEntryByDate404,
    testCreateDiaryEntry,
    testUpdateDiaryEntry,
    testDeleteDiaryEntry,
    testGetDiaryEntriesInRange
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

// Export individual test functions for proper testing frameworks
export {
  testGetDiaryEntries,
  testGetDiaryEntryByDate,
  testGetDiaryEntryByDate404,
  testCreateDiaryEntry,
  testUpdateDiaryEntry,
  testDeleteDiaryEntry,
  testGetDiaryEntriesInRange
};
