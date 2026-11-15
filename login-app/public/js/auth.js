/**
 * Shared helper used by all pages.
 * Sends a JSON POST request and returns the parsed response body.
 * Never throws — errors are returned as { success: false, message: '...' }.
 */

async function apiPost(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;

  } catch (err) {

    console.error('API request failed:', err);
    return { success: false, message: 'Network error. Please check your connection.' };
  }
}
