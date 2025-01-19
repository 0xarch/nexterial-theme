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

export async function generateCodeLine() {
    document.querySelectorAll('#markdown_fillContent pre')?.forEach?.(element => {
        let code = element.querySelector('code');
        let con = document.createElement('div'), len = code.textContent.split("\n").length;
        con.classList.add('line-index');
        con.setAttribute('aria-hidden', true);
        for (let i = 1; i < len; i++) {
            let index_el = document.createElement('i');
            index_el.textContent = i;
            con.appendChild(index_el);
        }
        element.appendChild(con);
    });
}

const TOC = (markdown_content, toc) => {
    console.log('TOC called');
    if (!toc) {
        console.error(`No {toc} specified.`);
        return;
    }
    if (!markdown_content) {
        console.error(`No {markdown_content} specified.`);
        toc.innerHTML = '';
        return;
    }
    let tocList = markdown_content.querySelectorAll("h2, h3, h4, h5, h6");
    let liList = [];
    tocList.forEach((v) => {
        const H = v.nodeName[1];
        let li = document.createElement('li');
        li.classList.add(`li-${H}`);
        // li.setAttribute('pid', pid);
        li.textContent = v.textContent;
        li.addEventListener("click", () => {
            window.scrollBy({ top: v.getBoundingClientRect().y, behavior: "smooth" });
        });
        toc.appendChild(li);
        liList.push(li);
    })
    let tocArr = Array.from(tocList);
    const removeClass = () => {
        liList.forEach(v => v.classList.remove("active"));
    }
    const update = () => {
        for (let i = 0; i < tocArr.length; i++) {
            let v = tocArr[i];
            let rect = v.getBoundingClientRect();
            let top = rect.top + rect.height;
            if (top > 0) {
                removeClass();
                let li = liList[i];
                li.classList.add('active');
                break;
            }
        }
    }
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            })
        }
        ticking = true;
    });
    update();
}

export async function generateToc() {
    let toc = document.getElementById('markdown_TOC');
    let md_content = document.getElementById('markdown_fillContent');
    TOC(md_content, toc);
}