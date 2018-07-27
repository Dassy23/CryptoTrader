const program = require('commander')
const historical = require('./src/historical/historical.js')
const Backtester = require('./src/backtester/backtester.js')


const today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1)


program.version('1.0.0')
  .option('-i, --interval [interval]', 'Interval in mins for candlestick',5)
  .option('-x, --symbol [symbol]', 'Symbol ID', 'BTCUSDT')
  .option('-e, --end [end]', 'End time ex 2018-07-23T12:00:00.000Z', today)
  .option('-s, --start [start]', 'Start time ex 2018-07-23T12:00:00.000Z', yesterday)
  .option('-t, --strategy [strategy]', 'Type of strategy')
  .option('-f, --funds [funds]', 'Amount of funds', 10)
  .parse(process.argv)


const main = async function() {
  const { interval,symbol, end, start, strategy, funds } = program
  const tester = new Backtester({
    symbol,
    interval,
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
