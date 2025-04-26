import axiosInstance from "./axiosInstance"

export const getEmailVerify = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/check-profile", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const login = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getOTPVerify = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/verify-otp", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const setPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/auth/set-password", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}