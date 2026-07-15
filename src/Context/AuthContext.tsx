import { createContext, useContext, useEffect, useState } from "react";
import { UserPlans } from "@/Hooks/PlanHook";


// Plan & Usage Data Type
export interface PlanData {
    plan_id: number;
    id: string;
    name: string;
    price: number;
    profile_access: number;
    validity: string;
    job_posting: string;
    resume_viewing: string;
    job_auto_refreshing: string;
    hot_job_label: string;
    access_to_certified_students: string;
    instant_candidate_matching: string;
    direct_chat_with_candidate: string
    company_dashboard_analytics: string;
}



// Usage Data Type
interface UsageData {
    created_date?: string; // Plan activation date
    expiry_date?: string; // Plan expiration date
    is_expired: boolean
    can_post_job: boolean;
    profile_access: boolean
}



// Context Type
interface AuthContextType {

    isAuthenticated: boolean;
    plan: PlanData | null;
    currentPlan: string | null;
    usage: UsageData | null;
    isPlanExpired: boolean;
    isoffer: boolean;
    isLoadingPlan: boolean;
    isFetchingPlan: boolean;
    isErrorPlan: boolean;
    login: (token: string) => void;
    logout: () => void;
    refetchPlan: () => void; // Function to refetch plan when upgraded
    isLoginModalOpen: boolean;
    setLoginModalOpen: (open: boolean) => void;
}



// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);



// Helper function to check if token is valid
const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};



// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);


    // Fetch user plans
    const { data, refetch: refetchPlan, isLoading: isLoadingPlan, isFetching: isFetchingPlan, isError: isErrorPlan } = UserPlans();



    // Extract plan and usage details
    const plan = data?.plan ?? null;
    const currentPlan = data?.current_plan ?? null;
    const usage = data?.usage ?? null;
    const isoffer = data?.is_offer ?? false;
    const Expired = data?.usage?.is_expired ?? false



    // Auto-fetch plan data when authentication state changes
    useEffect(() => {
        if (isAuthenticated) {
            refetchPlan();
        }
    }, [isAuthenticated]);



    //Update `isAuthenticated` when localStorage changes (real-time)
    useEffect(() => {


        const syncAuth = () => setIsAuthenticated(checkAuth());

        window.addEventListener("storage", syncAuth);

        // Also update state whenever localStorage changes inside the same tab
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key, value) {
            originalSetItem.call(this, key, value);
            if (key === "token") syncAuth(); // Update state immediately when token is set
        };

        return () => {
            window.removeEventListener("storage", syncAuth);
            localStorage.setItem = originalSetItem; // Reset original behavior on unmount
        };


    }, []);



    // Login
    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        refetchPlan(); // Fetch plan immediately after login
        window.dispatchEvent(new Event("storage")); // Manually trigger storage event
    };



    // Logout
    const logout = () => {

        localStorage.removeItem("token");
        setIsAuthenticated(false);
        refetchPlan(); // Fetch plan immediately after login
        window.dispatchEvent(new Event("storage")); // Ensure logout syncs across tabs
    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, refetchPlan, plan, isPlanExpired: Expired, currentPlan, usage, isoffer, isLoadingPlan, isFetchingPlan, isErrorPlan, isLoginModalOpen, setLoginModalOpen }}>
            {children}
        </AuthContext.Provider>
    );


};


// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
