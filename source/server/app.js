var path = require('path');

console.log('-->> APP.JS');

module.exports = (app) => {

  app.use(require('express').static(path.join(__dirname, './../../static')));
  app.use('/', (req, res) => {
    console.log('RES', req.url)
    // res.sendFile(`${process.cwd()}/build/index.html`)
  })

}
