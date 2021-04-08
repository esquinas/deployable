import { h } from 'hyperapp'
import UI_MSG from './spanish'

/**
 *     COMPONENTS
 */
const CardTitle = ({state}) => (<span className='card-title'><h4 className=''>{state.title}</h4></span>)

const CardImage = () => (<div class='card-image'>
  <img id='high-res-img' src='images/jamones-ibericos.jpg' alt='Jamones curándose en un secadero'/>
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
 *     VIEW
 */
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

export default view
