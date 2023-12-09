export function PointsSVG({ points }: { points: [number, number][] }) {
  return (
    <svg
      viewBox={"-2 -2 4 4"}
      width="300" height="300"
      className="border"
    >
      {points.map((point, index) => <circle key={index} cx={point[0]} cy={-point[1]} r={0.05} />)}
    </svg>
  );
}