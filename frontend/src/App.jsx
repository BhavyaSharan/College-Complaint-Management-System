import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignUp";
import DeanDashboard from "./pages/DeanDashboard";
import HodDashboard from "./pages/HodDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import DepartmentAnalytics from "./pages/DepartmentAnalytics";
import TeacherPerformance from "./pages/TeacherPerformance";


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dean"
        element={
          <ProtectedRoute>
            <DeanDashboard />
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
  path="/dean/:dept"
  element={
    <ProtectedRoute>
      <DepartmentAnalytics />
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
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
    </Routes>

    
  );
}

export default App;
