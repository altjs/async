import createAsyncDispatch from '../src/'
import AsyncDispatch from '../src/AsyncDispatch'
import send from '../src/send'
import assert from 'assert'
import isPromise from 'is-promise'

// setup
const dispatcherLogger = {
  dispatch(x) {
    console.log('dispatching', x)
  }
}

// fp
const make = createAsyncDispatch(dispatcherLogger)

const fetchCompany = make('fetchCompany', send => companyId => {
  return send(null, status => {
    if (!status.getRequest()) return Promise.resolve(companyId)

    return companyId
  })
})

assert(isPromise(fetchCompany(1)))

// oop
class CompanyFetcher extends AsyncDispatch {
  constructor(dispatcher, name) {
    super(dispatcher, name)
  }

  fetchCompany(companyId) {
    return this.send(null, status => {
      if (!status.getRequest()) return Promise.resolve(companyId)

      return companyId
    })
  }
}

const companyFetcher = new CompanyFetcher(dispatcherLogger)

assert(isPromise(companyFetcher.fetchCompany(2)))

// something else
const asyncDispatch = new AsyncDispatch(dispatcherLogger, 'fetchCompany')

const fetchCompany2 = companyId => send(asyncDispatch)(null, status => {
  if (!status.getRequest()) return Promise.resolve(companyId)

  return companyId
})

assert(isPromise(fetchCompany2(3)))
