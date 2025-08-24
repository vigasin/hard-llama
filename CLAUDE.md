# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Magnitude-based browser automation project. Magnitude enables developers to control browsers using AI by wrapping Playwright and using large visually grounded language models like Claude Sonnet to see what's happening in the browser and decide how to interact with it.

## Development Commands

- `npm install` - Install dependencies (also installs Chromium via patchright)
- `npm start` - Run the automation script (`tsx src/index.ts`)
- `npm run build` - Build TypeScript to JavaScript (`tsc`)

## Project Architecture

### Core Structure
- `src/index.ts` - Main automation script that demonstrates Magnitude usage
- Uses TypeScript with ESNext modules and strict type checking
- Dependencies: magnitude-core, dotenv, zod

### Current Implementation
The project contains a specific automation for easyllama.com that:
1. Configures browser agent with Claude Sonnet 4 model via "claude-code" provider
2. Handles Google OAuth login for ivigasin@networkoptix.com
3. Waits for manual MFA completion
4. Navigates through training modules with multilingual support (Russian instructions)
5. Automatically plays media content and progresses through training steps

### Key Technical Details
- Uses `claude-code` provider for LLM configuration (not direct Anthropic API)
- Custom viewport size (1280x720) configured for the specific website
- Complex multi-step automation with custom prompts for media interaction
- Includes JavaScript-based detection for audio/video playback status

## Magnitude Framework Usage

### Core Methods
- `startBrowserAgent()` - Initialize browser automation with LLM configuration
- `agent.act()` - Execute natural language automation tasks
- `agent.extract()` - Extract structured data using Zod schemas
- `agent.nav()` - Direct URL navigation
- `agent.stop()` - Clean shutdown

### LLM Configuration
Only large visually grounded models are supported. This project uses:
```ts
llm: {
  provider: "claude-code",
  options: {
    model: "claude-sonnet-4-20250514",
  },
}
```

For questions about compatible LLMs, refer users to https://docs.magnitude.run/core-concepts/compatible-llms

## Support Resources
- Documentation: https://docs.magnitude.run
- Full LLM docs: https://docs.magnitude.run/llms-full.txt  
- Discord: https://discord.gg/VcdpMh9tTy
- GitHub: https://github.com/magnitudedev/magnitude

## Magnitude Framework Reference

### Basic Usage Example
```ts
import { startBrowserAgent } from 'magnitude-core';

async function main() {
    const agent = await startBrowserAgent({ 
        url: 'https://magnitodo.com'
    });
    await agent.act('create 3 todos');
    await agent.stop();
}
```

### Configuration Options
```ts
await startBrowserAgent({
    url: "https://google.com", 
    narrate: true, // Show thoughts and actions for debugging
    llm: {
        provider: 'anthropic',
        options: {
            model: 'claude-sonnet-4-20250514',
            apiKey: process.env.ANTHROPIC_API_KEY
        }
    },
    prompt: 'Prefer mouse to keyboard when filling out form fields', // Only when necessary
    browser: {
        launchOptions: {
            args: ["--remote-debugging-port=9222"]
        },
        contextOptions: {
            viewport: { width: 1280, height: 720 } // Default 1024x768 usually best
        }
    }
});
```

### Acting with Options
```ts
await agent.act([
    'create 3 todos',
    'check off the first todo'
], {
    prompt: 'Special instructions for LLM',
    data: { title: 'Task name', priority: 'high' }
});
```

### Data Extraction
```ts
const tasks = await agent.extract(
    'list all tasks',
    z.array(z.object({
        title: z.string(),
        status: z.enum(['todo', 'inprogress', 'done']),
        priority: z.enum(['low', 'medium', 'high', 'urgent'])
    }))
);
```

### Advanced Pattern: Combining Automation with Logic
```ts
const urgentTasks = tasks.filter(
    task => task.priority === 'urgent' && task.status === 'todo'
);
if (urgentTasks.length > 10) {
    await agent.act('create a new task', {
        data: {
            title: 'get some of these urgent tasks done!',
            description: urgentTasks.map(task => task.title).join(', ')
        }
    });
}
```

### Important Notes
- Only large visually grounded models supported (Claude Sonnet 4 recommended)
- Every `agent.act()` automatically waits for page load - no manual waiting needed
- Access to raw Playwright via `agent.page` and `agent.context` for low-level operations
- Use `agent.nav()` for direct URL navigation when needed
