import React from 'react';

const NumberInput = ({ label, name, value, onChange, placeholder, error, min, max }) => {
  const handleInputChange = (e) => {
    // Parse the value to a number before passing it to the parent
    const numberValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    onChange(numberValue);
  };

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        type="number"
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default NumberInput;