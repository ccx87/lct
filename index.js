import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import LoginApp from './containers/LoginApp'
import FontAssistantApp from './containers/FontAssistantApp'
import LocalFileApp from './containers/LocalFileApp'
import FilesManagementApp from './containers/FilesManagementApp'
import SetApp from './containers/SetApp'
import ChatApp from './containers/ChatApp'
import SearchCenterApp from './containers/SearchCenterApp'

import fontCreateStore from './store/fontCreateStore'

const store = fontCreateStore(),
      doc = document;
console.time("开启App")

//登录界面
const LoginDom = doc.getElementById('Lianty-Login')
if( LoginDom != null ){
	render(
	   <Provider store={store}>	
	       <LoginApp />  
	   </Provider>,
	   LoginDom
	)
}
//系统设置界面
const SetDom = doc.getElementById('Lianty-Set')
if( SetDom != null ){
	render(
	   <Provider store={store}>	
	       <SetApp />  
	   </Provider>,
	   SetDom
	)
}
//字体助手界面
const FontAssistantDom = doc.getElementById('Lianty-FontAssistant')
if( FontAssistantDom != null ){
	render(
	   <Provider store={store}>	
	       <FontAssistantApp />  
	   </Provider>,
	   FontAssistantDom
	)
}
//素材管理界面一
const FileManagementDom = doc.getElementById('Lianty-FilesManagement')
if( FileManagementDom != null ){
	render(
	   <Provider store={store}>	
	       <FilesManagementApp />  
	   </Provider>,
	   FileManagementDom
	)
}
//本地素材界面二
const LocalFileDom = doc.getElementById('Lianty-LocalFile')
if( LocalFileDom != null ){
	render(
	   <Provider store={store}>	
	       <LocalFileApp />  
	   </Provider>,
	   LocalFileDom
	)
}
//好友中心界面
const ChatDom = doc.getElementById('Lianty-Chat')
if( ChatDom != null ){
	render(
	   <Provider store={store}>	
	       <ChatApp />  
	   </Provider>,
	   ChatDom
	)
}
//搜索中心界面
const SearchDom = doc.getElementById('Lianty-SearchCenter')
if( SearchDom != null ){
	render(
	   <Provider store={store}>	
	       <SearchCenterApp />
	   </Provider>,
	   SearchDom
	)
}
console.timeEnd("开启App")
