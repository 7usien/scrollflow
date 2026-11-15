// src/content/ui/confetti.ts — Zero-dependency ambient confetti canvas engine (FR-10, FR-13, FR-14, PRD §6.6)

const CONFETTI_COLORS = ['#6d5bff', '#00d4ff', '#34e5a0', '#ffd166', '#ff6b9a'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  color: string;
  shape: 'rect' | 'circle' | 'triangle';
  life: number;
  ttl: number;
}

export function burstConfetti(
  shadowRoot: ShadowRoot,
  options?: { isShort?: boolean; onComplete?: () => void }
): void {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) {
    options?.onComplete?.();
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'sf-confetti-canvas';
  shadowRoot.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    options?.onComplete?.();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  canvas.width = vw * dpr;
  canvas.height = vh * dpr;
  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;
  ctx.scale(dpr, dpr);

  const originX = vw - 8;
  const originY = vh * 0.88;

  const count = options?.isShort
    ? 30
    : Math.min(140, Math.max(60, Math.floor(vw / 10)));

  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const shapeRoll = Math.random();
    const shape = shapeRoll < 0.6 ? 'rect' : shapeRoll < 0.9 ? 'circle' : 'triangle';
    const size = 4 + Math.random() * 5;
    const ttl = 1600 + Math.random() * 600; // 1600–2200ms

    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 9, // -4.5 to 4.5
      vy: -5 - Math.random() * 6,     // -11 to -5
      size,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.44, // ±0.22 rad/frame
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape,
      life: 0,
      ttl,
    });
  }

  let rafId: number | null = null;
  let lastTime = performance.now();

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    options?.onComplete?.();
  };

  const frame = (now: number) => {
    if (document.hidden) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    const dt = Math.min(32, now - lastTime);
    lastTime = now;
    const step = dt / 16.666;

    ctx.clearRect(0, 0, vw, vh);

    let activeCount = 0;

    for (const p of particles) {
      p.life += dt;
      if (p.life >= p.ttl) continue;

      activeCount++;

      // Physics
      p.vy += 0.32 * step;
      p.vx *= Math.pow(0.995, step);
      p.vy *= Math.pow(0.995, step);
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.rot += p.vrot * step;

      const progress = p.life / p.ttl;
      const alpha = progress < 0.75 ? 1 : 1 - (progress - 0.75) / 0.25;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // Simulate 3D rotation flip
      ctx.scale(Math.cos(p.rot * 2), 1);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeCount > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      cleanup();
    }
  };

  rafId = requestAnimationFrame(frame);
}
