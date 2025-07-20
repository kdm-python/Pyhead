import React, { useState } from 'react';
import { deleteDiaryEntry } from '../../utils/diary';
import DeletePopup from '../common/DeletePopup';

const DiaryDeleteButton = ({ date, onDeleted }) => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const handleConfirm = async () => {
    try {
      await deleteDiaryEntry(date);
      onDeleted && onDeleted(date);
    } catch (error) {
      console.error('Failed to delete diary entry:', error);
      alert('Failed to delete diary entry.');
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
        message={`Are you sure you want to delete the diary entry for ${date}?`}
        onConfirm={handleConfirm}
        onCancel={closePopup}
      />
    </>
  );
};

export default DiaryDeleteButton;