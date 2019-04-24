import { combineReducers } from 'redux'

var identity = function (state) {
  return state
}

export default function combineTrackReducers(reducers) {
  var resultReducer = combineReducers(reducers)
  resultReducer.valueIn = identity
  Object.keys(reducers).forEach(function(reducerKey) {
    reducers[reducerKey].valueIn = function (state) {
      return resultReducer.valueIn(state)[reducerKey]
    }
  })
  return resultReducer
}