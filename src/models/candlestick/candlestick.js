class Candlestick {
  constructor({
    low, high, close, open, interval, startTime, volume, price
  }) {
    this.startTime = startTime
    this.interval = interval
    this.open = open
    this.close = close
    this.high = high
    this.low = low
    this.volume = volume
  }

  average() {
      const numbers = [this.close,this.high,this.low];
      const count = numbers.length;
      const reducer = (adder, value) => (adder + value);
      const average = numbers.map(x => x/count).reduce(reducer);
      return average
   }

}
module.exports = exports = Candlestick
