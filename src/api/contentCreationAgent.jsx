import agentInstance from "./agentInstance";

export const getContentCreationChats = async () => {
    try {
        const response = await agentInstance.get(`/get-content-creation-chats`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getContentCreationChatById = async (id) => {
    try {
        const response = await agentInstance.get(`/get-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateContentCreationChatName = async (id, payload) => {
    try {
        const response = await agentInstance.patch(`/update-content-creation-chat-name/${id}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteContentCreationChat = async (id) => {
    try {
        const response = await agentInstance.delete(`/delete-content-creation-chat/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const createContent = async (payload) => {
    try {
        const response = await agentInstance.post(`/create-content`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const contentGenerationStatus = async (id) => {
    try {
        const response = await agentInstance.get(`/content-generation-status?content_id=${id}`,);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const linkedinPostGet = async (payload) => {
    try {
        const response = await agentInstance.get(`/linkedin-post`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const linkedinPostCreate = async (payload) => {
    try {
        const response = await agentInstance.post(`/linkedin-post`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const linkedinPostUpdate = async (post_id, content) => {
    try {
        const response = await agentInstance.patch(`/linkedin-post/${post_id}`, {
            content: content
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const XPostGet = async (payload) => {
    try {
        const response = await agentInstance.get(`/X-post`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const XPostCreate = async (payload) => {
    try {
        const response = await agentInstance.post(`/X-post`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const XPostUpdate = async (post_id, content) => {
    try {
        const response = await agentInstance.patch(`/X-post/${post_id}`, {
            content: content
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const YoutubePostGet = async (payload) => {
    try {
        const response = await agentInstance.get(`/youtube-script-writer`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const YoutubePostCreate = async (payload) => {
    try {
        const response = await agentInstance.post(`/youtube-script-writer`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
export const YoutubePostUpdate = async (post_id, content) => {
    try {
        const response = await agentInstance.patch(`/youtube-script-writer/${post_id}`, {
            content: content
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const saveDraftContent = async (payload) => {
    try {
        const response = await agentInstance.post(`/schedule-content/draft`, payload, {
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

export const publishContent = async (payload) => {
    try {
        const response = await agentInstance.post(`/schedule-content/publish`, payload,
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


export const scheduleContent = async (payload) => {
    try {
        const response = await agentInstance.post(`/schedule-content/scheduled`, payload,
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


export const getContentCreationCalender = async () => {
    try {
        const response = await agentInstance.get(`/get-schduled-content`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};