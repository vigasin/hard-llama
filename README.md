# EasyLlama Training Automation

An intelligent browser automation tool for completing EasyLlama training modules automatically using AI-powered interaction.

## Overview

This project uses [Magnitude](https://docs.magnitude.run) - an AI browser automation framework that combines Playwright with large language models to intelligently interact with web interfaces. The automation is specifically designed to handle EasyLlama training platform requirements including:

- Audio-guided navigation and interactions
- Media playback completion verification
- Smart button state detection
- Persistent session management

## Features

- **Persistent Authentication**: Saves browser session to avoid repeated login
- **Audio-Aware Workflow**: Waits for audio/video content to complete before proceeding
- **Smart Navigation**: Follows audio instructions for precise UI interactions
- **Graceful Shutdown**: Handles Ctrl+C interruption with session saving
- **Russian Language Support**: Configured for Russian audio instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or similar package manager

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### First Run
```bash
npm start
```

On first run, you'll need to:
1. Complete Google OAuth login manually
2. Complete MFA authentication when prompted
3. The automation will then proceed with training modules

### Subsequent Runs
Your login session will be saved automatically. The program will:
1. Load your saved session
2. Navigate directly to training content
3. Complete modules following audio instructions

### Stopping the Program
Press `Ctrl+C` to stop. The program will:
- Save your current session
- Close the browser gracefully
- Preserve progress for next run

## How It Works

### Audio-Guided Navigation
The automation listens to training audio and:
- Waits for audio/video to complete before proceeding
- Follows spoken instructions (e.g., "нажмите на стрелочку")
- Uses JavaScript to verify media playback status
- Only clicks buttons when they become enabled

### Smart Button Detection
Before clicking any button, the system:
- Verifies the button is enabled (not disabled/grayed out)
- Uses JavaScript to check element state
- Avoids clicking the same disabled button repeatedly
- Looks for required actions to enable buttons

### Session Management
- Browser data saved in `browser-data/` directory
- Session state preserved in `session.json`
- Automatic restoration on restart
- Handles interruption gracefully

## Configuration

The automation is configured in `src/index.ts`:

- **Target URL**: `https://easyllama.com`
- **LLM Provider**: Claude Code (Sonnet 4)
- **Browser**: Chromium (headless: false for visibility)
- **Viewport**: 1280x720
- **Language**: Russian audio recognition

## Project Structure

```
├── src/
│   └── index.ts          # Main automation script
├── browser-data/         # Persistent browser session data
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── CLAUDE.md            # Development guidance for Claude Code
└── README.md            # This file
```

## Development Commands

- `npm start` - Run the automation
- `npm run build` - Compile TypeScript
- `npm install` - Install dependencies (also installs Chromium)

## Troubleshooting

### Browser Flickering
The browser window may flicker during operation due to frequent page analysis. This is normal behavior for AI-driven automation.

### Audio Not Working
Ensure:
- Audio is enabled in your browser
- Microphone permissions are granted for speech recognition
- Audio elements are present on the training pages

### Session Not Saved
Check that:
- The `browser-data/` directory exists and is writable
- The program completed gracefully (not force-killed)
- No permission issues with file system access

## Technical Details

### Dependencies
- **magnitude-core**: AI browser automation framework
- **dotenv**: Environment variable management
- **zod**: Type-safe schema validation
- **tsx**: TypeScript execution
- **typescript**: Type checking and compilation

### Browser Configuration
- Uses Chromium via Playwright
- Persistent context for session management
- Custom viewport for optimal LLM vision
- Disabled headless mode for user monitoring

## Resources

- [Magnitude Documentation](https://docs.magnitude.run)
- [Magnitude GitHub](https://github.com/magnitudedev/magnitude)  
- [Magnitude Discord](https://discord.gg/VcdpMh9tTy)

## License

This project is for educational and automation purposes. Ensure compliance with EasyLlama's terms of service when using.