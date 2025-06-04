import axiosInstance from "./axiosInstance";

export const addPhoneNumber = async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/add-phone-number', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const createPhoneAgent = async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/create-phone-agent', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const createPhoneCampaign= async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/create-phone-campaign', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const getPhoneNumber= async () => {
    try {
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-numbers');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaign= async () => {
    try {
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-campaigns');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaignDetail= async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/get-campaign-detial${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCallAgent=async()=>{
     try{
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-agents');
        return response;
     }catch (error) {
        console.error(error);
        return error;
}
}