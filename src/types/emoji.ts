import { DiscordUser } from './user';

/**
 * Represents a custom emoji.
 * Used in reactions and
 * messages.
 */
export interface DiscordEmoji {
    id: string | null;
    name: string | null;
    roles?: string[];
    user?: DiscordUser;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

/**
 * Represents a reaction to
 * a message.
 */
export interface DiscordReaction {
    count: number;
    me: boolean;
    emoji: DiscordEmoji;
}
