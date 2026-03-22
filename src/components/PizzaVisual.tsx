
import React from 'react';

const PizzaVisual = ({ id }: { id: string }) => {
  const isCalzone = id === '42';
  
  // Base colors
  const crustColor = "#D2B48C";
  const tomatoSauce = "#C62828";
  const creamSauce = "#FFF9C4";
  const cheeseColor = "#FFFDE7";
  
  const getSauceColor = (id: string) => {
    const whiteBase = ['4', '7', '14', '15', '16', '17', '19', '27', '32', '35', '39'];
    return whiteBase.includes(id) ? creamSauce : tomatoSauce;
  };

  const renderToppings = (id: string) => {
    switch (id) {
      case '9': // Margarita
        return (
          <>
            <circle cx="50" cy="30" r="2" fill="#212121" />
            <circle cx="70" cy="60" r="2" fill="#212121" />
            <circle cx="35" cy="65" r="2" fill="#212121" />
          </>
        );
      case '11': // Reine
        return (
          <>
            <rect x="30" y="30" width="8" height="8" fill="#F48FB1" rx="2" />
            <rect x="60" y="40" width="8" height="8" fill="#F48FB1" rx="2" />
            <rect x="45" y="65" width="8" height="8" fill="#F48FB1" rx="2" />
            <circle cx="40" cy="45" r="5" fill="#BCAAA4" />
            <circle cx="65" cy="25" r="5" fill="#BCAAA4" />
          </>
        );
      case '1': // 4 Fromages
        return (
          <>
            <circle cx="42" cy="38" r="10" fill="#E1F5FE" opacity="0.6" />
            <circle cx="62" cy="52" r="8" fill="#FFF59D" opacity="0.8" />
            <circle cx="38" cy="62" r="7" fill="#81C784" opacity="0.4" />
            <circle cx="55" cy="42" r="9" fill="#FFFDE7" opacity="0.5" />
          </>
        );
      case '18': // Végétarienne
        return (
          <>
            <circle cx="50" cy="50" r="30" stroke="#4CAF50" strokeWidth="2" strokeDasharray="8 4" fill="none" />
            <circle cx="40" cy="30" r="6" fill="#F5F5F5" opacity="0.6" stroke="#E0E0E0" />
            <rect x="65" y="40" width="12" height="3" fill="#E53935" transform="rotate(45 65 40)" />
          </>
        );
      case '25': // La Pallice
        return (
          <>
            <rect x="30" y="35" width="10" height="10" fill="#F48FB1" rx="2" />
            <circle cx="60" cy="35" r="7" fill="#BCAAA4" />
            <circle cx="45" cy="60" r="8" fill="#FFFDE7" stroke="#E0E0E0" />
            <rect x="65" y="55" width="6" height="6" fill="#5D4037" rx="1" />
          </>
        );
      case '8': // Orientale
         return (
           <>
            <rect x="35" y="35" width="12" height="4" fill="#8D6E63" rx="2" />
            <rect x="60" y="60" width="12" height="4" fill="#8D6E63" rx="2" />
            <circle cx="50" cy="50" r="10" fill="white" />
            <circle cx="50" cy="50" r="4" fill="#FFD600" />
           </>
         );
      default:
        return (
          <>
            <circle cx="35" cy="35" r="5" fill="#FF5252" opacity="0.6" />
            <circle cx="65" cy="30" r="4" fill="#FF5252" opacity="0.6" />
            <circle cx="52" cy="62" r="6" fill="#FF5252" opacity="0.6" />
          </>
        );
    }
  };

  if (isCalzone) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <path d="M10,50 A40,40 0 0,1 90,50 L10,50 Z" fill={crustColor} />
        <path d="M15,50 A35,35 0 0,1 85,50 L15,50 Z" fill={tomatoSauce} opacity="0.3" />
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#A1887F" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      <circle cx="50" cy="50" r="48" fill={crustColor} />
      <circle cx="50" cy="50" r="40" fill={getSauceColor(id)} />
      <circle cx="50" cy="50" r="38" fill={cheeseColor} opacity="0.8" />
      {renderToppings(id)}
    </svg>
  );
};

export default PizzaVisual;
