import React from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/tabulator.min.css";

const MedicationTable = ({ medications }) => {
  if (!medications) return <div>Loading medications...</div>;

  // Flatten dose for display
  const data = medications.map((med) => ({
    ...med,
    morning: med.dose?.morning ?? "",
    afternoon: med.dose?.afternoon ?? "",
    evening: med.dose?.evening ?? "",
    side_effects: med.side_effects?.join(", ") ?? "",
    end_date: med.end_date || "-",
    notes: med.notes || "-",
  }));

  const columns = [
    { title: "Name", field: "name", headerFilter: true },
    { title: "Morning Dose", field: "morning", hozAlign: "center" },
    { title: "Afternoon Dose", field: "afternoon", hozAlign: "center" },
    { title: "Evening Dose", field: "evening", hozAlign: "center" },
    {
      title: "Active",
      field: "active",
      formatter: "tickCross",
      hozAlign: "center",
    },
    { title: "Start Date", field: "start_date" },
    { title: "End Date", field: "end_date" },
    { title: "Side Effects", field: "side_effects" },
    { title: "Notes", field: "notes" },
  ];

  return (
    <div>
      <ReactTabulator
        data={data}
        columns={columns}
        layout="fitColumns"
        options={{ movableColumns: true, pagination: false }}
      />
    </div>
  );
};

export default MedicationTable;
