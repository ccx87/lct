import Assign from 'lodash.assign'
import { 
  EVENTS_INITIALIZATION_DATA,
  WIMDOW_UN_OR_COLLECT_FONTS,
  WIMDOW_UNINSTALL_FONT_DEL,
  WIMDOW_INSTALL_FONT_ADD,
	FONT_ATTRIBUTES_DATA,
  FONT_UN_OR_CHECK_ITEM,
  FONT_UN_OR_ALLCHECK_ITEM,
  TRIGGER_DIALOG_INFO,
  TRIGGER_MINMIZE_INFO,
  SMART_MENU_INFO,
  EVENTS_ONE_KEY_WARPER_REQUEST,
  EVENTS_KEY_PADDED,
  EVENTS_OPEN_FILE_REQUEST,
  EVENTS_CLEAR_DETECT,
  EVENTS_IS_SCAN_FINISHED_REQUEST,
  SELECT_TAG_SAVE, 
  EVENTS_GET_PREVIEW_IMAGE,
  RECEVIE_GET_PREVIEW_IMAGE,
  RECEVIE_GET_FONTS_BY_FONT_ITEM_ID,
  EVENTS_GET_SORT_FILTER_DATA,
  EVENTS_ATTRIBUTES_DATA,
  EVENTS_UN_OR_CHECK_ITEM,
  EVENTS_UN_OR_ALLCHECK_ITEM,
  EVENTS_UNCHECK,
  EVENTS_CHECK,
  RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST,
  RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST,
  RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST,
  RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST,
  RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST,
  RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST,
  RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST,
  RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST,
  RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST,
  RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST,
  RECEIVE_ASYNC_GET_FILE_REQUEST_ALWAYS,
  FIND_YUN_FRIEND,
  RECEVIE_ASYNC_PASTE_DATA,
  RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST
} from '../constants/ActionsTypes'
import { log } from '../constants/UtilConstant'

function posts(state = {}, action) {
  switch (action.type) {                
    case RECEVIE_GET_PREVIEW_IMAGE:
        if( action.error ){
            return Assign({}, state, {
              previewImageYun: {
                error: action.error,
                error_code: 101
              },              
              previewImageYunLastUpdate: action.receivedAt
            })         
        }
        return Assign({}, state, {
            previewImageYun: {
              callback: action.posts,
              passData: action.data
            },
            previewImageYunLastUpdate: action.receivedAt           
        })

    case RECEVIE_GET_FONTS_BY_FONT_ITEM_ID:
        if( action.error ){
            return Assign({}, state, {
              unInstallCallback:{
                  error: action.error,
                  error_code: 101
              },
              unInstallCallbackLastUpdate: action.receivedAt
            })         
        }
        return Assign({}, state, {
            unInstallCallback: action.posts,
            unInstallCallbackLastUpdate: action.receivedAt           
        })
    case RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST:
        //扫描初始化
         return Assign({}, state, {
             getScanDocsInit: action.json_result_data,
             getScanDocsInitLastUpdated: action.receivedAt
         })            
    case RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST:
         //开始扫描
         return Assign({}, state, {
             setScanDocs: action.json_result_data,
             setScanDocsLastUpdated: action.receivedAt
         })
    case RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST:
         //单文件马上扫描
         return Assign({}, state, {
             addScanDocs: action.json_result_data,
             addScanDocsLastUpdated: action.receivedAt
         })
    case RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST:
         //暂停扫描
         return Assign({}, state, {
             pauseScanDocs: action.json_result_data,
             pauseScanDocsLastUpdated: action.receivedAt
         })                           
    case RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST:
         //获取当前扫描的路径
         return Assign({}, state, {
             getCurrentScanPath: action.json_result_data,
             getCurrentScanPathLastUpdated: action.receivedAt
         })
    case RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST:
         //继续扫描
         return Assign({}, state, {
             refreshScanDocs: action.json_result_data,
             refreshScanDocsLastUpdated: action.receivedAt
         }) 
    case RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST:
         //删除文件夹或文件
         return Assign({}, state, {
             delectScanDocs: action.json_result_data,
             delectScanDocsLastUpdated: action.receivedAt
         })
    case RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST:
         //停止扫描
         return Assign({}, state, {
             stopScanDocs: action.json_result_data,
             stopScanDocsLastUpdated: action.receivedAt
         }) 
    case RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST:
         //获取文件信息（当时时获取不到文件信息时调用该返回）
         return Assign({}, state, {
             fileInfoData: action.json_result_data,
             fileInfoDataLastUpdated: action.receivedAt
         }) 
    case RECEIVE_ASYNC_GET_FILE_REQUEST_ALWAYS:
         //时时获取扫描文件信息
         return Assign({}, state, {
             fileItemData: action.json_result_data,
             fileItemDataLastUpdated: action.receivedAt
         })             
    case FIND_YUN_FRIEND:
        return Assign({}, state, {
            findYunFriend: action.posts,
            findYunFriendLastUpdated: action.receivedAt
        }) 
    case RECEVIE_ASYNC_PASTE_DATA:
        return Assign({}, state, {
            pasteData: action.json_result_data,
            pasteDataLastUpdated: action.receivedAt
        })
    case RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST:
        return Assign({}, state, {
            loopScan: action.json_result_data,
            loopScanLastUpdated: action.receivedAt
        })                                                         
    default:
      return state
  }
}

