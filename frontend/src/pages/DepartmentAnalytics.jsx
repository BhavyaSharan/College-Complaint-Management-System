import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function DepartmentAnalytics() {
  const { dept } = useParams();
  const [complaints, setComplaints] = useState([]);

  const categories = [
    "Infrastructure",
    "Lab Equipment",
    "Classroom",
    "Washroom",
    "Other",
  ];

  useEffect(() => {
    fetchDeptComplaints();
  }, []);

  async function fetchDeptComplaints() {
    const { data } = await supabase
      .from("complaints")
      .select("*")
      .eq("department", dept);

    setComplaints(data || []);
  }

  // ✅ Category Count Data
  const chartData = categories.map((cat) => ({
    name: cat,
    value: complaints.filter((c) => c.category === cat).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {dept} Department Analytics
        </h1>

        <Link
          to="/dean"
          className="font-semibold hover:underline"
        >
          Back to Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div className="p-10">

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Complaint Categories Overview
        </h2>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* ✅ Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-black">
              Category Wise Distribution (Pie)
            </h3>

            <PieChart width={350} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              />
              <Tooltip />
            </PieChart>
          </div>

          {/* ✅ Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-black">
              Category Count (Bar)
            </h3>

            <BarChart width={400} height={300} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          </div>
        </div>

        {/* Complaint List */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-black">
            Complaints in {dept}
          </h2>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 border rounded-xl mb-3"
              >
                <h3 className="font-bold text-black">{c.title}</h3>
                <p className="text-sm text-gray-600 ">
                  Category: {c.category} | Status: {c.status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
