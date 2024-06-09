import {CLOUDINARY_URL,UPLOAD_PRESET} from "./api.config";


/**
 * Uploads an image file to Cloudinary.
 *
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - A promise that resolves with the URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
