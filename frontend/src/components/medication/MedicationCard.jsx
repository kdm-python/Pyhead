import React, { useState } from "react";
import "./MedicationCard.css";
import MedDeleteButton from "./MedDeleteButton";

const MedicationCard = ({ medication, onDeleted }) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => setCollapsed((prev) => !prev);

  return (
    <div className="medication-card position-relative">
      {/* Delete button positioned at top-right */}
      <div className="position-absolute top-0 end-0 m-2">
        <MedDeleteButton name={medication.name} onDeleted={onDeleted} />
      </div>
      <h2
        className="medication-title-collapsible"
        onClick={handleToggle}
        style={{ cursor: "pointer", userSelect: "none" }}
        title={collapsed ? "Show details" : "Hide details"}
      >
        {medication.name}
        <span style={{ marginLeft: 8, fontSize: "1rem" }}>
          {collapsed ? "▼" : "▲"}
        </span>
      </h2>
      {!collapsed && (
        <div className="medication-details">
          <p>
            <strong>Morning Dose:</strong> {medication.dose?.morning || "-"} mg
          </p>
          <p>
            <strong>Afternoon Dose:</strong> {medication.dose?.afternoon || "-"}{" "}
            mg
          </p>
          <p>
            <strong>Evening Dose:</strong> {medication.dose?.evening || "-"} mg
          </p>
          <p>
            <strong>Active:</strong> {medication.active ? "Yes" : "No"}
          </p>
          <p>
            <strong>Start Date:</strong> {medication.start_date}
          </p>
          <p>
            <strong>End Date:</strong> {medication.end_date || "Ongoing"}
          </p>
          <p>
            <strong>Side Effects:</strong>{" "}
            {medication.side_effects?.join(", ") || "None"}
          </p>
          <p>
            <strong>Notes:</strong> {medication.notes || "No notes available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
