import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddUserProfile, GetEmployerProfileCompletion, GetUserProfile } from "../Services/AllApi";
import type { ProfileCompletionResponse } from "../types/profileCompletion";



// Get User Personal Information
export const GetProfile = () => {

    return useQuery({

        queryKey: ["UserProfile"],
        initialData: [],

        queryFn: async () => {

            try {

                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const headers = { Authorization: `Bearer ${token}` }

                const Response = await GetUserProfile(headers)

                return Response.data


            } catch (err) {

                console.log(err);


            }
        },

    })

}



// Get employer profile completion
export const GetProfileCompletion = (enabled = true) => {

    return useQuery<ProfileCompletionResponse, Error>({

        queryKey: ["EmployerProfileCompletion"],
        enabled: enabled && Boolean(localStorage.getItem("token")),

        queryFn: async () => {

            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const headers = { Authorization: `Bearer ${token}` }

            const Response = await GetEmployerProfileCompletion(headers)

            const status = Response?.status ?? Response?.response?.status ?? 0;

            if (status < 200 || status >= 300) {
                const responseMessage = Response?.response?.data?.detail || Response?.response?.data?.message;
                throw new Error(responseMessage || "Unable to load profile completion");
            }

            return Response.data as ProfileCompletionResponse

        },

    })

}




// Add User Profile
export const AddProfile = () => {


    interface MutationParams {
        formData: FormData;
        id: string;
    }

    const queryclient = useQueryClient();

    return useMutation({

        mutationFn: async ({ formData , id }: MutationParams) => {

            try {

                if (!localStorage.getItem("token")) { throw new Error("Authentication token not found"); }

                const token = localStorage.getItem("token")

                const headers = { Authorization: `Bearer ${token}` }

                const Response = await AddUserProfile(formData, headers , id )

                return Response


            } catch (err) {

                console.log(err);

            }

        },
        onSuccess: () => {

            queryclient.invalidateQueries({ queryKey: ["UserProfile"] });
            queryclient.invalidateQueries({ queryKey: ["EmployerProfileCompletion"] });
            queryclient.invalidateQueries({ queryKey: ["GetPostedJob"] });

        },
        onError: (error) => {
            console.error("Failed to add client data:", error);
        },

    })

}
