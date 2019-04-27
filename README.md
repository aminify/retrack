# Retrack
A simple Redux library that tracks the way your reducers are combined to:
- dynamically create a selector for each reducer.
- namespace your action types according to your state tree.

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
### combineTrackReducers(reducers)
You should use this function instead of redux's default `combineReducers` function everywhere in your project. All the magic that Retrack does is because of this function. It internally calls `combineReducers` from your project's of redux and does some extra stuff to track your state.

### getSelector(reducer)
if you have used `combineTrackReducers` it's time to get a reward! you can use `getSelector` on any of your reducers (which of course you passed to `combineTrackReducers` before) to get a Selector function. This selector maps the giant redux state of your application into the state value that the corresponding reducer controls.

### namespaceReducerActions(`reducer`, `actions`)
By calling this function you tell Retrack to namespace your `actions` based on the position of `reducer` in the state tree. if you want this feature you MUST use the pattern in the example which is to pass an `actions` object, a key value pair that  values are action type. Whenever you wish to refer to an action type (in reducer or action creator) you must use `actions.ACTION_TYPE` instead. hope the example below clarifies more.

### setNamespacingFunction(customFunction)
You can customize the logic of namespacing your action names by passing a function to this function. Your function will get an array of strings and should return your custom action name. The array of strings given to your function will be the strings indicating the path of reducer in the state tree as well as the action name as the last value. If you don't call this function, `(strArr) => strArr.join('/')` will be used by default.

## Example
```javascript
import { createStore } from 'redux'
import {
  combineTrackReducers,
  getSelector,
  nameSpaceReducerActions,
  setNamespacingFunction
} from 'retrack'

// define your reducers and setup store
const counterActions = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT'
}
function counter(state = 0, action) {
  switch (action.type) {
    case counterActions.INCREMENT:
      return state + 1
    case counterActions.DECREMENT:
      return state - 1
    default:
      return state
  }
}
namespaceReducerActions(counter, counterActions)

const nameActions = { SET_NAME: 'SET_NAME' }
function name(state = 'default name', action) {
  if (action.type === nameActions.SET_NAME) return action.payload.name
  return state
}
namespaceReducerActions(name, nameActions)

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

console.log(counterActions.INCREMENT)          // firstAppName/counter/INCREMENT
store.dispatch({ type: counterActions.INCREMENT })
console.log(counterSelector(store.getState())) // 1

console.log(nameActions.SET_NAME)              // firstAppName/name/SET_NAME
store.dispatch({ type: nameActions.SET_NAME, payload: { name: 'another name' } })
console.log(nameSelector(store.getState()))    // another name

// you should set this probably when you setup your store, It's here just to see how it works
setNamespacingFunction((strArr) => strArr.join('{}'))
console.log(nameActions.SET_NAME)              // firstAppName{}name{}SET_NAME
```
As you have noticed action names like `counterAction.INCREMENT` had changed when we tried to dispatch them. that's because Retrack behind the scene overrides the action names to be getter functions that produce namespaced action name dynamically.
And that's why you must stick to this pattern. If you hardcode an action name by mistake, you'll lose this auto namespacing feature.
