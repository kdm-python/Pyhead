import React, { useState, useEffect } from "react";
import { getMedications, createMedication } from "../utils/medication";
import MedicationCard from "../components/medication/MedicationCard";
import MedicationForm from "../components/medication/MedicationForm";
import SubmitButton from "../components/common/SubmitButton";
import "./MedicationPage.css"; // Optional: Add custom styles for the page

const MedicationPage = () => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getMedications().then((data) => {
      setMedications(data);
    });
  }, []);

  const handleDeleted = (name) =>
    setMedications((prev) => prev.filter((med) => med.name !== name));
  const toggleForm = () => setShowForm((prev) => !prev);
  const handleFormSubmit = async (data) => {
    try {
      const newMed = await createMedication(data);
      setMedications((prev) => [...prev, newMed]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  return (
    <div className="medication-page">
      <h1>Medication Page</h1>
      <div className="medication-card-container">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationCard
              key={medication.name}
              medication={medication}
              onDeleted={handleDeleted}
            />
          ))
        ) : (
          <p>Loading medications...</p>
        )}
      </div>
      <div className="mt-4 text-center">
        <SubmitButton
          label={showForm ? "Cancel" : "Add Medication"}
          onClick={toggleForm}
        />
      </div>
      {showForm && (
        <div className="mt-4">
          <MedicationForm onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default MedicationPage;
