import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { WIMDOW_INITIALIZE_FONT_DB_REQUEST } from '../../constants/ActionsTypes'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { dragDrop, log } from '../../constants/UtilConstant'

const doc = document
/* 弹出层--字体扫描 */
class ManualScan extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		scanData: {
    			isProc: -1,
    			text: '',
    			s: 0,
    			out_time: 0,
    			close: false
    		},
    		timeout: null
    	};
    	log("ManualScan");		
	}
	scanBtn(data) {
		if( data == null || data.code == null ){
			return
		}
		switch(data.code){
			case WIMDOW_INITIALIZE_FONT_DB_REQUEST:
                this.setState({
		    		scanData: {
		    			isProc: 0,
		    			text: '首次使用扫描本地字体中，需要一些时间，请稍候...'
		    		}                	
                })
			    this.props.actions.initializeFontDBRequest()
			    break

			default:
			    return null 
		}
	}
	closeDialogInfo() {
		if( this.state.timeout ){
			clearInterval(this.state.timeout)
		}		
		this.props.actions.triggerDialogInfo(null)
	}
	render() {
		const { dialogData } = this.props
		const { scanData } = this.state
		return <div className="scan-dialog-layer dialog" id="Scan" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>{dialogData.title}</span>
		               {
		               	   scanData.close ?
		               	   	  <a className="abs close-dialog" onClick={this.closeDialogInfo.bind(this)}><i className="icons icons-18 close-dialog-bg"></i></a>
		               	   :
		               	      null
		               }
		               
		           </div>
		           {
		           	   scanData.isProc == -1 ?
				           <div className="dialog-content">
				               <div className="table-cell">
					               <p>首次使用字体助手，需要进行扫描</p>
					               <a className="dialog-btn scan-btn" onClick={this.scanBtn.bind(this, dialogData)}>开始扫描</a>
				               </div>
				           </div>
				        :
				        scanData.isProc == 0 ?
				           <div className="dialog-content">
				               <div className="table-cell">
                                   <p><i className="loading-bg"></i>{scanData.text}</p>
				               </div>
				           </div>
				        :
				        scanData.isProc == 1 ? 
				           <div className="dialog-content">
				               <div className="table-cell">
                                   <p className="p-1"><i className="icons icons-18 loading-ok-bg"></i>{scanData.text}</p>
                                   <p className="p-2"><span className="col-lan font-weight7">{scanData.s}秒 </span>后自动关闭</p>
				               </div>
				           </div>
				        :
				           null   				          				              
		           }		           		           
		       </div>	  
	}
	closureDialog(time) {
		this.state.timeout = setInterval(() => {
			time--
			if( time <= 0 ){
				if( this.props.dialogData.defaultFn ){
					//特殊方法处理
					this.props.dialogData.defaultFn()
				}
                clearInterval(this.state.timeout) 
                this.props.actions.triggerDialogInfo(null)	                
                return false
			}
            this.setState({
	    		scanData: {
	    			isProc: 1,
	    			text: '扫描完成',
	    			s: time
	    		}                	
            })
	    }, 1000)		
	}	
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = doc.querySelector('.scan-dialog-layer'),
			      dragElem = parElem.querySelector('.dialog-title')
			absVerticalCenter2(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}

		if( this.props.dialogData.data != null ){
			this.setState({
				scanData: this.props.dialogData.data
			})
		}		
	}
	componentWillReceiveProps(nextProps) {
		if( nextProps.dialogData ){
			if( nextProps.dialogData.status == 0 || nextProps.dialogData.status == 2 ){
				if( this.state.timeout ){
					clearInterval(this.state.timeout)
				}
				const out_time = nextProps.dialogData.data.out_time != null ? nextProps.dialogData.data.out_time : 0
                this.closureDialog(out_time)
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))	        
	}
	componentWillUnmount() {
		if( this.state.timeout ){
			clearInterval(this.state.timeout)
		}
	}	
}
export default immutableRenderDecorator(ManualScan)
