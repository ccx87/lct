import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import AjaxConstant from '../constants/AjaxConstant'
import { log } from '../constants/UtilConstant'

export const initializationData = () => {
	return { 
		type: types.INITIALIZATION_DATA 
    }
}

export const triggerDialogInfo = (data) => {
	return {
		type: types.TRIGGER_DIALOG_INFO,
		data,
		receivedAt: Date.now()
	}
}

export const getHistoryUserData = () => {
	try{  
	 	const historyUserData = window.getHistoryUserRequest ()
		const jsonData_history_user = $.parseJSON(historyUserData) 		
		return { 
			type: types.GET_HISTORY_USER_DATA,
			jsonData_history_user,
	        receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}	
}
export const setLoginUserRequest = (data) => {
	try{  
	 	const result = window.setLoginUserRequest(JSON.stringify(data))
		const json_result_data = $.parseJSON(result)		
		return { 
			type: types.SET_LOGIN_USER_REQUEST,
			json_result_data,
	        receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}	
}
export const getLoginUserRequest = () => {
	//异步   
	return fetchPostsIfNeeded(types.WINDOW_LOGIN_USER_REQUEST, '', 'POST', '', '')    
}
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
//获取配置信息
export const getConfigInfo = (data) => {
	try{
		let result_data = null;
		if( data ){
			if( data.constructor == Array ){
				result_data = window.getConfigRequest(JSON.stringify(data))
			}else if( data.constructor == String ){
                result_data = window.getConfigRequest(data)
			}else{
				result_data = window.getConfigRequest()
			}
		}else{
            result_data = window.getConfigRequest()
		}	
		const json_result_data = $.parseJSON(result_data) 
		json_result_data['types'] = types.INIT_GET_CONFIG_INFO
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
//获取服务端消息
export const getNoDealMessageList = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_GET_NO_DEAL_MESSAGE_LIST,
	      postData = 'userId='+ data.userId + '&type='+ data.type +'&dealState='+ data.dealState;
    return fetchPostsIfNeeded(types.GET_NO_DEAL_MESSAGE_LIST, url, 'POST', postData, data)     
}
//处理服务端消息
export const doDeal = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_DO_DEAL,
	      postData = 'stIdList='+ data.stIdList + '&dealState='+ data.dealState;
    return fetchPostsIfNeeded(types.DO_DEAL, url, 'POST', postData, data) 
}
//获取系统公告
export const getPcNoticeMessageList = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_GET_PC_NOTICE_MESSAGE,
	      postData = 'title=&type=-2';
    return fetchPostsIfNeeded(types.GET_PC_NOTICE_MESSAGE, url, 'POST', postData, data)     
}
//登录
export const loginUserSubmit = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_GET_USER_LOGIN,
	      postData = 'loginCode='+ encodeURIComponent(data.loginCode) + '&password='+ encodeURIComponent(data.password) +'&autoLgn='+ data.autoLgn + 
	      '&userAgent=' + data.userAgent + '&version=' + data.version;
    return fetchPostsIfNeeded(types.LOGIN_USER_SUBMIT, url, 'POST', postData, data)    
}
//获取qq基本信息
export const ThirdInitiationRequest = () => {
	const url = 'https://graph.qq.com/oauth2.0/authorize',
	      postData = 'response_type=token&client_id=101313065&redirect_uri=http%3A%2F%2Fwww.lianty.com%2Fsite%2FpcQQLog&scope=all';
	return fetchPostsIfNeeded2(types.THIRD_INITIATION_REQUEST, url, postData) 
}
//第三方登录
export const thirdPartyLogin = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_THIRD_PARTY_LOGIN,
	      postData = 'type='+ data.type +'&openId='+ data.openId + '&userAgent=' + data.userAgent + '&version=' + data.version;
    return fetchPostsIfNeeded(types.LOGIN_THIRD_USER_SUBMIT, url, 'POST', postData) 	
}
//第三方创建
export const createThirdPartyLogin = (data) => {
	const url = ApiConstant.DOMAIN_LIANTY + ApiConstant.API_CREATE_THIRD_PARTY_LOGIN,
	      postData = 'type='+ data.type +'&openId='+ data.openId + '&headPortraitPath='+ data.headPortraitPath +
	      '&city='+ data.city +'&nickname='+ encodeURIComponent(data.nickname) + '&userAgent=' + data.userAgent + '&version=' + data.version;
    return fetchPostsIfNeeded(types.LOGIN_THIRD_USER_SUBMIT, url, 'POST', postData) 	
}

export const receiveGoPosts = (actionType, json, commitData, error) => {
  log(error)
  switch(actionType){
  	 case types.LOGIN_USER_SUBMIT:
			return {
			    type: types.RECEIVE_LOGIN_USER_SUBMIT_LIANTY_POSTS,
				commitData,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
     case types.LOGIN_THIRD_USER_SUBMIT:
			return {
			    type: types.RECEIVE_LOGIN_THIRD_USER_SUBMIT_LIANTY_POSTS,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
	 case types.GET_NO_DEAL_MESSAGE_LIST:
			return {
			    type: types.GET_NO_DEAL_MESSAGE_LIST,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
	 case types.DO_DEAL:
			return {
			    type: types.DO_DEAL,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
	 case types.GET_PC_NOTICE_MESSAGE:
			return {
			    type: types.GET_PC_NOTICE_MESSAGE,
			    posts: json,
			    error,
			    receivedAt: Date.now()
			}
	 case types.WINDOW_LOGIN_USER_REQUEST: 
			return { 
				type: types.WINDOW_LOGIN_USER_REQUEST,
				posts: json,
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
	log('url:'+url)
	log(data)
    return dispatch => {
    	try{
		    if( method == 'GET' ){
			    return fetch(url +'?'+ data,{
			    		method: method
			    	}).then((response) => {return response.json() })
			        .then((json) => {
			      	      dispatch(receiveGoPosts(actionType, json))
			        })
			        .catch((e) => {dispatch(receiveGoPosts(actionType, e.message, commitData, '无法连接到服务器'))})
		    }else{
			    return fetch(url,{
			    		method: method,
			    		mode: 'cors',
			    		cache: 'default',
		                headers: {
		                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
		                },		    		
			    		body: data
			    	})
			        .then((response) => { 
			        	return response.json() 
			        })
			        .then((json) => {
			      	    dispatch(receiveGoPosts(actionType, json, commitData))
			        })
			        .catch((e) => {
			        	function asyncCallbackFns(result) {
			        		const json_result_data = $.parseJSON(result);
			        		log("LoginActions------C++返回数据：")
			        		log(json_result_data)
							dispatch(receiveGoPosts(actionType, json_result_data, data))
			        	}
			        	try{			        	
				        	switch(actionType){
				        		case types.WINDOW_LOGIN_USER_REQUEST:
				        		    window.getLoginUserRequest(asyncCallbackFns) 
				        		break;
				        		default:
				        		    dispatch(receiveGoPosts(actionType, e.message, commitData, '无法连接到服务器1'))
				        		break;
				        	}
			        	}catch(e){
			        		dispatch(receiveGoPosts(actionType, e.message, commitData, '无法连接到服务器2'))
			        	}
			        })
			}				
		}catch(e){
			dispatch(receiveGoPosts(actionType, e.message, commitData, '无法连接到服务器3'))
		}		
	}
}

function shouldFetchPosts(state, actionType) {
  const posts = state.login[actionType]
  log(posts)
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