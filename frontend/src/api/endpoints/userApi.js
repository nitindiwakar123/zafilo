import apiClient from "../apiClient";

export const getUserDataApi = async () => {
    try {
        const response = await apiClient.get("/user/");
        return response.data;
    } catch (error) {
         return error.response.data;
    }
}

export const registerApi = async (data) => {
    try {
        const response = await apiClient.post("/user/register", { data });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const loginApi = async (data) => {
    try {
        const response = await apiClient.post("/user/login", { data });
        return response.data;
    } catch (error) {
        return error.response.data;

    }
};

export const logoutApi = async () => {
    try {
        const response = await apiClient.post("/user/logout", { data });
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}