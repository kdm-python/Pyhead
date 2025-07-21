import React from "react";
import NumberInput from "./NumberInput";

const SelectMonthYear = ({ formData, errors, onChange }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="row mb-3">
      <div className="col">
        <NumberInput
          label="Year"
          name="year"
          value={formData.year}
          onChange={(value) => onChange("year", value)}
          error={errors.year}
          min={1900}
          max={currentYear + 5}
        />
      </div>
      <div className="col">
        <NumberInput
          label="Month"
          name="month"
          value={formData.month}
          onChange={(value) => onChange("month", value)}
          error={errors.month}
          min={1}
          max={12}
        />
      </div>
    </div>
  );
};

export default SelectMonthYear;
