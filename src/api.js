const DEFAULT_SUMMARY_PATH = "/summary";

function withProtocol(url) {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  return `http://${url}`;
}

export function getSummaryApiUrl() {
  const configuredUrl = process.env.REACT_APP_BACKEND_API_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_SUMMARY_PATH;
  }

  const normalizedUrl = withProtocol(configuredUrl);

  return normalizedUrl.endsWith("/summary")
    ? normalizedUrl
    : `${normalizedUrl.replace(/\/+$/, "")}${DEFAULT_SUMMARY_PATH}`;
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
export function getAuthApiUrl(endpoint) {
  const configuredUrl = process.env.REACT_APP_AUTH_API_URL?.trim() || "http://localhost:5001";
  const normalizedUrl = withProtocol(configuredUrl);
  return `${normalizedUrl.replace(/\/+$/, "")}/api/auth/${endpoint.replace(/^\/+/, "")}`;
}

export async function loginUser(email, password) {
  const response = await fetch(getAuthApiUrl("login"), {
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

export async function signupUser(user_data) {
  const response = await fetch(getAuthApiUrl("signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user_data)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
}
