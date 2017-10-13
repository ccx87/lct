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
    case RECEIVE_ASYNC_GET_FILE_REQUEST:
    case RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST:
         log("---files---", state, action)
         let allFiles = [], //有分页加载时当前和之前的数据，没有则当前数据
             drive = {}, //本地硬盘
             mobileDrive = {}; //移动硬盘
         if( action.common && state.common ){
             if( action.common.mode == 1 && action.common.pull_load  ){
                 //当前目录下所有页数数据存起来 
                 if( action.json_result_data && action.json_result_data.data && action.json_result_data.data.constructor == Array ) {
                     if( state.allFiles && state.allFiles.constructor == Array ){
                         allFiles = [...state.allFiles]
                         action.json_result_data.data.map((item) => allFiles = [...allFiles, item]) 
                     }                  
                 } 
             }else{
                 //只存当前节点或当前页数的数据
                 if( action.json_result_data && action.json_result_data.data && action.json_result_data.data.constructor == Array ) {
                    action.json_result_data.data.map((item) => allFiles = [...allFiles, item])                   
                 }                 
             }
         }         
         if( action.common && action.common.pull_load ){
             //此举是下拉加载时递增的页数码计算，保持正确的页数
             if( action.json_result_data && action.json_result_data.data && action.json_result_data.data.constructor == Array ) {                   
             } else {
                if( action.common.offset > 1 ){
                   action.common.offset = action.common.offset - 1
                }
             }
         }
         //判断本地硬盘
         if( action.common && action.common.dir == null && 
             action.json_result_data && action.json_result_data.data ){
             if( action.json_result_data.data.constructor == Array ){
                //获取本地硬盘
                const arr1 = action.json_result_data.data.filter(item => {
                    if( getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_fixed ||
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_fixed ){
                        return item
                    }
                })
                drive = {
                    data: arr1,
                    error: action.json_result_data.error,
                    error_code: action.json_result_data.error_code,
                    is_success: action.json_result_data.is_success
                }
                //获取移动硬盘
                const arr2 = action.json_result_data.data.filter(item => {
                    if( getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_removable ||
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_usb ||
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_CDROM || 
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_removable ||
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_usb ||
                        getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_CDROM ){
                        return item
                    }
                })
                mobileDrive = {
                    data: arr2,
                    error: action.json_result_data.error,
                    error_code: action.json_result_data.error_code,
                    is_success: action.json_result_data.is_success                    
                }
             }
         }else{
             if( state.driveLetter ){
                drive = state.driveLetter
             }else{
                drive = action.json_result_data
             }
             if( state.mobileDrive ){
                mobileDrive = state.mobileDrive
             }
         }
         return Assign({}, state, {
             common: action.common,
             allFiles: allFiles.length > 0 ? allFiles : state.allFiles,
             filesData: action.json_result_data,
             driveLetter: drive,
             mobileDrive: mobileDrive,
             filesLastUpdated: action.receivedAt
         })              
    default:
      return state     

  }  
}

export default function files(state = initialState, action) {	
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
