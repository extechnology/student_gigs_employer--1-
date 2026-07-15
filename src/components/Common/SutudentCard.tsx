import { MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ProfileCount } from "@/Hooks/Utlis";
import toast from "react-hot-toast";
import { GetProfileCompletion } from "@/Hooks/UserProfile";
import ProfileModal from "./ProfileModal";


interface Designer {
    name: string;
    jobtitle: string;
    imageUrl: string;
    location: string
    premium_badge: boolean
    id: number
}

const INCOMPLETE_PROFILE_MESSAGE = "Please complete your profile before viewing student profiles";
const COMPLETION_CHECK_ERROR = "Unable to check profile completion. Please try again.";


export default function SutudentCard({ name, jobtitle, imageUrl, location, id, premium_badge }: Designer) {



    // To check if the user is authenticated
    const { isPlanExpired, usage, isAuthenticated, refetchPlan } = useAuth();


    // To check employer profile completion before viewing student profiles
    const {
        data: profileCompletion,
        isLoading: profileCompletionLoading,
        isFetching: profileCompletionFetching,
        refetch: refetchProfileCompletion,
    } = GetProfileCompletion(isAuthenticated);



    // To update profile count
    const { mutate } = ProfileCount();


    // Profile completion modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingUserId, setPendingUserId] = useState<number | null>(null);



    // To navigate
    const navigate = useNavigate();



    // To open the student profile after all access checks pass
    const openStudentProfile = (user_id: number) => {

        if (isPlanExpired) {
            toast.error("Your plan is expired. Please upgrade your plan to continue.");
            setTimeout(() => navigate("/plans"), 1000); // Delayed navigation to allow toast to show
            return;
        }


        if (!usage?.profile_access) {
            toast.error("You have reached the profile limit. Please upgrade your plan to continue.");
            setTimeout(() => navigate("/plans"), 1000);
            return;
        }

        const formdata = new FormData();

        formdata.append("employee_id", user_id.toString());

        mutate(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    navigate(`/studentprofile/${user_id}`);
                    refetchPlan()

                } else {

                    console.log(response);
                    toast.error("Something went wrong. Please try again.");

                }

            }

        });

    }


    // To handle navigation
    const handleNavigation = async (user_id: number) => {

        if (!isAuthenticated) {
            navigate("/auth");
            return;
        }

        if (profileCompletionLoading || profileCompletionFetching) {
            toast("Checking profile completion...");
            return;
        }

        const result = await refetchProfileCompletion();

        if (result.isError) {
            toast.error(COMPLETION_CHECK_ERROR);
            return;
        }

        const completion = result.data ?? profileCompletion;

        if (!completion?.is_complete) {
            toast.error(INCOMPLETE_PROFILE_MESSAGE);
            setPendingUserId(user_id);
            setIsModalOpen(true);
            return;
        }

        openStudentProfile(user_id);

    }


    const handleModalClose = async () => {

        const result = await refetchProfileCompletion();
        const completion = result.data ?? profileCompletion;
        const userId = pendingUserId;

        setIsModalOpen(false);
        setPendingUserId(null);

        if (completion?.is_complete && userId !== null) {
            openStudentProfile(userId);
        }

    }


    return (


        <>

            <section className="flex flex-col items-center justify-center">


                <div className="relative border border-gray-200 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full">

                    {/* Profile Image */}
                    <div className="flex flex-col items-center">

                        <div className="relative">

                            <img
                                src={imageUrl}
                                alt="Profile"
                                loading="lazy"
                                className="w-20 h-20 rounded-full mb-4 object-cover"
                            />

                            {/* Premium Badge */}
                            {premium_badge && (

                                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-0 overflow-hidden rounded-full border-2 border-white">
                                    <div className="premium-badge bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold py-1 px-3 flex items-center gap-1 relative overflow-hidden">
                                        {/* Shimmer effect overlay */}
                                        <div className="shimmer-effect"></div>

                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                        </svg>
                                        PREMIUM
                                    </div>
                                </div>

                            )}

                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-800 truncate  max-w-[250px]">{name.toLocaleUpperCase()}</h3>
                        <p className="text-gray-500 mb-4 truncate  max-w-[250px]">{jobtitle}</p>


                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-6 justify-center items-center">
                            <MapPin size={16} className="text-gray-500" />
                            <p className="text-gray-500 truncate max-w-[200px]">{location}</p>
                        </div>


                        {/* Buttons */}
                        <div className="flex gap-2 w-full">
                            <button onClick={() => { handleNavigation(id) }} className="flex-1 w-full hover:cursor-pointer bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-300">
                                View Profile
                            </button>
                        </div>


                    </div>


                </div>


            </section>

            <ProfileModal
                title="Complete Your Profile"
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />


        </>



    )



}
