import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import './App.css';
import GameInfo from './components/GameInfo';
import ScoreBoard from './components/ScoreBoard';
import StatisticsBoard from './components/StatisticsBoard';
import Notes from './components/Notes';
import GameControlPanel from './components/GameControlPanel';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';

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
  // Initialize state with data from localStorage or default values
  const [gameName, setGameName] = useState(() => loadFromLocalStorage('gameName') || '');
  const [ourScore, setOurScore] = useState(() => loadFromLocalStorage('ourScore') || '');
  const [enemyScore, setEnemyScore] = useState(() => loadFromLocalStorage('enemyScore') || '');
  const [ourResult, setOurResult] = useState<string | null>(() => loadFromLocalStorage('ourResult') || null);
  const [enemyResult, setEnemyResult] = useState<string | null>(() => loadFromLocalStorage('enemyResult') || null);
  const [index, setIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(() => loadFromLocalStorage('currentRound') || 1);
  const [roundsData, setRoundsData] = useState<RoundData[]>(() => loadFromLocalStorage('roundsData') || []);
  const [showStatistics, setShowStatistics] = useState(() => loadFromLocalStorage('showStatistics') || false);
  const [currentTeam, setCurrentTeam] = useState<'our' | 'enemy'>(() => loadFromLocalStorage('currentTeam') || 'our');
  const [currentPage, setCurrentPage] = useState<'game' | 'statistics'>(() => loadFromLocalStorage('currentPage') || 'game');

  // Initialize rounds data if it's empty
  useEffect(() => {
    if (roundsData.length === 0) {
      const initialRound = {
        ourTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
        enemyTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
        notes: ''
      };
      setRoundsData([initialRound]);
      saveToLocalStorage('roundsData', [initialRound]);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('gameName', gameName);
    saveToLocalStorage('ourScore', ourScore);
    saveToLocalStorage('enemyScore', enemyScore);
    saveToLocalStorage('ourResult', ourResult);
    saveToLocalStorage('enemyResult', enemyResult);
    saveToLocalStorage('currentRound', currentRound);
    saveToLocalStorage('roundsData', roundsData);
    saveToLocalStorage('showStatistics', showStatistics);
    saveToLocalStorage('currentTeam', currentTeam);
    saveToLocalStorage('currentPage', currentPage);
  }, [gameName, ourScore, enemyScore, ourResult, enemyResult, currentRound, roundsData, showStatistics, currentTeam, currentPage]);

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

  const handleResultChange = (team: 'our' | 'enemy', newResult: string | null) => {
    if (team === 'our') {
      setOurResult(newResult);
      setEnemyResult(newResult === 'win' ? 'lose' : newResult === 'lose' ? 'win' : null);
    } else {
      setEnemyResult(newResult);
      setOurResult(newResult === 'win' ? 'lose' : newResult === 'lose' ? 'win' : null);
    }
  };

  const handleScoreChange = (team: 'our' | 'enemy', newScore: string) => {
    if (team === 'our') {
      setOurScore(newScore);
    } else {
      setEnemyScore(newScore);
    }
  };

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

  // Swipe handlers for mobile interaction
  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(Math.min(index + 1, 1)),
    onSwipedRight: () => setIndex(Math.max(index - 1, 0)),
    trackMouse: true
  });

  // Reset the game
  const handleReset = useCallback(() => {
    const initialRound = {
      ourTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
      enemyTeam: { player1: '', player2: '', scores: JSON.parse(JSON.stringify(initialTeamScores)) },
      notes: ''
    };

    setGameName('');
    setOurScore('');
    setEnemyScore('');
    setOurResult(null);
    setEnemyResult(null);
    setCurrentRound(1);
    setRoundsData([initialRound]);
    setShowStatistics(false);
    setCurrentTeam('our');
    setCurrentPage('game');
    setIndex(0);

    localStorage.clear();
  }, []);

  return (
    <div className="App">
      <GameInfo
        currentRound={currentRound}
        onRoundChange={handleRoundChange}
        currentPage={currentPage}
        gameName={gameName}
        setGameName={setGameName}
        score={index === 0 ? ourScore : enemyScore}
        setScore={(newScore) => handleScoreChange(index === 0 ? 'our' : 'enemy', newScore)}
        result={index === 0 ? ourResult : enemyResult}
        setResult={(newResult) => handleResultChange(index === 0 ? 'our' : 'enemy', newResult)}
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