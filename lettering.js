// A single pen stroke joins the two names. Coordinates are in lettering units.
const stroke = [
  [161, 71],
  [148, 73, 144, 107, 114, 133],
  [78, 164, 26, 156, 29, 125],
  [32, 92, 82, 80, 106, 58],
  [139, 28, 119, 7, 99, 17],
  [69, 32, 80, 65, 104, 97],
  [138, 144, 167, 164, 195, 133],
];

const canvas = document.querySelector(".join canvas");
const context = canvas.getContext("2d");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

if (context) {
  // Track distance along the Bézier curves so drawing speed is independent of
  // the number and length of the curves. A broad nib changes width with angle.
  const points = [];
  let distance = 0;
  let previous = stroke[0];
  for (const curve of stroke.slice(1)) {
    const [x0, y0] = previous;
    const [x1, y1, x2, y2, x3, y3] = curve;
    for (let i = 1; i <= 80; i++) {
      const t = i / 80;
      const u = 1 - t;
      const x = u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3;
      const y = u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3;
      const dx = x - previous[0];
      const dy = y - previous[1];
      distance += Math.hypot(dx, dy);
      points.push({ x, y, distance, angle: Math.atan2(dy, dx) });
      previous = [x, y];
    }
  }

  let progress = motion.matches ? 1 : 0;
  let frame;
  function paint() {
    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min(width / 209, height / 168);
    context.resetTransform();
    context.clearRect(0, 0, width, height);
    context.translate((width - 209 * scale) / 2, (height - 168 * scale) / 2);
    context.scale(scale, scale);
    context.fillStyle = getComputedStyle(canvas).color;
    context.beginPath();

    const lowerEdge = [];
    for (const point of points) {
      if (point.distance > progress * distance) break;
      const taper = Math.min(1, point.distance / 24, (distance - point.distance) / 20);
      const pressure = Math.abs(Math.sin(point.angle - .28));
      const radius = .35 + taper * (1.15 + 4.6 * pressure);
      const dx = -Math.sin(point.angle) * radius;
      const dy = Math.cos(point.angle) * radius;
      context.lineTo(point.x + dx, point.y + dy);
      lowerEdge.push([point.x - dx, point.y - dy]);
    }
    for (const [x, y] of lowerEdge.reverse()) context.lineTo(x, y);
    context.closePath();
    context.fill();
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    paint();
  }

  function settle() {
    cancelAnimationFrame(frame);
    progress = 1;
    paint();
  }

  resize();
  canvas.parentElement.classList.add("rendered");
  new ResizeObserver(resize).observe(canvas);
  if (!motion.matches) {
    const start = performance.now();
    function draw(now) {
      const t = Math.min(1, (now - start) / 1850);
      progress = t * t * (3 - 2 * t);
      paint();
      if (t < 1) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
  }
  motion.addEventListener("change", settle);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) settle();
  });
}
