import { Dialog, DialogContent } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { BadgeCheck, Loader, RefreshCw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from "libphonenumber-js";
import { useMobileOtp, useVerifyMobileOtp } from "@/Hooks/UserLogin";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";




// Props
interface MobileOtpProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}




// Step schema
const MobileSchema = z.object({
    phone: z
        .string()
        .refine((value) => isValidPhoneNumber(value), {
            message: "Enter a valid mobile number",
        }),
});




const OtpSchema = z.object({
    pin: z.string().min(6, "OTP must be 6 digits"),
});




export default function MobileOtpModal({ isOpen, setIsOpen }: MobileOtpProps) {


    const [step, setStep] = useState<"mobile" | "otp">("mobile");
    const [timeLeft, setTimeLeft] = useState(300);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [otpExpired, setOtpExpired] = useState(false);


    // Add a state to trigger timer reset
    const [timerKey, setTimerKey] = useState(0);


    // Mobile Number send otp
    const { mutate: MobileOtpSend, isPending } = useMobileOtp();



    // Mobile Number send otp
    const { mutate: MobileVerifyOtpSend, isPending: isVerifyPending } = useVerifyMobileOtp();



    // Login context
    const { login } = useAuth()



    // Navigate
    const Navigate = useNavigate()



    // Get the current path
    const location = useLocation();



    const queryclient = useQueryClient();



    // Timer
    useEffect(() => {

        if (step !== "otp" || !isOpen) return;

        setTimeLeft(600);
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

    }, [step, isOpen, timerKey]);



    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };



    // Forms
    const mobileForm = useForm<z.infer<typeof MobileSchema>>({
        resolver: zodResolver(MobileSchema),
        mode: "onChange",
        defaultValues: { phone: "" },
    });



    const otpForm = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        mode: "onChange",
        defaultValues: { pin: "" },
    });




    // Submit mobile
    const handleSendOtp = (data: z.infer<typeof MobileSchema>) => {

        const formdata = new FormData();

        formdata.append("mobile", data.phone);


        MobileOtpSend(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    toast.success("An Otp has been sent to your mobile number.", { duration: 4000 });
                    setStep("otp");

                } else {

                    toast.error(`${response?.response?.data?.non_field_errors[0] ? response.response.data.non_field_errors[0] : "Something went wrong. Please try again."}`);

                }
            }

        })

    };





    // Submit otp
    const handleVerifyOtp = (data: z.infer<typeof OtpSchema>) => {

        const formdata = new FormData();

        formdata.append("mobile", mobileForm.getValues().phone);
        formdata.append("otp", data.pin);


        MobileVerifyOtpSend(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    toast.success("Logged in successfully.", { duration: 4000 });
                    setIsOpen(false);
                    mobileForm.reset();
                    otpForm.reset();
                    setStep("mobile");

                    login(response.data.access)

                    const from = location.state?.from?.pathname || "/findtalent/";

                    queryclient.invalidateQueries({ queryKey: ["UserProfile"] });

                    Navigate(from, { replace: true })

                } else {

                    toast.error(`${response?.response?.data?.error ? response.response.data.error : "Something went wrong. Please try again."}`);

                }

            }

        })

    };




    // Resend otp
    const handleResendOtp = () => {

        const formdata = new FormData();

        formdata.append("mobile", mobileForm.getValues().phone);

        MobileOtpSend(formdata, {

            onSuccess: (response) => {

                if (response.status >= 200 && response.status <= 300) {

                    toast.success("An Otp has been resent to your mobile number.", { duration: 4000 });
                    setTimerKey(prev => prev + 1);
                    setIsResendDisabled(true);
                    setOtpExpired(false);

                } else {

                    toast.error(`${response?.response?.data?.non_field_errors[0] ? response.response.data.non_field_errors[0] : "Something went wrong. Please try again."}`);

                }
            }

        })

    };




    return (


        <Dialog open={isOpen} onOpenChange={setIsOpen}>


            <DialogContent className="p-0 max-w-md overflow-hidden rounded-3xl bg-slate-50 border-0 shadow-xl">


                <div className="p-10">


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-6"
                    >
                        <h2 className="text-2xl font-bold flex items-center justify-center">
                            {step === "mobile" ? "Enter Your Mobile Number" : "OTP Verification"}{" "}
                            <ShieldCheck size={26} />
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {step === "mobile"
                                ? "We’ll send a OTP to your Mobile Number"
                                : "Enter the code sent to your Mobile Number"}
                        </p>
                    </motion.div>



                    {step === "mobile" ? (


                        <Form {...mobileForm} key="mobile-form">


                            <form
                                onSubmit={mobileForm.handleSubmit(handleSendOtp)}
                                className="space-y-6"
                            >

                                <FormField
                                    control={mobileForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <PhoneInput
                                                    international
                                                    defaultCountry="IN"
                                                    placeholder="Enter mobile number"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full rounded-xl py-4 px-4 border border-gray-300 "
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full py-6 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center ${isPending ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    Send OTP {isPending ? (<Loader className="animate-spin" />) : (<BadgeCheck />)}
                                </Button>

                            </form>

                        </Form>


                    ) : (

                        <Form {...otpForm} key="otp-form">
                            <form
                                onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                                className="space-y-6"
                            >
                                {/* OTP Input */}
                                <FormField
                                    control={otpForm.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormControl>
                                                <div className="flex justify-center">
                                                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                                        <InputOTPGroup>
                                                            {Array.from({ length: 6 }).map((_, index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={index}
                                                                    className="w-12 h-14 text-lg rounded-md border border-gray-400 shadow-sm focus:border-black focus:ring-2 focus:ring-black transition ml-2"
                                                                />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-center" />
                                        </FormItem>
                                    )}
                                />

                                {/* Countdown */}
                                <p className="text-center text-gray-500">
                                    {otpExpired ? (
                                        <span className="text-red-500">
                                            OTP Expired! Please request a new one.
                                        </span>
                                    ) : (
                                        <span className="text-black font-semibold">
                                            OTP Expires In{" "}
                                            <span className="text-red-500">{formatTime(timeLeft)}</span>
                                        </span>
                                    )}
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-col space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={otpExpired || isVerifyPending}
                                        className={`py-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${otpExpired || isVerifyPending
                                            ? "bg-gray-400 hover:cursor-not-allowed"
                                            : "bg-black text-white"
                                            }`}
                                    >
                                        {isVerifyPending ? (
                                            <>
                                                Verifying <Loader className="animate-spin ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Verify <BadgeCheck className="ml-2" size={18} />
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isResendDisabled}
                                        className={`text-white bg-black font-semibold py-6 rounded-xl shadow-md hover:shadow-lg ${isResendDisabled ? "bg-gray-400 hover:cursor-not-allowed" : "hover:cursor-pointer"}`}
                                    >
                                        Resend OTP <RefreshCw className="ml-2" />
                                    </Button>
                                </div>
                            </form>
                        </Form>


                    )}

                </div>


            </DialogContent>


        </Dialog>

    );

}
