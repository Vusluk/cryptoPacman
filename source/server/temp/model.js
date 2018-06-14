const mongoose = require('mongoose');
const mongooseRandom = require('mongoose-random')

const Schema = mongoose.Schema({
  question: String,
  answer: String,
  success: Number,
  failure: Number,
  type: String,
});
Schema.plugin(mongooseRandom, { path: 'r' })
const Model = mongoose.model('Question', Schema);

const create = (instance) => {
  return Model.create(instance)
}

const update = (instance) => {
  return new Promise((res, rej) => {
    Model.findByIdAndUpdate(instance._id, instance.update, { new: true }, (err, newInstance) => {
      if (err) rej(err)
      res(newInstance)
    })
  })
}

const random = (filter = {}, limit = 1) => {
  return new Promise((res, rej) => {
    Model.findRandom(filter, null, { limit: limit }, (err, instances) => {
      if (err) {
        console.log('QUESTION -->> RANDOM -->> ERROR:', err)
        rej(err)
      }
      res(instances)
    })
  })
}

const all = (filter = {}) => {
  return new Promise((res, rej) => {
    Model.find(filter, (err, instances) => {
      if (err) rej(err)
      res(instances)
    })
  })
}

module.exports = { create, update, all, random }
