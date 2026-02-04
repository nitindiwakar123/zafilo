import apiClient from "../apiClient";

export const getUserDataApi = async () => {
        const response = await apiClient.get("/user/");
        return response.data.success ? response.data.data : null;
}

export const registerApi = async (data) => {
        const response = await apiClient.post("/user/register", data);
        return response.data;
};

export const loginApi = async (data) => {
        const response = await apiClient.post("/user/login", data);
        return response.data;
};

export const logoutApi = async () => {
        const response = await apiClient.post("/user/logout");
        return response.data;
}

export const changeUserProfileApi = async (file) => {
        try {
                const response = await apiClient.patch("/user/profile-pic",
                        file,
                        {
                                headers: {
                                        "Content-Type": file.type,
                                        filename: file.name,
                                }
                        });
                return response.data;
        } catch (error) {
                return error.response.data;
        }
}

export const logoutAllDevicesApi = async () => {
        const response = await apiClient.post("/user/logout-all");
        return response.data;
}

export const sendOtpApi = async (email) => {
        const response = await apiClient.post("/user/send-otp", { email });
        return response.data;
}

export const registerVerifyOtpApi = async (email, otp) => {
        const response = await apiClient.post("/user/register/verify-otp", { email, otp });
        return response.data;
}

export const loginVerifyOtpApi = async (email, otp) => {
        const response = await apiClient.post("/user/login/verify-otp", { email, otp });
        return response.data;
}

export const googleAuthApi = async (idToken) => {
        const response = await apiClient.post("/user/auth/google", { idToken });
        return response.data;
}
