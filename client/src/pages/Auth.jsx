import React, { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
      const payload = isLoginMode ? { email, password } : { name, email, password };

      const result = await axios.post(ServerUrl + endpoint, payload, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (authError) {
      setLoading(false);
      setError(authError?.response?.data?.message || "Authentication failed");
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`
      w-full
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`
        w-full
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          {isLoginMode ? "Login to" : "Create account for"}
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2 ml-2">
            <IoSparkles size={16} />
            AI Smart Interview
          </span>
        </h1>

        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          {isLoginMode
            ? "Login and continue your interview journey."
            : "Create your account to start AI-powered mock interviews."}
        </p>

        <form onSubmit={submitAuth} className="space-y-4">
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
            minLength={6}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.98 }}
            className="w-full py-3 bg-black text-white rounded-full shadow-md disabled:opacity-70"
          >
            {loading ? "Please wait..." : isLoginMode ? "Login" : "Create Account"}
          </motion.button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError("");
          }}
          className="w-full mt-4 text-sm text-green-700 hover:underline"
        >
          {isLoginMode ? "New user? Create account" : "Already have an account? Login"}
        </button>
      </motion.div>
    </div>
  );
}

export default Auth;
