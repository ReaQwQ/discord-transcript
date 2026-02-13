/**
 * Footer for an embed.
 */
export interface DiscordEmbedFooter {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

/**
 * Image for an embed.
 */
export interface DiscordEmbedImage {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * Thumbnail for an embed.
 */
export interface DiscordEmbedThumbnail {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * Video for an embed.
 */
export interface DiscordEmbedVideo {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * Provider for an embed.
 */
export interface DiscordEmbedProvider {
    name?: string;
    url?: string;
}

/**
 * Author of an embed.
 */
export interface DiscordEmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

/**
 * Field in an embed.
 */
export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

/**
 * Represents a rich embed
 * included in a message.
 */
export interface DiscordEmbed {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: DiscordEmbedFooter;
    image?: DiscordEmbedImage;
    thumbnail?: DiscordEmbedThumbnail;
    video?: DiscordEmbedVideo;
    provider?: DiscordEmbedProvider;
    author?: DiscordEmbedAuthor;
    fields?: DiscordEmbedField[];
}
