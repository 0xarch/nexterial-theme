import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

let current_used_ms_list = {};

const __dirname = dirname(fileURLToPath(import.meta.url));

function _join_svg(id, obj, is_first = false) {
    if (is_first) {
        return obj.prefix + `<symbol id="svg:${id}" viewBox="${obj.viewBox}">${obj.inner}</symbol><use xlink:href="#svg:${id}"></use>` + obj.suffix;
    } else {
        return obj.prefix + `<use xlink:href="#svg:${id}"></use>` + obj.suffix;
    }
}

const ms_prefix = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960">',
    ms_suffix = '</svg>';

const cor_prefix = `<svg height="1em" width="1em">`;

export function get_material_symbols(str, type, add = '', force = false) {
    const id = `${str}-${type}`;
    if (!force && Object.keys(current_used_ms_list).includes(id)) {
        if (add) {
            let obj = structuredClone(current_used_ms_list[id]);
            obj.prefix = obj.prefix.replace('>', ` ${add}>`);
            return _join_svg(id, obj);
        }
        return _join_svg(id, current_used_ms_list[id]);
    }
    let target = join(process.cwd(), 'node_modules/@material-symbols/svg-600/', type, `${str}.svg`);
    if (!existsSync(target)) {
        target = join(__dirname, '../../../@material-symbols/svg-600/', type, `${str}.svg`);
        if (!existsSync(target)) {
            target = join(__dirname, '../node_modules/@material-symbols/svg-600', type, `${str}.svg`);
            if (!existsSync(target)) {
                console.error(`[ERROR] Theme helper error: Cannot find \`${target}\` for: ${id} from: ${import.meta.filename}`);
                return;
            }
        }
    }
    const file = readFileSync(target).toString();
    let obj = {
        prefix: cor_prefix,
        suffix: ms_suffix,
        viewBox: "0 -960 960 960",
        inner: file.replace(ms_prefix, '').replace(ms_suffix, ''),
    }
    if(!force){
        current_used_ms_list[id] = obj;
    }
    if (add) {
        let _obj = structuredClone(obj);
        _obj.prefix = obj.prefix.replace('>', ` ${add}>`);
        return _join_svg(id, _obj, true);
    }
    return _join_svg(id, obj, true);
}

export function reset_material_symbols() {
    current_used_ms_list = {};
}