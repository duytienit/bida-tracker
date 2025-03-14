
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Match } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MatchContextType {
  currentMatch: Match | null;
  matchHistory: Match[];
  createNewMatch: (player1Name: string, player2Name: string, raceTo: number) => void;
  incrementScore: (playerId: string) => void;
  decrementScore: (playerId: string) => void;
  updatePlayerName: (playerId: string, name: string) => void;
  updateRaceTo: (value: number) => void;
  resetScores: () => void;
  endMatch: () => void;
}

const defaultContext: MatchContextType = {
  currentMatch: null,
  matchHistory: [],
  createNewMatch: () => {},
  incrementScore: () => {},
  decrementScore: () => {},
  updatePlayerName: () => {},
  updateRaceTo: () => {},
  resetScores: () => {},
  endMatch: () => {},
};

const MatchContext = createContext<MatchContextType>(defaultContext);

export const useMatch = () => useContext(MatchContext);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);

  // Load match history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('matchHistory');
    if (savedHistory) {
      try {
        setMatchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse match history', error);
      }
    }
    
    const currentMatchData = localStorage.getItem('currentMatch');
    if (currentMatchData) {
      try {
        setCurrentMatch(JSON.parse(currentMatchData));
      } catch (error) {
        console.error('Failed to parse current match', error);
      }
    }
  }, []);

  // Save match history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
  }, [matchHistory]);

  // Save current match to localStorage whenever it changes
  useEffect(() => {
    if (currentMatch) {
      localStorage.setItem('currentMatch', JSON.stringify(currentMatch));
    } else {
      localStorage.removeItem('currentMatch');
    }
  }, [currentMatch]);

  const createNewMatch = (player1Name: string, player2Name: string, raceTo: number) => {
    const newMatch: Match = {
      id: uuidv4(),
      timestamp: Date.now(),
      player1: {
        id: uuidv4(),
        name: player1Name || 'Player 1',
        score: 0,
      },
      player2: {
        id: uuidv4(),
        name: player2Name || 'Player 2',
        score: 0,
      },
      raceTo,
      winner: null,
      completed: false,
    };
    
    setCurrentMatch(newMatch);
    toast.success('New match created');
  };

  const checkForWinner = (match: Match): Match => {
    const { player1, player2, raceTo } = match;
    
    if (player1.score >= raceTo) {
      const updatedMatch = {
        ...match,
        winner: player1.id,
        completed: true,
      };
      
      // Add to match history
      setMatchHistory(prev => [updatedMatch, ...prev]);
      toast.success(`${player1.name} wins the match!`);
      return updatedMatch;
    }
    
    if (player2.score >= raceTo) {
      const updatedMatch = {
        ...match,
        winner: player2.id,
        completed: true,
      };
      
      // Add to match history
      setMatchHistory(prev => [updatedMatch, ...prev]);
      toast.success(`${player2.name} wins the match!`);
      return updatedMatch;
    }
    
    return match;
  };

  const incrementScore = (playerId: string) => {
    if (!currentMatch) return;
    
    let updatedMatch: Match;
    
    if (currentMatch.player1.id === playerId) {
      updatedMatch = {
        ...currentMatch,
        player1: {
          ...currentMatch.player1,
          score: currentMatch.player1.score + 1,
        },
      };
    } else if (currentMatch.player2.id === playerId) {
      updatedMatch = {
        ...currentMatch,
        player2: {
          ...currentMatch.player2,
          score: currentMatch.player2.score + 1,
        },
      };
    } else {
      return; // Invalid player ID
    }
    
    const finalMatch = checkForWinner(updatedMatch);
    setCurrentMatch(finalMatch);
  };

  const decrementScore = (playerId: string) => {
    if (!currentMatch) return;
    
    let updatedMatch: Match;
    
    if (currentMatch.player1.id === playerId) {
      if (currentMatch.player1.score <= 0) return;
      updatedMatch = {
        ...currentMatch,
        player1: {
          ...currentMatch.player1,
          score: currentMatch.player1.score - 1,
        },
      };
    } else if (currentMatch.player2.id === playerId) {
      if (currentMatch.player2.score <= 0) return;
      updatedMatch = {
        ...currentMatch,
        player2: {
          ...currentMatch.player2,
          score: currentMatch.player2.score - 1,
        },
      };
    } else {
      return; // Invalid player ID
    }
    
    setCurrentMatch(updatedMatch);
  };

  const updatePlayerName = (playerId: string, name: string) => {
    if (!currentMatch) return;
    
    if (currentMatch.player1.id === playerId) {
      setCurrentMatch({
        ...currentMatch,
        player1: {
          ...currentMatch.player1,
          name: name || 'Player 1',
        },
      });
    } else if (currentMatch.player2.id === playerId) {
      setCurrentMatch({
        ...currentMatch,
        player2: {
          ...currentMatch.player2,
          name: name || 'Player 2',
        },
      });
    }
  };

  const updateRaceTo = (value: number) => {
    if (!currentMatch) return;
    
    setCurrentMatch({
      ...currentMatch,
      raceTo: value,
    });
  };

  const resetScores = () => {
    if (!currentMatch) return;
    
    setCurrentMatch({
      ...currentMatch,
      player1: {
        ...currentMatch.player1,
        score: 0,
      },
      player2: {
        ...currentMatch.player2,
        score: 0,
      },
      winner: null,
      completed: false,
    });
    
    toast.info('Match scores have been reset');
  };

  const endMatch = () => {
    if (!currentMatch) return;
    
    // Add to history if not already completed
    if (!currentMatch.completed) {
      setMatchHistory(prev => [{
        ...currentMatch,
        completed: true,
      }, ...prev]);
    }
    
    setCurrentMatch(null);
    toast.info('Match ended');
  };

  return (
    <MatchContext.Provider
      value={{
        currentMatch,
        matchHistory,
        createNewMatch,
        incrementScore,
        decrementScore,
        updatePlayerName,
        updateRaceTo,
        resetScores,
        endMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
