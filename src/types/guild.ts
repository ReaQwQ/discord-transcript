import { DiscordUser } from './user';
import { DiscordEmoji } from './emoji';

/**
 * Represents a role in a Guild.
 * Contains permission and
 * cosmetic information.
 */
export interface DiscordRole {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string | null;
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: {
        bot_id?: string;
        integration_id?: string;
        premium_subscriber?: null;
    };
}

/**
 * Represents a Discord Guild
 * (Server).
 */
export interface GuildInfo {
    id: string;
    name: string;
    icon: string | null;
    icon_hash?: string | null;
    splash: string | null;
    discovery_splash: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region?: string;
    afk_channel_id: string | null;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: string | null;
    verification_level: number;
    default_message_notifications: number;
    explicit_content_filter: number;
    roles: DiscordRole[];
    emojis: DiscordEmoji[];
    features: string[];
    mfa_level: number;
    application_id: string | null;
    system_channel_id: string | null;
    system_channel_flags: number;
    rules_channel_id: string | null;
}

/**
 * Represents a member of
 * a guild.
 */
export interface DiscordMember {
    user?: DiscordUser;
    nick?: string | null;
    avatar?: string | null;
    roles: string[];
    joined_at: string;
    premium_since?: string | null;
    deaf: boolean;
    mute: boolean;
    flags?: number;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: string | null;
}
