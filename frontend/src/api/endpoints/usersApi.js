import apiClient from "../apiClient";

export const getAllUsersDataAPi = async () => {
        const response = await apiClient.get("/users/");
        return response.data;
}

export const logoutUserApi = async (userId) => {
    const response = await apiClient.post(`/users/${userId}`);
    return response.data;
}

export const deleteUserApi = async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
}