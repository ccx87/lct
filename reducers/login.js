import Assign from 'lodash.assign'
import { 
	GET_HISTORY_USER_DATA,
  SET_LOGIN_USER_REQUEST,
  WINDOW_LOGIN_USER_REQUEST,
  RECEIVE_LOGIN_USER_SUBMIT_LIANTY_POSTS,
  RECEIVE_LOGIN_THIRD_USER_SUBMIT_LIANTY_POSTS,
	SET_REGIST_PHONE_DATA,
	SET_REGIST_EMAIL_DATA,
  GET_NO_DEAL_MESSAGE_LIST,
  DO_DEAL,
  GET_PC_NOTICE_MESSAGE
} from '../constants/ActionsTypes'
import { log } from '../constants/UtilConstant'

function posts(state = {}, action) {
  switch (action.type) {
      
    case RECEIVE_LOGIN_USER_SUBMIT_LIANTY_POSTS:
      return Assign({}, state, {
        error: action.error,
        errorCode: action.error ? 101 : 0,
        userData: action.error ? null : action.posts,
        commitData: action.commitData,
        loginleLastUpdated: action.receivedAt
      })

    case RECEIVE_LOGIN_THIRD_USER_SUBMIT_LIANTY_POSTS:      
      return Assign({}, state, {
         error: action.error,
         errorCode: action.error ? 101 : 0,        
         thirdUserData: action.error ? null : action.posts,
         loginleLastUpdated: action.receivedAt
      }) 
    case GET_NO_DEAL_MESSAGE_LIST: 
      return Assign({}, state, {      
         dealMessageList: action.posts,
         dealMessageListLastUpdated: action.receivedAt
      })
    case DO_DEAL:
      return Assign({}, state, {      
         doDeal: action.posts,
         doDealLastUpdated: action.receivedAt
      })
    case GET_PC_NOTICE_MESSAGE:
      return Assign({}, state, {      
         pcNoticeMsg: action.posts,
         pcNoticeMsgLastUpdated: action.receivedAt
      })
    case WINDOW_LOGIN_USER_REQUEST:
       let userData = null;
       try{
          if( action.posts && action.posts.data && action.posts.data != '' ){
              userData = JSON.parse(action.posts.data); 
          }
       }catch(e){userData = null}
       return Assign({}, state, {
           loginUserData: userData, 
           loginLastUpdated: action.receivedAt
       })                                          

    default:
      return state
  }
}
	
export default function login(state = {}, action) {
  switch (action.type) {     
    case RECEIVE_LOGIN_USER_SUBMIT_LIANTY_POSTS:
    case RECEIVE_LOGIN_THIRD_USER_SUBMIT_LIANTY_POSTS:
    case GET_NO_DEAL_MESSAGE_LIST:
    case GET_PC_NOTICE_MESSAGE:
    case DO_DEAL:
    case WINDOW_LOGIN_USER_REQUEST:
         return Assign({}, state, posts(state, action)) 

    case GET_HISTORY_USER_DATA:
         return Assign({}, state, {
             historyUserData: action.jsonData_history_user, 
             historyLastUpdated: action.receivedAt
         })

    case SET_LOGIN_USER_REQUEST:
         return Assign({}, state, {
             setUserLogin: action.json_result_data, 
             setUserLoginLastUpdated: action.receivedAt
         })
    default:
      return state
  }
}
