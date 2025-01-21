import { argbFromHex, rgbaFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

export let theme = themeFromSourceColor(argbFromHex('#3273d2'));

export default function install(ctx) {
    if (ctx?.config?._custom_color) {
        theme = themeFromSourceColor(argbFromHex(String(ctx.config._custom_color)));
    }
}

function rgbaStringFrom(argb) {
    let rgba = rgbaFromArgb(argb);
    return `${rgba.r.toString(16).padStart(2,0)}${rgba.g.toString(16).padStart(2,0)}${rgba.b.toString(16).padStart(2,0)}${rgba.a.toString(16).padStart(2,0)}`;
}

/**
 * 
 * @param {import("@material/material-color-utilities").Theme} theme 
 */
export function themeToCss(theme) {
    let converted = ':root {';
    converted += `--source: #${rgbaStringFrom(theme.source)};`;
    for (let [k, v] of Object.entries(theme.schemes.light.toJSON())) {
        converted += `--${k}: #${rgbaStringFrom(v)};`;
    };
    converted += '}';
    converted += `@media(prefers-color-scheme:dark){:root{`;
    for (let [k, v] of Object.entries(theme.schemes.dark.toJSON())) {
        converted += `--${k}: #${rgbaStringFrom(v)};`;
    };
    converted += '}}';
    return converted;
}