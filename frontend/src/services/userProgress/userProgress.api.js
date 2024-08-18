// userProgressAPI.js

import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/userProgress`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchUserProgressByUser = async (userId) => {
  const response = await fetchWrapper(`${API_URL}/user/${userId}`);
  return handleResponse(response);
};

export const addUserProgress = async (progressData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(progressData),
  });
  return handleResponse(response);
};

export const canStartLesson = async (userId, lessonId) => {
  const url = userId
    ? `${API_URL}/canStart/${lessonId}?userId=${userId}`
    : `${API_URL}/canStart/${lessonId}`;
  const response = await fetchWrapper(url);
  return handleResponse(response);
};

export const calculateLevelProgress = async (userId, levelId) => {
  const response = await fetchWrapper(
    `${API_URL}/progress/${userId}/${levelId}`
  );
  return handleResponse(response);
};
