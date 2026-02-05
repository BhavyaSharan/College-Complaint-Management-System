import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

const AdminSignup = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const departments = ["AIML","AI","CSBS","CSE","DS","IOT","IT","ECE","ME"];

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    toast.loading("Creating Admin Account...");

    // ✅ Step 1: Check if email is pre-approved
    const { data: allowed } = await supabase
      .from("allowed_admins")
      .select("*")
      .eq("email", email);

    if (!allowed || allowed.length === 0) {
      toast.dismiss();
      toast.error("Email not authorized by college ❌");
      return;
    }

    // ✅ Step 2: Create Supabase Auth User
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    }

    const userId = data.user.id;

    // ✅ Get role + department from allowed_admins
const allowedAdmin = allowed[0];

// ✅ Insert profile in admin_profiles
await supabase.from("admin_profiles").insert([
  {
    id: userId,
    name: name,
    role: allowedAdmin.role,
    department: allowedAdmin.department,
  },
]);

toast.dismiss();
toast.success("Signup Successful ✅ Please Login Now");


  };

  return (
    <div className="min-h-screen w-full flex">

      {/* Left Side Branding Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold">College Complaint System</h1>
        <p className="mt-4 text-lg text-center max-w-sm">
          Secure Signup for Authorized Dean, HOD & Technicians
        </p>
      </div>

      {/* Right Side Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-6">
        <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-10">

          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Admin Signup
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Register only with institutional email
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-6">

            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg placeholder-gray-500 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg text-gray-800 bg-white 
                focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Role --</option>
                <option value="Dean">Dean</option>
                <option value="HOD">HOD</option>
                <option value="Technician">Technician</option>
              </select>
            </div>

            {/* Department Only for HOD */}
            {role === "HOD" && (
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Select Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-400 
                  bg-white text-black rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Institution Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg placeholder-gray-500 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Create Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg placeholder-gray-500 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-400 
                bg-white text-black rounded-lg placeholder-gray-500 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              Sign Up
            </button>

            {/* Back to Login */}
            <Link
              to="/"
              className="block text-center mt-4 text-blue-600 font-semibold hover:underline"
            >
              Already Registered? Login Here
            </Link>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            © College Complaint Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
