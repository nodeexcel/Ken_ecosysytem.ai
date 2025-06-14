import axiosInstance from "./axiosInstance";

export const appointmentSetter = async (payload) => {
    try {
        const response = await axiosInstance.post("http://116.202.210.102:8000/appointment-setter", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetter = async () => {
    try {
        const response = await axiosInstance.get("http://116.202.210.102:8000/appointment-setter-agents");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetterById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/appointment-setter-agent-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateAppointmentSetterStatus = async (id) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/appointment-agent-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteAppointmentSetter = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-appointment-agent/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateAppointmentSetter = async (payload) => {
    try {
        const response = await axiosInstance.put(`http://116.202.210.102:8000/update-appointment-agent/${payload.agent_id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const chatAgent = async (payload,id) => {
    try {
        const response= await axiosInstance.post(`http://116.202.210.102:8000/chat-with-lead/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChats = async (status) => {
    try {
        const response= await axiosInstance.get(`http://116.202.210.102:8000/get-chats?lead_status=${status}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getChatHistory = async (id) => {
    try {
        const response= await axiosInstance.get(`http://116.202.210.102:8000/get-chat-history/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getLeadAnalytics = async (path) => {
    try {
        const response= await axiosInstance.get(`http://116.202.210.102:8000/get-lead-analytics${path}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const agentStatusChat = async (id) => {
    try {
        const response= await axiosInstance.patch(`http://116.202.210.102:8000/agent-status-for-chat/${id}`);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const testAgentChat = async (payload,id) => {
    try {
        const response= await axiosInstance.post(`http://116.202.210.102:8000/test-agent/${id}`,payload);
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}