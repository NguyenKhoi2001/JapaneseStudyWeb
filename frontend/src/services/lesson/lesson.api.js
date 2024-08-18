// lesson.api.js
import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/lessons`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchLessons = async () => {
  const response = await fetchWrapper(`${API_URL}/`);
  return handleResponse(response);
};

export const fetchLessonById = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const fetchResourceByLesson = async (id) => {
  const response = await fetchWrapper(`${API_URL}/resourceByLesson/${id}`);
  return handleResponse(response);
};

// This function sends a PUT request to modify items within a lesson.
export const modifyLessonItems = async (id, modifications) => {
  const response = await fetchWrapper(`${API_URL}/${id}/modifyItems`, {
    method: "PUT",
    body: JSON.stringify(modifications),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const addLesson = async (lessonData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(lessonData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const updateLesson = async (id, updates) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const deleteLesson = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
