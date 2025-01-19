import { writeFile } from "fs";
import { join } from "path";

export default function search(ctx) {
    let search = {};
    ctx.data.posts.forEach(v => {
        search[v.relative_path] = {
            t: v.title,
            c: v.raw.replace(/\n+/g,' ')
        };
    });
    writeFile(join(ctx.PUBLIC_DIRECTORY, 'search.json'), JSON.stringify(search), (err) => {
        if (err) {
            console.error(err);
        }
    });
}