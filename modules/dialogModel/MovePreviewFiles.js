import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { isEmpty, dragDrop, log } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

/* 弹出层--移动预览图缓存目录图片  */
class MovePreviewFiles extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		progress_t: 0,
    		rsp_t: false
    	}
    	this.cancelMovePreview = () => {
    		this.props.actions.sendHandleMessage('SettingMsgProcess', 'cancelMovePreview', '')
    		this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在取消预览图路径更改，请稍候...",auto: false}) 
    	}
    	log("MovePreviewFiles");		
	}
	render() {
		const { actions, dialogData } = this.props
		const { progress_t, rsp_t, alert } = this.state
		const pbStyle = {
			width: progress_t +'%'
		}
		return <div className="dialog move-preview-files-layer" ref="verticalCenter">
	               <div className="dialog-title flex flex-c flex-c-c"></div>
	               <div className="dialog-content">
	                   <p className="progress-bar">
	                       <i className="abs pb-real-time" style={pbStyle}></i>
	                   </p>
	                   {
	                   	   !rsp_t ?
			                   <p className="move-info flex flex-c">
		                           <span className="flex-item-gsb-1 mi-left">正在移动预览图到新路径，已完成：{progress_t}%</span>
		                           {
		                           	    progress_t != 100 ? 
		                           	       <span className="flex-item-gsb-1 mi-right"><bottom className="back-move-btn btn" onClick={this.cancelMovePreview}>取消</bottom></span>
		                           	    : 
		                           	       null  
		                           }
			                   </p>
			                :
			                   <p className="move-info flex flex-c">
		                           <span className="flex-item-gsb-1 mi-left">正在移除原预览图路径下的文件，请稍候...</span>
			                   </p>			                   
	                   } 
	               </div>
		       </div>  
	}
	componentDidMount() {
		this.refs.verticalCenter && absVerticalCenter2(this.refs.verticalCenter)		
		const parElem = document.querySelector('.move-preview-files-layer'),
		      dragElem = parElem && parElem.querySelector('.dialog-title');
		dragDrop(dragElem, parElem);      	
	}
	componentWillReceiveProps(nextProps) {
    	//js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
				log('---返回数据为空---')
            	return;
            } 
            const jsVal = jsData.data;          
            try{
                switch( jsModule ){
                	case 'get_preview_move_progress_t':
                	    if( jsVal ){
	                        this.setState({
	                            progress_t: jsVal.total_progress,
                                rsp_t: (() => {
			                        if( jsVal.total_progress === 100 ){
		                                return true 
			                        }else{
			                        	return false
			                        }                                    
                                })()
	                        })
                    	}
                	break;
                	case 'preview_path_move_rsp_t':
                	    if( jsData.error_code != 0 ){
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "修改路径失败(代码："+ jsData.error_code +")",auto: true,speed: 3000,statu: 1})
                	        return
                	    }
                	    if( !document.getElementById('Lianty-Set') ){
                	    	this.props.actions.triggerDialogInfo(null)
                	    	return
                	    }
                	    this.props.actions.getConfigInfo(null, 'UPDATE_PATH_SHOW_TIP');
                	break;    
                	default:
                	break;
                }
            }catch(e){} 
        }       		
	}			
}
const mapStateToProps = (state) => {
 	 return {
        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated     
  	}
}
export default connect(
 	mapStateToProps
)(MovePreviewFiles)
