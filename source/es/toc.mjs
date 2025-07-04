const TOC = (markdown_content, toc) => {
    if (!markdown_content) {
        console.error(`No {markdown_content} specified.`);
        return;
    }
    if (!toc) {
        console.error(`No {toc} specified.`);
        return;
    }
    let tocList = markdown_content.querySelectorAll("h2, h3, h4, h5, h6");
    let liList = [];
    tocList.forEach((v) => {
        const H = v.nodeName[1];
        let li = document.createElement('li');
        li.classList.add(`li-${H}`);
        v.id = v.textContent.replace(/ /g, '_');
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
        if (window.scrollY > visualViewport.height / 100 * 46.25) {
            toc.classList.remove('hide');
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
        } else {
            toc.classList.add('hide');
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

export async function toc() {
    let toc = document.getElementById('markdown_TOC');
    let md_content = document.getElementById('markdown_fillContent');
    TOC(md_content, toc);
}