import { createStore, applyMiddleware,compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from '../reducers'

//applyMiddleware来自redux可以包装 store 的 dispatch
//thunk作用是使action创建函数可以返回一个function代替一个action对象
//logger()
const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunk,
        logger()
    )
    //window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default function fontCreateStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState)
  //热替换选项
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
