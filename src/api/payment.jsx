import axiosInstance from "./axiosInstance";

export const subscriptionPayment = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/payments/subscription-session", payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return response
    } catch (error) {
        console.log(error)
    }
};

export const getSubscriptionPaymentStatus = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/payments/checkout-session", payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return response
    } catch (error) {
        console.log(error)
    }
};