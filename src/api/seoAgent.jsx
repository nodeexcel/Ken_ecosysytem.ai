import axiosInstance from "./axiosInstance";

export const getSeoChats = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-seo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSeoChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateSeoChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/update-seo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteSeoChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};