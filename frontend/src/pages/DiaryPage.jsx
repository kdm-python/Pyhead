import React, { useState, useEffect } from "react";
import { getDiaryEntries, createDiaryEntry } from "../utils/diary";
import DiaryCard from "../components/diary/DiaryCard";
import DiaryForm from "../components/diary/DiaryForm";
import SubmitButton from "../components/common/SubmitButton";

const DiaryPage = () => {
  const [diaryEntries, setDiaryEntries] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  const handleDeleted = (date) =>
    setDiaryEntries((prev) => prev.filter((entry) => entry.date !== date));
    
  const toggleForm = () => setShowForm((prev) => !prev);
  
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

  // Sort diary entries by date ascending (YYYY-MM-DD format assumed)
  const sortedEntries = diaryEntries
    ? [...diaryEntries].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="container py-4">
      <h1 className="mb-4">Diary Page</h1>
      
      {!diaryEntries ? (
        <div>Loading diary entries...</div>
      ) : diaryEntries.length === 0 ? (
        <div>No diary entries found.</div>
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
      
      <div className="mt-4 text-center">
        <SubmitButton
          label={showForm ? "Cancel" : "Add Diary Entry"}
          onClick={toggleForm}
        />
      </div>
      
      {showForm && (
        <div className="mt-4">
          <DiaryForm onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
