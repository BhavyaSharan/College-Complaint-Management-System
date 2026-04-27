import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      navigate("/student"); // Route to the future student dashboard
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side Image/Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-blue-600 md:w-1/2 p-12 text-white">
          <LogIn size={80} className="mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back!</h2>
          <p className="text-sm opacity-80 text-center max-w-sm">
            Access your NIET student portal to file complaints, view statuses, and keep our campus running smoothly.
          </p>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Student Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="email" placeholder="Your @niet.co.in Email" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-black text-sm" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input required type="password" placeholder="Password" 
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-black text-sm" />
            </div>

            <div className="flex justify-end">
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">Forgot Password?</span>
            </div>

            <button disabled={loading} type="submit" 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50 text-lg">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/student-signup" className="text-blue-600 font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
