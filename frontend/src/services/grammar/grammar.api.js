// grammar.api.js
import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/grammar`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchGrammars = async () => {
  const response = await fetchWrapper(`${API_URL}/`);
  return handleResponse(response);
};

export const fetchGrammarById = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const addGrammar = async (grammarData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(grammarData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const updateGrammar = async (id, updates) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const deleteGrammar = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
