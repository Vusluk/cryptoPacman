const mongoose = require('mongoose')
const Schema = require('./schema')

const Model = mongoose.model('User', Schema);

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

const oneById = (id) => {
  return new Promise((res, rej) => {
    Model.findById(id, (err, instance) => {
      if (err || !instance) rej(err)
      res(instance)
    })
  })
}

const one = (data) => {
  return new Promise((res, rej) => {
    Model.findOne(data, (err, instance) => {
      if (err || !instance) rej(err) //TODO: rej correct ERR if !instance
      res(instance)
    })
  })
}

const all = (filter = {}) => {
  return new Promise((res, rej) => {
    Model.find(filter, (err, instances) => {
      if (err || !instances.length) rej(err)
      res(instances)
    })
  })
}

module.exports = { create, update, all, one, oneById }
