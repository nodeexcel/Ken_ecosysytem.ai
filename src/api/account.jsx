import agentInstance from "./agentInstance";

export const getAccountingChats = async () => {
    try {
        const response = await agentInstance.get(`/get-accounting-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAccountingChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-accounting-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};