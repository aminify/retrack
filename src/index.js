import { combineReducers } from 'redux'

const identity = (state) => state

export function combineTrackReducers(reducers) {
  const resultReducer = combineReducers(reducers)
  resultReducer.__RETRACK_SELECTOR__ = identity
  Object.keys(reducers).forEach(function(reducerKey) {
    reducers[reducerKey].__RETRACK_SELECTOR__ = function (state) {
      return resultReducer.__RETRACK_SELECTOR__(state)[reducerKey]
    }
  })
  return resultReducer
}

export function getSelector(reducer) {
  if (typeof reducer.__RETRACK_SELECTOR__ === 'function') {
    return reducer.__RETRACK_SELECTOR__
  } else {
    throw new Error('a reducer that you intended to get its selector is not being tracked by `retrack`. ensure all of your reducers are being combined using `combineTrackReducers`')
  }
}