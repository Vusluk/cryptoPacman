console.log('-->> INIT.JS');
const path        = require('path');
const mongodb     = require('mongodb');
const mongoose    = require('mongoose');

const data = require('./init.json');
const { create, random } = require('./server/Question/model');
const { db: { host, port, name} } = require('../config.json');

process.on('exit', (code) => {
    console.log('-->> INIT.JS -->> HAVE A NICE DAY :) ');
});

const uri = `${host}${port}${name}`;
mongoose.connect(uri, (err) => {
  console.log(`-->> INIT.JS -->> ${!!err ? err : `CONNECTED TO ${uri} SUCCESS`}`);
});

mongoose.connection.on('open', () => {
  mongoose.connection.db.dropDatabase((err, result) => {
      if (err) console.log('-->> INIT.JS -->> DROP-DB', err);
      console.log('-->> INIT.JS -->> DB SUCCESFULLY DROPED -->> OK');
    create(data)
      .then((res) => {
          console.log('-->> INIT.JS -->> DB SUCCESFULLY UPDATED BY INIT DATA -->> ');
          mongoose.connection.close();
      });
  });
});
