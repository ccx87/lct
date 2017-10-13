import React, { Component, PropTypes } from 'react'

import { clientHeight, velocityPrveOrNext } from '../../constants/DomConstant'
import { log, isEmpty } from '../../constants/UtilConstant'
import { getmCustomScrollbar } from '../../constants/EventsConstant'

import Preview from '../smallModel/Preview'
import FileAttr from '../smallModel/FileAttr'
import ColorChannel from '../smallModel/ColorChannel'

class DetectionDetail extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DetectionDetail");		
	}	
	render() {
		const fmData = this.props.fonts.missingPsFileDetectData
		return <div className="detection-detail scllorBar_detection_detail" ref="clientHeight" style={{"height":"100%"}}>
		            <Preview fmData={fmData} active={true}/> 
                    <FileAttr fmData={fmData} active={true}/>                      
                    <ColorChannel fmData={fmData} active={true}/>                                                                		           
		       </div>
	}
	componentDidMount() {
		getmCustomScrollbar($(".scllorBar_detection_detail"))		
	}
	componentDidUpdate(nextProps, nextState) { 	   
		if(nextProps.resize.h !== this.props.resize.h){
			getmCustomScrollbar($(".scllorBar_detection_detail"), null, "update")
    	}
	}	     
}
export default DetectionDetail 