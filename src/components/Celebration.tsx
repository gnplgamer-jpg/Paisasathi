import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  show: boolean;
  onClose: () => void;
}

export function Celebration({ show, onClose }: CelebrationProps) {
  useEffect(() => {
    if (show) {
      // Trigger confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-bg-surface border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background rays */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(234,179,8,0.2)_360deg)] rounded-full"
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/40"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-text-main mb-2">Goal Achieved!</h2>
              <p className="text-text-muted text-sm mb-6">
                Congratulations! You have successfully reached your Gold Savings target. Consistency pays off!
              </p>
              
              <button 
                onClick={onClose}
                className="w-full py-3 bg-bg-base border border-border-subtle rounded-xl font-bold text-text-main hover:bg-bg-surface-hover transition-colors"
              >
                Keep Saving
              </button>
            </div>
            
            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0.5, 1.5, 0.5],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200
                }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 text-yellow-400"
              >
                <Star className="w-4 h-4 fill-current" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
