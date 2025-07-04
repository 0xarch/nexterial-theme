let domParser = new DOMParser();
let fetched = false;
let scriptElement = null;
let scriptContent = '';

export async function findAndInitGiscus() {
    /**
     * @type {Element}
     */
    let element = document.querySelector('._giscus_script')
    if (element) {
        scriptElement = domParser.parseFromString(element.textContent, 'text/html').querySelector('script');
        let __script_id = `__temp_giscus_script`;
        scriptElement.id = __script_id;
        element.insertAdjacentElement('afterend', scriptElement);
        element.remove();
        if (!fetched) {
            scriptContent = (await (await fetch(scriptElement.src)).text()).replace(`document.currentScript`, `document.querySelector("#${__script_id}")`);
            fetched = true;
        }
        eval(scriptContent);
    } else {
        console.error(`No _giscus_script found`);
    }
}