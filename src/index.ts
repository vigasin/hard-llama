import { startBrowserAgent } from "magnitude-core";
import z from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Ensure browser-data directory exists
const browserDataDir = path.join(__dirname, "..", "browser-data");
if (!fs.existsSync(browserDataDir)) {
  fs.mkdirSync(browserDataDir, { recursive: true });
}

// Global agent reference for cleanup
let globalAgent: any = null;

// Save session state
async function saveSession() {
  if (globalAgent) {
    try {
      const sessionPath = path.join(browserDataDir, "session.json");
      await globalAgent.context.storageState({ path: sessionPath });
      console.log("Session saved!");
    } catch (error) {
      console.log("Could not save session:", error);
    }
  }
}

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  if (globalAgent) {
    try {
      console.log("Saving session...");
      await saveSession();
      console.log("Closing browser...");
      await globalAgent.stop();
      console.log("Browser closed successfully");
    } catch (error) {
      console.log("Error during shutdown:", error);
    }
  }
  process.exit(0);
}

// Register signal handlers
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

async function main() {
  try {
    // Check if persistent browser data exists
    if (fs.existsSync(path.join(browserDataDir, "Default"))) {
      console.log("Using existing browser profile...");
    } else {
      console.log("Creating new browser profile...");
    }

    const agent = await startBrowserAgent({
      // Starting URL for agent
      url: "https://easyllama.com",
      // Show thoughts and actions
      narrate: true,
      // LLM configuration
      llm: {
        provider: "claude-code",
        options: {
          model: "claude-sonnet-4-6",
        },
      },
      // Global prompt for faster decision making
      prompt:
        "Act quickly and decisively. IMPORTANT: Only click buttons that are actually clickable (not disabled/grayed out). Check if buttons are enabled before clicking.",
      browser: {
        launchOptions: {
          headless: false,
        },
        contextOptions: {
          viewport: {
            width: 1280,
            height: 720,
          },
          // Try to load saved session state
          storageState: fs.existsSync(path.join(browserDataDir, "session.json"))
            ? path.join(browserDataDir, "session.json")
            : undefined,
        },
      },
    });

    // Store agent reference for cleanup
    globalAgent = agent;

    // Check if already logged in, if not - perform login
    await agent.act([
      "Check if already logged in to Google account. If not logged in, find google auth and enter e-mail ivigasin@networkoptix.com",
      "If login is required, wait until user manually completes MFA authentication",
    ]);

    // Save session after login
    await saveSession();

    // Process each training with optimized approach
    await agent.act(
      [
        "Start or resume the first available training course",
        "For each training page: 1) Find and click ALL audio/video play buttons, 2) WAIT completely for each media to finish playing (use JavaScript to verify), 3) Only after ALL media finished, look for Next/Continue buttons, 4) NEVER proceed while media is still playing",
      ],
      {
        prompt: `
      AUDIO-GUIDED WORKFLOW - Listen for instructions!
      
      STEP 1: LISTEN TO AUDIO INSTRUCTIONS
      - When audio starts playing, use JavaScript to capture and analyze the audio
      - Wait for audio to complete and extract spoken instructions
      - Look for phrases like "нажмите на стрелочку", "кликните здесь", "выберите", etc.
      - Audio will tell you exactly what to click - follow those instructions precisely
      
      STEP 2: FOLLOW AUDIO COMMANDS
      - If audio says "click arrow" - find and click arrow buttons (← → ↑ ↓ or similar)
      - If audio says "scroll" or "navigate" - look for navigation elements
      - If audio mentions specific UI elements - find exactly those elements
      - Don't assume what to do - wait for audio guidance
      
      STEP 3: WAIT FOR AUDIO TO COMPLETE
      CRITICAL: Always wait for audio/video to finish before any other actions!
      
      Use this JavaScript to properly wait for media:
      \`\`\`javascript
      // Function to wait for all media to complete
      function waitForMediaToComplete() {
        const audioElements = document.querySelectorAll('audio, video');
        const playingMedia = Array.from(audioElements).filter(media => !media.paused && !media.ended);
        
        if (playingMedia.length > 0) {
          console.log('Media still playing, waiting...');
          return false; // Still playing
        }
        return true; // All finished
      }
      
      // Check if media is playing
      function isAnyMediaPlaying() {
        const media = document.querySelectorAll('audio, video');
        return Array.from(media).some(m => !m.paused && !m.ended);
      }
      \`\`\`
      
      STEP 4: MANDATORY WAITING WORKFLOW
      1. Click play button for audio/video
      2. IMMEDIATELY check if media is playing with JavaScript
      3. WAIT and do NOTHING while media is playing
      4. Only after media completely finishes (paused=true OR ended=true), proceed
      5. Then look for Next/Continue buttons or follow audio instructions
      
      NEVER SKIP WAITING FOR MEDIA TO FINISH!
      Use: while(isAnyMediaPlaying()) { /* wait */ } before any other actions
    `,
      },
    );

    // Continue with remaining trainings
    await agent.act(
      "Complete all remaining training courses using the same fast approach",
    );

    // Save final session state
    await saveSession();

    // Stop agent and browser
    await agent.stop();
  } catch (error) {
    console.error("Error in main:", error);
    if (globalAgent) {
      try {
        await globalAgent.stop();
      } catch (stopError) {
        console.error("Error stopping agent:", stopError);
      }
    }
    process.exit(1);
  }
}

main();
