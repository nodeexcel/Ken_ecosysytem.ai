import axiosInstance from "./axiosInstance";

/**
 * Check if the user's email/profile exists.
 * @param {Object} payload - Email or user identifier.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const getEmailVerify = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/check-profile", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Perform user login with credentials.
 * @param {Object} payload - Login credentials (e.g., email and password).
 * @returns {Promise<Object>} Axios response or error object.
 */
export const login = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Perform Google OAuth login.
 * @param {Object} payload - Google login data (e.g., token).
 * @returns {Promise<Object>} Axios response or error object.
 */
export const googleLogin = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/google-login", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Verify OTP code sent to user.
 * @param {Object} payload - OTP verification data.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const getOTPVerify = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/verify-otp", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Set new password after verification.
 * @param {Object} payload - New password details.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const setPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/set-password", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Request password reset.
 * @param {Object} payload - Email or user identifier.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const forgotPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/password/request-reset", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Reset password using reset token.
 * @param {Object} payload - New password and reset token.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const resetPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/password/reset", payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Update user password after authentication.
 * @param {Object} payload - Password update details.
 * @param {string} token - Auth token for verification.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const updatePassword = async (payload, token) => {
    try {
        const response = await axiosInstance.post("/api/password/set-new", payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.get("/api/auth/logout/")
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
