import * as fs from 'fs';
import * as path from 'path';
import { DiscordMessage, ChannelInfo, GuildInfo, DiscordRole } from '../types';
import { generateHtml } from '../generator/render';

/**
 * Holds transcript data.
 * Can generate HTML output.
 */
export class TranscriptData {
    private messages: DiscordMessage[];
    private channel: ChannelInfo;
    private guild?: GuildInfo;
    private roles: DiscordRole[];

    constructor(messages: DiscordMessage[], channel: ChannelInfo, guild?: GuildInfo, roles: DiscordRole[] = []) {
        this.messages = messages;
        this.channel = channel;
        this.guild = guild;
        this.roles = roles;
    }

    /**
     * Generates the HTML transcript.
     * 
     * @param options.dir Output directory
     * @param options.fileName Output filename
     */
    public generate(options?: { dir?: string; fileName?: string }): string {
        const html = generateHtml(this.messages, this.channel, this.guild, this.roles);

        if (options && options.dir) {
            const fileName = options.fileName || `transcript-${this.channel.id}.html`;
            const fullPath = path.join(options.dir, fileName);

            if (!fs.existsSync(options.dir)) {
                fs.mkdirSync(options.dir, { recursive: true });
            }

            fs.writeFileSync(fullPath, html, 'utf-8');
        }

        return html;
    }
}
