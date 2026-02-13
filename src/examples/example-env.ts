import { Transcripter } from '../index';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Example using .env file for configuration.
 * Ensure you have a .env file with:
 * DISCORD_TOKEN=...
 * CHANNEL_ID=...
 * GUILD_ID=...
 */
async function main() {
    const token = process.env.DISCORD_TOKEN;
    const channelId = process.env.CHANNEL_ID;
    const guildId = process.env.GUILD_ID;

    if (!token || !channelId || !guildId) {
        console.error("Please provide DISCORD_TOKEN, CHANNEL_ID, and GUILD_ID in .env file");
        process.exit(1);
    }

    console.log("Initializing Transcripter...");
    const transcript = new Transcripter(token);

    console.log(`Fetching messages for channel ${channelId} in guild ${guildId}...`);
    try {
        const data = await transcript.fetch(guildId, channelId);
        console.log("Fetch complete!");

        console.log("Generating HTML...");
        const outputDir = './output';
        const html = data.generate({ dir: outputDir });
        console.log(`HTML generated and saved to ${outputDir}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
