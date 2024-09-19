import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../style/ScoreBoard.css';

type Category = 'attack' | 'defense' | 'midfield' | 'chance' | 'smash';
type SpecialCategory = 'firstServeRate' | 'receiveErrorRate' | 'servePoints' | 'doubleFaults';

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

interface TeamData {
    player1: string;
    player2: string;
    scores: TeamScores;
}

interface ScoreBoardProps {
    team: 'our' | 'enemy';
    data: TeamData;
    onDataChange: (data: TeamData) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ team, data, onDataChange }) => {
    const handlePlayerChange = (player: 'player1' | 'player2', value: string) => {
        onDataChange({
            ...data,
            [player]: value
        });
    };

    const changeScore = (player: string, category: Category | SpecialCategory, success: boolean, increment: boolean) => {
        const newScores = { ...data.scores };
        if (typeof newScores[player][category] === 'number') {
            (newScores[player][category] as number) = Math.max(0, (newScores[player][category] as number) + (increment ? 1 : -1));
        } else {
            (newScores[player][category] as CategoryScores)[success ? 'success' : 'fail'] =
                Math.max(0, (newScores[player][category] as CategoryScores)[success ? 'success' : 'fail'] + (increment ? 1 : -1));
        }
        onDataChange({
            ...data,
            scores: newScores
        });
    };

    const incrementScore = (player: string, category: Category | SpecialCategory, success: boolean) => {
        changeScore(player, category, success, true);
    };

    const decrementScore = (player: string, category: Category | SpecialCategory, success: boolean) => {
        changeScore(player, category, success, false);
    };

    const renderScoreSection = (category: Category, label: string) => (
        <div className={`score-section ${category}`}>
            <div className="category-label">{label}</div>
            <div className="score-row">
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player1', category, true)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player1[category].success.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, true)} className="p-button-secondary score-button" />
                </div>
                <div className="success-label">O</div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, true)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player2[category].success.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player2', category, true)} className="p-button-secondary score-button" />
                </div>
            </div>
            <div className="score-row">
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player1', category, false)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player1[category].fail.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, false)} className="p-button-secondary score-button" />
                </div>
                <div className="fail-label">X</div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, false)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player2[category].fail.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player2', category, false)} className="p-button-secondary score-button" />
                </div>
            </div>
        </div>
    );

    const breakAfterSecondCharacter = (text: string) => {
        if (text.length > 2) {
            return (
                <>
                    {text.slice(0, 2)}
                    <br />
                    {text.slice(2)}
                </>
            );
        } else {
            return text;
        }
    };

    const renderSpecialSection = (category: SpecialCategory, label: string) => (
        <div className="score-section special">
            <div className="special-row">
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player1', category, true)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player1[category].toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, true)} className="p-button-secondary score-button" />
                </div>
                <div className="category-label" style={{ whiteSpace: 'pre-wrap' }}>
                    {breakAfterSecondCharacter(label)}
                </div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, true)} className="p-button-secondary score-button" />
                    <InputText value={data.scores.player2[category].toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player2', category, true)} className="p-button-secondary score-button" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="scoreboard-container">
            <div className={`team-header ${team}`}>
                <div className="team-label">{team === 'our' ? '我方隊伍' : '敵方隊伍'}</div>
            </div>
            <div className="players-header">
                <div className="player-input">
                    <InputText
                        value={data.player1}
                        onChange={(e) => handlePlayerChange('player1', e.target.value)}
                        placeholder="選手1"
                        className="player-name-input"
                    />
                </div>
                <div className="player-spacer"></div>
                <div className="player-input">
                    <InputText
                        value={data.player2}
                        onChange={(e) => handlePlayerChange('player2', e.target.value)}
                        placeholder="選手2"
                        className="player-name-input"
                    />
                </div>
            </div>
            {renderScoreSection('attack', '進攻')}
            {renderScoreSection('defense', '防守')}
            {renderScoreSection('midfield', '中場處理')}
            {renderScoreSection('chance', '機會球')}
            {renderScoreSection('smash', '落地擊球')}
            {renderSpecialSection('firstServeRate', '一發進球率')}
            {renderSpecialSection('receiveErrorRate', '接球失誤率')}
            {renderSpecialSection('servePoints', '發球得分')}
            {renderSpecialSection('doubleFaults', '雙發失誤')}
        </div>
    );
}

export default React.memo(ScoreBoard);