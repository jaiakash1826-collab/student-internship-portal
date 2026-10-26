// Centralized API configuration and client helpers
const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = rawApiUrl.trim().replace(/\/+$/, '');

/**
 * Universal fetch wrapper for API endpoints.
 * Handles base URL resolution, headers, error parsing, and network failover.
 *
 * @param {string} endpoint - Path such as '/api/internships' or '/api/applications'
 * @param {RequestInit} [options] - Standard Fetch API options
 */
export async function fetchApi(endpoint, options = {}) {
  // Normalize endpoint to start with '/'
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Ensure /api is at the beginning of the path without duplicating
  const apiPath = cleanEndpoint.startsWith('/api')
    ? cleanEndpoint
    : `/api${cleanEndpoint}`;

  // Full URL: when API_BASE_URL is empty, uses relative path (Vite proxy in dev)
  const url = `${API_BASE_URL}${apiPath}`;

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    console.error('API Network Error:', networkError);
    throw new Error(
      'Unable to connect to the backend server. Please verify the API is running and CORS settings allow this origin.'
    );
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseError) {
      console.warn('JSON parsing error:', parseError);
      data = null;
    }
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    const errorMessage =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status} (${response.statusText})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  getInternships: () => fetchApi('/api/internships'),
  getInternshipById: (id) => fetchApi(`/api/internships/${id}`),
  getApplications: () => fetchApi('/api/applications'),
  submitApplication: (payload) =>
    fetchApi('/api/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  checkHealth: () => fetchApi('/api/health'),
};

export default api;
