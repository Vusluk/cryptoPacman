const uniqueValidator = require('mongoose-unique-validator')
const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  verify: Boolean,
  token: {
    type: String,
    reqired: [true, 'TOKEN поидее должен создаваться'],
  },
  email: {
    type: String,
    reqired: [true, 'E-MAIL обязательное поле'],
    unique: 'Пользователь с таким E-Mail уже существует',
  },
  pass: {
    type: String,
    reqired: [true, 'ПАРОЛЬ обязательное поле'],
  },
  name: {
    first: String,
    middle: String,
    last: String,
  },
  statistic: {
    success: {
      type: Number,
      default: 0,
    },
    failure: {
      type: Number,
      default: 0,
    },
    adjectives: {
      success: {
        type: Number,
        default: 0,
      },
      failure: {
        type: Number,
        default: 0,
      },
    },
    translate: {
      success: {
        type: Number,
        default: 0,
      },
      failure: {
        type: Number,
        default: 0,
      },
    },
    tenses: {
      success: {
        type: Number,
        default: 0,
      },
      failure: {
        type: Number,
        default: 0,
      },
    },
  },
});
Schema.plugin(uniqueValidator)

module.exports = Schema
