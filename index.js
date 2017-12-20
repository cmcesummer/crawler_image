
var http = require('http');
var fs = require('fs');
var path = require('path');
var request = require("request");
var $http = require('superagent');
var cheerio = require('cheerio');
var async = require('async');

const urlList = [
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
];

const cookie = ''//your cookie
let total_page = 1;

const get_page_url = (num) => {
    let arr = [];
    for(let i = 0; i < num; i++) {
        let url = `https://tieba.baidu.com/p/comment?tid=5171602458&pid=108295392615&pn=${i+1}&t=1513685817724&red_tag=1472410715`
        arr.push(url);
    }
    return arr;
}

const get_item_url_arr = (page_arr) => {
    async.mapLimit(page_arr, 1, (url, callback) => {
        $http.get(url).then(res => {
            
            const $ = cheerio.load(res.text);
            let a_arr = [];
            $('.lzl_content_main').each(function (index, ele) {
                a_arr.push($(this).find('a').text());
            })
            callback(null, a_arr);
        })

    }, (err, res) => {
        if(err) throw err

        fs.writeFile(path.join(__dirname, './res_file/item_url_arr.json'), JSON.stringify(res), 'utf-8', err => {
            if (err) throw err;
            console.log('write baidu over')
        })
    })
}

$http.get('https://tieba.baidu.com/p/comment?tid=5171602458&pid=108295392615&pn=1&t=1513685817724&red_tag=1472410715')
    .set('cookie', cookie)
    .set('Host', 'tieba.baidu.com')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')
    .then(res => {
        if(res.status != 200) throw res.status
        let a_arr = [];
 
        const $ = cheerio.load(res.text);
        
        total_page = Number($('.pager_theme_2').children().last().attr('href').substring(1))

        const page_url_arr = get_page_url(total_page);

        get_item_url_arr(page_url_arr);

    }).catch(err => {
        console.log(err)
    })















