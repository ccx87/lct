import Assign from 'lodash.assign'
import { 
    GET_YUN_CHAT_ACCID,
    RECEIVE_ASYNC_GET_ADD_FRIEND_REQUEST
} from '../constants/ActionsTypes'
import { log } from '../constants/UtilConstant'

export const posts = (state = {}, action) => {
  switch (action.type) {
      
    case GET_YUN_CHAT_ACCID:
        if( action.error ){
            return Assign({}, state, {
              error: action.error,
              errorCode: 101,
              loginleLastUpdated: action.receivedAt
            })         
        } 
        return Assign({}, state, {
            chatAccid: action.posts,
            chatAccidLastUpdated: action.receivedAt
        })                        

    default:
      return state
  }
}
    
export default function chats(state = {}, action) {	
    switch (action.type) {  

        case GET_YUN_CHAT_ACCID:
             return Assign({}, state, posts(state, action)) 

        case RECEIVE_ASYNC_GET_ADD_FRIEND_REQUEST:
             return Assign({}, state, {
                 addFriend: action.data,
                 addFriendLastUpdated: action.receivedAt
             })                                     
             
        default:
          return state
    }
}
