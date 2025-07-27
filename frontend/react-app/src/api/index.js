const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchAuthenticated(url, method = 'GET', headers = {}, body = null) {
    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }
    
    // Note: The Authorization header should be passed in from the calling function
    // which gets it from the AuthContext.

    const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

    if (!response.ok) {
        // Handle errors
        const errorDetail = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorDetail}`);
    }

    return response;
}