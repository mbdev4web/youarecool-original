import React, { useState, useEffect, useRef } from 'react';
import { Rabbit, Check } from 'lucide-react';

interface BunnyCheckboxProps {
  id: string;
  label: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActivePage: boolean;
  onCatch: () => void;
  onRunStart?: () => void;
  gameState: 'playing' | 'won' | 'lost';
}

type Mode = 'static' | 'running' | 'centering' | 'centered' | 'exiting';

const BunnyCheckbox: React.FC<BunnyCheckboxProps> = ({ 
  id, 
  label, 
  containerRef, 
  isActivePage, 
  onCatch,
  onRunStart,
  gameState 
}) => {
  const [mode, setMode] = useState<Mode>('static');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  const requestRef = useRef<number | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLButtonElement>(null);

  // Constants for dimensions
  const BUNNY_WIDTH = 80;
  const BUNNY_HEIGHT = 100;

  // Initialize position from static element if needed
  const initializePosition = () => {
    if (containerRef.current && elementRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elemRect = elementRef.current.getBoundingClientRect();
      return {
        x: elemRect.left - containerRect.left,
        y: elemRect.top - containerRect.top
      };
    }
    return { x: 0, y: 0 };
  };

  // Reset on close
  useEffect(() => {
    if (!isActivePage) {
      setMode('static');
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isActivePage]);

  // Handle Game State Changes
  useEffect(() => {
    if (!isActivePage || !containerRef.current) return;

    if (gameState === 'won' && mode !== 'centering' && mode !== 'centered') {
      // I am the winner
      setMode('centering');
    } else if (gameState === 'lost' && mode !== 'exiting') {
      // I lost, run away!
      if (mode === 'static') {
        // If static, first snap to absolute position then run
        const startPos = initializePosition();
        setPosition(startPos);
      }
      
      // Calculate a vector away from center
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      const centerX = containerW / 2;
      const centerY = containerH / 2;
      
      // If we are exactly at center or unitialized, pick random direction
      const currentX = mode === 'static' ? initializePosition().x : position.x;
      const currentY = mode === 'static' ? initializePosition().y : position.y;

      let dx = currentX + (BUNNY_WIDTH/2) - centerX;
      let dy = currentY + (BUNNY_HEIGHT/2) - centerY;
      
      // Normalize
      const length = Math.sqrt(dx*dx + dy*dy) || 1;
      const speed = 10; // Run fast
      
      velocityRef.current = {
        x: (dx / length) * speed,
        y: (dy / length) * speed
      };
      
      setMode('exiting');
    }
  }, [gameState, isActivePage]);


  const startRunning = (e: React.MouseEvent) => {
    if (containerRef.current && elementRef.current) {
      // 1. Capture current position before switching to absolute
      const startPos = initializePosition();
      setPosition(startPos);
      
      // 2. Set velocity
      velocityRef.current = {
        x: (Math.random() - 0.5) * 8, 
        y: -Math.abs((Math.random() * 5) + 3)
      };
      
      // 3. Switch mode
      setMode('running');
      if (onRunStart) onRunStart();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // CRITICAL FIX: Stop event from bubbling to card container
    e.stopPropagation();

    if (gameState !== 'playing') return;

    if (mode === 'static') {
      startRunning(e);
    } else if (mode === 'running') {
      onCatch();
    }
  };

  // Animation Loop
  const animate = () => {
    if (!containerRef.current) return;

    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;
    
    setPosition(prev => {
      // --- EXITING LOGIC ---
      if (mode === 'exiting') {
        return {
          x: prev.x + velocityRef.current.x,
          y: prev.y + velocityRef.current.y
        };
      }

      // --- CENTERING LOGIC ---
      if (mode === 'centering') {
        const targetX = (containerW / 2) - (BUNNY_WIDTH / 2);
        // Place lower down (center + 120px)
        const targetY = (containerH / 2) - (BUNNY_HEIGHT / 2) + 120;
        
        // Lerp towards center
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          setMode('centered');
          setRotation(0);
          return { x: targetX, y: targetY };
        }

        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1
        };
      }

      // --- RUNNING LOGIC ---
      if (mode === 'running') {
        const SIDE_MARGIN = 10;
        const BOTTOM_MARGIN = 10;
        const TOP_MARGIN = 50; // Extra space for the text label above head

        let newX = prev.x + velocityRef.current.x;
        let newY = prev.y + velocityRef.current.y;
        
        let hitWall = false;

        // X Boundaries
        if (newX <= SIDE_MARGIN) {
          newX = SIDE_MARGIN;
          velocityRef.current.x = Math.abs(velocityRef.current.x);
          hitWall = true;
        } else if (newX >= containerW - BUNNY_WIDTH - SIDE_MARGIN) {
          newX = containerW - BUNNY_WIDTH - SIDE_MARGIN;
          velocityRef.current.x = -Math.abs(velocityRef.current.x);
          hitWall = true;
        }

        // Y Boundaries
        if (newY <= TOP_MARGIN) {
          newY = TOP_MARGIN;
          velocityRef.current.y = Math.abs(velocityRef.current.y);
          hitWall = true;
        } else if (newY >= containerH - BUNNY_HEIGHT - BOTTOM_MARGIN) {
          newY = containerH - BUNNY_HEIGHT - BOTTOM_MARGIN;
          velocityRef.current.y = -Math.abs(velocityRef.current.y);
          hitWall = true;
        }

        if (hitWall) {
           velocityRef.current.x += (Math.random() - 0.5) * 2;
           velocityRef.current.y += (Math.random() - 0.5) * 2;
           
           const maxSpeed = 7;
           velocityRef.current.x = Math.max(Math.min(velocityRef.current.x, maxSpeed), -maxSpeed);
           velocityRef.current.y = Math.max(Math.min(velocityRef.current.y, maxSpeed), -maxSpeed);
        }

        // Flip rotation based on direction
        const targetRotation = velocityRef.current.x < 0 ? 10 : -10;
        setRotation(r => r + (targetRotation - r) * 0.1);

        return { x: newX, y: newY };
      }

      return prev;
    });

    if (mode !== 'centered') {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (mode !== 'static' && mode !== 'centered') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mode]);

  const isStatic = mode === 'static';
  const isBoxVisible = isStatic || mode === 'centered';
  const isBunnyVisible = mode === 'running' || mode === 'exiting' || mode === 'centering';
  const showCheckmark = mode === 'centered';

  return (
    <>
      {/* Placeholder to reserve space in the layout when the real element goes absolute */}
      {!isStatic && (
        <div 
          className="flex flex-col items-center gap-2 w-20 h-24 flex-shrink-0 opacity-0 pointer-events-none" 
          aria-hidden="true" 
        />
      )}
      
      <button
        ref={elementRef}
        onClick={handleClick}
        style={!isStatic ? { 
          left: position.x, 
          top: position.y, 
          width: BUNNY_WIDTH,
          zIndex: mode === 'centered' ? 100 : 50
        } : { 
          width: BUNNY_WIDTH,
          zIndex: 10
        }}
        className={`
          flex flex-col items-center justify-center
          outline-none group select-none
          ${isStatic ? 'relative' : 'absolute'}
        `}
      >
        {/* TEXT LABEL */}
        <div 
            className="absolute transition-all duration-500 ease-in-out font-['Dancing_Script'] font-bold text-stone-900 whitespace-nowrap drop-shadow-sm select-none"
            style={{
                fontSize: isBoxVisible ? '1.5rem' : '1.125rem',
                transform: isBoxVisible 
                    ? 'translateY(40px)'  // Below box (further down)
                    : 'translateY(-36px)' // Above bunny head
            }}
        >
            {label}
        </div>

        {/* CENTRAL GRAPHIC CONTAINER */}
        <div className="relative w-16 h-16 flex items-center justify-center">
            
            {/* 1. THE BUNNY */}
            <div 
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out origin-bottom"
                style={{
                    opacity: isBunnyVisible ? 1 : 0, 
                    transform: `
                        scale(${isBunnyVisible ? 1 : 0.5}) 
                        rotate(${isBunnyVisible ? rotation : 0}deg) 
                        scaleX(${velocityRef.current.x > 0 ? -1 : 1})
                    `
                }}
            >
                <div className="relative pt-2">
                    <Rabbit className="w-14 h-14 text-stone-700 fill-[#e6dcc3]" strokeWidth={1.5} />
                    {/* Tiny box held by bunny */}
                    <div className="absolute top-8 left-4 w-5 h-5 border border-stone-800 bg-white rotate-12 rounded-sm shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full border border-stone-300"></div>
                    </div>
                </div>
            </div>

            {/* 2. THE CHECKBOX */}
            <div 
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out"
                style={{
                    opacity: isBoxVisible ? 1 : 0,
                    transform: isBoxVisible ? 'scale(1)' : 'scale(0.5) translateY(20px)'
                }}
            >
                 <div 
                    className={`
                        w-8 h-8 border-2 border-stone-800 bg-[#e6dac3] rounded-sm flex items-center justify-center shadow-sm
                        transition-colors duration-300
                        ${showCheckmark ? 'bg-stone-800 border-stone-800 scale-125' : 'group-hover:border-stone-500'}
                    `}
                >
                    <Check 
                        className={`w-6 h-6 text-white transition-all duration-300 ${showCheckmark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                        strokeWidth={3} 
                    />
                </div>
            </div>

        </div>
      </button>
    </>
  );
};

export default BunnyCheckbox;