import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      alert("Invalid OTP ❌");
      return;
    }

    alert("OTP Verified ✅ Signup Complete");

    console.log("User:", data.user);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-8 shadow-lg rounded-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-5 text-center">
          Verify OTP
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
