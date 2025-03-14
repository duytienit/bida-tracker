
import React, { useState, useEffect } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import BreakTimer from './BreakTimer';
import { Plus, Minus, Maximize2, RotateCcw, Check } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { createFishEffect } from '@/utils/animationUtils';

const Scoreboard: React.FC = () => {
  const { 
    currentMatch, 
    incrementScore, 
    decrementScore, 
    updatePlayerName, 
    resetScores, 
    endMatch 
  } = useMatch();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingPlayer1, setEditingPlayer1] = useState(false);
  const [editingPlayer2, setEditingPlayer2] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  
  useEffect(() => {
    if (currentMatch) {
      setPlayer1Name(currentMatch.player1.name);
      setPlayer2Name(currentMatch.player2.name);
      
      // Auto fullscreen on match start
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setIsFullscreen(true);
      }
    }
  }, [currentMatch]);
  
  if (!currentMatch) {
    return null;
  }
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const handlePlayer1NameSave = () => {
    updatePlayerName(currentMatch.player1.id, player1Name);
    setEditingPlayer1(false);
  };
  
  const handlePlayer2NameSave = () => {
    updatePlayerName(currentMatch.player2.id, player2Name);
    setEditingPlayer2(false);
  };
  
  const handleIncrementScore = (playerId: string) => {
    createFishEffect('increment');
    incrementScore(playerId);
  };
  
  const handleDecrementScore = (playerId: string) => {
    createFishEffect('decrement');
    decrementScore(playerId);
  };
  
  const player1IsWinner = currentMatch.winner === currentMatch.player1.id;
  const player2IsWinner = currentMatch.winner === currentMatch.player2.id;
  
  return (
    <div className="w-full">
      <Card className="bg-gray-800 text-white shadow-xl overflow-hidden">
        <CardHeader className="bg-pool-felt p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Race to {currentMatch.raceTo}</CardTitle>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-800"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x divide-gray-700">
            {/* Player 1 Score Area */}
            <div 
              className={`player-score-area p-6 flex flex-col items-center ${
                player1IsWinner ? 'winner-animation' : ''
              }`} 
              style={{ backgroundColor: 'rgb(30, 64, 175)' }}
            >
              <div className="mb-4 w-full">
                {editingPlayer1 ? (
                  <div className="flex space-x-2">
                    <Input
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      className="bg-blue-800 text-white border-blue-500"
                      autoFocus
                    />
                    <Button 
                      onClick={handlePlayer1NameSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <h2 
                    className="text-2xl font-bold text-center cursor-pointer hover:text-blue-300 transition-colors"
                    onClick={() => setEditingPlayer1(true)}
                  >
                    {currentMatch.player1.name}
                  </h2>
                )}
              </div>
              
              <div className="text-8xl font-bold mb-8">
                {currentMatch.player1.score}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleDecrementScore(currentMatch.player1.id)}
                  className="bg-blue-700 hover:bg-blue-800 h-14 w-14 rounded-full"
                  disabled={currentMatch.completed || currentMatch.player1.score <= 0}
                >
                  <Minus className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={() => handleIncrementScore(currentMatch.player1.id)}
                  className="bg-blue-600 hover:bg-blue-700 h-14 w-14 rounded-full"
                  disabled={currentMatch.completed}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              
              {player1IsWinner && (
                <div className="mt-4 text-lg font-semibold text-yellow-300">
                  WINNER!
                </div>
              )}
            </div>
            
            {/* Player 2 Score Area */}
            <div 
              className={`player-score-area p-6 flex flex-col items-center ${
                player2IsWinner ? 'winner-animation' : ''
              }`} 
              style={{ backgroundColor: 'rgb(185, 28, 28)' }}
            >
              <div className="mb-4 w-full">
                {editingPlayer2 ? (
                  <div className="flex space-x-2">
                    <Input
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      className="bg-red-800 text-white border-red-500"
                      autoFocus
                    />
                    <Button 
                      onClick={handlePlayer2NameSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <h2 
                    className="text-2xl font-bold text-center cursor-pointer hover:text-red-300 transition-colors"
                    onClick={() => setEditingPlayer2(true)}
                  >
                    {currentMatch.player2.name}
                  </h2>
                )}
              </div>
              
              <div className="text-8xl font-bold mb-8">
                {currentMatch.player2.score}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleDecrementScore(currentMatch.player2.id)}
                  className="bg-red-700 hover:bg-red-800 h-14 w-14 rounded-full"
                  disabled={currentMatch.completed || currentMatch.player2.score <= 0}
                >
                  <Minus className="h-6 w-6" />
                </Button>
                
                <Button
                  onClick={() => handleIncrementScore(currentMatch.player2.id)}
                  className="bg-red-600 hover:bg-red-700 h-14 w-14 rounded-full"
                  disabled={currentMatch.completed}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              
              {player2IsWinner && (
                <div className="mt-4 text-lg font-semibold text-yellow-300">
                  WINNER!
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-900 p-4 flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-white bg-transparent border-white hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Match?</DialogTitle>
                <DialogDescription>
                  This will reset both player scores to zero. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => document.body.click()}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  resetScores();
                  document.body.click();
                }}>
                  Reset Scores
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
              >
                End Match
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>End Match?</DialogTitle>
                <DialogDescription>
                  This will end the current match and save it to your history. You'll be able to start a new match afterward.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => document.body.click()}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    endMatch();
                    document.body.click();
                  }}
                >
                  End Match
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <BreakTimer />
      </div>
    </div>
  );
};

export default Scoreboard;
