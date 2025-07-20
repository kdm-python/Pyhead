import React from "react";

const SubmitButton = ({ label, onClick }) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      {label}
    </button>
  );
};

export default SubmitButton;
