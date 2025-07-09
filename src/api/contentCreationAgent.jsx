import axiosInstance from "./axiosInstance";

export const getContentCreationChats = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-content-creation-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContentCreationChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateContentCreationChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/update-content-creation-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteContentCreationChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContent = async (payload) => {
    try {
        const response = await axiosInstance.post(`https://agents.ecosysteme.ai/create-content`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const contentGenerationStatus = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/content-generation-status?content_id=${id}`,);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};