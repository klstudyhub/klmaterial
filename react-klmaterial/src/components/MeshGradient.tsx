import { useEffect, useRef } from 'react';
import './MeshGradient.css';

const MeshGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create gradient stops
    const createGradient = (time: number) => {
      const { x, y } = mouseRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Mouse influence
      const mouseInfluence = 0.3;
      const mx = x || width / 2;
      const my = y || height / 2;

      // Create multiple overlapping gradients
      const gradient1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(time * 0.001) * 100 + (mx - width / 2) * mouseInfluence,
        height * 0.3 + Math.cos(time * 0.0015) * 100 + (my - height / 2) * mouseInfluence,
        0,
        width * 0.2 + Math.sin(time * 0.001) * 100,
        height * 0.3 + Math.cos(time * 0.0015) * 100,
        width * 0.6
      );
      gradient1.addColorStop(0, `hsla(${190 + Math.sin(time * 0.001) * 20}, 100%, 50%, 0.3)`);
      gradient1.addColorStop(1, 'transparent');

      const gradient2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.0012) * 150 - (mx - width / 2) * mouseInfluence,
        height * 0.7 + Math.sin(time * 0.0018) * 120 - (my - height / 2) * mouseInfluence,
        0,
        width * 0.8 + Math.cos(time * 0.0012) * 150,
        height * 0.7 + Math.sin(time * 0.0018) * 120,
        width * 0.5
      );
      gradient2.addColorStop(0, `hsla(${210 + Math.cos(time * 0.0012) * 20}, 100%, 40%, 0.25)`);
      gradient2.addColorStop(1, 'transparent');

      const gradient3 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.0015) * 120 + (mx - width / 2) * mouseInfluence * 0.5,
        height * 0.5 + Math.cos(time * 0.001) * 80 + (my - height / 2) * mouseInfluence * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.4
      );
      gradient3.addColorStop(0, `hsla(${180 + Math.sin(time * 0.0015) * 30}, 100%, 60%, 0.2)`);
      gradient3.addColorStop(1, 'transparent');

      return [gradient1, gradient2, gradient3];
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 16;
      
      // Base gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#000814');
      bgGradient.addColorStop(0.5, '#001d3d');
      bgGradient.addColorStop(1, '#003566');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply mesh gradients
      const gradients = createGradient(timeRef.current);
      gradients.forEach((gradient) => {
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Add subtle noise texture
      if (timeRef.current % 60 < 30) {
        ctx.globalAlpha = 0.02;
        ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="mesh-gradient" />;
};

export default MeshGradient;
