'use strict';

const producer = require('./producer.js');
const consumer = require('./consumer.js');

// TODO: give a proper interface in future refactor
var state = {
  isProducing: true,
  isConsuming: true,
  markupList: []
};

producer('./inputSample.dat', state)
  .then(() => {
    state.isProducing = false;
    console.log('Producer finished.');
  })
  .catch((err) => { console.log('Error in producer: ', err); });

consumer(state)
  .then(() => {
    console.log('Consumer finished.');
  })
  .catch((err) => { console.log('Error in consumer: ', err); });
