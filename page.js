/**
 * node page.js ${page_num}
 * 分单元页爬取图片并存储
 */
const fs = require('fs');
const path = require('path')
const $http = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const request = require("request");

const num = parseInt(process.argv[2])

if(!num) {
    throw 'you should input  node page.js ${num}'
}

const res_dir = path.join(__dirname, '../res_file');
if(!fs.existsSync(res_dir)) {
    fs.mkdirSync(res_dir)
}

fs.readFile(path.join(__dirname, './res_file/item_url_arr.json'), 'utf-8', (err, data) => {
    if(err) throw err;

    const item_arr = JSON.parse(data)[(parseInt(num) - 1)];

    async.mapLimit(item_arr, 1, (url, callback) => {  
        $http.get(url)
        .set('Host', 'tieba.baidu.com')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.3427.400 QQBrowser/9.6.12513.400')
        .then(res => {
            // console.log('res:' + url) 
            const $ = cheerio.load(res.text);
            let img_arr = [];
            const title = $('title').text();
            const dir_name = path.join(__dirname, '../res_file/', title);

            $('.BDE_Image').each(function() {
                let little_url = $(this).attr('src');
                if(~little_url.indexOf('sign=')) {
                    const num = little_url.lastIndexOf('/');
                    const url = `https://imgsa.baidu.com/forum/pic/item${little_url.substring(num)}`;//decodeURIComponent(little_url.substring(little_url.indexOf('src=http') + 4));
                    img_arr.push(url);
                }
            })

            if (!fs.existsSync(dir_name)) {
                fs.mkdirSync(dir_name);
            }

            const information = { title, img_arr }

            fs.writeFile(path.join(dir_name, '/information.json'), JSON.stringify(information), 'utf-8', err => {
                if (err) throw err;
                // console.log('write '+ dir_name +' over')
                callback(null, {dir_name, img_arr})
            })

            async.mapLimit(img_arr, 3, (url, callback) => {
                const img_type = url.substring(url.lastIndexOf('.'));
                const name = img_arr.indexOf(url);

                request({
                    url: url
                })
                .on('error', err => console.log(err))
                .pipe(fs.createWriteStream(path.join(dir_name, name + img_type)))
                
                callback(null);

            }, (err, res) => console.log('img '+ title +'over'))

        }).catch(err =>  console.log('$http err : ' + err))        

    }, (err, res) => console.log('write all over'))
})



