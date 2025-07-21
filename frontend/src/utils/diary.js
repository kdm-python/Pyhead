// Base URL for the API - adjust this based on your backend configuration
const API_BASE_URL = 'http://localhost:8000';

/**
 * Get all diary entries from the backend
 * @returns {Promise<Array>} Array of diary entries
 */
export async function getDiaryEntries() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    throw error;
  }
}

/**
 * Get a specific diary entry by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Diary entry object
 */
export async function getDiaryEntryByDate(date) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Entry not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    throw error;
  }
}

/**
 * Create a new diary entry
 * @param {Object} entry - Diary entry object
 * @param {string} entry.date - Date in YYYY-MM-DD format
 * @param {number} entry.score - Pain score between 1 and 10
 * @param {boolean} entry.limited - Whether activity was limited
 * @param {boolean} entry.cluster - Whether it was a cluster headache
 * @param {Array<string>} entry.notes - Optional notes array
 * @returns {Promise<Object>} Created diary entry
 */
export async function createDiaryEntry(entry) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // If JSON parsing fails, use the default error message
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating diary entry:', error);
    throw error;
  }
}

/**
 * Update an existing diary entry
 * @param {Object} entry - Diary entry object with updated data
 * @returns {Promise<Object>} Updated diary entry
 */
export async function updateDiaryEntry(entry) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating diary entry:', error);
    throw error;
  }
}

/**
 * Delete a diary entry by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Deleted diary entry
 */
export async function deleteDiaryEntry(date) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/${date}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Diary entry not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    throw error;
  }
}

/**
 * Create or update a diary entry (upsert functionality)
 * @param {Object} entry - Diary entry object
 * @returns {Promise<Object>} Created or updated diary entry
 */
export async function saveDiaryEntry(entry) {
  try {
    // First, try to get existing entry
    const existingEntry = await getDiaryEntryByDate(entry.date);
    
    if (existingEntry) {
      // Update existing entry
      return await updateDiaryEntry(entry);
    } else {
      // Create new entry
      return await createDiaryEntry(entry);
    }
  } catch (error) {
    console.error('Error saving diary entry:', error);
    throw error;
  }
}

/**
 * Get diary entries for a specific date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Filtered diary entries
 */
export async function getDiaryEntriesInRange(startDate, endDate) {
  try {
    const allEntries = await getDiaryEntries();
    return allEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return entryDate >= start && entryDate <= end;
    });
  } catch (error) {
    console.error('Error fetching diary entries in range:', error);
    throw error;
  }
}

/**
 * Get diary entries for a specific month
 * @param {number} year - Year (e.g. 2025)
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Diary entries for the specified month
 */
export async function getDiaryEntriesByMonth(year, month) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/month/${year}/${month}`);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // No entries found for this month
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching diary entries by month:', error);
    throw error;
  }
}

/** * Get statistics for a specific month
 * @param {number} year - Year (e.g. 2025)
 * @param {number} month - Month (1-12)
 * @returns {Promise<Object>} Statistics object containing average score, total entries, etc.
 */
export async function getMonthStats(year, month) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diary/stats/${year}/${month}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching month stats:', error);
    throw error;
  }
}