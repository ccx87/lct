import Assign from 'lodash.assign'
import { keySort, log, objClone, isEmpty, getFontState } from '../constants/UtilConstant'
import { PAGE_TYPE, GET_FONT_STATE } from '../constants/DataConstant'

import { 
	INITIALIZATION_DATA,
  INITIALIZATION_LOADING_DATA,
  INITIALIZATION_OLD_DATA,  
	WINDOW_GET_FONT_REQUEST,
  WINDOW_PS_FILE_DETECT_REQUEST,
  WINDOW_OPEN_FILE_REQUEST,
  WINDOW_HISTORY_DETECT_REQUEST,
  WINDOW_GET_DOWNLOAD_LIST,
	RECEIVE_COLLECT_GO_POSTS,
  RECEIVE_SEARCH_GO_POSTS,
  RECEIVE_SINGLE_ITEM_GO_POSTS,
  RECEIVE_GET_FONTS_BY_FONT_ID,
  INITIALIZATION_ERROR_DATA,
  RECEVIE_GET_PREVIEW_IMAGE,
  RECEIVE_ASYNC_GET_FONT_REQUEST
} from '../constants/ActionsTypes'
import { getFontInitObjectData } from '../constants/ConfigInfo'

import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'

// 初始化state数据
const initialState = {
	common: objClone(getFontInitObjectData)
}

function posts(state = {}, action) {
  if( state && state.common ){
      //调用异步接口时会有延时
      //判断当前返回的数据是否是当前页面所需的数据
      //解决异步延时页面数据串线问题
      if( action && action.commonData ){
          if( state.common.PageName !== action.commonData.PageName ){
              return false
          }
      }
  }
  switch (action.type) {
    case RECEIVE_COLLECT_GO_POSTS:
      if( action.error ){
        return Assign({}, state, {
          error: action.error,
          error_code: 101,
          lastUpdated: action.receivedAt
        })         
      }      
      return Assign({}, state, {
        fontListData: action.posts,
        common: action.commonData,
        lastUpdated: action.receivedAt
      })     
       
    case RECEIVE_SEARCH_GO_POSTS:
      if( action.error ){
        return Assign({}, state, {
          error: action.error,
          error_code: 101,
          lastUpdated: action.receivedAt
        })         
      }      
      return Assign({}, state, {
        fontListData: inItFontListData(state, action.posts, action.commonData),
        common: action.commonData,
        lastUpdated: action.receivedAt
      })      

    case RECEIVE_SINGLE_ITEM_GO_POSTS:
      if( action.error ){
        return Assign({}, state, {
          error: action.error,
          error_code: 101,
          lastUpdated: action.receivedAt
        })         
      }      
      return Assign({}, state, {
          fontListData: action.posts,
          common: initialState.common,
          lastUpdated: action.receivedAt
      }) 

    case RECEIVE_GET_FONTS_BY_FONT_ID:
      if( action.error ){
        return Assign({}, state, {
          error: action.error,
          error_code: 101,
          lastUpdated: action.receivedAt
        })         
      }      
       if( action.commonData && action.commonData.offset > 0 ){
           return Assign({}, state, {
              fontListData: inItFontListData(state, reorganizeData(action.posts, action.fonts), action.commonData),
              afterFids: null,
              allList: null,
              active: null,
              common: action.commonData,
              lastUpdated: action.receivedAt
           })
       } else {
           return Assign({}, state, {
                fontListData: inItFontListDataRefresh(state, reorganizeData(action.posts, action.fonts), action.commonData),
                afterFids: null,
                allList: null,
                active: null,                
                common: action.commonData,
                lastUpdated: action.receivedAt
           })          
       }

    case RECEVIE_GET_PREVIEW_IMAGE:
        if( action.error ){
            return Assign({}, state, {
              error: action.error,
              error_code: 101,
              lastUpdated: action.receivedAt
            })         
        }
        return Assign({}, state, {
            previewImage: action.posts,
            previewImageLastUpdate: action.receivedAt           
        }) 

    case RECEIVE_ASYNC_GET_FONT_REQUEST:
         //active : 'search'。区分是否在搜索
         if( action.error ){
             return Assign({}, state, {
                error: action.error,
                error_code: 101,
                lastUpdated: action.receivedAt
             })             
         }
         if( action.common && action.common.offset > 0 ){
             return Assign({}, state, {
                  fontListData: inItFontListData(state, {data: {list:action.first_list}}, action.common, action.json_result_data.data.total), 
                  allList: action.json_result_data,
                  afterFids: action.after_fids,
                  common: action.common,
                  active: action.active,
                  lastUpdated: action.receivedAt
             })
         }else {
             return Assign({}, state, {
                  fontListData: inItFontListDataRefresh(state, {data: {list:action.first_list}}, action.common, action.json_result_data.data.total), 
                  allList: action.json_result_data,
                  afterFids: action.after_fids,                      
                  common: action.common,
                  active: action.active,
                  lastUpdated: action.receivedAt
             })          
         }

    default:
      return state
  }
}

//在原有的数据之上添加新的数据
export const inItFontListData = (state, data, common, total) => {
    if( state.fontListData == null || state.fontListData.data == null ){     
        if( !isEmpty(total) || total == 0 ){ 
            data.data['total'] = total
        }         
        return data 
    }else{     
        let font = state.fontListData,
            font_data_list = font.data.list,
            newList = [];
        if( !isEmpty(total) || total == 0 ){      
            font.data.total = total;  
        }else{
            font.data.total = data.data.total; 
        }
        //防止数据重复
        for( let i = 0; i < data.data.list.length; i++){
            let hasid = false;
            for( let j = 0; j < font_data_list.length; j++ ){
               if( data.data.list[i].font_id === font_data_list[j].font_id ){
                   hasid = true;
                   break;
               }
            } 
            if( !hasid ){
                newList.push(data.data.list[i])
            }
        } 
        newList.unshift(...font_data_list);
        font.data.list = newList;    
        return font
    }    
}

