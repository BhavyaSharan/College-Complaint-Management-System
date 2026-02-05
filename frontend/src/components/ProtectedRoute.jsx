import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);
    setLoading(false);
  }

  if (loading) return <h2 className="p-6">Loading...</h2>;

  // ✅ If not logged in → redirect to login
  if (!user) return <Navigate to="/" />;

  return children;
}
