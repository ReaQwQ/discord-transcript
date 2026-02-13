import dayjs from 'dayjs';
import { DiscordMessage, ChannelInfo, GuildInfo, DiscordRole } from '../types';
import { css, hljsCss } from './styles';
import { escapeHtml, formatContent } from './utils';
import { TranscripterOptions } from '../core/Transcripter'; // Circular? No, options in core.

/**
 * Generates the HTML transcript.
 * @param messages List of messages
 * @param channel Channel info
 * @param guild Guild info
 * @param roles Guild roles
 */
export function generateHtml(messages: DiscordMessage[], channel: ChannelInfo, guild?: GuildInfo, roles: DiscordRole[] = []): string {
    const title = `${guild ? guild.name + ' - ' : ''}#${(channel as any).name || channel.id}`;
    roles.sort((a, b) => b.position - a.position);

    let processedMessages = '';
    let prevAuthorId = null;
    let prevTimestamp = 0;

    for (const msg of messages) {
        const unixTime = dayjs(msg.timestamp).valueOf();
        const isChained = (prevAuthorId === msg.author.id && !msg.referenced_message && (unixTime - prevTimestamp) < 5 * 60 * 1000);
        prevAuthorId = msg.author.id;
        prevTimestamp = unixTime;

        /**
         * Resolve Role/Color.
         */
        let roleColor = '', roleIcon = '';
        if (msg.member && msg.member.roles && Array.isArray(msg.member.roles)) {
            for (const r of roles) {
                if (msg.member.roles.includes(r.id)) {
                    if (!roleIcon) {
                        if (r.icon) roleIcon = `<img src="https://cdn.discordapp.com/role-icons/${r.id}/${r.icon}.png" class="role-icon" title="${escapeHtml(r.name)}">`;
                        else if (r.unicode_emoji) roleIcon = `<span class="role-icon-unicode" title="${escapeHtml(r.name)}">${r.unicode_emoji}</span>`;
                    }
                    if (!roleColor && r.color) roleColor = `#${r.color.toString(16).padStart(6, '0')}`;
                    if (roleColor && roleIcon) break;
                }
            }
        }
        const nameColor = roleColor || '#f2f3f5';
        const displayName = (msg.member?.nick) || msg.author.global_name || msg.author.username;
        const avatarUrl = msg.author.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : (msg.author.discriminator === '0' ? `https://cdn.discordapp.com/embed/avatars/${(Number(BigInt(msg.author.id) >> 22n) % 6)}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(msg.author.discriminator) % 5}.png`);


        /**
         * Attachments.
         */
        const attachmentsHtml = msg.attachments?.map(att => att.content_type?.startsWith('image/') ? `<div class="attachment"><a href="${att.url}" target="_blank"><img src="${att.url}" alt="${att.filename}"></a></div>` : `<div class="attachment file-attachment"><a href="${att.url}" target="_blank">📄 ${att.filename}</a> (${(att.size / 1024).toFixed(2)} KB)</div>`).join('') || '';

        /**
         * Embeds.
         */
        const embedsHtml = msg.embeds?.map(embed => {
            const color = embed.color ? `#${embed.color.toString(16).padStart(6, '0')}` : '#1e1f22';
            if (embed.video && (embed.provider?.name === 'YouTube' || embed.url?.includes('youtube')) && embed.video.url) {
                return `<div class="embed embed-video" style="border-left-color:${color};max-width:${embed.video.width || 400}px"><div class="embed-grid">${embed.title ? `<a href="${embed.url}" class="embed-title" target="_blank">${escapeHtml(embed.title)}</a>` : ''}<iframe width="${embed.video.width || 400}" height="${embed.video.height || 225}" src="${embed.video.url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe></div></div>`;
            }
            const fields = embed.fields?.map(f => `<div class="embed-field ${f.inline ? 'inline' : ''}"><div class="embed-field-name">${escapeHtml(f.name)}</div><div class="embed-field-value">${formatContent(f.value, msg.mentions, roles)}</div></div>`).join('') || '';
            return `<div class="embed" style="border-left-color:${color}"><div class="embed-grid">${embed.author ? `<div class="embed-author">${embed.author.icon_url ? `<img class="embed-author-icon" src="${embed.author.icon_url}">` : ''}${embed.author.url ? `<a href="${embed.author.url}" class="embed-author-name" target="_blank">${escapeHtml(embed.author.name)}</a>` : `<span class="embed-author-name">${escapeHtml(embed.author.name)}</span>`}</div>` : ''}${embed.thumbnail ? `<img class="embed-thumbnail" src="${embed.thumbnail.url}">` : ''}${embed.title ? `${embed.url ? `<a href="${embed.url}" class="embed-title" target="_blank">${escapeHtml(embed.title)}</a>` : `<div class="embed-title">${escapeHtml(embed.title)}</div>`}` : ''}${embed.description ? `<div class="embed-desc">${formatContent(embed.description, msg.mentions, roles)}</div>` : ''}${fields ? `<div class="embed-fields">${fields}</div>` : ''}${embed.image ? `<div class="embed-image"><img src="${embed.image.url}"></div>` : ''}${embed.footer ? `<div class="embed-footer">${embed.footer.icon_url ? `<img class="embed-footer-icon" src="${embed.footer.icon_url}">` : ''}${escapeHtml(embed.footer.text)}${embed.timestamp ? `<span style="margin-left:4px;">• ${dayjs(embed.timestamp).format('YYYY/MM/DD HH:mm')}</span>` : ''}</div>` : ''}</div></div>`;
        }).join('') || '';

        /**
         * Reactions.
         */
        const reactionsHtml = msg.reactions?.length ? `<div class="reactions">${msg.reactions.map(r => {
            const isMe = r.me;
            const style = isMe ? 'background-color:rgba(88,101,242,0.15);border-color:#5865f2' : 'background-color:#2f3136;border-color:transparent';
            const countStyle = isMe ? 'color:#5865f2' : 'color:#b5bac1';
            return `<div class="reaction" style="${style}" title="${escapeHtml(r.emoji.name || 'emoji')}">${r.emoji.id ? `<img class="reaction-emoji" src="https://cdn.discordapp.com/emojis/${r.emoji.id}.png">` : `<span class="reaction-emoji">${r.emoji.name}</span>`}<span class="reaction-count" style="${countStyle};margin-left:6px;">${r.count}</span></div>`;
        }).join('')}</div>` : '';

        /**
         * Reply.
         */
        let replyHtml = '';
        if (msg.referenced_message) {
            const ref = msg.referenced_message;
            const refName = (ref.member?.nick) || ref.author?.global_name || ref.author?.username || "Unknown";
            const refAva = ref.author?.avatar ? `https://cdn.discordapp.com/avatars/${ref.author.id}/${ref.author.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png";

            let refContent = ref.content || 'Click to jump';
            refContent = escapeHtml(refContent)
                .replace(/```(\w+\s)?([\s\S]*?)```/g, '<code>$2</code>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n/g, ' ');

            replyHtml = `<div class="reply-bar"><div class="reply-spine"></div><img class="reply-avatar" src="${refAva}"><div class="reply-name" onclick="document.getElementById('msg-${ref.id}').scrollIntoView({behavior:'smooth',block:'center'})">@${escapeHtml(refName)}</div><div class="reply-content" onclick="document.getElementById('msg-${ref.id}').scrollIntoView({behavior:'smooth',block:'center'})">${refContent}</div></div>`;
        }

        if (isChained) {
            processedMessages += `<div class="message-group chained" id="msg-${msg.id}"><div class="chained-timestamp">${dayjs(msg.timestamp).format('HH:mm')}</div><div class="content-wrapper" style="margin-left:72px">${formatContent(msg.content, msg.mentions, roles)}${attachmentsHtml}${embedsHtml}${reactionsHtml}</div></div>\n`;
        } else {
            processedMessages += `<div class="message-group" id="msg-${msg.id}"><div class="avatar"><img src="${avatarUrl}" alt="${escapeHtml(displayName)}"></div><div class="content-wrapper"><div class="meta"><span class="username" style="color:${nameColor}" title="${escapeHtml(msg.author.username)}">${escapeHtml(displayName)}</span>${roleIcon}${msg.author.bot ? '<span class="bot-tag">App</span>' : ''}<span class="timestamp">${dayjs(msg.timestamp).format('YYYY/MM/DD HH:mm')}</span></div>${replyHtml}<div class="content">${formatContent(msg.content, msg.mentions, roles)}</div>${attachmentsHtml}${embedsHtml}${reactionsHtml}</div></div>\n`;
        }
    }

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Transcript: ${escapeHtml(title)}</title><style>${css}</style><style>${hljsCss}</style><script src="https://unpkg.com/twemoji@latest/dist/twemoji.min.js" crossorigin="anonymous"></script></head><body><div class="container"><div class="header"><h1>Start of #${escapeHtml((channel as any).name || channel.id)}</h1><p>${messages.length} messages • Generated with Transcript Lib</p></div><div class="messages">${processedMessages}</div></div><script>twemoji.parse(document.body);</script></body></html>`;
}
