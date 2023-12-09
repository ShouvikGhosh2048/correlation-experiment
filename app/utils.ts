export function correlation(points: [number, number][]) {
  const avgX = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const avgY = points.reduce((sum, point) => sum + point[1], 0) / points.length;

  const xSquare = points.reduce(
    (sum, point) => sum + Math.pow(point[0] - avgX, 2),
    0
  );
  const ySquare = points.reduce(
    (sum, point) => sum + Math.pow(point[1] - avgY, 2),
    0
  );
  const xyProduct = points.reduce(
    (sum, point) => sum + (point[0] - avgX) * (point[1] - avgY),
    0
  );

  return xyProduct / (Math.sqrt(xSquare) * Math.sqrt(ySquare));
}

export function randomPoints() {
  const a = 2 * Math.random() - 1;
  const b = 2 * Math.random() - 1;

  const points: [number, number][] = [];

  for (let i = 0; i < 20; i++) {
    const x = 2 * Math.random() - 1;
    const y = a * x + b * (2 * Math.random() - 1);
    points.push([x, y]);
  }

  return points;
}
