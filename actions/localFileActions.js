import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'
import { log, isEmpty } from '../constants/UtilConstant'

/* 获取文件列表 */
export const asyncgetFileRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_GET_FILE_REQUEST, data)
}
/* 扫描初始化 */
export const getScanDocsInitRequest = () => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST)
}
/* 扫描文件路径 */
export const asyncSetScanDocsPathRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST, data)
}
/* 获取当前扫描的路径 */
export const asyncgetScanDocsRequest = () => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST)
}
/* 马上对当前选择的路径进行扫描 （只对当前添加的路径进行扫描）*/
export const asyncAddScanDocsPathRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST, data)
}
/* 暂停扫描 */
export const asyncPauseScanDocsRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST, data)
}
/* 继续扫描 */
export const asyncRefreshScanDocsRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST, data)	
}
/* 停止扫描 */
export const asyncStopScanDocsRequest = (data) => {
	return fetchAsyncRequest(types.RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST, data)	
}
/* 删除文件夹或文件 */
export const asyncDeleteScanDocsRequest = (data) => {
	return fetchAsyncRequest(types.RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST, data)
}
/* 获取文件信息--预览图，标签，文件属性，字体，颜色 */
export const asyncgetDocsInfoRequest = (data) => {
    return fetchAsyncRequest(types.RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST, data)
}
/* 搜索文件 */
export const asyncsearchFileByTextRequest = (data) => {
	return fetchAsyncRequest(types.RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST, data)
}
/* 粘贴 */
export const asyncPasteData = (data) => {
	return fetchAsyncRequest(types.RECEVIE_ASYNC_PASTE_DATA, data)
}
/* 定期扫描触发方法 */
export const asyncSetScanDocsLoopScanRequest = () => {
	return fetchAsyncRequest(types.RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST)
}


/* 设置扫描的文件类型---同步 */
export const setScanDocsFilterRequest = (data) => {
	try{
	    const result = window.setScanDocsFilterRequest(data.join(';'))
        const json_result_data = $.parseJSON(result);
		return {
	    	type: types.RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST,
	    	json_result_data,
	    	receivedAt: Date.now()
		}
	}catch(e){
		const error = '获取数据失败'
		return {
	    	type: types.RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST,
	    	json_result_data,
	    	error,
	    	receivedAt: Date.now()
		}
	}
	return fetchAsyncRequest(types.RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST, data)	
}


export const receiveGoPosts = (actionType, json, error) => {
    switch(actionType){
        case types.SAVE_ADD_SINGLE_FONT:
	        if( !error ){
				return {
				    type: types.RECEIVE_ADD_SINGLE_FONT_GO_POSTS,
				    posts: json,
				    receivedAt: Date.now()
				}
			}else{
				return {
				    type: types.RECEIVE_ADD_SINGLE_FONT_GO_POSTS,
					error,
				    receivedAt: Date.now()
				}			
			}
		default:
		    return null	
	}	    
}

//http 请求
function fetchPosts(actionType, url, method, data, commitData) {
    return dispatch => {
    	try{
		    if( method == 'GET' ){
			    return fetch(url +'?'+ data,{
			    		method: method
			    	}).then((response) => { log(response); return response.json() })
			        .then((json) => {
			      	      dispatch(receiveGoPosts(actionType, json))
			        })
			        .catch((e) => { log(e.message) })
		    }else{
			    return fetch(url,{
			    		method: method,
			    		mode: 'cors',
			    		cache: 'default',
		                headers: {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'	                    
		                },		    		
			    		body: data
			    	}).then((response) => { log(response); return response.json() })
			        .then((json) => {
			      	      dispatch(receiveGoPosts(actionType, json, commitData))
			        })
			        .catch((e) => {receiveGoPosts(actionType, e.message, )})
			}
		}catch(e){
		    receiveGoPostsError(actionType, e.message)		
		}
	}
}

