import axiosInstance from "./axiosInstance";

export const getHrChats = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-hr-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getHrChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateHrChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/update-hr-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteHrChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};