import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { DOWNLOAD_TAB, PAGE_TYPE } from '../../../constants/DataConstant'
import { SHOW_CENTER_PANEL, SHOW_DIALOG_ALERT } from '../../../constants/TodoFilters'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { log } from '../../../constants/UtilConstant'

import TitleBar from '../../../modules/TitleBar'
import Panel from '../../../modules/functionBarModel/Panel'
import RecordTable from '../../../modules/tableModel/RecordTable'
//缺失字体--历史记录
class HistoryRecord extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: false,
    		file: null,
    		detectionSuccess: true
    	};
    	log("MissingFont--历史记录");		
	}
	recordItem(data) {
		this.setState({
			file: data,
			filter: !this.state.filter
		})
	}
	render() {
		const { fonts, actions, type } = this.props
		const { filter, file, detectionSuccess } = this.state
		const onRecordItem = this.recordItem.bind(this)
		const titleData = {
			name: file != null ? file.name : null,
			type: type
		}
		return <div className="history-record">
	            	<TitleBar 
		               data={titleData} 
		               onRecordItem={onRecordItem} {...this.props}/>
            	   <div className="record-list" style={{"height":"calc(100% - 43px)"}}> 
	                   { 
	                   	    fonts.missingHostoryRecord ?
		               	   		fonts.missingHostoryRecord.data && fonts.missingHostoryRecord.data.length > 0 ?
		               	   		    <div style={{"height": "100%"}}>
			               	   		    <Panel filter={SHOW_CENTER_PANEL} {...this.props}/>
			            	   		    <RecordTable {...this.props} />
		            	   		    </div>
		            	   		:
		               	      	    <div className="abs no-data col-6">
		               	      	       <p className="flex">暂无历史记录</p>
		               	      	    </div>
		               	    :
		            			loadingHtml(true)   	                                             
                       }
            	   </div>
		       </div>
	}
	componentDidMount() {
		setTimeout(() => {
			this.props.actions.getDetectRequest(this.props.type)
		},30)
	}
	componentWillReceiveProps(nextProps){
        if( nextProps.clearDetect && nextProps.clearDetectLastUpdated !== this.props.clearDetectLastUpdated ){
        	if( nextProps.clearDetect.data ){
        		this.props.actions.getDetectRequest(this.props.type)
        	}else{
        		this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "清空文件失败",auto: true,speed: 1500,statu: 0})
        	}
        }
	}
	componentWillUnmount(){
		try{
			log('退出历史记录页面并清空数据');
	        this.props.actions.eventsInitializationData();
			this.props.actions.initializationData();			
    	}catch(e){}    			
	}	
}
HistoryRecord.defaultProps = {
	type:PAGE_TYPE.Font_Assistant.history_record
}
const mapStateToProps = (state) => {
	return {       
        clearDetect: state.events.clearDetect, 
		clearDetectLastUpdated: state.events.clearDetectLastUpdated
	}
}
export default connect(
  mapStateToProps
)(HistoryRecord)