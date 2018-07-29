const program = require('commander')
const historical = require('./src/historical/historical.js')
const Backtester = require('./src/backtester/backtester.js')


const today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1)


program.version('1.0.0')
  .option('-i, --interval [interval]', '1m, 3m, 5m, 15m, 30m, 1h, 6h, 1d, 1w',5)
  .option('-x, --symbol [symbol]', 'Symbol ID', 'BTCUSDT')
  .option('-e, --end [end]', 'End time ex 2018-07-23T12:00:00.000Z', today)
  .option('-s, --start [start]', 'Start time ex 2018-07-23T12:00:00.000Z', yesterday)
  .option('-t, --strategy [strategy]', 'Type of strategy')
  .option('-f, --funds [funds]', 'Amount of units', 1) //change this to be USD
  .parse(process.argv)

const conv = async function(interval) {
  switch (interval) {
    case '1h':
      return 60
    case '6h':
      return 360
    case '1d':
      return 1440
    case '1w':
      return 10080
    default:
      return interval
  }
}
const main = async function() {

  const { interval,symbol, end, start, strategy, funds } = program
  const newInterval = await conv(interval)
  const tester = new Backtester({
    symbol,
    interval: newInterval,
    start,
    end,
    strategyType: strategy,
    funds
  })
  tester.start()
  // const service = new historical({
  //   symbol,
  //   interval,
  //   start,
  //   end
  // })
  // const data = await service.getData()
  // console.log(data)

}

main()
