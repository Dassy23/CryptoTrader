const program = require('commander')
const historical = require('./src/historical/historical.js')
const Backtester = require('./src/backtester/backtester.js')


const today = new Date(); //2018-07-23T02:50:59.326Z
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1)


program.version('1.0.0')
  .option('-i, --interval [interval]', 'Interval in mins for candlestick',5)
  .option('-s, --symbol [symbol]', 'Symbol ID', 'BTCUSDT')
  .option('-e, --end [end]', 'End time in MS', today)
  .option('-srt, --start [start]', 'Start time in MS', yesterday)
  .parse(process.argv)


const main = async function() {
  const { interval,symbol, end, start } = program

  const tester = new Backtester({
    symbol,
    interval,
    start,
    end
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
