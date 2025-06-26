import axiosInstance from "./axiosInstance";

/**
 * Update user profile information.
 * @param {FormData} payload - User data to update.
 * @param {string} token - Auth token for verification.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const updateProfile = async (payload) => {
    try {
        const response = await axiosInstance.put("/api/users/profile", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Get the current user’s profile data.
 * @param {string} token - Auth token for verification.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const getProfile = async () => {
    try {
        const response = await axiosInstance.get("/api/users/profile");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteProfile = async () => {
    try {
        const response = await axiosInstance.delete("/api/auth/delete-user");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const changeLanguage = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/change-language", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
