const DEFAULT_SUMMARY_PATH = "/summary";

function withProtocol(url) {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  return `http://${url}`;
}

export function getBaseApiUrl() {
  const configuredUrl = process.env.REACT_APP_BACKEND_API_URL?.trim();
  if (!configuredUrl) return "";
  return withProtocol(configuredUrl).replace(/\/+$/, "");
}

export function getSummaryApiUrl() {
  const baseUrl = getBaseApiUrl();
  if (!baseUrl) return DEFAULT_SUMMARY_PATH;
  return `${baseUrl}${DEFAULT_SUMMARY_PATH}`;
}

export async function loginUser(email, password) {
  const response = await fetch(`${getBaseApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${getBaseApiUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
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
