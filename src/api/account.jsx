import axiosInstance from "./axiosInstance";

export const getAccountingChats = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-accounting-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAccountingChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-accounting-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/update-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};