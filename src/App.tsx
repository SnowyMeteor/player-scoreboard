import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from 'primereact/button';
import './App.css';
import GameInfo from './components/GameInfo';
import ScoreBoard from './components/ScoreBoard';
import StatisticsBoard from './components/StatisticsBoard';
import Notes from './components/Notes';
import GameControlPanel from './components/GameControlPanel';

// Interface definitions for scores
interface CategoryScores {
  success: number;
  fail: number;
}

interface PlayerScores {
  attack: CategoryScores;
  defense: CategoryScores;
  midfield: CategoryScores;
  chance: CategoryScores;
  smash: CategoryScores;
  firstServeRate: number;
  receiveErrorRate: number;
  servePoints: number;
  doubleFaults: number;
}

interface TeamScores {
  [key: string]: PlayerScores;
}

interface RoundData {
  ourTeam: TeamData;
  enemyTeam: TeamData;
  notes: string;
}

interface TeamData {
  player1: string;
  player2: string;
  scores: TeamScores;
}

// Initial score setup
const initialCategoryScores: CategoryScores = { success: 0, fail: 0 };

const initialPlayerScores: PlayerScores = {
  attack: { ...initialCategoryScores },
  defense: { ...initialCategoryScores },
  midfield: { ...initialCategoryScores },
  chance: { ...initialCategoryScores },
  smash: { ...initialCategoryScores },
  firstServeRate: 0,
  receiveErrorRate: 0,
  servePoints: 0,
  doubleFaults: 0
};

const initialTeamScores: TeamScores = {
  player1: { ...initialPlayerScores },
  player2: { ...initialPlayerScores }
};

function App() {
  const [index, setIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundsData, setRoundsData] = useState<RoundData[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<'our' | 'enemy'>('our');
  const [currentPage, setCurrentPage] = useState<'game' | 'statistics'>('game');

  // Initialize rounds data
  useEffect(() => {
    setRoundsData([{
      ourTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
      enemyTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
      notes: ''
    }]);
  }, []);

  // Handle round change
  const handleRoundChange = useCallback((round: number) => {
    setCurrentRound(round);
    setRoundsData(prev => {
      if (round > prev.length) {
        const lastRound = prev[prev.length - 1];
        const newRounds = [...prev];
        for (let i = prev.length; i < round; i++) {
          newRounds.push({
            ourTeam: {
              player1: lastRound.ourTeam.player1,
              player2: lastRound.ourTeam.player2,
              scores: JSON.parse(JSON.stringify(initialTeamScores))
            },
            enemyTeam: {
              player1: lastRound.enemyTeam.player1,
              player2: lastRound.enemyTeam.player2,
              scores: JSON.parse(JSON.stringify(initialTeamScores))
            },
            notes: ''
          });
        }
        return newRounds;
      }
      return prev;
    });
  }, []);

  // Update team data
  const updateTeamData = useCallback((team: 'ourTeam' | 'enemyTeam', data: TeamData) => {
    setRoundsData(prev => {
      const newData = prev.map((round, index) => {
        if (index === currentRound - 1) {
          return {
            ...round,
            [team]: data
          };
        } else {
          return {
            ...round,
            [team]: {
              ...round[team],
              player1: data.player1,
              player2: data.player2
            }
          };
        }
      });

      return newData;
    });
  }, [currentRound]);

  // Update notes
  const updateNotes = useCallback((notes: string) => {
    setRoundsData(prev => {
      const newData = [...prev];
      if (!newData[currentRound - 1]) {
        newData[currentRound - 1] = {
          ourTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
          enemyTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
          notes: ''
        };
      }
      newData[currentRound - 1].notes = notes;
      return newData;
    });
  }, [currentRound]);

  // Show statistics
  const handleShowStatistics = useCallback(() => {
    setShowStatistics(true);
    setCurrentPage('statistics');
  }, []);

  // Back to game
  const handleBackToGame = useCallback(() => {
    setShowStatistics(false);
    setCurrentPage('game');
  }, []);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(Math.min(index + 1, 1)),
    onSwipedRight: () => setIndex(Math.max(index - 1, 0)),
    trackMouse: true
  });

  // Reset the game
  const handleReset = useCallback(() => {
    console.log('Reset functionality to be implemented');
  }, []);

  return (
    <div className="App">
      <GameInfo
        currentRound={currentRound}
        onRoundChange={handleRoundChange}
        currentPage={currentPage}
      />
      {showStatistics ? (
        <div className="statistics-container">
          <StatisticsBoard
            ourTeam={{
              team: 'our',
              roundsData: roundsData,
              player1Name: roundsData[0]?.ourTeam.player1 || '',
              player2Name: roundsData[0]?.ourTeam.player2 || ''
            }}
            enemyTeam={{
              team: 'enemy',
              roundsData: roundsData,
              player1Name: roundsData[0]?.enemyTeam.player1 || '',
              player2Name: roundsData[0]?.enemyTeam.player2 || ''
            }}
            currentTeam={currentTeam}
            onSwipe={setCurrentTeam}
            roundsData={roundsData}
          />
        </div>
      ) : (
        <div {...handlers} style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            transition: 'transform 0.3s ease-out',
            transform: `translateX(-${index * 100}%)`
          }}>
            <div className="scoreboard-wrapper" style={{ flex: '0 0 100%' }}>
              <ScoreBoard
                team="our"
                data={roundsData[currentRound - 1]?.ourTeam || { player1: '', player2: '', scores: initialTeamScores }}
                onDataChange={(data) => updateTeamData('ourTeam', data)}
              />
            </div>
            <div className="scoreboard-wrapper" style={{ flex: '0 0 100%' }}>
              <ScoreBoard
                team="enemy"
                data={roundsData[currentRound - 1]?.enemyTeam || { player1: '', player2: '', scores: initialTeamScores }}
                onDataChange={(data) => updateTeamData('enemyTeam', data)}
              />
            </div>
          </div>
        </div>
      )}
      <Notes
        value={showStatistics
          ? roundsData.map((round, index) => `第 ${index + 1} 局：\n${round.notes}`).join('\n\n')
          : roundsData[currentRound - 1]?.notes || ''}
        onChange={showStatistics ? () => { } : updateNotes}
        readOnly={showStatistics}
      />
      <GameControlPanel
        currentPage={currentPage}
        onBackToGame={handleBackToGame}
        onShowStatistics={handleShowStatistics}
        onReset={handleReset}
      />
    </div>
  );
}

export default App;