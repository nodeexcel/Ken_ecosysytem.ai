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
        return error
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
        return error
    }
}

export const googleLogin = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/auth/google-login', payload);
        return response
    } catch (error) {
        console.log(error)
        return error

    }
};

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
        return error
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
        return error
    }
}

export const resetPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/password/reset", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}

export const forgotPassword = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/password/request-reset", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}

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