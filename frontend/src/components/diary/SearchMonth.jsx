import React, { useState } from "react";
import SelectMonthYear from "../common/SelectMonthYear";
import SubmitButton from "../common/SubmitButton";

const SearchMonth = ({ onSearch, onReset }) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    year: currentYear,
    month: new Date().getMonth() + 1 // JavaScript months are 0-indexed, but we want 1-12
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate year (between 1900 and current year + 5)
    if (formData.year < 1900 || formData.year > currentYear + 5) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 5}`;
    }
    
    // Validate month (between 1 and 12)
    if (formData.month < 1 || formData.month > 12) {
      newErrors.month = "Month must be between 1 and 12";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSearch(formData.year, formData.month);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Search by Month</h5>
        <form onSubmit={handleSubmit}>
          <SelectMonthYear
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-between">
            <SubmitButton label="Search" type="submit" />
            <SubmitButton 
              label="Reset" 
              onClick={(e) => {
                e.preventDefault();
                onReset();
              }}
              variant="secondary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchMonth;

