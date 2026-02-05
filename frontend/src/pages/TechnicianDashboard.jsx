import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

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

  // ✅ Mark Complaint as Resolved
  async function markResolved(complaintId) {
    await supabase
      .from("complaints")
      .update({
        status: "resolved",
      })
      .eq("id", complaintId);

    loadTechnicianComplaints(); // refresh complaints
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-green-600 to-teal-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">
          Technician Dashboard ({technicianName})
        </h1>

        <div className="flex gap-6 items-center">
          {/* ✅ Profile Button */}
          <Link
            to="/profile"
            className="px-4 py-2 border border-gray-400 bg-white text-black rounded-lg shadow-sm"
          >
            View Profile
          </Link>

          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

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
                assignedComplaints.filter((c) => c.status !== "resolved")
                  .length
              }
            </p>
          </div>

          {/* Resolved */}
          <div className="bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition">
            <h3 className="text-lg font-bold text-gray-700">Resolved Faults</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">
              {assignedComplaints.filter((c) => c.status === "resolved").length}
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
                  className="p-4 border rounded-xl hover:bg-gray-50"
                >
                  <h3 className="font-bold text-gray-800">{c.title}</h3>

                  <p className="text-sm text-gray-600">
                    Category: {c.category} | Status:{" "}
                    <span className="font-semibold">{c.status}</span>
                  </p>

                  {/* ✅ Rectified Button */}
                  {c.status !== "resolved" ? (
                    <button
                      onClick={() => markResolved(c.id)}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Mark as Rectified
                    </button>
                  ) : (
                    <p className="text-green-600 font-semibold mt-3">
                      ✅ Complaint Resolved Successfully
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
