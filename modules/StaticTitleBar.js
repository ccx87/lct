import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { SHOW_DIALOG_CLFF, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'
import { log } from '../constants/UtilConstant'

class StaticTitleBar extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("StaticTitleBar");		
	}
	setBackBtn(event){
		try{
        	window.stopConfigRequest();
    	}catch(e){
    		log('---window.stopConfigRequest()接口不存在---')
    	}
	}
	render() {
		const { fontSize, text, backBtn } = this.props
		return <div className="title-bar" style={{"fontSize": fontSize +"px"}}>
		            {
		            	backBtn ?
		            	   <a className="icons icons-30 set-back-bg" onClick={this.setBackBtn.bind(this)}></a>
		            	:
		            	   null    
		            }
		            {
		            	backBtn ?
		            	   <span>{text}</span>
		            	:
		            	   <span className="left-title">{text}</span>   
		            }
                    
		       </div>
	}
}
export default StaticTitleBar
