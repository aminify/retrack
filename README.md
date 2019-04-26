# Retrack
A simple Redux library that tracks the way your reducers are combined to dynamically create a selector for each reducer.  
try to use with [Reselect](https://github.com/reduxjs/reselect/) for best development experience.

## Installation
```
$ yarn add retrack
```
or
```
$ npm install --save retrack
```

## Import
```javascript
// ES2015
import { combineTrackReducers, getSelector } from 'retrack'

// CommonJS
const { combineTrackReducers, getSelector } = require('retrack')
```

## Usage
just use `combineTrackReducers` instead of redux's `combineReducers` everywhere in your project and you'll get a free selector by applying `getSelector` on each of your reducers. A selector maps the giant redux state of your application into the state value that the corresponding reducer controls.

## Example
```javascript
import { createStore } from 'redux'
import { combineTrackReducers, getSelector } from 'retrack'

// define your reducers and setup store
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

function name(state = 'default name', action) {
  if (action.type === 'SET_NAME') return action.payload.name
  return state
}

const firstApp = combineTrackReducers({
  counter: counter,
  name: name
})

function secondApp(state = 'under construction', action) {
  return state
}

const store = createStore(
  combineTrackReducers({
    firstAppName: firstApp,
    secondAppName: secondApp
  })
)

// later when you want to get values from state
const state = store.getState()

const counterSelector = getSelector(counter) /* equivalent to `(state) => state.firstAppName.counter` */
console.log(counterSelector(state))        // 0

const nameSelector = getSelector(name) /* equivalent to `(state) => state.firstAppName.name` */
console.log(nameSelector(state))           // default name

console.log(getSelector(firstApp)(state))  // {counter: 0, name: "default name"}

console.log(getSelector(secondApp)(state)) // under construction

// ...

store.dispatch({ type: 'INCREMENT' })
console.log(counterSelector(store.getState())) // 1

store.dispatch({ type: 'SET_NAME', payload: { name: 'another name' } })
console.log(nameSelector(store.getState()))    // another name
```
