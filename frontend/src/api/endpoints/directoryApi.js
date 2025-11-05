import apiClient from "../apiClient";


export const getDirectoryDataApi = async (dirId = "") => {
    console.log({ dirId });
    try {
        const response = await apiClient.get(`/folder/${dirId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const createDirectoryApi = async (parentDirId, dirname) => {
    try {
        const response = await apiClient.post(`/folder/${parentDirId || ""}`, {dirname});
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const renameDirectoryApi = async (dirId, newName) => {
    try {
        const response = await apiClient.patch(`/folder/${dirId}`, {newName});
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteDirectoryApi = async (dirId) => {
    try {
        const response = await apiClient.delete(`/folder/${dirId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
