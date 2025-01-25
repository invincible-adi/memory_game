import React from 'react';

const Card = ({ card, onClick }) => {
  return (
    <button
      className={`w-20 h-20 md:w-20 md:h-20 text-2xl md:text-3xl flex justify-center items-center bg-black border-2 border-gray-400 rounded-lg cursor-pointer transform transition-transform duration-500 ease-in-out ${
        card.flipped ? 'bg-black rotate-y-180' : 'bg-neutral-700'
      }`}
      onClick={!card.flipped && !card.matched ? onClick : undefined}
    >
      {card.flipped || card.matched ? card.icon : '❓'}
    </button>
  );
};

export default Card;
