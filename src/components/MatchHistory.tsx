
import React from 'react';
import { useMatch } from '@/context/MatchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimestamp } from '@/utils/dateUtils';
import { Trophy } from 'lucide-react';

const MatchHistory: React.FC = () => {
  const { matchHistory } = useMatch();
  
  if (!matchHistory.length) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No matches have been recorded yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Match History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matchHistory.map((match) => {
            const player1Won = match.winner === match.player1.id;
            const player2Won = match.winner === match.player2.id;
            
            return (
              <div 
                key={match.id} 
                className="border rounded-md overflow-hidden"
              >
                <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {formatTimestamp(match.timestamp)}
                  </span>
                  <span className="text-sm font-medium">
                    Race to {match.raceTo}
                  </span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`p-2 rounded text-center ${player1Won ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'}`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{match.player1.name}</span>
                        {player1Won && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="text-xl font-bold">{match.player1.score}</div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-500">vs</span>
                    </div>
                    
                    <div 
                      className={`p-2 rounded text-center ${player2Won ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{match.player2.name}</span>
                        {player2Won && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="text-xl font-bold">{match.player2.score}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchHistory;
