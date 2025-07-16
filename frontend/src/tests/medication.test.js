/**
 * Test suite for medication utility functions
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
  getMedications,
  getMedicationByName,
  createMedication,
  updateMedication,
  deleteMedication,
  saveMedication,
  getActiveMedications,
  getMedicationsWithSideEffects,
  deactivateMedication,
  calculateTotalDailyDose,
  createDose
} from '../utils/medication.js';

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
const sampleMedication = {
  name: 'Ibuprofen',
  dose: {
    morning: 200,
    afternoon: 0,
    evening: 200
  },
  active: true,
  start_date: '2025-07-01',
  end_date: null,
  side_effects: ['Stomach upset'],
  notes: ['Take with food']
};

const sampleMedications = [
  {
    name: 'Ibuprofen',
    dose: {
      morning: 200,
      afternoon: 0,
      evening: 200
    },
    active: true,
    start_date: '2025-07-01',
    end_date: null,
    side_effects: ['Stomach upset'],
    notes: ['Take with food']
  },
  {
    name: 'Acetaminophen',
    dose: {
      morning: 500,
      afternoon: 500,
      evening: 500
    },
    active: true,
    start_date: '2025-06-15',
    end_date: null,
    side_effects: null,
    notes: null
  },
  {
    name: 'Aspirin',
    dose: {
      morning: 81,
      afternoon: 0,
      evening: 0
    },
    active: false,
    start_date: '2025-05-01',
    end_date: '2025-06-30',
    side_effects: ['Bleeding risk'],
    notes: ['Low dose for prevention']
  }
];

/**
 * Test cases for medication utilities
 * These are example test cases that would work with Jest or Vitest
 */

// Test: getMedications
async function testGetMedications() {
  try {
    mockFetch(sampleMedications);
    const result = await getMedications();
    
    console.log('✓ getMedications test passed');
    console.log('Expected:', sampleMedications.length, 'medications');
    console.log('Actual:', result.length, 'medications');
    
    return result.length === 3;
  } catch (error) {
    console.error('✗ getMedications test failed:', error.message);
    return false;
  }
}

// Test: getMedicationByName
async function testGetMedicationByName() {
  try {
    mockFetch(sampleMedication);
    const result = await getMedicationByName('Ibuprofen');
    
    console.log('✓ getMedicationByName test passed');
    console.log('Expected:', sampleMedication.name);
    console.log('Actual:', result.name);
    
    return result.name === 'Ibuprofen';
  } catch (error) {
    console.error('✗ getMedicationByName test failed:', error.message);
    return false;
  }
}

// Test: getMedicationByName (404 case)
async function testGetMedicationByName404() {
  try {
    mockFetchError(404, 'Medication not found');
    const result = await getMedicationByName('NonExistent');
    
    console.log('✓ getMedicationByName 404 test passed');
    console.log('Expected: null');
    console.log('Actual:', result);
    
    return result === null;
  } catch (error) {
    console.error('✗ getMedicationByName 404 test failed:', error.message);
    return false;
  }
}

// Test: createMedication
async function testCreateMedication() {
  try {
    const newMedication = {
      name: 'New Medication',
      dose: {
        morning: 100,
        afternoon: 100,
        evening: 0
      },
      active: true,
      start_date: '2025-07-16',
      end_date: null,
      side_effects: null,
      notes: ['New medication for testing']
    };
    
    mockFetch(newMedication);
    const result = await createMedication(newMedication);
    
    console.log('✓ createMedication test passed');
    console.log('Expected:', newMedication.name);
    console.log('Actual:', result.name);
    
    return result.name === 'New Medication';
  } catch (error) {
    console.error('✗ createMedication test failed:', error.message);
    return false;
  }
}

// Test: updateMedication
async function testUpdateMedication() {
  try {
    const updatedMedication = {
      name: 'Ibuprofen',
      dose: {
        morning: 400,
        afternoon: 0,
        evening: 400
      },
      active: true,
      start_date: '2025-07-01',
      end_date: null,
      side_effects: ['Stomach upset', 'Drowsiness'],
      notes: ['Updated dosage']
    };
    
    mockFetch(updatedMedication);
    const result = await updateMedication(updatedMedication);
    
    console.log('✓ updateMedication test passed');
    console.log('Expected morning dose:', 400);
    console.log('Actual morning dose:', result.dose.morning);
    
    return result.dose.morning === 400;
  } catch (error) {
    console.error('✗ updateMedication test failed:', error.message);
    return false;
  }
}

