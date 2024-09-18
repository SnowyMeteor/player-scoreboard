import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '../style/GameInfo.css';

const roundsOptions = Array.from({ length: 6 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
const winLossOptions = [
    { label: '勝', value: 'win' },
    { label: '負', value: 'lose' }
];

const GameInfo: React.FC = () => {
    const [score, setScore] = useState('');
    const [rounds, setRounds] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[0-9:]*$/.test(value)) {
            setScore(value);
        }
    }

    return (
        <div className="p-fluid game-info-container">
            {/* 比賽名稱 */}
            <div className="game-info-item">
                <label htmlFor="gameName" className="block font-bold mb-2 text-left">比賽名稱</label>
                <InputText
                    id="gameName"
                    placeholder="輸入比賽名稱"
                    className="w-full text-left"
                />
            </div>

            {/* 局數 */}
            <div className="game-info-item">
                <label htmlFor="rounds" className="block font-bold mb-2 text-left">局數</label>
                <Dropdown
                    id="rounds"
                    options={roundsOptions}
                    value={rounds}
                    onChange={(e) => setRounds(e.value)}
                    placeholder="選擇局數"
                    className="w-full text-left"
                    itemTemplate={(option) => (
                        <span className="rounds-option">{option.label}</span>
                    )}
                />
            </div>

            {/* 勝負和比數 */}
            <div className="game-info-row">
                {/* 勝負 */}
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
                {/* 比數 */}
                <div className="game-info-column game-info-column-right">
                    <label htmlFor="score" className="block font-bold mb-2 text-left">比數</label>
                    <InputText
                        id="score"
                        placeholder="輸入比數"
                        value={score}
                        onChange={handleScoreChange}
                        keyfilter={/^[0-9:]*$/}
                        maxLength={5}
                        className="w-full text-left game-info-score-input"
                    />
                </div>
            </div>
        </div>
    );
}

export default GameInfo;
