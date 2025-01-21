import { navBarInit } from './navBar.mjs';
import { findAndInitGiscus, generateCodeLine, generateToc } from './some.mjs';

globalThis._Emitter = {
    emitted: {},
    on(emitName,fn){
        this.emitted[emitName] ??= [];
        this.emitted[emitName].push(fn);
    },
    emit(emitName,...args){
        if(Array.isArray(this.emitted[emitName])){
            this.emitted[emitName].forEach(v => {
                v(...args);
            })
        }
    },
    clearEmit(emitName){
        this.emitted[emitName] = [];
    }
};

((window) => {
    globalThis.SINGLE_REM = parseInt(window.getComputedStyle(document.documentElement).fontSize);
    globalThis.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
})(window);

const centerPjax = new Pjax({
    elements: "a.--smooth",
    selectors: [
        "#centerCol",
        "#globalHeader",
        "title"
    ],
    cacheBust: false,
    scrollTo: false
});

let oldLang = document.documentElement.lang, newLang = document.documentElement.lang;

async function mountWidgets(lang = document.documentElement.lang) {
    try {
        let leftContent = await ((await fetch(`/neo/side.left.${lang}/index.html`)).text());
        let rightContent = await ((await fetch(`/neo/side.right.${lang}/index.html`)).text());
        document.getElementById('leftCol').innerHTML = leftContent;
        document.getElementById('rightCol').innerHTML = rightContent;
        centerPjax.refresh();
    } catch (e) {
        console.error(e);
    }
}

async function dealMultiLanguage() {
    if (oldLang != newLang) {
        console.log(oldLang,'is different from',newLang);
        await mountWidgets(newLang);
    }
}

async function doPageWork() {
    findAndInitGiscus();
    await dealMultiLanguage();
    await generateCodeLine();
    await generateToc();
    scrollToTop();
    document.querySelectorAll('#markdown_fillContent img')?.forEach?.(el =>{
        el.src = el.src;
    });
}

document.addEventListener('pjax:send', (e) => {
    console.log('Pjax start', e);
    oldLang = document.body.querySelector('#centerCol').lang;
    document.body.classList.remove('anim-ready');
});

document.addEventListener('pjax:complete', async (e) => {
    console.log('Pjax end', e);
    newLang = document.body.querySelector('#centerCol').lang;
    navBarInit();
    await doPageWork(e);
    await new Promise((r)=>{
        setTimeout(r,0);
    });
    document.body.classList.add('anim-ready');
})

window.centerPjax = centerPjax;

document.addEventListener('DOMContentLoaded', async () => {
    navBarInit();
    await mountWidgets();
    document.body.classList.add('dom-loaded');
    setTimeout(scrollToTop, 0);
    doPageWork();
    onResize();
})

let tickingResize = false;

function onResize() {
    if (tickingResize) return;
    tickingResize = true;
    window.requestAnimationFrame(() => {
        if (window.innerWidth <= 1024) {
            let left = document.querySelector('#leftColWrapper');
            let right = document.querySelector('#rightCol');
            left.appendChild(right);
        } else {
            let main = document.querySelector('#globalMain');
            let right = document.querySelector('#rightCol');
            main.appendChild(right);
        }
        tickingResize = false;
    });
}

window.addEventListener('resize', onResize);
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});