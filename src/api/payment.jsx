import axiosInstance from "./axiosInstance";

/**
 * Initiate a new subscription payment session.
 * @param {Object} payload - Subscription details.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const subscriptionPayment = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/payments/subscription-session", payload, {
            headers: { "Content-Type": "application/json" }
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Check the status of a checkout session.
 * @param {Object} payload - Session ID or payment reference.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const getSubscriptionPaymentStatus = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/payments/checkout-session", payload, {
            headers: { "Content-Type": "application/json" }
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * Update the status of a user’s subscription.
 * @param {Object} payload - Updated subscription info.
 * @param {string} token - Auth token for verification.
 * @returns {Promise<Object>} Axios response or error object.
 */
export const updateSubscriptionPaymentStatus = async (payload, token) => {
    try {
        const response = await axiosInstance.post("/api/payments/update-subscription", payload, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
