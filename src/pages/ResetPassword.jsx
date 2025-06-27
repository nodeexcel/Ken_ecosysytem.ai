import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { resetPassword } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordLock } from '../icons/icons';
import header from '../assets/svg/ecosysteme.ai_logo.svg'

export default function ResetPassword() {
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const query = new URLSearchParams(location.search);
    const query_token = query.get('token');
    console.log(query_token)

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
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
    };

    const validate = () => {
        const errors = {};

        if (!formData.password) {
            errors.password = 'New Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'New Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'New Passwords do not match';
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
                    newPassword: formData?.password,
                    token: query_token
                }
                const response = await resetPassword(payload)
                console.log(response)
                if (response?.status === 200) {
                    navigate("/")
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
            <div className="flex items-center gap-2 py-[30px]">
                <div>
                    <img src={header} alt="logo" className="" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white inter p-8 rounded-2xl border border-[#E1E4EA] mt-3 w-full max-w-[500px]">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-[28px] font-[700] text-center text-[#292D32]">Set New Password</h2>
                        <p className="text-center text-[16px] text-[#777F90] mt-2">Please enter your new password below.</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* New Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-medium text-black text-sm leading-5">New Password</label>
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
                                        } `}
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
                                        } `}
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
                        </div>
                    </div>

                    {formErrors.error && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.error}</p>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white py-[14px] rounded-[8px]`}
                        >
                            {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Update Password"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
