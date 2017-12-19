
var http = require('http');
var fs = require('fs');
var path = require('path');

const urlList = [
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
];


// const down_fn = (url) => {
//     const name = url.substring(url.lastIndexOf('/') + 1); 
//     http.get(url, res => {
//         let fileBuffer = [];
//         res.on('data', chunk => {
//             fileBuffer.push(new Buffer(chunk))
//         })
//         res.on('end', () => {
//             const totalBuff = Buffer.concat(fileBuffer);
//             fs.writeFile(path.join(__dirname, './res_file/img/', name), totalBuff, err => {
//                 if (err) throw err;
//                 console.log(name + ' over')
//             })
//         })
//     })
// }


// urlList.forEach(item => {
//     down_fn(item);
// })


//http://www.cnblogs.com/chenrj23/p/4512853.html
//https://cnodejs.org/topic/574cd3d9da0dea851e308265
//https://tieba.baidu.com/p/comment?tid=5171602458&pid=108295392615&pn=1&t=1513685817724&red_tag=1472410715


http.get('http://tieba.baidu.com/p/comment?tid=5171602458&pid=108295392615&pn=1&t=1513685817724', function(res) {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        console.log(rawData)
        fs.writeFile(path.join(__dirname, './res_file/baidu.html'), rawData, 'utf-8', err => {
            if (err) throw err;
            console.log('write over')
        })
    })
})






