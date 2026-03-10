import { motion } from "framer-motion";

export default function HeroChart() {

  const points = [
    { x: 0, y: 80 },
    { x: 50, y: 70 },
    { x: 100, y: 75 },
    { x: 150, y: 60 },
    { x: 200, y: 65 },
    { x: 250, y: 50 },
    { x: 300, y: 55 },
    { x: 350, y: 40 },
    { x: 400, y: 45 }
  ];

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (

    <svg
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
    >

      <motion.path
        d={path}
        fill="transparent"
        stroke="#10b981"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity
        }}
      />

    </svg>

  );

}