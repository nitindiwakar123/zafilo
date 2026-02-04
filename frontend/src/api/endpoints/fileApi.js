import apiClient from "../apiClient";

export const getFile = async (fileId) => {
    try {
        console.log({ fileId });
        const response = await apiClient.get(`/file/${fileId}?action=open`, {
            responseType: "arraybuffer",
        });
        return response;
    } catch (error) {
        return error.response.data;

    }
}

export const getAllFilesApi = async () => {
    try {
        const response = await apiClient.get(`/file/`);
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}

export const uploadFileApi = async (parentDirId, file, onUploadProgress) => {
    try {
        const response = await apiClient.post(`/file/${parentDirId}`,
            file,
            {
                headers: {
                    "Content-Type": file.type,
                    filename: file.name,
                },
                onUploadProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        onUploadProgress(percent);
                    }
                }
            });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const renameFileApi = async (fileId, newName) => {
    try {
        const response = await apiClient.patch(`/file/${fileId}`, { newName });
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
        console.log({ files });
        const response = await apiClient.delete(
            `/file/delete-multiple/${parentDirId}`,
            {
                data: { files }
            },
        );
        return response.data;
    } catch (error) {
        return error.response.data;

    }
}

