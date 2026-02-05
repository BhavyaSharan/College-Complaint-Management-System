import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function TeacherPerformance() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  async function fetchTeacherData() {
    // ✅ Fetch Teacher Info
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", id)
      .single();

    setTeacher(teacherData);

    // ✅ Fetch Feedback List
    const { data: feedbackData } = await supabase
      .from("teacher_feedback")
      .select("*")
      .eq("teacher_id", id);

    setFeedbacks(feedbackData || []);
  }

  // ✅ Average Rating
  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : "N/A";

  // ✅ Graph Data
  const chartData = feedbacks.map((f, index) => ({
    name: `Student ${index + 1}`,
    rating: f.rating,
  }));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">
          Teacher Performance
        </h1>

        <Link
          to="/hod"
          className="font-semibold hover:underline"
        >
          Back to HOD Dashboard
        </Link>
      </nav>

      {/* ✅ Main Content */}
      <div className="p-10 max-w-5xl mx-auto">

        {/* Teacher Info */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {teacher?.name}
          </h2>

          <p className="text-gray-600 mt-2">
            Department: {teacher?.department}
          </p>

          <p className="mt-4 text-lg font-semibold">
            ⭐ Average Rating:{" "}
            <span className="text-blue-600">{avgRating}</span>
          </p>
        </div>

        {/* ✅ Rating Graph */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10">
          <h3 className="text-xl font-bold mb-6 text-black">
            Student Rating Chart
          </h3>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">
              No ratings available yet.
            </p>
          ) : (
            <BarChart width={700} height={300} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" />
            </BarChart>
          )}
        </div>

        {/* ✅ Feedback List */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-black">
            Student Feedback
          </h3>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">
              No feedback submitted yet.
            </p>
          ) : (
            feedbacks.map((f) => (
              <div
                key={f.id}
                className="p-4 border rounded-xl mb-4"
              >
                <p className="font-semibold">
                  ⭐ Rating: {f.rating}/5
                </p>

                <p className="text-gray-700 mt-2">
                  "{f.feedback}"
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  - {f.student_name || "Anonymous"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
