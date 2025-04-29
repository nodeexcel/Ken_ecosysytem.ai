import axiosInstance from "./axiosInstance"

export const updateProfile = async (payload, token) => {
    try {
        const response = await axiosInstance.put("/api/users/profile", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getProfile = async (token) => {
    try {
        const response = await axiosInstance.get("/api/users/profile", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}