import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty } from '../../constants/UtilConstant'
import { msgAlertHtml, msgAlertSuccessHtml, msgAlertErrorHtml } from '../../constants/RenderHtmlConstant'

/* 弹出层--修改备注  */
class ModifyComment extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		modifyMsg: {
    			show: false,
    			text: '',
    			success: false
    		}
    	};
    	log("ModifyComment");		
	}
	alertTip(show, text, isSuccess) {
        this.setState({
    		modifyMsg: {
    			show: show,
    			text: text,
    			success: isSuccess
    		}            	
        })
        if( isSuccess ){
        	this.props.actions.triggerDialogInfo(null)
        }		
	}
	modifyCommentSend(event) {
		const modifyRef = this.refs.modifyCommentRef,
		      dialogData = this.props.dialogData.data;
        if( modifyRef && dialogData ){
			this.props.Fn.updateFriend(dialogData.account, modifyRef.value, this)
		} else {
			this.alertTip(true, '修改备注失败', false)
		}
	}
	render() {
		const { actions } = this.props
		const { modifyMsg } = this.state
		return <div className="dialog modify-comment-layer" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>修改备注姓名</span>
		               <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
		           </div>
		           <div className="dialog-content">
		               <p className="p-dc flex flex-c flex-l-l">请输入备注姓名：</p>
		               <div className="text-dc flex flex-c">
		                   <input type="text" className="bor-s-e1 col-6 text-input flex flex-c flex-item-gsb-1" ref="modifyCommentRef"/>		                   
		               </div>
		           </div>
	               <div className="dialog-footer flex flex-c">
	                    <p className="flex flex-r-r" style={{"width":"100%"}}>
	                        <button className="button confirm-btn" onClick={this.modifyCommentSend.bind(this)}>确认</button>
	                        <button className="button cancel-btn" onClick={() => actions.triggerDialogInfo(null)}>取消</button> 
	                    </p>
	               </div>
		           {
		           	    modifyMsg.show && !modifyMsg.success ?
		           	       msgAlertErrorHtml(modifyMsg.text) 
		           	    :
		           	       null   
		           }	               		           
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = document.querySelector('.modify-comment-layer'),
			      dragElem = parElem.querySelector('.dialog-title');					
			absVerticalCenter2(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}	
	}		
}
export default immutableRenderDecorator(ModifyComment)
