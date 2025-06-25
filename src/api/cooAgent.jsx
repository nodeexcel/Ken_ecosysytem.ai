import axiosInstance from "./axiosInstance";

export const getCooChats = async () => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-coo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCooChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCooChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/update-coo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteCooChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};