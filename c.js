// 51办卡
const Nightmare = require('nightmare');
const fs = require('fs');

console.log('-----------开始了-----------');

const nightmare = Nightmare({
  show: true,
  waitTimeout: 15000,
  loadTimout: 5000,
});

const oldScrollH = 0;
const newScrollH = 0;

nightmare
  .goto('https://www.toutiao.com/search/?keyword=%E4%BF%A1%E7%94%A8%E5%8D%A1')
  .wait('.feedBox ')
  .wait(() => {
    const client = document.body || document.documentElement;
    console.log(window.oldSH, client.scrollHeight, document.querySelector('.loading'));
    if (document.querySelector('.loading') === null) {
      if (window.oldSH === client.scrollHeight) {
        return true
      }
    }
    client.scrollTop = window.oldSH =  client.scrollHeight;
    return false;
  })
  .evaluate(() => {
    let result = [];
    [].map.call(document.querySelectorAll('.sections .item-inner.y-box'), div => {
      result.push({
        title: div.querySelector('.J_title').innerText,
        description: '',
        date: '',
        author: div.querySelector('.J_source').innerText.trim(),
        article: div.querySelector('.img-wrap').href,
        imgSrc: div.querySelector('img').src,
      });
    });
    return {
      data: result,
    };
  })
  .then(({ data }) => {
    async function getArticle() {
      let index = data.length;
      while(index) {
        index--;
        console.log('....', data[index].article);
        await nightmare
          .goto(data[index].article)
          // .wait('.article-box')
          .evaluate(() => {
            if (document.querySelector('.article-box')) {
              return document.querySelector('.article-box').innerHTML;
            }
            return '视频';
          })
          .then(nxt => {
            data[index].article = nxt;
            console.log('>>>>', index);
          });
      }
      return data
    }

    return getArticle();
  })
  .then(data => {
    console.log('....', data);
    fs.appendFile(`${__dirname}/toutiao`, JSON.stringify(data), () => {
      console.log('已追加');
      console.log('----------结束-----------');
      process.exit();
    });
  });
