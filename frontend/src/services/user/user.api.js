import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/users`;

export const createUser = async (userData) => {
  const response = await fetchWrapper(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  localStorage.setItem("userToken", data.token);
  localStorage.setItem("userId", data.userId);
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetchWrapper(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  localStorage.setItem("userToken", data.token);
  localStorage.setItem("userId", data.userId);
  return data;
};

export const getUser = async (userId) => {
  console.log("user Id: " + userId);
  const response = await fetchWrapper(`${API_URL}/${userId}`);
  return await response.json();
};

export const updateUser = async (userId, updateData) => {
  const response = await fetchWrapper(`${API_URL}/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
  return await response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetchWrapper(`${API_URL}/${userId}`, {
    method: "DELETE",
  });
  return await response.json();
};

export const createAdmin = async (userData) => {
  const response = await fetchWrapper(`${API_URL}/admin`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return await response.json();
};
