import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFileApi, deleteMultipleFilesApi, getAllFilesApi, getFile, renameFileApi, uploadFileApi } from "../../api/endpoints/fileApi";

export const useFile = (id) => {
    return useQuery({
        queryKey: ["file", id],
        queryFn: ({id}) => getFile(id)
    });
}

export const useAllFiles = () => {
    return useQuery({
        queryKey: ["files"],
        queryFn: getAllFilesApi
    });
}

export const useUploadFile = () => {
    return useMutation({
        mutationFn: ({ parentDirId, file, onUploadProgress }) => uploadFileApi(parentDirId, file, onUploadProgress),
    });
}

export const useRenameFile = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ fileId, newName, parentDirId }) => renameFileApi(fileId, newName),
        onSuccess: (data, { fileId, parentDirId }) => {
            try {
                queryClient.setQueryData(["directory", parentDirId], (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        files: oldData.files?.map((file) => file._id === fileId ? data.data : file),
                    };
                });

                // Trigger component-specific callback
                if (onSuccessCallback) onSuccessCallback();
            } catch (error) {
                console.log({ error });
            }
        },
        onError: (error) => {
            console.error("❌ Mutation Error:", error);
        }
    })
}

export const useDeleteFile = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ fileId, parentDirId }) => deleteFileApi(fileId),
        onSuccess: (data, { fileId, parentDirId }) => {
            try {
                queryClient.setQueryData(["directory", parentDirId], (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        files: oldData.files?.filter((file) => file._id !== fileId),
                    };
                });

                // Trigger component-specific callback
                if (onSuccessCallback) onSuccessCallback();
            } catch (error) {
                console.log({ error });
            }
        },
        onError: (error) => {
            console.error("❌ Mutation Error:", error);
        }
    })
}

export const useDeleteFiles = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ parentDirId, files }) => deleteMultipleFilesApi(parentDirId, files),
        onSuccess: (data, { parentDirId, files }) => {
            if (!data?.success) return;
            try {
                const idsToDelete = new Set(files.map(f => f.fileId));

                queryClient.setQueryData(["directory", parentDirId], (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        files: oldData.files.filter(
                            (file) => !idsToDelete.has(file._id)
                        ),
                    };
                });

                // Trigger component-specific callback
                if (onSuccessCallback) onSuccessCallback();
            } catch (error) {
                console.log({ error });
            }
        },
        onError: (error) => {
            console.error("❌ Mutation Error:", error);
        }
    })
}

