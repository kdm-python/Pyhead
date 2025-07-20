import React, { useState } from 'react';
import { deleteMedication } from '../../utils/medication';
import DeletePopup from '../common/DeletePopup';

const MedDeleteButton = ({ name, onDeleted }) => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const handleConfirm = async () => {
    try {
      await deleteMedication(name);
      onDeleted && onDeleted(name);
    } catch (error) {
      console.error('Failed to delete medication:', error);
      alert('Failed to delete medication.');
    } finally {
      closePopup();
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={openPopup}
      >
        Delete
      </button>
      <DeletePopup
        show={showPopup}
        message={`Are you sure you want to delete ${name}?`}
        onConfirm={handleConfirm}
        onCancel={closePopup}
      />
    </>
  );
};

export default MedDeleteButton;
