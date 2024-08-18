import React, { useState } from "react";
import { uploadImageToCloudinary } from "../services/cloudinary.api"; // Adjust the path as necessary
import ErrorAlert from "../components/ErrorAlert"; // Adjust the path as necessary

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first!");
      setErrorVisible(true);
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToCloudinary(selectedFile);
      // Here you can set the image URL to some state or perform further actions with it
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrorMessage("Image upload failed: " + error.message); // Assuming 'error' has a 'message' property
      setErrorVisible(true);
    }
  };

  const handleCloseError = () => {
    setErrorVisible(false);
    setErrorMessage("");
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {errorVisible && (
        <ErrorAlert
          message={errorMessage}
          isVisible={errorVisible}
          onClose={handleCloseError}
        />
      )}
    </div>
  );
};

export default ImageUpload;
