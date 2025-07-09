import axiosInstance from "./axiosInstance";

export const getContentCreationChats = async () => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-content-creation-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContentCreationChatById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateContentCreationChatName = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-content-creation-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteContentCreationChat = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/delete-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContent = async (payload) => {
    try {
        const response = await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/create-content`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const contentGenerationStatus = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/content-generation-status?content_id=${id}`,);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};