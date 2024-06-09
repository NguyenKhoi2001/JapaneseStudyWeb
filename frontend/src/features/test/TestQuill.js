// TestQuill.js
import React, { useState } from "react";
import QuillEditorComponent from "./QuillEditorComponent";
import QuillOutputComponent from "./QuillOutputComponent";

const TestQuill = () => {
  const [editorHtml, setEditorHtml] = useState("");

  return (
    <div>
      <QuillEditorComponent setEditorHtml={setEditorHtml} />
      <QuillOutputComponent editorHtml={editorHtml} />
    </div>
  );
};

export default TestQuill;
