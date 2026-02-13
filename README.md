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

### CLI Usage (Standalone Executable)

If you have built the executable (`npm run build:file`):

```bash
./transcript-cli.exe --token "YOUR_TOKEN" --guildId "123..." --channelId "456..."
```

## Configuration

You can configure the fetch limit using options:

```typescript
const transcript = new Transcripter(token, {
    fetchLimit: 500 // Limit to 500 messages (Default: Infinity)
});
```

## Development

1. **Clone & Install**
   ```bash
   git clone ...
   npm install
   ```

2. **Setup .env**
   Copy `.env.example` (if exists) or create `.env`:
   ```env
   DISCORD_TOKEN=...
   GUILD_ID=...
   CHANNEL_ID=...
   ```

3. **Run Examples**
   - **Env Mode**: Uses `.env` variables.
     ```bash
     npm run start:env
     ```
   - **CLI Mode**: Uses arguments.
     ```bash
     npm run start:cli -- --token "..." --guildId "..." --channelId "..."
     ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Package (exe)**
   ```bash
   npm run build:file
   ```

## Structure

- `src/core`: Main logic (`Transcripter`, `TranscriptData`)
- `src/types`: Discord API Types
- `src/generator`: HTML generation logic (`render`, `styles`, `utils`)

## License

MIT
