import Assign from 'lodash.assign'
import {
  QUERY_INITIALIZETE_COMPLETED_REQUEST, 
  WIMDOW_INITIALIZE_FONT_DB_REQUEST, 
  GET_INIT_ROUTE,
  ADD_GET_DOWNLOAD_BEGING,
  WINDOW_GET_DOWNLOAD_BEGING,
  EVENTS_GET_DOWNLOAD_LIST,
  INITIALIZATION_EVENTS_CALLBACK,  
  RECEIVE_SINGLE_LIST_GO_POSTS, 
  RECEIVE_ADD_SINGLE_FONT_GO_POSTS,
  INIT_GET_CONFIG_INFO,
  INIT_SET_CONFIG_INFO,
  JS_MSG_HANDLE
} from '../constants/ActionsTypes'
import { log } from '../constants/UtilConstant'

export const addSingleFont = (state, data) => {
    if( state.menuSingleData ){
        if( !state.menuSingleData.data ){
            state.menuSingleData['data'] = []
        }
    }else{
        state['menuSingleData'] = {};
        state.menuSingleData['data'] = [];
    }
    if( data.error_code == 0 ){
        state.menuSingleData.data.push(data.data)
    }
    return state.menuSingleData
}
export const setNewConfig = (state, action) => {
    if( action.json_result_data && action.json_result_data.data && action.list && action.list[0] ){
        const stateData = state.getConfig.data,
              resultData = action.json_result_data.data;
        switch(action.list[0].key){
            case 'auto_scan_switch':
                stateData.auto_scan_switch.value = resultData.auto_scan_switch.value;
            break;
            case 'scan_docs_frequence':
                stateData.scan_docs_frequence.value = resultData.scan_docs_frequence.value;
            break;
            case 'download_path':
                stateData.download_path = resultData.download_path;
            break;
            case 'ExitType':
                stateData.ExitType.value = resultData.ExitType.value; 
            break;
            case 'user_guide':
                stateData.user_guide.value = resultData.user_guide.value;
            break;
            case 'scan_docs_always_path':
                stateData.scan_docs_always_path.value = resultData.scan_docs_always_path.value;
            break;
            case 'restore_sharp_color':
                stateData.restore_sharp_color.value = resultData.restore_sharp_color.value;
            break; 
            case 'thumb_base_path':
                stateData.thumb_base_path.value = resultData.thumb_base_path.value;
            break;
        }
        if( action.json_result_data.types ){
            state.getConfig['types'] = action.json_result_data.types
        }else{
            state.getConfig['types'] = action.type
        }
        return state.getConfig
    }else{
        state.getConfig['types'] = action.type
        return state.getConfig
    }
}

//新增一个不重复的数组
export const reorganizeAdd = (state, data) => {
    if( state && state.length > 0 ){
        if( Array.isArray(data) ){
            data.forEach(item => {
                if( !item ){
                    return
                }
                if( item.constructor == Object ){
                    if( !(state.some(its => its.font_id === item.font_id)) ){
                        state.push(item)
                    }
                }else{
                    if( !(state.some(its => its === item)) ){
                        state.push(item)
                    }
                }
            })
        }else{
            if( data.constructor == Object ){
                if( !(state.some(item => item.font_id === data.font_id)) ){
                    state.push(data)
                }
            }else{
                if( !(state.some(item => item === data)) ){
                    state.push(data)
                }
            }
        }
        return state
    }else{
        if( Array.isArray(data) ){
            return data
        }
        if( data ){
            return [data]
        }   
        return []        
    }
}

//获取不相等的id并返回 ==> 返回操作失败的id
export const reorganizeHasIds = (state, data) => {
    if( state && state.length > 0 ){
        const newArray = [];
        for( let i = 0; i < state.length; i++ ){
            let hasid = false;
            for( let j = 0; j < data.length; j++ ){
                if( data[j] === state[i].font_id ){
                   hasid = true;
                   break;
                }
            }
            if( !hasid ){
                newArray.push(state[i]);
            }
        }
        return newArray
    }else{
        return null
    }
}
//获取最新的数组id
export const reorganizeRemoveIds = (state, data) => {
    if( state && state.length > 0 ){
        if( data && data.length > 0 ){
            data.forEach(item => {
                if( item.constructor == Object ){
                    state.some((it, index) => {
                        if( it.constructor == Object ){
                            if( it.font_id == item.font_id ){
                                state.splice(index, 1)
                            }
                            return it.font_id == item.font_id                            
                        }else{
                            if( it == item.font_id ){
                                state.splice(index, 1)
                            }
                            return it == item.font_id                            
                        }
                    })
                }else{
                    state.some((it, index) => {
                        if( it.constructor == Object ){
                            if( it.font_id == item ){
                                state.splice(index, 1)
                            }
                            return it.font_id == item                           
                        }else{
                            if( it == item ){
                                state.splice(index, 1)
                            }
                            return it == item                            
                        }
                    })
                }
            })
        }
    }
    return state  
}
//复选框批量操作字体时对字体属性的变化
//ids是操作成功的id，如有失败的操作且attr选中状态，则返回attr
export const reorganizeAttribute = (attr, ids) => {
    if( attr && ids && ids.length > 0 ){
        for( let i = 0; i < ids.length; i++ ){
           if( ids[i] === attr.font_id ){
               return null;
           }
        }
        return attr
    }
    return attr
}

