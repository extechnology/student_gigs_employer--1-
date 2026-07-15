import { useNavigate } from "react-router-dom";
import { useState, useEffect, ComponentType, ReactNode, MouseEvent } from "react";
import { GetProfileCompletion } from "../../Hooks/UserProfile";
import { useAuth } from "../../Context/AuthContext";
import ProfileModal from "../Common/ProfileModal";
import toast from "react-hot-toast";


// Define prop types for the wrapped component
type WrappedComponentProps = {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
};


const INCOMPLETE_PROFILE_MESSAGE = "Please complete your profile before posting a job";
const COMPLETION_CHECK_ERROR = "Unable to check profile completion. Please try again.";


const PostJobAccessLoader = () => (
    <main className="w-full min-h-[60vh] pt-32 flex items-center justify-center bg-white">
        <p className="text-sm font-semibold text-gray-600">Checking profile completion...</p>
    </main>
);


export const PostJobProtectedRoute = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();

    const { isAuthenticated, setLoginModalOpen } = useAuth();

    const { data, isLoading, isFetching, isSuccess, isError, refetch } = GetProfileCompletion(isAuthenticated);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasProfileAccess, setHasProfileAccess] = useState(false);
    const [hasShownAuthToast, setHasShownAuthToast] = useState(false);
    const [hasShownIncompleteToast, setHasShownIncompleteToast] = useState(false);


    useEffect(() => {

        if (!isAuthenticated) {

            setHasProfileAccess(false);
            setLoginModalOpen(true);

            if (!hasShownAuthToast) {
                toast.error("Please login to post a job");
                setHasShownAuthToast(true);
            }

            return;
        }

        setHasShownAuthToast(false);

        if (isLoading || isFetching) return;

        if (isError) {
            toast.error(COMPLETION_CHECK_ERROR);
            navigate("/findtalent/", { replace: true });
            return;
        }

        if (isSuccess && data?.is_complete) {
            setHasProfileAccess(true);
            return;
        }

        if (isSuccess && data && !data.is_complete && !isModalOpen && !hasProfileAccess) {

            if (!hasShownIncompleteToast) {
                toast.error(INCOMPLETE_PROFILE_MESSAGE);
                setHasShownIncompleteToast(true);
            }

            setIsModalOpen(true);
        }

    }, [
        data,
        hasShownAuthToast,
        hasShownIncompleteToast,
        hasProfileAccess,
        isAuthenticated,
        isError,
        isFetching,
        isLoading,
        isModalOpen,
        isSuccess,
        navigate,
        setLoginModalOpen
    ]);


    const handleModalClose = async () => {

        const result = await refetch();

        setIsModalOpen(false);

        if (result.data?.is_complete) {
            setHasProfileAccess(true);
            setHasShownIncompleteToast(false);
            return;
        }

        navigate("/findtalent/", { replace: true });

    };


    if (!isAuthenticated) return null;

    if (hasProfileAccess) return <>{children}</>;

    if (isLoading || isFetching || !data) return <PostJobAccessLoader />;

    if (!data.is_complete) {
        return (
            <>
                <PostJobAccessLoader />

                <ProfileModal
                    title="Complete Your Profile"
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            </>
        );
    }

    return <>{children}</>;

};


export const withProtectedRoute = <P extends WrappedComponentProps>(
    WrappedComponent: ComponentType<P>,
    targetRoute: string
) => {
    return function ProtectedComponent(props: P) {

        const navigate = useNavigate();

        const { isAuthenticated, setLoginModalOpen } = useAuth();

        const { data, isLoading, isFetching, refetch } = GetProfileCompletion(isAuthenticated);

        const [isModalOpen, setIsModalOpen] = useState(false);


        const handleModalClose = async () => {

            const result = await refetch();

            setIsModalOpen(false);

            if (result.data?.is_complete || data?.is_complete) {
                navigate(targetRoute);
            }

        };


        const handleClick = async (e: MouseEvent<HTMLDivElement>) => {

            e.preventDefault();

            if (!isAuthenticated) {
                toast.error("Please login to post a job");
                setLoginModalOpen(true);
                return;
            }

            if (isLoading || isFetching) return;

            const result = await refetch();

            if (result.isError) {
                toast.error(COMPLETION_CHECK_ERROR);
                return;
            }

            const profileCompletion = result.data ?? data;

            if (!profileCompletion?.is_complete) {
                toast.error(INCOMPLETE_PROFILE_MESSAGE);
                setIsModalOpen(true);
                return;
            }

            navigate(targetRoute);
        };


        return (
            <>
                <div onClick={handleClick}>
                    <WrappedComponent {...props} />
                </div>

                <ProfileModal
                    title="Complete Your Profile"
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            </>
        );
    };
};
