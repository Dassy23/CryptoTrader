const Candlestick = require('../models/candlestick/candlestick.js')
const Historical = require('../historical/historical.js')
const Simple = require('../strategy/simple.js')
const randomstring = require('randomstring')
const colors = require('colors/safe')

 class Backtester {
   constructor   ({ start, end, interval, symbol }) {
     this.startTime = start,
     this.endTime = end,
     this.interval = interval,
     this.symbol = symbol,
     this.historical = new Historical({
       symbol,
       interval,
       start,
       end
     })
   }

   async start() {
     try{
       const history = await this.historical.getData()
       this.strategy = new Simple({
         onBuySignal: (x) => {this.onBuySignal(x) },
         onSellSignal: (x) => { this.onSellSignal(x) }
       })

       await Promise.all(history.map((stick, index) => {
         const sticks = history.slice(0, index + 1)
         return this.strategy.run({
           sticks, time: stick.startTime
         })
       }))

       const positions = this.strategy.getPositions()
       positions.forEach((p) => {
         p.print()
       })

       const total = positions.reduce((r, p) => {
         return r + p.profit()
       }, 0)

       const prof = `${total}`
       const colored = total > 0 ? colors.green(prof) : colors.red(prof)
       console.log(`Total: ${colored}`)

     } catch (error) {
       console.log(error)
     }
   }

   async onBuySignal({ price, time }) {
     // console.log('BUY SIGNAL')
     const id = randomstring.generate(20)

     this.strategy.positionOpened({
       price, time, size: 1.0, id
     })
   }

   async onSellSignal({ price, size, time, position  }){
    // console.log('SELL SIGNAL')
    this.strategy.positionClosed({
      price, time, size, id: position.id
    })
   }
 }

 module.exports = Backtester
