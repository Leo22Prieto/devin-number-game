'use client';

import { log } from 'console';
import { useState } from 'react';

  const MAX_ATTEMPTS = 10;

  interface GameState {
    secretNumber: number;
    guess: string; // La saisie est toujours un string au départ
    message: string;
    attempts: number;
    gameStatus: 'playing' | 'won' | 'lost'; // État du jeu
  }

  const INITIAL_STATE: GameState = {
    // Génère un nombre secret entre 1 et 100
    secretNumber: Math.floor(Math.random() * 100) + 1, 
    guess: '',
    message: 'Devinez un nombre entre 1 et 100.',
    attempts: 0,
    gameStatus: 'playing',
  };
export default function Home() {
  // 1. Déclaration du State
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE); 
  const { guess, message, attempts, gameStatus } = gameState; 

  // 2. Gestion de la saisie (avec typage des événements React)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Utilisation de l'opérateur de propagation (...) pour préserver le reste de l'état
    setGameState({ ...gameState, guess: e.target.value }); 
  };

  // 3. Logique de jeu et vérification du nombre
  const checkGuess = () => {
    // Si le jeu est déjà terminé, on ne fait rien
    if (gameStatus !== 'playing') return;

    // Conversion de la tentative (string) en nombre (number)
    const userGuess = parseInt(guess);
    const secretNumber = gameState.secretNumber;

    // Validation (vérifier que c'est un nombre entre 1 et 100)
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setGameState({ ...gameState, message: 'Veuillez entrer un nombre valide entre 1 et 100.', guess: '' });
  
      return;
    }

    const newAttempts = attempts + 1;

    // Préparation des variables pour la mise à jour
    let newMessage: string;
    let newStatus: 'playing' | 'won' | 'lost' = 'playing';

    // Logique de comparaison + gestion de la limite de tentatives
    if (userGuess === secretNumber) {
      newMessage = `Félicitations ! Vous avez trouvé le nombre ${secretNumber} en ${newAttempts} essais.`;
      newStatus = 'won';
    } else if (newAttempts >= MAX_ATTEMPTS) {
      newMessage = `Dommage ! Vous avez utilisé vos ${MAX_ATTEMPTS} tentatives. Le nombre était ${secretNumber}.`;
      newStatus = 'lost';
    } else if (userGuess < secretNumber) {
      newMessage = 'Trop petit ! Essayez encore.';
    } else {
      newMessage = 'Trop grand ! Essayez encore.';
    }

    // Mise à jour de l'état (incrémentation des tentatives et nouveau message)
    setGameState({
      ...gameState,
      guess: '', // Réinitialise l'input
      message: newMessage,
      attempts: newAttempts,
      gameStatus: newStatus,
    });
  };

  // 4. Fonction pour redémarrer le jeu
  const restartGame = () => {
    // Crée une nouvelle instance de l'état avec un NOUVEAU nombre secret
    setGameState({
      secretNumber: Math.floor(Math.random() * 100) + 1,
      guess: '',
      message: 'Devinez un nombre entre 1 et 100.',
      attempts: 0,
      gameStatus: 'playing',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Jeu du Devin
        </h1>

        <p className={`text-center mb-4 font-semibold ${gameStatus === 'won' ? 'text-green-600' : 'text-gray-600'}`}>
          {message}
        </p>

        {/* Le formulaire n'apparaît que si le jeu est en cours */}
        {gameStatus === 'playing' && (
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                checkGuess();
            }}
            className="flex space-x-2 mb-4">
            <input
              type="number"
              value={guess}
              // Lie la saisie à notre fonction de gestion
              onChange={handleInputChange} 
              placeholder="Votre nombre..."
              min="1"
              max="100"
              className="grow p-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none transition placeholder-gray-700 text-gray-900"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
            >
              Vérifier
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center">
          Tentatives : <span className="font-bold text-indigo-600">{attempts}</span>/<span className="font-bold">{MAX_ATTEMPTS}</span>
        </p>
        
      </div>
      {/* Afficher le bouton de redémarrage si le jeu est terminé */}
        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <div className="w-full max-w-md mt-4">
            <button
              onClick={restartGame}
              className={`w-full text-white font-bold py-3 px-6 rounded-lg transition ${gameStatus === 'lost' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
                Recommencer
            </button>
          </div>
        )}
    </div>
  );
}
