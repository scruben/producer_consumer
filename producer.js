'use strict';

const fs = require('fs');
const fetch = require('node-fetch');

function producer (file, state) {
  return new Promise(function (resolve, reject) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (e) {
      reject(e);
    }
    if (content) {
      let links = content.split('\n');
      let counter = 0;
      for (let i=0; i < links.length; i++) {
        if (links[i] !== '') {
          fetch(links[i])
            .then((res) => {
              return res.text();
            })
            .then((html) => {
              state.markupList.push([links[i],html]);
              counter++;
              if (counter === links.length) {
                resolve();
              }
            })
            .catch((err) => {
              state.markupList.push([links[i],'Error']);
              counter++;
              if (counter === links.length) {
                resolve();
              }
            });
        } else {
          counter++;
        }
      }
    }
  });
}

module.exports = producer;