//state是个对象时
export const reorganizeRemoveDataIds = (state, ids) => {
    if( !ids ) return [];
    if( state && state.length > 0 ){
        const newArray = [];
        for( let i = 0; i < state.length; i++ ){
            let hasid = false;
            for( let j = 0; j < ids.length; j++ ){
                if( ids[j] == state[i].font_id ){
                   hasid = true
                   break
                }
            }
            if( !hasid ){
               newArray.push(state[i])
            }
        }
        return newArray
    }
    return []
}

function posts(state={}, action) {
  switch (action.type) {      

    case RECEIVE_SINGLE_LIST_GO_POSTS:
      return Assign({}, state, {
        menuSingleData: action.posts,
        singleLastUpdated: action.receivedAt
      })

    case RECEIVE_ADD_SINGLE_FONT_GO_POSTS:
      return Assign({}, state, {
           menuSingleData: addSingleFont(state, action.posts),
           creatSingleRoute: action.posts,
           singleLastUpdated: action.receivedAt
      })            
    // case JS_MSG_HANDLE:
    //      return Assign({}, state, {
    //          jsMsgHandle: action, 
    //          jsMsgHandleLastUpdated: action.receivedAt
    //      })
    default:
      return state
  }
}
	
export default function inIt(state = {}, action) {	
  switch (action.type) {

    case RECEIVE_SINGLE_LIST_GO_POSTS:
    case RECEIVE_ADD_SINGLE_FONT_GO_POSTS:
    // case JS_MSG_HANDLE:
         return Assign({}, state, posts(state, action))     
  	
    case JS_MSG_HANDLE:
         return Assign({}, state, {
             jsMsgHandle: action, 
             jsMsgHandleLastUpdated: action.receivedAt
         })    
    case QUERY_INITIALIZETE_COMPLETED_REQUEST:
         return Assign({}, state, {
             inititlizeteCompleted: action.json_result_data, 
             inititlizeteLastUpdated: action.receivedAt
         })

    case WIMDOW_INITIALIZE_FONT_DB_REQUEST:
         return Assign({}, state, {
             fontDB: action.json_result_data, 
             fontDBLastUpdated: action.receivedAt
         })                 

    case INIT_GET_CONFIG_INFO:
         if( action.list && action.refresh ){
             return Assign({}, state, {
                 getConfig: setNewConfig(state, action), 
                 configLastUpdated: action.receivedAt
             })             
         }
         return Assign({}, state, {
             getConfig: action.json_result_data, 
             configLastUpdated: action.receivedAt
         })

    case INIT_SET_CONFIG_INFO:
         return Assign({}, state, {
             getConfig: setNewConfig(state, action), 
             configLastUpdated: action.receivedAt
         })              

    case GET_INIT_ROUTE:
         return Assign({}, state, {
             route: action.data.route, 
             subRoute: action.data.subRoute,
             routeLastUpdated: action.receivedAt
         })
        
    case ADD_GET_DOWNLOAD_BEGING:   
         return Assign({}, state, {
              downloadIds: reorganizeAdd(state.downloadIds, action.font_id_list),
              idData: reorganizeAdd(state.idData, action.fonts),
              addDownloadLastUpdated: action.receivedAt
         })

    case WINDOW_GET_DOWNLOAD_BEGING:   
         return Assign({}, state, {
              downloadBeging: action.json_result_data,
              downloadBegingLastUpdated: action.receivedAt
         })        
    
    case EVENTS_GET_DOWNLOAD_LIST:  
         return Assign({}, state, {
              downloadListData: (action.json_result_data && action.json_result_data.data) || [],
              downloadLastUpdated: action.receivedAt          
         }) 

    case INITIALIZATION_EVENTS_CALLBACK: 
         if( action.action == 'UNINSTALL' ){
             //卸载
             return Assign({}, state, {
                  uninstallIds: reorganizeHasIds(state.uninstallIds, action.arrayId),
                  attributes: reorganizeAttribute(state.attributes, action.arrayId)
             })
         }else if( action.action == 'DOWNLOAD' ){
             //下载
             return Assign({}, state, {
                downloadBeging: null,
                downloadIds: reorganizeRemoveIds(state.downloadIds, action.arrayId),
                idData: reorganizeRemoveIds(state.idData, action.arrayId),
                downloadListData: reorganizeRemoveDataIds(state.downloadListData, action.arrayId),
                addDownloadLastUpdated: action.receivedAt
             }) 
         }else if( action.action == 'INSTALL' ){
             //安装
             return Assign({}, state, {
                installIds: reorganizeHasIds(state.installIds, action.arrayId),
                attributes: reorganizeAttribute(state.attributes, action.arrayId)
             })              
         }
         return state                  

    default:
         return state
  }               	                           	
}
