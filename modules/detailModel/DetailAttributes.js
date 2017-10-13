import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { clientHeight } from '../../constants/DomConstant'
import { getFileSize, isEmpty, log, getFontState } from '../../constants/UtilConstant'
import { GET_FONT_STATE } from '../../constants/DataConstant'
import { getmCustomScrollbar } from '../../constants/EventsConstant'

class DetailAttributes extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DetailAttributes");		
	}
	renderNoSelectItem(text) {
	    return (
	        <div className="no-select">
	            <div className="abs">
		            <p className="p-1"><i className="icons icons-60 no-check-bg"></i></p>
		            <p className="p-2">{text}</p>
	            </div>
	        </div>
	    )
	}	
	render() {
		const { attributes, checkIds } = this.props
		let state = 1
		if( attributes ){ 
			state = getFontState(attributes.font_state);
		}    
		return <div className="detail-info">
		            <p className="title">属性</p>
		            {
		            	!isEmpty(attributes) ?
		            	     attributes == 'more item'?
		            	         checkIds && checkIds.length > 0 ?
		            	         	this.renderNoSelectItem("已选中多个字体")
		            	         :
                                    this.renderNoSelectItem("未选中字体") 
		            	     :
		            	         Object.getOwnPropertyNames(attributes).length > 1 ?
									 <dl className="scllorBar_detailAttributes" ref="clientHeightRef" style={{"height":"calc(100% - 39px)"}}>
									    <dt style={{"paddingTop": "10px"}}></dt>
									    <dt style={{"display": state === GET_FONT_STATE.installed || state === GET_FONT_STATE.not_install ? "block": "none"}}>文件名称</dt> 
									    <dd style={{"display": state === GET_FONT_STATE.installed || state === GET_FONT_STATE.not_install ? "block": "none"}}>{isEmpty(attributes.file_name) ? '-' : attributes.file_name}</dd> 
										<dt>字体名称</dt> 
										<dd>{isEmpty(attributes.family) ? '-' : attributes.family}</dd> 
									    <dt style={{"display": state !== GET_FONT_STATE.installed && state !== GET_FONT_STATE.not_install ? "block": "none"}}>字体格式</dt> 
									    <dd style={{"display": state !== GET_FONT_STATE.installed && state !== GET_FONT_STATE.not_install ? "block": "none"}}>{isEmpty(attributes.file_type) ? '-' : attributes.file_type}</dd> 									
										<dt>文件大小</dt> 
										<dd>{!isEmpty(attributes.file_size) && attributes.file_size > 0 ? getFileSize(attributes.file_size, 2) : '-'}</dd> 
										<dt>PostScript名称</dt> 
										<dd>{isEmpty(attributes.postscript_name) ? '-' : attributes.postscript_name}</dd>
										<dt>风格</dt> 
										<dd>{isEmpty(attributes.font_style) ? '-' : attributes.font_style}</dd>
										<dt>语言</dt> 
										<dd>{isEmpty(attributes.language) ? '-' : attributes.language}</dd> 
										<dt>版本</dt> 
										<dd>{isEmpty(attributes.version) ? '-' : attributes.version}</dd>
										<dt>字符集</dt> 
										<dd>{isEmpty(attributes.charset) ? '-' : attributes.charset}</dd>
										<dt>字符数</dt> 
										<dd>{isEmpty(attributes.char_size) ? '-' : attributes.char_size}</dd> 
										<dt>版权</dt> 
										<dd>{isEmpty(attributes.copyright) ? '-' : attributes.copyright}</dd> 														 
									    <dt style={{"paddingTop":"10px"}}></dt>
									</dl>
								:
								    this.renderNoSelectItem("未选中字体") 	
					    :
					        this.renderNoSelectItem("未选中字体")			            	
		            }
			            
			  </div>
	}
	componentDidUpdate(nextProps, nextState) {
		if( this.refs.clientHeightRef ){
			//clientHeight(this.refs.clientHeightRef,this.props.resize.h,this.props.less)
			if( $('.scllorBar_detailAttributes').hasClass('mCustomScrollbar') ){
				getmCustomScrollbar($('.scllorBar_detailAttributes'), null, 'update')
			}else{
				getmCustomScrollbar($('.scllorBar_detailAttributes'))
			}
		}    		
	}				
}
const mapStateToProps = (state) => {
	return {
		attributes: state.events.attributes,
		attributesLastUpdated: state.events.attributesLastUpdated,

		checkIds: state.events.checkIds,
		checkLastUpdated: state.events.checkLastUpdated
	}
}	
export default connect(
  mapStateToProps
)(DetailAttributes)
