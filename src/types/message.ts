import { DiscordUser } from './user';
import { ChannelInfo } from './channel';
import { DiscordMember } from './guild';
import { DiscordEmbed } from './embed';
import { DiscordEmoji, DiscordReaction } from './emoji';

/**
 * Represents a file attached
 * to a message.
 */
export interface DiscordAttachment {
    id: string;
    filename: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number | null;
    width?: number | null;
    ephemeral?: boolean;
}

/**
 * Represents a message sent
 * in a channel.
 */
export interface DiscordMessage {
    id: string;
    channel_id: string;
    author: DiscordUser;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: DiscordUser[];
    mention_roles: string[];
    mention_channels?: any[];
    attachments: DiscordAttachment[];
    embeds: DiscordEmbed[];
    reactions?: DiscordReaction[];
    nonce?: number | string;
    pinned: boolean;
    webhook_id?: string;
    type: number;
    activity?: any;
    application?: any;
    application_id?: string;
    message_reference?: {
        message_id?: string;
        channel_id?: string;
        guild_id?: string;
        fail_if_not_exists?: boolean;
    };
    flags?: number;
    interaction?: any;
    thread?: ChannelInfo;
    components?: any[];
    sticker_items?: any[];
    stickers?: any[];
    position?: number;
    member?: DiscordMember;
    referenced_message?: DiscordMessage | null;
}
