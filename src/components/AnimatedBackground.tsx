import React, { useRef, useEffect } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const stars: { x: number, y: number, radius: number, speed: number, alpha: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random()
      });
    }

    const atoms: { x: number, y: number, vx: number, vy: number, size: number, angle: number }[] = [];
    for (let i = 0; i < 15; i++) {
      atoms.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 30 + 10,
        angle: Math.random() * Math.PI * 2
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.01;
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Clear with dark transparent color to leave subtle trails
      ctx.fillStyle = 'rgba(7, 11, 20, 1)';
      ctx.fillRect(0, 0, width, height);

      // Draw aurora gradients
      const gradient1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time) * 100, height * 0.3 + Math.cos(time * 0.8) * 100, 0,
        width * 0.3 + Math.sin(time) * 100, height * 0.3 + Math.cos(time * 0.8) * 100, width * 0.6
      );
      gradient1.addColorStop(0, 'rgba(79, 195, 247, 0.03)'); // #4FC3F7
      gradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 1.2) * 100, height * 0.7 + Math.sin(time * 0.9) * 100, 0,
        width * 0.7 + Math.cos(time * 1.2) * 100, height * 0.7 + Math.sin(time * 0.9) * 100, width * 0.6
      );
      gradient2.addColorStop(0, 'rgba(139, 92, 246, 0.03)'); // #8B5CF6
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Mouse spotlight
      const spot = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      spot.addColorStop(1, 'transparent');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        ctx.globalAlpha = star.alpha * (0.5 + 0.5 * Math.sin(time * 5 + star.x));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Floating atoms
      atoms.forEach(atom => {
        atom.x += atom.vx;
        atom.y += atom.vy;
        atom.angle += 0.01;

        if (atom.x < -100) atom.x = width + 100;
        if (atom.x > width + 100) atom.x = -100;
        if (atom.y < -100) atom.y = height + 100;
        if (atom.y > height + 100) atom.y = -100;

        ctx.strokeStyle = 'rgba(79, 195, 247, 0.1)';
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(atom.x, atom.y);
        ctx.rotate(atom.angle);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, atom.size, atom.size * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(0, 0, atom.size, atom.size * 0.3, Math.PI / 3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(0, 0, atom.size, atom.size * 0.3, Math.PI * 2 / 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#070B14]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
}
