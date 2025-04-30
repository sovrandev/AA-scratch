import React, { useEffect, useRef, memo } from 'react';

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay, distanceRatio) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 1;
    this.sizeStep = Math.random() * 1.2; // Increased from 0.8
    this.minSize = 2; // Increased from 1.0
    this.maxSizeInteger = 4; // Increased from 4
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
    this.distanceRatio = distanceRatio; // Value between 0-1 based on distance from center
    this.opacity = Math.max(0, 0.95 - this.distanceRatio * 1.0); // Increased opacity
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
    this.ctx.globalAlpha = 1;
  }

  appear() {
    // Skip drawing if opacity is too low (optimization)
    if (this.opacity < 0.05) return;
    
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

const PixelCanvas = memo(({ gap = 6, speed = 20 }) => {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  
  // Use blue color scheme
  const colors = ['#5D9DFE', '#3584fc'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Define createPixels first, before it's called
    const createPixels = () => {
      pixelsRef.current = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      
      // Create a radial distribution of pixels
      for (let x = 0; x < canvas.width; x += gap) {
        for (let y = 0; y < canvas.height; y += gap) {
          // Calculate distance from center
          const distX = x - centerX;
          const distY = y - centerY;
          const distance = Math.sqrt(distX * distX + distY * distY);
          const distanceRatio = distance / maxDistance;
          
          // Random chance to skip pixels based on distance from center
          // More likely to skip as we get further from center
          if (Math.random() < distanceRatio * 1.15) continue;
          
          const color = colors[Math.floor(Math.random() * colors.length)];
          const delay = distance * 0.5; // Delay based on distance from center
          
          pixelsRef.current.push(
            new Pixel(canvas, ctx, x, y, color, speed * 0.001, delay, distanceRatio)
          );
        }
      }
    };
    
    // Now define resizeCanvas after createPixels is defined
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      createPixels();
    };

    // Now we can safely call resizeCanvas
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixelsRef.current.forEach(pixel => pixel.appear());
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const observer = new ResizeObserver(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeCanvas();
      animate();
    });
    observer.observe(canvas.parentElement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
    };
  }, [gap, speed, colors]); // Rerun if gap or speed change

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 1,
        pointerEvents: 'none',
      }}
    />
  );
});

export default PixelCanvas; 