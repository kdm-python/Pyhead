import React from "react";

const SubmitButton = ({ label, onClick, variant = "primary", type = "button" }) => {
  const getButtonClass = () => {
    // Handle both "variant" and "outline-variant" formats
    if (variant.startsWith("outline-")) {
      return `btn btn-outline-${variant.substring(8)}`;
    }
    return `btn btn-${variant}`;
  };

  return (
    <button type={type} className={getButtonClass()} onClick={onClick}>
      {label}
    </button>
  );
};

export default SubmitButton;
