# Judgment Card Game Scorekeeper

A modern web application for keeping score in the Judgment card game, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Supports 3-6 players
- Real-time score tracking and validation
- Automatic trump suit rotation
- Dealer tracking and rotation
- Round-by-round scoring history
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Persistence**: Local Storage

## Core Components

### Game Logic
- Dynamic round calculation based on player count
- Trump suit rotation (♠️ ♥️ ♣️ ♦️)
- Bid validation and trick tracking
- Score calculation with perfect bid bonuses

### User Interface
- Player setup and management
- Bidding interface with validation
- Trick input and tracking
- Score history and game statistics

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── game/        # Game-specific components
│   ├── ui/          # Reusable UI components
├── lib/             # Utilities and helpers
│   ├── store/       # Game state management
│   ├── types/       # TypeScript types
│   └── utils/       # Helper functions
└── styles/          # Global styles
```

## Game Flow

1. **Setup**: Enter player names (3-6 players)
2. **Rounds**: Progress from 1 to max cards per player
3. **Bidding**: Players bid tricks in order
4. **Playing**: Record actual tricks won
5. **Scoring**: Auto-calculate scores (10 + tricks for perfect bids)

## Deployment

Deploy using Vercel or any static hosting platform.

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT License