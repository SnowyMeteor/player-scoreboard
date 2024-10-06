import React from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../style/GameControlPanel.css';

interface GameControlPanelProps {
  currentPage: 'game' | 'statistics';
  onBackToGame: () => void;
  onShowStatistics: () => void;
  onReset: () => void;
}

const GameControlPanel: React.FC<GameControlPanelProps> = ({
  currentPage,
  onBackToGame,
  onShowStatistics,
  onReset
}) => {
  const confirmReset = () => {
    confirmDialog({
      message: '確定要重置比賽結果嗎？',
      header: '比賽重置',
      icon: 'pi pi-exclamation-triangle',
      className: 'custom-confirm-dialog',
      accept: () => {
        // Clear localStorage
        localStorage.clear();
        // Call the onReset function passed from the parent component
        onReset();
      },
      reject: () => {},
      acceptLabel: '確認',
      rejectLabel: '取消',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptClassName: 'p-button-reset-confirm',
      rejectClassName: 'p-button-reset-cancel',
    });
  };

  return (
    <div className="game-control-panel">
      <div className="button-row">
        <Button
          label="回到比賽"
          className={`p-button-back-to-game ${currentPage === 'game' ? 'active' : 'inactive'}`}
          onClick={onBackToGame}
        />
        <Button
          label="統計結果"
          className={`p-button-statistics ${currentPage === 'statistics' ? 'active' : 'inactive'}`}
          onClick={onShowStatistics}
        />
      </div>
      <div className="button-row">
        <Button
          label="重置"
          className="p-button-reset"
          onClick={confirmReset}
        />
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default GameControlPanel;