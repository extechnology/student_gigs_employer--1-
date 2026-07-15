import { useMutation, useQuery } from "@tanstack/react-query";
import { GetCategorys, GetPreferredAcademicCourse, GetHomeSlider, GetLocations, GetSingleTalent, GetJobTitle, PostProfileCount, GetAllSearchCategory, GetTrendingJobs } from "../Services/AllApi";





// Get Online Talent
export const GetJobCategory = (type: string) => {

    return useQuery({

        queryKey: ["OnlineTalentCategory", type],

        queryFn: async () => {

            const Response = await GetCategorys(type)

            return Response.data

        },
        staleTime: 1000 * 60 * 10,

    })

}





// Get Home Slider
export const HomeSlider = () => {

    return useQuery({

        queryKey: ["HomeSlider"],

        queryFn: async () => {

            const Response = await GetHomeSlider()

            return Response.data

        },

    })

}




// Get All Locations
export const AllLocations = (search: string) => {

    return useQuery({

        queryKey: ["AllLocations", search],

        queryFn: async () => {

            try {

                const response = await GetLocations(search);

                return response.data.features.map((location: any) => {

                    const properties = location.properties;
                    const coordinates = location.geometry.coordinates;

                    const city = properties.city || properties.name || "";
                    const state = properties.state || "";
                    const country = properties.country || "";
                    const postalCode = properties.postcode || ""; // Fetching postal code

                    return {
                        value: `${coordinates[1]},${coordinates[0]}`, // lat,lng format
                        label: [city, state, country, postalCode].filter(Boolean).join(", "), // Removing empty values
                    };

                });


            } catch (err) {
                console.error("Error fetching locations:", err);
                return [];
            }
        },
    });
};



// Get Single Talent (Employee)
export const SingleTalent = (id: string) => {

    return useQuery({

        queryKey: ["SingleTalent", id],
        initialData: [],

        queryFn: async () => {

            const token = localStorage.getItem("token")


            if (!token) {
                throw new Error("Authentication token not found");
            }

            const headers = { Authorization: `Bearer ${token}` }

            const Response = await GetSingleTalent(id, headers)

            return Response.data

        },

    })

}






// Get job tittles
export const JObTittles = (category : string) => {

    return useQuery({

        queryKey: ["jobtittles", category],

        queryFn: async () => {


            const Response = await GetJobTitle(category)

            return Response.data


        },

        staleTime: 1000 * 60 * 10,

    })

}




// Get Prefered Academic Courses
export const PreferedAcademicCourses = () => {

    return useQuery({

        queryKey: ["PreferedAcademicCourses"],

        queryFn: async () => {  


            const Response = await GetPreferredAcademicCourse()

            return Response.data


        },

        staleTime: 1000 * 60 * 10,

    })

}





// Profile Count Adding
export const ProfileCount = () => {

    return useMutation({

        mutationFn: async (formdata: FormData) => {

            try {

                if (!localStorage.getItem("token")) { throw new Error("Authentication token not found"); }

                const token = localStorage.getItem("token")

                const headers = { Authorization: `Bearer ${token}` }

                const Response = await PostProfileCount(formdata, headers)

                return Response

            } catch (err) {

                console.log(err);

            }

        },
        onError: (error) => {
            console.error("Failed to Resister User:", error);
        },

    })

}





// Get All Search Category
export const AllSearchCategory = () => {

    return useQuery({

        queryKey: ["allsearchcategory"],

        queryFn: async () => {

            try {

                const Response = await GetAllSearchCategory()

                return Response.data

            } catch (err) {

                console.log(err);

            }

        },
        staleTime: 1000 * 60 * 10,

    })

}


// Get Trending Jobs
export const TrendingJobsList = () => {

    return useQuery({

        queryKey: ["trendingjobs"],

        queryFn: async () => {

            try {

                const Response = await GetTrendingJobs()

                return Response.data

            } catch (err) {

                console.log(err);
                return [];

            }

        },

    })

}