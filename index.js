var combineReducers = require('redux').combineReducers

var identity = function (state) {
  return state
}

function combineTrackReducers(reducers) {
  var resultReducer = combineReducers(reducers)
  resultReducer.valueIn = identity
  Object.keys(reducers).forEach(function(reducerKey) {
    reducers[reducerKey].valueIn = function (state) {
      return resultReducer.valueIn(state)[reducerKey]
    }
  })
  return resultReducer
}

module.exports = {
  default: combineTrackReducers
}