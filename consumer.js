'use strict';

// For testing purposes
global['log'] = []; 
console.log2 = function(d) {
    global['log'].push(d);
    console.log(d);
};
//====================

let timer;

function consumer (state) {
  return new Promise ( function (resolve, reject) {

    let parser = () => {
      console.log('-----------------------');
      console.log('state.isProducing', state.isProducing);
      console.log('state.isConsuming', state.isConsuming);
      let pattern = /href="(.*?)"/g;
      while (state.markupList.length>0) {
        state.isConsuming = true;
        let data = state.markupList.shift();
        let url = data[0];
        let html = data[1];
        if (html !== 'Error') {
          let match=pattern.exec(html);
          console.log2('Links in '+ url);
          console.log('=========================');
          while (match) {
            console.log2(match[1]);
            match = pattern.exec(html);
          }
          console.log('=========================');
        } else {
          console.log2('Error fetching '+url);
        }

      }
      if (!state.isProducing && !state.isConsuming) {
        clearInterval(timer);
        resolve();
      }
      if (!state.isProducing) state.isConsuming = false; // Here to ensure it waits 1 interval to close
    };

    parser();
    timer = setInterval(parser, 300);
  });
}

module.exports = consumer;
