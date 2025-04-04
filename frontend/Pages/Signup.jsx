import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signupImage from "../src/assets/signupImage.png";

export default function Signup() {
  const [step, setStep] = useState(1); // Step 1: Signup, Step 2: OTP Verification
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });
      setStep(2); // Move to OTP Verification step
      setSuccess("OTP sent to your email. Please verify.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const validatePasswordMatch = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-[#fce0d4]">
        <img src={signupImage} alt="Signup Illustration" className="max-w-[80%] max-h-[80%] object-contain" />
      </div>

      {/* Right Side - Signup/OTP Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8 shadow-xl">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {step === 1 ? "Create an Account" : "Verify Your Email"}
          </h2>

          {step === 1 ? (
            // Signup Form
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Username</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                  value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)} // Validate when user finishes typing
                  placeholder="Enter email"
                  required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input type="password" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validatePasswordMatch}
                  placeholder="Confirm password"
                  required
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                Sign Up
              </button>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Enter OTP</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                  value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                Verify OTP
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-gray-700 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
