import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'
import { log, isEmpty } from '../constants/UtilConstant'

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