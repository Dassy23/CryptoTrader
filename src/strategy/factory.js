const Simple = require('./simple.js')
const MACD = require('./simpleMACD.js')

exports.create = function(type, data) {
  switch (type) {
    case 'macd':
      return new MACD(data)
    case 'simple':
      return new Simple(data)
    default:
      return new MACD(data)
  }
}
