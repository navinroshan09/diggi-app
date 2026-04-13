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

export async function loginUser(email, password) {
  const url = `${getBaseApiUrl()}/login`;
  console.log("DEBUG: Logging in at", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    return data;
  } catch (error) {
    console.error("DEBUG: Login error details:", error);
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please ensure the backend is running and reachable.");
    }
    throw error;
  }
}

export async function registerUser(userData) {
  const url = `${getBaseApiUrl()}/register`;
  console.log("DEBUG: Registering user at", url);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }
    return data;
  } catch (error) {
    console.error("DEBUG: Registration error details:", error);
    throw error;
  }
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
