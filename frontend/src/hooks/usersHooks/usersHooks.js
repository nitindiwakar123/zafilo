import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllUsersDataAPi, logoutUserApi, deleteUserApi } from "../../api/endpoints/usersApi";

export const useAllUsersData = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsersDataAPi
    });
}

export const useLogoutAUser = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ userId }) => logoutUserApi(userId),
        onSuccess: () => {
            try {
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

export const useDeleteAUser = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ userId }) => deleteUserApi(userId),
        onSuccess: () => {
            try {
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