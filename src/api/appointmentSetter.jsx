import agentInstance from "./agentInstance";

export const appointmentSetter = async (payload) => {
    try {
        const response = await agentInstance.post("/appointment-setter", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetter = async () => {
    try {
        const response = await agentInstance.get("/appointment-setter-agents");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetterById = async (id) => {
    try {
        const response = await agentInstance.get(`/appointment-setter-agent-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateAppointmentSetterStatus = async (id) => {
    try {
        const response = await agentInstance.patch(`/appointment-agent-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteAppointmentSetter = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-appointment-agent/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateAppointmentSetter = async (payload) => {
    try {
        const response = await agentInstance.put(`/update-appointment-agent/${payload.agent_id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const chatAgent = async (payload,id) => {
    try {
        const response= await agentInstance.post(`/chat-with-lead/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChats = async (status) => {
    try {
        const response= await agentInstance.get(`/get-chats?lead_status=${status}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChatHistory = async (id) => {
    try {
        const response= await agentInstance.get(`/get-chat-history/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getLeadAnalytics = async (path) => {
    try {
        const response= await agentInstance.get(`/get-lead-analytics${path}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const agentStatusChat = async (id) => {
    try {
        const response= await agentInstance.patch(`/agent-status-for-chat/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const testAgentChat = async (payload,id) => {
    try {
        const response= await agentInstance.post(`/test-agent/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}