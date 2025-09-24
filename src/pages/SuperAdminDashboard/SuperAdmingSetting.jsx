
import { useState } from "react"
import { Camera, SquarePen, Eye, EyeOff, Lock } from "lucide-react"

const SuperAdminSetting = () => {
  const [activeTab, setActiveTab] = useState("My Profile")
  const [formData, setFormData] = useState({
    firstName: "Robert",
    lastName: "Downey",
    email: "robertdowney45@gmail.com",
    phone: "+1 (252) 212 2125",
    company: "Ecosysteme",
    role: "Admin",
    city: "Springfield",
    country: "United States",
  })

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateProfile = () => {
    console.log("Updating profile:", formData)
    // Add update functionality here
  }

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleUpdatePassword = () => {
    console.log("Updating password:", passwords)
    // Add password update functionality here
  }

  return (
    <div className="">
      {/* Header */}
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 text-[#1E1E1E] text-[26px]">
          Settings
        </h1>
      </div>

      <div className="w-full p-4 flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-[#E1E4EA]">
          <button
            onClick={() => setActiveTab("My Profile")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "My Profile"
                ? "text-[#675FFF] border-b-2 border-[#675FFF]"
                : "text-[#5A687C] hover:text-[#1E1E1E]"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("Change Password")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "Change Password"
                ? "text-[#675FFF] border-b-2 border-[#675FFF]"
                : "text-[#5A687C] hover:text-[#1E1E1E]"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Profile Form */}
        {activeTab === "My Profile" && (
          <div className="w-[50%] border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-8">
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#335BFB1A] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white"></div>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#675FFF] rounded-full flex items-center justify-center text-white hover:bg-[#5A4FE6] transition-colors">
                <SquarePen className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                  disabled
                />
              </div>

              {/* Phone No */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Phone No</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                  disabled
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-8">
              <button
                onClick={handleUpdateProfile}
                className="px-6 py-3 bg-[#675FFF] text-white font-medium rounded-lg hover:bg-[#5A4FE6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:ring-offset-2"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "Change Password" && (
          <div className="w-[50%] border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-8">
            <div className="max-w-md">
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.currentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[#1E1E1E] text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:border-transparent text-[#1E1E1E] bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Update Password Button */}
                <button 
                  onClick={handleUpdatePassword}
                  className=" px-6 py-3 bg-[#675FFF] text-white font-medium rounded-lg hover:bg-[#5A4FE6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#675FFF] focus:ring-offset-2"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminSetting
