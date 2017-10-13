import { combineReducers } from 'redux'

import { default as login } from './login'
import { default as fonts } from './fonts'
import { default as events } from './events'
import { default as inIt } from './inIt'
import { default as msg } from './msg'
import { default as files } from './files'
import { default as chats } from './chats'
import { default as shitu } from './shitu'
import { default as searchfont } from './searchfont'
import { default as filesmanagement } from './filesmanagement'

const doc = document;
let rootReducer = null;

const Lianty_LocalFile = doc.getElementById('Lianty-LocalFile'),
      Lianty_Login = doc.getElementById('Lianty-Login'),
      Lianty_FontAssistant = doc.getElementById('Lianty-FontAssistant'),
      Lianty_Set = doc.getElementById('Lianty-Set'),
      Lianty_Chat = doc.getElementById('Lianty-Chat'),
      Lianty_Shitu = doc.getElementById('Lianty-SearchCenter'),
      Lianty_FilesManagement = doc.getElementById('Lianty-FilesManagement');
if( Lianty_Login || Lianty_Set ) {
	rootReducer = combineReducers({
	  inIt,	
	  login,
	  events
	})	
}

if( Lianty_FontAssistant ) {
	rootReducer = combineReducers({
	  inIt,	
	  login,
	  fonts,
	  events,
	  msg
	})	
}

if( Lianty_FilesManagement ){
    rootReducer = combineReducers({
	  inIt,	
	  login,
	  files,
	  filesmanagement,
	  events,
	  msg
	})	
}

if( Lianty_LocalFile ) {
    rootReducer = combineReducers({
	  inIt,	
	  login,
	  files,
	  events,
	  msg
	})
}

if( Lianty_Chat ) {
    rootReducer = combineReducers({
	  inIt,	
	  login,
	  chats,
	  events,
	  msg
	})
}
if(Lianty_Shitu){
	rootReducer = combineReducers({
	  inIt,	
	  login,
	  fonts,		
	  shitu,
	  searchfont,
	  events,
	  msg	  
	})	
}
export default rootReducer
