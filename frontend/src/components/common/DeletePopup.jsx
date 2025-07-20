import React from 'react';

const DeletePopup = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                No
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePopup;
