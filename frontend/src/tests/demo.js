/**
 * Demo script showing how to use the utility functions
 * 
 * This script demonstrates the basic usage of both diary and medication utilities.
 * Make sure the backend is running before executing this script.
 */

import { 
  getDiaryEntries, 
  createDiaryEntry, 
  getDiaryEntryByDate,
  saveDiaryEntry 
} from '../utils/diary.js';

import { 
  getMedications, 
  createMedication, 
  getActiveMedications,
  createDose,
  calculateTotalDailyDose 
} from '../utils/medication.js';

// Demo data
const sampleDiaryEntry = {
  date: '2025-07-16',
  score: 6,
  limited: true,
  cluster: false,
  notes: ['Demo headache entry', 'Created from demo script']
};

const sampleMedication = {
  name: 'Demo Medication',
  dose: createDose(100, 200, 100),
  active: true,
  start_date: '2025-07-16',
  side_effects: ['Demo side effect'],
  notes: ['Demo medication from script']
};

async function demonstrateDiaryFunctions() {
  console.log('🗓️  DIARY FUNCTIONS DEMO');
  console.log('='.repeat(40));
  
  try {
    // Get all diary entries
    console.log('\n1. Getting all diary entries...');
    const allEntries = await getDiaryEntries();
    console.log(`Found ${allEntries.length} diary entries`);
    
    // Create a new entry
    console.log('\n2. Creating a new diary entry...');
    const newEntry = await createDiaryEntry(sampleDiaryEntry);
    console.log('Created entry:', newEntry);
    
    // Get the entry we just created
    console.log('\n3. Getting the entry we just created...');
    const retrievedEntry = await getDiaryEntryByDate(sampleDiaryEntry.date);
    console.log('Retrieved entry:', retrievedEntry);
    
    // Update the entry using saveDiaryEntry
    console.log('\n4. Updating the entry...');
    const updatedEntryData = {
      ...sampleDiaryEntry,
      score: 8,
      notes: ['Updated demo entry', 'Score increased to 8']
    };
    const updatedEntry = await saveDiaryEntry(updatedEntryData);
    console.log('Updated entry:', updatedEntry);
    
    console.log('\n✅ Diary functions demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in diary demo:', error.message);
  }
}

async function demonstrateMedicationFunctions() {
  console.log('\n\n💊 MEDICATION FUNCTIONS DEMO');
  console.log('='.repeat(40));
  
  try {
    // Get all medications
    console.log('\n1. Getting all medications...');
    const allMedications = await getMedications();
    console.log(`Found ${allMedications.length} medications`);
    
    // Create a new medication
    console.log('\n2. Creating a new medication...');
    const newMedication = await createMedication(sampleMedication);
    console.log('Created medication:', newMedication);
    
    // Calculate total daily dose
    console.log('\n3. Calculating total daily dose...');
    const totalDose = calculateTotalDailyDose(newMedication);
    console.log(`Total daily dose: ${totalDose}mg`);
    
    // Get active medications
    console.log('\n4. Getting active medications...');
    const activeMedications = await getActiveMedications();
    console.log(`Found ${activeMedications.length} active medications`);
    
    // Demonstrate dose creation
    console.log('\n5. Creating different dose configurations...');
    const morningOnlyDose = createDose(500);
    const twiceADayDose = createDose(250, 0, 250);
    const thriceADayDose = createDose(200, 200, 200);
    
    console.log('Morning only dose:', morningOnlyDose);
    console.log('Twice a day dose:', twiceADayDose);
    console.log('Three times a day dose:', thriceADayDose);
    
    console.log('\n✅ Medication functions demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in medication demo:', error.message);
  }
}

async function demonstrateErrorHandling() {
  console.log('\n\n🚨 ERROR HANDLING DEMO');
  console.log('='.repeat(40));
  
  try {
    // Try to get a non-existent diary entry
    console.log('\n1. Trying to get non-existent diary entry...');
    const nonExistentEntry = await getDiaryEntryByDate('2020-01-01');
    console.log('Result:', nonExistentEntry); // Should be null
    
    // Try to create an invalid diary entry
    console.log('\n2. Trying to create invalid diary entry...');
    const invalidEntry = {
      date: '2025-07-16',
      score: 15, // Invalid score (should be 1-10)
      limited: true,
      cluster: false
    };
    
    try {
      await createDiaryEntry(invalidEntry);
    } catch (error) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n✅ Error handling demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error in error handling demo:', error.message);
  }
}

async function runCompleteDemo() {
  console.log('🚀 UTILITY FUNCTIONS DEMO');
  console.log('='.repeat(50));
  console.log('This demo shows how to use the diary and medication utilities');
  console.log('Make sure your backend is running on localhost:8000');
  console.log('='.repeat(50));
  
  // Check API health first
  try {
    const healthResponse = await fetch('http://localhost:8000/api/health');
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ API Health Check:', health.message);
    } else {
      console.log('❌ API Health Check failed');
      return;
    }
  } catch {
    console.log('❌ Cannot connect to API. Make sure backend is running.');
    return;
  }
  
  // Run all demos
  await demonstrateDiaryFunctions();
  await demonstrateMedicationFunctions();
  await demonstrateErrorHandling();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 DEMO COMPLETED!');
  console.log('='.repeat(50));
  console.log('Check your backend data to see the created entries.');
  console.log('You can now integrate these functions into your React components.');
}

// Export the demo functions
export {
  demonstrateDiaryFunctions,
  demonstrateMedicationFunctions,
  demonstrateErrorHandling,
  runCompleteDemo
};

// Auto-run the demo if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runDemo = runCompleteDemo;
  console.log('Demo functions loaded. Run window.runDemo() to start the demo.');
} else {
  // Node.js environment
  runCompleteDemo();
}
