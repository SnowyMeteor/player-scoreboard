import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '../style/GameInfo.css';

// Options for rounds and win/loss dropdown
const roundsOptions = Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
const winLossOptions = [
    { label: '勝', value: 'win' },
    { label: '負', value: 'lose' }
];

interface GameInfoProps {
    currentRound: number;
    onRoundChange: (round: number) => void;
    currentPage: 'game' | 'statistics';
}

const GameInfo: React.FC<GameInfoProps> = ({ currentRound, onRoundChange, currentPage }) => {
    const [gameName, setGameName] = useState('');
    const [score, setScore] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Set initial cursor position for score input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(0, 0);
        }
    }, []);

    // Handle score input change and formatting
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Limit the input length to 10 characters
        if (value.length <= 10) {
            setScore(value);
        }
    };

    return (
        <div className="p-fluid game-info-container">
            {/* Game Name Input */}
            <div className="game-info-item">
                <label htmlFor="gameName" className="block font-bold mb-2 text-left">比賽名稱</label>
                <InputText
                    id="gameName"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="輸入比賽名稱"
                    className="w-full text-left"
                />
            </div>

            {/* Round Selection Dropdown */}
            <div className="game-info-item">
                <label htmlFor="rounds" className="block font-bold mb-2 text-left">局數</label>
                <Dropdown
                    id="rounds"
                    options={roundsOptions}
                    value={currentRound}
                    onChange={(e) => onRoundChange(e.value)}
                    placeholder="選擇局數"
                    className="w-full text-left"
                    itemTemplate={(option) => (
                        <span className="rounds-option">{option.label}</span>
                    )}
                />
            </div>

            {/* Win/Loss and Score Inputs */}
            <div className="game-info-row">
                {/* Win/Loss Dropdown */}
                <div className="game-info-column game-info-column-left">
                    <label htmlFor="result" className="block font-bold mb-2 text-left">勝負</label>
                    <Dropdown
                        id="result"
                        options={winLossOptions}
                        value={result}
                        onChange={(e) => setResult(e.value)}
                        placeholder="勝 / 負"
                        className="w-full text-left"
                        optionLabel="label"
                    />
                </div>
                {/* Score Input */}
                <div className="game-info-column game-info-column-right">
                    <label htmlFor="score" className="block font-bold mb-2 text-left">比數</label>
                    <InputText
                        id="score"
                        ref={inputRef}
                        placeholder="輸入比數"
                        value={score}
                        onChange={handleScoreChange}
                        className="w-full text-left game-info-score-input"
                    />
                </div>
            </div>
        </div>
    );
}

export default GameInfo;