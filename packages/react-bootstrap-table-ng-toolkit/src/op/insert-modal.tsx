import React, { FC, useState } from 'react';
import { ColumnDescription } from 'react-bootstrap-table-ng';

export interface InsertModalProps {
  columns: ColumnDescription[];
  onInsert: (row: any) => void;
  onClose: () => void;
  className?: string;
  headerText?: string;
  saveText?: string;
  closeText?: string;
}

const InsertModal: FC<InsertModalProps> = ({
  columns,
  onInsert,
  onClose,
  className = '',
  headerText = 'Add Record',
  saveText = 'Save',
  closeText = 'Cancel',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSave = () => {
    onInsert(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, dataField: string) => {
    setFormData((prev) => ({
      ...prev,
      [dataField]: e.target.value,
    }));
  };

  return (
    <div className={`modal react-bootstrap-table-insert-modal ${className}`} tabIndex={-1} role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{headerText}</h5>
            <button type="button" className="close btn-close" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {columns.map((col) => {
              // Usually we don't prompt columns explicitly marked as autoValue 
              if (col.isDummyField) return null;

              return (
                <div className="form-group mb-3" key={col.dataField as string}>
                  <label>{col.text}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData[col.dataField as string] || ''}
                    onChange={(e) => handleChange(e, col.dataField as string)}
                  />
                </div>
              );
            })}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {closeText}
            </button>
            <button type="button" className="btn btn-primary react-bs-table-add-save-btn" onClick={handleSave}>
              {saveText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertModal;
