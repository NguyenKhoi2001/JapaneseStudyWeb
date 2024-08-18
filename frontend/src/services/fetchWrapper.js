const fetchWrapper = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = localStorage.getItem("userToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      if (response.status === 401 && token) {
        window.dispatchEvent(new CustomEvent("token-expired"));
      }

      const errorBody = await response.json().catch(() => ({
        error: `Failed to fetch, server might been down: ${response.status} ${response.statusText}`,
      }));

      const errorMessage =
        errorBody.error && errorBody.error.message
          ? errorBody.error.message // Use only the specific error message if available
          : `Error ${response.status}: ${response.statusText}`; // Fallback to generic message

      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    throw error; // Rethrow the error to be handled by calling function
  }
};

export default fetchWrapper;
