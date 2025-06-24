import axiosInstance from "./axiosInstance";

export const getSeoChats = async () => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-seo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSeoChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateSeoChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/update-seo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteSeoChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};