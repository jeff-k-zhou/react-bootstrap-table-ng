import React, { FC, useState } from 'react';
import { ColumnDescription } from 'react-bootstrap-table-ng';
import InsertModal from './insert-modal';

export interface InsertModalToggleProps {
  columns: ColumnDescription[];
  onInsert: (row: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  headerText?: string;
  saveText?: string;
  closeText?: string;
}

const InsertModalToggle: FC<InsertModalToggleProps> = ({
  columns,
  onInsert,
  children,
  className = 'react-bs-table-add-btn btn btn-success',
  style,
  ...modalProps
}) => {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={handleOpen}
      >
        {children || 'New Record'}
      </button>
      {show && (
        <InsertModal
          columns={columns}
          onInsert={onInsert}
          onClose={handleClose}
          {...modalProps}
        />
      )}
    </>
  );
};

export default InsertModalToggle;
