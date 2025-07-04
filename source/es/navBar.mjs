import { onPageProcess } from "./ui.mjs";

// https://juejin.cn/post/7225474899480969253
// function hslToRgb(h,s,l){let r,g,b;if (s==0){r=g=b=l;}else{let hue2rgb=function(p,q,t){if (t<0)t+=1;if (t>1)t-=1;if (t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if (t<2/3)return p+(q-p)*(2/3-t)*6;return p;};let q=l<.5?l*(1+s):l+s-l*s;let p=2*l-q;r = hue2rgb(p,q,h+1/3);g = hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3)};return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };}

export function navBarInit() {
    try {
        // const NAV_ROOT = document.querySelector('header.global');
        // Global Focus
        // let lastKnownScrollPosition = 0;
        // let ticking = false;
        // function NavFloatToggle(scrollPos) {
        //     if (scrollPos >= visualViewport.height / 100 * 37.75 - 5.5 * SINGLE_REM) {
        //         document.body.classList.add('focus');
        //     } else {
        //         document.body.classList.remove('focus');
        //     }
        // }
        // document.addEventListener("scroll", () => {
        //     if (!ticking) {
        //         window.requestAnimationFrame(() => {
        //             if (window.scrollY != lastKnownScrollPosition) {
        //                 NavFloatToggle(window.scrollY);
        //                 lastKnownScrollPosition = window.scrollY;
        //             }
        //             ticking = false;
        //         });
        //         ticking = true;
        //     }
        // });
        // palette();
        // hamburger();
        search();
        // NAV_ROOT.setAttribute('mounted', 'true');
    } catch (e) {
        console.error(e);
    }
}

/**
 * 
 * @param {Element} triggerElement 
 * @param {Element} targetElement 
 * @param {(on: boolean) => any} callback 
 * @returns {(ev: Event) => void}
 */
function __listen(triggerElement, targetElement, callback) {
    let on = false;
    let event = (e) => {
        if (e.target === triggerElement || e.target === targetElement || triggerElement.contains(e.target) || targetElement.contains(e.target)) {
            return;
        } else {
            on = false;
            callback();
        }
    };
    triggerElement.addEventListener('click', () => {
        on = !on;
        callback(on);
        if (on) {
            document.addEventListener('click', event);
        } else {
            document.removeEventListener('click', event);
        }
    });
    return event;
}

function search() {
    const Search = document.getElementById('NEO_SEARCH');
    const Button = document.getElementById('headerButtonSearch');
    const Menu = document.getElementById('headerComponentSearch');
    // __listen(Button, Menu, (on) => {
    //     Menu.classList[on ? 'add' : 'remove']('on');
    // });
    let objPromise = (async () => {
        let raw = await fetch("/search.json");
        let json = await raw.json();
        return Object.entries(json);
    })();
    let resultContainer = Search.querySelector('s-scroll-view');
    let shouldRun = true;
    async function doSearch() {
        if (!shouldRun) return;
        shouldRun = false;
        console.log('Triggered');
        let leastTimer = new Promise((r) => {
            setTimeout(() => {
                r();
            }, 350);
        })
        let obj = await objPromise;
        let queryString = Search.value;
        let results = [];
        if (queryString === '') {
        } else {
            for (let [k, v] of obj) {
                if (typeof v.c === 'string' && v.c.includes(queryString)) {
                    results.push([k, v.t]);
                } else if (typeof v.t === 'string' && v.t.includes(queryString)) {
                    results.push([k, v.t]);
                }
            }
            resultContainer.innerHTML = '';
            results.forEach(v => {
                const ripple = document.createElement('s-ripple');
                ripple.textContent = v[1];
                ripple.addEventListener('click', () => {
                    Search.blur();
                    window?.__smoothNavigator?.navigate(`/${v[0]}`, onPageProcess);
                });
                resultContainer.appendChild(ripple);
            });
        }
        await leastTimer;
        shouldRun = true;
    }
    for(const event of ['change','input','compositionstart','compositionend'])
        Search.addEventListener(event, () => {
            doSearch();
        });
}