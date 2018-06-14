const https = require('https');
const http = require('http');
const protocols = { https, http }

const call = (setup, method, path, params = {}) => {
  return new Promise((resolve, reject) => {
    
    let query = ''
    if (method === 'GET') {
      Object.entries(params).forEach(([key, val], i) => i === 0 ? query += `?${key}=${val}` : query += `&${key}=${val}`)
    }

    const options = {
      ...setup,
      method,
      path: method === 'GET' ? `${path}${query}` : path,
      timeout: 10000,
    }

    const req = protocols[setup.exchangeProtocol].request(options, (res) => {
      if (res.statusCode === 200) {
        let body = ''
        res.on('data', (chunk) => {
          // console.log(`CALL_PATH:${options.path} || DATA_CHUNK_RECEIVED`)
          body += chunk
        })
        res.on('end', () => {
          const data = JSON.parse(body)
          if (setup.resErrChecker(data)) {
            // console.log(`${options.hostname}${options.path} || SUCCESS`)
            resolve(data)
          } else {
            console.log(`${options.hostname}${options.path} || FAIL`)
            reject(setup.resErrHandler(data))
          }
        })
      } else {
        console.log(`${options.hostname}${options.path} || FAIL_STATUS_CODE:${res.statusCode} || MESSAGE:`)
        res.on('end', (data) => {
          reject(setup.resErrHandler(data))
        })
      }
    })
    
    req.on('error', (err) => {
      console.log(`${options.hostname}${options.path} || FAIL_ERROR:${err}`)
      reject(setup.resErrHandler(err))
    })
    req.on('timeout', (err) => {
      console.log(`${options.hostname}${options.path} || FAIL_ERROR:${err}`)
      // reject(setup.resErrHandler(err))
    })
    req.end()
  })
}

module.exports = {
  call,
}
