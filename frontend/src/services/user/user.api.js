import { apiUrl } from "../api.config";
import fetchWrapper from "../fetchWrapper";

const API_URL = `${apiUrl}/api/users`;

export const createUser = async (userData) => {
  try {
    const response = await fetchWrapper(`${API_URL}/`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    localStorage.setItem("userToken", result.data.token);
    localStorage.setItem("userId", result.data.userId);
    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetchWrapper(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    localStorage.setItem("userToken", result.data.token);
    localStorage.setItem("userId", result.data.userId);
    return result;
  } catch (error) {
    throw error;
  }
};

// Fetch a user's private data (accessible only to the user or admin)
export const getPrivateUserData = async (userId) => {
  const response = await fetchWrapper(`${API_URL}/private/${userId}`);
  return await response.json();
};

// Fetch a user's public data (accessible to anyone)
export const getPublicUserData = async (userId) => {
  const response = await fetchWrapper(`${API_URL}/public/${userId}`);
  return await response.json();
};

// Fetch all users' data (publicly accessible)
export const getAllUsersData = async () => {
  const response = await fetchWrapper(`${API_URL}/all`);
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
