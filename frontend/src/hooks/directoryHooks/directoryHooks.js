import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDirectoryDataApi, createDirectoryApi, renameDirectoryApi, deleteDirectoryApi } from "../../api/endpoints/directoryApi";

export const useDirectoryData = (dirId = "") => {
    return useQuery({
        queryKey: ["directory", dirId],
        queryFn: () => getDirectoryDataApi(dirId)
    });
}

export const useCreateDirectory = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ parentDirId, dirname }) => createDirectoryApi(parentDirId, dirname),
        onSuccess: (data, { parentDirId }) => {
            console.log({ data, parentDirId });
            try {
                queryClient.setQueryData(["directory", parentDirId || ""], (oldData) => {
                    console.log({ oldData });
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        directories: [...(oldData.directories || []), data.data],
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
    });
}

export const useRenameDirectory = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dirId, newName, parentDirId }) => renameDirectoryApi(dirId, newName),
        onSuccess: (data, { dirId, parentDirId }) => {
            try {
                queryClient.setQueryData(["directory", parentDirId], (oldData) => {
                    
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        directories: oldData.directories?.map((dir) => dir._id === dirId ? data.data : dir),
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
    });
}

export const useDeleteDirectory = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dirId, parentDirId }) => deleteDirectoryApi(dirId),
        onSuccess: (data, { dirId, parentDirId }) => {
            console.log({dirId, parentDirId});
            try {
                queryClient.setQueryData(["directory", parentDirId], (oldData) => {
                    
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        directories: oldData.directories?.filter((dir) => dir._id !== dirId),
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
    });
}