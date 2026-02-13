/**
 * Represents a user on Discord.
 * Contains identifiers and
 * public display information.
 */
export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string | null;
    avatar?: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}
