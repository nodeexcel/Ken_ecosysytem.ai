import agentInstance from "./agentInstance";

export const getCustomerSupportChats = async () => {
    try {
        const response = await agentInstance.get(`/get-customer-support-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCustomerSupportChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-customer-support-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCustomerSupportChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-customer-support-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteCustomerSupportChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-customer-support-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createSmartBot = async (payload) => {
    try {
        const response = await agentInstance.post(`/create-smartbot`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSmartBots = async () => {
    try {
        const response = await agentInstance.get(`/get-smartbots`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

// get smart bot by id

export const getSmartBotById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-smartbot/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

// update smart bot

export const updateSmartbot = async (id,payload) => {
    try {
        const response = await agentInstance.put(`/smartbot/${id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

//delete smart bot 

export const deleteSmartChatBotById = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-smartbot/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

//get all avatar

export const getAvatars = async () => {
    try {
        const response = await agentInstance.get(`/get-avatars`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

// export const addAvatars = async (payload) => {
//     try {
//         const response = await agentInstance.post(`/add-avatar`,payload);
//         return response;
//     } catch (error) {
//         console.error(error);
//         return error;
//     }
// };

// add avatar

export const addAvatars = async (payload) => {
  try {
    const response = await agentInstance.post(`/add-avatar`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Upload error:", error);
    return error;
  }
};

// website link 

export const intregateWebsiteChat = async (payload) => {
    try {
        const response = await agentInstance.post(`/link-smartbot`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const intregateWebsiteChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-website/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateWebsiteChatById = async (id,payload) => {
    try {
        const response = await agentInstance.put(`/update-link/${id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
//test chat bot agent

export const testChatBotById = async (id,payload) => {
    try {
        const response = await agentInstance.post(`/test-chat/${id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

//get can by Agent id
export const getSmartbotChatByAgentId = async (id) => {
    try {
        const response = await agentInstance.get(`/get-smartbot-chats/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getSmartbotchatByChatId = async (chat_id) => {
    try {
        const response = await agentInstance.get(`/get-smartbot-chat-history/${chat_id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteSmartBotChatById = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-smartbot-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const intregrateWhatsapp = async (agent_id, payload) => {
    try {
        const response = await agentInstance.post(`/link-customer-support/whatsapp/${agent_id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};





