import UI_MSG from './spanish'
import MAPA from './mapa'

const actions = {
  update: () => state =>  ({
    title: MAPA.monthsSinceSalting(MAPA.padNum(state.months) + state.year)
  }),
  updateMonths: (newMonths) => state =>  ({ months: newMonths  }),
  updateYear: (newYear) => state =>  ({ year: newYear  }),
  reset: () => state => ({title: UI_MSG.initialMessage,
    months: UI_MSG.initialMonth,
    year: UI_MSG.initialYear})
  }

export default actions
