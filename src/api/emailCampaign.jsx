import agentInstance from "./agentInstance";

export const createEmailCampaign = async (payload) => {
    try {
        const response = await agentInstance.post("/email-campaign-creation", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaign = async () => {
    try {
        const response = await agentInstance.get("/get-email-campaigns");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaignById = async (id) => {
    try {
        const response = await agentInstance.get(`/campaign-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteEmailCampaign = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaign = async (payload, id) => {
    try {
        const response = await agentInstance.put(`/update-campaign/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaignStatus = async (id) => {
    try {
        const response = await agentInstance.patch(`/email-campaign-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getCampaignSchedule = async () => {
    try {
        const response = await agentInstance.get(`/get-campaign-schedule`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getScheduledContent = async (id) => {
    try {
        const response = await agentInstance.get(`/get-scheduled-content/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateContentStatus = async (id, payload) => {
    try {
        const response = await agentInstance.post(`/content-status/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const duplicateCampaign = async (id) => {
    try {
        const response = await agentInstance.post(`/duplicate-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const campaignStatics = async () => {
    try {
        const response = await agentInstance.get(`/campigns-stats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