//返回当前所有已选择的字体	
export const checkReturnIds = (temp, state, data) => {
    if( temp ){
      //新增 
        if( state.checkIds ){
            let hasid = false;
            for( let i = 0; i < state.checkIds.length; i++ ){
                if( state.checkIds[i] == data.font_id ){
                    hasid = true;
                    break;
                }
            } 
            if( !hasid ){
                state.checkIds.push(data.font_id)
            }
        }else{
            state['checkIds'] = []
            state.checkIds.push(data.font_id)
        }     
    } else{
      //删除当前font_id
        if( state.checkIds ){
            for( let i = 0; i < state.checkIds.length; i++ ){
                if( state.checkIds[i] == data.font_id ){
                     state.checkIds.splice(i, 1)
                     break;
                }
            } 
        }
    }  
    return state.checkIds
}
//取消选择的字体
export const unCheckReturnIds = (state, data) => {
    let unCheckIds = []
    //...
    if( state.checkIds && state.checkIds.length > 0 ){
        for( let i = 0; i < state.checkIds.length; i++ ){
            if( state.checkIds[i] == data.font_id ){
                 unCheckIds = state.checkIds.splice(i, 1)
                 break
            }
        }
    }else{
       unCheckIds.push(data.font_id)  
    }
    return unCheckIds[0]
}

//新增一个数组
export const reorganizeAdd = (state, data) => {
    if( state && state.length > 0 ){
        if( data && data.length > 0 ){
            state.unshift.apply(state, data) 
        }else{
            state.push(data)
        }
        return state
    }else{
        if( data && data.length > 0 ){
           
        }else{
            data = [data]
        }
        return data           
    }
}
//删除一个数组 value
export const reorganizeDel = (state, data) => {
    if( state && state.length > 0 ){
        for( let i = 0; i < state.length; i++ ){
            if( state[i].value === data.value ){
                state.splice(i, 1)
                break;
            }
        }
    }
    return state
}
export const createObject = (key, value) =>  {  
    var object = new Object();  
    object[""+ key +""] = value;      
    return object;  
} 

