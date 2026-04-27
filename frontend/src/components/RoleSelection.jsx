import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const RoleSelection = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-blue-600">

      {/* PARTICLE BACKGROUND */}
      <Particles
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false }, // VERY IMPORTANT
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              enable: true,
              color: "#ffffff",
              distance: 150,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              outModes: { default: "bounce" },
            },
            number: {
              value: 80,
              density: { enable: true, area: 800 },
            },
            opacity: { value: 0.6 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 bg-white shadow-lg rounded-2xl p-10 text-center w-[350px]"
      >
        <h1 className="text-2xl font-bold mb-6 text-black">
          College Complaint Portal
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student-login")}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600"
        >
          Login as Student
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/admin-login")}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
        >
          Login as Admin
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
