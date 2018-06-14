const { random, all } = require('./model')

module.exports = socket => {
  socket.on('LESSON_GET', () => {
    Promise.all([
      random({ type: 'adjectives' }, 1),
      random({ type: 'translate' }, 1),
      random({ type: 'tenses' }, 3)
    ])
      .then((res) => socket.emit('LESSON_GET_ANSWER', {
        error: false,
        data: {
          adjectives: res[0],
          translate: res[1],
          tenses: res[2],
        },
      }))
      .catch((err) => socket.emit('LESSON_GET_ANSWER', { error: true, data: err }))

  })
}
