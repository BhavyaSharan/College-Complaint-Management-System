import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function HodDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [department, setDepartment] = useState("");

  // ✅ Technician List
  const [technicians, setTechnicians] = useState([]);

  // ✅ Teacher List
  const [teachers, setTeachers] = useState([]);

  // ✅ NEW: Store Selected Technician for Each Complaint
  const [selectedTech, setSelectedTech] = useState({});

  const navigate = useNavigate();

  // ✅ Logout
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


  // ✅ Load Department Complaints
  useEffect(() => {
    loadHodComplaints();
  }, []);

  async function loadHodComplaints() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ✅ Fetch logged-in HOD profile
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setDepartment(profile.department);

    // ✅ Fetch complaints only of HOD department
    const { data: deptComplaints } = await supabase
      .from("complaints")
      .select("*")
      .eq("department", profile.department);

    setComplaints(deptComplaints || []);

    // ✅ Fetch all technicians
    const { data: techs } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("role", "Technician");

    setTechnicians(techs || []);

    // ✅ Fetch teachers of same department
    const { data: deptTeachers } = await supabase
      .from("teachers")
      .select("*")
      .eq("department", profile.department);

    setTeachers(deptTeachers || []);
  }

  // ✅ Assign Technician Function (Runs on Button Click)
  async function assignTechnician(complaintId) {
    const technicianId = selectedTech[complaintId];

    if (!technicianId) return;

    await supabase
      .from("complaints")
      .update({
        assigned_to: technicianId,
        status: "assigned",
      })
      .eq("id", complaintId);

    loadHodComplaints(); // refresh
  }

  // ✅ Complaint Categories
  const categories = [
    "Infrastructure",
    "Lab Equipment",
    "Classroom",
    "Washroom",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">
          HOD Dashboard ({department})
        </h1>

        <div className="flex gap-6 items-center">

          {/* Profile */}
          <Link
            to="/profile"
            className="px-4 py-2 border border-gray-400 bg-white text-black rounded-lg shadow-sm"

          >
            View Profile
          </Link>

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
        {/* Overview Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Department Complaint Overview
        </h2>

        {/* ✅ Category Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-white shadow-xl rounded-2xl p-6 hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold text-gray-700">{cat}</h3>
              <p className="mt-2 text-gray-500 text-sm">Total Complaints</p>

              <p className="text-4xl font-bold text-blue-600 mt-4">
                {complaints.filter((c) => c.category === cat).length}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Complaints List + Assign Button */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Recent Complaints in {department}
          </h2>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl hover:bg-gray-50"
                >
                  <h3 className="font-bold text-gray-800">{c.title}</h3>

                  <p className="text-sm text-gray-600">
                    Category: {c.category} | Status: {c.status}
                  </p>

                  {/* ✅ Technician Dropdown */}
                  <select
                    value={selectedTech[c.id] || ""}
                    onChange={(e) =>
                      setSelectedTech({
                        ...selectedTech,
                        [c.id]: e.target.value,
                      })
                    }
                    className="mt-3 px-3 py-2 border border-gray-400 bg-white text-black rounded-lg"
                    disabled={c.status === "assigned"}
                  >
                    <option value="">Select Technician</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  {/* ✅ Assign Button */}
                  <button
                    onClick={() => assignTechnician(c.id)}
                    disabled={c.status === "assigned"}
                    className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Assign
                  </button>

                  {/* ✅ Assigned Message */}
                  {c.status === "assigned" && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✅ Assigned Successfully
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Teacher Feedback Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-black">
            Teacher Performance & Feedback
          </h2>

          {teachers.length === 0 ? (
            <p className="text-black-500">
              No teachers found in this department.
            </p>
          ) : (
            teachers.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/hod/teacher/${t.id}`)}
                className="p-4 border rounded-xl mb-3 cursor-pointer hover:bg-gray-50 text-black"
              >
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-sm text-gray-500">
                  Click to view performance & feedback
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
