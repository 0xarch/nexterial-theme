const language = {
    'en-US': 'English',
    'en-GB': 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'fr': '法语'
}

export function ltl(lang) {
    return language[lang] ?? lang;
}

export function _i18n(ctx) {
    return (key, language) => {
        let currentI18n = {};
        let fallbackI18n = {};
        for (let i18nUsable of ctx.i18ns) {
            if (i18nUsable.id === language) {
                currentI18n = i18nUsable.value;
                break;
            } else if (i18nUsable.id === 'default' || i18nUsable.id === 'fallback') {
                fallbackI18n = i18nUsable.value;
            }
        }
        let result = '';
        if (/[0-9]/.test(key)) {
            let replaceList = [];
            for (let item of (/[0-9]+/g).exec(key) ?? []) {
                key = key.replace(item, '{NUMBER}');
                replaceList.push(item);
            }
            result = currentI18n[key] ?? fallbackI18n[key] ?? key;
            for (let item of replaceList) {
                result = result.replace('{NUMBER}', item);
            }
        }
        else {
            result = currentI18n[key] ?? fallbackI18n[key] ?? key;
        }
        return result;
    }
}