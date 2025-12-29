import { useState } from 'react';
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import { setUserPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { PasswordLock } from '../icons/icons';
import header from '../assets/images/ecosysteme.ai_logo.png'
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../store/authSlice";

export default function SetPassword() {
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        requirements: {
            uppercase: false,
            number: false,
            length: false,
        },
    })

    const navigate = useNavigate()

    const storedEmail = useSelector((state) => state.auth.email)

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const evaluatePasswordStrength = (password) => {
        const requirements = {
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            length: password.length >= 8,
        };
        const score = Object.values(requirements).filter(Boolean).length;
        return { score, requirements };
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormErrors((prev) => ({
            ...prev,
            error: '',
            [name]: '', // clear error on input change
        }));
        
        // Update password strength when password field changes
        if (name === 'password') {
            setPasswordStrength(evaluatePasswordStrength(value));
        }
    };

    const validate = () => {
        const errors = {};

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length === 0) {
            console.log("Password set successfully!", formData);
            try {
                setLoading(true)
                const payload = {
                    email: storedEmail,
                    newPassword: formData?.password
                }

                const response = await setUserPassword(payload)

                console.log(response)
                if (response?.status === 200) {
                    dispatch(loginSuccess({ user: response?.data, token: response?.data?.accessToken }))
                    localStorage.setItem("token", response?.data?.accessToken)
                    localStorage.setItem("refreshToken", response?.data?.refreshToken)
                    navigate("/dashboard")
                } else {
                    setFormErrors((prev) => ({
                        ...prev,
                        error: response?.response?.data?.message, // clear error on input change
                    }));
                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
            // handle successful submission logic
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <div className="flex flex-col items-center overflow-auto h-screen bg-gray-50 p-3">
            
            <form onSubmit={handleSubmit} className="bg-white inter p-8 mt-3 rounded-2xl border border-[#E1E4EA] w-full max-w-[500px]">
                <div className="space-y-3">
                <div className="flex items-center gap-2">
                <div>
                    <img src={header} alt="logo" className="h-9 w-auto sm:h-18 sm:w-auto md:h-26 md:w-auto" />
                </div>
            </div>
                    <h2 className="text-[28px] font-bold text-center text-[#292D32]">Password Setup</h2>
                    <p className="text-center text-[16px] text-[#777F90]">Let's set up secure password to protect your account.</p>

                    <div className="flex flex-col gap-5 w-full">
                        {/* New Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-medium text-black text-sm leading-5">Create a Password</label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <PasswordLock />
                                </div>
                                <input
                                    type={showPasswords.password ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    className={`w-full pl-10 pr-10 py-2.5 focus:border-[#675FFF] focus:outline-none bg-white rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-[#e1e4ea]'
                                        }`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPasswords.password ? (
                                        <EyeIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-medium text-black text-sm leading-5">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <PasswordLock />
                                </div>
                                <input
                                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full pl-10 pr-10 py-2.5 focus:border-[#675FFF] focus:outline-none bg-white rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-[#e1e4ea]'
                                        }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPasswords.confirmPassword ? (
                                        <EyeIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                            )}

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[0, 1, 2].map((index) => (
                                            <span
                                                key={index}
                                                className={`h-1 flex-1 rounded-full ${passwordStrength.score > index ? "bg-[#675FFF]" : "bg-[#E1E4EA]"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#5A687C] mb-2">
                                        {passwordStrength.score === 0 ? "Weak password." : passwordStrength.score === 1 ? "Weak password." : passwordStrength.score === 2 ? "Moderate password." : "Strong password."} Must contain at least:
                                    </p>
                                    <div className="flex flex-col gap-1 text-sm">
                                        {[
                                            { key: "uppercase", label: "At least 1 uppercase" },
                                            { key: "number", label: "At least 1 number" },
                                            { key: "length", label: "At least 8 characters" },
                                        ].map((item) => (
                                            <span key={item.key} className="flex items-center gap-2">
                                                {passwordStrength.requirements[item.key] ? (
                                                    <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-[#C5CAD4]" />
                                                )}
                                                <span className={passwordStrength.requirements[item.key] ? "text-[#1E1E1E]" : "text-[#5A687C]"}>
                                                    {item.label}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {formErrors.error && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.error}</p>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white py-[14px] rounded-[8px] font-semibold`}
                        >
                            {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Update Password"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
