import { navBarInit } from './navBar.mjs';
// import { toc } from './toc.mjs';
import { findAndInitGiscus } from './giscus.mjs';
import { SmoothNavigator } from './smoothNav.mjs';

function isSpider() {
    const userAgent = navigator.userAgent.toLowerCase();
    const spiderKeywords = [
        'googlebot', 'bingbot', 'baiduspider', 'yandexbot',
        'duckduckbot', 'slurp', 'facebot', 'twitterbot'
    ];
    return spiderKeywords.some(keyword => userAgent.includes(keyword));
}

((window) => {
    window.SINGLE_REM = parseInt(window.getComputedStyle(document.documentElement).fontSize);
    globalThis.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
})(window);

if (!isSpider()) {
    window.__smoothNavigator = new SmoothNavigator(window, onPageProcess);
}

export function onPageProcess() {
    document.body.classList.remove('main-anim-finished');
    // giscus
    findAndInitGiscus();
    // TOC
    // toc();
    // NavigationBar
    navBarInit();
    // Smooth Navigate
    window.__smoothNavigator.applyTo(':is(.--smooth,.__)', onPageProcess);
    // highlight
    setTimeout(() => {
        if (window.hljs) {
            hljs.highlightAll();
        }
    }, 500);
    // animation
    document.body.classList.add('main-anim');
    setTimeout(() => {
        document.body.classList.remove('main-anim');
        document.body.classList.add('main-anim-finished');
    }, 350);
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('0xarch.github.io/color-hue'))
        document.documentElement.style.setProperty('--config-hue', localStorage.getItem('0xarch.github.io/color-hue'));
    new Promise((resolve, reject) => {
        try {
            if (document.getElementById('NEO_SIDE')) {
                fetch(`/neo/side-widgets.${document.documentElement.lang}/index.html`)
                    .then((resp) => resp.text())
                    .then((value) => {
                        document.getElementById('NEO_SIDE').innerHTML = value;
                        resolve();
                    });
            } else {
                resolve();
            }
        } catch (e) { }
    }).then(() => {
        document.body.classList.add('dom-loaded');
        setTimeout(scrollToTop, 0);
        onPageProcess();
        try {
            const NAV_ROOT = document.querySelector('header.global');
            NAV_ROOT.classList.add('anim');
            setTimeout(() => {
                NAV_ROOT.classList.remove('anim')
            }, 500);
        } catch (e) { }
    });
})
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
document.addEventListener('DOMContentLoaded', () => {
    if(navigator.userAgent.includes('Android')){
        document.getElementById('NEO_MAIN').style.setProperty('padding-bottom','80px');
    }
    if (document.querySelector('meta[data-nosplash="1"]') && window.location.href.endsWith('/')) {
        history.replaceState('', '', window.location.href.slice(0, window.location.href.length - 1));
    }
    else     if (document.querySelector('meta[data-nosplash="1"]') && window.location.href.endsWith('/index.html')) {
        history.replaceState('', '', window.location.href.slice(0, window.location.href.length - 11));
    }
})