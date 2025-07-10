import agentInstance from "./agentInstance";

export const getSeoChats = async () => {
    try {
        const response = await agentInstance.get(`/get-seo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSeoChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateSeoChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-seo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteSeoChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};