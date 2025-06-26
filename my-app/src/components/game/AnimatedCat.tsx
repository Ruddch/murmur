"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AnimatedCatProps {
  onClick: () => void;
  disabled?: boolean;
  isSessionValid?: boolean;
  isClicking?: boolean;
}

export function AnimatedCat({ onClick, disabled = false, isSessionValid = false, isClicking = false }: AnimatedCatProps) {
  const [showLoadingCat, setShowLoadingCat] = useState(false);

  // Effect for smooth transition between images
  useEffect(() => {
    if (isClicking) {
      // Small delay before showing loading cat
      const timer = setTimeout(() => {
        setShowLoadingCat(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Immediately show regular cat when transaction is completed
      setShowLoadingCat(false);
    }
  }, [isClicking]);

  const handleClick = () => {
    if (disabled || isClicking) return;
    
    // Call the click function
    onClick();
  };

  // Choose image based on state
  const catImageSrc = showLoadingCat ? "/cit1.gif" : "/cit.gif";

  return (
    <div className="flex justify-center">
      <div
        onClick={handleClick}
        className={`relative cursor-pointer transition-all duration-200 ${
          disabled 
            ? 'cursor-not-allowed' 
            : 'hover:scale-110 active:scale-95'
        }`}
      >
        <div className={`rounded-full border-4 transition-all duration-500 ease-in-out overflow-hidden h-32 relative ${
          isSessionValid 
            ? 'border-green-400 shadow-lg shadow-green-400/30' 
            : 'border-blue-400 shadow-lg shadow-blue-400/30'
        }`}>
          <Image
            src={catImageSrc}
            alt="Animated Mur Mur"
            width={120}
            height={120}
            unoptimized
            className={`rounded-full transition-all duration-500 ease-in-out translate-y-0 cat-image-transition ${
              isClicking ? 'translate-y-10' : 'translate-y-0'
            }`}
          />
          
          {/* Прямоугольник с цветом как на картинке */}
          <div className={`absolute bottom-0 left-0 w-full z-10 ${
            isClicking ? 'h-[32%]' : 'h-0'
          }`} style={{
            background: '#111410',
            transition: isClicking ? 'none' : 'all 500ms ease-in-out',
            transitionDelay: isClicking ? '0ms' : '500ms'
          }}></div>
        </div>
      </div>
    </div>
  );
} 