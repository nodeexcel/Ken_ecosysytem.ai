import agentInstance from "./agentInstance";

export const getCustomerSupportChats = async () => {
    try {
        const response = await agentInstance.get(`/get-customer-support-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCustomerSupportChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-customer-support-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCustomerSupportChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-customer-support-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteCustomerSupportChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-customer-support-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};