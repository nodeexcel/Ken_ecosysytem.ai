import axiosInstance from "./axiosInstance";

export const getCooChats = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-coo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCooChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCooChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/update-coo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteCooChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};