//数据重新初始化
export const inItFontListDataRefresh = (state, data, common, total) => {
    if( state.fontListData == null || state.fontListData.data == null ){      
        if( !isEmpty(total) || total == 0 ){ 
            data.data['total'] = total
        }      
        return data 
    }    
    const font = state.fontListData;
    if( !isEmpty(total) || total == 0 ){      
       font.data.total = total;  
    }else{
       font.data.total = data.data.total; 
    }     
    font.data.list = data.data.list;
    // if( (common.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ||
    //        common.PageName == PAGE_TYPE.Font_Assistant.my_collection.PageName) ){
    //     font.data.list.sort(keySort('font_state', 'ASC')) //排序
    // }    
    return font
}

//重组数据，主要用原数据的状态和新数据的状态合并
export const reorganizeData = (newData, oldData) => {
    if( newData.data && newData.data.list ){
        if( oldData.data && oldData.data.list ){
            const o_list = oldData.data.list,
                  n_list = newData.data.list;
            for( let i = 0; i < o_list.length; i++ ){
                for( let j = 0; j < n_list.length; j++ ){
                    if( o_list[i].font_id == n_list[j].font_id ){
                        const new_state = o_list[i].font_state | n_list[j].font_state;
                        o_list[i] = n_list[j]
                        o_list[i].font_state = new_state 
                        break;
                    }
                }
            } 
            return oldData
        }else{
            return newData
        }
    }else{
        return oldData
    }
}
	
export default function fonts(state = initialState, action) {	 
  switch (action.type) {
  	
  	case RECEIVE_COLLECT_GO_POSTS:
    case RECEIVE_SEARCH_GO_POSTS:
    case RECEIVE_SINGLE_ITEM_GO_POSTS:
    case RECEIVE_GET_FONTS_BY_FONT_ID:
    case RECEIVE_ASYNC_GET_FONT_REQUEST:        
  	     return Assign({}, state, posts(state, action))   
  	
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

    case INITIALIZATION_ERROR_DATA:
         return {
             common: state.common,
             fontListData: state.fontListData
         }                               
	
    case INITIALIZATION_OLD_DATA:
         return {
             asyncWait: true,
             common: state.common,
             fontListData: state.fontListData,
             asyncLastUpdata: action.receivedAt
         }         

    case WINDOW_GET_FONT_REQUEST:
           //active : 'search'。区分是否在搜索
           if( action.common && action.common.offset > 0 ){
       		     return Assign({}, state, {
                    fontListData: inItFontListData(state, {data: {list:action.first_list}}, action.common, action.json_result_data.data.total), 
                    allList: action.json_result_data,
                    afterFids: action.after_fids,
                    common: action.common,
                    active: action.active,
                    lastUpdated: action.receivedAt
               })
           }else {
               return Assign({}, state, {
                    fontListData: inItFontListDataRefresh(state, {data: {list:action.first_list}}, action.common, action.json_result_data.data.total), 
                    allList: action.json_result_data,
                    afterFids: action.after_fids,                      
                    common: action.common,
                    active: action.active,
                    lastUpdated: action.receivedAt
               })          
           }                              		 	     	       	

    case WINDOW_PS_FILE_DETECT_REQUEST:
         return Assign({}, state, {
              common: action.commonData,
              missingPsFileDetectData: action.json_result_data,
              missingPsLastUpdate: action.receivedAt
         })

    case WINDOW_GET_DOWNLOAD_LIST:
         if( action.commonData ){
             return Assign({}, state, {
                  common: action.commonData,
                  downloadListData:  action.json_result_data,
                  downloadLastUpdated: action.receivedAt          
             }) 
         }else{
             return Assign({}, state, {
                  downloadListData:  action.json_result_data,
                  downloadLastUpdated: action.receivedAt          
             })          
         }        
    
    case WINDOW_OPEN_FILE_REQUEST:
         if( action.temp  == 0 ){
             return Assign({}, state, {
                  openFilePath_0: action.json_result_data,
                  openFilePath_1: null, 
                  openFilePath_2: null,
                  openFilePath_3: null,
                  openFileLastUpdate: action.receivedAt
             })              
         } else if( action.temp == 1 ){
             return Assign({}, state, {
                  openFilePath_0: null, 
                  openFilePath_1: action.json_result_data,
                  openFilePath_2: null,
                  openFilePath_3: null,
                  openFileLastUpdate: action.receivedAt
             })           
           }  else if( action.temp == 2 ){
             return Assign({}, state, {
                  openFilePath_0: null, 
                  openFilePath_1: null,
                  openFilePath_2: action.json_result_data,
                  openFilePath_3: null, 
                  openFileLastUpdate: action.receivedAt
             })           
         }  else if( action.temp == 3 ){
             return Assign({}, state, {
                  openFilePath_0: null, 
                  openFilePath_1: null,
                  openFilePath_2: null,
                  openFilePath_3: action.json_result_data,
                  openFileLastUpdate: action.receivedAt
             })           
         } else{ 
             return Assign({}, state, {
                  openFilePath_0: null, 
                  openFilePath_1: action.json_result_data,
                  openFilePath_2: null, 
                  openFilePath_3: null,
                  openFileLastUpdate: action.receivedAt
             }) 
         }
         
    case WINDOW_HISTORY_DETECT_REQUEST:
         return Assign({}, state, {
              common: action.commonData,
              missingHostoryRecord: action.json_result_data,
              missingRecordLastUpdate: action.receivedAt
         })   

    default:
      return state
  }
}
