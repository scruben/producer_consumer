# README.md
## Install
`node` must be installed before. `npm install` in the repo folder should install all the code dependencies.

## Use
Edit `main.js` and point the function `producer` to the file with the url's (by default `inputSample.dat`). Then:

`npm start`

## Test
`npm test`

## Notes
To keep simple the code some must-do improvements have been omitted:
- Test should contemplate more edge cases, like multiple links in one markup. Also the test is not very clean with the different `console.log`'s displayed.
- `consumer` function works with setInterval. Nature of javascript and node is single threaded. Async and multiple threads are managed by node or the browser, not by javascript itself. This code was done to work with only one node process, that's why it uses setInterval, making `consumer` parse what is in the queue every 300 ms (setInterval and fetch are asynchronous, a while it is not). A better solution, and longer to implement, would be split the code in three node processes a main one who calls two child processes with fork() (for producer and consumer), implementing some kind of communication mechanism better than the message service by default (something like an API request posting the markup to the consumer).
- `state` variable should be given a proper interface.
- The regular expression for extracting links in `consumer` could contemplate some more edge cases, like mailto.
- I would try to avoid the use of `log` global variable, for testing purposes but outside `test/test.js`.
