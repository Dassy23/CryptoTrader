const Candlestick = require('../models/candlestick/candlestick.js')
const Historical = require('../historical/historical.js')
const Factory = require('../strategy/factory.js')
const randomstring = require('randomstring')
const colors = require('colors/safe')

 class Backtester {
   constructor   ({ start, end, interval, symbol, strategyType, funds }) {
     this.startTime = start,
     this.endTime = end,
     this.interval = interval,
     this.symbol = symbol,
     this.funds = funds,
     this.historical = new Historical({
       symbol,
       interval,
       start,
       end
     }),
     this.strategyType = strategyType
   }

   async start() {
     try{
       const history = await this.historical.getData()
       this.strategy = Factory.create(this.strategyType, {
         onBuySignal: (x) => { this.onBuySignal(x) },
         onSellSignal: (x) => { this.onSellSignal(x) }
       })
       await Promise.all(history.map((stick, index) => {
         const sticks = history.slice(0, index + 1)
         return this.strategy.run({
           sticks, time: stick.startTime, funds: this.funds

         })
       }))

       const positions = this.strategy.getPositions()
       positions.forEach((p) => {
         p.print()
       })

       const total = positions.reduce((r, p) => {
         return r + p.profit()
       }, 0)
       const firstTrade = positions[0].enter
       const lastTrade = positions[positions.length -1].exit? positions[positions.length -1].exit : positions[positions.length -1].enter

       const prof = `${total}`
       const colored = total > 0 ? colors.green(prof) : colors.red(prof)
       const totalBM = (lastTrade.price - firstTrade.price) * this.funds
       const benchmark = totalBM > 0 ? colors.green(totalBM) : colors.red(totalBM)
       console.log(`Total: ${colored} - Buy & Hold Benchmark: ${benchmark}`)

     } catch (error) {
       console.log(error)
     }
   }

   async onBuySignal({ price, time, funds }) {
     // console.log('BUY SIGNAL')
     const id = randomstring.generate(20)

     this.strategy.positionOpened({
       price, time, amount: funds, id
     })
   }

   async onSellSignal({ price, size, time, position }){
    // console.log('SELL SIGNAL')
    this.strategy.positionClosed({
      price, time, size, id: position.id
    })
   }
 }

 module.exports = Backtester
