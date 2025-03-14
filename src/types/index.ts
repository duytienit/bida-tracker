
export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Match {
  id: string;
  timestamp: number;
  player1: Player;
  player2: Player;
  raceTo: number;
  winner: string | null;
  completed: boolean;
}
