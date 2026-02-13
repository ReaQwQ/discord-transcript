#!/usr/bin/env node
import { Transcripter } from './index';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse arguments manually to avoid dependencies.
 * Expected format: --token "TOKEN" --guildId "ID" --channelId "ID"
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const config: { [key: string]: string } = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2).toLowerCase(); // token, guildid, channelid
            const value = args[i + 1];
            if (value && !value.startsWith('--')) {
                config[key] = value;
                i++;
            }
        }
    }
    return config;
}

async function main() {
    const args = parseArgs();
    const token = args['token'];
    const guildId = args['guildid'];
    const channelId = args['channelid'];

    if (!token || !guildId || !channelId) {
        console.error("Usage: node example-cli.js --token <TOKEN> --guildId <GUILD_ID> --channelId <CHANNEL_ID>");
        process.exit(1);
    }

    console.log("Initializing Transcripter...");
    const transcript = new Transcripter(token);

    console.log(`Fetching messages for channel ${channelId}...`);
    try {
        const data = await transcript.fetch(guildId, channelId);
        console.log("Fetch complete!");

        console.log("Generating HTML...");
        const outputDir = './output';
        // Create output dir if not exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const html = data.generate({ dir: outputDir });
        console.log(`HTML generated and saved to ${outputDir}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
