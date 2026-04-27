import { Routes, Route } from "react-router-dom";

import RoleSelection from "./components/RoleSelection";

import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignUp";

import StudentLogin from "./pages/StudentLogin";
import StudentSignUp from "./pages/StudentSignUp";

import DeanDashboard from "./pages/DeanDashboard";
import HodDashboard from "./pages/HodDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import Profile from "./pages/Profile";

import DepartmentAnalytics from "./pages/DepartmentAnalytics";
import TeacherPerformance from "./pages/TeacherPerformance";
import StudentDashboard from "./pages/StudentDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<RoleSelection />} />

      {/* Public Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/student-signup" element={<StudentSignUp />} />

      {/* Protected Routes */}
      <Route
        path="/dean"
        element={
          <ProtectedRoute>
            <DeanDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dean/:dept"
        element={
          <ProtectedRoute>
            <DepartmentAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod"
        element={
          <ProtectedRoute>
            <HodDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/teacher/:id"
        element={
          <ProtectedRoute>
            <TeacherPerformance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tech"
        element={
          <ProtectedRoute>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
