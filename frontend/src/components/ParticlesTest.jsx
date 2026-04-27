import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesTest() {
  const init = useCallback(async (engine) => {
    console.log("tsParticles engine loaded");
    await loadFull(engine);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
      }}
    >
      <Particles
        init={init}
        options={{
          fullScreen: true,
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff" },
            move: { enable: true },
          },
        }}
      />
    </div>
  );
}
