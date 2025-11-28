import React, { useState } from 'react';
import GreetingCard from './components/GreetingCard';

const App: React.FC = () => {
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const handleReset = () => {
    setIsGameActive(false);
    setIsCardOpen(false);
    setGameResult(null);
  };

  const getFooterMessage = () => {
    if (!isCardOpen) return "Click the card to open";
    if (gameResult) {
       switch (gameResult) {
        case 'yes':
          return "His eyes widen, he jumps, he swirls... He feels touched.\nHe hugs her firmly and smiles.\nAnd allows himself to hope.";
        case 'no':
          return 'He looks down... Then up again. He wants her to know that he understands if she has worries, finds it too early, or has other reasons to say no. After telling her that, he looks at her and asks: "Why not?" with a shy voice.';
        case 'maybe':
          return "His heart makes a hiccup. He looks at her. He wants her to know that he understands if she thinks its too early or has other worries.";
        case 'blushed':
          return "Breath in, breath out. Whatever you decide, I don´t plan to go anywhere. Well, other then Minsk, ) But I understand if you have to think about it and give it time.";
        default:
          return "";
      }
    }
    
    if (isGameActive) return "Can you catch this bunny?)";
    
    return "CLICK ON THE LEFT SIDE OF THE PAGE TO CLOSE";
  };

  const renderFormattedText = () => {
    const text = getFooterMessage();
    // Split by * to find cursive parts
    const parts = text.split('*');
    
    return parts.map((part, index) => {
      // Odd indices are the content that was between * *
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-['Dancing_Script'] text-2xl mx-1 text-amber-100 font-bold">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#660033] flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* --- BORDER BARS (Dark Fir Green) - z-10 --- */}
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 bg-[#0a1f11] z-10 pointer-events-none"></div>
      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-6 bg-[#0a1f11] z-10 pointer-events-none"></div>
      {/* Left Bar */}
      <div className="absolute top-0 left-0 bottom-0 w-4 sm:w-6 bg-[#0a1f11] z-10 pointer-events-none"></div>
      {/* Right Bar */}
      <div className="absolute top-0 right-0 bottom-0 w-4 sm:w-6 bg-[#0a1f11] z-10 pointer-events-none"></div>

      {/* --- CORNER DECORATIONS (z-20) --- */}
      {/* Sits ON TOP of Green Bars (z-10) but UNDER Inner Background Mask (z-30) */}
      
      {/* 1. Top Right - BASE */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-56 sm:h-56 pointer-events-none z-20 -m-6 sm:-m-10">
        <CornerFir />
      </div>

      {/* 2. Bottom Right - Vertical Flip of Top Right (scale-y-[-1]) */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-56 sm:h-56 pointer-events-none z-20 scale-y-[-1] -m-6 sm:-m-10">
        <CornerFir />
      </div>

      {/* 3. Top Left - Horizontal Flip of Top Right (scale-x-[-1]) */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-56 sm:h-56 pointer-events-none z-20 scale-x-[-1] -m-6 sm:-m-10">
        <CornerFir />
      </div>

      {/* 4. Bottom Left - Vertical AND Horizontal Flip (scale-x-[-1] scale-y-[-1]) */}
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-56 sm:h-56 pointer-events-none z-20 scale-x-[-1] scale-y-[-1] -m-6 sm:-m-10">
        <CornerFir />
      </div>

      {/* --- INNER BACKGROUND MASK (z-30) --- */}
      {/* This solid layer covers the center of the screen, effectively acting as "4 squares" that hide the inner parts of the corner images */}
      {/* It is inset by the width of the green bars (4/6) so images are only visible on top of the bars */}
      <div className="absolute top-4 bottom-4 left-4 right-4 sm:top-6 sm:bottom-6 sm:left-6 sm:right-6 bg-[#660033] z-30 pointer-events-none"></div>

      {/* Background ambience - z-40 */}
      {/* Texture sits on top of the mask to blend it all together */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1579762593175-202260549619?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-sm"></div>
      </div>

      {/* --- CELTIC KNOTS (z-50) --- */}
      {/* Sits on top of EVERYTHING (including mask and ambience) to be visible */}
      {/* Moved inwards (top-4/6 etc) to align with the inner corner of the frame */}
      
      {/* Top Left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-24 h-24 sm:w-32 sm:h-32 text-[#0a1f11] z-50 pointer-events-none">
        <WebsiteCornerKnot />
      </div>
      {/* Top Right - Mirrored X */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-24 h-24 sm:w-32 sm:h-32 text-[#0a1f11] z-50 pointer-events-none scale-x-[-1]">
        <WebsiteCornerKnot />
      </div>
      {/* Bottom Right - Mirrored X and Y */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-24 h-24 sm:w-32 sm:h-32 text-[#0a1f11] z-50 pointer-events-none scale-x-[-1] scale-y-[-1]">
        <WebsiteCornerKnot />
      </div>
      {/* Bottom Left - Mirrored Y */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-24 h-24 sm:w-32 sm:h-32 text-[#0a1f11] z-50 pointer-events-none scale-y-[-1]">
        <WebsiteCornerKnot />
      </div>

      {/* --- MAIN CONTENT (z-50) --- */}
      <div className="z-50 relative flex flex-col items-center">
        <GreetingCard 
          onCardOpen={() => setIsCardOpen(true)}
          onGameStart={() => setIsGameActive(true)} 
          onResetGame={handleReset}
          onGameEnd={(result) => setGameResult(result)}
        />
        
        <p className={`mt-4 pb-8 text-white/50 text-sm font-light tracking-widest text-center max-w-xl leading-relaxed transition-all duration-500 whitespace-pre-line
          ${isGameActive ? 'text-amber-200/80 font-bold scale-105' : ''}
          ${gameResult ? 'normal-case tracking-normal text-lg' : 'uppercase'}
        `}>
          {renderFormattedText()}
        </p>

        {/* Subtext when card is open but game hasn't started or ended */}
        {isCardOpen && !isGameActive && !gameResult && (
           <p className="mt-2 text-white/40 text-sm font-light tracking-wide animate-pulse">
             Please press on your answer
           </p>
        )}
      </div>
    </div>
  );
};

// Corner Component using the provided Christmas PNG
const CornerFir: React.FC = () => (
  <div className="w-full h-full">
     <img 
        src="https://raw.githubusercontent.com/BurgundVelvet/ChristmasFir/main/Christmas.PNG"
        alt="Christmas Decoration"
        className="w-full h-full object-contain"
     />
  </div>
);

// New Website Corner Knot Component - Polished, Symmetrical, Stroke-based
const WebsiteCornerKnot: React.FC = () => (
  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-100 overflow-visible">
    {/* Outer L-Curve - Thick (8px) */}
    <path 
      d="M5 95 V 30 C 5 10 10 5 30 5 H 95" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    
    {/* Second L-Curve - Thicker (7px) */}
    <path 
      d="M25 95 V 40 Q 25 25 40 25 H 95" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="round" 
    />

    {/* Third L-Curve - Thinner (6px) - The new one */}
    <path 
      d="M45 95 V 55 Q 45 45 55 45 H 95" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />

    {/* Diagonal Middle Line - Extended to connect to Frame (0,0) and Third Curve */}
    <path 
      d="M0 0 L 60 60" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round"
    />
  </svg>
);

export default App;