let namespacingFunction = (strArr) => strArr.join('/')

export function setNamespacingFunction(customFunction) {
  namespacingFunction = customFunction
}

export function namespaceReducerActions(reducer, actionTypes) {
  const actionTypesClone = { ...actionTypes }
  Object.keys(actionTypesClone).forEach(function (actionType) {
    Object.defineProperty(
      actionTypes,
      actionType,
      {
        get: () => {
          if (typeof reducer.__RETRACK_GET_PATH_ARRAY__ === 'function') {
            return namespacingFunction([...reducer.__RETRACK_GET_PATH_ARRAY__(), actionTypesClone[actionType]])
          }
          // before any combineTrackReducer is called on the reducer
          return {
            toString: () => {
              if (typeof reducer.__RETRACK_GET_PATH_ARRAY__ === 'function') {
                return namespacingFunction([...reducer.__RETRACK_GET_PATH_ARRAY__(), actionTypesClone[actionType]])
              }
              return actionTypesClone[actionType]
            }
          }
        },
        set: () => { throw new Error('`retrack`: you are not supposed to change action types after passing to `namespaceReducerActions`.') }
      }
    )
  })
}