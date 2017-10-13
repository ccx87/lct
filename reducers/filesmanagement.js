import Assign from 'lodash.assign'
import {
  INITIALIZATION_DATA,
  INITIALIZATION_LOADING_DATA,
  RECEIVE_ASYNC_GET_FILE_REQUEST,
  RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST
} from '../constants/ActionsTypes'
import { log, objClone, getDriveState } from '../constants/UtilConstant'
import { getFileInitObjectData } from '../constants/ConfigInfo'
import { GET_DRIVE_STATE } from '../constants/DataConstant'
	
// 初始化state数据
const initialState = {
  common: objClone(getFileInitObjectData),
  allFiles: []
}
function posts(state = {initialState}, action) {
  switch (action.type) {
      case 'abc':
      break;         
    default:
      return state 
  }  
}

export default function filesmanagement(state = initialState, action) {	
  switch (action.type) {  
    case INITIALIZATION_DATA:
         return {}

    case INITIALIZATION_LOADING_DATA:
         if( action.data ){
             return {
                 common: action.data
             } 
         }else{
             return {
                 common: state.common
             }          
         }

    case RECEIVE_ASYNC_GET_FILE_REQUEST: 
    case RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST:      
         return Assign({}, state, posts(state, action))

    default:
      return state
  }
}
