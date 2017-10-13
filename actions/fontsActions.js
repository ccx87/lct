import * as types from '../constants/ActionsTypes'

import fetch from 'isomorphic-fetch'
import ApiConstant from '../constants/ApiConstant'
import { log, isEmpty, arrayDel, getFontState } from '../constants/UtilConstant'
import { FONT_STATE, GET_FONT_STATE, PAGE_TYPE } from '../constants/DataConstant'

/*扫描*/
export const queryInitializeteCompletedRequest = () => {
	try{
	    const result_data = window.queryInitializeteCompletedRequest()
		const json_result_data = $.parseJSON(result_data) 
		return { 
			type: types.QUERY_INITIALIZETE_COMPLETED_REQUEST, 
	        json_result_data,
	        receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}	
}
/*检查扫描是否完成*/
export const isScanFinishedRequest = () => {
	try{
	    const result_data = window.isScanFinishedRequest()
		const json_result_data = $.parseJSON(result_data) 
		return { 
			type: types.EVENTS_IS_SCAN_FINISHED_REQUEST, 
	        json_result_data,
	        receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}	
}
/*本地数据库是否建成*/
export const initializeFontDBRequest = () => {
	try{
	    const result_data = window.initializeFontDBRequest()
		const json_result_data = $.parseJSON(result_data) 
		return { 
			type: types.WIMDOW_INITIALIZE_FONT_DB_REQUEST, 
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
			result_data = window.getConfigRequest(JSON.stringify(data))
	    }else{
	    	result_data = window.getConfigRequest()
		}
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
//设置配置信息
export const setConfigRequest = (data) => {
	try{
	    let result_data = window.setConfigRequest(JSON.stringify(data))
		const json_result_data = $.parseJSON(result_data) 
		return { 
			type: types.INIT_SET_CONFIG_INFO, 
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
export const initializationLoadingData = data => {
	return {
		type: types.INITIALIZATION_LOADING_DATA,
		data: data
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

export const getInItRoute = (data) => {
	return {
		type: types.GET_INIT_ROUTE,
		data,
		receivedAt: Date.now()
	}	
}
/* 字体属性 */
export const fontAttributes = (data) => {
	return { 
		type: types.FONT_ATTRIBUTES_DATA, 
        data,
        receivedAt: Date.now()
	}
}
/* 字体单个选中或取消选中 */
export const fontCheckItem = (data, isCheck) => {
	return { 
		type: types.FONT_UN_OR_CHECK_ITEM, 
        data,
        isCheck,
		receivedAt: Date.now()        
	}	
}
/* 字体全部选中或全部取消选中 */
export const fontAllCheckItem = (data, isCheck) => {
	return { 
		type: types.FONT_UN_OR_ALLCHECK_ITEM,
		data, 
		isCheck,
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
/* 右键菜单 */
export const smartMenuShow = (data) => {
	return {
		type: types.SMART_MENU_INFO,
		data,
		receivedAt: Date.now()
	}	
}

export const selectTagSave = (list) => {
	return {
		type: types.SELECT_TAG_SAVE,
		list,
		receivedAt: Date.now()
	}	
}
export const addSingleFont = (data) => {
	 const url = ApiConstant.DOMAIN_GO + ApiConstant.API_ADD_SINGLE_FONT;
     return fetchPostsIfNeeded(types.SAVE_ADD_SINGLE_FONT, url, 'POST', data)     
}
export const getSingleFontsList = (userId) => {
	 const url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_SINGLE_FONTS_LIST,
	       getData = 'userId='+ userId;
     return fetchPostsIfNeeded(types.GET_SINGLE_FONTS_LIST_DATA, url, 'GET', getData)	
}
export const getfontsByFontListID = (id) => {
	 const url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_FONTS_BY_FONT_LIST_ID,
	       getData = 'id='+ id
     return fetchPostsIfNeeded(types.GET_SINGLE_FONTS_ITEM_DATA, url, 'GET')		
}

export const searchCollectedToGo = (data) => {
    const url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_SEARCH_FONTS_LIST_DATA, 
    	  getData ='fontName='+ data.search_text + '&text='+ data.preview_text +'&fontSize='+ data.text_size + '&height='+ data.height +'&fetch_size=' + data.fetch_size + '&offest=' + data.offset;
  	return fetchPostsIfNeeded(types.SEARCH_COLLECTED_FONT_LIST, url,'GET', getData, data)
}
//搜索中心跳转数据流
export const searchfont = (data) => {
	return {
		type: types.GET_SEARCH_FONT_RESULT,
		data,
		receivedAt: Date.now()
	}	
}
//搜索字体时第一次调用 ，且只调用一次
export const searchFontRequest = (data) => {
	try{
		//console.time("搜索接口C++执行时间：")
	    const fontListData = window.searchFontRequest(JSON.stringify(data))
	    //console.timeEnd("搜索接口C++执行时间：")
   		let json_result_data = $.parseJSON(fontListData)   		

    	const list = json_result_data.data.list,
    	      after_fids = [],
    	      first_list = [];
	    if( list && list.length > 0 ){            
            for ( let i = 0; i < list.length; i++ ){
                const btn_statu = getFontState(list[i].font_state);
                if( btn_statu == GET_FONT_STATE.installed || btn_statu == GET_FONT_STATE.not_install ){                      
               	    first_list.push(list[i])
                }else{
				    after_fids.push(list[i].font_id)
                }
            }
		}
        //数据中有云端字体的时候，先显示本地的再显示云端的。
  	    return {
  	    	type: types.WINDOW_GET_FONT_REQUEST,
  	    	common: data,
  	    	json_result_data,
  	    	first_list,
  	    	after_fids,
  	    	active: 'search',
  	    	receivedAt: Date.now()
  	    }                     		  	    
  	}catch(e){
		return { 
			type: types.INITIALIZATION_ERROR_DATA 
		}		
	} 	    			
}
//单条
export const fetchPostFontItemRequest = (data) => {
	   //去云端获取单条字体信息 
       const n_c = data.common,
             url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_FONTS_By_FONT_ID,
             getData = 'userId='+ n_c.user_id +'&fontId='+ data.fids.join(',') + '&text='+ n_c.preview_text + '&fontSize='+ n_c.text_size + '&height='+ n_c.height; 
       return fetchPostsIfNeeded(types.RECEVIE_GET_FONTS_BY_FONT_ITEM_ID, url, 'GET', getData)	
}
//批量
export const fetchPostFontRequest = (data) => {
	   //去云端获取字体信息 
       const n_c = data.common,
             url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_FONTS_By_FONT_ID,
             getData = 'userId='+ n_c.user_id +'&fontId='+ data.afterFids.join(',') + '&text='+ n_c.preview_text + '&fontSize='+ n_c.text_size + '&height='+ n_c.height; 
       return fetchPostsIfNeeded(types.GET_FONTS_BY_FONT_ID, url, 'GET', getData, n_c, data.allList)
}
//获取字体，如搜索下拉，本地下拉
export const getFontRequest = (data) => {
    try{	

	     const fontListData = window.getFontRequest(JSON.stringify(data))  	   	    	
   		 const json_result_data = $.parseJSON(fontListData)
    	const list = json_result_data.data ? json_result_data.data.list : null,
    	      after_fids = [],
    	      first_list = [];
	    if( list && list.length > 0 ){            
            for ( let i = 0; i < list.length; i++ ){
                const btn_statu = getFontState(list[i].font_state);
                if( btn_statu == GET_FONT_STATE.installed || btn_statu == GET_FONT_STATE.not_install ){                      
               	    first_list.push(list[i])
                }else{
				    after_fids.push(list[i].font_id)
                }
            }
		} 
        //数据中有云端字体的时候，先显示本地的再显示云端的。
  	    return {
  	    	type: types.WINDOW_GET_FONT_REQUEST,
  	    	common: data,
  	    	json_result_data,
  	    	first_list,
  	    	after_fids,
  	    	receivedAt: Date.now()
  	    }                     
  	}catch(e){
		return { 
			type: types.INITIALIZATION_ERROR_DATA 
		}		
	}    		 	    	    	
}
//异步C++方法调用
export const asyncGetFontRequest = (data) => {
    return fetchAsyncRequest(types.RECEIVE_ASYNC_GET_FONT_REQUEST, data)
}
export const asyncDragdropRequest = (data) => {
    return fetchAsyncRequest(types.RECEIVE_ASYNC_DRAG_DROP_REQUEST, null)
}

//筛选
export const getSortFilterData = (data, temp) => {
    return {
    	type: types.EVENTS_GET_SORT_FILTER_DATA,
    	data: data,
    	temp: temp,
    	receivedAt: Date.now()
    }	
}
//获取预览图--本地
export const getPreviewImageLocal = (data) => {
	try{
		//本地预览图
        const result_data = window.getPreviewRequest(JSON.stringify(data))
        const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.EVENTS_GET_PREVIEW_IMAGE,
  	    	json_result_data,
  	    	data: {height:data.height,text_size:data.text_size,preview_text:data.preview_text,type:data.type},
  	    	receivedAt: Date.now()
  	    }                    
	}catch(e){
		return { 
			type: types.INITIALIZATION_ERROR_DATA 
		}		
	}
}
//获取预览图--云端
export const getPreviewImageYun = (data) => {
    //云端预览图
    const url = ApiConstant.DOMAIN_GO + ApiConstant.API_GET_PREVIEW_BY_FONT_ID,
          getData = '&fontId='+ data.list.join(',') + '&text='+ encodeURIComponent(data.preview_text) + '&fontSize='+ data.text_size + '&height='+ data.height;           
	return fetchPostsIfNeeded(types.RECEVIE_GET_PREVIEW_IMAGE, url, 'GET', getData, data) 
}
//打开文件窗口
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
//获取字体检测数据
export const psFileDetectRequest = (file_name, commonData) => {
    try{	
    	//console.time("检测文件的时间：")
		const result_data = window.psFileDetectRequest(file_name)
		//console.timeEnd("检测文件的时间：")
   		const json_result_data = $.parseJSON(result_data) 
  	    return {
  	    	type: types.WINDOW_PS_FILE_DETECT_REQUEST,
  	    	json_result_data,
  	    	commonData,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}  
}
//获取字体检测历史记录
export const getDetectRequest = (commonData) => {
    try{	
		const result_data = window.getDetectRequest()
   		const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.WINDOW_HISTORY_DETECT_REQUEST,
  	    	json_result_data,
  	    	commonData,
  	    	receivedAt: Date.now()
  	    }
  	 }catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}   	
}
//一键打包
export const oneKeyWarperRequest = (data) => {
    try{	
		const result_data = window.oneKeyWarperRequest(JSON.stringify(data))
   		const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.EVENTS_ONE_KEY_WARPER_REQUEST,
  	    	json_result_data,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}        
}
//一键补齐
export const missingKeyPadded = (data) => {
  	    return {
  	    	type: types.EVENTS_KEY_PADDED,
  	    	data,
  	    	receivedAt: Date.now()
  	    };	
}
//清空文件
export const clearDetectRequest = () => {
    try{	
		const result_data = window.clearDetectRequest()
   		const json_result_data = $.parseJSON(result_data)
  	    return {
  	    	type: types.EVENTS_CLEAR_DETECT,
  	    	json_result_data,
  	    	receivedAt: Date.now()
  	    }
  	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}     
}
//添加下载font_id
export const addGetDownloadFont = (font_id_list, fonts) => {
	try{
		return { 
			type: types.ADD_GET_DOWNLOAD_BEGING, 
			font_id_list,
			fonts,
			receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}
}
//启动下载操作
export const getDownloadFontBeging = (user_id, font_id_list) => {
	try{
		console.log('下载出参：', user_id, font_id_list)
	    const result_data = window.downloadFontRequest(user_id, font_id_list)
		const json_result_data = $.parseJSON(result_data)
		console.log('下载回参：', json_result_data)
		return { 
			type: types.WINDOW_GET_DOWNLOAD_BEGING, 
			json_result_data,
			receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}
}

//获取下载后的列表或获取正在下载的字体信息
export const getDownloadList = (type, font_id_list, commonData) => {
	try{
	    const result_data = window.getDownloadList(type, font_id_list)
		const json_result_data = $.parseJSON(result_data)    	
		if( isEmpty(font_id_list) ){
			//获取下载列表
			if( commonData ){
				return { 
					type: types.WINDOW_GET_DOWNLOAD_LIST, 
					json_result_data,
					commonData,
					receivedAt: Date.now() 
				}				
			}
			//获取下载列表
			return { 
				type: types.WINDOW_GET_DOWNLOAD_LIST, 
				json_result_data,
				receivedAt: Date.now() 
			}
		}else{
			//执行下载动作
			return { 
				type: types.EVENTS_GET_DOWNLOAD_LIST, 
				json_result_data,
				receivedAt: Date.now() 
			}		
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}
}



/*---------------------- fontBtn beging ------------------------*/
//卸载
export const uninstallFontDel = (list) => {
	try{
	    const result_data = window.uninstallFontRequest(JSON.stringify(list))
		const json_result_data = $.parseJSON(result_data)    	
		return { 
			type: types.WIMDOW_UNINSTALL_FONT_DEL, 
			json_result_data,
			receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}
}
//安装
export const installFontAdd = (data) => {
	try{
	    const result_data = window.installFontRequest(JSON.stringify(data))
		const json_result_data = $.parseJSON(result_data)    	
		return { 
			type: types.WIMDOW_INSTALL_FONT_ADD, 
			json_result_data,
			receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}	
}
//收藏 or 取消收藏
export const unOrCollectFonts = (user_id, font_id, temp) => {
	try{
	    const result_data = window.collectFontToServerRequest(user_id, font_id, temp)
		const json_result_data = $.parseJSON(result_data)
		return { 
			type: types.WIMDOW_UN_OR_COLLECT_FONTS, 
			json_result_data,
			temp,
			receivedAt: Date.now()
		}
	}catch(e){
		return { 
			type: types.INITIALIZATION_DATA 
		}		
	}			
}
//统计下载个数（每次返回会和上次的个数叠加）
export const downloadMessage = (data) => {
	return { 
		type: types.MESSAGE_DOWNLOAD_NUMBER, 
		data,
		receivedAt: Date.now()
	}	
}
//统计个数（安装：每次返回1）
export const installMessage = (data) => {
	return { 
		type: types.MESSAGE_INSTALL_NUMBER, 
		data,
		receivedAt: Date.now()
	}	
}

export const receiveGoPosts = (actionType, json, commonData, fonts, error) => {
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

	 case types.GET_SINGLE_FONTS_LIST_DATA:
	    if( !error ){
			return {
			    type: types.RECEIVE_SINGLE_LIST_GO_POSTS,
			    posts: json,
			    receivedAt: Date.now()
			}
		}else{
			return {
			    type: types.RECEIVE_SINGLE_LIST_GO_POSTS,
				error,
			    receivedAt: Date.now()
			}			
		}
		
	 case types.GET_SINGLE_FONTS_ITEM_DATA:
	    if( !error ){
			return {
			    type: types.RECEIVE_SINGLE_ITEM_GO_POSTS,
			    posts: json,
			    receivedAt: Date.now()
			}
		}else{
			return {
			    type: types.RECEIVE_SINGLE_ITEM_GO_POSTS,
				error,
			    receivedAt: Date.now()
			}			
		}	 

	 case types.SEARCH_COLLECTED_FONT_LIST:
	    if( !error ){
		    return {
			    type: types.RECEIVE_SEARCH_GO_POSTS,
			    commonData,
			    posts: json,
			    receivedAt: Date.now()	    	
		    }
		}else{
			return {
			    type: types.RECEIVE_SEARCH_GO_POSTS,
				error,
			    receivedAt: Date.now()
			}			
		}
	 case types.GET_FONTS_BY_FONT_ID:
	    if( !error ){
		    return {
			    type: types.RECEIVE_GET_FONTS_BY_FONT_ID,
			    commonData,
			    fonts,
			    posts: json,
			    receivedAt: Date.now()	    	
		    }
	    }else{
			return {
			    type: types.RECEIVE_GET_FONTS_BY_FONT_ID,
				error,
			    receivedAt: Date.now()
			}	    	
	    }
	 case types.RECEVIE_GET_PREVIEW_IMAGE:
	    if( !error ){
		    return {
			    type: types.RECEVIE_GET_PREVIEW_IMAGE,
			    posts: json,
			    data: {height:commonData.height,text_size:commonData.text_size,preview_text:commonData.preview_text,type:commonData.type},
			    receivedAt: Date.now()	    	
		    }
	    }else{
			return {
			    type: types.RECEVIE_GET_PREVIEW_IMAGE,
				error,
			    receivedAt: Date.now()
			}	    	
	    }
     case types.RECEVIE_GET_FONTS_BY_FONT_ITEM_ID:
	    if( !error ){
		    return {
			    type: types.RECEVIE_GET_FONTS_BY_FONT_ITEM_ID,
			    posts: json,
			    receivedAt: Date.now()	    	
		    }
	    }else{
			return {
			    type: types.RECEVIE_GET_FONTS_BY_FONT_ITEM_ID,
				error,
			    receivedAt: Date.now()
			}	    	
	    }

	 default:
	    return {
	    	type: types.INITIALIZATION_DATA
	    }		     	    	   
  }
}
//异步http
export const fetchPosts = (actionType, url, method, data, commonData, fonts) => {
	log('去云端获取字体信息')
    return dispatch => {
    	try{
		    if( method == 'GET' ){
			    return fetch(url +'?'+ data,{
			    		method: method
			    	}).then((response) => {return response.json() })
			        .then((json) => { 
			      	      dispatch(receiveGoPosts(actionType, json, commonData, fonts))
			        })
			        .catch((e) => {
			        	const error = isEmpty(e.message) ? 'error' : e.message
			        	dispatch(receiveGoPosts(actionType, e.message, commonData, fonts, error))
			        })
		    }else{
			    return fetch(url,{
			    		method: method,
			    		headers:{
                            "Content-Type": "text/plain",
			    		},
			    		body: JSON.stringify(data)
			    	}).then((response) => {return response.json() })
			        .then((json) => { 
			      	      dispatch(receiveGoPosts(actionType, json, commonData, fonts))
			        })
			        .catch((e) => { 
			        	const error = isEmpty(e.message) ? 'error' : e.message
			        	dispatch(receiveGoPosts(actionType, e.message, commonData, fonts, error))
			        })
			}
		} catch(e){
			dispatch(receiveGoPosts(actionType, null, commonData, fonts, '服务器故障，请稍候再试'))
		}
	}
}
export const fetchPostsIfNeeded = (actionType, url, method, data, commonData, fonts) => {
  return (dispatch, getState) => {
	    return dispatch(fetchPosts(actionType, url, method, data, commonData, fonts))
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
    return dispatch => {
    	try{
		    return fetch('')
		        .then((response) => {return response.json() })
		        .then((json) => { 
		      	      //dispatch(receiveGoPosts(actionType, data))
		        })
		        .catch((e) => {
		        	function asyncCallbackFn(result){
		        		const json_result_data = $.parseJSON(result);
						dispatch(receiveGoAsync(actionType, data, json_result_data))
		        	}
		            switch(actionType){
		            	case types.RECEIVE_ASYNC_GET_FONT_REQUEST:
		            	     window.asyncGetFontRequest(JSON.stringify(data), asyncCallbackFn)
		            		 break;

		            	case types.RECEIVE_ASYNC_DRAG_DROP_REQUEST:
		            	     window.startAsyncGetDragDropFileRequest(asyncCallbackFn)
		            	     break;

		            	default:
		            	     break;	      
		            }  
		        })
		} catch(e){
			dispatch(receiveGoAsync(actionType, data, null, '获取数据出错啦'))
		}
	}
}
export const receiveGoAsync = (actionType, data, json_result_data, error) => {
	switch(actionType){
		case types.RECEIVE_ASYNC_GET_FONT_REQUEST:
			const list = json_result_data.data ? json_result_data.data.list : null,
			      after_fids = [],
			      first_list = [];
		    if( list && list.length > 0 ){            
		        for ( let i = 0; i < list.length; i++ ){
		            const btn_statu = getFontState(list[i].font_state);
		            if( btn_statu == GET_FONT_STATE.installed || btn_statu == GET_FONT_STATE.not_install ){                      
		           	    first_list.push(list[i])
		            }else{
					    after_fids.push(list[i].font_id)
		            }
		        }
			} 
		    //数据中有云端字体的时候，先显示本地的再显示云端的。
			return {
		    	type: types.RECEIVE_ASYNC_GET_FONT_REQUEST,
		    	common: data,
		    	json_result_data,
		    	first_list,
		    	after_fids,
		    	error,
		    	receivedAt: Date.now()
			}

		case types.RECEIVE_ASYNC_DRAG_DROP_REQUEST:
		    //监听拖拽后接口返回的数据
			return {
		    	type: types.EVENTS_OPEN_FILE_REQUEST,
		    	json_result_data,
		    	temp: 0,
		    	error,
		    	receivedAt: Date.now()
			}		    

             
		default:
		    return {
		    	type: types.INITIALIZATION_DATA
		    }
	}
}















