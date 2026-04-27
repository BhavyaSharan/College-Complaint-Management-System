import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function TechnicianDashboard() {
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [technicianName, setTechnicianName] = useState("");

  const navigate = useNavigate();

  // ✅ Logout Function
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }
  useEffect(() => {
  checkSession();
}, []);

async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    navigate("/"); // back to login
  }
}


  // ✅ Load Technician Assigned Complaints
  useEffect(() => {
    loadTechnicianComplaints();
  }, []);

  async function loadTechnicianComplaints() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ✅ Fetch Technician Profile
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setTechnicianName(profile.name);

    // ✅ Fetch Complaints Assigned to This Technician
    const { data: complaints } = await supabase
      .from("complaints")
      .select("*")
      .eq("assigned_to", user.id);

    setAssignedComplaints(complaints || []);
  }

  // ✅ Mark Complaint as Resolved (Moves it to Student Confirmation)
  async function markResolved(complaintId) {
    const { error } = await supabase
      .from("complaints")
      .update({ status: "resolved_by_tech" })
      .eq("id", complaintId);

    if (error) {
      alert("Error marking resolved: " + error.message);
    } else {
      loadTechnicianComplaints(); // refresh complaints
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Premium NAVBAR */}
      <Navbar 
        title="Technician Dashboard" 
        userName={technicianName}
        role="Technician"
        onLogout={handleLogout} 
      />

      {/* ✅ MAIN CONTENT */}
      <div className="p-8">
        {/* ✅ Overview Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Assigned Complaint Overview
        </h2>

        {/* ✅ Status Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Assigned */}
          <div className="bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition">
            <h3 className="text-lg font-bold text-gray-700">
              Total Assigned Complaints
            </h3>
            <p className="text-4xl font-bold text-green-700 mt-4">
              {assignedComplaints.length}
            </p>
          </div>

          {/* In Progress */}
          <div className="bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition">
            <h3 className="text-lg font-bold text-gray-700">In Progress</h3>
            <p className="text-4xl font-bold text-yellow-500 mt-4">
              {
                assignedComplaints.filter((c) => c.status !== "resolved" && c.status !== "resolved_by_tech")
                  .length
              }
            </p>
          </div>

          {/* Resolved */}
          <div className="bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition">
            <h3 className="text-lg font-bold text-gray-700">Rectified (Pending Review)</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">
              {assignedComplaints.filter((c) => c.status === "resolved" || c.status === "resolved_by_tech").length}
            </p>
          </div>
        </div>

        {/* ✅ Assigned Complaints List */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Assigned Complaints for Action
          </h2>

          {assignedComplaints.length === 0 ? (
            <p className="text-gray-500">
              ✅ No complaints assigned to you yet.
            </p>
          ) : (
            <div className="space-y-4">
              {assignedComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{c.title}</h3>

                    <p className="text-sm text-gray-600">
                      Category: {c.category} | Status:{" "}
                      <span className="font-semibold text-blue-600">{
                        c.status === 'resolved_by_tech' ? 'Awaiting Student' : c.status
                      }</span>
                    </p>
                  </div>

                  {/* ✅ Rectified Button */}
                  {c.status === "assigned" || c.status === "pending" ? (
                    <button
                      onClick={() => markResolved(c.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
                    >
                      ✅ Mark as Rectified
                    </button>
                  ) : c.status === "resolved_by_tech" ? (
                    <p className="text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-lg">
                      ⏳ Awaiting Student
                    </p>
                  ) : (
                    <p className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg">
                      🎉 Fully Resolved!
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
