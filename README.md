# redux-trackreducers
combines your reducers in a way that you can dynamically get your reducer's corresponding value without hardcoding the path from state

## Installation
```
yarn add redux-trackreducers
```
or
```
npm install --save redux-trackreducers
```

## Import
```javascript
// ES2015
import combineTrackReducers from 'redux-trackreducers'

// CommonJS
var combineTrackReducers = require('redux-trackreducers').default
```

## Usage
just use `combineTrackReducers` instead of redux's `combineReducers` everywhere in your project and you'll get a free `.valueIn` function on each of your reducers that maps the giant redux state of your application into the state value that the corresponding reducer controls.

## Example
```javascript
import { createStore } from 'redux'
import combineTrackReducers from 'redux-trackreducers'

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
    firstApp: firstApp,
    secondApp: secondApp
  })
)

const state = store.getState()
console.log(counter.valueIn(state)) // 0
console.log(name.valueIn(state)) // default name
console.log(firstApp.valueIn(state)) // {counter: 0, name: "default name"}
console.log(secondApp.valueIn(state)) // under construction

store.dispatch({ type: 'INCREMENT' })
console.log(counter.valueIn(store.getState())) // 1

store.dispatch({ type: 'SET_NAME', payload: { name: 'another name' } })
console.log(name.valueIn(store.getState())) // another name
```
