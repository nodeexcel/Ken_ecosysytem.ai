import axiosInstance from "./axiosInstance";

export const createEmailCampaign = async (payload) => {
    try {
        const response = await axiosInstance.post("http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/email-campaign-creation", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaign = async () => {
    try {
        const response = await axiosInstance.get("http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-email-campaigns");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaignById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/campaign-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteEmailCampaign = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/delete-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaign = async (payload, id) => {
    try {
        const response = await axiosInstance.put(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-campaign/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaignStatus = async (id) => {
    try {
        const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/email-campaign-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getCampaignSchedule = async () => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-campaign-schedule`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getScheduledContent = async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-scheduled-content/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateContentStatus = async (id, payload) => {
    try {
        const response = await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/content-status/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const duplicateCampaign = async (id) => {
    try {
        const response = await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/duplicate-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const campaignStatics = async () => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/campigns-stats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
