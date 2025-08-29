import React from 'react';

// Using inline styles for simplicity, but could be moved to a CSS file.
const flowerStyles = `
  .flower-container {
    position: relative;
    width: 192px; /* 48 * 4 */
    height: 192px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .petal {
    position: absolute;
    width: 40px;
    height: 70px;
    background: linear-gradient(to bottom, #c80ec9, #b425aa);
    border-radius: 20px 20px 0 0;
    transform-origin: bottom center;
    transition: transform 5s cubic-bezier(0.4, 0, 0.6, 1);
  }
`;

interface BreathingFlowerProps {
  phase: 'inhale' | 'exhale';
}

export const BreathingFlower: React.FC<BreathingFlowerProps> = ({ phase }) => {
  const isBlooming = phase === 'inhale';

  return (
    <>
      <style>{flowerStyles}</style>
      <div className="flower-container">
        <div 
          className="absolute w-16 h-16 bg-secondary/50 rounded-full transition-transform duration-[5000ms] ease-in-out"
          style={{ transform: isBlooming ? 'scale(1.1)' : 'scale(0.9)'}}
        />
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <div
            key={deg}
            className="petal"
            style={{
              transform: `rotate(${deg}deg) translateY(${isBlooming ? '-20px' : '-10px'}) scale(${isBlooming ? 1 : 0.8})`,
            }}
          />
        ))}
         <div className="absolute w-12 h-12 bg-secondary rounded-full z-10" />
      </div>
    </>
  );
};
