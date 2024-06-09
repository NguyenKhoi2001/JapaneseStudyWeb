const fetchWrapper = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  // Include Authorization header only if a token exists
  const token = localStorage.getItem("userToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Directly handle non-OK responses to streamline error handling in API calls
    if (!response.ok) {
      if (response.status === 401 && token) {
        window.dispatchEvent(new CustomEvent("token-expired"));
      }
      // Attempt to parse error details from response, fallback to status text
      const errorInfo = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorInfo.message || "An error occurred while fetching data."
      );
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error; // Re-throw to allow calling function to handle or display error as needed
  }
};

export default fetchWrapper;
