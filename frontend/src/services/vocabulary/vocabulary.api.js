import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/vocabulary`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchVocabularies = async () => {
  const response = await fetchWrapper(`${API_URL}/`);
  return handleResponse(response);
};

export const fetchVocabularyById = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const addVocabulary = async (vocabularyData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(vocabularyData),
  });

  return handleResponse(response);
};

export const updateVocabulary = async (id, updates) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
};

export const deleteVocabulary = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
