import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./QuillOutputComponent.css"; // Adjust the path for editor styles

const QuillEditorComponent = ({ setEditorHtml }) => {
  return (
    <div className="editor-with-toolbar">
      <ReactQuill
        onChange={(content, delta, source, editor) =>
          setEditorHtml(editor.getHTML())
        }
        modules={QuillEditorComponent.modules}
        formats={QuillEditorComponent.formats}
        bounds={".app"}
        placeholder="Write something or paste HTML here..."
      />
    </div>
  );
};

QuillEditorComponent.modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }], // Keeping font size options
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
  clipboard: {
    matchVisual: false,
  },
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
  // Notice the 'header' format has been removed
];

export default QuillEditorComponent;
