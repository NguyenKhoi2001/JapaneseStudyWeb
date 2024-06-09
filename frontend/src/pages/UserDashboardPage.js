import React, { useEffect, useState } from "react";
import styles from "./css/UserDashboardPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../services/user/userSlice";
import { uploadImageToCloudinary } from "../services/cloudinary.api"; // Adjust path as necessary

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProgressList from "../features/dashboard/ProgressList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUser } from "@fortawesome/free-solid-svg-icons";

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const { currentUserData: userData } = useSelector((state) => state.user);

  // Initialize local state for edit mode
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [imagePreview, setImagePreview] = useState(
    userData?.profilePicture || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeView, setActiveView] = useState("Profile");

  // Update local state when userData changes
  useEffect(() => {
    setDisplayName(userData?.displayName || "");
    setImagePreview(userData?.profilePicture || "");
  }, [userData]);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    let updatedData = { displayName };

    if (selectedFile) {
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(selectedFile);
        updatedData.profilePicture = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    console.log("check user id from userpage: " + userData.userId);
    dispatch(
      updateUserProfile({ userId: userData.userId, updateData: updatedData })
    );
    setEditMode(false);
  };

  const handleChange = (event) => {
    setDisplayName(event.target.value);
  };

  const getUserRole = (roles) =>
    roles?.includes("teacher") ? "Teacher" : "Student";

  // Inside your component
  if (!userData) {
    return <div>Loading...</div>; // Or any other loading indicator
  }
  return (
    <>
      <NavBar />
      <div className={styles.dashboard}>
        <div className={styles.navbar}>
          <ul>
            <li onClick={() => setActiveView("Profile")}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </li>
            <li onClick={() => setActiveView("Progress")}>
              <FontAwesomeIcon icon={faChartLine} /> Progress
            </li>
          </ul>
        </div>
        <div className={styles.contentWrapper}>
          {activeView === "Profile" && (
            <div className={styles.userInfo}>
              <h2>User Information</h2>
              <img
                src={imagePreview || userData.profilePicture}
                alt="Profile"
                className={styles.profilePic}
              />
              <p>Display Name: {displayName || userData.displayName}</p>
              <p>Date Joined: {userData.dateJoined}</p>
              <p>Last Login: {userData.lastLogin}</p>
              <p>Language: {userData.preferences.language}</p>
              <p>Role: {getUserRole(userData.roles)}</p>
              {editMode ? (
                <form onSubmit={handleSaveChanges} className={styles.editForm}>
                  <label>Display Name:</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={handleChange}
                  />
                  <label>Profile Picture:</label>
                  <input type="file" onChange={handleImageChange} />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={styles.previewPic}
                    />
                  )}
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={handleEditToggle}>
                    Cancel
                  </button>
                </form>
              ) : (
                <button onClick={handleEditToggle}>Edit</button>
              )}
            </div>
          )}
          {activeView === "Progress" && <ProgressList />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboardPage;
