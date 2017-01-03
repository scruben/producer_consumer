const producer = require('../producer.js');
const consumer = require('../consumer.js');
const should = require('chai').should();

describe('Producer', function() {
  it('function is async', function() {
    let state = {
      isProducing: true,
      isConsuming: true,
      markupList: []
    };

    producer('./test/testInput.dat', state)
      .then(() => {
        state.isProducing = false;
      })
      .catch((err) => { console.log('Error in producer: ', err); });
    (state.isProducing).should.be.equal(true);
  });

  it('error fetching does not stop producer', function() {
    let state = {
      isProducing: true,
      isConsuming: true,
      markupList: []
    };

    return producer('./test/testInput.dat', state)
      .then(() => {
        (state.markupList.length).should.be.equal(3);
        let check = false;
        for (let i = 0; i < state.markupList.length; i++) {
          if (
            state.markupList[i][0]==='http://asfasfjasldfjsdf.com' &&
            state.markupList[i][1]==='Error'
          ) {
            check = true;
          }
        }
        (check).should.be.equal(true);
      })
      .catch((err) => { console.log('Error in producer: ', err); });
  });

  it('fetches the right data', function() {
    let state = {
      isProducing: true,
      isConsuming: true,
      markupList: []
    };

    return producer('./test/testInput.dat', state)
      .then(() => {
        let check1 = false;
        let check2 = false;
        for (let i = 0; i < state.markupList.length; i++) {
          if (
            state.markupList[i][0]==='http://www.autozine.org' &&
            state.markupList[i][1]==='<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\r\n<html>\r\n<head>\r\n  <meta http-equiv="Content-Type"\r\n content="text/html; charset=iso-8859-1">\r\n  <meta name="GENERATOR"\r\n content="Mozilla/4.04 [en] (Win95; I) [Netscape]">\r\n  <meta name="Author" content="Mark Wan">\r\n  <meta name="Description"\r\n content="Europe .... Japan .... USA .... all the best cars are in AutoZine.">\r\n  <meta name="KeyWords"\r\n content="Europe .... Japan .... USA .... all the best cars are in AutoZine.">\r\n  <meta http-equiv="Page-Enter"\r\n content="revealTrans(Duration=3.0,Transition=2)">\r\n  <meta http-equiv="Page-Exit"\r\n content="revealTrans(Duration=3.0,Transition=12)">\r\n  <link rel="shortcut icon" href="http://www.autozine.org/favicon.ico">\r\n  <title>AutoZine</title>\r\n</head>\r\n<body style="color: rgb(255, 255, 255); background-color: rgb(0, 0, 0);"\r\n alink="#33ccff" link="#33ccff" vlink="#33ccff">\r\n<center style="color: rgb(102, 102, 204);"><i><font\r\n face="Times New Roman,Times"><font size="+3"><br>\r\n</font></font></i></center>\r\n<ul style="color: rgb(102, 102, 204);">\r\n  <center><a href="home.html"><img alt="" src="0_Autozine_logo6.jpg"\r\n style="border: 0px solid ; width: 450px; height: 330px;" vspace="20"></a></center>\r\n</ul>\r\n<center style="color: rgb(102, 102, 204);"><font face="Arial,Helvetica"\r\n size="-1"><br>\r\n</font></center>\r\n</body>\r\n</html>\r\n'
          ) {
            check1 = true;
          }
          if (
            state.markupList[i][0]==='http://www.rubensanz.es' &&
            state.markupList[i][1].indexOf('Industrial engineer')!==-1
          ) {
            check2 = true;
          }
        }
        (check1).should.be.equal(true);
        (check2).should.be.equal(true);
      })
      .catch((err) => { console.log('Error in producer: ', err); });
  });

});

describe('Consumer', function() {
  it('function is async', function() {
    let state = {
      isProducing: true,
      isConsuming: true,
      markupList: [['url','markup'],['url','markup'],['url','markup']]
    };

    setTimeout(function() {
      isProducing = false;
    }, 10);

    consumer(state)
      .then(() => {
        // nothing
      })
      .catch((err) => { console.log('Error in producer: ', err); });
    (state.isConsuming).should.be.equal(true);
    process.stdout.write(log + '\n');
  });

  it('handles error fetching', function() {
    let state = {
      isProducing: false,
      isConsuming: true,
      markupList: [['2','href="link"'],['1','href="link"'],['0','Error']]
    };
    global['log'] = []; // Defined in consumer.js
    return consumer (state)
      .then(() => {
        let check = false;
        for (let i = 0; i < log.length; i++) {
          if (
            global['log'][i]==='Error fetching 0'
          ) {
            check = true;
          }
        }
        (check).should.be.equal(true);
      })
      .catch((err) => { console.log('Error in producer: ', err); });
  });

  it('extract links, if they exist', function() {
    let state = {
      isProducing: false,
      isConsuming: true,
      markupList: [['0','Error'],['1','href="12345"'],['2','no link']]
    };
    global['log'] = []; // Defined in consumer.js
    return consumer (state)
      .then(() => {
        let check1 = false;
        let check2 = false;
        for (let i = 0; i < log.length; i++) {
          if (
            global['log'][i]==='Links in 1' &&
            global['log'][i+1]==='12345'
          ) {
            check1 = true;
          }
          if (
            global['log'][i]==='Links in 2' &&
            (i+1 >= global['log'].length ||
             global['log'][i+1].indexOf('Links in') != -1)
          ) {
            check2 = true;
          }
        }
        (check1).should.be.equal(true);
        (check2).should.be.equal(true);
      })
      .catch((err) => { console.log('Error in producer: ', err); });
  });


});
