import { generateActions } from 'create-actions'
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

export default class AyncDispatch {
  constructor(dispatcher, namespace, opts = {}) {
    this.dispatcher = dispatcher
    this.namespace = namespace
    this.opts = opts

    this.actions = {
      ...getActionCreators(this.namespace),
      ...this.opts,
    }

    this.store = { pending: {}, requests: {} }
  }

  send(id, exec) {
    return send(this)(id, exec)
  }
}
