import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFileApi, getAllFilesApi, renameFileApi } from "../../api/endpoints/fileApi";

export const useAllFiles = () => {
    return useQuery({
        queryKey: ["files"],
        queryFn: getAllFilesApi
    });
}

export const useUploadFile = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ fileId, newName, parentDirId }) => createFileApi(fileId, newName),
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