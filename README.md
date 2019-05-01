# Retrack
A simple Redux library that tracks the way your reducers are combined in order to:
- dynamically create a selector for each reducer.
- namespace your action types based on the position of corresponding reducer in the state tree.

that's it! two of the most known issues with scaling your redux apps is solved now. Enjoy!

## Installation
```
$ yarn add retrack
```
or
```
$ npm install --save retrack
```

## Import
Retrack's public API consists of these functions:
```javascript
// ES2015 Modules
import {
  combineTrackReducers,
  getSelector,
  namespaceReducerActions,
  setNamespacingFunction
} from 'retrack'

// CommonJS
const { ... } = require('retrack')
```

## Public API
### combineTrackReducers(`reducers`)
You should use this function instead of redux's default `combineReducers` function everywhere in your project so Retrack knows the shape of your state tree in order to give you the functionality that you're looking for. It internally calls `combineReducers` from your own version of redux and returns the same result, except that it also does some extra stuff for tracking. note that `reducers` must be an object just like redux's `combineReducers` with string keys and your reducers as values.

### getSelector(`reducer`)
You can use `getSelector` on any of your reducers (which of course you passed to `combineTrackReducers` at some point) to get a selector function. This selector maps the giant redux state of your application into the state value that the corresponding reducer controls.

### namespaceReducerActions(`reducer`, `actionTypes`)
By calling this function you tell Retrack to namespace your `actionTypes` based on the position of `reducer` in the state tree. if you want this feature you MUST use the pattern in the example below, which is to pass an `actionTypes` object, a key value pair that values are string values you wish to use as action type and use `actionTypes.ACTION_TYPE` Whenever you want to refer to an action type (in reducer or action creator). hope the example below clarifies more.

### setNamespacingFunction(`customFunction`)
You can customize the logic of namespacing your action types by passing your `customFunction` here. Your function will get an array of strings and should return your custom action type. The array of strings given to your function will be the strings indicating the path of reducer in the state tree as well as the action type itself as the last value. If you don't call this function, `(strArr) => strArr.join('/')` will be used by default.

## Example
```javascript
import { createStore } from 'redux'
import {
  combineTrackReducers,
  getSelector,
  namespaceReducerActions,
  setNamespacingFunction
} from 'retrack'

// define your reducers and setup store
const counterActionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT'
}
function counter(state = 0, action) {
  switch (action.type) {
    case counterActionTypes.INCREMENT:
      return state + 1
    case counterActionTypes.DECREMENT:
      return state - 1
    default:
      return state
  }
}
namespaceReducerActions(counter, counterActionTypes)

const nameActionTypes = { SET_NAME: 'SET_NAME' }
function name(state = 'default name', action) {
  if (action.type === nameActionTypes.SET_NAME) return action.payload.name
  return state
}
namespaceReducerActions(name, nameActionTypes)

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
console.log(counterSelector(state))            // 0

const nameSelector = getSelector(name) /* equivalent to `(state) => state.firstAppName.name` */
console.log(nameSelector(state))               // default name

console.log(getSelector(firstApp)(state))      // {counter: 0, name: "default name"}

console.log(getSelector(secondApp)(state))     // under construction

// ...

console.log(counterActionTypes.INCREMENT)          // firstAppName/counter/INCREMENT
store.dispatch({ type: counterActionTypes.INCREMENT })
console.log(counterSelector(store.getState())) // 1

console.log(nameActionTypes.SET_NAME)              // firstAppName/name/SET_NAME
store.dispatch({ type: nameActionTypes.SET_NAME, payload: { name: 'another name' } })
console.log(nameSelector(store.getState()))    // another name

// you should probably use this when you setup your store, It's here just for the example
setNamespacingFunction((strArr) => strArr.join('{}'))
console.log(nameActionTypes.SET_NAME)              // firstAppName{}name{}SET_NAME
```
As you have noticed action types like `counterAction.INCREMENT` are no longer the strings you passed to `namespaceReducerActions` at first. Retrack behind the scene overrides the action names to be getter functions that produce namespaced action name dynamically based on your state tree.
And that's why you must stick to this pattern. If you hardcode an action name by mistake, or capture the value at some point during setup and reuse that value, you'll lose this dynamically namespacing feature.
