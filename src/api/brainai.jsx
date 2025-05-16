import axiosInstance from "./axiosInstance";

export const knowledgeBase = async (payload) => {
    try {
        const response = await axiosInstance.post("http://116.202.210.102:8000/knowledge-base", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};