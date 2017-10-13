import fetch from 'isomorphic-fetch'
import * as types from '../constants/ActionsTypes'
import ApiConstant from '../constants/ApiConstant'
import { log } from '../constants/UtilConstant'

/*获取视图结果*/
export const getShituId = (data) => {
	return {
		type: types.GET_SHITU_ID,
		data,
		receivedAt: Date.now()
	}	
}
export const searchfont = (data) => {
	return {
		type: types.GET_SEARCH_FONT_RESULT,
		data,
		receivedAt: Date.now()
	}	
}
export const getStIdData = (data)=>{
	return {
		type: types.GET_SHITU_INPUTID,
		data,
		receivedAt:Date.now()
	}
}
/*获取视图结果*/
export const getShituImgResult = (data) => {
	 return fetchAsyncRequest(types.GET_SEARCH_IMG_RESULT, data)
}
// // 开启拖拽
export const startGetDragDropFile = temp => {
	//if( temp && temp == "FONT" ){
		//console.log('字体补齐拖拽')
        //return fetchAsyncRequest(types.RECEIVE_ASYNC_DRAG_DROP_REQUEST, null)
	//}else{
		console.log('首页拖拽')
		return fetchAsyncRequest(types.OPEN_IMG_DRAG, temp)
	//}
}
export const switchSearchFileByImageRequest = (data) =>{
	return fetchAsyncRequest(types.GET_SHITU_SERIVE,data)
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
		        	function asyncCallbackFns(result) {
		        		const json_result_data = $.parseJSON(result);
						dispatch(receiveAsync(actionType, data, json_result_data))
		        	}
		        	function asyncCallbackFont(result) {
		        		const json_result_data = $.parseJSON(result);
						dispatch(receiveAsync(types.RECEIVE_ASYNC_DRAG_DROP_REQUEST, data, json_result_data))		        		
		        	}
		            switch(actionType){
                        case types.GET_SEARCH_IMG_RESULT:
                             const range = data.range ? data.range.value : 0
                        	 window.asyncsearchFileByImageRequest(data.data, data.mode, range, data.cmd, data.page_num, data.per_page_size, asyncCallbackFns) 
                             break; 		            	          	            	
                         case types.OPEN_IMG_DRAG:    
                             if( data && data == "FONT" ){
                                window.asyncStartGetDragDropFileRequest(asyncCallbackFont)
                             }else{                    
                             	window.asyncStartGetDragDropFileRequest(asyncCallbackFns)
                         	 }
                             break;                            
                          case types.GET_SCANNING_RESULT:                    
                          window.asyncsearchFileByImageRequest(data.data, data.KPathKey,asyncCallbackFns)
                          break;
                          case types.GET_SHITU_SERIVE:
                              window.asyncswitchSearchFileByImageRequest(data,asyncCallbackFns)  
                          break;
		            	default:
		            	     break;	      
		            }
		            console.timeEnd("C++异步获取数据时间：")  
		        })
		} catch(e){
			dispatch(receiveAsync(actionType, data, null, '获取数据出错啦'))
		}
	}
}
export const receiveAsync = (actionType, data, json_result_data, error) => {
	switch(actionType){
		case types.GET_SEARCH_IMG_RESULT:
		    if( json_result_data ){
		        json_result_data['sendPost'] = data 
			}
		    return {
		    	type: types.GET_SEARCH_IMG_RESULT,
		    	data,
		    	json_result_data,
		    	error,
		    	receivedAt: Date.now()		    	
		    }	
		 case types.OPEN_IMG_DRAG:
		 return {
		    	type: types.OPEN_IMG_DRAG,
		    	json_result_data,		  
		    	error,
		    	receivedAt: Date.now()		    	
		    }			    						   	
           case types.GET_SCANNING_RESULT:
            return {
		    	type: types.GET_SCANNING_RESULT,
		    	json_result_data,		  
		    	error,
		    	receivedAt: Date.now()		    	
		    }
		    case types.GET_SHITU_SERIVE:
		    return{
		    	type: types.GET_SHITU_SERIVE,
		    	json_result_data,		  
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
