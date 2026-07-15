import { useState, useEffect } from 'react';
import { CirclePlus, Clock, Calendar, AlertCircle, Award, Zap, Settings } from 'lucide-react';
import { PlanUsage } from '@/Hooks/PlanHook';
import PlanUsageLoader from '@/components/Loader/PlanUsageLoader';
import { Link } from 'react-router-dom';
import { PlanFeature } from '@/Hooks/PlanHook';



const PlanUsageDashboard = () => {


    // Get Plan Usage Data
    const { data: userData, isLoading, isError, isFetching } = PlanUsage();



    // Calculate days remaining
    const calculateDaysRemaining = () => {
        const today = new Date();
        const expiryDate = new Date(userData?.planExpiryDate ?? '');
        const timeDiff = expiryDate.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };


    const daysRemaining = calculateDaysRemaining();


    // Animation states
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [showDetails, setShowDetails] = useState(false);



    useEffect(() => {

        // Staggered animations
        setTimeout(() => setIsLoaded(true), 100);

        const timer = setInterval(() => {
            setAnimationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 15);


        setTimeout(() => setShowDetails(true), 800);

        return () => clearInterval(timer);

    }, []);



    // Format date for display
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    return (


        <div className="min-h-screen pt-24 font-sans bg-white">


            {isLoading || isError || isFetching ? <PlanUsageLoader /> :


                <div className={`max-w-5xl mx-auto transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>


                    {/* Header */}
                    <div className="mb-6 text-center">

                        <h1 className="text-4xl font-bold text-orange-600 mb-2 tracking-tight">Plan Usage</h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-6"></div>

                    </div>


                    {/* Main Content Area */}
                    <div className="relative">

                        {/* Current Plan Status Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-orange-100 overflow-hidden relative mb-6">

                            {/* Background subtle elements */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-50 rounded-full"></div>
                            <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-orange-50 rounded-full"></div>


                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">


                                <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                                    <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-2 rounded-full mb-3 shadow-lg shadow-orange-200">
                                        <Award size={18} className="mr-2 text-white" />
                                        <span className="text-white font-semibold">{userData?.plan}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800">Current Plan</h2>
                                </div>


                                {userData?.planExpired ? (
                                    <div className={`mt-4 md:mt-0 flex items-center px-6 py-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                                        <AlertCircle size={20} className="mr-3 text-red-400" />
                                        <span className="font-medium">Plan Expired</span>
                                    </div>
                                ) : (
                                    <div className={`mt-4 md:mt-0 flex items-center px-6 py-3 bg-green-50 text-green-500 rounded-2xl border border-green-100 transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                                        <Clock size={20} className="mr-3 text-green-500" />
                                        <span className="font-medium">{daysRemaining} days remaining</span>
                                    </div>
                                )}


                            </div>



                            {/* Usage Progress Card - Prominent */}
                            {userData?.planFeatures?.map((item: PlanFeature, idx: number) => {

                                const used = Number(item.used);
                                const limit = Number(item.limit);

                                const usagePercentage =
                                    Number.isFinite(used) &&
                                        Number.isFinite(limit) &&
                                        limit > 0
                                        ? Math.round((used / limit) * 100)
                                        : 0;
                                return (

                                    <div key={idx} className={`mb-8 transform transition-all duration-700 border-b border-gray-200/55 pb-8 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '500ms' }}>


                                        <div className="flex justify-between mb-3">
                                            <h3 className="font-semibold text-gray-700 text-lg">{item?.name}</h3>
                                            <span className="text-orange-500 font-medium">{item?.used} of {item?.limit} used</span>
                                        </div>


                                        {/* Progress Bar */}
                                        <div className="h-8 w-full bg-orange-50 rounded-full overflow-hidden p-1.5 shadow-inner">
                                            <div
                                                className={`h-full ${usagePercentage > 80 ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-gradient-to-r from-orange-500 to-orange-300'} rounded-full flex items-center transition-all duration-1500 ease-out relative`}
                                                style={{
                                                    width: `${Math.min(animationProgress, usagePercentage)}%`,
                                                }}
                                            >
                                                <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-orange-500 transition-opacity duration-300 ${animationProgress >= 30 ? 'opacity-100' : 'opacity-0'}`}></div>
                                            </div>
                                        </div>


                                        {/* Data Points */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">


                                            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 hover:border-orange-300 transition-all duration-300 group">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                                        <Zap size={20} className="text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">{item?.name} Used</p>
                                                        <p className="text-gray-800 text-xl font-bold group-hover:text-orange-500 transition-colors duration-300">{item?.used}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 hover:border-orange-300 transition-all duration-300 group">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                                        <CirclePlus size={20} className="text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">{item?.name} Left</p>
                                                        <p className="text-gray-800 text-xl font-bold group-hover:text-orange-500 transition-colors duration-300">{Number(item?.limit ?? 0) - Number(item?.used ?? 0)}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 hover:border-orange-300 transition-all duration-300 group">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                                        <Settings size={20} className="text-orange-500 animate-spin-slow" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm">Used</p>
                                                        <p className="text-gray-800 text-xl font-bold group-hover:text-orange-500 transition-colors duration-300">{usagePercentage}%</p>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                    </div>

                                )
                            })}

                            {/* Calendar Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                <div className={`flex items-center p-6 bg-orange-50 rounded-2xl border border-orange-100 transform transition-all duration-700 hover:border-orange-300 hover:bg-orange-100 group ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl mr-4 group-hover:bg-orange-50 transition-all duration-300 shadow-md">
                                        <Calendar size={22} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Plan Started</p>
                                        <p className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{userData?.planCreatedDate && formatDate(userData?.planCreatedDate)}</p>
                                    </div>
                                </div>


                                <div className={`flex items-center p-6 bg-orange-50 rounded-2xl border border-orange-100 transform transition-all duration-700 hover:border-orange-300 hover:bg-orange-100 group ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl mr-4 group-hover:bg-orange-50 transition-all duration-300 shadow-md">
                                        <Calendar size={22} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Plan Expires</p>
                                        <p className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{userData?.planExpiryDate && formatDate(userData?.planExpiryDate)}</p>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>


                    {/* Upgrade/Renewal CTA - With floating animation */}
                    <div className={`mt-8 text-center transform transition-all duration-1000 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>


                        {userData?.planExpired && (

                            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center shadow-xl">

                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle size={28} className="text-red-500" />
                                </div>


                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Your Plan Has Expired</h3>
                                <p className="text-red-500 mb-6">Renew now to continue enjoying our services</p>


                                <Link to={'/plans'}>
                                    <button className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium py-4 px-16 rounded-2xl shadow-lg shadow-red-200 transition-all duration-300">
                                        <span className="relative z-10">Renew Plan Now</span>
                                        <div className="absolute inset-0 scale-0 rounded-2xl group-hover:scale-100 transition-transform duration-500 bg-gradient-to-r from-red-600 to-orange-600 origin-bottom"></div>
                                    </button>
                                </Link>

                            </div>

                        )}

                    </div>


                </div>

            }

        </div>
    );
};

export default PlanUsageDashboard;