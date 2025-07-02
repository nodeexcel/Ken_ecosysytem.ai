import axiosInstance from "./axiosInstance";

export const getContentCreationChats = async () => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-content-creation-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContentCreationChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateContentCreationChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/update-content-creation-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteContentCreationChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};