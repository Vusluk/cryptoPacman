import mongoose from 'mongoose'

const SchemeSchema = mongoose.Schema({
  elements: [mongoose.model('Atom').schema],
});

const Scheme = mongoose.model('Scheme', SchemeSchema)

const create = (params) => {
  const unit = new Scheme(params)
  unit.save((err) => {
    console.log('ERROR', err)
  })
}

module.exports = { create }
