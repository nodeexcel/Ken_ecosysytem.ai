import axiosInstance from "./axiosInstance"

export const login = async (payload) => {
    try {
        const response = await axiosInstance.post("/login", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}