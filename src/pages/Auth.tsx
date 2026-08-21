import { UserLogin, GoogleAuth, UserRegister, useMobileOtp, useVerifyMobileOtp } from "../Hooks/UserLogin";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../Context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader, ShieldCheck, User, ChevronRight, ArrowLeft, RefreshCw, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from "libphonenumber-js";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import EmailOtp from "@/components/otp/EmailOtp";
import ForgetPassword from "@/components/otp/ForgetPassword";

type AuthMode = 'mobile' | 'otp' | 'password' | 'register';

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('mobile');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Phone number state
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // OTP state
  const [otpValue, setOtpValue] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);

  // Register and Modals
  const [registerData, setRegisterData] = useState<any>({});
  const [otpModal, setOtpModal] = useState<boolean>(false);
  const [forgotModal, setForgotModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  // Mutations
  const { mutate: mutateRegister, isPending: isRegisterPending } = UserRegister();
  const { mutate: mutateLogin, isPending: isLoginPending } = UserLogin();
  const { mutate: mutateGoogleLogin, isPending: isGoogleLoginPending } = GoogleAuth();
  const { mutate: sendMobileOtp, isPending: isMobileOtpPending } = useMobileOtp();
  const { mutate: verifyMobileOtp, isPending: isVerifyOtpPending } = useVerifyMobileOtp();

  // Forms for Password / Register
  type PasswordInputs = {
    username: string;
    password: string;
  };

  type RegisterInputs = {
    email: string;
    username: string;
    password: string;
    repassword: string;
  };

  const loginForm = useForm<PasswordInputs>({ mode: "onChange" });
  const registerForm = useForm<RegisterInputs>({ mode: "onChange" });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    if (authMode !== "otp") return;

    setTimeLeft(300);
    setIsResendDisabled(true);
    setOtpExpired(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpExpired(true);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [authMode, timerKey]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Helper for error toasts
  const handleErrors = (errors: any) => {
    if (!errors) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if (typeof errors === "string") {
      toast.error(errors);
    } else if (errors.detail) {
      toast.error(errors.detail);
    } else if (errors.error) {
      toast.error(errors.error);
    } else if (Array.isArray(errors)) {
      errors.forEach((msg: string) => toast.error(msg));
    } else if (typeof errors === "object") {
      Object.entries(errors).forEach(([, value]) => {
        if (Array.isArray(value)) {
          value.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(value as string);
        }
      });
    } else {
      toast.error("An unknown error occurred.");
    }
  };

  // 1. Mobile OTP submission
  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!phoneNumber) {
      setPhoneError("Please enter your mobile number");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid mobile number");
      return;
    }

    const formdata = new FormData();
    formdata.append("mobile", phoneNumber);

    sendMobileOtp(formdata, {
      onSuccess: (response: any) => {
        if (response?.status >= 200 && response?.status <= 300) {
          toast.success("An OTP has been sent to your mobile number.");
          setOtpValue("");
          setAuthMode('otp');
          setTimerKey(prev => prev + 1);
        } else {
          handleErrors(response?.response?.data || response?.data);
        }
      },
      onError: (err: any) => {
        handleErrors(err?.response?.data);
      }
    });
  };

  // 2. Verify OTP submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    const formdata = new FormData();
    formdata.append("mobile", phoneNumber);
    formdata.append("otp", otpValue);

    verifyMobileOtp(formdata, {
      onSuccess: (response: any) => {
        if (response?.status >= 200 && response?.status <= 300) {
          toast.success("Logged in successfully!");
          login(response.data.access);
          queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
          const from = location.state?.from?.pathname || "/findtalent/";
          navigate(from, { replace: true });
        } else {
          toast.error(response?.response?.data?.error || response?.data?.error || "Invalid OTP. Please try again.");
        }
      },
      onError: (err: any) => {
        handleErrors(err?.response?.data);
      }
    });
  };

  // 3. Resend OTP
  const handleResendOtp = () => {
    if (!phoneNumber) return;
    const formdata = new FormData();
    formdata.append("mobile", phoneNumber);

    sendMobileOtp(formdata, {
      onSuccess: (response: any) => {
        if (response?.status >= 200 && response?.status <= 300) {
          toast.success("A new OTP has been sent to your mobile number.");
          setOtpValue("");
          setTimerKey(prev => prev + 1);
          setIsResendDisabled(true);
          setOtpExpired(false);
        } else {
          handleErrors(response?.response?.data || response?.data);
        }
      },
      onError: (err: any) => {
        handleErrors(err?.response?.data);
      }
    });
  };

  // 4. Submit Username/Password Login
  const submitLogin = (data: PasswordInputs) => {
    const formdata = new FormData();
    formdata.append("username", data.username);
    formdata.append("password", data.password);

    mutateLogin(formdata, {
      onSuccess: (response: any) => {
        if (response?.status >= 200 && response?.status <= 300) {
          toast.success("Login Successful!");
          const from = location.state?.from?.pathname || "/findtalent/";
          loginForm.reset();
          login(response.data.access);
          queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
          navigate(from, { replace: true });
        } else {
          handleErrors(response?.response?.data);
        }
      },
      onError: (err: any) => {
        handleErrors(err?.response?.data);
      }
    });
  };

  // 5. Submit Register
  const submitRegister = (data: RegisterInputs) => {
    setRegisterData(data);
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("username", data.username);
    formdata.append("password", data.password);
    formdata.append("password_confirm", data.repassword);

    mutateRegister(formdata, {
      onSuccess: (response: any) => {
        if (response?.status >= 200 && response?.status <= 300) {
          setOtpModal(true);
        } else {
          handleErrors(response?.response?.data);
        }
      },
      onError: (err: any) => {
        handleErrors(err?.response?.data);
      }
    });
  };

  // 6. Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoResponse.ok) {
          toast.error("Failed to fetch Google user profile");
          return;
        }

        const userInfo = await userInfoResponse.json();
        const formdata = new FormData();
        formdata.append("username", userInfo.name);
        formdata.append("email", userInfo.email);

        mutateGoogleLogin(formdata, {
          onSuccess: (response: any) => {
            if (response?.status >= 200 && response?.status <= 300) {
              const from = location.state?.from?.pathname || "/findtalent/";
              login(response.data.access);
              queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
              toast.success("Login Successful!");
              navigate(from, { replace: true });
            } else {
              handleErrors(response?.response?.data);
            }
          },
          onError: (err: any) => {
            handleErrors(err?.response?.data);
          }
        });
      } catch (err) {
        console.error(err);
        toast.error("Google authentication failed.");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("Google Login Failed. Please try again.");
    }
  });

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-stretch">
      <div className="flex w-full flex-col lg:flex-row min-h-screen">

        {/* Form Container (Left Column) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-6 px-4 sm:px-8 md:px-12 overflow-y-auto">

          {/* Top Logo */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
            <Link to="/" className="inline-flex flex-col items-center group">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                Students<span className="text-orange-500">Gigs</span>
              </span>
              <span className="h-1 w-12 sm:w-14 bg-orange-500 rounded-full mt-1 transition-all duration-300 group-hover:w-20" />
            </Link>
          </div>

          {/* Content Area with Animations */}
          <div className="w-full max-w-[420px] mx-auto my-auto py-4">
            <AnimatePresence mode="wait">

              {/* ─────────────────────────────────────────────────────────────
                  1. INITIAL VIEW: MOBILE NUMBER LOGIN (Employer - Orange Theme)
              ───────────────────────────────────────────────────────────── */}
              {authMode === 'mobile' && (
                <motion.div
                  key="mobile-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col text-center"
                >
                  {/* Welcome Heading */}
                  <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight flex items-center justify-center gap-1.5 mt-2">
                    Welcome to StudentsGigs <span>👋</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5 px-2">
                    Find candidates, interns & top talent for your team.
                  </p>

                  {/* Illustration — ONLY ON MOBILE */}
                  <div className="my-3 sm:my-4 flex justify-center block md:hidden">
                    <img
                      src="/employer-login-illustration.jpg"
                      alt="Employer hiring talent"
                      className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-2xl drop-shadow-sm select-none pointer-events-none"
                    />
                  </div>

                  {/* Mobile Number Section Heading */}
                  <div className="text-left mt-4 md:mt-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      Continue with Mobile Number
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 mb-3">
                      We will send you a One Time Password (OTP)
                    </p>
                  </div>

                  {/* Phone Input Form */}
                  <form onSubmit={handleSendMobileOtp} className="space-y-3.5">
                    <div className="text-left">
                      <div className="phone-login-input">
                        <PhoneInput
                          international
                          defaultCountry="IN"
                          placeholder="Enter mobile number"
                          value={phoneNumber}
                          onChange={(val) => {
                            setPhoneNumber(val);
                            if (phoneError) setPhoneError("");
                          }}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1.5 pl-1">{phoneError}</p>
                      )}
                    </div>

                    {/* Continue with OTP Button */}
                    <button
                      type="submit"
                      disabled={isMobileOtpPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                    >
                      {isMobileOtpPending ? (
                        <>
                          Sending OTP <Loader className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" /> Continue with OTP
                        </>
                      )}
                    </button>
                  </form>

                  {/* "or" Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-gray-200" />
                    <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">or</span>
                  </div>

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    disabled={isGoogleLoginPending}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                    {isGoogleLoginPending && <Loader className="w-4 h-4 animate-spin ml-1 text-gray-500" />}
                  </button>

                  {/* Safe & Secure Employer Friendly Badge */}
                  <div className="mt-4 bg-orange-50/70 border border-orange-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        Safe, Secure & Employer Friendly
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-tight">
                        Your company data is protected and verified seamlessly.
                      </p>
                    </div>
                  </div>

                  {/* "Other options" Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-gray-200" />
                    <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">Other options</span>
                  </div>

                  {/* Use username & password instead Row */}
                  <button
                    type="button"
                    onClick={() => setAuthMode('password')}
                    className="w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl hover:bg-orange-50/60 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-5 h-5 text-orange-500" />
                      <span className="text-xs sm:text-sm font-semibold text-orange-600 group-hover:underline">
                        Use username & password instead
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  2. OTP VERIFICATION VIEW (Employer - Orange Theme)
              ───────────────────────────────────────────────────────────── */}
              {authMode === 'otp' && (
                <motion.div
                  key="otp-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col text-center"
                >
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setAuthMode('mobile')}
                    className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Change mobile number
                  </button>

                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto text-orange-500 mb-3">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    OTP Verification
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-gray-800">{phoneNumber}</span>
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* OTP Slots */}
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={(val) => setOtpValue(val)}
                      >
                        <InputOTPGroup className="gap-2 sm:gap-2.5">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-11 h-13 sm:w-12 sm:h-14 text-lg font-bold rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-white transition"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Timer & Expiry */}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {otpExpired ? (
                        <span className="text-red-500 font-medium">
                          OTP Expired! Please request a new one.
                        </span>
                      ) : (
                        <span>
                          OTP Expires In{" "}
                          <span className="text-red-500 font-semibold">{formatTime(timeLeft)}</span>
                        </span>
                      )}
                    </p>

                    {/* Action buttons */}
                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={otpValue.length < 6 || otpExpired || isVerifyOtpPending}
                        className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                      >
                        {isVerifyOtpPending ? (
                          <>
                            Verifying <Loader className="w-4 h-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            Verify & Continue <BadgeCheck className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResendDisabled || isMobileOtpPending}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm"
                      >
                        <RefreshCw className={`w-4 h-4 ${isMobileOtpPending ? 'animate-spin' : ''}`} />
                        Resend OTP
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  3. USERNAME & PASSWORD LOGIN VIEW (Employer - Orange Theme)
              ───────────────────────────────────────────────────────────── */}
              {authMode === 'password' && (
                <motion.div
                  key="password-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setAuthMode('mobile')}
                    className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue with Mobile Number
                  </button>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
                    Login As Employer
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 text-left mt-1 mb-6">
                    Enter your username and password to log in.
                  </p>

                  <form onSubmit={loginForm.handleSubmit(submitLogin)} className="space-y-4">
                    {/* Username */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Username</label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        {...loginForm.register("username", { required: "Username is required" })}
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition pr-11"
                          {...loginForm.register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Forgot Password link */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setForgotModal(true)}
                        className="text-xs text-orange-600 font-medium hover:underline cursor-pointer"
                      >
                        Forgot Password & Username?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoginPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base mt-2"
                    >
                      {isLoginPending ? (
                        <>
                          Logging In <Loader className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        "Log In"
                      )}
                    </button>
                  </form>

                  {/* "or" Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-gray-200" />
                    <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">or</span>
                  </div>

                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    disabled={isGoogleLoginPending}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Log in with Google</span>
                    {isGoogleLoginPending && <Loader className="w-4 h-4 animate-spin ml-1 text-gray-500" />}
                  </button>

                  {/* Sign Up Link */}
                  <div className="pt-5 text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('register');
                          loginForm.reset();
                        }}
                        className="font-semibold text-orange-600 hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  4. REGISTER VIEW (Employer - Orange Theme)
              ───────────────────────────────────────────────────────────── */}
              {authMode === 'register' && (
                <motion.div
                  key="register-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setAuthMode('mobile')}
                    className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue with Mobile Number
                  </button>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
                    Register Here
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 text-left mt-1 mb-5">
                    Please enter your details to create an employer account.
                  </p>

                  <form onSubmit={registerForm.handleSubmit(submitRegister)} className="space-y-3.5">
                    {/* Username */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Username</label>
                      <input
                        type="text"
                        placeholder="Choose a username"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        {...registerForm.register("username", {
                          required: "Username is required",
                          pattern: {
                            value: /^[a-zA-Z0-9]+$/,
                            message: "Only letters and numbers are allowed",
                          },
                        })}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your work email"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        {...registerForm.register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition pr-11"
                          {...registerForm.register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Re-enter Password */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 text-left">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showRePassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition pr-11"
                          {...registerForm.register("repassword", { required: "Please confirm your password" })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => setShowRePassword(!showRePassword)}
                        >
                          {showRePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                      {registerForm.formState.errors.repassword && (
                        <p className="text-red-500 text-xs mt-1 text-left">
                          {registerForm.formState.errors.repassword.message}
                        </p>
                      )}
                    </div>

                    {/* Terms note */}
                    <p className="text-[11px] sm:text-xs text-gray-500 text-left pt-1">
                      By registering, you agree to our{" "}
                      <Link to="/loginterms" className="text-orange-600 underline font-medium">
                        Terms & Conditions
                      </Link>
                      .
                    </p>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isRegisterPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base mt-3"
                    >
                      {isRegisterPending ? (
                        <>
                          Signing Up <Loader className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="pt-5 text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('password');
                          registerForm.reset();
                        }}
                        className="font-semibold text-orange-600 hover:underline cursor-pointer"
                      >
                        Log In
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Terms */}
          <div className="pt-4 pb-2 text-center text-[11px] sm:text-xs text-gray-500 max-w-sm mx-auto">
            By continuing, you agree to our{" "}
            <Link to="/loginterms" className="text-orange-600 hover:underline font-medium">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-orange-600 hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </div>

        </div>

        {/* Hero / Banner Image Section (Right Column on Desktop) */}
        <div className="pointer-events-none relative hidden lg:block lg:w-1/2 select-none bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
          <img
            className="absolute top-0 left-0 h-full w-full object-cover opacity-80"
            loading="lazy"
            src="https://www.shutterstock.com/image-photo/university-graduation-ceremonies-on-commencement-600nw-298297430.jpg"
            alt="Students graduating"
          />
          <div className="absolute bottom-0 z-20 p-10 xl:p-14 text-white max-w-xl">
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
              Empowering Employers
            </div>
            <p className="text-2xl xl:text-3xl font-semibold leading-snug mb-4">
              "Find, hire, and manage top student talent and skilled freshers effortlessly."
            </p>
            <p className="text-xl font-bold text-white">Students Gigs for Employers</p>
            <p className="text-sm text-gray-300">Dr Vimal K R, Founder CEO</p>
            <p className="text-xs text-gray-400">Medresearch India Pvt Ltd</p>
          </div>
        </div>

      </div>

      {/* Email OTP Modal (for Register flow) */}
      <EmailOtp
        handleStatus={() => setAuthMode('password')}
        isOpen={otpModal}
        setIsOpen={setOtpModal}
        RegisterData={registerData}
        reset={registerForm.reset}
      />

      {/* Forgot Password Modal */}
      <ForgetPassword isOpen={forgotModal} setIsOpen={setForgotModal} />
    </main>
  );
}
