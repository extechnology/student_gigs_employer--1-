import { UserLogin, GoogleAuth, UserRegister } from "../Hooks/UserLogin";
import { useState } from "react";
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../Context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader, Phone } from "lucide-react";
import EmailOtp from "@/components/otp/EmailOtp";
import ForgetPassword from "@/components/otp/ForgetPassword";
import MobileOtpModal from "@/components/otp/MobileOtp";



// form inputs types
type Inputs = {
    email: string
    password: string
    repassword: string
    username: string
}



export default function Auth() {


    // Password and re-password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);



    // Register Data
    const [RegisterData, setRegisterData] = useState({});



    // Email Otp Modal
    const [otpModal, setOtpModal] = useState(false);



    // Mobile Otp Modal
    const [isMobileOtpModalOpen, setIsMobileOtpModalOpen] = useState(false);



    // Forgot Password Modal
    const [forgotModal, setForgotModal] = useState(false);



    // Navigate
    const Navigate = useNavigate()



    // Get the current path
    const location = useLocation();



    // Login and register status
    const [Status, SetStatus] = useState(true)




    // React Hook Form state
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>({ mode: "onChange" })




    // Scroll to top when page is loaded
    window.scrollTo({ top: 0, behavior: 'smooth', });




    // Mutate for user Register
    const { mutate, isPending: isRegisterPending } = UserRegister()




    // Mutate for user Login
    const { mutate: mutateLogin, isPending: isLoginPending } = UserLogin()




    // Mutate for Google Login
    const { mutate: mutateGoogleLogin, isPending: isGoogleLoginPending } = GoogleAuth()




    // login Provider
    const { login } = useAuth()



    const queryclient = useQueryClient();



    // Submit Register
    const SubmitRegister = (data: any) => {


        setRegisterData(data)


        const formdata = new FormData()

        formdata.append("email", data.email)
        formdata.append("username", data.username)
        formdata.append("password", data.password)
        formdata.append("password_confirm", data.repassword)


        // Mutate
        mutate(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    setOtpModal(true)

                    queryclient.invalidateQueries({ queryKey: ["UserProfile"] });

                }
                else {

                    console.log(response)

                    reset()

                    handleErrors(response?.response?.data);

                }

            }

        })

        // Function to handle and display errors
        const handleErrors = (errors: any) => {

            if (errors) {

                Object.entries(errors).forEach(([key, value]) => {

                    if (Array.isArray(value)) {
                        value.forEach((message: string) => {
                            toast.error(`${message}`);
                        });
                    } else {
                        toast.error(`${key}: ${value}`);
                    }

                })

            } else {

                toast.error("Something went wrong. Please try again.")

            }

        }

    }


    // Submit Login
    const SubmitLogin = (data: any) => {


        const formdata = new FormData()

        formdata.append("username", data.username)
        formdata.append("password", data.password)


        // Mutate
        mutateLogin(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    toast.success("User Register Successfully")

                    // Get previous route or default to Find Talent
                    const from = location.state?.from?.pathname || "/findtalent/";

                    queryclient.invalidateQueries({ queryKey: ["UserProfile"] });

                    reset()


                    login(response.data.access)


                    Navigate(from, { replace: true })



                }
                else {

                    console.log(response)

                    handleErrors(response?.response?.data);

                }

            }

        })


        // Function to handle and display errors
        const handleErrors = (errors: any) => {

            if (errors) {

                Object.entries(errors).forEach(([value]) => {

                    if (Array.isArray(value)) {
                        value.forEach((message: string) => {
                            toast.error(`${message}`);
                        });
                    } else {
                        toast.error(`${value}`);
                    }

                })

            } else {

                toast.error("Something went wrong. Please try again.")

            }

        }

    }



    // Google Login
    const GoogleLogin = useGoogleLogin({

        onSuccess: async (tokenResponse) => {

            try {

                const AccessToken = tokenResponse.access_token

                // Getting User Info Form Google
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${AccessToken}`,
                    },
                });


                if (!userInfoResponse.ok) {

                    toast.error("Something went wrong. Please try again.")

                    throw new Error('Failed to fetch user info');


                }
                else {

                    const userInfo = await userInfoResponse.json();

                    const formdata = new FormData()

                    formdata.append("username", userInfo.name)
                    formdata.append("email", userInfo.email)


                    // Mutate
                    mutateGoogleLogin(formdata, {

                        onSuccess: (response) => {

                            if (response.status >= 200 && response.status <= 300) {

                                queryclient.invalidateQueries({ queryKey: ["UserProfile"] });

                                // Get previous route or default to Find Talent
                                const from = location.state?.from?.pathname || "/findtalent/";

                                login(response.data.access)

                                toast.success("Login Successfull..!")

                                Navigate(from, { replace: true })

                            }
                            else {

                                console.log(response)

                                toast.error("Something went wrong. Please try again.")

                            }

                        }

                    })

                }

            } catch (err) {

                console.log(err);

            }

        },
        onError(errorResponse) {

            console.log(errorResponse);

            toast.error("Google Login Failed. Please try again.")

        },

    })


    // Change Status
    const handleStatusChnage = () => { SetStatus(!Status) }


    return (


        <>


            <main className="w-full h-full bg-slate-50/25">


                <div className="flex flex-wrap">


                    <div className="flex w-full flex-col md:w-1/2">

                        <div className="flex justify-center pt-5 md:-mb-24 md:justify-start md:pl-12">
                            <Link to="/" className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900 sm:mb-28 mb-3"> StudentsGigs </Link>
                        </div>


                        {/* Login */}
                        {

                            Status ?

                                // Login 
                                <div className="lg:w-[28rem] w-[19rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">

                                    <p className="text-left text-3xl font-bold">Login as Employer</p>
                                    <p className="mt-2 text-left text-gray-500">please enter your details.</p>


                                    <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit(SubmitLogin)}>


                                        {/* Username */}
                                        <div className="flex flex-col pt-4">
                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type="text" id="login-username" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Username"

                                                    {...register("username", { required: "Username is required" })}

                                                />
                                                {errors.username && <p role="alert" className="text-red-500 text-sm">{errors.username.message}</p>}
                                            </div>
                                        </div>



                                        {/*Password */}
                                        <div className="mb-5 flex flex-col pt-4">
                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type={showPassword ? "text" : "password"} id="login-password" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Password"

                                                    {...register("password", { required: "Password is required" })}

                                                />

                                                <button
                                                    type="button"
                                                    className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>

                                                {errors.password && <p role="alert" className="text-red-500 text-sm">{errors.password.message}</p>}
                                            </div>

                                            {/* Terms and Conditions Notice */}
                                            <div className="mb-6 text-start mt-3 text-sm text-gray-600">
                                                By logging in, you agree to our{" "}
                                                <Link
                                                    to="/loginterms"
                                                    className="text-gray-900 font-medium underline hover:text-black transition-colors"
                                                >
                                                    Terms and Conditions
                                                </Link>
                                                .
                                            </div>

                                        </div>


                                        {/* Login */}
                                        <button type="submit" disabled={isLoginPending} className={`w-full cursor-pointer rounded-lg ${isLoginPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900'} px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 flex items-center justify-center`}>
                                            Log In {isLoginPending && <Loader className="animate-spin ms-3 duration-3000" />}
                                        </button>

                                    </form>


                                    <div className="relative mt-8 flex h-px place-items-center bg-gray-200">
                                        <div className="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-white text-center text-sm text-gray-500">or</div>
                                    </div>



                                    {/* Google Login */}
                                    <button disabled={isGoogleLoginPending} onClick={() => GoogleLogin()} className={`cursor-pointer shadow-lg mt-8 flex items-center justify-center rounded-md  px-4 py-2 outline-none ring-gray-400 ring-offset-2 transition focus:ring-2 hover:border-transparent hover:bg-black hover:text-white ${isGoogleLoginPending ? 'bg-gray-400 cursor-not-allowed' : ''} `}>
                                        <img className="mr-2 h-5" src="https://static.cdnlogo.com/logos/g/35/google-icon.svg" alt="google-icon" /> Log in with Google {isGoogleLoginPending && <Loader className="animate-spin ms-3 duration-3000" />}
                                    </button>


                                    {/* Mobile Number Login */}
                                    <button
                                        onClick={() => { setIsMobileOtpModalOpen(true) }}
                                        className={`cursor-pointer shadow-lg mt-4 flex items-center justify-center rounded-md px-4 py-2 outline-none ring-gray-400 ring-offset-2 transition focus:ring-2 hover:border-transparent hover:bg-black hover:text-white `}
                                    >
                                        <Phone className="mr-2 h-5 w-5 hover:text-white" />
                                        Log in with Phone
                                    </button>


                                    <div className="pt-5 pb-4 text-center">
                                        <p className="whitespace-nowrap text-gray-600">
                                            Don't have an account?
                                            <a onClick={() => { SetStatus(!Status), reset() }} className="cursor-pointer underline-offset-4 font-semibold text-gray-900 hover:underline ms-3">Sign up</a>
                                        </p>
                                    </div>


                                    <div className=" text-center flex justify-center">

                                        <p className="whitespace-nowrap text-gray-600">
                                            <a onClick={() => { setForgotModal(!forgotModal) }} className="cursor-pointer underline-offset-4 font-semibold text-gray-900 hover:underline ms-3">Forget Password & Uername ?</a>
                                        </p>

                                        {/* {Status?<p className="whitespace-nowrap text-gray-600">
                                            <a href="https://studentsgigs.com/auth" className="cursor-pointer underline-offset-4 font-semibold text-gray-900 hover:underline ms-3">Login as Student</a>
                                        </p> : null} */}

                                    </div>

                                </div>

                                :

                                // Register Section
                                <div className="lg:w-[28rem] w-[19rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">

                                    <p className="text-left text-3xl font-bold">Register Here</p>
                                    <p className="mt-2 text-left text-gray-500">please enter your details.</p>



                                    <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit(SubmitRegister)}>


                                        {/* Username */}
                                        <div className="flex flex-col pt-4">
                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type="text" id="login-username" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Username"

                                                    {...register("username", {
                                                        required: "Username is required", pattern: {
                                                            value: /^[a-zA-Z0-9]+$/,
                                                            message: "Only letters and numbers are allowed",
                                                        },
                                                    })}

                                                />
                                                {errors.username && <p role="alert" className="text-red-500 text-sm">{errors.username.message}</p>}
                                            </div>
                                        </div>



                                        {/* Email */}
                                        <div className="flex flex-col pt-4">
                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type="email" id="login-email" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Email"

                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: "Invalid email address"
                                                        }
                                                    })}


                                                />
                                                {errors.email && <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>}
                                            </div>
                                        </div>



                                        {/* Password */}
                                        <div className=" flex flex-col pt-4">
                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type={showPassword ? "text" : "password"} id="login-password" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Password"

                                                    {...register("password", { required: "Password is required" })}

                                                />

                                                <button
                                                    type="button"
                                                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>

                                                {errors.password && <p role="alert" className="text-red-500 text-sm">{errors.password.message}</p>}
                                            </div>
                                        </div>



                                        {/* Re-enter Password */}
                                        <div className="mb-3 flex flex-col pt-4">

                                            <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                                                <input type={showRePassword ? "text" : "password"} id="login-password" className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Re-enter Password"

                                                    {...register("repassword", { required: "Re-enter Password is required" })}

                                                />

                                                <button
                                                    type="button"
                                                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowRePassword(!showRePassword)}
                                                >
                                                    {showRePassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>

                                                {errors.repassword && <p role="alert" className="text-red-500 text-sm">{errors.repassword.message}</p>}
                                            </div>

                                            {/* Terms and Conditions Notice */}
                                            <div className="mb-6 text-start mt-3 text-sm text-gray-600">
                                                By registering, you agree to our{" "}
                                                <Link
                                                    to="/loginterms"
                                                    className="text-gray-900 font-medium underline hover:text-black transition-colors"
                                                >
                                                    Terms and Conditions
                                                </Link>
                                                .
                                            </div>

                                        </div>


                                        {/* Sign Up */}
                                        <button type="submit" disabled={isRegisterPending} className={`w-full cursor-pointer rounded-lg ${isRegisterPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900'} px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 flex items-center justify-center`}>

                                            Sign Up {isRegisterPending && <Loader className="animate-spin duration-3000 ms-3" />}

                                        </button>

                                    </form>


                                    <div className="py-12 text-center">
                                        <p className="whitespace-nowrap text-gray-600">
                                            Alredy have an account?
                                            <a onClick={() => { SetStatus(!Status), reset() }} className="underline-offset-4 font-semibold text-gray-900 hover:underline ms-3 cursor-pointer">Log In</a>
                                        </p>
                                    </div>

                                </div>

                        }

                    </div>


                    {/* Image Section */}
                    <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
                        <div className="absolute bottom-0 z-10 px-8 text-white opacity-100">
                            <p className="mb-5 text-3xl font-semibold leading-10"> Our mission is to make students independent, responsible, and equipped
                                with practical exposure while learning.</p>
                            <p className="mb-4 text-3xl font-semibold">Students Gigs</p>
                            <p className="">Dr Vimal K R , Founder CEO</p>
                            <p className="mb-7 text-sm opacity-70">Medresearch India Pvt Ltd</p>
                        </div>
                        <img className=" absolute top-0 h-full w-full object-cover opacity-90" loading="lazy" src="https://www.shutterstock.com/image-photo/university-graduation-ceremonies-on-commencement-600nw-298297430.jpg" />
                    </div>


                </div>


                {/* OTP Modal */}
                <EmailOtp handleStatus={handleStatusChnage} isOpen={otpModal} setIsOpen={setOtpModal} RegisterData={RegisterData} reset={reset} />



                {/* Forget Password Modal */}
                <ForgetPassword isOpen={forgotModal} setIsOpen={setForgotModal} />



                {/* Mobile OTP Modal */}
                <MobileOtpModal isOpen={isMobileOtpModalOpen} setIsOpen={setIsMobileOtpModalOpen} />


            </main>


        </>


    )



}
