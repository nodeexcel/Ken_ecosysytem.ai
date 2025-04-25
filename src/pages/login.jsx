import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LuUserRound } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-3">
            <h1 className="text-[28px] font-semibold text-center mb-2 text-[#1E1E1E]">Ecosysteme.ai</h1>
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[500px]">
                <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
                <p className="text-center text-[16px] text-[#777F90] mt-2 mb-4">Please enter your details below.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[16px] font-medium text-[#292D32] mb-1">Email</label>
                        <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">

                            <LuUserRound  className="text-gray-400 mr-2 text-xl" />
                            <input
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[16px] font-medium text-[#292D32] mb-1">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                            <TbLockPassword className="text-gray-400 mr-2 text-lg"  />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="ml-2 focus:outline-none"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-gray-400 text-lg" />
                                ) : (
                                    <AiOutlineEye className="text-gray-400 text-lg" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-[#5A687C] text-[14px]">Remember me!</span>
                        </label>
                        <a href="#" className="text-[#335BFB] text-[14px] font-semibold hover:underline">
                            Forgot Password
                        </a>
                    </div>

                    <button className="w-full bg-[#335BFB] text-white py-[14px] rounded-[8px] font-semibold hover:bg-blue-700 transition">
                        Login
                    </button>

                    <div className="flex items-center justify-center text-sm text-gray-500 mt-4 mb-2">OR</div>

                    <button className="w-full flex items-center justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                        <FcGoogle className="mr-2 text-xl" /> Continue with Google
                    </button>
                </div>

            </div>
            <p className="text-center mt-6 text-[#5A687C] text-[14px]">
                Don’t have an account?{' '}
                <a href="#" className="hover:underline text-[#335BFB] text-[14px] font-semibold ">Sign Up</a>
            </p>
        </div>
    );
}
