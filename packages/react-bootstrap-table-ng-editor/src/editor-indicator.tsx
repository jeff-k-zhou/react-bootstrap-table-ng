import React from "react";

interface EditorIndicatorProps {
  invalidMessage?: string;
}

const EditorIndicator = ({ invalidMessage }: EditorIndicatorProps) => (
  <div className="alert alert-danger in" role="alert" data-testid="editor-indicator">
    <strong>{invalidMessage}</strong>
  </div>
);

EditorIndicator.defaultProps = {
  invalidMessage: null,
};

export default EditorIndicator;
