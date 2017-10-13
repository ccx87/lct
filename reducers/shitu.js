import Assign from 'lodash.assign'
import { GET_SHITU_ID, GET_SEARCH_IMG_RESULT,OPEN_IMG_DRAG,GET_SCANNING_RESULT,GET_SHITU_INPUTID,GET_CONFIG_DATA,GET_SHITU_SERIVE} from '../constants/ActionsTypes'

let receiveData = [];
function posts(state = {}, action) {
    switch (action.type) {
        case GET_SHITU_ID:
            return Assign({}, state, {
	             shituIdData: action.data,
	             shituIdDataLastUpdated: action.receivedAt
            })
        case GET_SEARCH_IMG_RESULT:

            if( action && action.json_result_data ){
                if( action.data ){
                    if(  action.data.is_init && state.shituResultData && state.shituResultData.data ){
                        //清空一下缓存字段
                        state.shituResultData.data = [];                   
                    }
                    action.data.is_init = false;
                    if( action.json_result_data.data && action.json_result_data.data.length > 0 ){
                        if( state.shituResultData && state.shituResultData.data ){
                            const oldData = state.shituResultData.data;
                            state.shituResultData = action.json_result_data
                            state.shituResultData.data.unshift(...oldData)
                        }else{
                            state.shituResultData = action.json_result_data
                        }
                    }else{
                        action.json_result_data.data = []
                        state.shituResultData = action.json_result_data
                    }
                }
                if( state.shituResultData.constructor != Object ){
                    state.shituResultData = {}
                }
                state.shituResultData["sendPost"] = action.data
                //const jrdata = action.json_result_data;
                // if( jrdata.total > 0 && jrdata.data ){
                //     receiveData.push.apply(receiveData, jrdata.data)

                //     if( receiveData.length >= jrdata.total ){
                //         action.json_result_data.data = receiveData; 
                //         //清空一下缓存字段
                //         receiveData = [];
                //         return Assign({}, state, {
                //            shituResultData: action.json_result_data,
                //            shituResultDataLastUpdated: action.receivedAt
                //         }) 
                //     }else{
                //         return false
                //     }
                // }
            } 
            return Assign({}, state, {
               shituResultData: state.shituResultData,
               shituResultDataLastUpdated: action.receivedAt
            })               
         case OPEN_IMG_DRAG:
               return Assign({}, state, {
               shituDragResultData: action.json_result_data,
               shituDragResultDataLastUpdated: action.receivedAt 
            }) 
        case GET_SHITU_INPUTID:
                 return Assign({}, state, {
               shituInputData: action.data,
               shituInputDataLastUpdated: action.receivedAt
            })  
        case GET_SHITU_SERIVE:
                return Assign({}, state, {
               shituSeriveData: action.json_result_data,
               shituSeriveDataLastUpdated: action.receivedAt
            })            
    default:
      return state     

  }  
}
export default function shitu(state = {}, action) {
    switch (action.type) {   

        case GET_SHITU_ID: 
        case GET_SEARCH_IMG_RESULT: 
        case OPEN_IMG_DRAG:  
        case GET_SCANNING_RESULT:
        case GET_SHITU_INPUTID:
        case GET_SHITU_SERIVE:
            return Assign({}, state, posts(state, action))

                           
        default:
          return state
    }
}
