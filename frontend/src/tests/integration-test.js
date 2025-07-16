// Simple integration test to verify utility functions work with the backend
import { getDiaryEntries } from '../utils/diary.js';
import { getMedications } from '../utils/medication.js';

async function testIntegration() {
  console.log('Testing integration with backend...');
  
  try {
    // Test diary utilities
    console.log('Testing diary utilities...');
    const diaryEntries = await getDiaryEntries();
    console.log('✅ Diary entries retrieved:', diaryEntries.length);
    
    // Test medication utilities
    console.log('Testing medication utilities...');
    const medications = await getMedications();
    console.log('✅ Medications retrieved:', medications.length);
    
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8000/api/health');
    const health = await healthResponse.json();
    console.log('✅ Health check:', health.message);
    
    console.log('🎉 All integration tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    return false;
  }
}

testIntegration();
