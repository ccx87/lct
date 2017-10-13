import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'
import { log } from '../constants/UtilConstant'


/* 获取登录重要信息 */
export const getYunChatAccid = (data) => {
	//const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_GET_YUN_CHAT_ACCID,
	const url = 'http://192.168.2.17:8082/'+ ApiConstant.API_GET_YUN_CHAT_ACCID,
	      postData = 'commitPsnId='+ data;	
	return fetchPostsIfNeeded(types.GET_YUN_CHAT_ACCID, url, 'POST', postData)
}
/* 查找好友 */
export const findYunFriend = (data) => {
	//const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_GET_YUN_CHAT_ACCID,
	const url = 'http://192.168.2.17:8082/'+ ApiConstant.API_FIND_YUN_FRIEND,
	      postData = 'accountId='+ data;	
	return fetchPostsIfNeeded(types.FIND_YUN_FRIEND, url, 'POST', postData)	
}

/* 添加好友 */
export const asycGetAddFriendRequest = (data) => {
    //return fetchAsyncRequest(types.RECEIVE_ASYNC_GET_FILE_REQUEST, data)
	return {
    	type: types.RECEIVE_ASYNC_GET_ADD_FRIEND_REQUEST,
    	data,
    	receivedAt: Date.now()
	}    
}

export const receiveGoPosts = (actionType, json, error) => {
    switch(actionType){
        case types.GET_YUN_CHAT_ACCID:
			return {
			    type: types.GET_YUN_CHAT_ACCID,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
		case types.FIND_YUN_FRIEND:
			return {
			    type: types.FIND_YUN_FRIEND,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}		   	

		default:
		    return null	
	}	    
}

//http 请求
function fetchPosts(actionType, url, method, data, commitData) {
	console.log(actionType, url, method, data)
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
		        	console.time("C++异步获取数据时间：")
		        	function asyncCallbackFns(result){
		        		const json_result_data = $.parseJSON(result);
						dispatch(receiveGoAsync(actionType, data, json_result_data))
		        	}
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
		            	     	data.is_folder,
		            	     	asyncCallbackFns)
		            		 break;		            	          	            	          		            	          	            	          

		            	default:
		            	     break;	      
		            }
		            console.timeEnd("C++异步获取数据时间：")  
		        })
		} catch(e){
			dispatch(receiveGoAsync(actionType, data, null, '获取数据出错啦'))
		}
	}
}
export const receiveGoAsync = (actionType, data, json_result_data, error) => {
	switch(actionType){
		case types.RECEIVE_ASYNC_GET_FILE_REQUEST: 
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