// API Configuration
const API_BASE_URL = 'http://localhost:3254/api';

// Helper function for making API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication API
export const authAPI = {
    register: (email, password, fullName) =>
        apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName }),
        }),

    login: (email, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    adminLogin: (password) =>
        apiCall('/auth/admin-login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        }),
};

// User API
// User API
export const userAPI = {
    getUser: (id) => apiCall(`/users/${id}`),

    updateUser: (id, updates) =>
        apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),

    changePassword: (id, password) =>
        apiCall(`/users/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ password }),
        }),

    // Admin methods
    getAllUsers: () => apiCall('/users'),
    deleteUser: (id) => apiCall(`/users/${id}`, { method: 'DELETE' }),
};

// Tour API
export const tourAPI = {
    getAllTours: () => apiCall('/tours'),

    getTour: (id) => apiCall(`/tours/${id}`),

    createTour: (tourData) =>
        apiCall('/tours', {
            method: 'POST',
            body: JSON.stringify(tourData),
        }),

    updateTour: (id, updates) =>
        apiCall(`/tours/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),

    deleteTour: (id) =>
        apiCall(`/tours/${id}`, {
            method: 'DELETE',
        }),

    initializeTours: (tours) =>
        apiCall('/tours/init', {
            method: 'POST',
            body: JSON.stringify({ tours }),
        }),
};

// Booking API
export const bookingAPI = {
    getBookings: (userId, isAdmin = false) =>
        apiCall(`/bookings?userId=${userId || ''}&isAdmin=${isAdmin}`),

    createBooking: (userId, bookingData) =>
        apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify({ userId, ...bookingData }),
        }),

    updateBookingStatus: (id, status, userId) =>
        apiCall(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status, userId }),
        }),
};

// Support API
export const supportAPI = {
    getMessages: (userId, isAdmin = false) =>
        apiCall(`/support?userId=${userId || ''}&isAdmin=${isAdmin}`),

    sendMessage: (userId, message) =>
        apiCall('/support', {
            method: 'POST',
            body: JSON.stringify({ userId, message }),
        }),

    updateMessage: (id, userId, updates) =>
        apiCall(`/support/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ userId, ...updates }),
        }),
};

// Favourites API
export const favouritesAPI = {
    toggleFavourite: (userId, tourId) =>
        apiCall('/favourites/toggle', {
            method: 'POST',
            body: JSON.stringify({ userId, tourId }),
        }),
};
