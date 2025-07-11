import axiosInstance from "./axiosInstance";

export const getHrChats = async () => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-hr-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getHrChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateHrChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/update-hr-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteHrChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};