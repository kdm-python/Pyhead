// Base URL for the API - adjust this based on your backend configuration
const API_BASE_URL = 'http://localhost:8000';

/**
 * Get all medications from the backend
 * @returns {Promise<Array>} Array of medication objects
 */
export async function getMedications() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
}

/**
 * Get a specific medication by name
 * @param {string} name - Medication name
 * @returns {Promise<Object|null>} Medication object or null if not found
 */
export async function getMedicationByName(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/${encodeURIComponent(name)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Medication not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching medication:', error);
    throw error;
  }
}

/**
 * Create a new medication
 * @param {Object} medication - Medication object
 * @param {string} medication.name - Medication name
 * @param {Object} medication.dose - Dose object with morning, afternoon, evening
 * @param {boolean} medication.active - Whether medication is active
 * @param {string} medication.start_date - Start date in YYYY-MM-DD format (optional)
 * @param {string} medication.end_date - End date in YYYY-MM-DD format (optional)
 * @param {Array<string>} medication.side_effects - Side effects array (optional)
 * @param {Array<string>} medication.notes - Notes array (optional)
 * @returns {Promise<Object>} Created medication object
 */
export async function createMedication(medication) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating medication:', error);
    throw error;
  }
}

/**
 * Update an existing medication
 * @param {Object} medication - Medication object with updated data
 * @returns {Promise<Object>} Updated medication object
 */
export async function updateMedication(medication) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
}

/**
 * Delete a medication by name
 * @param {string} name - Medication name
 * @returns {Promise<Object>} Deleted medication object
 */
export async function deleteMedication(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medications/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Medication not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
}

/**
 * Create or update a medication (upsert functionality)
 * @param {Object} medication - Medication object
 * @returns {Promise<Object>} Created or updated medication object
 */
export async function saveMedication(medication) {
  try {
    // First, try to get existing medication
    const existingMedication = await getMedicationByName(medication.name);
    
    if (existingMedication) {
      // Update existing medication
      return await updateMedication(medication);
    } else {
      // Create new medication
      return await createMedication(medication);
    }
  } catch (error) {
    console.error('Error saving medication:', error);
    throw error;
  }
}

/**
 * Get only active medications
 * @returns {Promise<Array>} Array of active medication objects
 */
export async function getActiveMedications() {
  try {
    const allMedications = await getMedications();
    return allMedications.filter(medication => medication.active);
  } catch (error) {
    console.error('Error fetching active medications:', error);
    throw error;
  }
}

/**
 * Get medications with side effects
 * @returns {Promise<Array>} Array of medications that have side effects
 */
export async function getMedicationsWithSideEffects() {
  try {
    const allMedications = await getMedications();
    return allMedications.filter(medication => 
      medication.side_effects && medication.side_effects.length > 0
    );
  } catch (error) {
    console.error('Error fetching medications with side effects:', error);
    throw error;
  }
}

/**
 * Deactivate a medication (set active to false)
 * @param {string} name - Medication name
 * @returns {Promise<Object>} Updated medication object
 */
export async function deactivateMedication(name) {
  try {
    const medication = await getMedicationByName(name);
    if (!medication) {
      throw new Error('Medication not found');
    }
    
    const updatedMedication = {
      ...medication,
      active: false,
      end_date: new Date().toISOString().split('T')[0] // Set end date to today
    };
    
    return await updateMedication(updatedMedication);
  } catch (error) {
    console.error('Error deactivating medication:', error);
    throw error;
  }
}

/**
 * Calculate total daily dose for a medication
 * @param {Object} medication - Medication object
 * @returns {number} Total daily dose
 */
export function calculateTotalDailyDose(medication) {
  const { dose } = medication;
  return (dose.morning || 0) + (dose.afternoon || 0) + (dose.evening || 0);
}

/**
 * Create a dose object helper
 * @param {number} morning - Morning dose (default: 0)
 * @param {number} afternoon - Afternoon dose (default: 0)
 * @param {number} evening - Evening dose (default: 0)
 * @returns {Object} Dose object
 */
export function createDose(morning = 0, afternoon = 0, evening = 0) {
  return {
    morning: parseFloat(morning) || 0,
    afternoon: parseFloat(afternoon) || 0,
    evening: parseFloat(evening) || 0
  };
}