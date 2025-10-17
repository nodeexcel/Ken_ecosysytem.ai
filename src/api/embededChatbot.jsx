import agentInstance from "./agentInstance";

export const createConversationByAgentId = async (agent_id, session_id, payload) => {
    try {
        const response = await agentInstance.post(`/smartbot/create-conversation/${agent_id}/${session_id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const chatWithChatId = async (chat_id, payload) => {
    try {
        const response = await agentInstance.post(`/smartbot/chat/${chat_id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getEmbededChatbotByAgentId = async (agent_id) => {
    try {
        const response = await agentInstance.get(`/smartbot-info/${agent_id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getChatByChatId = async (chat_id) => {
    try {
        const response = await agentInstance.get(`/customer-support-history/get-chat-history/${chat_id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
