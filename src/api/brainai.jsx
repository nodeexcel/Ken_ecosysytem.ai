import axiosInstance from "./axiosInstance";

export const knowledgeBase = async (payload) => {
    try {
        const response = await axiosInstance.post("http://116.202.210.102:8000/knowledge-base", payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getKnowledgeSnippets = async () => {
    try {
        const response = await axiosInstance.get("http://116.202.210.102:8000/snippets");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteKnowledgeSnippets = async (id) => {
    try {
        const response = await axiosInstance.delete(`http://116.202.210.102:8000/knowledge-base/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const uploadContacts = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/users/upload-contacts`, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const addContactsToList = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/users/add-contacts-to-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContactList = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/users/create-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContactList = async () => {
    try {
        const response = await axiosInstance.get(`/api/users/get-contact-list`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};