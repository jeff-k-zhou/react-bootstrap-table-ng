import React, { FC, useState } from 'react';

export interface DeleteRowButtonProps {
  onDelete: () => void;
  getSelections?: () => any[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DeleteRowButton: FC<DeleteRowButtonProps> = ({
  onDelete,
  getSelections,
  children,
  className = 'react-bs-table-del-btn btn btn-danger',
  style
}) => {
  const [show, setShow] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);

  const handleOpen = () => {
    const selections = getSelections ? getSelections() : [1];
    setSelectionCount(selections.length);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleConfirm = () => {
    onDelete();
    handleClose();
  };

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={handleOpen}
      >
        {children || 'Delete Selected Rows'}
      </button>

      {show && (
        <div className="modal react-bootstrap-table-delete-modal" tabIndex={-1} role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="close btn-close" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {selectionCount > 0 ? (
                  <p>Are you sure to delete {selectionCount} selected rows?</p>
                ) : (
                  <p>No row selected to delete!</p>
                )}
              </div>
              <div className="modal-footer">
                {selectionCount > 0 ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                      Confirm
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteRowButton;
