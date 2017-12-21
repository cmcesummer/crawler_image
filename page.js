const fs = require('fs');
const path = require('path')
const $http = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
var request = require("request");

const num = parseInt(process.argv[2])

if(!num) {
    throw 'you should input  node page.js ${num}'
}

console.log(num)
fs.readFile(path.join(__dirname, './res_file/item_url_arr.json'), 'utf-8', (err, data) => {
    if(err) throw err;
    const item_arr = JSON.parse(data)[(parseInt(num) - 1)];
    console.log(item_arr);
    async.mapLimit(item_arr, 5, (url, callback) => {

        console.log('req:' + url )
        
        $http.get(url)
        .set('Host', 'tieba.baidu.com')
        .set('User-Agent', 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36')
        .then(res => {
            console.log('res:' + url) 

            const $ = cheerio.load(res.text);
            let img_arr = [];
            const title = $('title').text();
            const dir_name = path.join(__dirname, './res_file/', title);

            $('.j_media_thumb_holder.img_placeholder').each(function() {
                let little_url = $(this).attr('data-url');
                const url = decodeURIComponent(little_url.substring(little_url.indexOf('src=http') + 4));
                img_arr.push(url);
            })

            callback(null, {dir_name, img_arr})

            if (!fs.existsSync(dir_name)) {
                fs.mkdirSync(dir_name);
            }

            const information = {
                title,
                img_arr
            }

            fs.writeFile(path.join(dir_name, '/information.json'), JSON.stringify(information), 'utf-8', err => {
                if (err) throw err;
                console.log('write '+ dir_name +' over')
            })

            // async.mapLimit(img_arr, 3, (url, callback) => {
            //     request
                
            // }, (err, res) => {

            // })
            


        })        

    }, (err, res) => {

        
        console.log('write all over')
    })
})



