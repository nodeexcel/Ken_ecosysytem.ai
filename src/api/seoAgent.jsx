import axiosInstance from "./axiosInstance";

export const getSeoChats = async () => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-seo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSeoChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateSeoChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-seo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteSeoChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/delete-seo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};