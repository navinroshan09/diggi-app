const DEFAULT_SUMMARY_PATH = "/summary";

function withProtocol(url) {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  return `http://${url}`;
}

export function getBaseApiUrl() {
  const configuredUrl = process.env.REACT_APP_BACKEND_API_URL?.trim();
  console.log("DEBUG: REACT_APP_BACKEND_API_URL =", configuredUrl);
  if (!configuredUrl) {
    console.warn("WARNING: REACT_APP_BACKEND_API_URL is not defined in .env");
    return "";
  }
  const url = withProtocol(configuredUrl).replace(/\/+$/, "");
  console.log("DEBUG: Resolved Base API URL =", url);
  return url;
}

export function getSummaryApiUrl() {
  const baseUrl = getBaseApiUrl();
  if (!baseUrl) return DEFAULT_SUMMARY_PATH;
  return `${baseUrl}${DEFAULT_SUMMARY_PATH}`;
}

function getJsonErrorMessage(data, fallback) {
  if (!data) return fallback;
  return data.detail || data.error || data.message || fallback;
}

export async function loginUser(email, password) {
  const url = `${getBaseApiUrl()}/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(getJsonErrorMessage(data, "Login failed"));
    }
    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please ensure the backend is running and reachable.");
    }
    throw error;
  }
}

export async function registerUser(userData) {
  const url = `${getBaseApiUrl()}/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(getJsonErrorMessage(data, "Registration failed"));
    }
    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please ensure the backend is running and reachable.");
    }
    throw error;
  }
}

export async function fetchUserProfile(email) {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/profile?email=${encodeURIComponent(email)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(getJsonErrorMessage(data, "Failed to load profile"));
  }

  return data;
}

export async function updateUserProfile(profileData) {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/profile`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(getJsonErrorMessage(data, "Failed to update profile"));
  }

  return data;
}

export async function fetchSummaryPreview(query) {
  const response = await fetch(getSummaryApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}
