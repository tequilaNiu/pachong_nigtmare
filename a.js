// 大众点评

// var bcrypt = require('bcrypt-nodejs')

// console.log(bcrypt.compareSync('ogilvy2013', '$2a$10$6wrbEixEslEFsVpSTThhZuYieS.Pn5BrThIp8XAAmEbqV99xu4z/W'))

var Nightmare = require('nightmare')
var fs = require('fs');
// var path = require('path');
var _ = require('lodash')
var nightmare = Nightmare({
  show: true,
  // gotoTimeout: 5000,
  // waitTimeout: 5000,
  loadTimeout: 5000,
  // executionTimeout: 5000,
})

var data = []

var next = function(url, page, nx, dt) {
  nightmare
  .goto(`${url}p${page}/`)
  .evaluate(function(d) {
    var ddd = [];
    // var a = document.createElement('script')
    // a.src = 'https://lodash.com/vendor/cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js'
    // document.querySelector('body').appendChild(a)
    [].map.call(document.querySelectorAll('#shop-all-list li'), function(li) {
      ddd.push({
        title: li.querySelector('.txt .tit a').title,
        commentNo: li.querySelector('.txt .comment .review-num b').innerText,
      })
    })

    // return d;
    if (document.querySelector('a.next')) {
      return {
        canNext: true,
        data: ddd
      };
    } else {
      return {
        canNext: false,
        data: ddd
      };
    }
    // document.querySelectorAll('#shop-all-list li').map(function() {
    //   console.log('>>>');
    // });
    // console.log(document.querySelectorAll('#shop-all-list li'));
    // _.map(document.querySelectorAll('#shop-all-list li'), function(i, j) {
    //   console.log('>>>', i, j);
    // })
  }, dt)
  .then(function(next) {
    if (!next.canNext) {
      console.log(next.data);
      console.log('END');
    } else {
      console.log(next.data);
      fs.appendFile(__dirname + '/test.txt', JSON.stringify(next.data), function () {
        console.log('追加内容完成');
      });
      nx(url, page + 1, nx, next.data);
    }
  })
}

next('http://www.dianping.com/search/keyword/2/0_%E8%8C%B6%E5%8F%B6/p', 1, next, data);
//
// var result = nightmare
//   // .goto('http://www.dianping.com/search/keyword/2/0_%E8%8C%B6%E5%8F%B6/p1')
//   .on('cursor-changed', function() {
//     console.log('>>>>');
//   })
//   .goto('http://www.dianping.com/search/category/2/0')
//   .type('#G_s', '茶叶')
//   .click('#G_s-btn')
//   // .evaluate(function() {
//   //   var a = document.createElement("script");
//   //   // a.src="https://lodash.com/vendor/cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js";
//   //   // document.querySelector("body").appendChild(a)
//   //   // xx.map(document.querySelectorAll('#shop-all-list li'), function(i, j) {
//   //   //   console.log('>>>', i, j);
//   //   // })
//   // })
//   // .evaluate(function() {
//   //   return {
//   //     title: document.querySelectorAll('#shop-all-list li')[0].querySelector('.txt .tit a').title,
//   //     commentNo: document.querySelectorAll('#shop-all-list li')[0].querySelector('.txt .comment .review-num b').title
//   //   }
//   // })
//   // .end()
//   .then(function (result) {
//
//   })
  // console.log(result)
  // .type('#search_form_input_homepage', 'github nightmare')
  // .click('#search_button_homepage')
  // .wait('#zero_click_wrapper .c-info__title a')
  // .evaluate(function () {
  //   return document.querySelector('#zero_click_wrapper .c-info__title a').href
  // })
  // .end()
  // .then(function (result) {
  //   console.log(result)
  // })
  // .catch(function (error) {
  //   console.error('Search failed:', error)
  // })
