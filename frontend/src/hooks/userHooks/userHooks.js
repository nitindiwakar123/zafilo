import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserDataApi, registerApi, loginApi, logoutApi, changeUserProfileApi, logoutAllDevicesApi, sendOtpApi, registerVerifyOtpApi, loginVerifyOtpApi, googleAuthApi } from "../../api/endpoints/userApi";

export const useUserData = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUserDataApi
    });
}

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ formData }) => registerApi(formData),
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ formData }) => loginApi(formData),
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

export const useChangeProfile = () => {
    return useMutation({
        mutationFn: ({ file }) => changeUserProfileApi(file),
    })
}

export const useLogoutAllDevices = (onSuccessCallback) => {
    return useMutation({
        mutationFn: () => logoutAllDevicesApi(),
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

export const useSendOtp = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ email }) => sendOtpApi(email),
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

export const useRegisterVerifyOtp = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ email, otp }) => registerVerifyOtpApi(email, otp),
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

export const useLoginVerifyOtp = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ email, otp }) => loginVerifyOtpApi(email, otp),
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

export const useGoogleAuth = (onSuccessCallback) => {
    return useMutation({
        mutationFn: ({ idToken }) => googleAuthApi(idToken),
        onSuccess: () => {
            try {
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
