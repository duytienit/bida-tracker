
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreakTimerProps {
  defaultTime?: number; // in seconds
}

const BreakTimer: React.FC<BreakTimerProps> = ({ defaultTime = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const startTimer = () => {
    if (timeLeft === 0) {
      resetTimer();
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setTimeLeft(defaultTime);
    setIsRunning(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="pt-6 px-6 pb-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Break Timer</h3>
          <div className="text-4xl font-bold mb-4">{formatTime(timeLeft)}</div>
          <div className="flex justify-center space-x-2">
            {!isRunning || isPaused ? (
              <Button 
                onClick={startTimer} 
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" /> Start
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-1" /> Pause
              </Button>
            )}
            <Button 
              onClick={resetTimer} 
              variant="outline" 
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakTimer;
