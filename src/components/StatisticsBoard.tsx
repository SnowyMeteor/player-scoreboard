import React from 'react';
import { InputText } from 'primereact/inputtext';
import { useSwipeable } from 'react-swipeable';
import '../style/StatisticsBoard.css';

// Type definitions for categories
type Category = 'attack' | 'defense' | 'midfield' | 'chance' | 'smash';
type SpecialCategory = 'firstServeRate' | 'receiveErrorRate' | 'servePoints' | 'doubleFaults';

// Interface definitions for category scores
interface CategoryScores {
    success: number;
    fail: number;
}

// Interface definitions for player scores
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

// Interface definitions for team scores
interface TeamScores {
    [key: string]: PlayerScores;
}

// Interface definitions for team data
interface TeamData {
    player1: string;
    player2: string;
    scores: TeamScores;
}

// Interface definitions for round data
interface RoundData {
    ourTeam: TeamData;
    enemyTeam: TeamData;
    notes: string;
}

// Interface definitions for team properties
interface TeamProps {
    team: 'our' | 'enemy';
    roundsData: RoundData[];
    player1Name: string;
    player2Name: string;
}

// Interface definitions for StatisticsBoard props
interface StatisticsBoardProps {
    ourTeam: TeamProps;
    enemyTeam: TeamProps;
    currentTeam: 'our' | 'enemy';
    onSwipe: (team: 'our' | 'enemy') => void;
    roundsData: RoundData[];
}

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ ourTeam, enemyTeam, currentTeam, onSwipe, roundsData }) => {
    // Calculate total scores for a player
    const calculatePlayerTotalScores = (teamProps: TeamProps, playerKey: 'player1' | 'player2'): PlayerScores => {
        const initialScores: PlayerScores = {
            attack: { success: 0, fail: 0 },
            defense: { success: 0, fail: 0 },
            midfield: { success: 0, fail: 0 },
            chance: { success: 0, fail: 0 },
            smash: { success: 0, fail: 0 },
            firstServeRate: 0,
            receiveErrorRate: 0,
            servePoints: 0,
            doubleFaults: 0
        };

        // Reduce rounds data to calculate total scores
        return teamProps.roundsData.reduce((acc, round) => {
            const currentTeamData = teamProps.team === 'our' ? round.ourTeam : round.enemyTeam;
            const playerScores = currentTeamData.scores[playerKey];

            // Accumulate scores for each category
            (Object.keys(playerScores) as Array<keyof PlayerScores>).forEach(category => {
                if (typeof acc[category] === 'number' && typeof playerScores[category] === 'number') {
                    (acc[category] as number) += (playerScores[category] as number);
                } else if (typeof acc[category] === 'object' && typeof playerScores[category] === 'object') {
                    (acc[category] as CategoryScores).success += (playerScores[category] as CategoryScores).success;
                    (acc[category] as CategoryScores).fail += (playerScores[category] as CategoryScores).fail;
                }
            });

            return acc;
        }, { ...initialScores });
    };

    // Calculate success and fail rates for a team
    const calculateSuccessFailRates = (teamProps: TeamProps) => {
        const player1Scores = calculatePlayerTotalScores(teamProps, 'player1');
        const player2Scores = calculatePlayerTotalScores(teamProps, 'player2');

        const categories: Category[] = ['attack', 'defense', 'midfield', 'chance', 'smash'];

        // Calculate rates based on total success and fail counts
        const calculateRates = (scores: PlayerScores) => {
            let totalSuccess = 0;
            let totalFail = 0;
            categories.forEach(category => {
                totalSuccess += scores[category].success;
                totalFail += scores[category].fail;
            });
            const total = totalSuccess + totalFail;
            return {
                successRate: total > 0 ? (totalSuccess / total * 100).toFixed(1) : '0.0',
                failRate: total > 0 ? (totalFail / total * 100).toFixed(1) : '0.0'
            };
        };

        return {
            player1: calculateRates(player1Scores),
            player2: calculateRates(player2Scores)
        };
    };

    // Break text after the second character for display
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

    // Render statistics section for regular categories
    const renderStatisticsSection = (category: Category, label: string, teamProps: TeamProps) => {
        const player1Scores = calculatePlayerTotalScores(teamProps, 'player1');
        const player2Scores = calculatePlayerTotalScores(teamProps, 'player2');

        return (
            <div className={`statistics-section ${category}`}>
                <div className="category-label">{label}</div>
                <div className="score-row">
                    <div className="player-score">
                        <InputText value={player1Scores[category].success.toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                    <div className="success-label">O</div>
                    <div className="player-score">
                        <InputText value={player2Scores[category].success.toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                </div>
                <div className="score-row">
                    <div className="player-score">
                        <InputText value={player1Scores[category].fail.toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                    <div className="fail-label">X</div>
                    <div className="player-score">
                        <InputText value={player2Scores[category].fail.toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                </div>
            </div>
        );
    };

    // Render statistics section for special categories
    const renderSpecialSection = (category: SpecialCategory, label: string, teamProps: TeamProps) => {
        const player1Scores = calculatePlayerTotalScores(teamProps, 'player1');
        const player2Scores = calculatePlayerTotalScores(teamProps, 'player2');

        return (
            <div className="statistics-section special">
                <div className="special-row">
                    <div className="player-score">
                        <InputText value={player1Scores[category].toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                    <div className="category-label" style={{ whiteSpace: 'pre-wrap' }}>
                        {breakAfterSecondCharacter(label)}
                    </div>
                    <div className="player-score">
                        <InputText value={player2Scores[category].toString()} className="score-input" readOnly style={{ backgroundColor: '#FFFFFF' }} />
                    </div>
                </div>
            </div>
        );
    };

    // Render rate section (success rate and fail rate)
    const renderRateSection = (label: string, teamProps: TeamProps) => {
        const rates = calculateSuccessFailRates(teamProps);

        return (
            <div className="statistics-section rate-section">
                <div className="rate-row">
                    <div className="player-rate">
                        <InputText
                            value={`${rates.player1[label === '成功率' ? 'successRate' : 'failRate']}%`}
                            className="rate-input"
                            readOnly
                        />
                    </div>
                    <div className="rate-label">
                        {label}
                    </div>
                    <div className="player-rate">
                        <InputText
                            value={`${rates.player2[label === '成功率' ? 'successRate' : 'failRate']}%`}
                            className="rate-input"
                            readOnly
                        />
                    </div>
                </div>
            </div>
        );
    };

    // Render team statistics
    const renderTeamStatistics = (teamProps: TeamProps) => {
        return (
            <div className={`statistics-board-container ${teamProps.team}`}>
                <div className={`team-header ${teamProps.team}`}>
                    <div className="team-label">{teamProps.team === 'our' ? '我方隊伍' : '敵方隊伍'}</div>
                </div>
                <div className="players-header">
                    <div className="player-input">
                        <InputText value={teamProps.player1Name} className="player-name-input" readOnly />
                    </div>
                    <div className="player-spacer"></div>
                    <div className="player-input">
                        <InputText value={teamProps.player2Name} className="player-name-input" readOnly />
                    </div>
                </div>
                {renderSpecialSection('firstServeRate', '一發進球', teamProps)}
                {renderSpecialSection('receiveErrorRate', '接球失誤', teamProps)}
                {renderSpecialSection('servePoints', '發球得分', teamProps)}
                {renderSpecialSection('doubleFaults', '雙發失誤', teamProps)}
                {renderStatisticsSection('attack', '進攻', teamProps)}
                {renderStatisticsSection('defense', '防守', teamProps)}
                {renderStatisticsSection('midfield', '中場處理', teamProps)}
                {renderStatisticsSection('chance', '機會球', teamProps)}
                {renderStatisticsSection('smash', '落地擊球', teamProps)}
                {renderRateSection('成功率', teamProps)}
                {renderRateSection('失敗率', teamProps)}
            </div>
        );
    };

    // Set up swipe handlers for team switching
    const handlers = useSwipeable({
        onSwipedLeft: () => onSwipe('enemy'),
        onSwipedRight: () => onSwipe('our'),
        trackMouse: true
    });

    return (
        <div {...handlers} style={{ overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                transition: 'transform 0.3s ease-out',
                transform: `translateX(-${currentTeam === 'our' ? 0 : 100}%)`
            }}>
                <div className="statistics-board-wrapper" style={{ flex: '0 0 100%' }}>
                    {renderTeamStatistics(ourTeam)}
                </div>
                <div className="statistics-board-wrapper" style={{ flex: '0 0 100%' }}>
                    {renderTeamStatistics(enemyTeam)}
                </div>
            </div>
        </div>
    );
}

export default React.memo(StatisticsBoard);