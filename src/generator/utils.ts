import hljs from 'highlight.js';
import * as emoji from 'node-emoji';
import { DiscordUser, DiscordRole } from '../types';

/**
 * Escapes HTML characters.
 * @param unsafe String to escape
 */
export function escapeHtml(unsafe: string | null | undefined): string {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Formats message content with mentions,
 * markdown, and emojis.
 * @param content Raw content
 * @param mentions Mentioned users
 * @param roles Guild roles
 */
export function formatContent(content: string, mentions: DiscordUser[], roles: DiscordRole[]): string {
    if (!content) return '';
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map(part => {
        if (part.startsWith('```') && part.endsWith('```')) {
            const match = part.match(/^```(\w+)?\s*([\s\S]*?)```$/);
            if (match) {
                const lang = match[1] || 'plaintext';
                const code = match[2];
                let highlighted;
                try {
                    highlighted = (lang && hljs.getLanguage(lang)) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value;
                } catch (e) {
                    highlighted = escapeHtml(code);
                }
                return `<pre><code class="code hljs ${escapeHtml(lang || '')}">${highlighted}</code></pre>`;
            }
            return escapeHtml(part);
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
        }

        /**
         * Emojify first (convert :smile:
         * to unicode).
         */
        let processed = emoji.emojify(part);
        processed = escapeHtml(processed);

        processed = processed.replace(/&lt;(a?):(\w+):(\d+)&gt;/g, (m, a, n, id) => `<img class="emoji" src="https://cdn.discordapp.com/emojis/${id}.${a ? 'gif' : 'png'}" alt=":${n}:" title=":${n}:">`);
        processed = processed.replace(/&lt;@!?(\d+)&gt;/g, (m, id) => {
            const u = mentions.find(u => u.id === id);
            return `<span class="mention" title="${escapeHtml(u?.username || id)}">@${escapeHtml(u?.global_name || u?.username || id)}</span>`;
        });
        processed = processed.replace(/&lt;@&amp;(\d+)&gt;/g, (m, id) => {
            const r = roles.find(r => r.id === id);
            if (r) {
                const c = r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#dee0fc';
                const bg = r.color ? `rgba(${r.color >> 16}, ${(r.color >> 8) & 0xFF}, ${r.color & 0xFF}, 0.1)` : 'rgba(88,101,242,0.3)';
                return `<span class="mention" style="color:${c};background-color:${bg}">@${escapeHtml(r.name)}</span>`;
            }
            return '<span class="mention">@Role</span>';
        });
        processed = processed.replace(/&lt;#(\d+)&gt;/g, '<span class="mention">#Channel</span>');
        processed = processed.replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>');
        processed = processed.replace(/\*([^*]+)\*/g, '<i>$1</i>');
        processed = processed.replace(/_([^_]+)_/g, '<i>$1</i>');
        processed = processed.replace(/__([^_]+)__/g, '<u>$1</u>');
        processed = processed.replace(/~~([^~]+)~~/g, '<s>$1</s>');
        processed = processed.replace(/(?<!["=])(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
        processed = processed.replace(/\n/g, '<br>');
        return processed;
    }).join('');
}
