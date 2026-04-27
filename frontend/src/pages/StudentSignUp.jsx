import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Calendar, Users, AlertCircle } from "lucide-react";

export default function StudentSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    branch: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email Domain Validation
    if (!formData.email.endsWith("@niet.co.in")) {
      setError("Please use your official @niet.co.in email address.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Insert into student_profiles table
      const { error: dbError } = await supabase.from("student_profiles").insert([
        {
          id: authData.user.id, // Linking Auth ID to profile ID
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          gender: formData.gender,
          branch: formData.branch,
          email: formData.email,
        },
      ]);

      if (dbError) throw dbError;

      alert("Registration Successful! Tell the student to verify their email, or they can log in immediately depending on your Supabase settings.");
      navigate("/student-login");

    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-blue-600 w-1/3 p-8 text-white">
          <UserPlus size={64} className="mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-center">Student Portal</h2>
          <p className="text-sm mt-2 opacity-80 text-center">Join the NIET Complaint Management System.</p>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Register as Student</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
                <input required type="text" placeholder="First Name" 
                  value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm" />
              </div>
              <div className="flex-1 relative">
                <User className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
                <input required type="text" placeholder="Last Name" 
                  value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
                <input required type="date"
                  value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm cursor-text" />
              </div>
              <div className="flex-1 relative">
                <Users className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
                <select required 
                  value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm">
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                {/* Fallback to simple styled span since we dont want to change imports right here blindly */}
                <span className="font-serif">B</span>
              </div>
              <select required 
                value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm">
                <option value="" disabled>Select Branch / Department</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="ME">Mechanical (ME)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="AIML">Artificial Intelligence (AIML)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
              <input required type="email" placeholder="Email (@niet.co.in)" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
              <input required type="password" placeholder="Password" 
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm" />
            </div>

            <button disabled={loading} type="submit" 
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-all disabled:opacity-50">
              {loading ? "Registering..." : "Create Student Account"}
            </button>

          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/student-login" className="text-blue-600 font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
