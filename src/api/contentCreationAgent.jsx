import agentInstance from "./agentInstance";

export const getContentCreationChats = async () => {
    try {
        const response = await agentInstance.get(`/get-content-creation-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContentCreationChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateContentCreationChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-content-creation-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteContentCreationChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContent = async (payload) => {
    try {
        const response = await agentInstance.post(`/create-content`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const contentGenerationStatus = async (id) => {
    try {
        const response = await agentInstance.get(`/content-generation-status?content_id=${id}`,);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};