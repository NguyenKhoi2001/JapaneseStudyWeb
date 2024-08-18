import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/levels`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchLevels = async () => {
  const response = await fetchWrapper(`${API_URL}/`);
  return handleResponse(response);
};

export const fetchLevelById = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const fetchLessonsByLevelId = async (levelId) => {
  const response = await fetchWrapper(`${API_URL}/lessonsByLevel/${levelId}`);
  return handleResponse(response);
};

export const addLevel = async (levelData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(levelData),
  });
  return handleResponse(response);
};

export const updateLevel = async (id, updates) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteLevel = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
