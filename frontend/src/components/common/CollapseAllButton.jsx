import React from "react";
import PropTypes from "prop-types";
import SubmitButton from "./SubmitButton";

const CollapseAllButton = ({ label, onClick }) => (
  <SubmitButton 
    label={label} 
    onClick={onClick}
    variant="secondary"
  />
);

CollapseAllButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default CollapseAllButton;
