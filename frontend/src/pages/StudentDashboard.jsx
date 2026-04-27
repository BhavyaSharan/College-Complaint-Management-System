import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PlusCircle, Clock, CheckCircle, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  
  // ✅ Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ title: "", description: "", category: "Infrastructure" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkSessionAndFetchData();
  }, []);

  async function checkSessionAndFetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/student-login");
      return;
    }

    // Fetch Student Profile
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setStudent(profile);

    // Fetch Student's Complaints
    const { data: userComplaints } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setComplaints(userComplaints || []);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/student-login");
  }

  // Dashboard Metrics
  const activeComplaints = complaints.filter(c => c.status !== "resolved").length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;

  // ✅ Handle Complaint Form Submit
  const handleFileComplaint = async (e) => {
    e.preventDefault();
    if (!newComplaint.title || !newComplaint.description) return;

    setIsSubmitting(true);
    
    // Insert into Supabase mapping the department to the student's branch
    const { data: insertedData, error } = await supabase.from("complaints").insert([
      {
        user_id: student.id,
        created_by: `${student.first_name} ${student.last_name}`,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        department: student.branch, // 🔑 Direct automatic mapping here!
        status: "pending",
      }
    ]).select();

    setIsSubmitting(false);

    if (error) {
      alert("Error filing complaint: " + error.message);
    } else {
      setComplaints([insertedData[0], ...complaints]); // instantly show it in table
      setIsModalOpen(false); // Close Modal
      setNewComplaint({ title: "", description: "", category: "Infrastructure" }); // reset
    }
  };

  // ✅ Handle Confirming Resolution
  const handleConfirmResolution = async (complaintId) => {
    const { data, error } = await supabase
      .from("complaints")
      .update({ status: "resolved" })
      .eq("id", complaintId)
      .select();

    if (error) {
      alert("Error confirming resolution: " + error.message);
    } else if (!data || data.length === 0) {
      alert("⚠️ Update failed silently! This means Supabase Row Level Security (RLS) is blocking the Student from updating the table. Execute the SQL fix provided in the chat.");
    } else {
      // Refresh local state only if remote updated
      setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: "resolved" } : c));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar 
        title="Student Portal" 
        userName={student?.first_name ? `${student.first_name} ${student.last_name}` : "Student"} 
        role={student?.branch ? `${student.branch} Student` : "Student"} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {student?.first_name || "Student"}! 👋
            </h2>
            <p className="text-blue-100 max-w-xl">
              Use this portal to report campus infrastructure issues, track your existing complaints, and help us maintain an excellent learning environment.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <PlusCircle size={20} />
            File New Complaint
          </motion.button>
        </motion.div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl"><FileText size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Filed</p>
              <p className="text-3xl font-bold text-gray-800">{complaints.length}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-yellow-50 text-yellow-600 p-4 rounded-xl"><Clock size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">In Progress / Pending</p>
              <p className="text-3xl font-bold text-gray-800">{activeComplaints}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl"><CheckCircle size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Resolved</p>
              <p className="text-3xl font-bold text-gray-800">{resolvedComplaints}</p>
            </div>
          </motion.div>
        </div>

        {/* Complaints Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="text-blue-600" size={24} />
              My Recent Complaints
            </h3>
          </div>
          
          {complaints.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <CheckCircle size={40} className="text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-700">No complaints filed yet!</h4>
              <p className="text-gray-500 mt-2">If you notice an issue on campus, use the button above to report it.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b">ID / Title</th>
                    <th className="p-4 font-semibold border-b">Category</th>
                    <th className="p-4 font-semibold border-b">Date Filed</th>
                    <th className="p-4 font-semibold border-b">Status</th>
                    <th className="p-4 font-semibold border-b">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{c.title}</p>
                        <p className="text-xs text-gray-500 uppercase">ID: {c.id.substring(0, 8)}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {c.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(c.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        {c.status === "resolved" && <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold items-center gap-1 inline-flex"><CheckCircle size={12}/> Resolved</span>}
                        {c.status === "resolved_by_tech" && <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold items-center gap-1 inline-flex"><Clock size={12}/> Awaiting Confirmation</span>}
                        {c.status === "assigned" && <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold items-center gap-1 inline-flex"><Clock size={12}/> Assigned</span>}
                        {(c.status === "pending") && <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold items-center gap-1 inline-flex"><AlertTriangle size={12}/> Pending</span>}
                      </td>
                      <td className="p-4">
                        {c.status === "resolved_by_tech" ? (
                          <button 
                            onClick={() => handleConfirmResolution(c.id)}
                            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-1"
                          >
                            <CheckCircle size={14} /> Confirm
                          </button>
                        ) : (
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1">
                            View details <ChevronRight size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>

      {/* ✅ Premium File Complaint Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PlusCircle size={22} />
                File a Bug / Complaint
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-red-200 transition-colors bg-white/10 p-1.5 rounded-full hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleFileComplaint} className="p-8 space-y-5">
              
              {/* Note about logic */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md mb-2">
                <p className="text-sm text-blue-700 flex gap-2">
                  <span className="font-bold">Info:</span>
                  This complaint will automatically be sent straight to the HOD of your designated branch: <b>{student?.branch || "Unknown"}</b>.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Issue Title / Short Description</label>
                <input 
                  required 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Broken AC in Lab 3"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description</label>
                <textarea 
                  required 
                  placeholder="Explain the issue in detail..."
                  rows="3"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  required
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                >
                  <option value="Infrastructure">Infrastructure (AC, Furniture, etc)</option>
                  <option value="Lab Equipment">Lab Equipment (PCs, Kits)</option>
                  <option value="Classroom">Classroom Maintenance</option>
                  <option value="Washroom">Washroom Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-2 w-2/3 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Filing..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
