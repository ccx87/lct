import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import { log, isEmpty } from '../constants/UtilConstant'

/* 测试方法--js向C++通信统一接口 */
export const sendHandleMessage = (module, func, param) => {
	log('HandleMessage----参数')
	log(module)
	log(func)
	log(param)
    try{
    	if( param.constructor == Object ){
    		param = JSON.stringify(param)
    	}
    	log('1---js向C++通信统一接口打开')
        window.handleMessage(module, func, param)
        return {type: 'HANDLE_MESSAGE'}
    }catch(e){
    	log('handleMessage函数调用出错(代码：'+ e +')')
        return {type: 'HANDLE_MESSAGE'}
    }
}
/* 测试方法--c++向js通信统一接口 */
export const injectionJs_JsMsgHandle = () => {	
	return dispatch => { 
		(function(){
			try{
				if( !window.JsMsgHandle || window.JsMsgHandle.constructor != Function ){
				    window.JsMsgHandle = (module, param) => {
			            log(module)
			            log('2----c++向js通信统一接口打开')
			            if( param && param.constructor == String ){
			            	try{
			            		param = JSON.parse(param)
			            	}catch(e){
			            		log('接收数据后json解析出错')
			            	}
			            }
			            log(param)
			            if( param && param.constructor == Object ){
                            //dispatch(AsyncFetch(module, param))
							dispatch(AsyncReceiveJsMsgHandle(module, param))
			            }else{
                            log('param参数不是对象')
			            }
				    }
				}
			}catch(e){
				log('injectionJs_JsMsgHandle函数调用出错(代码：'+ e +')');
				//dispatch(AsyncFetch(module, null, e))
				dispatch(AsyncReceiveJsMsgHandle(module, null, e))
		    }
		})(window)
	}
}
export const AsyncFetch = (module, param) => {
    return dispatch => {
    	try{
		    return fetch('')
		        .then((response) => {return response.json() })
		        .then((json) => { 
		      	      //dispatch(receiveGoPosts(actionType, data))
		        })
		        .catch((e) => {
		        	log('---进入异步执行中---')
		        	//console.time("C++异步获取数据时间：")
        	        dispatch(AsyncReceiveJsMsgHandle(module, param))
		            //console.timeEnd("C++异步获取数据时间：")  
		        })
		} catch(e){
			log('injectionJs_JsMsgHandle2函数调用出错(代码：'+ e +')');
			dispatch(AsyncReceiveJsMsgHandle(module, null, e))
		}
	}	
}
export const AsyncReceiveJsMsgHandle = (module, param, error) => {
	switch(module){
		case 'search_file_by_img_rsp_t':
		    const json_result_data = param;
		    return {
		    	type: types.GET_SEARCH_IMG_RESULT,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()		    	
		    }		    
		break;
		default:
		    return {
		    	type: types.JS_MSG_HANDLE,
		    	module,
		    	param,
		    	success: 'JsMsgHandle返回数据成功',
		    	receivedAt: Date.now()
		    }
		break;    
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
/* 属性 */
export const getAttributes = (data) => {
	return { 
		type: types.EVENTS_ATTRIBUTES_DATA, 
        data,
        receivedAt: Date.now()
	}
}
/* 单个选中或取消选中--字体助手 */
export const getCheckItem = (data, isCheck) => {
	return { 
		type: types.EVENTS_UN_OR_CHECK_ITEM, 
        data,
        isCheck,
		receivedAt: Date.now()        
	}	
}
/* 全部选中或全部取消选中--字体助手 */
export const getAllCheckItem = (data, isCheck) => {
	return { 
		type: types.EVENTS_UN_OR_ALLCHECK_ITEM,
		data, 
		isCheck,
		receivedAt: Date.now()        
	}	
}
export const eventsCheck = (data) => {
    return {
		type: types.EVENTS_CHECK,
		data, 
		receivedAt: Date.now()     	
    }
}
export const eventsUnCheck = (data) => {
    return {
		type: types.EVENTS_UNCHECK,
		data, 
		receivedAt: Date.now()     	
    }
}
/* 弹出层 */
export const triggerDialogInfo = (data) => {
	return {
		type: types.TRIGGER_DIALOG_INFO,
		data,
		receivedAt: Date.now()
	}
}
/* 最小化窗口 */
export const triggerMinmizeInfo = data => {
	return {
		type: types.TRIGGER_MINMIZE_INFO,
		data,
		receivedAt: Date.now()
	}	
}

/* 右键菜单 */
export const smartMenuShow = (data) => {
	return {
		type: types.SMART_MENU_INFO,
		data,
		receivedAt: Date.now()
	}	
}
/* 设置扫描的文件类型---同步 */
export const setScanDocsFilterRequest = (data, target) => {
	let json_result_data = null;
	try{
		let result;
		if( data.constructor == Array ){
	    	result = window.setScanDocsFilterRequest(data.join(';'))
		}else{
			result = window.setScanDocsFilterRequest(data)
		}
        json_result_data = $.parseJSON(result);
        if( target )
        	json_result_data['target'] = target;
		return {
	    	type: types.RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST,
	    	json_result_data,
	    	receivedAt: Date.now()
		}
	}catch(e){
		const data = {
	    	error: '获取数据失败',
	    	error_code: 101,
	    	target: target,
		}
		return {
	    	type: types.RECEIVE_SET_SCAN_DOCS_FILTER_REQUEST,
	    	json_result_data: data,
	    	receivedAt: Date.now()
		}
	}	
}
//获取配置信息
export const getConfigInfo = (data, tp) => {
	try{
		let result_data = null,
		    is_refresh = false;
		if( data ){
			if( data.constructor == Array ){
				is_refresh = true
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
		if( tp ){
            json_result_data['types'] = tp
		}else{ 
			json_result_data['types'] = types.INIT_GET_CONFIG_INFO
		}
        is_refresh
		return { 
			type: types.INIT_GET_CONFIG_INFO,
			list: data, 
			refresh: is_refresh,
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
export const setConfigRequest = (list, tp) => {
  	try{
  		log(JSON.stringify(list))
	    const result_data = window.setConfigRequest(JSON.stringify(list))
   		const json_result_data = $.parseJSON(result_data)
   		if( tp ){
   			json_result_data['types'] = tp
   		}else{
   			json_result_data['types'] = types.INIT_SET_CONFIG_INFO
   		}
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
/*打开目录*/
export const openFileRequest = (temp, path, tempData) => {
	// 0:浏览并选择单个文件
	// 1：打开文件夹
	// 2：打开文件夹，并选中指定的文件
	// 3: 打开文件浏览器，选择文件夹
	// 4:用网页浏览器文件打开指定的网址
	//注：第二个参数path
	// type为0时，可以不指定,默认为为0.也可以指定下
	// type为1时，指定为要打开的文件夹路径；
	// type为2时，指定为要打开的文件路径；
	// type为3时，指定打开文件浏览器时，要选中的目录。可以为空。如果为空，则默认选中【下载路径】;
	// type为4时，指定要打开的网址		    
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
  	    	tempData,
  	    	json_result_data,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
	    }		
	}    
}
/* 初始化props数据 --清空common等 */
export const initializationData = () => {
	return { 
		type: types.INITIALIZATION_DATA 
	}
}
/* 初始化props数据 --保留最新的common等 */
export const initializationLoadingData = (data) => {
	return {
		type: types.INITIALIZATION_LOADING_DATA,
		data
	}
}
/* 执行Events操作后处理 */
export const initializationEventsCallback = (action, arrayId) => {
	return {
		type: types.INITIALIZATION_EVENTS_CALLBACK,
        action,
		arrayId,
		receivedAt: Date.now()
	}
}
//清空events数据
export const eventsInitializationData  = (key) => {
	if( key ){
		return { 
			type: types.EVENTS_INITIALIZATION_DATA,
			key: key 
		}	
	}else{
		return { 
			type: types.EVENTS_INITIALIZATION_DATA 
		}			
	}
}
/* 标签 */
export const selectTagSave = (list) => {
	return {
		type: types.SELECT_TAG_SAVE,
		list,
		receivedAt: Date.now()
	}	
}
/* 通知--某些情况下，当前操作功能下，其它区域的个别操作会被禁止 */
export const noticeMessage = (data) => {
	return {
		type: types.MESSAGE_NOTICE,
		data,
		receivedAt: Date.now()
	}	
}
/* 扫描 通知 */
export const addScanMessage = (data) => {
	return {
		type: types.MESSAGE_ADD_SCAN,
		data,
		receivedAt: Date.now()
	}	
}
/* 模式变换 通知 */
export const modeChangeMessage = (data) => {
	return {
		type: types.MESSAGE_MODE_CHANGE,
		data,
		receivedAt: Date.now()
	}	
}
/* 文件个数or选择文件 通知底部显示 */
export const fileInfoMessage = (data) => {
	return {
		type: types.MESSAGE_FILE_INFO,
		data,
		receivedAt: Date.now()		
	}
}
/* 内部自己的消息 */
export const defaultMessage = (data) => {
	return {
		type: types.MESSAGE_DEFAULT,
		data,
		receivedAt: Date.now()		
	}
}
/* 搜索文件 通知 */
export const serachFileMessage = (data) => {
	return {
		type: types.MESSAGE_SEARCH_FILE,
		data,
		receivedAt: Date.now()		
	}	
}
