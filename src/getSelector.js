export default function getSelector(reducer) {
  if (typeof reducer.__RETRACK_GET_PATH_ARRAY__ === 'function') {
    const pathArray = reducer.__RETRACK_GET_PATH_ARRAY__()
    return (state) => pathArray.reduce((acc, val) => acc[val], state)
  } else {
    throw new Error('a reducer that you intended to get its selector is not being tracked by `retrack`. ensure all of your reducers are being combined using `combineTrackReducers`')
  }
}