// Get API URL from environment variable
// In production (on Fly.io), this will be empty string (use relative URLs)
// In development, this will be http://localhost:8080
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to build full URL
export const apiUrl = (endpoint: string): string => {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
};

// API client with common fetch wrapper
export const api = {
    async get(endpoint: string) {
        const response = await fetch(apiUrl(endpoint), {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    async post(endpoint: string, data?: any) {
        const response = await fetch(apiUrl(endpoint), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    async delete(endpoint: string) {
        const response = await fetch(apiUrl(endpoint), {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    },
};