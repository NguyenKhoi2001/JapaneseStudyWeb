import {
  CLOUDINARY_URL,
  CLOUDINARY_API_KEY,
  UPLOAD_PRESET,
} from "./api.config";

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`${CLOUDINARY_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url && data.public_id) {
      return { url: data.secure_url, publicId: data.public_id };
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
  const formData = new FormData();
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("public_id", publicId);
  formData.append("timestamp", Math.floor(Date.now() / 1000));
  formData.append("signature", generateSignature(publicId));

  try {
    const response = await fetch(`${CLOUDINARY_URL}/destroy`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.result === "ok") {
      return { message: "Image deleted successfully" };
    } else {
      throw new Error("Cloudinary delete failed");
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Simplified function to 'generate' a signature
const generateSignature = (publicId) => {
  const timestamp = Math.floor(Date.now() / 1000);
  // This is NOT secure and is just a placeholder. Hashing will be done in the future
  return `sig_placeholder_for_${publicId}_${timestamp}`;
};
