import axiosInstance from "./axiosInstance";

export const createEmailCampaign = async (payload) => {
    try {
        const response = await axiosInstance.post("http://116.202.210.102:8000/email-campaign-creation", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaign = async () => {
    try {
        const response = await axiosInstance.get("http://116.202.210.102:8000/get-email-campaigns");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getEmailCampaignById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/campaign-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteEmailCampaign = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/delete-campaign/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaign = async (payload, id) => {
    try {
        const response = await axiosInstance.put(`http://116.202.210.102:8000/update-campaign/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateEmailCampaignStatus = async (id) => {
    try {
        const response = await axiosInstance.patch(`http://116.202.210.102:8000/email-campaign-status/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
