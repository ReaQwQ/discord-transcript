import axios, { AxiosInstance } from 'axios';
import { DiscordMessage, ChannelInfo, GuildInfo, DiscordRole } from '../types';
import { TranscriptData } from './TranscriptData';

/**
 * Options for the Transcripter.
 */
export interface TranscripterOptions {
    /**
     * Max messages to fetch.
     * Default Infinity.
     */
    fetchLimit?: number;
}

/**
 * Main class for fetching
 * and generating transcripts.
 */
export class Transcripter {
    private client: AxiosInstance;
    private options: TranscripterOptions;

    constructor(token: string, options: TranscripterOptions = {}) {
        this.client = axios.create({
            baseURL: 'https://discord.com/api/v10',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'DiscordBot (https://github.com/yourname/transcript-lib, 1.0.0)'
            }
        });
        this.options = options;
    }

    /**
     * Fetches messages from a channel.
     * 
     * @param guildId The Guild ID
     * @param channelId The Channel ID
     */
    public async fetch(guildId: string, channelId: string): Promise<TranscriptData> {
        let guild: GuildInfo | undefined;
        let roles: DiscordRole[] = [];
        try {
            const guildRes = await this.client.get<GuildInfo>(`/guilds/${guildId}`);
            guild = guildRes.data;
            console.log(`Fetched Guild: ${guild.name} (${guild.id})`);

            const rolesRes = await this.client.get<DiscordRole[]>(`/guilds/${guildId}/roles`);
            roles = rolesRes.data;
            console.log(`Fetched ${roles.length} roles.`);
        } catch (e) {
            console.warn(`Failed to fetch guild info/roles for ${guildId}. Colors and Nicknames may be missing.`, e);
        }

        const channelRes = await this.client.get<ChannelInfo>(`/channels/${channelId}`);
        const channel = channelRes.data;

        const messages: DiscordMessage[] = [];
        let lastId: string | undefined;
        const limitPerFetch = 100;
        const maxMessages = this.options.fetchLimit || Infinity;

        while (messages.length < maxMessages) {
            const params: any = { limit: limitPerFetch };
            if (lastId) {
                params.before = lastId;
            }

            try {
                const msgsRes = await this.client.get<DiscordMessage[]>(`/channels/${channelId}/messages`, { params });
                const fetchedMsgs = msgsRes.data;

                if (fetchedMsgs.length === 0) {
                    break;
                }

                messages.push(...fetchedMsgs);
                lastId = fetchedMsgs[fetchedMsgs.length - 1].id;

                if (fetchedMsgs.length < limitPerFetch) {
                    break;
                }
            } catch (e) {
                console.error("Error fetching messages:", e);
                break;
            }
        }

        /**
         * 4. Fetch Members (to get
         * Guild Nicknames) and Resolve
         * Mentions. We need to fetch
         * not just authors, but anyone
         * mentioned in content/embeds
         * because the API might not
         * populate msg.mentions for
         * embed mentions.
         */
        const uniqueUserIds = new Set<string>();
        const mentionRegex = /<@!?(\d+)>/g;

        messages.forEach(m => {
            uniqueUserIds.add(m.author.id);

            /**
             * Scan content for mentions.
             */
            let match;
            while ((match = mentionRegex.exec(m.content)) !== null) {
                uniqueUserIds.add(match[1]);
            }

            /**
             * Scan embeds.
             */
            m.embeds?.forEach(embed => {
                if (embed.description) {
                    while ((match = mentionRegex.exec(embed.description)) !== null) {
                        uniqueUserIds.add(match[1]);
                    }
                }
                embed.fields?.forEach(field => {
                    while ((match = mentionRegex.exec(field.value)) !== null) {
                        uniqueUserIds.add(match[1]);
                    }
                });
            });
        });

        const memberMap = new Map<string, any>(); // Map<UserId, APIGuildMember>

        console.log(`Fetching member info for ${uniqueUserIds.size} users...`);
        const userIds = Array.from(uniqueUserIds);

        /**
         * Fetch in batches or parallel.
         * Note: For large lists, chunking
         * would be better, but Promise.all
         * is okay for < 100 usually.
         */
        await Promise.all(userIds.map(async (userId) => {
            try {
                const memberRes = await this.client.get(`/guilds/${guildId}/members/${userId}`);
                memberMap.set(userId, memberRes.data);
            } catch (e) {
                /**
                 * User might have left or
                 * is invalid.
                 */
            }
        }));

        /**
         * Attach member data to messages
         * and augment mentions.
         */
        messages.forEach(msg => {
            if (memberMap.has(msg.author.id)) {
                msg.member = memberMap.get(msg.author.id);
            }

            /**
             * Augment mentions.
             * We want to ensure formatContent
             * can resolve all IDs found in
             * the text. We add any fetched
             * user to msg.mentions if not
             * already there.
             */
            const mentionedIds = new Set(msg.mentions.map(u => u.id));

            /**
             * Re-scan to find who is
             * mentioned in THIS message.
             */
            const scanAndAdd = (text: string) => {
                let m;
                while ((m = mentionRegex.exec(text)) !== null) {
                    const id = m[1];
                    if (!mentionedIds.has(id) && memberMap.has(id)) {
                        const member = memberMap.get(id);
                        if (member.user) {
                            msg.mentions.push(member.user);
                            mentionedIds.add(id);
                        }
                    }
                }
            };

            if (msg.content) scanAndAdd(msg.content);
            msg.embeds?.forEach(embed => {
                if (embed.description) scanAndAdd(embed.description);
                embed.fields?.forEach(f => scanAndAdd(f.value));
            });
        });

        return new TranscriptData(messages.reverse(), channel, guild, roles);
    }
}
