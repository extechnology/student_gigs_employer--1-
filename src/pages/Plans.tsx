import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/Context/AuthContext';
import { AllPlans } from '@/Hooks/PlanHook';
import { CreateOrder } from '@/Hooks/Payment';
import PlanLoader from '@/components/Loader/PlanLoader';
import toast from 'react-hot-toast';
import AnimatedSvg from '@/components/Loader/AnimatedSvg';
import { load } from "@cashfreepayments/cashfree-js";
import { AlertCircle } from 'lucide-react';



// Define types for the color options and keys
type ColorType = 'bg' | 'bgLight' | 'text' | 'border' | 'gradient' | 'shadow';
type ColorName = 'blue' | 'purple' | 'pink';


// Define the plan feature type
type PlanFeature = {
    name: string;
    value: string;
};



// Define the plan type
type Plan = {
    id: string;
    name: string;
    price: string;
    note?: string;
    features: PlanFeature[];
    color: ColorName;
    recommended?: boolean;
    icon: React.ReactNode;
};


const EmployerPlansPage = () => {


    // Razorpay
    // const { Razorpay } = useRazorpay();


    // Get User Personal Info
    // const { data: userInfo } = GetProfile()


    // Plan Progress
    const [Progress, Setprogress] = useState<Boolean>(false)


    // Create Order Mutate
    const { mutate } = CreateOrder()


    // Verify Payment Mutate
    // const { mutate: VerifyPaymentMutate } = VerifyPayment()


    // Get All Plans Data
    const { data, isLoading, isError, isFetching } = AllPlans()


    // Get Current Plan Deatils
    const { currentPlan, isPlanExpired, isoffer, plan: currentPlanData, isFetchingPlan, isLoadingPlan, isErrorPlan } = useAuth()


    const [isClient, setIsClient] = useState(false);



    useEffect(() => {

        setIsClient(true);

    }, []);



    // Define the PlanIcons component
    const PlanIcons: React.FC<{ plan: string }> = ({ plan }) => {
        const icons: Record<string, JSX.Element> = {
            free: (
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                    <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                    <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            standard: (
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                    <circle cx="12" cy="12" r="10" fill="#8B5CF6" />
                    <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            premium: (
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                    <circle cx="12" cy="12" r="10" fill="#EC4899" />
                    <path
                        d="M12 7L13.9389 10.9463L18.1962 11.5836L15.0638 14.6137L15.8779 18.8564L12 16.85L8.12215 18.8564L8.93616 14.6137L5.80385 11.5836L10.0611 10.9463L12 7Z"
                        fill="white"
                    />
                </svg>
            ),
        };

        return icons[plan] || null;
    };




    // Define the getColorClass function
    const getColorClass = (color: ColorName, type: ColorType): string => {

        const colorMap = {
            blue: {
                bg: 'bg-blue-500',
                bgLight: 'bg-blue-50',
                text: 'text-blue-500',
                border: 'border-blue-200',
                gradient: 'from-blue-500 to-blue-600',
                shadow: 'shadow-blue-200'
            },
            purple: {
                bg: 'bg-purple-500',
                bgLight: 'bg-purple-50',
                text: 'text-purple-500',
                border: 'border-purple-200',
                gradient: 'from-purple-500 to-purple-600',
                shadow: 'shadow-purple-200'
            },
            pink: {
                bg: 'bg-pink-500',
                bgLight: 'bg-pink-50',
                text: 'text-pink-500',
                border: 'border-pink-200',
                gradient: 'from-pink-500 to-pink-600',
                shadow: 'shadow-pink-200'
            },
            green: {
                bg: 'bg-green-500',
                bgLight: 'bg-green-50',
                text: 'text-green-500',
                border: 'border-green-200',
                gradient: 'from-green-500 to-green-600',
                shadow: 'shadow-green-200'
            },
            yellow: {
                bg: 'bg-yellow-500',
                bgLight: 'bg-yellow-50',
                text: 'text-yellow-500',
                border: 'border-yellow-200',
                gradient: 'from-yellow-500 to-yellow-600',
                shadow: 'shadow-yellow-200'
            },
        };

        return colorMap[color][type];
    };



    // Define the checkValue function
    const checkValue = (value: string): boolean | string => {
        if (value === 'Yes') return true;
        if (value === 'No') return false;
        return value;
    };



    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };


    // Animation variants
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12
            }
        }
    };




    // Handle Plan Upgrade
    const handlePlanUpgrade = (plan: string, plan_price: string) => {

        try {

            Setprogress(true);

            if (!currentPlanData || !currentPlan) { toast.error("Something went wrong"); return; }


            // Convert plan_price to number 
            const numericPrice = Number(plan_price);


            // condition to determine the price
            const finalPrice = (plan === 'premium' && currentPlan?.toLowerCase() === 'standard' && isoffer) ? numericPrice - 0.5 * Number(currentPlanData?.price || 0) : numericPrice;


            const formData = new FormData()

            formData.append("amount", finalPrice.toString())
            formData.append("currency", "INR")
            formData.append("plan", plan)



            // Make the API call For Create Order
            mutate({ formData }, {

                onSuccess: async (response) => {


                    const sessionId = response?.data?.payment_session_id || response?.payment_session_id;


                    if (sessionId) {

                        try {

                            const cashfree = await load({
                                mode: "production",
                            });


                            let checkoutOptions = {
                                paymentSessionId: sessionId,
                                redirectTarget: "_self",
                            };

                            cashfree.checkout(checkoutOptions)

                        } catch (err) {

                            toast.error("Failed to load payment gateway");

                        }

                    } else {

                        toast.error("Invalid payment session data received.");

                    }

                    // if (response.status >= 200 && response.status < 300) {

                    //     // Get the order id
                    //     const { id } = response.data

                    //     // Initialize Razorpay
                    //     const options: RazorpayOrderOptions = {

                    //         key: import.meta.env.VITE_RAZORPAY_KEY || "",
                    //         amount: finalPrice * 100,
                    //         currency: "INR",
                    //         name: "Medresearch India Pvt Ltd",
                    //         description: `Upgrade to ${plan} Plan`,
                    //         order_id: id,
                    //         handler: (response) => {

                    //             VerifyPaymentMutate({ response }, {

                    //                 onSuccess: (response) => {

                    //                     if (response.status >= 200 && response.status < 300) {

                    //                         toast.success(`Upgraded to ${plan} Plan Successful `, { duration: 5000 });
                    //                         window.scrollTo({ top: 0, behavior: 'smooth', });
                    //                         refetchPlan()

                    //                     } else {

                    //                         toast.error("Something went wrong");

                    //                     }
                    //                 }

                    //             })
                    //         },
                    //         prefill: {
                    //             name: userInfo?.employer?.company_name || "Guest",
                    //             email: userInfo?.employer?.email || "guest@example.com",
                    //             contact: userInfo?.employer?.phone_number || "1234567890",
                    //         },
                    //         theme: {
                    //             color: "#F37254",
                    //         },
                    //     };


                    //     // Open Razorpay
                    //     const razorpayInstance = new Razorpay(options);
                    //     razorpayInstance.open();


                    //     // Add event listeners
                    //     razorpayInstance.on("payment.failed", (error) => {
                    //         console.error("Payment Failed:", error);
                    //         toast.error("Payment Failed! Please Try Again.");
                    //     });


                    // } else {

                    //     console.log(response);
                    //     toast.error("Something went wrong");

                    // }

                }
            })

        }
        catch (err) {

            console.error(err);
            toast.error("Something went wrong.");

        } finally {

            setTimeout(() => Setprogress(false), 500);

        }

    }


    window.scrollTo({ top: 0, behavior: 'smooth', });



    return (

        <>

            {

                isLoadingPlan || isFetchingPlan || isErrorPlan || isLoading || isError || isFetching ?

                    <PlanLoader />

                    :

                    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-28 px-4 sm:px-6 lg:px-8 overflow-hidden relative">


                        {/* Animated Background SVGs */}
                        {isClient && (<AnimatedSvg />)}



                        <div className="max-w-7xl mx-auto relative z-10">

                            <motion.div
                                className="text-center mb-16"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="inline-block mb-2 px-4 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-sm font-medium text-indigo-600">
                                    Membership Plans
                                </div>

                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 pb-3">
                                    Unlock Your Full Potential with Premium
                                </h1>

                                <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-600">
                                    Access exclusive job opportunities, build your resume, and stand out to top employers.
                                </p>

                            </motion.div>



                            {/* Current plan indicator */}
                            <motion.div
                                className="mx-auto max-w-2xl mb-10 text-center px-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >

                                {currentPlan?.toLowerCase() === 'free' ? (
                                    <div className="w-full flex justify-center items-center px-4 py-6">
                                        <div className="w-full max-w-md bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 rounded-2xl p-5 shadow-md">
                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                                <div className="flex items-center justify-center w-14 h-14 bg-orange-100 rounded-xl text-orange-600 shadow-inner flex-shrink-0">
                                                    <AlertCircle size={28} className="animate-bounce" />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        Plan Not Subscribed
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Please subscribe to a plan to continue using this feature.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Plan Indicator */
                                    <div className="bg-white rounded-xl shadow-lg px-6 py-4 inline-flex items-center gap-3 border border-gray-100">

                                        {data?.map((plan: Plan) => (

                                            currentPlan?.toLowerCase() === plan?.id && (

                                                <div
                                                    key={plan?.id}
                                                    className={`h-3 w-3 rounded-full animate-pulse 
                                                    ${currentPlan?.toLowerCase() === plan?.id
                                                            ? (isPlanExpired ? "bg-rose-500" : "bg-green-400")
                                                            : "bg-gray-300"}`
                                                    }
                                                ></div>

                                            )

                                        ))}

                                        <span className="font-medium text-gray-700">
                                            Current Plan:
                                        </span>


                                        {data?.map((plan: Plan) => (

                                            currentPlan?.toLowerCase() === plan?.id && (

                                                <span key={plan?.id} className={`font-bold flex items-center gap-2 ${getColorClass(plan?.color, 'text')}`}>
                                                    {plan?.name?.toUpperCase()} <span className="text-rose-500">{currentPlan?.toLowerCase() === plan?.id && isPlanExpired ? '(Expired)' : ' '}</span>
                                                </span>

                                            )

                                        ))}

                                    </div>
                                )}

                            </motion.div>




                            {/* Mobile view (accordion style) */}
                            <div className="md:hidden space-y-6 mb-12">


                                <AnimatePresence>


                                    {data?.map((plan: Plan) => (


                                        <motion.div
                                            key={plan?.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className={`rounded-2xl overflow-hidden transition-all duration-300 ${currentPlan?.toLowerCase() === plan?.id && !isPlanExpired
                                                ? 'bg-white shadow-xl border border-gray-100'
                                                : 'bg-white/80 shadow-md border border-gray-100'
                                                }`}
                                        >


                                            {/* Recommended badge */}
                                            {plan?.recommended && currentPlan?.toLowerCase() !== plan?.id && (
                                                <div className={`${getColorClass(plan?.color, 'bg')} text-white text-sm font-medium text-center py-2 px-4 shadow-md`}>
                                                    Recommended for employers
                                                </div>
                                            )}


                                            {/* Current Plan Indicator */}
                                            {currentPlan?.toLowerCase() === plan?.id && !isPlanExpired && (

                                                <div className=" w-full">
                                                    <div className={`${getColorClass(plan?.color, 'bg')} text-white text-sm font-medium text-center py-2 px-4 shadow-md`}>
                                                        Current Plan
                                                    </div>
                                                </div>

                                            )}


                                            {/* Plan Expired Indicator */}
                                            {currentPlan?.toLowerCase() === plan?.id && isPlanExpired && (

                                                <div className=" w-full">
                                                    <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-medium text-center py-2 px-4 shadow-md">
                                                        Plan Expired
                                                    </div>
                                                </div>

                                            )}


                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className="p-6 flex justify-between items-center cursor-pointer"

                                            >


                                                <div className="flex items-center space-x-4">

                                                    <motion.div
                                                        className={`p-2 rounded-full ${getColorClass(plan?.color, 'bgLight')} flex items-center justify-center`}
                                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                    >
                                                        <div className="flex items-center justify-center w-8 h-8"> {PlanIcons({ plan: plan?.id })}</div>
                                                    </motion.div>


                                                    {/* Plan Price */}
                                                    <div>
                                                        <h3 className="text-xl font-semibold">{plan?.name?.toUpperCase()}</h3>
                                                        <div className="flex items-baseline">

                                                            <span className={`${plan?.id === 'premium' && currentPlan?.toLowerCase() === 'standard' && isoffer ? 'line-through text-gray-400' : ''} text-2xl font-extrabold`}>
                                                                {plan?.price === '0' ? 'Free' : `Rs. ${parseInt(plan?.price).toLocaleString()}`}
                                                            </span>

                                                            <span className='text-2xl font-extrabold ms-5'>{plan?.id === 'premium' && currentPlan?.toLowerCase() === 'standard' && isoffer ? ` Rs. ${Number(plan?.price) - 0.5 * Number(currentPlanData?.price || 0)}` : ''}</span>

                                                        </div>

                                                        {plan?.note && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                                                className={`mt-2 inline-flex relative overflow-hidden rounded-full font-semibold`}
                                                            >
                                                                <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${getColorClass(plan?.color, 'gradient')} animate-pulse`} />
                                                                <div className={`relative px-3 py-1 flex items-center gap-1.5 ${getColorClass(plan?.color, 'text')} text-xs bg-white/50 backdrop-blur-sm border ${getColorClass(plan?.color, 'border')} rounded-full shadow-sm`}>
                                                                    <svg className="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {plan.note}
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                    </div>

                                                </div>


                                                <motion.div
                                                    animate={{ rotate: currentPlan?.toLowerCase() === plan?.id ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </motion.div>


                                            </motion.div>



                                            <AnimatePresence>

                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="px-6 pb-6 pt-2 overflow-hidden"
                                                >
                                                    <ul className="space-y-3">

                                                        {plan?.features?.map((feature, idx) => (

                                                            <motion.li
                                                                key={idx}
                                                                className="flex justify-between items-center py-2 border-b border-gray-100"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                            >
                                                                <span className="text-gray-600">{feature?.name}</span>

                                                                <span className={`font-medium ${feature?.value === 'Yes' ? 'text-green-500' :
                                                                    feature?.value === 'No' ? 'text-gray-400' :
                                                                        getColorClass(plan?.color, 'text')
                                                                    }`}>
                                                                    {feature?.value}
                                                                </span>

                                                            </motion.li>

                                                        ))}

                                                    </ul>




                                                    {/* Plan Upgrade Button */}
                                                    <motion.button
                                                        whileHover={{ scale: isPlanExpired || currentPlan?.toLowerCase() !== plan?.id ? 1.05 : 1 }}
                                                        whileTap={{ scale: isPlanExpired || currentPlan?.toLowerCase() !== plan?.id ? 0.95 : 1 }}
                                                        className={`w-full py-3 px-6 rounded-xl font-medium text-white bg-gradient-to-r 
                                                        ${getColorClass(plan?.color, 'gradient')} shadow-lg  
                                                        ${(currentPlan?.toLowerCase() === plan?.id && !isPlanExpired) || // Disable current active plan
                                                                (plan?.id === "standard" && currentPlan?.toLocaleLowerCase() === "premium" && !isPlanExpired) || Progress // Disable Standard plan if another plan is active 
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                            }`}
                                                        disabled={
                                                            (currentPlan?.toLowerCase() === plan?.id && !isPlanExpired) || // Disable current active plan
                                                            (plan?.id === "standard" && currentPlan?.toLowerCase() === "premium" && !isPlanExpired)
                                                        }
                                                        onClick={() => handlePlanUpgrade(plan?.id, plan?.price)}
                                                    >
                                                        {Progress ?
                                                            <span className="animate-spin">🔄 Loading...</span> :
                                                            currentPlan?.toLowerCase() === plan?.id && isPlanExpired
                                                                ? "Renew Plan"
                                                                : currentPlan?.toLowerCase() === plan?.id
                                                                    ? "Current Plan"
                                                                    : "Upgrade Now"}


                                                    </motion.button>



                                                </motion.div>

                                            </AnimatePresence>


                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                            </div>






                            {/* Desktop view (side-by-side) */}
                            <motion.div
                                className="hidden md:grid grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {data?.map((plan: Plan) => (

                                    <motion.div
                                        key={plan?.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -8 }}
                                        className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${currentPlan?.toLowerCase() === plan?.id && !isPlanExpired
                                            ? `bg-white shadow-xl border-2 ${getColorClass(plan?.color, 'border')} ${getColorClass(plan?.color, 'shadow')}`
                                            : 'bg-white/90 shadow-md border border-gray-100'
                                            }`}

                                    >


                                        {/* Current Plan Indicator */}
                                        {currentPlan?.toLowerCase() === plan?.id && !isPlanExpired && (

                                            <div className="absolute top-0 left-0 right-0 w-full">
                                                <div className={`${getColorClass(plan?.color, 'bg')} text-white text-sm font-medium text-center py-2 px-4 shadow-md`}>
                                                    Current Plan
                                                </div>
                                            </div>

                                        )}


                                        {/* Recommended tag with correct positioning */}
                                        {plan?.recommended && currentPlan?.toLowerCase() !== plan?.id && (
                                            <div className="absolute top-0 left-0 right-0 w-full">
                                                <div className={`${getColorClass(plan?.color, 'bg')} text-white text-sm font-medium text-center py-2 px-4 shadow-md`}>
                                                    Recommended for Employers
                                                </div>
                                            </div>
                                        )}


                                        {/* Plan Expired Indicator */}
                                        {currentPlan?.toLowerCase() === plan?.id && isPlanExpired && (

                                            <div className="absolute top-0 left-0 right-0 w-full">
                                                <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-medium text-center py-2 px-4 shadow-md">
                                                    Plan Expired
                                                </div>
                                            </div>

                                        )}


                                        {/* Active Indicator */}
                                        {currentPlan?.toLowerCase() === plan?.id && !isPlanExpired && (
                                            <motion.div
                                                className={`absolute top-0 left-0 w-full h-1 ${getColorClass(plan?.color, 'bg')} ${plan?.recommended ? 'mt-8' : ''}`}
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}


                                        {/* Plan Content */}
                                        <div className={`p-8 ${plan?.recommended || currentPlan?.toLowerCase() === plan?.id && isPlanExpired || currentPlan?.toLowerCase() === plan?.id ? 'pt-12' : ''}`}>


                                            <div className="flex justify-between items-start mb-6">


                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <h3 className="text-2xl font-bold mb-1">{plan?.name?.toUpperCase()}</h3>

                                                        {currentPlan?.toLowerCase() === plan?.id && (
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className={`px-2 py-1 text-xs rounded-full ${getColorClass(plan?.color, 'bgLight')} ${getColorClass(plan?.color, 'text')}`}
                                                            >
                                                                Current
                                                            </motion.span>
                                                        )}

                                                    </div>


                                                    {/* PLan Price */}
                                                    <div className="flex items-baseline">

                                                        <span className={`${plan?.id === 'premium' && currentPlan?.toLowerCase() === 'standard' && isoffer ? 'line-through text-gray-400' : ''} text-2xl font-extrabold`}>
                                                            {plan?.price === '0' ? 'Free' : `Rs. ${parseInt(plan?.price).toLocaleString()}`}
                                                        </span>

                                                        <span className='text-2xl font-extrabold ms-5'>{plan?.id === 'premium' && currentPlan?.toLowerCase() === 'standard' && isoffer ? ` Rs. ${Number(plan?.price) - 0.5 * Number(currentPlanData?.price || 0)}` : ''}</span>

                                                    </div>



                                                    {plan?.note && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                                            className={`mt-3 inline-flex relative overflow-hidden rounded-full font-semibold`}
                                                        >
                                                            <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${getColorClass(plan?.color, 'gradient')} animate-pulse`} />
                                                            <div className={`relative px-4 py-1.5 flex items-center gap-2 ${getColorClass(plan?.color, 'text')} text-sm bg-white/50 backdrop-blur-sm border ${getColorClass(plan?.color, 'border')} rounded-full shadow-sm`}>
                                                                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {plan.note}
                                                            </div>
                                                        </motion.div>
                                                    )}


                                                </div>


                                                <motion.div
                                                    className={`p-3 rounded-full ${getColorClass(plan?.color, 'bg')} flex items-center justify-center`}
                                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                >
                                                    <div className={`flex items-center justify-center w-8 h-8`}>
                                                        {PlanIcons({ plan: plan?.id })}
                                                    </div>

                                                </motion.div>


                                            </div>



                                            {/* Plan Features */}
                                            <ul className="space-y-4 mb-8">

                                                {plan?.features?.map((feature, idx) => (

                                                    <motion.li
                                                        key={idx}
                                                        className="flex items-center justify-between"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                                    >

                                                        <span className="text-gray-700">{feature?.name}</span>


                                                        <span className={`font-medium ${feature?.value === 'Yes' ? 'text-green-600' :


                                                            feature?.value === 'No' ? 'text-gray-400' :
                                                                typeof checkValue(feature?.value) === 'boolean' ?
                                                                    checkValue(feature?.value) ? 'text-green-600' : 'text-gray-400' :
                                                                    getColorClass(plan?.color, 'text')
                                                            }`}>


                                                            {feature?.value === 'Yes' ? (

                                                                <span className="flex items-center">
                                                                    <svg className="w-5 h-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    {feature?.value}
                                                                </span>


                                                            ) : feature?.value === 'No' ? (


                                                                <span className="flex items-center">
                                                                    <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                    {feature?.value}
                                                                </span>


                                                            ) : (

                                                                feature?.value

                                                            )}

                                                        </span>

                                                    </motion.li>

                                                ))}


                                            </ul>



                                            {/* Plan Upgrade Button */}
                                            <motion.button
                                                whileHover={{ scale: isPlanExpired || currentPlan?.toLowerCase() !== plan?.id ? 1.05 : 1 }}
                                                whileTap={{ scale: isPlanExpired || currentPlan?.toLowerCase() !== plan?.id ? 0.95 : 1 }}
                                                className={`w-full py-3 px-6 rounded-xl font-medium text-white bg-gradient-to-r 
                                                        ${getColorClass(plan?.color, 'gradient')} shadow-lg  
                                                        ${(currentPlan?.toLowerCase() === plan?.id && !isPlanExpired) || // Disable current active plan
                                                        (plan?.id === "standard" && currentPlan?.toLocaleLowerCase() === "premium" && !isPlanExpired) || Progress // Disable Standard plan if another plan is active 
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                    }`}
                                                disabled={
                                                    (currentPlan?.toLowerCase() === plan.id && !isPlanExpired) || // Disable current active plan
                                                    (plan?.id === "standard" && currentPlan?.toLowerCase() === "premium" && !isPlanExpired)
                                                }
                                                onClick={() => handlePlanUpgrade(plan?.id, plan?.price)}
                                            >
                                                {Progress ?
                                                    <span className="animate-spin">🔄 Loading...</span> :
                                                    currentPlan?.toLowerCase() === plan?.id && isPlanExpired
                                                        ? "Renew Plan"
                                                        : currentPlan?.toLowerCase() === plan?.id
                                                            ? "Current Plan"
                                                            : "Upgrade Now"}


                                            </motion.button>


                                        </div>


                                    </motion.div>


                                ))}


                            </motion.div>


                        </div >

                    </div >

            }

        </>
    );
};

export default EmployerPlansPage;