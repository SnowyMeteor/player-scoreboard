# Soft Tennis Match Analysis

A React-based application for tracking and analyzing scores in sports matches, particularly suited for racquet sports like tennis.

## Features

- Track scores for two teams (our team and enemy team)
- Record various game statistics including attacks, defenses, midfield plays, chance balls, and smashes
- Calculate and display success and failure rates
- Support for multiple rounds in a match
- Add notes for each round
- View overall statistics across all rounds
- Responsive design with swipe gestures for mobile use
- Persistent data storage using localStorage to maintain state across sessions
- Interactive UI with real-time updates and dynamic content adjustment

## Components

1. **GameInfo**: Manages game metadata like match name, round number, and final score. Allows users to select the current round and view win/loss status.
2. **ScoreBoard**: Tracks detailed scores and statistics for each team, including special categories like first serve rate and double faults.
3. **StatisticsBoard**: Displays cumulative statistics across all rounds, including success and failure rates for each player.
4. **Notes**: Allows adding and viewing notes for each round, with automatic height adjustment for content.
5. **GameControlPanel**: Provides controls to navigate between game and statistics views, and reset the match data.

## Technologies Used

- React
- TypeScript
- PrimeReact (UI component library)
- react-swipeable (for swipe gestures)
- localStorage (for data persistence)

## Installation

1. Clone the repository
2. Install dependencies: ```npm install```
3. Run the application: ```npm start```

## Usage

1. Enter player names for both teams
2. Use the +/- buttons to record successful and failed attempts for each category
3. Swipe left/right to switch between teams
4. Add notes for each round
5. View cumulative statistics by clicking the "Statistics" button
6. Reset the match data using the "Reset" button, which clears all stored data

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.