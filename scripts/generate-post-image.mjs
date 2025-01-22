function randomParams(count, n1 = 1, n2 = 2, n3 = 3, n4 = 4, n5 = 5) {
    let result = [];
    for (let i = 0; i < count; i++) {
        let x = 0, y = 0, size = 0;
        x += n1 ^ n2 * (n5 % i) * n3;
        y += (n4 - n2) * n1 * Math.abs(i - count % n2);
        size += (i + n5) * 2 * n1 % (n3 - 2) + 15;
        if ((n1 + i) % 2 == 0) {
            x += y - size;
            size *= n4;
            y *= (n5 > 15) ? n5 * n3 : n2;
        }
        result.push([Math.abs(x) % 332, Math.abs(y) % 240, (Math.abs(size) % 79) + 34]);
    }
    return result;
}

export default function generatePostImage(ctx) {
    ctx.data.posts.forEach(v => {
        if (!v.properties.image) {
            let generated = ``;
            let charCount = v.raw.length;
            let contentCharCount = v.content.length;
            let year = v.date.year();
            let month = v.date.month();
            let day = v.date.day();

            generated += `<svg viewBox="0 0 332 240">`;

            let dotCount = 2;
            let dotPositions = randomParams(dotCount, charCount, contentCharCount, year, month, day);
            dotPositions.forEach((v, i) => generated += `<circle cx=${v[0]} cy=${v[1]} r=${v[2]} o=${i%2} />`);

            let triangleCount = 2;
            let trianglePositions = randomParams(triangleCount,contentCharCount,charCount,month,year,day);
            trianglePositions.forEach((v,i) => generated += `<path t="t" d="M${v[0]},${v[1]}h60l-30,-52z" o=${i%2} style="transform:rotate(${(i+1+day%10)*(i%2==0?1:-1)*10}deg)" />`);

            generated += `</svg>`;
            v.properties.image = generated;
            v.properties.__is_generated_image = true;
        }
    });
}