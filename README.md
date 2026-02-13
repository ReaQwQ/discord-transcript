# discord-transcript-v1

**A powerful, standalone Discord transcript generator.**
Create beautiful, static HTML channel archives without `discord.js`.

---

## ✨ Features

- **Standalone**: Zero dependency on `discord.js` for fetching. Uses direct API calls.
- **Beautiful Output**: Mimics Discord's native dark theme (Inter font, colors, layout).
- **Rich Content Support**:
    - **Embeds**: Full support for titles, descriptions, fields, images, authors, and footers.
    - **Attachments**: Image previews and file download links.
    - **Reactions**: Custom and Unicode emojis.
    - **Roles**: Renders role colors and icons.
    - **Replies**: Interactive references that scroll to the original message.
- **Syntax Highlighting**: Auto-detects languages in code blocks.
- **Secure**: Runs locally on your machine.

## 📦 Installation

```bash
npm install discord-transcript-v1
# or
yarn add discord-transcript-v1
```

## 🚀 Usage

### Library Usage

Use it programmatically in your Node.js projects:

```typescript
import { Transcripter } from 'discord-transcript-v1';

async function generate() {
    // 1. Initialize with your Bot Token
    const transcript = new Transcripter('YOUR_DISCORD_BOT_TOKEN');

    // 2. Fetch messages from a channel
    const data = await transcript.fetch('GUILD_ID', 'CHANNEL_ID');

    // 3. Generate HTML
    // Options: dir (output directory), fileName (optional)
    const html = data.generate({ dir: './output' });
    
    console.log("Transcript generated successfully!");
}

generate();
```

### CLI Usage

You can use the CLI directly via `npx` without installing it globally:

```bash
npx discord-transcript-v1 --token "YOUR_TOKEN" --guildId "GUILD_ID" --channelId "CHANNEL_ID"
```

**Arguments:**

| Argument | Description | Required |
| :--- | :--- | :--- |
| `--token` | Your Discord Bot Token | Yes |
| `--guildId` | ID of the Server (Guild) | Yes |
| `--channelId` | ID of the Channel to transcript | Yes |

## 🛠️ Development & Building

If you want to contribute or build the executable manually:

1. **Clone & Install**
   ```bash
   git clone https://github.com/ReaQwQ/discord-transcript.git
   cd discord-transcript
   npm install
   ```

2. **Run Dev Mode**
   ```bash
   npm run start -- --token "..." --guildId "..." --channelId "..."
   ```

3. **Build EXE**
   Generates a standalone `transcript.exe`:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/core`: Main logic (`Transcripter`, `TranscriptData`)
- `src/types`: Discord API Type definitions
- `src/generator`: HTML generation logic (`render`, `styles`, `utils`)
- `example.ts`: CLI entry point

## 📄 License

MIT License
