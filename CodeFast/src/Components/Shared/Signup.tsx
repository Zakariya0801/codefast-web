"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom" // Import useNavigate
import { Eye, EyeOff, UserPlus } from "react-feather"
import axiosInstance from "../../Utils/axiosInstance"
import { uploadImage } from "../../Utils/Cloudinary"

interface FormData{
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  dob: string,
  profilePicture: string,
  degree: string,
  cgpa: string,
  university: string,
  agreeTerms: boolean
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    profilePicture: "", // Changed from permanentAddress
    degree: "",
    cgpa: "",
    university: "",
    agreeTerms: false,
  })
  const [universities, setUniversities] = useState<any[]>([])
  const [_,setselectedUniversity] = useState<any>(null);
  const getUniversties = async () => {
    const response = await axiosInstance.get("/university")
    setUniversities(response.data)
  }

  useEffect(() =>{
    getUniversties()
  }, [])
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    profilePicture: "", // Changed from permanentAddress
    degree: "",
    cgpa: "",
    university: "",
    agreeTerms: "",
  }) // To store validation errors
  const navigate = useNavigate() // Hook for navigation
  const [profilePreview, setProfilePreview] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      profilePicture: "", // Changed from permanentAddress
      degree: "",
      cgpa: "",
      university: "",
      agreeTerms: "",
    }

    // Check if all fields are filled
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Confirm Password is required"
    if (!formData.dob.trim()) newErrors.dob = "Date of Birth is required"
    if (!formData.profilePicture.trim()) newErrors.profilePicture = "Profile Picture is required" // Changed from permanentAddress
    if (!formData.degree.trim()) newErrors.degree = "Degree is required"
    if (!formData.cgpa.trim()) newErrors.cgpa = "CGPA is required"
    if (!formData.university.trim()) newErrors.university = "University is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "") // Return true if no errors
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Validate the form
    if (!validateForm()) {
      return // Stop submission if validation fails
    }

    const data = {
      name: formData.fullName,
      email: formData.email,
      dob: formData.dob,
      university: formData.university,
      password: formData.password,
      cgpa: formData.cgpa,
      degree: formData.degree,
      profile_photo: formData.profilePicture,
    }

    const response = await axiosInstance.post("/auth/register", data);

    console.log("Student registered:", response.data);

    // Handle signup logic here (e.g., API call)
    console.log("Signup submitted:", formData)

    // Redirect to the Login Page after successful submission
    navigate("/login")
  }
  const [selectedValue, setSelectedValue] = useState("")
  const inputref = useRef<HTMLSelectElement>(null)
  const handleChangeinDrop = (id:string) => {
    console.log("calllled")
    console.log(universities.find((uni) => uni._id === id))
    setselectedUniversity(universities.find((uni) => uni._id === id))
    setSelectedValue(universities.find((uni) => uni._id === id).name)
    setFormData({ ...formData, university: id }) // Update formData with selected university
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file name or path in formData
      uploadImage(file).then((url:string) => {

        setFormData({
          ...formData,
          profilePicture: url,
        })

        // Create a preview URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Clear any errors
        setErrors((prevErrors) => ({ ...prevErrors, profilePicture: "" }))
    }).catch((error) => {
      console.log("Error uploading image:", error.message)
      setErrors((prevErrors) => ({ ...prevErrors, profilePicture: error.message }))
    })
    }
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Signup Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
              <p className="text-gray-600 mt-2">Join CodeFast to start learning</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit} method="POST">
                {/* Full Name */}
                <div className="mb-5">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Date of Birth */}
                <div className="mb-5">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                </div>

                {/* Profile Picture */}
                <div className="mb-5">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {profilePreview && (
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-300">
                        <img
                          src={profilePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {errors.profilePicture && <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>}
                </div>

                {/* Degree */}
                <div className="mb-5">
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                  {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                </div>

                {/* CGPA */}
                <div className="mb-5">
                  <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
                    CGPA
                  </label>
                  <input
                    type="number"
                    id="cgpa"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3.5"
                    step="0.1"
                    min="0"
                    max="4"
                    required
                  />
                  {errors.cgpa && <p className="text-red-500 text-sm mt-1">{errors.cgpa}</p>}
                </div>

                {/* University */}
                <div className="mb-5">
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <select
                    value={selectedValue}
                    ref={inputref}
                    aria-placeholder="Select University"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selectedUni = universities.find((uni) => uni.name === e.target.value);
                      if (selectedUni) {
                        handleChangeinDrop(selectedUni._id);
                      }
                    }}
                  >
                    <option value="">Select University</option>
                    {universities.map((uni) => (
                      <option key={uni._id} value={uni.name}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                  {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
                </div>

                {/* Password */}
                <div className="mb-5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Agree to Terms */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <UserPlus size={18} />
                  Create Account
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup