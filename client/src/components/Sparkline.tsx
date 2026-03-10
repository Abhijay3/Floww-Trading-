import { useMemo } from "react";

export default function Sparkline({ positive }: { positive: boolean }) {

  const points = useMemo(() => {
    const arr = [];
    let value = 50;

    for (let i = 0; i < 20; i++) {
      value += Math.random() * 10 - 5;
      arr.push(Math.max(10, Math.min(90, value)));
    }

    return arr;
  }, []);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * 10} ${100 - p}`)
    .join(" ");

  return (

    <svg viewBox="0 0 200 100" className="w-full h-10">

      <path
        d={path}
        fill="none"
        stroke={positive ? "#16a34a" : "#dc2626"}
        strokeWidth="3"
      />

    </svg>

  );

}