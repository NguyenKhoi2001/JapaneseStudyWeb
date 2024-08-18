import React, { useEffect, useRef, useState } from "react";
import styles from "./css/UserProfilePage.module.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  fetchOtherUserData,
  updateUserProfile,
} from "../services/user/userSlice";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import LoadingPage from "./LoadingPage";
import fileToBase64 from "../utils/FileReaderBase64";
import { useNavigate, useParams } from "react-router-dom";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isViewingOtherUser = Boolean(userId);

  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(fetchOtherUserData(userId));
    } else {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
      } else {
        dispatch(fetchCurrentUser());
      }
    }
  }, [userId, dispatch, navigate]);

  //get user data from state
  const { t } = useTranslation("translation");
  const {
    currentUserData,
    otherUserData,
    error: reduxError,
  } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(
    isViewingOtherUser ? otherUserData : currentUserData
  );

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(
    userData.profilePicture
  );
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // State to handle loading status

  useEffect(() => {
    if (!currentUserData) {
      dispatch(fetchCurrentUser());
    } else {
      setUserData(currentUserData);
      setOriginalImageUrl(currentUserData.profilePicture);
      setImagePreviewUrl(currentUserData.profilePicture);
    }
  }, [currentUserData, dispatch]);

  const handleInputChange = (e) => {
    if (isViewingOtherUser) return;
    const { name, value } = e.target;
    const newValue =
      value === "Enabled" ? true : value === "Disabled" ? false : value;
    setUserData({
      ...userData,
      [name]: newValue,
      preferences: { ...userData.preferences, [name]: newValue },
    });
    setIsModified(true);
  };

  const handleImageSelection = (event) => {
    if (isViewingOtherUser) return;
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Please select an image.");
      setShowError(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageFile(file);
      setImagePreviewUrl(reader.result);
      setIsModified(true);
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveImage = () => {
    if (isViewingOtherUser) return;
    setSelectedImageFile(null);
    setImagePreviewUrl(originalImageUrl);
    setIsModified(true);
  };

  const handleSave = async () => {
    if (isViewingOtherUser) return;
    if (isModified) {
      setLoading(true); // Set loading to true
      let updateData = { ...userData };

      if (selectedImageFile) {
        try {
          const base64Image = await fileToBase64(selectedImageFile);
          updateData.imageFile = base64Image; // Ensure this matches what your backend expects
        } catch (error) {
          setError("Error converting image to Base64: " + error.message);
          setShowError(true);
          setLoading(false);
          return;
        }
      }

      // Dispatch the update profile action
      dispatch(
        updateUserProfile({
          userId: userData.userId,
          updateData,
        })
      )
        .unwrap()
        .then((updatedUser) => {
          setSuccessMessage("Changes saved successfully!");
          setOriginalImageUrl(updatedUser.profilePicture);
          setImagePreviewUrl(updatedUser.profilePicture);
          setShowSuccess(true);
          setSelectedImageFile(null); // Reset selected file
          setIsModified(false); // Reset isModified flag
        })
        .catch((error) => {
          setError("Failed to update profile. " + error.message);
          setShowError(true);
        })
        .finally(() => {
          setLoading(false); // Stop loading after save
        });
    }
  };
  const handleLanguageChange = (value) => {
    return;
  };

  return (
    <>
      <NavBar />
      {loading && <LoadingPage opacity={0.1} />}
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.userImage}>
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="User"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "75px",
                }}
              />
            ) : (
              <span>Select your image</span>
            )}
          </div>
          {!isViewingOtherUser && (
            <>
              <button
                className={styles.button}
                onClick={() => fileInputRef.current.click()}
              >
                Choose Picture
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelection}
                style={{ display: "none" }}
              />
              <button
                className={styles.button}
                onClick={handleRemoveImage}
                disabled={
                  !imagePreviewUrl || imagePreviewUrl === originalImageUrl
                }
              >
                Remove Picture
              </button>
            </>
          )}
        </div>
        <div className={styles.middlePanel}>
          {!isViewingOtherUser &&
            ["username", "email"].map((field) => (
              <div key={field}>
                <label className={styles.label}>
                  {t(`UserProfilePage.${field}`)}
                </label>
                <input
                  type="text"
                  name={field}
                  className={styles.input}
                  value={userData[field]}
                  onChange={handleInputChange}
                  readOnly={isViewingOtherUser}
                />
              </div>
            ))}
          {["displayName"].map((field) => (
            <div key={field}>
              <label className={styles.label}>
                {t(`UserProfilePage.${field}`)}
              </label>
              <input
                type="text"
                name={field}
                className={styles.input}
                value={userData[field]}
                onChange={handleInputChange}
                readOnly={isViewingOtherUser}
              />
            </div>
          ))}
          {["dateJoined", "lastLogin"].map((field) => (
            <div key={field}>
              <label className={styles.label}>
                {t(`UserProfilePage.${field}`)}
              </label>
              <input
                type="text"
                className={styles.input}
                value={new Date(userData[field]).toLocaleDateString()}
                readOnly
              />
            </div>
          ))}
          <div>
            <label className={styles.label}>
              {t("UserProfilePage.preferredLanguage")}
            </label>
            <select
              name="language"
              className={styles.input}
              value={userData.preferences.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              readOnly={isViewingOtherUser}
            >
              <option value="en">{t("UserProfilePage.English")}</option>
              <option value="vi">{t("UserProfilePage.Vietnamese")}</option>
              <option value="jp">{t("UserProfilePage.Japanese")}</option>
            </select>
          </div>
          {!isViewingOtherUser &&
            ["emailNotifications", "pushNotifications"].map((field) => (
              <div key={field}>
                <label className={styles.label}>
                  {t(`UserProfilePage.${field}`)}
                </label>
                <select
                  name={field}
                  className={styles.input}
                  value={userData.preferences[field] ? "Enabled" : "Disabled"}
                  onChange={handleInputChange}
                >
                  <option value="Enabled">
                    {t("UserProfilePage.Enabled")}
                  </option>
                  <option value="Disabled">
                    {t("UserProfilePage.Disabled")}
                  </option>
                </select>
              </div>
            ))}
          {!isViewingOtherUser && (
            <button
              className={styles.button}
              onClick={handleSave}
              disabled={!isModified}
            >
              {t("UserProfilePage.saveChanges")}
            </button>
          )}
        </div>
        <div className={styles.rightPanel}>
          {/* Placeholder for any additional content */}
        </div>
      </div>
      <SuccessAlert
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      <ErrorAlert
        message={reduxError || error}
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
      <Footer />
    </>
  );
};

export default UserProfilePage;
