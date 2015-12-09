import { generateActions } from 'create-actions'
import AsyncDispatch from './AsyncDispatch'
import send from './send'

// get the action creators that will be created given a namespace
export const getActionCreators = (namespace) => {
  return generateActions(namespace, [
    'begin',
    'success',
    'failure',
    'end',
  ])
}

export { AsyncDispatch }

// Creates a function that when called with a dispatcher will
// create all the necessary actions for you and dispatch them in the correct
// order. Basic caching is also provided by the utility
const createAsyncDispatch = dispatcher => (namespace, fn, opts = {}) => {
  const actions = {
    ...getActionCreators(namespace),
    ...opts,
  }

  const store = { pending: {}, requests: {} }

  const forSend = send({
    actions,
    dispatcher,
    store,
    opts,
  })

  return (...args) => fn(forSend)(...args)
}

export default createAsyncDispatch
