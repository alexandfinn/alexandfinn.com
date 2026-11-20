// One continuous stroke, from the short entry mark to the long signature tail.
const curves = [
  [168, 65, 155, 96, 124, 124],
  [88, 158, 29, 161, 23, 131],
  [15, 98, 69, 84, 103, 61],
  [143, 34, 135, 7, 110, 13],
  [78, 20, 76, 52, 96, 85],
  [118, 121, 140, 147, 165, 147],
  [184, 148, 199, 136, 213, 120],
];

const canvas = document.querySelector(".join canvas");
const context = canvas.getContext("2d");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

function traceSpine() {
  const points = [];
  let x = 180, y = 64, distance = 0;
  for (const [x1, y1, x2, y2, x3, y3] of curves) {
    const x0 = x, y0 = y;
    for (let i = 1; i <= 80; i++) {
      const t = i / 80, u = 1 - t;
      const px = u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3;
      const py = u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3;
      const dx = px - x, dy = py - y;
      const step = Math.hypot(dx, dy);
      distance += step;
      points.push({ x: px, y: py, nx: -dy / step, ny: dx / step, distance });
      x = px;
      y = py;
    }
  }
  return points;
}

// A split nib opens under pressure and reunites at the hairlines and tips.
function cutNib(points) {
  const length = points.at(-1).distance;
  return points.map(({ x, y, nx, ny, distance }) => {
    const taper = Math.min(1, distance / 26, (length - distance) / 31);
    const pressure = Math.abs(nx * .94 + ny * .34);
    const radius = .32 + taper * (1.05 + 7.3 * pressure ** 1.55);
    const slit = taper * Math.max(0, pressure - .32) * 2;
    const edge = offset => [x + nx * offset, y + ny * offset];
    return {
      fraction: distance / length,
      outer: edge(-radius), inner: edge(radius),
      left: edge(.38 * radius - slit), right: edge(.38 * radius + slit),
    };
  });
}

if (context) {
  const nib = cutNib(traceSpine());
  let progress = motion.matches ? 1 : 0;
  let frame;

  function fillBand(last, firstEdge, returnEdge) {
    context.beginPath();
    for (let i = 0; i <= last; i++) context.lineTo(...nib[i][firstEdge]);
    for (let i = last; i >= 0; i--) context.lineTo(...nib[i][returnEdge]);
    context.closePath();
    context.fill();
  }

  function paint() {
    const { width, height } = canvas;
    const scale = Math.min(width / 224, height / 164);
    context.resetTransform();
    context.clearRect(0, 0, width, height);
    context.translate((width - 224 * scale) / 2, (height - 164 * scale) / 2);
    context.scale(scale, scale);
    context.fillStyle = getComputedStyle(canvas).color;
    const next = nib.findIndex(point => point.fraction > progress);
    const last = next === -1 ? nib.length - 1 : next - 1;
    fillBand(last, "outer", "left");
    fillBand(last, "right", "inner");
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
      const t = Math.min(1, (now - start) / 1650);
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
