console.log('-->> DB.JS');
const config = require('../../config.json')

const db = (mongoose) => {
  const { db: { host, port, name } } = config
  const uri = `${host}${port !== '' ? `:${port}` : ''}${name}`
  mongoose.connect(uri, (err) => {

    console.log(`-->> DB.JS -->> ${!!err ? err : `CONNECTED TO ${uri} SUCCESS`}`);

  });
}

module.exports = db
