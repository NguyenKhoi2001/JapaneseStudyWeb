import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./css/QuillEditorComponent.module.css"; // Import the CSS module

const QuillEditorComponent = ({ setEditorHtml, initialHtml, placeholder }) => {
  const [html, setHtml] = useState(initialHtml);

  // Update internal state when initialHtml changes
  useEffect(() => {
    setHtml(initialHtml);
  }, [initialHtml]);

  useEffect(() => {
    setEditorHtml(html);
  }, [html, setEditorHtml]);

  return (
    <div className={styles.editorWithToolbar}>
      <ReactQuill
        value={html}
        onChange={setHtml}
        modules={QuillEditorComponent.modules}
        formats={QuillEditorComponent.formats}
        bounds={".app"}
        placeholder={placeholder || "Write some content here..."}
      />
    </div>
  );
};

QuillEditorComponent.modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }], // Add other toolbar options as necessary
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

QuillEditorComponent.formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
  "direction",
  "formula",
];

export default QuillEditorComponent;
