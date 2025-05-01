import axiosInstance from "./axiosInstance";

export const sendInviteEmail = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/invite-member", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const acceptInviteEmail = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/accept-invitation", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getTeamMembers = async () => {
    try {
        const response = await axiosInstance.get("/api/users/team-members");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
