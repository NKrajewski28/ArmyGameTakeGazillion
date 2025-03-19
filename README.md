# 3JS Military Game

A commander-led Real-Time Strategy (RTS) game built with Three.js, featuring tactical military gameplay across multiple modes.

## Features

- **Multiple Game Modes**: Campaign, Skirmish, Conquest, Spectator Showdown (single-player) and Versus (multiplayer)
- **Diverse Unit Types**: 18 unique units including Infantry Squad, Tanks, Snipers, and more
- **Support Systems**: 7 different support abilities like Smoke Screen, EMP Pulse, and A-10 Strike
- **Resource Management**: Tactical Points (TP) for deploying units and Victory Points (VP) for winning
- **3D Graphics**: Built with Three.js using low-poly 3D models for optimal performance
- **Immersive UI**: Military-themed interface with mini-map, unit controls, and tactical overlays

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/3js-military-game.git
cd 3js-military-game
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Build for production
```
npm run build
```

## Game Controls

- **WASD**: Pan camera
- **Mouse Wheel**: Zoom in/out
- **Left Click**: Select unit
- **Right Click**: Issue move/attack order
- **Shift + Left Click**: Multi-select units
- **1-6**: Select unit groups
- **M**: Toggle mini-map
- **Space**: Pause game (single-player only)

## Technology Stack

- **Three.js**: 3D rendering
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast development and building

## Game Design

The game is designed around a tactical military experience where players command units across various terrains. The core gameplay loop involves:

1. Capturing zones to earn Tactical Points (TP)
2. Spending TP to deploy units and support systems
3. Managing units to achieve objectives and earn Victory Points (VP)
4. Reaching the VP goal before opponents

Units have various stats including health, damage, range, and special abilities, creating a balanced tactical experience.

## License

This project is licensed under the ISC License. 