import { combineReducers } from 'redux'

export default function combineTrackReducers(reducers) {
  const combinedReducer = combineReducers(reducers)
  combinedReducer.__RETRACK_GET_PATH_ARRAY__ = () => []
  Object.keys(reducers).forEach(function(reducerKey) {
    reducers[reducerKey].__RETRACK_GET_PATH_ARRAY__ = () => [
        ...combinedReducer.__RETRACK_GET_PATH_ARRAY__(),
        reducerKey
      ]
  })
  return combinedReducer
}