const mongoose = require('mongoose')

const AtomSchema = mongoose.Schema({
  x: Number,
  y: Number,
  rotate: Number,
  type: String,
});

const Atom = mongoose.model('Atom', AtomSchema)

const create = (params) => {
  const unit = new Atom(params)
  unit.save((err) => {
    console.log('ERROR', err)
  })
  return unit
}

const update = (element, callback) => {
  console.log('UPDATE ==>> ENTER', element)
  Atom.findByIdAndUpdate(element._id, element.update, { new: true }, callback)
}

const all = (params) => {
  return Atom.find({}, (err, atoms) => {
    return atoms
  })
}

module.exports = { create, update, all }
