import agentInstance from "./agentInstance";

export const getHrChats = async () => {
    try {
        const response = await agentInstance.get(`/get-hr-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getHrChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateHrChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-hr-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteHrChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-hr-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};