import React, { FC } from 'react';

export interface InsertRowButtonProps {
  onInsert: (row: any) => void;
  initRow?: any | (() => any);
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const InsertRowButton: FC<InsertRowButtonProps> = ({
  onInsert,
  initRow,
  children,
  className = 'react-bs-table-add-btn btn btn-success',
  style
}) => {
  const handleClick = () => {
    let newRow = {};
    if (typeof initRow === 'function') {
      newRow = initRow();
    } else if (initRow) {
      newRow = { ...initRow };
    }
    
    onInsert(newRow);
  };

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children || 'New Row'}
    </button>
  );
};

export default InsertRowButton;
