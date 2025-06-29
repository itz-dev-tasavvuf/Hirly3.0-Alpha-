import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({ intensity = 'medium', theme = 'purple' }) => {
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Theme configurations
  const themes = {
    purple: {
      colors: ['#8b5cf6', '#a855f7', '#c084fc', '#e879f9', '#f0abfc'],
      gradient: 'from-purple-900/20 via-blue-900/20 to-pink-900/20'
    },
    blue: {
      colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4', '#0ea5e9'],
      gradient: 'from-blue-900/20 via-indigo-900/20 to-cyan-900/20'
    },
    green: {
      colors: ['#10b981', '#059669', '#06d6a0', '#20e3b2', '#9dffd7'],
      gradient: 'from-emerald-900/20 via-teal-900/20 to-green-900/20'
    }
  };

  const currentTheme = themes[theme] || themes.purple;

  // Detect mobile for performance optimizations
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  }, []);

  // Particle count based on intensity and device capability
  const particleCount = useMemo(() => {
    if (isMobile) {
      // Significantly reduce particles on mobile
      switch (intensity) {
        case 'low': return 5;
        case 'medium': return 8;
        case 'high': return 12;
        default: return 8;
      }
    } else {
      // Full particles on desktop
      switch (intensity) {
        case 'low': return 15;
        case 'medium': return 25;
        case 'high': return 35;
        default: return 25;
      }
    }
  }, [intensity, isMobile]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 3 + 2,
      color: currentTheme.colors[Math.floor(Math.random() * currentTheme.colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3
      },
      opacity: Math.random() * 0.4 + 0.2
    }));

    setParticles(newParticles);
  }, [dimensions, particleCount, theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-50`} />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity
          }}
          animate={{
            x: isMobile ? [
              particle.x,
              particle.x + particle.velocity.x * 100,
              particle.x
            ] : [
              particle.x,
              particle.x + particle.velocity.x * 200,
              particle.x + particle.velocity.x * 400,
              particle.x
            ],
            y: isMobile ? [
              particle.y,
              particle.y + particle.velocity.y * 100,
              particle.y
            ] : [
              particle.y,
              particle.y + particle.velocity.y * 200,
              particle.y + particle.velocity.y * 400,
              particle.y
            ],
            opacity: isMobile ? particle.opacity : [
              particle.opacity,
              particle.opacity * 0.5,
              particle.opacity * 0.8,
              particle.opacity
            ]
          }}
          transition={{
            duration: isMobile ? 15 : 25 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
            times: isMobile ? [0, 0.5, 1] : [0, 0.33, 0.66, 1]
          }}
        />
      ))}

      {/* Connecting lines between nearby particles - disabled on mobile for performance */}
      {!isMobile && (
        <svg className="absolute inset-0 w-full h-full">
          {particles.map((particle, i) =>
            particles.slice(i + 1).map((otherParticle, j) => {
              const distance = Math.sqrt(
                Math.pow(particle.x - otherParticle.x, 2) +
                Math.pow(particle.y - otherParticle.y, 2)
              );
              
              if (distance < 120) {
                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={particle.x}
                    y1={particle.y}
                    x2={otherParticle.x}
                    y2={otherParticle.y}
                    stroke={particle.color}
                    strokeWidth="0.5"
                    opacity={Math.max(0, 0.2 - distance / 600)}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                );
              }
              return null;
            })
          )}
        </svg>
      )}
    </div>
  );
};

export default ParticleBackground;
