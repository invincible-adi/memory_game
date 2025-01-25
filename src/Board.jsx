import React, { useState, useEffect } from 'react';
import Card from './Card';

const generateCards = () => {
  const icons = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭'];
  const cards = icons.concat(icons).sort(() => 0.5 - Math.random());
  return cards.map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false,
  }));
};

const Board = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [minTime, setMinTime] = useState(null);

  const handleCardClick = (id) => {
    if (!isGameRunning) return;
    const newCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );

    const flippedCard = newCards.find((card) => card.id === id);
    setFlippedCards([...flippedCards, flippedCard]);
    setCards(newCards);
  };

  useEffect(() => {
    let timerInterval;
    if (isGameRunning) {
      timerInterval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isGameRunning]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.icon === secondCard.icon) {
        const newCards = cards.map((card) =>
          card.icon === firstCard.icon ? { ...card, matched: true } : card
        );
        setCards(newCards.filter(card => !card.matched)); // Remove matched cards
        setMatchedPairs(matchedPairs + 1);
      } else {
        setTimeout(() => {
          const newCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, flipped: false }
              : card
          );
          setCards(newCards);
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards, matchedPairs]);

  useEffect(() => {
    if (matchedPairs === 8) { // 8 pairs to win the game
      setIsGameRunning(false);
      const score = 1000 / timer; // Calculate score based on time
      if (highScore === null || score > highScore) {
        setHighScore(score);
      }
      if (minTime === null || timer < minTime) {
        setMinTime(timer); // Update minimum time if current time is lower
      }
    }
  }, [matchedPairs, timer, highScore, minTime]);

  const startGame = () => {
    setIsGameRunning(true);
    setTimer(0);
    setCards(generateCards());
    setMatchedPairs(0);
    setFlippedCards([]);
  };

  const restartGame = () => {
    setIsGameRunning(false);
    setTimer(0);
    setCards(generateCards());
    setMatchedPairs(0);
    setFlippedCards([]);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-lg mx-auto mt-4 bg-black text-white p-5 rounded-lg shadow-md">
      <div className="flex w-full">
        <div className="w-full text-center mt-2 text-lg font-semibold">
          Timer: {timer} seconds
        </div>
        <div className="w-full text-center mt-2 text-lg font-semibold">
          High Score: {highScore !== null ? highScore.toFixed(2) : 'N/A'}
        </div>
      </div>
      <div className="w-full text-center text-lg font-semibold">
        Min Time: {minTime !== null ? `${minTime} seconds` : 'N/A'}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-5">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
      <div className="w-full text-center text-lg font-semibold">
        Matched Pairs: {matchedPairs}
      </div>

      <div className="flex space-x-20">
        <button
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded"
          onClick={startGame}
        >
          Start Game
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white font-bold rounded"
          onClick={restartGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Board;
