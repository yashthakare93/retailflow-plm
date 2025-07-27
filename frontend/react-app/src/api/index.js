
// VITE_APP_API_BASE_URL will be set by .env.development (for local) or Vercel env vars (for production).
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080/api';

// Helper function to make authenticated fetch requests to the backend.
// It automatically adds Content-Type: application/json and Basic Authorization header if credentials are provided.
export async function fetchAuthenticated(url, method = 'GET', customHeaders = {}, body = null, username = null, password = null) {
    // Build the fetch options object
    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json', // Default Content-Type for JSON payloads
            ...customHeaders, // Merge any custom headers provided by the caller
        },
    };

    // If a request body is provided, stringify it to JSON
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    // If username and password are provided, add Basic Authentication header
    if (username && password) {
        const base64Credentials = btoa(`${username}:${password}`); // Base64 encode credentials
        fetchOptions.headers['Authorization'] = `Basic ${base64Credentials}`;
    }

    // Perform the fetch request to the constructed URL
    const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

    // Check if the response was successful (HTTP status 200-299)
    if (!response.ok) {
        let errorDetail = 'Unknown error';
        // Try to parse the error response as JSON to get a more detailed message
        try {
            const errorJson = await response.json();
            errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
        } catch (e) {
            // If JSON parsing fails, fallback to plain text error message
            errorDetail = await response.text();
        }
        // Throw an error with status and detail for the caller to catch
        throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorDetail}`);
    }

    // Return the response object for further processing (e.g., parsing JSON body)
    return response;
}
