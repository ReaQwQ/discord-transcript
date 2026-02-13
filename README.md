# discord-transcript

**A standalone tool to generate Discord transcripts.**
It creates HTML files from Discord channels. It does not use `discord.js`.

---

## ✨ Features

- **No Dependencies**: It uses the Discord API directly. It does not need `discord.js`.
- **Discord Design**: The output looks like the Discord Dark Theme. It uses the correct fonts and colors.
- **Rich Content**:
    - **Embeds**: Supports titles, descriptions, images, and authors.
    - **Attachments**: Shows images and provides download links for files.
    - **Reactions**: Supports custom emojis and standard emojis.
    - **Roles**: Shows the correct colors and icons for roles.
    - **Replies**: You can click a reply to go to the original message.
- **Syntax Highlighting**: Automatically detects code languages.
- **Secure**: It runs locally on your computer. No data is sent to other servers.

## 📦 Installation

```bash
npm install @reaqwq/discord-transcript
# or
yarn add @reaqwq/discord-transcript
```

## 🚀 Usage

### Library Usage

You can use this in your Node.js code:

```typescript
import { Transcripter } from '@reaqwq/discord-transcript';

async function generate() {
    // 1. Setup with your Bot Token
    const transcript = new Transcripter('YOUR_DISCORD_BOT_TOKEN');

    // 2. Get messages from the channel
    const data = await transcript.fetch('GUILD_ID', 'CHANNEL_ID');

    // 3. Create the HTML file
    // Options: dir (folder path)
    const html = data.generate({ dir: './output' });
    
    console.log("Success!");
}

generate();
```

### CLI Usage

You can use the command line tool without installing it globally:

```bash
npx @reaqwq/discord-transcript --token "YOUR_TOKEN" --guildId "GUILD_ID" --channelId "CHANNEL_ID"
```

**Arguments:**

| Argument | Description | Required |
| :--- | :--- | :--- |
| `--token` | Your Discord Bot Token | Yes |
| `--guildId` | The ID of the Server | Yes |
| `--channelId` | The ID of the Channel | Yes |

## 🛠️ Development

To modify this project:

1. **Clone and Install**
   ```bash
   git clone https://github.com/ReaQwQ/discord-transcript.git
   cd discord-transcript
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   npm run start -- --token "..." --guildId "..." --channelId "..."
   ```

3. **Build the Executable**
   This creates `transcript.exe`:
   ```bash
   npm run build
   ```

## 📂 Project Files

- `src/core`: Main logic files
- `src/types`: TypeScript definitions
- `src/generator`: HTML creation logic
- `example.ts`: The entry point for the CLI

## 📄 License

MIT License