export default function events(state = {}, action) {	
  switch (action.type) {
    case RECEVIE_GET_PREVIEW_IMAGE:
    case RECEVIE_GET_FONTS_BY_FONT_ITEM_ID:
    case RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST:
    case RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST: 
    case RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST:
    case RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST:
    case RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST:
    case RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST:
    case RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST:
    case RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST:
    case RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST:
    case RECEIVE_ASYNC_GET_FILE_REQUEST_ALWAYS:
    case FIND_YUN_FRIEND:
    case RECEVIE_ASYNC_PASTE_DATA:
    case RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST:
         return Assign({}, state, posts(state, action))     

    case EVENTS_INITIALIZATION_DATA:
         if( action.key ){
            return createObject(action.key, state[(""+ action.key +"")])
         }else{
            return {} 
         }

    case FONT_ATTRIBUTES_DATA:
    case EVENTS_ATTRIBUTES_DATA:
         return Assign({}, state, {
            attributes: action.data, 
            attributesLastUpdated: action.receivedAt
         })                         
  	
    case EVENTS_CHECK:
         return Assign({}, state, {
            check: action.data, 
            checkLastUpdated: action.receivedAt
         })         

    case EVENTS_UNCHECK:
         return Assign({}, state, {
            uncheck: action.data, 
            uncheckLastUpdated: action.receivedAt
         })   

    case FONT_UN_OR_CHECK_ITEM:
    case EVENTS_UN_OR_CHECK_ITEM:
         //（适用于字体助手）
         if( action.isCheck ){    
             return Assign({}, state, {
                 attributes: action.data,
                 checkIds: checkReturnIds(true, state, action.data),
                 unCheckIds: null,
                 checkLastUpdated: action.receivedAt
             })
         }else{
             return Assign({}, state, {
                 attributes: action.data, 
                 checkIds: checkReturnIds(false, state, action.data),
                 unCheckIds: action.data.font_id,
                 allCheck: false,
                 checkLastUpdated: action.receivedAt
             })             
         }

    case FONT_UN_OR_ALLCHECK_ITEM:
    case EVENTS_UN_OR_ALLCHECK_ITEM:
         if( action.isCheck ){    
             return Assign({}, state, {
                 attributes: 'more item', 
                 unCheckIds: null,
                 checkIds: action.data.map((item) => item.font_id),
                 checkLastUpdated: action.receivedAt
             })
         } else{
             return Assign({}, state, {
                 checkIds: null,
                 attributes: null, 
                 unCheckIds: null,
                 checkLastUpdated: action.receivedAt
             })          
         }        

    case WIMDOW_UN_OR_COLLECT_FONTS: 
         if( action.temp ){   
             return Assign({}, state, {
                  collectIds: action.json_result_data.data,
                  unCollectIds: null,
                  collectLastUpdated: action.receivedAt
             }) 
         } else{
             return Assign({}, state, {
                  collectIds: null,
                  unCollectIds: action.json_result_data.data,
                  collectLastUpdated: action.receivedAt
             })          
         } 

    case TRIGGER_DIALOG_INFO:  
         return Assign({}, state, {
              dialogData: action.data,
              dialogLastUpdated: action.receivedAt
         })

    case TRIGGER_MINMIZE_INFO:  
         return Assign({}, state, {
              minmizeData: action.data,
              minmizeLastUpdated: action.receivedAt
         })         

    case SMART_MENU_INFO:  
         return Assign({}, state, {
              smartMenuData: action.data,
              smartMenuLastUpdated: action.receivedAt
         })         

    case WIMDOW_UNINSTALL_FONT_DEL:    
         return Assign({}, state, {
              uninstallIds: action.json_result_data,
              uninstallLastUpdated: action.receivedAt              
         })                         

    case WIMDOW_INSTALL_FONT_ADD:   
         return Assign({}, state, {
              installIds: action.json_result_data,
              installLastUpdated: action.receivedAt              
         })

    case SELECT_TAG_SAVE:    
         return Assign({}, state, {
              selectTagData:  action.list,
              tagLastUpdated: action.receivedAt          
         })          

    case EVENTS_ONE_KEY_WARPER_REQUEST:   
         return Assign({}, state, {
              keyWarper: action.json_result_data,
              keyWarperLastUpdated: action.receivedAt          
         }) 

    case EVENTS_KEY_PADDED:   
         return Assign({}, state, {
              keyPadded: action.data,
              keyPaddedLastUpdated: action.receivedAt          
         }) 

    case EVENTS_CLEAR_DETECT:   
         return Assign({}, state, {
              clearDetect: action.json_result_data,
              clearDetectLastUpdated: action.receivedAt          
         })

    case EVENTS_OPEN_FILE_REQUEST:
         if( action.tempData && action.json_result_data ){
             action.json_result_data["tempData"] = action.tempData; 
         } 
         if( action.temp  == 0 ){
             return Assign({}, state, {
                  openFilePath_0: action.json_result_data,
                  openFile0LastUpdate: action.receivedAt
             })              
         } else if( action.temp == 1 ){
             return Assign({}, state, {
                  openFilePath_1: action.json_result_data,
                  openFile1LastUpdate: action.receivedAt
             })           
           }  else if( action.temp == 2 ){
             return Assign({}, state, {
                  openFilePath_2: action.json_result_data,
                  openFile2LastUpdate: action.receivedAt
             })           
         }  else if( action.temp == 3 ){
             return Assign({}, state, {
                  openFilePath_3: action.json_result_data,
                  openFile3LastUpdate: action.receivedAt
             })           
         } else{ 
             return Assign({}, state, {
                  openFilePath_1: action.json_result_data,
                  openFile1LastUpdate: action.receivedAt
             }) 
         }
         break;

    case EVENTS_IS_SCAN_FINISHED_REQUEST:    
         return Assign({}, state, {
              scanFinished: action.json_result_data,
              scanFinishedLastUpdated: action.receivedAt          
         }) 

    case EVENTS_GET_PREVIEW_IMAGE:
         return Assign({}, state, {
              previewImageLocal: {
                  callback: action.json_result_data,
                  passData: action.data
              }, 
              previewImageLocalLastUpdate: action.receivedAt           
         })

    case EVENTS_GET_SORT_FILTER_DATA:
         if( action.temp ){
             return Assign({}, state, {
                  sortFilterData: reorganizeAdd(state.sortFilterData, action.data),
                  sortFilterLastUpdated: action.receivedAt          
             })
         }else{
             return Assign({}, state, {
                  sortFilterData: reorganizeDel(state.sortFilterData, action.data),
                  sortFilterLastUpdated: action.receivedAt          
             })           
         }

    case RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST:
        if( action.error ){
            return Assign({}, state, {
                setScanFilter: action.error,
                setScanFilterLastUpdated: action.receivedAt
            })         
        }    
         return Assign({}, state, {
             setScanFilter: action.json_result_data,
             setScanFilterLastUpdated: action.receivedAt
         })          

    default:
      return state
  }
}
