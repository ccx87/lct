import React, { Component, PropTypes } from 'react'

import { clientHeight } from '../../../constants/DomConstant'
import { log } from '../../../constants/UtilConstant'

import FontPicFlow from '../../../modules/flowModel/FontPicFlow'

//效果图
class Effectpic extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("Effectpic");		
	}
	renderHtmlPanel() {
		return (
			<div className="item" >
                 <img src="compress/temp/e1.png" width="192" height="288" />
            </div>
        )
	}
	render() {
		return <div className="content-effectpic-cf">
                    <div className="effectpic scllorBar_effectpic" ref="clientHeight">
                        <FontPicFlow />			            			            			            			                                
                    </div>
		       </div>
	}
	componentDidMount() {
		const target = this
		//设置最大高度
	    clientHeight(this.refs.clientHeight,this.props.resize.h,330)
    	//加载滚动条 		
		$(".scllorBar_effectpic").mCustomScrollbar({
			scrollInertia:550,
			theme:"dark-3",
			callbacks:{
			    onTotalScroll:function(){}
			}			
		});							
	}
	componentDidUpdate(nextProps, nextState) {
	    if(nextProps.resize.h !== this.props.resize.h){
		    clientHeight(this.refs.clientHeight,this.props.resize.h,330,this.refs.clientHeight.firstChild)				
        }	
	}		
}
Effectpic.propTypes = {
	
}
export default Effectpic