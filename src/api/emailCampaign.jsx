import axiosInstance from "./axiosInstance";

export const createEmailCampaign = async (payload) => {
    try {
        const response = await axiosInstance.post("https://agents.ecosysteme.ai/email-campaign-creation", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaign = async () => {
    try {
        const response = await axiosInstance.get("https://agents.ecosysteme.ai/get-email-campaigns");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaignById = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/campaign-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteEmailCampaign = async (id) => {
    try {
        const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/delete-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaign = async (payload, id) => {
    try {
        const response = await axiosInstance.put(`https://agents.ecosysteme.ai/update-campaign/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaignStatus = async (id) => {
    try {
        const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/email-campaign-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getCampaignSchedule = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-campaign-schedule`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getScheduledContent = async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/get-scheduled-content/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateContentStatus = async (id, payload) => {
    try {
        const response = await axiosInstance.post(`https://agents.ecosysteme.ai/content-status/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const duplicateCampaign = async (id) => {
    try {
        const response = await axiosInstance.post(`https://agents.ecosysteme.ai/duplicate-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const campaignStatics = async () => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/campigns-stats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
