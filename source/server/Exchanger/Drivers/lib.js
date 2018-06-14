const pairListCreate = (currencies, exchange) => {
  return Object.entries(currencies)
    .filter(([curName, curInfo]) => !!curInfo.exchanges[exchange])
    .reduce((acc, [curName, curInfo]) => {
      const pairs = Object.entries(curInfo.exchanges[exchange].pairs).reduce((acc, [pairName, pairInfo]) => ([
        ...acc,
        { marketName: pairInfo.marketName,
          pair: pairName,
          currency: curName,
        },
      ]), [])
      return [
        ...acc,
        ...pairs,
      ]
    }, [])
}

module.exports = {
  pairListCreate,
}
