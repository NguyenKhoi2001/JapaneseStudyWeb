// QuillOutputComponent.js
import "./QuillOutputComponent.css"; // Adjusted path for output display specific styles

const QuillOutputComponent = ({ editorHtml }) => {
  return (
    <div className="raw-html-display">
      <h2>Raw HTML Output</h2>
      <div
        style={{
          width: "100%",
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
          marginTop: "20px",
        }}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
      ></div>
    </div>
  );
};

export default QuillOutputComponent;
