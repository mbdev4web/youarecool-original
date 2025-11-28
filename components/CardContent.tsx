import React, { useRef, useState, useEffect } from 'react';
import BunnyCheckbox from './BunnyCheckbox';

// --- CONFIGURATION START ---
// Replace the URLs below with your own image links!
const IMAGE_CONFIG = {
  // Images that appear centered when you catch the bunny (Win state)
  results: {
    yes: 'https://raw.githubusercontent.com/BurgundVelvet/Yes/main/Yes.PNG',
    no: 'https://raw.githubusercontent.com/BurgundVelvet/No/main/No.PNG',     // Sad/Snowy
    maybe: 'https://raw.githubusercontent.com/BurgundVelvet/Maybe/main/Maybe.PNG',  // Thoughtful
    blushed: 'https://raw.githubusercontent.com/BurgundVelvet/Blushed/main/Blushed.PNG' // Shy (User Custom)
  },
  // Decorative images
  decorations: {
    sidePattern: 'https://images.unsplash.com/photo-1607597561332-68b2488bd732?auto=format&fit=crop&w=200&q=80',
    him: 'https://raw.githubusercontent.com/BurgundVelvet/Him/main/Him.PNG',
    her: 'https://raw.githubusercontent.com/BurgundVelvet/Her/main/Her.PNG'
  }
};
// --- CONFIGURATION END ---

interface CardContentProps {
  isActive: boolean;
  onGameStart?: () => void;
  onGameEnd?: (result: string) => void;
}

const CardContent: React.FC<CardContentProps> = ({ isActive, onGameStart, onGameEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  // Reset when card closes
  useEffect(() => {
    if (!isActive) {
      setWinnerId(null);
    }
  }, [isActive]);

  const handleCatch = (id: string) => {
    setWinnerId(id);
    if (onGameEnd) {
      onGameEnd(id);
    }
  };

  const getResultImage = () => {
    if (!winnerId) return '';
    // Type-safe access to the config
    const key = winnerId as keyof typeof IMAGE_CONFIG.results;
    return IMAGE_CONFIG.results[key] || '';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full p-6 sm:p-8 flex flex-col items-center overflow-hidden"
    >
      {/* Decorative Side Images - Disappear when game is won */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 left-0 w-8 h-32 bg-cover opacity-60 transition-opacity duration-500 ${winnerId ? 'opacity-0' : 'opacity-60'}`}
        style={{ backgroundImage: `url('${IMAGE_CONFIG.decorations.sidePattern}')` }}
      ></div>
      <div 
        className={`absolute top-1/2 -translate-y-1/2 right-0 w-8 h-32 bg-cover scale-x-[-1] opacity-60 transition-opacity duration-500 ${winnerId ? 'opacity-0' : 'opacity-60'}`}
        style={{ backgroundImage: `url('${IMAGE_CONFIG.decorations.sidePattern}')` }}
      ></div>

      {/* Him & Her Decorative Images Container - Aligned by bottom */}
      <div className={`absolute top-1/2 left-0 w-full px-6 flex justify-between items-end -translate-y-1/2 pointer-events-none z-0`}>
          {/* "Him" Image - Left side */}
          <img 
            src={IMAGE_CONFIG.decorations.him} 
            alt="" 
            className={`h-24 sm:h-32 w-auto object-contain transition-all duration-500 
              ${winnerId ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}
            `}
          />

          {/* "Her" Image - Right side */}
          <img 
            src={IMAGE_CONFIG.decorations.her} 
            alt="" 
            className={`h-20 sm:h-28 w-auto object-contain transition-all duration-500 
              ${winnerId ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}
            `}
          />
      </div>

      {/* Main Question Text - Fades out on win */}
      <div className={`mt-8 text-center z-0 w-full transition-all duration-700 absolute top-8 px-6 ${winnerId ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <h2 className="font-['Great_Vibes'] text-4xl sm:text-5xl text-stone-900 leading-tight">
          Would you want me to visit you in Minsk this December?
        </h2>
        <div className="w-32 h-0.5 bg-stone-800/20 mx-auto mt-6"></div>
      </div>

      {/* Result Image - Appears centered above the box (replacing text area) */}
      <div className={`absolute top-16 left-0 right-0 mx-auto z-0 transition-all duration-700 ease-out 
        ${winnerId ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
        ${winnerId === 'blushed' ? 'w-56 h-56 sm:w-80 sm:h-80' : 'w-48 h-48 sm:w-64 sm:h-64'}
      `}>
        {winnerId && (
          <div className="relative w-full h-full border-4 border-black">
             <img 
               src={getResultImage()} 
               alt="Result" 
               className={`w-full h-full ${winnerId === 'no' ? 'object-contain object-bottom' : 'object-cover'}`}
             />
          </div>
        )}
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-grow"></div>

      {/* Checkbox Area */}
      <div className="w-full pb-8 z-10 px-4">
        <div className="grid grid-cols-3 gap-2 w-full">
            {/* Column 1: Yes */}
            <div className="flex justify-center items-start">
                 <BunnyCheckbox 
                    id="yes" 
                    label="Yes" 
                    containerRef={containerRef} 
                    isActivePage={isActive}
                    onCatch={() => handleCatch('yes')}
                    onRunStart={onGameStart}
                    gameState={winnerId === 'yes' ? 'won' : winnerId ? 'lost' : 'playing'}
                  />
            </div>
            
            {/* Column 2: No and Blushed */}
            <div className="flex flex-col items-center gap-12">
                 <BunnyCheckbox 
                    id="no" 
                    label="No" 
                    containerRef={containerRef} 
                    isActivePage={isActive}
                    onCatch={() => handleCatch('no')}
                    onRunStart={onGameStart}
                    gameState={winnerId === 'no' ? 'won' : winnerId ? 'lost' : 'playing'}
                  />
                   <BunnyCheckbox 
                    id="blushed" 
                    label="Blushed" 
                    containerRef={containerRef} 
                    isActivePage={isActive}
                    onCatch={() => handleCatch('blushed')}
                    onRunStart={onGameStart}
                    gameState={winnerId === 'blushed' ? 'won' : winnerId ? 'lost' : 'playing'}
                  />
            </div>

            {/* Column 3: Maybe */}
             <div className="flex justify-center items-start">
                 <BunnyCheckbox 
                    id="maybe" 
                    label="Maybe" 
                    containerRef={containerRef} 
                    isActivePage={isActive}
                    onCatch={() => handleCatch('maybe')}
                    onRunStart={onGameStart}
                    gameState={winnerId === 'maybe' ? 'won' : winnerId ? 'lost' : 'playing'}
                  />
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-4 opacity-30 text-[10px] font-sans text-stone-500 pointer-events-none">
        ❤️
      </div>
    </div>
  );
};

export default CardContent;