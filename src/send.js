import isPromise from 'is-promise'

export default data => (id, exec) => {
  const { begin, success, failure, end } = data.actions

  const beginDispatch = () => data.dispatcher.dispatch(begin(id))

  const endDispatch = () => {
    delete data.store.pending[id]
    if (!data.opts.cache) delete data.store.requests[id]
    data.dispatcher.dispatch(end(id))
  }

  const asyncDispatch = (promise) => {
    promise.then(beginDispatch, beginDispatch)

    const result = promise.then((res) => {
      data.dispatcher.dispatch(success(res))
      return res
    }, (err) => {
      data.dispatcher.dispatch({
        ...failure(err),
        error: true,
      })
      return Promise.reject(err)
    })

    data.store.pending[id] = true
    data.store.requests[id] = result

    promise.then(endDispatch, endDispatch)

    return result
  }

  const status = {
    state: data.opts.getState ? data.opts.getState(data.dispatcher) : null,
    isLoading: () => data.store.pending.hasOwnProperty(id),
    getRequest: () => data.store.requests[id],
    dispatcher: data.dispatcher,
  }

  const value = exec(status)

  // remote request
  if (isPromise(value)) {
    return asyncDispatch(value)

    // a function, handle your own async dispatches
  } else if (typeof value === 'function') {
    return value(asyncDispatch)
  }

  // local value
  return value
}
