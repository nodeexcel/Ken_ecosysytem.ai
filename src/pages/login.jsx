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
import { ChevronDown, Globe, X } from "lucide-react";
import { PasswordLock } from "../icons/icons";
import logo from '../assets/images/dashboard_logo.png'
import Ecosystem from '../assets/images/ecosysteme.ai_logo.png'

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
    const [selectedLanguage, setSelectedLanguage] = useState("ENG");
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const priceId = import.meta.env.VITE_REGISTER_PLAN_ID
    const navigate = useNavigate();
    const languageMenuRef = useRef(null);
    const languages = ["ENG", "FRA"];

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
                setLanguageMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderPath = (path) => {
        if (path === "terms") {
            window.open("https://www.ecosysteme.ai/terms", "_blank");
        } else {
            window.open("https://www.ecosysteme.ai/privacy", "_blank");
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!email) {
            validationErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            validationErrors.email = "Invalid email format";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        try {
            setErrors({});
            setLoading(true);
            const emailResponse = await getEmailVerify({ email });

            if (emailResponse?.data?.profilePresent) {
                dispatch(emailState({ email }));

                if (emailResponse?.data?.profileActivated) {
                    const loginResponse = await login({ email, password });
                    if (loginResponse?.status === 200) {
                        dispatch(loginSuccess({ user: loginResponse?.data, token: loginResponse?.data?.accessToken }));
                        localStorage.setItem("token", loginResponse?.data?.accessToken);
                        localStorage.setItem("refreshToken", loginResponse?.data?.refreshToken);
                        navigate("/dashboard");
                    } else {
                        setErrors({ password: loginResponse?.response?.data?.message || "Invalid credentials" });
                    }
                } else {
                    setStep("otp");
                }
            } else {
                setErrors({ email: emailResponse?.response?.data?.message || "Unable to find account" });
            }
        } catch (error) {
            console.log(error);
            setErrors({ email: "Something went wrong. Please try again." });
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
        e.preventDefault();
        if (!email) return;
        setResentLoading(true);
        try {
            await getEmailVerify({ email });
            setSuccess({ otp: "Otp sent successfully!" });
        } catch (error) {
            console.log(error);
        } finally {
            setResentLoading(false);
        }
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

    const handleSignup = () => {
        window.open("http://ecosysteme.ai/pricing", "_blank");
    }

    const getSubscriptionPlan = async () => {
        try {
            const payload = {

                "priceId": priceId,
                "successUrl": "http://localhost:5173/success",
                "cancelUrl": "http://localhost:5173/cancel"
            }
            const response = await subscriptionPayment(payload);
            const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
            const stripe = await stripePromise;
            console.log(response)
            if (response.status === 200 && stripe) {
                await stripe.redirectToCheckout({ sessionId: response?.data?.sessionId });
            }
        } catch (error) {
            console.log("Stripe error:", error);
        }
    };

    const renderLoginStep = () => (
        <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-4 md:space-y-3 lg:space-y-4">
            <div className="space-y-1 sm:space-y-1.5 md:space-y-1.5 lg:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-[#5A687C] ">Email Address</label>
                <div className={`flex items-center bg-white border border-[#D6D6D6] rounded-md sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-1.5 md:py-2 shadow-sm ${errors.email ? "border-red-400" : "border-transparent"}`}>
                    <LuUserRound className="text-[#9AA2B1] text-base sm:text-lg mr-1.5 sm:mr-2 flex-shrink-0" />
                    <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        className="w-full text-sm sm:text-base text-[#1E1E1E] placeholder:text-[#B0B7C3] focus:outline-none"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1 sm:space-y-1.5 md:space-y-1.5 lg:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-[#5A687C]">Password</label>
                <div className={`flex items-center bg-white border rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-1.5 md:py-2 shadow-sm ${errors.password ? "border-red-400" : "border-transparent"}`}>
                    <PasswordLock className="text-[#9AA2B1] mr-1.5 sm:mr-2 flex-shrink-0" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        className="w-full text-sm sm:text-base text-[#1E1E1E] placeholder:text-[#B0B7C3] focus:outline-none"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="ml-1.5 sm:ml-2 text-[#9AA2B1] flex-shrink-0">
                        {showPassword ? <AiOutlineEye className="text-base sm:text-lg" /> : <AiOutlineEyeInvisible className="text-base sm:text-lg" />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <label className="flex items-center gap-1.5 sm:gap-2 text-[#5A687C]">
                    <input type="checkbox" className="rounded cursor-pointer border-[#C5CAD4] w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Remember me
                </label>
                <button type="button" onClick={() => setOpen(true)} className="text-[#675FFF] font-semibold cursor-pointer text-xs sm:text-sm">
                    Forgot Password
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-[#675FFF] hover:bg-[#5A52F0] disabled:bg-[#675fff7d] text-white py-2 sm:py-2 md:py-2 lg:py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg transition"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2 ">
                        <p>Processing...</p>
                        <span className="loader" />
                    </div>
                ) : (
                    "Continue"
                )}
            </button>
        </form>
    );

    const renderOtpStep = () => (
        <form onSubmit={(e) => handleOtpSubmit(e, otp.join(""))} className="space-y-3 sm:space-y-4 md:space-y-3 lg:space-y-6">
            <div className="text-center space-y-1 sm:space-y-1.5 md:space-y-1.5 lg:space-y-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E]">Enter verification code</h2>
                <p className="text-[#7A849C] text-xs sm:text-sm">
                    We sent a 4-digit code to <span className="text-[#675FFF] font-medium">{email}</span>
                </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={otpRefs[index]}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => handleOtpPaste(e)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-base sm:text-lg font-semibold border border-[#E1E4EA] rounded-lg sm:rounded-xl focus:outline-none focus:border-[#675FFF]"
                    />
                ))}
            </div>
            {errors.otp && <p className="text-red-500 text-center text-xs sm:text-sm">{errors.otp}</p>}
            {success.otp && <p className="text-green-500 text-center text-xs sm:text-sm">{success.otp}</p>}

            <p className="text-center text-xs sm:text-sm text-[#7A849C]">
                Didn't receive the code?{" "}
                <span className="text-[#675FFF] font-semibold cursor-pointer" onClick={handleResendOtp}>
                    {resentLoading ? <span className="loader inline-block" /> : "Send again"}
                </span>
            </p>

            <button
                type="submit"
                disabled={loading && !resentLoading}
                className="w-full bg-[#675FFF] hover:bg-[#5A52F0] disabled:bg-[#675fff7d] text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg transition"
            >
                {(loading && !resentLoading) ? (
                    <div className="flex items-center justify-center gap-2">
                        <p>Processing...</p>
                        <span className="loader" />
                    </div>
                ) : (
                    "Continue"
                )}
            </button>
        </form>
    );

    if (userDetails?.loading && token) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


    return (
        <div className="min-h-screen w-full flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 md:py-2 lg:py-4 gap-2 sm:gap-3 md:gap-2 lg:gap-4 overflow-y-auto">
            <div className="w-full flex items-center justify-between">
                <img src={Ecosystem} alt="logo" className="h-10 sm:h-11 md:h-12 lg:h-14 w-auto" />
                <div className="relative" ref={languageMenuRef}>
                    <button
                        type="button"
                        onClick={() => setLanguageMenuOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-transparent hover:border-[#D6DAE3] text-[#5A687C] text-xs sm:text-sm font-semibold"
                    >
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{selectedLanguage}</span>
                        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${languageMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {languageMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-[#E1E4EA] rounded-lg sm:rounded-xl shadow-lg z-10">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => {
                                        setSelectedLanguage(lang);
                                        setLanguageMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs sm:text-sm cursor-pointer hover:text-black ${lang === selectedLanguage ? "text-[#675FFF] font-semibold" : "text-[#5A687C]"
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/**OTP */}
            <div className="bg-white/90 w-full max-w-[440px] max-h-[90vh] rounded-lg sm:rounded-xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-6 border border-white/60 relative overflow-hidden flex flex-col">
                
                <div className="relative space-y-3 sm:space-y-4 md:space-y-3 lg:space-y-6 overflow-y-auto flex-1">
                    <div className="text-center space-y-1.5 sm:space-y-2 md:space-y-2 lg:space-y-3">
                        <div className="mx-auto h-9 w-8 sm:h-10 sm:w-9 md:h-11 md:w-10 flex items-center justify-center">
                            <img src={logo} alt="logo" className="h-9 w-8 sm:h-10 sm:w-9 md:h-11 md:w-10" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E]">Login to your account</h1>
                            <p className="text-xs sm:text-sm text-[#7A849C]">Enter your email to login</p>
                        </div>
                    </div>

                    {step === "otp" ? renderOtpStep() : renderLoginStep()}

                    {step !== "otp" && (
                        <>
                            <div className="flex items-center">
                                <hr className="flex-1 border-t border-[#E4E6EF]" />
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#B0B7C3]">OR</span>
                                <hr className="flex-1 border-t border-[#E4E6EF]" />
                            </div>
                            {errors.google_auth && <p className="text-red-500 text-xs sm:text-sm text-center">{errors.google_auth}</p>}
                            <button
                                onClick={() => loginGoogle()}
                                className="w-full flex items-center justify-center gap-2 sm:gap-3 cursor-pointer border border-[#E1E4EA] rounded-lg sm:rounded-xl py-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] hover:bg-[#F8F8FB] transition"
                            >
                                <FcGoogle className="text-lg sm:text-xl" /> Continue with Google
                            </button>
                        </>
                    )}

                    {step !== "otp" && (
                        <p className="text-center text-xs sm:text-sm text-[#5A687C]">
                            Don't have an account?{" "}
                            <span onClick={handleSignup} className="text-[#675FFF] font-semibold cursor-pointer hover:underline">
                                Sign up
                            </span>
                        </p>
                    )}
                </div>
            </div>



            {open && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50 p-4">
                <div className="bg-white max-h-[90vh] w-[408px] overflow-y-auto flex flex-col gap-3 sm:gap-4 max-w-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 relative">
                    <button
                        onClick={() => {
                            setOpen(false)
                            setActiveTabModal("forgot-password")
                        }}
                        className="absolute cursor-pointer top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800"
                    >
                        {/* <X className="w-4 h-4 sm:w-5 sm:h-5" /> */}
                    </button>

                    {activeTabModal === "forgot-password" && <form onSubmit={handleForgot} className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                        <div className="flex justify-center">
                            <img src={logo} alt="logo" className="h-9 w-8 sm:h-11 sm:w-10" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-[28px] font-[700] text-center text-[#292D32]">Forgot Password</h2>
                            <p className="text-center text-sm sm:text-base text-[#5A687C] mb-3 sm:mb-4">Please enter your details below.</p>
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-medium text-[#292D32] mb-1">Email</label>
                            <div className={`flex items-center border focus-within:border-[#675FFF] rounded-lg sm:rounded-[8px] px-3 sm:px-4 py-2 sm:py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                                <LuUserRound className="text-gray-400 mr-1.5 sm:mr-2 text-lg sm:text-xl flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors({})
                                    }}
                                    className="w-full text-sm sm:text-base focus:outline-none"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={forgotLoading}
                            className={`w-full ${forgotLoading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white my-3 sm:my-4 py-2.5 sm:py-[14px] rounded-lg sm:rounded-[8px] font-semibold text-sm sm:text-base transition`}
                        >
                            {forgotLoading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Continue"}
                        </button>
                        <p className="text-[#5A687C] text-center font-[400] text-xs sm:text-sm">Back to <span className="text-[#675FFF] font-[600] cursor-pointer"
                            onClick={handleBackToSignIn}>Sign In</span></p>
                    </form>}
                    {activeTabModal === "verify-email" && (
                        <div className="relative ">
                            <div className="absolute -top-10 inset-x-0 h-24  bg-gradient-to-br from-indigo-300 via-purple-200 to-white  blur-[30px] rounded-t-2xl z-0" />
                            <div className="relative z-10 space-y-4 sm:space-y-6 mt-1 sm:mt-6 pt-4 sm:pt-2">
                                <div className="flex justify-center">
                                    <img src={logo} alt="logo" className="h-9 w-9 sm:h-12 sm:w-11" />
                                </div>

                                <h2 className="text-xl sm:text-2xl md:text-[28px] font-inter font-semibold text-center text-[#292D32]">
                                    Verify Your Email
                                </h2>

                                <div className="flex flex-col px-8">
                                    <p className="text-sm sm:text-base text-center font-[400] text-[#292D32]">
                                        A confirmation link has been sent to
                                        <span className="font-bold"> {email}. </span>
                                        Click the link to complete verification.
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = `mailto:${email}`;
                                    }}
                                    className="w-full bg-[#675FFF] hover:bg-[#5A52F0] text-white py-2.5 sm:py-[14px]  rounded-lg sm:rounded-[8px] font-semibold text-sm sm:text-base transition cursor-pointer" >
                                    Open Email App
                                </button>

                                <p className="text-[#5A687C] text-center font-[400] text-xs sm:text-sm">
                                    Didn't get the email?{" "}
                                    <span
                                        onClick={handleForgot}
                                        disabled={forgotLoading}
                                        className={`text-[#675FFF] cursor-pointer font-[600] ${forgotLoading ? 'opacity-50' : ''}`}
                                    >
                                        {forgotLoading ? <span className="loader" /> : 'Resend Link'}
                                    </span>
                                </p>

                            </div>
                        </div>

                    )}


                </div>
            </div>}

            <div className="w-full px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between mt-auto pt-2 pb-4 gap-2 sm:gap-0 text-xs sm:text-sm text-[#5A687C]">
                <span>© {new Date().getFullYear()} Ecosysteme.ai</span>
                <p className="text-center inter font-[400] text-[#5A687C]">
                    <span onClick={() => renderPath("terms")} className="underline text-[#675FFF] font-[600] cursor-pointer">
                        Terms and Conditions
                    </span>{" "}
                    &{" "}
                    <span onClick={() => renderPath("privacy")} className="underline text-[#675FFF] font-[600] cursor-pointer">
                        Privacy Policy
                    </span>
                </p>
            </div>
        </div >
    );
}
