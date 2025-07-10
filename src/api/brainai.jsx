import axiosInstance from "./axiosInstance";
import agentInstance from "./agentInstance";

export const knowledgeBase = async (payload) => {
    try {
        const response = await agentInstance.post("/knowledge-base", payload,
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
        const response = await agentInstance.get("/snippets");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteKnowledgeSnippets = async (id) => {
    try {
        const response = await agentInstance.delete(`/knowledge-base/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const uploadContacts = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/upload-contacts`, payload, {
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
        const response = await axiosInstance.post(`/api/contacts/add-contacts-to-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContactList = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/create-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContactList = async (page = 1, rows, channel, search = null) => {
    try {
        const response = await axiosInstance.get(`/api/contacts/get-contact-list?page=${page}&rows=${rows}&channel=${channel}&search=${search}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getLists = async (channel, search = null) => {
    try {
        const response = await axiosInstance.get(`/api/contacts/get-lists?channel=${channel}&search=${search}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const newContactAdd = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/add-contact`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const updateContact = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/update-contact`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const deleteContact = async (payload) => {
    try {
        const response = await axiosInstance.patch(`/api/contacts/delete-contact`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const updateList = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/update-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const duplicateList = async (payload) => {
    try {
        const response = await axiosInstance.post(`/api/contacts/duplicate-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const deleteList = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/contacts/delete-list/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const getInstaAccounts = async () => {
    try {
        const response = await agentInstance.get(`/get-insta-accounts`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const deleteInstaAccount = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-insta-account/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const getWhatsappAccounts = async () => {
    try {
        const response = await agentInstance.get(`/get-whatsapp-accounts`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const deleteWhatsappAccount = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-whatsapp-account/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const getGoogleCalendarAccounts = async () => {
    try {
        const response = await agentInstance.get(`/get-calendar-accounts`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const deleteGoogleCalendarAccount = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-google-calendar-account/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const getListedContacts = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/contacts/get-contact/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export const removeContactFromList = async (payload) => {
    try {
        const response = await axiosInstance.patch(`/api/contacts/remove-contact-from-list`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}
