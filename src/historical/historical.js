const Candlestick = require('../models/candlestick/candlestick.js')
const Binance = require('binance-api-node').default

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class HistoricalService {
  constructor({ symbol, interval, start, end }){
    this.client = new Binance()
    this.symbol = symbol,
    this.interval = interval,
    this.start = Date.parse(start),
    this.end = Date.parse(end)
  }

  async getData(){
    const intervals = this.createRequests()
    const results = await this.performInterval(intervals)


    const candlesticks = results.map((x) => {
      return new Candlestick({
        startTime: new Date(x['openTime']),
        low: x['low'],
        high: x['high'],
        open: x['open'],
        close: x['close'],
        interval: this.interval,
        volume: x['volume']
      })
    })

    return candlesticks

  }

  async performInterval(intervals) {
  if (intervals.length == 0) { return [] }
  const interval = intervals[0]
  const result = await this.performRequest(interval)
  await timeout(200)
  const next = await this.performInterval(intervals.slice(1))
  return result.concat(next)
}

async performRequest({ start, end }) {

  const results = await this.client.candles({
    symbol: this.symbol,
    startTime: start ,
    endTime: end,
    interval: this.interval.toString()+'m'
  })
  return results
}

  createRequests() {
    const max = 500
    const delta = (this.end - this.start)*(1e-3)*(1/60)//convert ms to mins
    const numberIntervals = delta / this.interval
    const numberRequests = Math.ceil(numberIntervals / 500)
    const intervals = Array(numberRequests).fill().map((_, reqNum) => {
      const size = this.interval * 500 *(1e3)*(60)
      const start = (this.start + (reqNum * size))
      const end = (reqNum + 1  === numberRequests) ? (this.end) :
        (start + size)

      return { start, end }
    })

    return intervals
  }
}

module.exports = HistoricalService
