# Frontend Utility Functions and Tests

This directory contains utility functions for interacting with the PyHead backend API and their corresponding tests.

## Files

### Utility Functions
- `diary.js` - Functions for managing diary entries
- `medication.js` - Functions for managing medications

### Test Files
- `diary.test.js` - Test cases for diary utilities
- `medication.test.js` - Test cases for medication utilities
- `index.js` - Test runner for all utility tests

## Utility Functions Overview

### Diary Utilities (`diary.js`)

#### Functions:
- `getDiaryEntries()` - Get all diary entries
- `getDiaryEntryByDate(date)` - Get specific entry by date
- `createDiaryEntry(entry)` - Create a new diary entry
- `updateDiaryEntry(entry)` - Update existing diary entry
- `deleteDiaryEntry(date)` - Delete diary entry by date
- `saveDiaryEntry(entry)` - Create or update entry (upsert)
- `getDiaryEntriesInRange(startDate, endDate)` - Get entries in date range

#### Usage Example:
```javascript
import { getDiaryEntries, createDiaryEntry } from './utils/diary.js';

// Get all entries
const entries = await getDiaryEntries();

// Create new entry
const newEntry = {
  date: '2025-07-16',
  score: 7,
  limited: true,
  cluster: false,
  notes: ['Stress-related headache']
};
const created = await createDiaryEntry(newEntry);
```

### Medication Utilities (`medication.js`)

#### Functions:
- `getMedications()` - Get all medications
- `getMedicationByName(name)` - Get specific medication by name
- `createMedication(medication)` - Create new medication
- `updateMedication(medication)` - Update existing medication
- `deleteMedication(name)` - Delete medication by name
- `saveMedication(medication)` - Create or update medication (upsert)
- `getActiveMedications()` - Get only active medications
- `getMedicationsWithSideEffects()` - Get medications with side effects
- `deactivateMedication(name)` - Deactivate a medication
- `calculateTotalDailyDose(medication)` - Calculate total daily dose
- `createDose(morning, afternoon, evening)` - Helper to create dose object

#### Usage Example:
```javascript
import { getMedications, createMedication, createDose } from './utils/medication.js';

// Get all medications
const medications = await getMedications();

// Create new medication
const newMedication = {
  name: 'Ibuprofen',
  dose: createDose(200, 0, 200),
  active: true,
  start_date: '2025-07-16',
  side_effects: ['Stomach upset'],
  notes: ['Take with food']
};
const created = await createMedication(newMedication);
```

## API Configuration

The utilities are configured to connect to the backend API at `http://localhost:8000`. 

To change the API URL, modify the `API_BASE_URL` constant in both utility files:

```javascript
const API_BASE_URL = 'http://your-backend-url:port';
```

## Data Models

### Diary Entry
```javascript
{
  date: string,        // YYYY-MM-DD format
  score: number,       // 1-10 pain score
  limited: boolean,    // Activity limitation
  cluster: boolean,    // Cluster headache
  notes: string[]      // Optional notes array
}
```

### Medication
```javascript
{
  name: string,
  dose: {
    morning: number,
    afternoon: number,
    evening: number
  },
  active: boolean,
  start_date: string,  // YYYY-MM-DD format (optional)
  end_date: string,    // YYYY-MM-DD format (optional)
  side_effects: string[], // Optional
  notes: string[]      // Optional
}
```

## Running Tests

### Quick Test Run (No Setup Required)

1. Start the backend server:
   ```bash
   cd pyhead
   python -m uvicorn pyhead.main:app --reload
   ```

2. Open a browser and go to the frontend directory, then run:
   ```bash
   node src/tests/index.js
   ```

### Setting Up Proper Testing Framework

#### Option 1: Vitest (Recommended for Vite projects)

1. Install Vitest:
   ```bash
   npm install --save-dev vitest jsdom @vitest/ui
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

3. Create `vitest.config.js`:
   ```javascript
   import { defineConfig } from 'vitest/config'
   
   export default defineConfig({
     test: {
       environment: 'jsdom',
       globals: true,
     },
   })
   ```

4. Run tests:
   ```bash
   npm run test
   npm run test:ui  # For UI interface
   ```

#### Option 2: Jest

1. Install Jest:
   ```bash
   npm install --save-dev jest jsdom @testing-library/jest-dom
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest"
     },
     "jest": {
       "testEnvironment": "jsdom"
     }
   }
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Error Handling

All utility functions include proper error handling:

- Network errors are caught and re-thrown
- HTTP errors are handled appropriately
- 404 errors return `null` for get operations
- Validation errors from the backend are passed through
- All errors are logged to the console

## Integration with React Components

These utilities can be easily integrated into React components:

```jsx
import { useState, useEffect } from 'react';
import { getDiaryEntries, createDiaryEntry } from '../utils/diary.js';

function DiaryComponent() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getDiaryEntries();
        setEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleCreateEntry = async (entryData) => {
    try {
      const newEntry = await createDiaryEntry(entryData);
      setEntries([...entries, newEntry]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render entries and form */}
    </div>
  );
}
```

## Backend Requirements

Make sure your backend is running and accessible at the configured URL. The backend should provide the following endpoints:

### Diary Endpoints
- `GET /api/diary/` - Get all entries
- `GET /api/diary/{date}` - Get entry by date
- `POST /api/diary/` - Create new entry
- `PUT /api/diary/` - Update existing entry
- `DELETE /api/diary/{date}` - Delete entry

### Medication Endpoints
- `GET /api/medications/` - Get all medications
- `GET /api/medications/{name}` - Get medication by name
- `POST /api/medications/` - Create new medication
- `PUT /api/medications/` - Update existing medication
- `DELETE /api/medications/{name}` - Delete medication

### Health Check
- `GET /api/health` - Health check endpoint

## Contributing

When adding new utility functions:

1. Follow the existing error handling patterns
2. Add proper JSDoc comments
3. Include comprehensive tests
4. Update this README with new functions
5. Ensure all functions are properly exported

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS configured correctly
2. **Network Errors**: Check if the backend is running and accessible
3. **404 Errors**: Verify the API endpoints match the backend implementation
4. **Data Format Errors**: Ensure data sent matches the expected model format

### Debug Mode

To enable debug logging, you can modify the utility functions to include more detailed logging:

```javascript
const DEBUG = true;

if (DEBUG) {
  console.log('API Request:', url, options);
  console.log('API Response:', response);
}
```
