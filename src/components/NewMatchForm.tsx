
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMatch } from '@/context/MatchContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const NewMatchForm: React.FC = () => {
  const { createNewMatch } = useMatch();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [raceTo, setRaceTo] = useState('7');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewMatch(
      player1.trim(), 
      player2.trim(), 
      parseInt(raceTo, 10) || 7
    );
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-pool-felt text-white">
        <CardTitle className="text-center text-2xl">New Pool Match</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="player1">Player 1</Label>
              <Input
                id="player1"
                placeholder="Enter name"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="bg-blue-50 border-blue-200 focus:border-pool-player1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="player2">Player 2</Label>
              <Input
                id="player2"
                placeholder="Enter name"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="bg-red-50 border-red-200 focus:border-pool-player2"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="raceTo">Race to</Label>
            <Select 
              value={raceTo} 
              onValueChange={setRaceTo}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select race to" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-pool-felt hover:bg-blue-900 text-white"
          >
            Start Match
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewMatchForm;
