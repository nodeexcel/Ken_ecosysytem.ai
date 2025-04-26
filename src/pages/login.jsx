import { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LuUserRound } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { subscriptionPayment } from "../api/payment";
import { loadStripe } from "@stripe/stripe-js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const priceId = import.meta.env.VITE_REGISTER_PLAN_ID
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleEmailSubmit = async () => {
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
            const response = await login({ email });

            if (response.firstTime) {
                setStep("otp");
            } else {
                setStep("password");
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


    const handlePasswordSubmit = () => {
        setErrors({});
        if (!password) {
            setErrors({ password: "Password is required" });
            return;
        }

        console.log("Submit Password:", password);
        // handle login logic
    };

    const handleOtpSubmit = (value) => {
        setErrors({});
        if (!value) {
            setErrors({ otp: "Otp is required" });
            return;
        }

        console.log("Submit Password:", value);
        // handle login logic
    };

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
        <div className="space-y-2">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] mb-4">Please enter your details below.</p>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Email</label>
                <div className={`flex items-center border rounded-[8px] px-4 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
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
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full bg-[#675FFF] text-white my-4 py-[14px] rounded-[8px] font-semibold  transition"
            >
                {loading ? <span className="loader" /> : "Continue"}
            </button>
        </div>
    );

    const renderOtpStep = () => (
        <div className="space-y-3">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] my-2">
                Please enter your 4-digit code below.
            </p>
            <p className="text-center text-[16px] text-[#777F90]">
                We send code on: <span className="font-bold">{email}</span>
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
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none text-lg"
                    />
                ))}
            </div>
            {errors.otp && <p className="text-red-500 text-center text-sm mt-1">{errors.otp}</p>}

            <p className="text-center text-[16px] text-[#777F90] my-6">
                Didn't receive code? <span className="font-semibold text-[#675FFF] cursor-pointer">Send Again</span>
            </p>

            <button
                type="submit"
                disabled={loading}
                onClick={() => handleOtpSubmit(otp.join(""))}
                className="w-full bg-[#675FFF] my-4 text-white py-[14px] rounded-[8px] font-semibold transition"
            >
                {loading ? <span className="loader" /> : "Login"}
            </button>
        </div>
    );

    const renderPasswordStep = () => (
        <div className="space-y-4">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] mb-4">Please enter your details below.</p>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Password</label>
                <div className={`flex items-center border rounded-[8px] px-4 py-3 ${errors.password ? "border-red-500" : "border-gray-300"}`}>
                    <TbLockPassword className="text-gray-400 mr-2 text-lg" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
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
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-[#5A687C] text-[14px]">Remember me!</span>
                </label>
                <a href="#" className="text-[#675FFF] text-[14px] font-semibold hover:underline">
                    Forgot Password
                </a>
            </div>

            <button
                type="submit"
                disabled={loading}
                onClick={handlePasswordSubmit}
                className="w-full bg-[#675FFF] text-white my-4 py-[14px] rounded-[8px] font-semibold transition"
            >
                {loading ? <span className="loader" /> : "Login"}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F7F9] p-3">
            <h1 className="text-[28px] font-semibold text-center mb-4 text-[#1E1E1E]">Ecosysteme.ai</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-[500px]">
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
                        <button className="w-full flex items-center justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                            <FcGoogle className="mr-2 text-xl" /> Continue with Google
                        </button>
                    </>
                )}
            </div>

            {step !== "otp" && (
                <p className="text-center mt-6 text-[#5A687C] text-[14px]">
                    Don’t have an account?{" "}
                    <span onClick={getSubscriptionPlan} className="hover:underline text-[#675FFF] text-[14px] font-semibold cursor-pointer">
                        Sign Up
                    </span>
                </p>
            )}
        </div>
    );
}
