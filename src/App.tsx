import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './App.css';
import GameInfo from './components/GameInfo';
import ScoreBoard from './components/ScoreBoard';
import Notes from './components/Notes';

function App() {
  const [index, setIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(Math.min(index + 1, 1)),
    onSwipedRight: () => setIndex(Math.max(index - 1, 0)),
    trackMouse: true
  });

  return (
    <div className="App">
      <GameInfo />
      <div {...handlers} style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          transition: 'transform 0.3s ease-out',
          transform: `translateX(-${index * 100}%)`
        }}>
          <div className="scoreboard-wrapper" style={{ flex: '0 0 100%' }}>
            <ScoreBoard team="our" />
          </div>
          <div className="scoreboard-wrapper" style={{ flex: '0 0 100%' }}>
            <ScoreBoard team="enemy" />
          </div>
        </div>
      </div>
      <Notes />
    </div>
  );
}

export default App;