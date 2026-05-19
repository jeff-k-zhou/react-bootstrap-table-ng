import React from "react";

interface EditorIndicatorProps {
  invalidMessage?: string;
  /** Linked from the editor input via aria-describedby — WCAG 3.3.1 */
  id?: string;
}

const EditorIndicator = ({ invalidMessage, id }: EditorIndicatorProps) => (
  <div id={id} className="alert alert-danger in" role="alert" aria-live="assertive" aria-atomic="true" data-testid="editor-indicator">
    <strong>{invalidMessage}</strong>
  </div>
);


export default EditorIndicator;
