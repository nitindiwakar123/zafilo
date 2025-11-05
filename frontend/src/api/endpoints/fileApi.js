import apiClient from "../apiClient";

export const getAllFilesApi = async () => {
    try {
        const response = await apiClient.get(`/file/`);
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}

export const renameFileApi = async (fileId, newName) => {
    try {
        const response = await apiClient.patch(`/file/${fileId}`, {newName});
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}

export const deleteFileApi = async (fileId) => {
    try {
        const response = await apiClient.delete(`/file/${fileId}`);
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}

export const deleteMultipleFilesApi = async (parentDirId, files) => {
    try {
        const response = await apiClient.delete(`/file/delete-multiple/${parentDirId}`, files);
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}