function shouldFetchPosts(state, actionType) {
  const posts = state.login[actionType]
  if (!posts) {
    return true
  }
  return false
}
export function fetchPostsIfNeeded(actionType, url, method, data, commitData) {
  return (dispatch, getState) => {
	    if (shouldFetchPosts(getState(), actionType)) {
	      return dispatch(fetchPosts(actionType, url, method, data, commitData))
	    } else {
	      return Promise.resolve()
	    }
  }
}

//异步C++
export const fetchAsyncRequest = (actionType, data) => {
  return (dispatch, getState) => {
	    return dispatch(fetchAsync(actionType, data))
  }
}
export const fetchAsync = (actionType, data) => {
	log('C++异步开启')
	log(data)
    return dispatch => {
    	try{
		    return fetch('')
		        .then((response) => {return response.json() })
		        .then((json) => { 
		      	      //dispatch(receiveGoPosts(actionType, data))
		        })
		        .catch((e) => {
		        	//console.time("C++异步获取数据时间：")
		        	function asyncCallbackFns(result) {
		        		const json_result_data = $.parseJSON(result);
		        		log("C++返回数据：")
		        		log(json_result_data)
						dispatch(receiveGoAsync(actionType, data, json_result_data))
		        	}
		        	function asyncCallbackAlways(result) {
						const json_result_data = $.parseJSON(result);
						dispatch(receiveGoAsyncAlways(actionType, data, json_result_data))
						log("时时返回数据：")
						log(json_result_data)
		        	}
		        	try{
			            switch(actionType){
			            	case types.RECEIVE_ASYNC_GET_FILE_REQUEST:		            	     
			            	     window.asyncgetFileRequest(
			            	     	data.dir,
			            	     	data.sort_type,
			            	     	data.b_asec,
			            	     	data.is_tab,
			            	     	data.offset,
			            	     	data.fetch_size,
			            	     	data.user_id,
			            	     	data.get_filter,
			            	     	data.is_refresh,
			            	     	asyncCallbackFns,
			            	     	asyncCallbackAlways)
			            		 break;
	                        case types.RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST:
	                             window.asyncgetScanDocsInitRequest(asyncCallbackFns) 
	                             break; 
			            	case types.RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST:
			            	     //这边重新赋值数据是为了不传不必要的elem
			            	     let sendData = {}
			            	     if( data.del ){
			            	     	sendData = {add: data.add, del: data.del}
			            	     } else{
			            	     	sendData = {add: data.add}
			            	     } 
			            	     window.asyncSetScanDocsPathRequest(JSON.stringify(sendData), asyncCallbackFns)
			            	     break; 
			            	case types.RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST:
			            	     window.asyncAddScanDocsPathRequest(JSON.stringify(data), asyncCallbackFns)
			            	     break; 		            	          
	                        case types.RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST:
			            	     window.asyncPauseScanDocsRequest(asyncCallbackFns)
			            	     break;
			            	case types.RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST:
			            	     window.asyncgetScanDocsRequest(asyncCallbackFns)
			            	     break;	
			            	case types.RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST:
			            	     window.asyncRefreshScanDocsRequest(asyncCallbackFns)
			            	     break;	
	                        case types.RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST:
			            	     window.asyncStopScanDocsRequest(asyncCallbackFns)
			            	     break;	                             
			            	case types.RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST:
			            	     window.asyncDeleteScanDocsRequest(JSON.stringify(data.del), JSON.stringify(data.del_scan), data.delType, asyncCallbackFns)
			            	     break;	
			            	case types.RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST:
			            	     window.asyncgetDocsInfoRequest(data, asyncCallbackFns)
			            	     break;			            	          	            	          		            	          	            	          
	                        case types.RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST:
	                             window.asyncsearchFileByTextRequest(
	                             	data.search, 
			            	     	data.sort_type,
			            	     	data.b_asec,
			            	     	data.is_tab,
			            	     	data.offset,
			            	     	data.fetch_size,
			            	     	data.user_id,
			            	     	data.get_filter,
			            	     	data.is_refresh,
			            	     	data.dir,
			            	     	asyncCallbackFns)
	                             break;
	                        case types.RECEVIE_ASYNC_PASTE_DATA:
	                             window.asyncPasteData(data,asyncCallbackFns)
	                             break; 
	                        case types.RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST:
	                             window.asyncSetScanDocsLoopScanRequest(asyncCallbackFns)
	                             break;         
			            	default:
			            	     break;	      
			            }
		        	}catch(e){
		        		dispatch(receiveGoAsync(actionType, data, null, '获取数据出错啦'))
		        	}
		            //console.timeEnd("C++异步获取数据时间：")  
		        })
		} catch(e){
			dispatch(receiveGoAsync(actionType, data, null, '获取数据出错啦'))
		}
	}
}
export const receiveGoAsync = (actionType, data, json_result_data, error) => {
	switch(actionType){
		case types.RECEIVE_ASYNC_GET_FILE_REQUEST: 
		    try{
		       //把thumb_image转成json对象
               for( let i = 0, len = json_result_data.data.length; i < len; i++ ){
               	   if( !isEmpty(json_result_data.data[i].thumb_image) ){
                       json_result_data.data[i].thumb_image = JSON.parse(json_result_data.data[i].thumb_image)
               	   }
               }
		    } catch(e){}
			return {
		    	type: types.RECEIVE_ASYNC_GET_FILE_REQUEST,
		    	common: data,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}
		case types.RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST:
		    return {
		    	type: types.RECEIVE_ASYNC_GET_SCAN_DOCS_INIT_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()		    	
		    }
					    
        case types.RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST:
            json_result_data['sendElem'] = data.elem
			return {
		    	type: types.RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			} 

		case types.RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST:
			return {
		    	type: types.RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			} 		    	
        case types.RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST:
            json_result_data['sendElem'] = data.elem
			return {
		    	type: types.RECEIVE_ASYNC_PAUSE_SCAN_DOCS_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}

		case types.RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST:
			return {
		    	type: types.RECEIVE_ASYNC_GET_SCAN_DOCS_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}

		case types.RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST:
		    json_result_data['sendElem'] = data.elem
			return {
		    	type: types.RECEIVE_ASYNC_REFRESH_SCAN_DOCS_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}

		case types.RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST:
		    json_result_data['sendElem'] = data.elem
			return {
		    	type: types.RECEIVE_ASYNC_STOP_SCAN_DOCS_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}		    	

		case types.RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST:
			return {
		    	type: types.RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}	

		case types.RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST:
			return {
		    	type: types.RECEVIE_ASYNC_GET_DOCS_INFO_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}

		case types.RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST:	
		    try{
		       //把thumb_image转成json对象
               for( let i = 0, len = json_result_data.data.length; i < len; i++ ){
               	   if( !isEmpty(json_result_data.data[i].thumb_image) ){
                       json_result_data.data[i].thumb_image = JSON.parse(json_result_data.data[i].thumb_image)
               	   }
               }
		    } catch(e){}
			return {
		    	type: types.RECEVIE_ASYNC_SEARCH_FILE_BY_TEXT_REQUEST,
		    	common: data,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}
		case types.RECEVIE_ASYNC_PASTE_DATA:
			return {
		    	type: types.RECEVIE_ASYNC_PASTE_DATA,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}
		case types.RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST:
			return {
		    	type: types.RECEVIE_ASYNC_SET_SCAN_DOCS_LOOP_SCAN_REQUEST,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}		    			    					    					    						   	
		default:
		    return {
		    	type: types.INITIALIZATION_DATA
		    }
	}
}
export const receiveGoAsyncAlways = (actionType, data, json_result_data, error) => {
	switch(actionType){
		case types.RECEIVE_ASYNC_GET_FILE_REQUEST: 
			return {
		    	type: types.RECEIVE_ASYNC_GET_FILE_REQUEST_ALWAYS,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()
			}
		default:
		    return {
		    	type: types.INITIALIZATION_DATA
		    }
	}
}				