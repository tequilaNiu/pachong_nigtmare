// 51办卡
const Nightmare = require('nightmare');
const fs = require('fs');

const nightmare = Nightmare({
  show: true,
  loadTimout: 5000,
});

console.log('----------开始-----------');

const next = (url, page, nx) => {
  nightmare
    .goto(`${url}p${page}/`)
    .wait('#lists')
    .evaluate((p) => {
      let dd = [];
      [].map.call(document.querySelectorAll('#lists li'), li => {
        let ddd = null;
        ddd = {
          title: li.querySelector('.share').getAttribute('data-title'),
          description: li.querySelector('.share').getAttribute('data-description'),
          date: li.querySelector('.des span').innerText,
          author: li.querySelector('.author a:nth-child(2)').innerText,
          article: li.querySelector('.share').getAttribute('data-url'),
        };
        dd.push(ddd);
      });

      if (document.querySelector('.next') && p < 3) {
        return {
          canNext: true,
          data: dd,
        };
      } else {
        return {
          canNext: false,
          data: dd,
        };
      }
    }, page)
    .then(next => {
      return new Promise((resolve, reject) => {
        const d = next.data;
        let index = d.length;

        async function getArticle() {
          while(index) {
            index--;
            console.log('....', d[index].article);
            await nightmare
              .goto(`https://credit.u51.com${d[index].article}`)
              .wait('#nc')
              .evaluate(dd => {
                return document.querySelector('#nc').innerHTML;
              }, d)
              .then(nxt => {
                d[index].article = nxt;
                console.log('>>>>', index);
              });
          }
          resolve({
            canNext: next.canNext,
            data: d,
          });
        }

        getArticle();
      });

    })
    .then(next => {
      let splitTag = next.canNext ? ',' : ']';
      const startTag = page == 1 ? '[' : '';
      const result = JSON.stringify(next.data);
      const resultL = result.length;
      fs.appendFile(`${__dirname}/51card`, `${startTag}${result.slice(1).slice(0, resultL - 2)}${splitTag}`, () => {
        console.log('已追加');
        if(!next.canNext) {
          console.log('----------结束-----------');
          nightmare.end();
          process.exit();
        }
      });
      next.canNext ? nx(url, page + 1, nx, next.data) : null;
    });
}

next('https://credit.u51.com/post/', 1, next);
