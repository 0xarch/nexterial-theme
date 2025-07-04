const DOMParserI = new DOMParser();

export class SmoothNavigator {
    targetDocument;
    passedLocations = [];
    defaultCallback;
    /**
     * 
     * @param {Window} targetWindow 
     * @param {Function} callback 
     */
    constructor(targetWindow, callback) {
        this.targetDocument = targetWindow.document;
        this.defaultCallback = callback;
        this.passedLocations.push(targetWindow.location.href);
        targetWindow.addEventListener('popstate', () => {
            this.passedLocations.pop();
            if (!this.passedLocations.length) return;
            this.navigate(this.passedLocations[this.passedLocations.length - 1], this.defaultCallback, { isBack: true });
        });
    }

    async navigate(url, callback, {
        isBack = false,
        scrollToTop = true,
    } = {}) {
        const document = this.targetDocument;
        document.body.classList.add(`being-replaced`);
        if (scrollToTop) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: `smooth`,
            });
        }
        let NEO_REPLACE_NODE = document.querySelector('#NEO_REPLACE');
        document.querySelector('header.global')?.classList?.remove('collapsed');
        let least_timer = new Promise(resolve => setTimeout(resolve, 250)), lang_timer = new Promise(resolve => setTimeout(resolve, 500));
        let content = await (await fetch(url)).text();
        let newDocument = DOMParserI.parseFromString(content, 'text/html');
        let targetLanguage = newDocument.documentElement.lang, currentLanguage = document.documentElement.lang;
        if (targetLanguage != currentLanguage) {
            document.body.classList.remove('dom-loaded');
        }
        await least_timer;
        // set url
        if (!isBack) this.passedLocations.push(url);
        window.history[isBack ? 'replaceState' : 'pushState']('', '', url);
        // process head.
        document.head.querySelector('title').innerHTML = newDocument.head.querySelector('title')?.innerHTML;
        document.head.querySelectorAll('meta').forEach(el => el.remove());
        newDocument.head.querySelectorAll('meta').forEach(el => document.head.appendChild(el));
        // process multi-language
        if (targetLanguage != currentLanguage) {
            try {
                let targetSideWidget = await (await fetch(`/neo/side-widgets.${targetLanguage}/index.html`)).text();
                document.querySelector('#NEO_SIDE').innerHTML = targetSideWidget;
                let currentNav = document.body.querySelector('header.global');
                let targetNav = newDocument.body.querySelector('header.global');
                currentNav.innerHTML = targetNav.innerHTML;
                currentNav.removeAttribute('mounted');
            } catch (e) {
            }
            document.documentElement.lang = targetLanguage;
            await lang_timer;
            document.body.classList.add('dom-loaded');
        }
        // process body
        document.body.classList.add('not-ready');
        document.body.classList.remove('being-replaced');
        NEO_REPLACE_NODE.innerHTML = newDocument.querySelector('#NEO_REPLACE').innerHTML;
        document.body.classList.remove('not-ready');
        // misc jobs
        if (scrollToTop) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: `smooth`,
            });
        }
        callback();
    }
    applyTo(selectors, callback) {
        const document = this.targetDocument;
        document.querySelectorAll(selectors).forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(el.getAttribute('href'), callback);
            })
            el.classList.remove('--smooth');
        })
    }
}