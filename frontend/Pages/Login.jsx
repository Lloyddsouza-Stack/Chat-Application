import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../src/assets/loginImage.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return; // Prevent submission if email is invalid
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("Login success:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailPattern.test(value) ? "" : "Invalid email format");
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-[#c8e1fd]">
        <img src={loginImage} alt="Login Illustration" className="max-w-[80%] max-h-[80%] object-contain" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8 shadow-xl">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={`w-full border rounded-lg p-3 focus:ring-2 ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email)} // ✅ Validate when user leaves input
                placeholder="Enter email"
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              disabled={emailError} // ✅ Disable button if email is invalid
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-700 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
