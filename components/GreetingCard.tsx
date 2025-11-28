import React, { useState, useEffect } from 'react';
import CardContent from './CardContent';

// --- CONFIGURATION START ---
// Replace the URLs below with your own image links!
const CARD_IMAGES = {
  treeFox: 'https://raw.githubusercontent.com/BurgundVelvet/TreeFox/main/TreeFox.PNG',
  fox: 'https://raw.githubusercontent.com/BurgundVelvet/Fox/main/Fox.PNG',
  frontCover: 'https://raw.githubusercontent.com/BurgundVelvet/FrontPage/main/FrontPage.JPG'
};
// --- CONFIGURATION END ---

interface GreetingCardProps {
  onGameStart?: () => void;
  onResetGame?: () => void;
  onGameEnd?: (result: string) => void;
  onCardOpen?: () => void;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ 
  onGameStart, 
  onResetGame, 
  onGameEnd, 
  onCardOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Sync state with parent
  useEffect(() => {
    if (isOpen) {
      if (onCardOpen) onCardOpen();
    } else {
      if (onResetGame) onResetGame();
    }
  }, [isOpen, onResetGame, onCardOpen]);

  return (
    <div className="relative w-[340px] h-[480px] sm:w-[420px] sm:h-[600px] perspective-1000 group">
      {/* The Card Container - Rotates the entire spine structure */}
      <div
        className={`relative w-full h-full duration-1000 transform-style-3d ${
          isOpen ? 'translate-x-[50%]' : ''
        }`}
      >
        {/* Front Cover & Inside Left Wrapper - This part rotates and handles the Open/Close click */}
        <div
          className={`absolute top-0 left-0 w-full h-full transform-style-3d origin-left duration-1000 ease-in-out z-20 cursor-pointer ${
            isOpen ? 'rotate-y-180' : ''
          }`}
          onClick={toggleOpen}
        >
          {/* Front Cover */}
          {/* We translate Z by 1px to ensure it physically sits 'above' the inside left page to prevent bleed-through */}
          <div 
            className="absolute inset-0 backface-hidden paper-texture rounded-r-lg rounded-l-md border-r-2 border-stone-300 shadow-xl flex flex-col items-center justify-center p-8 text-center overflow-hidden z-20"
            style={{ transform: 'translateZ(1px)' }}
          >
             {/* Cover Image */}
             <div className="absolute inset-0 z-0">
               <img 
                 src={CARD_IMAGES.frontCover} 
                 alt="Cover" 
                 className="w-full h-full object-cover"
               />
             </div>

             {/* Realistic paper overlay effects */}
             <div className="absolute inset-0 bg-stone-100/30 mix-blend-multiply pointer-events-none rounded-r-lg rounded-l-md z-10"></div>
             
             {/* Content Container - Increased Z-Index to 40 to sit above all overlays */}
             <div className={`relative w-full h-full flex flex-col items-center justify-center gap-6 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-0 delay-200' : 'opacity-100'}`}>
                <h1 className="font-['Great_Vibes'] text-7xl text-[#0a1f11] text-center drop-shadow-md bg-green-100/40 px-4 py-2 rounded-lg">For You</h1>
                <p className="font-['Dancing_Script'] text-2xl text-[#0f2e1b] text-center mt-2 drop-shadow-sm font-bold bg-green-100/40 px-2 rounded">A Question Inside...</p>
             </div>
             
             {/* Realistic fold shadow overlay */}
             <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-30"></div>
             {/* Edge highlight */}
             <div className="absolute inset-0 rounded-r-lg rounded-l-md ring-1 ring-inset ring-white/40 pointer-events-none z-30"></div>
          </div>

          {/* Inside Left (Back of front cover) */}
          <div className="absolute inset-0 rotate-y-180 paper-texture rounded-l-lg border-l-2 border-stone-200 shadow-md p-8 flex flex-col items-center justify-center z-10">
             {/* Realistic paper overlay effects */}
             <div className="absolute inset-0 bg-stone-100/30 mix-blend-multiply pointer-events-none rounded-l-lg"></div>

             {/* Decorative Black Frame - Thicker (border-2) */}
             <div className="absolute inset-8 border-2 border-black z-20 pointer-events-none opacity-80"></div>

             {/* Golden Ornaments on Corners (z-20 to be under images) */}
             {/* Top Left */}
             <div className="absolute top-8 left-8 z-20 w-16 h-16 text-amber-600 pointer-events-none">
                <CornerOrnament />
             </div>
             {/* Top Right */}
             <div className="absolute top-8 right-8 z-20 w-16 h-16 text-amber-600 pointer-events-none rotate-90">
                <CornerOrnament />
             </div>
             {/* Bottom Right */}
             <div className="absolute bottom-8 right-8 z-20 w-16 h-16 text-amber-600 pointer-events-none rotate-180">
                <CornerOrnament />
             </div>
             {/* Bottom Left */}
             <div className="absolute bottom-8 left-8 z-20 w-16 h-16 text-amber-600 pointer-events-none -rotate-90">
                <CornerOrnament />
             </div>

             {/* Poem Text - Centered - INCREASED SIZE HERE */}
             <div className="relative z-40 text-center transform -rotate-2 mix-blend-multiply opacity-90">
                <p className="font-['Dancing_Script'] text-2xl sm:text-3xl text-[#2c1810] leading-loose whitespace-pre-line font-bold">
                  Two foxes at night<br/>
                  Autumn stirs their gentle hearts<br/>
                  Winter scents...touch bright?
                </p>
             </div>

             {/* Tree Fox Image - Top Left */}
             <div className="absolute top-8 left-8 z-30 w-56 sm:w-72 h-auto pointer-events-none">
               <img 
                 src={CARD_IMAGES.treeFox}
                 alt="Tree Fox" 
                 className="w-full h-full object-contain" 
               />
             </div>

             {/* Fox Image - Bottom Right */}
             <div className="absolute bottom-8 right-8 z-30 w-56 sm:w-72 h-auto pointer-events-none">
               <img 
                 src={CARD_IMAGES.fox}
                 alt="Fox" 
                 className="w-full h-full object-contain" 
               />
             </div>
             
             {/* Fold shadow */}
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 via-black/5 to-transparent pointer-events-none z-0"></div>
          </div>
        </div>

        {/* Inside Right (Static Base) - No Click Handler for Closing */}
        <div className={`absolute top-0 left-0 w-full h-full paper-texture rounded-r-lg shadow-2xl z-10 flex flex-col cursor-default ${isOpen ? '' : '-z-10'}`}>
           {/* Realistic paper overlay effects */}
           <div className="absolute inset-0 bg-stone-100/30 mix-blend-multiply pointer-events-none rounded-r-lg"></div>
           
           {/* Fold shadow on the spine */}
           <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none z-20"></div>
           
           {/* Interactive Content */}
           <CardContent isActive={isOpen} onGameStart={onGameStart} onGameEnd={onGameEnd} />
        </div>
      </div>
    </div>
  );
};

