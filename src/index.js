import { combineReducers } from 'redux'

let namespacingFunction = (strArr) => strArr.join('/')

export function setNamespacingFunction(userFunction) {
  namespacingFunction = userFunction
}

export function combineTrackReducers(reducers) {
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

export function getSelector(reducer) {
  if (typeof reducer.__RETRACK_GET_PATH_ARRAY__ === 'function') {
    const pathArray = reducer.__RETRACK_GET_PATH_ARRAY__()
    return (state) => pathArray.reduce((acc, val) => acc[val], state)
  } else {
    throw new Error('a reducer that you intended to get its selector is not being tracked by `retrack`. ensure all of your reducers are being combined using `combineTrackReducers`')
  }
}

function throwSetActionNameError() {
  throw new Error('`retrack`: you are not supposed to change action names after passing to `namespaceReducerActions`.')
}

export function namespaceReducerActions(reducer, actionNames) {
  const actionNamesClone = { ...actionNames }
  Object.keys(actionNamesClone).forEach(function (actionName) {
    Object.defineProperty(
      actionNames,
      actionName,
      {
        get: () => {
          if (reducer.__RETRACK_GET_PATH_ARRAY__) {
            return namespacingFunction([...reducer.__RETRACK_GET_PATH_ARRAY__(), actionNamesClone[actionName]])
          }
          return '' // redux internal actions
        },
        set: throwSetActionNameError
      }
    )
  })
}
