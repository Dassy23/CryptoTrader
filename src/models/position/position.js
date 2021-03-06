const colors = require('colors/safe')
dateFormat = require('dateformat')

class Position {
  constructor ({ trade, id }) {
    this.state = 'open'
    this.enter = trade
    this.id = id
  }

  close({ trade }) {
    this.state = 'closed'
    this.exit = trade
  }

  print(){
    const enter = `Enter | ${this.enter.price} x ${this.enter.size}: ${(this.enter.price * this.enter.size).toFixed(4)} | ${dateFormat(this.enter.time, "isoDateTime")}`
    const exit = this.exit ?  `Exit: | ${this.exit.price} x ${this.enter.size}: ${(this.exit.price * this.enter.size).toFixed(4)} | ${dateFormat(this.exit.time, "isoDateTime")}` :
      ''
    var profit = ''
    if (this.state ==='closed'){
      const prof = `${this.profitString()}`
      const colored = this.profit() > 0 ? colors.green(prof): colors.red(prof)
      profit = `Profit: ${colored}`
    }

    console.log(`${enter} - ${exit} \n${profit}`)
  }

  profit() {
    const fee = 0.005
    const entrance = (this.enter.price) * (1 + fee)
    if (this.exit) {
      const exit = (this.exit.price) * (1 - fee)
      const size = this.enter.size
      const delta = exit - entrance
      return (exit - entrance) * this.enter.size
    } else {
      return 0
    }
  }

  profitString() {
    return this.profit().toFixed(2)
  }


}
module.exports = Position
