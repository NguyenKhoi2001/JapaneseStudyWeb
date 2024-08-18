import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/questions`;

const handleResponse = async (response) => {
  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Something went wrong");
  }
};

export const fetchQuestions = async () => {
  const response = await fetchWrapper(`${API_URL}/`);
  return handleResponse(response);
};

export const fetchQuestionById = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const fetchQuestionsByLesson = async (lessonId) => {
  const response = await fetchWrapper(
    `${API_URL}/lesson-questions/${lessonId}`
  );
  return handleResponse(response);
};

export const fetchQuestionsByLevel = async (levelId) => {
  const response = await fetchWrapper(`${API_URL}/level-questions/${levelId}`);
  return handleResponse(response);
};

export const fetchCustomQuestionsFromLesson = async (lessonId, params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetchWrapper(
    `${API_URL}/custom-lesson-questions/${lessonId}?${query}`
  );
  return handleResponse(response);
};

export const fetchCustomQuestionsFromLevel = async (levelId, params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetchWrapper(
    `${API_URL}/custom-level-questions/${levelId}?${query}`
  );
  return handleResponse(response);
};

export const addQuestion = async (questionData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });
  return handleResponse(response);
};

export const updateQuestion = async (id, updates) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteQuestion = async (id) => {
  const response = await fetchWrapper(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
