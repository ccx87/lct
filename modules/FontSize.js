import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import ConfigInfo from '../constants/ConfigInfo'
import { FONT_SIZE, PAGE_TYPE, GET_FONT_STATE } from '../constants/DataConstant'
import { MY_FONTS_ALL, MY_FONTS_INSTALLED, MY_FONTS_UNINSTALL, MY_FONTS_COLLECTED } from '../constants/TodoFilters'
import { isEmpty, log, getFontState } from '../constants/UtilConstant'
import { getLocalOrYunFontId } from '../constants/EventsConstant'

class FontSize extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		fsListShow: false
    	};
    	this.oneBodyClick = this.oneBodyClick.bind(this)	
	}
	showFsList(event) {
		const i_Elem = event.currentTarget.querySelector('i.drop-down-bg');
		$(i_Elem).toggleClass('rotate-180-bg');
		this.setState({
			fsListShow: !this.state.fsListShow
		})
		event.stopPropagation()
	}
	selectFsList(font_size, height, event) {
		let fsSelTextRefDOM = this.refs.fsSelTextRef,
		    t_c = this.props.fonts.common,
		    t_fonts = this.props.fonts.fontListData;
		t_c.height = height;
		t_c.text_size = font_size    
		if(fsSelTextRefDOM){
			fsSelTextRefDOM.innerHTML = font_size
		}		    	  		    
		if( !t_fonts || !t_fonts.data || !t_fonts.data.list || t_fonts.data.list.length == 0 ){
            return false
		}
		const fids = getLocalOrYunFontId(t_fonts.data.list),
		      data = {
				 list: [],
				 height: t_c.height,
				 text_size: t_c.text_size,
				 preview_text: t_c.preview_text,
				 type: 0
			  };	  
		// 本地获取预览图， 参数font_id, text为空时获取默认值 
	    if( fids.local_fids.length > 0 ){
			data.list = fids.local_fids;        	
	    	this.props.actions.getPreviewImageLocal(data)
		}	 
		// 云端获取预览图， 参数font_id，text为空时获取默认值
	    if( fids.yun_fids.length > 0 ){
			data.list = fids.yun_fids; 	    	
	    	this.props.actions.getPreviewImageYun(data)
		} 	     			
	}
	oneBodyClick(event) {
		if(event.target.className === "unbody"){
			return;
		}
		if(this.state.fsListShow){
			$('.function-bar .font-size .drop-down-bg').toggleClass('rotate-180-bg');
			this.setState({
				fsListShow: false
			})			
		}
	}
	render() {
		const { fonts } = this.props
		return <div className="font-size">
		            <i className="icons icons-20 font-size-bg"></i> 
		               字体大小
	                <div className="fs-txt" onClick={this.showFsList.bind(this)}>
	                    <a ref="fsSelTextRef" className="unbody">
	                     {fonts.common && fonts.common.text_size ? fonts.common.text_size : ConfigInfo.fontSize.value}
	                    </a>
	                    <span style={{"lineHeight": "23px"}}>pt</span>
	                    {
	                  	    this.state.fsListShow ?
				                <ul className="abs fs-list">
				                    {
				                  	    FONT_SIZE.map((item, index) =>
				                  	        <li className="unbody" onClick={this.selectFsList.bind(this, item.value, item.real_value)} key={index}>
				                  	            {item.text}
				                  	        </li>
				                  	    ) 
				                    }
				                </ul>
				           :
				              null   		                  	  
	                    }	
	                  <i className="icons icons-18 drop-down-bg abs"></i>	                  
	                </div>
		       </div>
	}
	componentDidMount() {
		document.body.addEventListener('click', this.oneBodyClick)
	}
	componentWillUnmount() {
		document.body.removeEventListener('click', this.oneBodyClick)
	}	
}
export default immutableRenderDecorator(FontSize)
