import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'
import { log } from '../constants/UtilConstant'

/* 初始化props数据 */
export const initializationData = () => {
	return { 
		type: types.INITIALIZATION_DATA 
	}
}
/*路由*/
export const getInItRoute = (data) => {
	return {
		type: types.GET_INIT_ROUTE,
		data,
		receivedAt: Date.now()
	}	
}
/*弹窗*/
export const triggerDialogInfo = (data) => {
	return {
		type: types.TRIGGER_DIALOG_INFO,
		data,
		receivedAt: Date.now()
	}
}

//获取配置信息
export const getConfigInfo = () => {
	try{
	    const result_data = window.getConfigRequest()
		const json_result_data = $.parseJSON(result_data) 
		return { 
			type: types.INIT_GET_CONFIG_INFO, 
	        json_result_data,
	        receivedAt: Date.now()
		} 
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}  
}
/*打开目录*/
export const openFileRequest = (temp, path) => {
    try{ 	
	    let result_data = null
	    if( path ){
			result_data = window.openFileRequest(temp, path)
		}else{
			result_data = window.openFileRequest(temp)
		}
   		const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.EVENTS_OPEN_FILE_REQUEST,
  	    	temp,
  	    	json_result_data,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}    
}
/*修改配置文件*/
export const setConfigRequest = (list) => {
  	try{
  		log(JSON.stringify(list))
	    const result_data = window.setConfigRequest(JSON.stringify(list))
   		const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.INIT_SET_CONFIG_INFO,
  	    	list,
  	    	json_result_data,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}     	
}

export const receiveGoPostsError = (actionType, error) => {

  switch(actionType){
  	 case types.LOGIN_USER_SUBMIT:
		return {
		    type: types.RECEIVE_LOGIN_USER_SUBMIT_LIANTY_POSTS,
			error,
		    receivedAt: Date.now()
		}

     case types.LOGIN_THIRD_USER_SUBMIT:
		return {
		    type: types.RECEIVE_LOGIN_THIRD_USER_SUBMIT_LIANTY_POSTS,
			error,
		    receivedAt: Date.now()
		}

	 default:
	    return {
	    	type: types.INITIALIZATION_DATA
	    }		     	    	   
  }
}

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