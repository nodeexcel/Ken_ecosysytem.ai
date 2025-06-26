import { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LuUserRound } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { forgotPassword, getEmailVerify, getOTPVerify, googleLogin, login } from "../api/auth";
import { subscriptionPayment } from "../api/payment";
import { loadStripe } from "@stripe/stripe-js";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { emailState, loginSuccess } from "../store/authSlice";
import { X } from "lucide-react";
import { PasswordLock } from "../icons/icons";
import header from '../assets/svg/ecosysteme.ai_logo.svg'
import logo from '../assets/svg/logo.svg'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false)
    const [resentLoading, setResentLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({})
    const token = localStorage.getItem("token")
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [activeTabModal, setActiveTabModal] = useState("forgot-password")

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const priceId = import.meta.env.VITE_REGISTER_PLAN_ID
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);


    useEffect(() => {
        setTimeout(() => {
            setSuccess({})
        }, 5000)
    }, [success])

    useEffect(() => {

        if (token && userDetails.loading) {
            navigate("/dashboard")
        }

    }, [token, userDetails.loading])

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!email) {
            setErrors({ email: "Email is required" });
            return;
        }
        if (!validateEmail(email)) {
            setErrors({ email: "Invalid email format" });
            return;
        }

        try {
            setLoading(true);
            const response = await getEmailVerify({ email });

            console.log(response)

            if (response?.data?.profilePresent) {
                dispatch(emailState({ email: email }))
                if (response?.data?.profileActivated) {
                    setStep("password");
                } else {
                    setStep("otp");
                }
            }
            else {
                setErrors({ email: response?.response?.data?.message })
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        setErrors({})
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').trim();
        if (!/^\d+$/.test(paste)) return; // Only allow numeric pastes

        const pasteArray = paste.slice(0, 4).split('');
        const newOtp = [...otp];
        pasteArray.forEach((char, idx) => {
            newOtp[idx] = char;
            if (otpRefs[idx]?.current) {
                otpRefs[idx].current.value = char;
            }
        });
        setOtp(newOtp);

        // Focus next empty input
        const firstEmpty = pasteArray.length < 4 ? pasteArray.length : 3;
        if (otpRefs[firstEmpty]?.current) {
            otpRefs[firstEmpty].current.focus();
        }
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!password) {
            setErrors({ password: "Password is required" });
            return;
        }

        try {
            setLoading(true)
            const payload = {
                email: email,
                password: password
            }

            const response = await login(payload)

            console.log(response)

            if (response?.status === 200) {
                dispatch(loginSuccess({ user: response?.data, token: response?.data?.accessToken }))
                localStorage.setItem("token", response?.data?.accessToken)
                localStorage.setItem("refreshToken", response?.data?.refreshToken)
                navigate("/dashboard")
            } else {
                setErrors({ password: response?.response?.data?.message })
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        console.log("Submit Password:", password);
        // handle login logic
    };

    const handleOtpSubmit = async (e, value) => {
        e.preventDefault();
        setErrors({});
        if (!value) {
            setErrors({ otp: "Otp is required" });
            return;
        }

        try {
            setLoading(true)
            const payload = {
                email: email,
                otp: value
            }

            const response = await getOTPVerify(payload)
            console.log(response)
            if (response?.status === 200) {
                navigate("/create-password")
            } else {
                setErrors({ otp: response?.response?.data?.message });
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }

        console.log("Submit Password:", value);
        // handle login logic
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!email) {
            setErrors({ email: "Email is required" });
            return;
        }
        if (!validateEmail(email)) {
            setErrors({ email: "Invalid email format" });
            return;
        }
        try {
            setForgotLoading(true)
            const payload = {
                email: email
            }
            const response = await forgotPassword(payload)
            if (response?.status === 200) {
                setActiveTabModal("verify-email")
                // setSuccess({ password: response?.data?.message })
            } else {
                setErrors({ email: response?.response?.data?.message })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setForgotLoading(false)
        }
    }

    const handleResendOtp = async (e) => {
        setResentLoading(true)
        await handleEmailSubmit(e)
        setSuccess({ otp: "Otp send successfully!" })
        setResentLoading(false)
    }

    const handleBackToSignIn = () => {
        setStep("email")
        setOpen(false)
        setErrors({})
    }

    const handleGoogleLogin = async (auth_data) => {
        console.log(auth_data, auth_data?.credential, "response")
        const token = auth_data?.access_token
        console.log(token, "jooo")
        try {
            const payload = {
                accessToken: token
            }
            const response = await googleLogin(payload)
            console.log(response)
            if (response?.status === 200) {
                if (response?.data?.profileActivated) {
                    dispatch(loginSuccess({ user: response?.data, token: response?.data?.accessToken }))
                    localStorage.setItem("token", response?.data?.accessToken)
                    localStorage.setItem("refreshToken", response?.data?.refreshToken)
                    navigate("/dashboard")
                } else {
                    console.log(response?.data?.email)
                    dispatch(emailState({ email: response?.data?.email }))
                    navigate("/create-password")
                }
            } else {
                setErrors({ google_auth: response?.response?.data?.message })
            }
        } catch (error) {
            toast.error(error.message)
            console.error("Error:", error)
        }
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleLogin,
    });

    const getSubscriptionPlan = async () => {
        try {
            const payload = {

                "priceId": priceId,
                "successUrl": "http://localhost:5173/success",
                "cancelUrl": "http://localhost:5173/cancel"
            }
            const response = await subscriptionPayment(payload);
            const stripe = await stripePromise;
            console.log(response)
            if (response.status === 200 && stripe) {
                await stripe.redirectToCheckout({ sessionId: response?.data?.sessionId });
            }
        } catch (error) {
            console.log("Stripe error:", error);
        }
    };

    const renderEmailStep = () => (
        <form onSubmit={handleEmailSubmit} className="space-y-2">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] mb-4">Please enter your details below.</p>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Email</label>
                <div className={`flex items-center focus-within:border-[#675FFF] border rounded-[8px] px-4 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                    <LuUserRound className="text-gray-400 mr-2 text-xl" />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setErrors({})
                        }}
                        className="w-full focus:outline-none"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white my-4 py-[14px] rounded-[8px] font-semibold  transition`}
            >
                {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Continue"}
            </button>
        </form>
    );

    const renderOtpStep = () => (
        <form onSubmit={(e) => handleOtpSubmit(e, otp.join(""))} className="space-y-3">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] my-2">
                Please enter your 4-digit code below.
            </p>
            <p className="text-center text-[16px] text-[#777F90]">
                We send code on: <span className="font-[400] text-[#675FFF]">{email}</span>
            </p>
            <p className="text-center my-4 font-[500] text-[16px] text-[#292D32]">
                Enter code
            </p>

            <div className="flex justify-center gap-4 my-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={otpRefs[index]}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => handleOtpPaste(e)}
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-[#675FFF] text-lg"
                    />
                ))}
            </div>
            {errors.otp && <p className="text-red-500 text-center text-sm mt-1">{errors.otp}</p>}
            {success.otp && <p className="text-green-500 text-center text-sm mt-1">{success.otp}</p>}

            <p className="text-center text-[16px] text-[#777F90] my-6">
                Didn't receive code? <span className="font-[400] text-[#675FFF] cursor-pointer" onClick={handleResendOtp}>{resentLoading ? <span className="loader" /> : "Send Again"}</span>
            </p>

            <button
                type="submit"
                disabled={loading && !resentLoading}
                className={`w-full ${(loading && !resentLoading) ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} my-4 text-white py-[14px] rounded-[8px] font-semibold transition`}
            >
                {(loading && !resentLoading) ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Login"}
            </button>
        </form>
    );

    const renderPasswordStep = () => (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] mb-4">Please enter your details below.</p>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Password</label>
                <div className={`flex items-center focus-within:border-[#675FFF] border rounded-[8px] px-4 py-3 ${errors.password ? "border-red-500" : "border-gray-300"}`}>
                    <div className="pr-2">
                        <PasswordLock />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setErrors({});
                        }}
                        className="w-full focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="ml-2 focus:outline-none"
                    >
                        {showPassword ? (
                            <AiOutlineEye className="text-gray-400 text-lg" />
                        ) : (
                            <AiOutlineEyeInvisible className="text-gray-400 text-lg" />
                        )}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {success.password && <p className="text-green-500 text-sm mt-1">{success.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-[#5A687C] text-[14px]">Remember me!</span>
                </label>
                <p onClick={() => setOpen(true)} className="text-[#675FFF] text-[14px] cursor-pointer font-semibold hover:underline">
                    Forgot Password
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white my-4 py-[14px] rounded-[8px] font-semibold transition`}
            >
                {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Login"}
            </button>
        </form>
    );

    if (userDetails?.loading && token) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


    return (
        <div className="flex flex-col overflow-auto items-center h-screen bg-[#F6F7F9] p-3">
            <div className="flex items-center gap-2 my-2">
                <div>
                    <img src={header} alt="logo" className="" />
                </div>
            </div>
            <div className="bg-white p-8 inter rounded-2xl border border-[#E1E4EA] mt-3 w-full max-w-[500px]">
                {step === "email" && renderEmailStep()}
                {step === "otp" && renderOtpStep()}
                {step === "password" && renderPasswordStep()}

                {step !== "otp" && (
                    <>
                        <div className="mt-2 mb-6 flex items-center gap-2">
                            <span><hr className="text-[#E1E4EA] min-w-[201px]" /></span>
                            <div className="text-sm text-gray-500">OR</div>
                            <hr className="text-[#E1E4EA] min-w-[201px]" />
                        </div>
                        {errors.google_auth && <p className="text-red-500 text-sm my-1 text-center">{errors.google_auth}</p>}
                        <button onClick={() => loginGoogle()} className="w-full flex cursor-pointer items-center font-[600] text-[#5A687C] text-[14px] justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                            <FcGoogle className="mr-2 text-xl" /> Continue with Google
                        </button>
                    </>
                )}
                {step !== "otp" && (
                    <p className="text-center mt-6 text-[#5A687C] text-[14px]">
                        Don’t have an account?{" "}
                        <span onClick={getSubscriptionPlan} className="hover:underline text-[#675FFF] text-[14px] font-semibold cursor-pointer">
                            Sign Up
                        </span>
                    </p>
                )}
            </div>

            <p className="text-center inter font-[400] my-6 text-[#5A687C] text-[12px]">
                By signing in you agree to our{" "}
                <span onClick={() => navigate("/terms-conditions")} className="underline text-[#675FFF] text-[12px] font-[600] cursor-pointer">
                    Terms and Conditions
                </span> & <span onClick={() => navigate("/privacy-policy")} className="underline text-[#675FFF] text-[12px] font-[600] cursor-pointer">
                    Privacy Policy
                </span>
            </p>

            {open && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                <div className="bg-white max-h-[600px] flex flex-col gap-4 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                    <button
                        onClick={() => {
                            setOpen(false)
                            setActiveTabModal("forgot-password")
                        }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {activeTabModal === "forgot-password" && <form onSubmit={handleForgot} className="space-y-4 mt-6">
                        <div className="flex justify-center">
                            <img src={logo} alt="logo" className="" />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-[700] text-center text-[#292D32]">Forgot Password</h2>
                            <p className="text-center text-[16px] text-[#5A687C] mb-4">Please enter your details below.</p>
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium text-[#292D32] mb-1">Email</label>
                            <div className={`flex items-center border focus-within:border-[#675FFF] rounded-[8px] px-4 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                                <LuUserRound className="text-gray-400 mr-2 text-xl" />
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors({})
                                    }}
                                    className="w-full focus:outline-none"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={forgotLoading}
                            className={`w-full ${forgotLoading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white my-4 py-[14px] rounded-[8px] font-semibold  transition`}
                        >
                            {forgotLoading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Continue"}
                        </button>
                        <p className="text-[#5A687C] text-center font-[400] text-[14px]">Back to <span className="text-[#675FFF] font-[600] cursor-pointer"
                            onClick={handleBackToSignIn}>Sign In</span></p>
                    </form>}
                    {activeTabModal === "verify-email" && <div div className="space-y-6 mt-6">
                        <div>
                            <div className="flex justify-center">
                                <img src={logo} alt="logo" className="" />
                            </div>
                            <h2 className="text-[28px] font-[700] text-center text-[#292D32]">Verify Email</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-[16px] font-[500] text-center text-[#292D32]">Please check your mail!</p>
                            <p className="text-[16px] text-center font-[400] text-[#5A687C]">We send Reset Password Link on: <br /><span className="text-[#675FFF]">{email}</span></p>
                            <p className="text-[#5A687C] text-center font-[400] text-[14px]">Didn't received link: <span disabled={forgotLoading} className="text-[#675FFF] cursor-pointer"
                                onClick={handleForgot}>{forgotLoading ? <span className="loader" /> : 'Send Again'}</span></p>
                        </div>
                    </div>}


                </div>
            </div>}
        </div >
    );
}
