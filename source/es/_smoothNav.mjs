const DOMParserI = new DOMParser();

const Reload = {
    goTo: async function (url, isBack = false, DoOthers) {
        document.body.classList.add('being-replaced');
        scrollToTop();
        let NEO_REPLACE_NODE = document.querySelector('#centerCol');
        document.querySelector('#globalHeader').classList.remove('collapsed');
        let least_timer = new Promise(resolve => setTimeout(resolve, 250)), lang_timer = new Promise(resolve => setTimeout(resolve,500));
        let content = await (await fetch(url)).text();
        let newDocument = DOMParserI.parseFromString(content, 'text/html');
        let targetLanguage = newDocument.documentElement.lang, currentLanguage = document.documentElement.lang;
        if(targetLanguage != currentLanguage){
            document.body.classList.remove('dom-loaded');
        }
        await least_timer;
        // set url
        if (!isBack) passedLocation.push(url);
        window.history[isBack ? 'replaceState' : 'pushState']('', '', url);
        // process head.
        document.head.querySelector('title').innerHTML = newDocument.head.querySelector('title').innerHTML;
        // process multi-language
        if(targetLanguage != currentLanguage){
            try {
                let targetSideWidget = await (await fetch(`/neo/side.left.${targetLanguage}/index.html`)).text();
                document.querySelector('#leftCol').innerHTML = targetSideWidget;
                let currentNav = document.body.querySelector('#globalHeader');
                let targetNav = newDocument.body.querySelector('#globalHeader');
                currentNav.innerHTML = targetNav.innerHTML;
                currentNav.removeAttribute('mounted');
            } catch(e) {
            }
            document.documentElement.lang = targetLanguage;
            await lang_timer;
            document.body.classList.add('dom-loaded');
        }
        // process body
        document.body.classList.add('not-ready');
        document.body.classList.remove('being-replaced');
        NEO_REPLACE_NODE.innerHTML = newDocument.querySelector('#centerCol').innerHTML;
        document.body.classList.remove('not-ready');
        // scroll pos
        DoOthers();
    }
}

export default Reload;