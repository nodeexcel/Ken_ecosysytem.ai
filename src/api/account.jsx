import axiosInstance from "./axiosInstance";

export const getAccountingChats = async () => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-accounting-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAccountingChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-accounting-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};