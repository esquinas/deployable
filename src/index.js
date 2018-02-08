import { h, app } from 'hyperapp'
import state from './state'
import actions from './actions'
import view from './view'
import UI_MSG from './spanish'
import './index.scss'

const rootElem = document.getElementById('app')

app(state, actions, view, rootElem)
