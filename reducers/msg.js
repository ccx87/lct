import Assign from 'lodash.assign'
import { 
  MESSAGE_DEFAULT,
  MESSAGE_DOWNLOAD_NUMBER,
  MESSAGE_INSTALL_NUMBER,
  MESSAGE_NOTICE,
  MESSAGE_ADD_SCAN,
  MESSAGE_MODE_CHANGE,
  MESSAGE_FILE_INFO,
  MESSAGE_SEARCH_FILE
} from '../constants/ActionsTypes'
import { log } from '../constants/UtilConstant'

export const downloadNumber = (state, data) => {
    if( state.downloadMsg ){
        if( state.downloadMsg.number > 0 ){
            state.downloadMsg.number += data.number
        }else{
            state.downloadMsg["number"] = data.number
        } 
    }else{
       state["downloadMsg"] = {}
       state.downloadMsg["number"] = data.number
    }
    return state.downloadMsg
}
	
export default function msg(state = {}, action) {	
  switch (action.type) { 
    case MESSAGE_DEFAULT:
         return Assign({}, state, {
             defaultMsg: action.data,
             defaultMsgLastUpdated: action.receivedAt
         })

    case MESSAGE_DOWNLOAD_NUMBER:
         return Assign({}, state, {
             downloadMsg: downloadNumber(state, action.data),
             downloadMsgLastUpdated: action.receivedAt
         })

    case MESSAGE_INSTALL_NUMBER:
         return Assign({}, state, {
             installMsg: action.data,
             installMsgLastUpdated: action.receivedAt
         })

    case MESSAGE_NOTICE:
         return Assign({}, state, {
             noticeMsg: action.data,
             noticeMsgLastUpdated: action.receivedAt
         }) 

    case MESSAGE_ADD_SCAN:
         return Assign({}, state, {
             addScanMsg: action.data,
             addScanMsgLastUpdated: action.receivedAt
         }) 

    case MESSAGE_MODE_CHANGE:
         return Assign({}, state, {
             modeChangeMsg: action.data,
             modeChangeMsgLastUpdated: action.receivedAt
         }) 

    case MESSAGE_FILE_INFO:
         return Assign({}, state, {
             fileInfoMsg: action.data,
             fileInfoMsgLastUpdated: action.receivedAt
         }) 

    case MESSAGE_SEARCH_FILE:
         return Assign({}, state, {
             searchFileMsg: action.data,
             searchFileMsgLastUpdated: action.receivedAt
         })                                                                
         
    default:
      return state
  }
}
