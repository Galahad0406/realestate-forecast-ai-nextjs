const investmentCalculator = {

  calculate(price: number, monthlyRent: number) {
    const annualRent = monthlyRent * 12
    const expenses = price * 0.015
    const net = annualRent - expenses
    const roi = (net / price) * 100

    return {
      annualRent,
      expenses,
      net,
      roi: Number(roi.toFixed(2))
    }
  }

}

export default investmentCalculator
