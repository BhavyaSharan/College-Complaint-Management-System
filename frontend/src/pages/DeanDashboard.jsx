import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function DeanDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [month, setMonth] = useState("January");

  const navigate = useNavigate();

  // ✅ Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  // ✅ Fetch Complaints
  useEffect(() => {
  checkSession();
}, []);

async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    navigate("/"); // back to login
  }
}

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  async function fetchAllComplaints() {
    const { data } = await supabase.from("complaints").select("*");
    setComplaints(data || []);
  }

  // ✅ Departments List
  const departments = ["CSE", "ECE", "ME", "IT", "AIML"];

  // ✅ Month Filter Logic (NEW)
  const monthIndex = new Date(`${month} 1, 2025`).getMonth();

  const filteredComplaints = complaints.filter((c) => {
    const complaintDate = new Date(c.created_at);
    return complaintDate.getMonth() === monthIndex;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">Dean Dashboard</h1>

        <div className="flex gap-6 items-center">
          {/* Profile */}
          <Link
            to="/profile"
            className="px-4 py-2 border border-gray-400 bg-white text-black rounded-lg shadow-sm"
          >
            View Profile
          </Link>

          {/* Logout */}
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
        {/* Month Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Month-wise Complaint Overview
          </h2>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-400 bg-white text-black rounded-lg shadow-sm"
          >
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>

        {/* ✅ Department Complaint Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept}
              onClick={() => navigate(`/dean/${dept}`)}
              className="cursor-pointer bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold text-gray-700">
                {dept} Department
              </h3>

              <p className="mt-2 text-gray-500">
                Total Complaints in {month}
              </p>

              <p className="text-4xl font-bold text-blue-600 mt-4">
                {
                  filteredComplaints.filter(
                    (c) => c.department === dept
                  ).length
                }
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Complaint Table */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-black">
            Recent Complaints ({month})
          </h2>

          {filteredComplaints.length === 0 ? (
            <p className="text-gray-500">
              No complaints found for {month}.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl hover:bg-gray-50 text-black"
                >
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-gray-600">
                    Department: {c.department} | Status: {c.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
