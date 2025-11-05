import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserDataApi, registerApi, loginApi, logoutApi } from "../../api/endpoints/userApi";

export const useUserData = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUserDataApi
    });
}

export const useRegister = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({formData}) => registerApi(formData),
        onSuccess: (data) => {
            console.log({data});
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

export const useLogin = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({formData}) => loginApi(formData),
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

export const useLogout = (onSuccessCallback) => {
    return useMutation({
        mutationFn: () => logoutApi(),
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

