# Discord Transcript Library

A powerful, standalone Discord transcript generator for keeping records of your channels.
Generates beautiful, static HTML files with support for Embeds, Attachments, Reactions, Roles, and more.

## Features

- **Standalone**: No dependency on `discord.js`. Uses direct API calls.
- **Beautiful Output**: mimic Discord's dark theme (Inter font, colors, layout).
- **Rich Content**: Supports:
    - Embeds (Images, Fields, Footers, Authors)
    - Attachments (Images preview, Files download)
    - Reactions (Custom and Unicode)
    - Replies (Click to jump)
    - System Messages (Pinned, Thread created, etc. - *Basic support*)
- **Syntax Highlighting**: Code blocks with language detection (`highlight.js`).
- **Emojis**: Unicode emojis and Custom emojis with CDN links.
- **Roles**: Renders role colors and icons.

## Installation

```bash
npm install transcript-lib
# or
yarn add transcript-lib
```

## Usage

### Library Usage

```typescript
import { Transcripter } from 'transcript-lib';

async function generate() {
    const transcript = new Transcripter('YOUR_DISCORD_BOT_TOKEN');

    // Fetch messages
    const data = await transcript.fetch('GUILD_ID', 'CHANNEL_ID');

    // Generate HTML
    // Saves to ./output/transcript-CHANNELID.html by default
    const html = data.generate({ dir: './output' });
    
    console.log("Generated!");
}

generate();
```

### CLI Usage

You can use the built executable or run the script directly.

#### Run with Arguments

```bash
# Development
npm run start -- --token "YOUR_TOKEN" --guildId "GUILD_ID" --channelId "CHANNEL_ID"

# Built Executable (after npm run build)
./transcript.exe --token "YOUR_TOKEN" --guildId "GUILD_ID" --channelId "CHANNEL_ID"
```

Arguments:
- `--token`: Your Discord Bot Token
- `--guildId`: Target Guild ID
- `--channelId`: Target Channel ID

## Development

1. **Clone & Install**
   ```bash
   git clone ...
   npm install
   ```

2. **Run CLI (Dev)**
   ```bash
   npm run start -- --token "..." --guildId "..." --channelId "..."
   ```

3. **Build Executable**
   ```bash
   npm run build
   ```
   This will create `transcript.exe` (Windows).

## Structure

- `src/core`: Main logic (`Transcripter`, `TranscriptData`)
- `src/types`: Discord API Types
- `src/generator`: HTML generation logic (`render`, `styles`, `utils`)
- `src/cli.ts`: CLI entry point

## License

MIT
