# SaltyDog 🧭

A nautical-themed Fitbit smartwatch application for sailors and boaters. Track your speed over ground (SOG) and heading in real-time, right from your wrist.

![Fitbit SDK 6.1](https://img.shields.io/badge/Fitbit%20SDK-6.1-blue)
![Version 2.0.0](https://img.shields.io/badge/version-2.0.0-green)

## Features

- **Real-time Speed Display** - View your speed over ground in knots or MPH (tap to toggle)
- **Heading Indicator** - Visual compass showing your current heading in degrees
- **Animated Wave Graphics** - Nautical-themed wave animations
- **Clock Display** - Standard 12-hour time format
- **Background Running** - Continues tracking in the background

## Supported Devices

- Fitbit Versa 4 (atlas)
- Fitbit Sense 2 (vulcan)

## Permissions Required

- `access_location` - For GPS speed and heading data
- `run_background` - For continuous tracking

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- Fitbit SDK CLI

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/che-effe/salty-dog.git
   cd salty-dog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Debug/deploy to your device:
   ```bash
   npm run debug
   ```

## Usage

1. Launch the SaltyDog app on your Fitbit device
2. Your current speed and heading will display automatically once GPS acquires a fix
3. **Tap the screen** to toggle between knots and MPH
4. The directional indicator rotates to show your current heading

## Project Structure

```
salty-dog/
├── app/                 # Device application code
│   ├── index.js         # Main app logic
│   └── utils.js         # Utility functions
├── companion/           # Phone companion app
│   └── index.js
├── resources/           # UI assets and views
│   ├── index.view       # SVG layout
│   ├── styles.css       # Styling
│   └── widget.defs      # Widget definitions
├── settings/            # App settings page
│   └── index.jsx
├── build/               # Compiled output
└── package.json
```

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application |
| `npm run debug` | Launch Fitbit debugger for deployment |

### Dependencies

- `@fitbit/sdk` - Fitbit SDK (v6.1.0)
- `@fitbit/sdk-cli` - Fitbit CLI tools
- `fitbit-animate` - Animation library

## License

This project is private and unlicensed.

## Author

che-effe
