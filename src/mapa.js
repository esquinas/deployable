import UI_MSG from './spanish'

const MAPA = (() => {
  const predictYear = () => {
    let currYear = new Date()
    let result = currYear.getFullYear() - 2
    result = String(result)
    result = result.substring(2, 4)
    return result
  }

  // INFO: [M.A.P.A.](http://www.jamonlovers.es/el-sello-mapa-en-los-jamones-ibericos-el-dni-del-jamon/)
  const monthsSinceSalting = (Mapa) => {
     //      The average days in a month is 30.44
     // 2630016000 = (1000 * 60 * 60 * 24 * 30.44)
    const MILLSECS_IN_A_MONTH = 2630016000
    const precision = (n) => {
      return n * 100
    }
    let today = new Date()
    let milliseconds = today.getTime() - MapaToDate(Mapa).getTime()
    if (milliseconds < 0) return UI_MSG.futureError
    return humanizeMonths(milliseconds / MILLSECS_IN_A_MONTH)
  }

  const humanizeMonths = (monthsFloat) => {
    const destructurMonths = (m) => {
      let years, months, weeks, days, remaining
      years = Math.floor(m / 12)
      remaining = m - (years * 12)
      months = Math.floor(remaining)
      remaining -= months
      days = Math.round(remaining * 30.44)
      weeks = Math.floor(days / 7)
      remaining = days - (weeks * 7)
      days = (years === 0 && months === 0) ? remaining : 0

      return [years, months, weeks, days]
    }

    const isPlural = (num, pluralStr) => {
      let plural = pluralStr || 's'
      if (num !== 1) return plural
      return ''
    }

    const stringify = (num, name, pluralStr) => {
      //  \xA0 = &nbsp;          ____
      return (num > 0)  ? `${num}\xA0${name}${isPlural(num, pluralStr)}` : ''
    }

    const enumeration = (...elements) => {
      const longEnumeration = () => {
          let everyElemButLast = elements.slice(0, -1).join(', ')
          let lastElement      = elements.slice(-1)
          return `${everyElemButLast} y\xA0${lastElement}.`
       }
      const cases = {
        0: UI_MSG.defaultError,
        1: `${elements[0]}.`,
        2: `${elements[0]} y\xA0${elements[1]}.`,
        default: longEnumeration
        }
        return cases[elements.length] || cases['default']()
      }

    let years, months, weeks, days
    [years, months, weeks, days] = destructurMonths(monthsFloat)
    let list = []

    years = stringify(years, 'año')
    // \xAD = &shy;                    ____
    months = stringify(months, 'mes', '\xADes')
    // \xAD = &shy;             ____  ____
    weeks = stringify(weeks, 'se\xADma\xADna')
    days = stringify(days, 'día')

    if (years  !== '') list.push(years)
    if (months !== '') list.push(months)
    if (weeks  !== '') list.push(weeks)
    if (days   !== '') list.push(days)

    return `${enumeration(...list)}`
  }

  const MapaToDate = (Mapa) => {
    const MAPA_EXTRACTOR = /^([0-4][0-9]|5[0-3])(\d?\d)$/
    let currDecade = saveCurrentDecade()
    let week = 0
    let year = 0
    let days = 0
    let hours = 0
    let interim = []
    try {
      interim = MAPA_EXTRACTOR.exec(Mapa)
      week = parseInt(interim[1])
      // Manage the ambiguity of one-digit year.
      if (interim[2].length === 1) {
        year = 2000 + parseInt(predictDecade(interim[2], currDecade)) * 10 + parseInt(interim[2])
      } else {
        year = parseInt(interim[2])
        year = (year < 90) ? 2000 + year : 1900 + year
      }
    } catch (e) {
      return new Date()
    }
    days = week * 7
    return new Date(year, 0, days, hours)
  }

  const saveCurrentDecade = () => {
    let currDecade = localStorage.getItem('currentDecade')
    // Cached?
    if (currDecade !== null) return currDecade

    let today = new Date()
    let year = String(today.getFullYear())

    currDecade = year.substr(-2, 1)

    localStorage.setItem('currentDecade', currDecade)
    return currDecade
  }

  const predictDecade = (num, currDecade) => {
    let today = new Date()
    let year = String(today.getFullYear()).substr(-1, 1)

    if (parseInt(num) < parseInt(year)) return currDecade
    // Else, return previous decade
    return String(parseInt(currDecade) - 1)
  }

  const padNum = (num) => {
  return ('00' + num).substr(-2, 2);
}

  return {
    // predictYear: () => predictYear(),
    monthsSinceSalting: (Mapa) => monthsSinceSalting(Mapa),
    // humanizeMonths: (monthsFloat) => humanizeMonths(monthsFloat),
    // MapaToDate: (Mapa) => MapaToDate(Mapa),
    // saveCurrentDecade: () => saveCurrentDecade(),
    // predictDecade: (num, currDecade) => predictDecade(num, currDecade),
    padNum: (num) => padNum(num) 
  }
})()

export default MAPA
