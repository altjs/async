# alt-async

## Install

```sh
npm install alt-async
```

## Usage

```js
import createAsyncDispatch from 'alt-async'
import Alt from 'alt'

const alt = new Alt()

const asyncDispatch = createAsyncDispatch(alt)

const fetchCompany = asyncDispatch('fetchCompany', send => companyId => {
  return send(null, status => {
    if (!status.getRequest()) return Promise.resolve(companyId)

    return companyId
  })
})

assert(isPromise(fetchCompany(1)))
```

Breaking it down. `createAsyncDispatch` takes in a dispatcher, any dispatcher.
`flux` will do but you're probably using `alt` so you pass that in. That'll
return a function which you can then use to create your async functions.

That function's signature is (namespace: string, value: function, opts: Object)
you can pass in certain options such as custom success, failure, begin, and end
actions; or you can have them auto-generated for you.

The `value` AKA function that you pass in as the second argument is a curried
function that takes in a single `send` argument. `send` is a function that when
called will execute the async dispatch. `send` takes an `id` for each request,
and a function callback that is ran. That callback contains a `status` object
which has information about the request.

This is all probably really confusing so here's some pseudo types...

## API

```js
createAsyncDispatch(dispatcher: { dispatch: function }): asyncDispatch

asyncDispatch(namespace: string, value: function, opts: Object): function

value = function (send) {
  return function (yourArguments, go, here) { }
}

// optional
opts = {
  success: Action
  failure: Action
  begin: Action
  end: Action
}

send(id: string, resolver: function)

resolver = function (status) { }

status: {
  state: opts.getState || null
  isLoading()
  getRequest()
  dispatcher
}
```

## Retrieving the auto-generated actions

```js
import { getActionCreators } from 'alt-async'

const { success, failure, begin, end } = getActionCreators(theNameSpaceIUsed)

  // in your alt store or whatever...
  this.bindListeners({
    handleSuccess: success,
  })
```

## But I like classes

```js
import { AsyncDispatch } from 'alt-async'

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

const companyFetcher = new CompanyFetcher(alt)
```

## More code

```js
import createAsyncDispatch from 'alt-async'
import alt from '../alt'

export default createAsyncDispatch(alt)('createUser', send => (user) => {
  return send(user.id, (status) => {
    // dont allow creating same user more than once
    if (status.isLoading()) return

    return xhr.users.update(user).then(res => res.data)
  })
}, {
  success: UserActions.userSaved,
  failure: UserActions.userSaveFailed,
})
```
