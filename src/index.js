import { h, app } from 'hyperapp'
import './index.scss'

const UI_MSG = {
  // 1) \xA0 = &nbsp;                      1___
  pathToHighResImg: '/images/jamones-ibericos.jpg',
  initialMessage: 'Calculadora de tiempo de\xA0curación.',
  initialMonth: '1',
  initialYear: (() => {
    let currYear = new Date()
    let result = currYear.getFullYear() - 2
    result = String(result)
    result = result.substring(2, 4)
    return result })(),
  validationSuccess: '✓ Ok',
  // ERRORS.  1) \xA0 = &nbsp;                   1___ 
  validationError: '✗ Incorrecto' ,
  defaultError:   'Error, por favor, inténtalo de\xA0nuevo.',
  futureError:    'Error, por favor, inténtalo de\xA0nuevo.'
}

/**
 *     FUNCTIONS FOR M.A.P.A. IMPLEMENTATION
 */
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

// padNum(5) -> '05'
const padNum = (num) => {
  return ('00' + num).substr(-2, 2);
}

/**
 *     COMPONENTS
 */
const CardTitle = ({state}) => (<span className='card-title'><h4 className=''>{state.title}</h4></span>)

const CardImage = () => (<div class='card-image'>
  <img id='high-res-img' src='/images/jamones-ibericos-low-res.jpg' alt='Jamones curándose en un secadero'/>
    <span className='col s12 card-title cyan-text text-lighten-3 over-image'>¿Cuánto tiempo hace desde la entrada en sal de un jamón?</span>
  </div>)

// TODO: Add (?) button on image to get help finding MAPA stamp.

const CardText = () => <p className='flow-text'>
  Introduce debajo las cifras del sello <a 
                                          title='Sello de entrada en salazón creado por el Ministerio de Agricultura, Pesca y Alimentación (MAPA), actualmente conocido como MAGRAMA'
                                          href='http://www.jamonlovers.es/el-sello-mapa-en-los-jamones-ibericos-el-dni-del-jamon/' target='_blank'>M.A.P.A.</a> </p>

const CardButtons = ({state, actions}) => (
  <div className='row'>
    <div className='col s5 l6 center'>
      <button class='btn-flat teal-text' href='#!'
         onclick={ actions.reset }>
        Borrar</button>
    </div>
    <div className='col s7 l6 center'>
      <button type='submit' class='btn' href='#!' 
         onclick={actions.update}>
          Calcular
       </button>
     </div>
  </div>)
 
const MonthsInput = ({state, actions}) => (
  <div className='input-field col s6'>
    <input id='months-input' name='months-input' type='number' className='validate'
      min='0' max='53' step='1' 
      value={state.months}
      onchange={() => actions.updateMonths(document.getElementById('months-input').value)}
      autofocus
      />
  <label for='months-input' 
    data-error={UI_MSG.validationError} 
    data-success={UI_MSG.validationSuccess}  >Dos primeras cifras</label>
  </div>)

const YearInput = ({state, actions}) => (
<div className='input-field col s6'>
    <input id='year-input' name='year-input' type='number' className='validate' 
      min='0' max='99' step='1' 
      value={state.year}
      onchange={() => actions.updateYear(document.getElementById('year-input').value)}
      //oncreate={element => element.value = state.year}
     />
  <label for='year-input'
    data-error={UI_MSG.validationError} 
    data-success={UI_MSG.validationSuccess}>Última/s cifra/s</label>
  </div>)

/** 
 *     HIPERAPP
 */

//    STATE
const state = { 
  months: UI_MSG.initialMonth, 
  year:   UI_MSG.initialYear,
  title:  UI_MSG.initialMessage
              }

//    ACTIONS
const actions = {
  update: () => state =>  ({
    title: monthsSinceSalting(padNum(state.months) + state.year)
  }),
  updateMonths: (newMonths) => state =>  ({ months: newMonths  }),
  updateYear: (newYear) => state =>  ({ year: newYear  }),
  reset: () => state => ({title: UI_MSG.initialMessage, months: UI_MSG.initialMonth, year: UI_MSG.initialYear})
  }

//    VIEW
const view = (state, actions) =>  
  <div className='card white z-depth-3 hoverable'>
    <CardImage/>
    <div className='card-content'>
      <CardTitle state={state}/>
      <CardText/>
      <div className='card-action row'>
        <MonthsInput state={state} actions={actions}/>
        <YearInput state={state} actions={actions}/>
      </div>
      <CardButtons state={state} actions={actions}/>
    </div>
  </div>

const rootElem = document.getElementById('app')

app(state, actions, view, rootElem)

// Load image.
document.getElementById('high-res-img').src = UI_MSG.pathToHighResImg
