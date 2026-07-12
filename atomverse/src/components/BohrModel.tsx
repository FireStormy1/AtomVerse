import React, { useRef, useEffect } from 'react';
import { ElementData } from '../types/element';
import { getCategoryColor } from '../utils/theme';

interface BohrModelProps {
  element: ElementData;
  size?: number;
}

export function BohrModel({ element, size = 400 }: BohrModelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    let animationFrameId: number;
    let time = 0;
    
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Core parameters
    const baseRadius = 25;
    const shellGap = (size / 2 - baseRadius - 20) / Math.max(1, element.electrons.length);
    
    // Generate nucleus particles
    const nucleusParticles: { x: number, y: number, color: string, speedX: number, speedY: number, baseX: number, baseY: number }[] = [];
    const maxParticlesToDraw = Math.min(element.protons + element.neutrons, 100); // Cap visual particles
    const nucleonsCount = element.protons + element.neutrons;
    const radiusLimit = Math.min(18, 5 + Math.sqrt(nucleonsCount));
    
    for (let i = 0; i < maxParticlesToDraw; i++) {
      const isProton = i < (maxParticlesToDraw * (element.protons / nucleonsCount));
      const r = Math.random() * radiusLimit;
      const theta = Math.random() * 2 * Math.PI;
      nucleusParticles.push({
        baseX: r * Math.cos(theta),
        baseY: r * Math.sin(theta),
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        color: isProton ? '#EF5350' : '#9CA3AF',
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    const color = getCategoryColor(element.category);
    
    const draw = () => {
      time += 0.016; // Approx 60fps
      
      // Clear
      ctx.clearRect(0, 0, size, size);
      
      // Draw Nucleus
      nucleusParticles.forEach(p => {
        p.x = p.baseX + Math.sin(time * 2 + p.speedX * 10) * 1.5;
        p.y = p.baseY + Math.cos(time * 2 + p.speedY * 10) * 1.5;
        
        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY + p.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add subtle glow to protons
        if (p.color === '#EF5350') {
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw Shells and Electrons
      element.electrons.forEach((electronCount, shellIndex) => {
        const shellRadius = baseRadius + (shellIndex + 1) * shellGap;
        
        // Draw shell ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + shellIndex * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw electrons
        const speed = 1 / (shellIndex + 1); // Inner shells faster
        for (let e = 0; e < electronCount; e++) {
          const angle = (e / electronCount) * Math.PI * 2 + time * speed;
          const eX = centerX + Math.cos(angle) * shellRadius;
          const eY = centerY + Math.sin(angle) * shellRadius;
          
          ctx.beginPath();
          ctx.arc(eX, eY, 3, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          
          // Outer glow for electrons
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
          ctx.fill();
          
          // Core bright white dot
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(eX, eY, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [element, size]);

  return (
    <div className="relative flex justify-center items-center">
      <canvas 
        ref={canvasRef} 
        style={{ width: size, height: size }}
        className="pointer-events-none"
      />
    </div>
  );
}
