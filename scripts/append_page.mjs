import { join } from "path";

let languages = [];

export default function append_page(ctx) {
    for(let post of ctx.data.posts){
        if(!languages.includes(post.language)){
            languages.push(post.language);
        }
    }
    ctx.plugin.append_pages.push({
        type: 'side.left',
        get(ctx) {
            return [
                ...languages.map(v=> join(ctx.PUBLIC_DIRECTORY, `neo/side.left.${v}/index.html`))
            ];
        }
    },{
        type: 'side.right',
        get(ctx) {
            return [
                ...languages.map(v=> join(ctx.PUBLIC_DIRECTORY, `neo/side.right.${v}/index.html`))
            ];
        }
    },{
        type: 'page',
        get(ctx) {
            let array = [];
            for (let i = 0; i < Math.ceil(ctx.data.posts.length/10); i++) {
                array.push(join(ctx.PUBLIC_DIRECTORY, 'page', i.toString(), 'index.html'));
            }
            return array;
        }
    });
}

export {
    languages
};
