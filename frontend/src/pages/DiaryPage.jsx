import React, { useState, useEffect } from "react";
import { getDiaryEntries, createDiaryEntry, getDiaryEntriesByMonth } from "../utils/diary";
import DiaryCard from "../components/diary/DiaryCard";
import DiaryForm from "../components/diary/DiaryForm";
import SearchMonth from "../components/diary/SearchMonth";
import SubmitButton from "../components/common/SubmitButton";

const DiaryPage = () => {
  const [diaryEntries, setDiaryEntries] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMonthSearch, setShowMonthSearch] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    getDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  const handleDeleted = (date) =>
    setDiaryEntries((prev) => prev.filter((entry) => entry.date !== date));
    
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showMonthSearch) setShowMonthSearch(false);
  };
  
  const toggleMonthSearch = () => {
    setShowMonthSearch((prev) => !prev);
    if (showForm) setShowForm(false);
  };
  
  const handleFormSubmit = async (data) => {
    try {
      const newEntry = await createDiaryEntry(data);
      setDiaryEntries((prev) => [...prev, newEntry]);
      setShowForm(false);
    } catch (error) {
      if (error.status === 409) {
        alert("A diary entry for this date already exists. Please choose a different date or edit the existing entry.");
      } else {
        console.error("Error adding diary entry:", error);
        alert("An error occurred while adding the diary entry. Please try again.");
      }
    }
  };

  const handleMonthSearch = async (year, month) => {
    try {
      const monthEntries = await getDiaryEntriesByMonth(year, month);
      setDiaryEntries(monthEntries);
      setIsFiltered(true);
    } catch (error) {
      console.error("Error searching diary entries by month:", error);
      alert("An error occurred while searching diary entries. Please try again.");
    }
  };

  const handleResetSearch = async () => {
    try {
      const allEntries = await getDiaryEntries();
      setDiaryEntries(allEntries);
      setIsFiltered(false);
    } catch (error) {
      console.error("Error resetting diary entries:", error);
      alert("An error occurred while resetting diary entries. Please try again.");
    }
  };

  // Sort diary entries by date ascending (YYYY-MM-DD format assumed)
  const sortedEntries = diaryEntries
    ? [...diaryEntries].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="container py-4">
      <h1 className="mb-4">Diary Page</h1>
      
      <div className="d-flex justify-content-center gap-3 mb-4">
        <SubmitButton
          label={showForm ? "Cancel" : "Add Diary Entry"}
          onClick={toggleForm}
        />
        <SubmitButton
          label={showMonthSearch ? "Cancel Search" : "Search by Month"}
          onClick={toggleMonthSearch}
          variant={isFiltered ? "info" : "secondary"}
        />
        {isFiltered && (
          <SubmitButton
            label="Show All Entries"
            onClick={handleResetSearch}
            variant="outline-secondary"
          />
        )}
      </div>
      
      {showForm && (
        <div className="mt-4 mb-4">
          <DiaryForm onSubmit={handleFormSubmit} />
        </div>
      )}
      
      {showMonthSearch && (
        <div className="mt-4 mb-4">
          <SearchMonth onSearch={handleMonthSearch} onReset={handleResetSearch} />
        </div>
      )}
      
      {!diaryEntries ? (
        <div>Loading diary entries...</div>
      ) : diaryEntries.length === 0 ? (
        <div className="text-center mt-4">
          {isFiltered ? "No diary entries found for the selected month." : "No diary entries found."}
        </div>
      ) : (
        <div
          className="d-flex flex-wrap justify-content-start gap-3"
          style={{ rowGap: "24px", columnGap: "16px" }}
        >
          {sortedEntries.map((entry, idx) => (
            <div
              key={entry.date || idx}
              style={{ flex: "1 0 22%", maxWidth: "24%", minWidth: "260px", margin: "0 0 16px 0" }}
            >
              <DiaryCard entry={entry} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
