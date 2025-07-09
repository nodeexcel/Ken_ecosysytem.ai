import axiosInstance from "./axiosInstance";

export const appointmentSetter = async (payload) => {
    try {
        const response = await axiosInstance.post("http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/appointment-setter", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetter = async () => {
    try {
        const response = await axiosInstance.get("http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/appointment-setter-agents");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetterById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/appointment-setter-agent-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateAppointmentSetterStatus = async (id) => {
    try {
        const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/appointment-agent-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteAppointmentSetter = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/delete-appointment-agent/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateAppointmentSetter = async (payload) => {
    try {
        const response = await axiosInstance.put(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-appointment-agent/${payload.agent_id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const chatAgent = async (payload,id) => {
    try {
        const response= await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/chat-with-lead/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChats = async (status) => {
    try {
        const response= await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-chats?lead_status=${status}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChatHistory = async (id) => {
    try {
        const response= await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-chat-history/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getLeadAnalytics = async (path) => {
    try {
        const response= await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-lead-analytics${path}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const agentStatusChat = async (id) => {
    try {
        const response= await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/agent-status-for-chat/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const testAgentChat = async (payload,id) => {
    try {
        const response= await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/test-agent/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}