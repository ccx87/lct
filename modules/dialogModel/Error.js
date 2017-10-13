import React, { Component, PropTypes } from 'react'
import { absVerticalCenter } from '../../constants/DomConstant'
import { log } from '../../constants/UtilConstant'

/* 弹出层--错误提示  */
class Error extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		timeauto: null
    	};
    	log("Error");		
	}
	render() {
		const { dialogData } = this.props
		return <div className="error-dialog-layer" id="Error1" ref="verticalCenter">
		           <div className="opt1"></div> 
		           <p className="error1"><i className="icons icons-40 error1-bg"></i>{dialogData.text}</p>
		       </div>	  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			absVerticalCenter(this.refs.verticalCenter)
			if(this.props.dialogData.auto){
				this.state.timeAuto = setTimeout(() => {
					this.props.onDialogShow()
				}, this.props.dialogData.speed)
			}
		}		
	}
	componentWillUnmount() {
		this.state.timeAuto = null
	}		
}
Error.propTypes = {
	
}
export default Error
