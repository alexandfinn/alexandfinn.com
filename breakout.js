(() => {
  const toggle = document.querySelector(".pong-toggle");
  const exitGame = document.querySelector(".pong-exit");
  const intro = document.querySelector(".intro");
  const layer = document.querySelector(".pong-layer");
  const paddle = document.querySelector(".pong-paddle");
  const ball = document.querySelector(".pong-ball");
  const winModal = document.querySelector(".breakout-win");
  const winCard = document.querySelector(".breakout-card");
  const closeWin = document.querySelector(".breakout-close");
  const emailWin = document.querySelector(".breakout-email");
  const targets = [...document.querySelectorAll("[data-pong-target]")];
  const originalAria = new Map(
    targets.map((target) => [target, target.getAttribute("aria-hidden")]),
  );

  const ballRadius = 8;
  let active = false;
  let paused = false;
  let animationFrame;
  let restartTimer;
  let completionTimer;
  let lastTime = 0;
  let ballX = 0;
  let ballY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let paddleX = 0;
  let hitTargets = new Set();

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function paddleMetrics() {
    return {
      width: paddle.offsetWidth,
      height: paddle.offsetHeight,
      y:
        window.innerHeight -
        Math.max(24, window.innerHeight * 0.035) -
        paddle.offsetHeight,
    };
  }

  function movePaddle(clientX) {
    const { width, y } = paddleMetrics();
    paddleX = clamp(clientX - width / 2, 8, window.innerWidth - width - 8);
    paddle.style.transform = `translate3d(${paddleX}px, ${y}px, 0)`;
  }

  function renderBall() {
    ball.style.transform = `translate3d(${ballX - ballRadius}px, ${ballY - ballRadius}px, 0)`;
  }

  function makeImpact(x, y) {
    const impact = document.createElement("i");
    impact.className = "pong-impact";
    impact.style.setProperty("--impact-x", `${x - ballRadius + 1}px`);
    impact.style.setProperty("--impact-y", `${y - ballRadius + 1}px`);
    layer.appendChild(impact);
    impact.addEventListener("animationend", () => impact.remove(), {
      once: true,
    });
  }

  function smashTarget(target) {
    hitTargets.add(target);
    const rotation =
      (Math.random() < 0.5 ? -1 : 1) * (24 + Math.random() * 34);
    const drift = (Math.random() - 0.5) * 56;
    target.style.setProperty("--pong-kick-x", `${drift * 0.18}px`);
    target.style.setProperty("--pong-kick-rotation", `${rotation * 0.16}deg`);
    target.style.setProperty("--pong-drift", `${drift}px`);
    target.style.setProperty("--pong-rotation", `${rotation}deg`);
    target.classList.add("pong-destroyed");
    target.setAttribute("aria-hidden", "true");
    makeImpact(ballX, ballY);

    if (hitTargets.size === targets.length) {
      completionTimer = setTimeout(() => {
        if (!active) return;
        stop();
        winModal.hidden = false;
        emailWin.focus();
      }, 700);
    }
  }

  function checkTargets() {
    for (const target of targets) {
      if (hitTargets.has(target)) continue;
      const rect = target.getBoundingClientRect();
      if (
        ballX + ballRadius >= rect.left &&
        ballX - ballRadius <= rect.right &&
        ballY + ballRadius >= rect.top &&
        ballY - ballRadius <= rect.bottom
      ) {
        smashTarget(target);

        const overlaps = [
          { side: "left", amount: ballX + ballRadius - rect.left },
          { side: "right", amount: rect.right - (ballX - ballRadius) },
          { side: "top", amount: ballY + ballRadius - rect.top },
          { side: "bottom", amount: rect.bottom - (ballY - ballRadius) },
        ];
        const collision = overlaps.reduce((nearest, overlap) =>
          overlap.amount < nearest.amount ? overlap : nearest,
        );

        if (collision.side === "left") {
          ballX = rect.left - ballRadius;
          velocityX = -Math.abs(velocityX);
        } else if (collision.side === "right") {
          ballX = rect.right + ballRadius;
          velocityX = Math.abs(velocityX);
        } else if (collision.side === "top") {
          ballY = rect.top - ballRadius;
          velocityY = -Math.abs(velocityY);
        } else {
          ballY = rect.bottom + ballRadius;
          velocityY = Math.abs(velocityY);
        }

        return;
      }
    }
  }

  function resetBall() {
    if (!active) return;
    paused = false;
    ball.classList.remove("is-waiting");
    const metrics = paddleMetrics();
    ballX = paddleX + metrics.width / 2;
    ballY = metrics.y - ballRadius - 3;
    const speed = clamp(window.innerWidth * 0.34, 270, 430);
    velocityX = (Math.random() - 0.5) * speed * 0.8;
    velocityY = -Math.sqrt(speed ** 2 - velocityX ** 2);
    renderBall();
  }

  function miss() {
    paused = true;
    ball.classList.add("is-waiting");
    clearTimeout(restartTimer);
    restartTimer = setTimeout(resetBall, 650);
  }

  function frame(time) {
    if (!active) return;
    const delta = Math.min((time - lastTime) / 1000, 0.032) || 0;
    lastTime = time;

    if (!paused) {
      const previousY = ballY;
      ballX += velocityX * delta;
      ballY += velocityY * delta;

      if (ballX <= ballRadius) {
        ballX = ballRadius;
        velocityX = Math.abs(velocityX);
      } else if (ballX >= window.innerWidth - ballRadius) {
        ballX = window.innerWidth - ballRadius;
        velocityX = -Math.abs(velocityX);
      }

      if (ballY <= ballRadius) {
        ballY = ballRadius;
        velocityY = Math.abs(velocityY);
      }

      const metrics = paddleMetrics();
      const touchesPaddle =
        velocityY > 0 &&
        previousY + ballRadius <= metrics.y + metrics.height &&
        ballY + ballRadius >= metrics.y &&
        ballX >= paddleX - ballRadius &&
        ballX <= paddleX + metrics.width + ballRadius;

      if (touchesPaddle) {
        const impact = clamp(
          (ballX - (paddleX + metrics.width / 2)) / (metrics.width / 2),
          -1,
          1,
        );
        const speed = Math.min(Math.hypot(velocityX, velocityY) * 1.045, 620);
        const angle = impact * 0.95;
        ballY = metrics.y - ballRadius;
        velocityX = Math.sin(angle) * speed;
        velocityY = -Math.cos(angle) * speed;
      } else if (ballY - ballRadius > window.innerHeight) {
        miss();
      }

      checkTargets();
      renderBall();
    }

    animationFrame = requestAnimationFrame(frame);
  }

  function restoreTargets() {
    for (const target of targets) {
      target.classList.remove("pong-destroyed");
      target.style.removeProperty("--pong-kick-x");
      target.style.removeProperty("--pong-kick-rotation");
      target.style.removeProperty("--pong-drift");
      target.style.removeProperty("--pong-rotation");
      const aria = originalAria.get(target);
      if (aria === null) target.removeAttribute("aria-hidden");
      else target.setAttribute("aria-hidden", aria);
    }
  }

  function hideWin() {
    winModal.hidden = true;
    toggle.focus();
  }

  function start() {
    if (active) return;
    winModal.hidden = true;
    active = true;
    hitTargets = new Set();
    restoreTargets();
    document.body.classList.add("pong-active");
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    intro.inert = true;
    exitGame.focus();
    movePaddle(window.innerWidth / 2);
    resetBall();
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(frame);
  }

  function stop() {
    if (!active) return;
    active = false;
    paused = false;
    cancelAnimationFrame(animationFrame);
    clearTimeout(restartTimer);
    clearTimeout(completionTimer);
    document.body.classList.remove("pong-active");
    layer.hidden = true;
    layer.setAttribute("aria-hidden", "true");
    intro.inert = false;
    toggle.focus({ preventScroll: true });
    layer.querySelectorAll(".pong-impact").forEach((impact) => impact.remove());
    restoreTargets();
  }

  exitGame.addEventListener("click", stop);
  toggle.addEventListener("click", start);
  closeWin.addEventListener("click", hideWin);
  winModal.addEventListener("click", (event) => {
    if (!winCard.contains(event.target)) hideWin();
  });

  window.addEventListener("pointermove", (event) => {
    if (active) movePaddle(event.clientX);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !winModal.hidden) {
      hideWin();
      return;
    }
    if (!active) return;
    if (event.key === "Escape") {
      stop();
      toggle.focus();
      return;
    }
    if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) {
      event.preventDefault();
      const direction = ["ArrowLeft", "a", "A"].includes(event.key) ? -1 : 1;
      movePaddle(paddleX + paddleMetrics().width / 2 + direction * 42);
    }
  });

  window.addEventListener("resize", () => {
    if (!active) return;
    movePaddle(paddleX + paddleMetrics().width / 2);
    ballX = clamp(ballX, ballRadius, window.innerWidth - ballRadius);
    ballY = clamp(ballY, ballRadius, window.innerHeight - ballRadius);
    renderBall();
  });

  document.addEventListener("visibilitychange", () => {
    lastTime = performance.now();
  });
})();
