const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require("request");
const $http = require('superagent');
const cheerio = require('cheerio');
const async = require('async');

const urlList = [
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
];
const cookie = 'BAIDUID=5C12C7AEF8BE9577EEE7C40A5E75B5CE:FG=1; PSTM=1511497300; BIDUPSID=1C989DFC6AE5B0296F678A5966ED8303; MCITY=-131%3A; TIEBAUID=097ce01ce0b5f1f8d47f32c4; TIEBA_USERTYPE=4fe0d47fe88578b8153531eb; bdshare_firstime=1513732966474; SEENKW=%E9%BB%91%E8%89%B2%E4%BA%94%E5%8F%B6%E8%8D%89; IS_NEW_USER=2efb27f7e4762d6439f3e548; CLIENTWIDTH=360; CLIENTHEIGHT=640; SET_PB_IMAGE_WIDTH=340; __cfduid=d163f78054bad2565c368930f2f278edd1514193108; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; H_PS_PSSID=25245_1424_21089_17001_25438_25177_20928; PSINO=1; Hm_lvt_98b9d8c2fd6608d564bf2ac2ae642948=1513732967,1513773850,1513826835,1514375226; bottleBubble=1; wise_device=0; BDUSS=ROT0c5elg2M1JqLWUydkxhSHZDdE82dmVafkp6LXJRd2Q4ckRYSFlTSllGV3RhQUFBQUFBJCQAAAAAAAAAAAEAAABQF0sb0v3LvM~gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFiIQ1pYiENaN1; STOKEN=a8d28d0484472722f9c448f1bc89e65cb36bac9f8f5374e287b1ec5b9bfca089; Hm_lpvt_98b9d8c2fd6608d564bf2ac2ae642948=1514375279'//cookie没了 

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
        const page_url_arr = get_page_url(Number($('.pager_theme_2').children().last().attr('href').substring(1)) || 1);

        get_item_url_arr(page_url_arr);

    }).catch(err => console.log(err))


// request('http://imgsrc.baidu.com/forum/pic/item/60789b2ad40735fa61d9010195510fb30f24083a.jpg').pipe(fs.createWriteStream(path.join(__dirname, '/naa.jpg')))

// var img_arr = [
//     "http://imgsrc.baidu.com/forum/pic/item/81f0fa02738da9779d8d31b4bb51f8198718e375.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/3d637f8ca9773912168432fef3198618377ae275.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/b8eda5763912b31b16ce7ab68d18367adbb4e175.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/62173513b31bb0515f8604b73d7adab44bede075.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/f272bf1ab051f8192e87b4d5d1b44aed2f73e775.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/787bbc50f81986189fe5581b41ed2e738ad4e675.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/7b31f4188618367a702bc84225738bd4b21ce575.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/33798a19367adab4e172acdc80d4b31c8601e475.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/4d783a7bdab44aed82ec097bb81c8701a08bfb75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/fd1ad6b54aed2e73264b31b38c01a18b86d6fa75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/11d446ec2e738bd41d8305aeaa8b87d6267ff975.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/818d22728bd4b31c289e23248cd6277f9f2ff875.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/e51387d5b31c8701111405792c7f9e2f0608ff75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/40b4bf1d8701a18b3649a5d0952f07082938fe75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/787c8b00a18b87d695e01c800c0828381e30fd75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/4c61ad8a87d6277f2db085a723381f30e824fc75.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/6aeb8bd7277f9e2fb397aa971430e924b999f375.jpg",
//         "http://imgsrc.baidu.com/forum/pic/item/2c719cee76c6a7efe7a41fb9f6faaf51f2de6614.jpg"
// ];
// async.mapLimit(img_arr, 3, (url, callback) => {
//     const img_type = url.substring(url.lastIndexOf('.'));
//     const name = img_arr.indexOf(url);
//     console.log(url)

//     request(url).pipe(fs.createWriteStream(path.join(__dirname, './res_file/img' , name + img_type)))
//     callback(null)
    
// }, (err, res) => {
//     console.log('over')
// })


// $http.get('https://tieba.baidu.com/p/3760062290')
// .set('Host', 'tieba.baidu.com')
// .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.3427.400 QQBrowser/9.6.12513.400')
// .then(res => {
//     // console.log('res:' + url) 
//     const $ = cheerio.load(res.text);
//     let img_arr = [];
//     const title = $('title').text();
//     const dir_name = path.join(__dirname, '../res_file/', title);

//     fs.writeFile(path.join(__dirname, './information.html'), JSON.stringify(res.text), 'utf-8', err => {
//         if (err) throw err;
//         // console.log('write '+ dir_name +' over')
       
//     })


// }).catch(err =>  console.log('$http err : ' + err))






