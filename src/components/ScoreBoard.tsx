import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../style/ScoreBoard.css';

type Category = 'attack' | 'defense' | 'midfield' | 'chance' | 'smash';
type SpecialCategory = 'firstServeRate' | 'receiveErrorRate' | 'servePoints' | 'doubleFaults';
type Player = 'player1' | 'player2';

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

interface Scores {
    player1: PlayerScores;
    player2: PlayerScores;
}

interface ScoreBoardProps {
    team: 'our' | 'enemy';
}

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

const ScoreBoard: React.FC<ScoreBoardProps> = ({ team }) => {
    const [players, setPlayers] = useState({ player1: '', player2: '' });
    const [scores, setScores] = useState<Scores>({
        player1: { ...initialPlayerScores },
        player2: { ...initialPlayerScores }
    });

    const incrementScore = (player: Player, category: Category | SpecialCategory, success: boolean) => {
        setScores(prevScores => ({
            ...prevScores,
            [player]: {
                ...prevScores[player],
                [category]: typeof prevScores[player][category] === 'number'
                    ? (prevScores[player][category] as number) + 1
                    : {
                        ...(prevScores[player][category] as CategoryScores),
                        [success ? 'success' : 'fail']: (prevScores[player][category] as CategoryScores)[success ? 'success' : 'fail'] + 1
                    }
            }
        }));
    }

    const decrementScore = (player: Player, category: Category | SpecialCategory, success: boolean) => {
        setScores(prevScores => ({
            ...prevScores,
            [player]: {
                ...prevScores[player],
                [category]: typeof prevScores[player][category] === 'number'
                    ? Math.max(0, (prevScores[player][category] as number) - 1)
                    : {
                        ...(prevScores[player][category] as CategoryScores),
                        [success ? 'success' : 'fail']: Math.max(0, (prevScores[player][category] as CategoryScores)[success ? 'success' : 'fail'] - 1)
                    }
            }
        }));
    }

    const renderScoreSection = (category: Category, label: string) => (
        <div className={`score-section ${category}`}>
            <div className="category-label">{label}</div>
            <div className="score-row">
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player1', category, true)} className="p-button-secondary score-button" />
                    <InputText value={scores.player1[category].success.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, true)} className="p-button-secondary score-button" />
                </div>
                <div className="success-label">O</div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, true)} className="p-button-secondary score-button" />
                    <InputText value={scores.player2[category].success.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player2', category, true)} className="p-button-secondary score-button" />
                </div>
            </div>
            <div className="score-row">
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player1', category, false)} className="p-button-secondary score-button" />
                    <InputText value={scores.player1[category].fail.toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, false)} className="p-button-secondary score-button" />
                </div>
                <div className="fail-label">X</div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, false)} className="p-button-secondary score-button" />
                    <InputText value={scores.player2[category].fail.toString()} className="score-input" readOnly />
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
                    <InputText value={scores.player1[category].toString()} className="score-input" readOnly />
                    <Button icon="pi pi-plus" onClick={() => incrementScore('player1', category, true)} className="p-button-secondary score-button" />
                </div>
                <div className="category-label" style={{ whiteSpace: 'pre-wrap' }}>
                    {breakAfterSecondCharacter(label)}
                </div>
                <div className="player-score">
                    <Button icon="pi pi-minus" onClick={() => decrementScore('player2', category, true)} className="p-button-secondary score-button" />
                    <InputText value={scores.player2[category].toString()} className="score-input" readOnly />
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
                        value={players.player1}
                        onChange={(e) => setPlayers(prev => ({ ...prev, player1: e.target.value }))}
                        placeholder="選手1"
                        className="player-name-input"
                    />
                </div>
                <div className="player-spacer"></div>
                <div className="player-input">
                    <InputText
                        value={players.player2}
                        onChange={(e) => setPlayers(prev => ({ ...prev, player2: e.target.value }))}
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

export default ScoreBoard;