// Complex Nordic/Celtic Style Corner Ornament
const CornerOrnament = () => (
  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm opacity-90">
    {/* Main Outer Structure - Stylized L Shape */}
    <path 
      d="M2 98 V 30 C 2 12 12 2 30 2 H 98" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    
    {/* Inner Parallel Line - Creates the double-line effect */}
    <path 
      d="M10 98 V 35 C 10 20 20 10 35 10 H 98" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
    />

    {/* Nordic Scroll - Horizontal Arm */}
    <path 
      d="M35 18 C 50 18 60 25 75 25 C 85 25 90 20 90 15" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    
    {/* Nordic Scroll - Vertical Arm */}
    <path 
      d="M18 35 C 18 50 25 60 25 75 C 25 85 20 90 15 90" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />

    {/* Diagonal Decorative Leaf/Knot Center */}
    <path 
      d="M2 2 L 25 25" 
      stroke="currentColor" 
      strokeWidth="1" 
    />
    
    {/* Center Gem/Dot */}
    <circle cx="28" cy="28" r="3" fill="currentColor" />
    
    {/* Decorative Terminal Dots */}
    <circle cx="98" cy="2" r="2" fill="currentColor" />
    <circle cx="2" cy="98" r="2" fill="currentColor" />
    <circle cx="90" cy="15" r="1.5" fill="currentColor" />
    <circle cx="15" cy="90" r="1.5" fill="currentColor" />
    
    {/* Small accents */}
    <circle cx="5" cy="50" r="1" fill="currentColor" />
    <circle cx="50" cy="5" r="1" fill="currentColor" />
  </svg>
);

export default GreetingCard;