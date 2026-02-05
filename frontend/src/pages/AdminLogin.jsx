import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";   // ✅ CHANGED
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();   // ✅ ADDED

  const handleLogin = async (e) => {
    e.preventDefault();

    toast.loading("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    toast.dismiss();

    if (error) {
      toast.error(error.message);
      return;
    }

    const userId = data.user.id;

    // ✅ Fetch admin profile
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {     // ✅ ADDED SAFETY
      toast.error("Profile not found ❌");
      return;
    }

    toast.success("Login Successful ✅");

    // ✅ Redirect based on role (Correct Paths)
    if (profile.role === "Dean") {
      navigate("/dean");                 // ✅ CHANGED
    }

    if (profile.role === "HOD") {
      navigate("/hod");                  // ✅ CHANGED
    }

    if (profile.role === "Technician") {
      navigate("/tech");                 // ✅ CHANGED
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold">College Complaint System</h1>
        <p className="mt-4 text-lg text-center max-w-sm">
          AI Powered Smart Complaint Auto-Routing Platform for Dean, HOD &
          Technicians
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-6">
        <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">

            {/* ✅ REMOVED Role + Department Dropdowns */}

            {/* Email */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@college.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>

            <Link
              to="/signup"
              className="block text-center mt-4 text-blue-600 font-semibold hover:underline"
            >
              New Admin? Sign Up Here
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
