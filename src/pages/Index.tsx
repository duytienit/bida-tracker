
import React from 'react';
import { MatchProvider, useMatch } from '@/context/MatchContext';
import NewMatchForm from '@/components/NewMatchForm';
import Scoreboard from '@/components/Scoreboard';
import MatchHistory from '@/components/MatchHistory';

const MatchDashboard: React.FC = () => {
  const { currentMatch } = useMatch();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-pool-felt">BidaMatch</h1>
        <p className="text-gray-600">Track your pool games with ease</p>
      </header>
      
      {currentMatch ? (
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Scoreboard />
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_auto] lg:grid-cols-[2fr_1fr]">
          <div>
            <NewMatchForm />
          </div>
          
          <div>
            <MatchHistory />
          </div>
        </div>
      )}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <MatchProvider>
      <MatchDashboard />
    </MatchProvider>
  );
};

export default Index;
