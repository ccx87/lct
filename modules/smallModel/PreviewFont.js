import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { isEmpty, log, TransJF } from '../../constants/UtilConstant'
import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { getLocalOrYunFontId } from '../../constants/EventsConstant'

//字体预览图--输入框
class PreviewFont extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("PreviewFont");		
	}
	eventsKeyDownPreview(event) {
		var keyCode = window.event ? event.keyCode : event.which;
		if(keyCode == 13) {
			this.previewTextBtn()
		}
		return false;
	}
	previewTextBtn() {
		let previewTextRefDOM = this.refs.previewTextRef
		if(previewTextRefDOM){
			const text = previewTextRefDOM.value,
			      search_text = $('.search-font .sf-input').val(),
		    	  t_c = this.props.fonts.common,
		    	  t_fonts = this.props.fonts.fontListData;		    
		    if( isEmpty(text) ){
                return false 
			}
			t_c.preview_text = text;
			if( !t_fonts || !t_fonts.data || !t_fonts.data.list || t_fonts.data.list.length == 0 ){
                return false
			}
			const fids = getLocalOrYunFontId(t_fonts.data.list),
			      data = {
					 list: [],
					 height: t_c.height,
					 text_size: t_c.text_size,
					 preview_text: t_c.preview_text,
					 type: 1
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
	}
    convert(type, event) {
		this.refs.previewTextRef.value = TransJF(type, this.refs.previewTextRef.value);
	}	
	render() {
		return  <div className="preview-font" onKeyDown={this.eventsKeyDownPreview.bind(this)}>
		            <input type="text" className="pf-input" maxLength="30" placeholder="请输入您要预览的文字" ref="previewTextRef"/>
		            <a className="pf-abtn" onClick={this.previewTextBtn.bind(this)}>预览</a>
		            <a className="jf col-lan" onClick={this.convert.bind(this, 0)} href="javascript:void(0);">简</a>
		            <a className="jf col-lan" onClick={this.convert.bind(this, 1)} href="javascript:void(0);">繁</a>
		        </div>
	}	
	componentDidMount() {
		const t_f = this.props.fonts;
		if( t_f && t_f.common ){
        	$('.preview-font .pf-input').val(t_f.common.preview_text)
		} 				
	}
	componentDidUpdate(nextProps) {
		const t_f = this.props.fonts;
		if( t_f && t_f.common ){
        	$('.preview-font .pf-input').val(t_f.common.preview_text)
		}        
	}
}
export default immutableRenderDecorator(PreviewFont)
