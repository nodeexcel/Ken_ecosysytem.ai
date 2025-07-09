import axiosInstance from "./axiosInstance";

export const getAccountingChats = async () => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-accounting-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAccountingChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-accounting-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/delete-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};