import axiosInstance from "./axiosInstance";

export const appointmentSetter = async (payload) => {
    try {
        const response = await axiosInstance.post("http://116.202.210.102:8000/appointment-setter", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetter = async () => {
    try {
        const response = await axiosInstance.get("http://116.202.210.102:8000/appointment-setter-agents");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getAppointmentSetterById = async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/appointment-setter-agent-details/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};