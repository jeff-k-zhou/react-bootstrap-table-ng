import React from "react";

interface EditorIndicatorProps {
  invalidMessage?: string;
}

const EditorIndicator = ({ invalidMessage }: EditorIndicatorProps) => (
  <div className="alert alert-danger in" role="alert" data-testid="editor-indicator">
    <strong>{invalidMessage}</strong>
  </div>
);


export default EditorIndicator;
