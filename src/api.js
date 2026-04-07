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
