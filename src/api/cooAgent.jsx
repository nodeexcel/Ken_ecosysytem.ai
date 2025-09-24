import agentInstance from "./agentInstance";

export const getCooChats = async () => {
    try {
        const response = await agentInstance.get(`/get-coo-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCooChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCooChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-coo-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteCooChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-coo-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};