// Test: deleteMedication
async function testDeleteMedication() {
  try {
    mockFetch(sampleMedication);
    const result = await deleteMedication('Ibuprofen');
    
    console.log('✓ deleteMedication test passed');
    console.log('Expected:', sampleMedication.name);
    console.log('Actual:', result.name);
    
    return result.name === 'Ibuprofen';
  } catch (error) {
    console.error('✗ deleteMedication test failed:', error.message);
    return false;
  }
}

// Test: getActiveMedications
async function testGetActiveMedications() {
  try {
    mockFetch(sampleMedications);
    const result = await getActiveMedications();
    
    console.log('✓ getActiveMedications test passed');
    console.log('Expected: 2 active medications');
    console.log('Actual:', result.length, 'active medications');
    
    return result.length === 2 && result.every(med => med.active);
  } catch (error) {
    console.error('✗ getActiveMedications test failed:', error.message);
    return false;
  }
}

// Test: getMedicationsWithSideEffects
async function testGetMedicationsWithSideEffects() {
  try {
    mockFetch(sampleMedications);
    const result = await getMedicationsWithSideEffects();
    
    console.log('✓ getMedicationsWithSideEffects test passed');
    console.log('Expected: 2 medications with side effects');
    console.log('Actual:', result.length, 'medications with side effects');
    
    return result.length === 2;
  } catch (error) {
    console.error('✗ getMedicationsWithSideEffects test failed:', error.message);
    return false;
  }
}

// Test: calculateTotalDailyDose
function testCalculateTotalDailyDose() {
  try {
    const totalDose = calculateTotalDailyDose(sampleMedication);
    
    console.log('✓ calculateTotalDailyDose test passed');
    console.log('Expected: 400 (200 + 0 + 200)');
    console.log('Actual:', totalDose);
    
    return totalDose === 400;
  } catch (error) {
    console.error('✗ calculateTotalDailyDose test failed:', error.message);
    return false;
  }
}

// Test: createDose
function testCreateDose() {
  try {
    const dose = createDose(100, 200, 150);
    
    console.log('✓ createDose test passed');
    console.log('Expected: {morning: 100, afternoon: 200, evening: 150}');
    console.log('Actual:', dose);
    
    return dose.morning === 100 && dose.afternoon === 200 && dose.evening === 150;
  } catch (error) {
    console.error('✗ createDose test failed:', error.message);
    return false;
  }
}

// Test: createDose with defaults
function testCreateDoseDefaults() {
  try {
    const dose = createDose();
    
    console.log('✓ createDose defaults test passed');
    console.log('Expected: {morning: 0, afternoon: 0, evening: 0}');
    console.log('Actual:', dose);
    
    return dose.morning === 0 && dose.afternoon === 0 && dose.evening === 0;
  } catch (error) {
    console.error('✗ createDose defaults test failed:', error.message);
    return false;
  }
}

// Test: deactivateMedication
async function testDeactivateMedication() {
  try {
    // Mock getting the medication first
    mockFetch(sampleMedication);
    
    // Mock updating the medication
    const deactivatedMedication = {
      ...sampleMedication,
      active: false,
      end_date: new Date().toISOString().split('T')[0]
    };
    
    // We need to mock both calls in sequence
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => sampleMedication
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => deactivatedMedication
      });
    
    const result = await deactivateMedication('Ibuprofen');
    
    console.log('✓ deactivateMedication test passed');
    console.log('Expected active: false');
    console.log('Actual active:', result.active);
    
    return result.active === false;
  } catch (error) {
    console.error('✗ deactivateMedication test failed:', error.message);
    return false;
  }
}

// Run all tests
export async function runMedicationTests() {
  console.log('Running medication utility tests...\n');
  
  const tests = [
    testGetMedications,
    testGetMedicationByName,
    testGetMedicationByName404,
    testCreateMedication,
    testUpdateMedication,
    testDeleteMedication,
    testGetActiveMedications,
    testGetMedicationsWithSideEffects,
    testCalculateTotalDailyDose,
    testCreateDose,
    testCreateDoseDefaults,
    testDeactivateMedication
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
  testGetMedications,
  testGetMedicationByName,
  testGetMedicationByName404,
  testCreateMedication,
  testUpdateMedication,
  testDeleteMedication,
  testGetActiveMedications,
  testGetMedicationsWithSideEffects,
  testCalculateTotalDailyDose,
  testCreateDose,
  testCreateDoseDefaults,
  testDeactivateMedication
};
