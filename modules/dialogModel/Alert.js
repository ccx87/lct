import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter } from '../../constants/DomConstant'
import { log, isEmpty } from '../../constants/UtilConstant'

/* 弹出层--信息提示  */
class Alert extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		timeauto: null
    	};
    	log("Alert");		
	}
	render() {
		const { dialogData } = this.props
		return <div className="alert-dialog-layer" id="Alert" ref="verticalCenter">
		           <div className="opt"></div> 
		           <div className="alert clearfix">
                       <p className="g-l p-1">
		               {
		               	  dialogData.statu == 0 ?
		               	     <i className="icons icons-40 error-alert-bg"></i>
		               	  :
		               	  dialogData.statu == 1 ? 
		               	  	 <i className="icons icons-40 ok-alert-bg"></i> 
		               	  :
		               	  dialogData.statu == 2 ?
                             <i className="icons icons-40 mark-alert-bg"></i>
		               	  :   
		               	     null 	    
		               }
		               </p>
		               <p className="g-l p-2">
		                  {  
		                  	  dialogData.error_code ?
                                  <span className="msg-code" dangerouslySetInnerHTML={{__html: !isEmpty(dialogData.text) ? dialogData.text : '哎呀，提示语丢掉了...(代码：'+ dialogData.error_code +')'}}></span>
		                  	  :
		               	  	  	  <span className="msg-code" dangerouslySetInnerHTML={{__html: !isEmpty(dialogData.text) ? dialogData.text : '哎呀，提示语丢掉了...'}}></span>
		                  }
		               </p>
		           </div>
		       </div>	  
	}
	autoFn(speed) {
		const sd = speed || 3000;
		clearTimeout(this.state.timeauto)
		this.state.timeauto = setTimeout(() => {
			this.props.actions.triggerDialogInfo(null)
		}, sd)	    		
	}
	componentDidMount() {
		if( this.refs.verticalCenter ){
			absVerticalCenter(this.refs.verticalCenter)
		}
		if( this.props.dialogData && this.props.dialogData.auto ){
			this.autoFn(this.props.dialogData.speed)
		}				
	}
	componentWillReceiveProps(nextProps) {
		if( nextProps.dialogLastUpdated && nextProps.dialogLastUpdated !== this.props.dialogLastUpdated ){
			if(nextProps.dialogData.auto){
				this.autoFn(nextProps.dialogData.speed)
			}			
		}		
	}
	shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))			
	}
	componentWillUnmount() {
		if( this.state.timeauto ){
		    clearTimeout(this.state.timeauto)
		}
	}		
}
export default immutableRenderDecorator(Alert)