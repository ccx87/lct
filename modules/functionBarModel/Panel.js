import React, { Component, PropTypes } from 'react'
import { 
     SHOW_DOWNLOADED, 
     SHOW_DOWNLOADING,
     SHOW_CENTER_PANEL,
     SHOW_DIALOG_ALERT,
     SHOW_DIALOG_CONFIRM
} from '../../constants/TodoFilters'
import { EVENTS_CLEAR_DETECT } from '../../constants/ActionsTypes'
import { log } from '../../constants/UtilConstant'


class Panel extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("Panel");		
	}
	searchDownloadFileBtn() {
		
	}
	openDownloadPath(event){
		const getConfig = this.props.getConfig;
		if( getConfig && getConfig.data && getConfig.data ) {
			window.openFileRequest(1, getConfig.data.download_path.value)
		}else{
			this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "下载路径不存在，请先配置下载路径",auto: true,speed: 1500,statu: 0})
		} 
	}
	clearDetectBtn(event) {
        const data = {
      	      type: SHOW_DIALOG_CONFIRM,
      		  title: "清空历史记录",
      		  text: "确认清空历史记录吗？",
      		  code: EVENTS_CLEAR_DETECT       	
        }
        this.props.actions.triggerDialogInfo(data);
	}
    downLoadPass(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.actions.triggerDialogInfo({
          type: SHOW_DIALOG_ALERT,
          text: "此功能正在开发中",
          auto: true,
          speed: 1500,
          statu: 0
        })                
    } 	
	render() {
		const { filter, getConfig } = this.props
		log(this.props)
		return <div className="function-bar">
	             {
	             	 filter === SHOW_DOWNLOADED ?
	             	     <div className="download-fb">
				             <div className="ed">
				                  <div className="abs search" style={{"display":"none"}}>
						               <input className="ed-input" type="text" placeholder="搜索我下载的文件" ref="searchDownloadFileRef"/>
						               <a className="ed-abtn" onClick={this.searchDownloadFileBtn.bind(this)}>搜索<i className="icons icons-18 search-bg"></i></a>
				                  </div>
				                  <p className="p-line">
				                     下载目录：
				                     <span>{getConfig && getConfig.data ? getConfig.data.download_path.value : ""}</span>
				                     <a className="col-lan ml-abtn" href="javascript:;" onClick={this.openDownloadPath.bind(this)}>打开目录</a>
				                  </p>
				             </div>
			             </div>
			         :
			         filter === SHOW_DOWNLOADING ?
			             <div className="download-fb">  
				             <div className="ing">
				                  <div className="abs btn" style={{"display":"none"}}>
						               <a className="ing-abtn" onClick={this.downLoadPass.bind(this)}><i className="icons icons-18 clear-bg"></i>清空</a>
				                  </div>
				                  <div className="p-line">
				                       <a style={{"display":"none"}} className="ing-abtn allStart" onClick={this.downLoadPass.bind(this)}><i className="icons icons-18 all-start-bg"></i>全部开始</a>
				                       <a style={{"display":"none"}} className="ing-abtn allPause" onClick={this.downLoadPass.bind(this)}><i className="icons icons-18 all-pause-bg"></i>全部暂停</a>
				                       <span>下载目录：<span>{getConfig && getConfig.data ? getConfig.data.download_path.value : ""}</span><a className="col-lan ml-abtn" href="javascript:;" onClick={this.openDownloadPath.bind(this)}>打开目录</a></span>
				                  </div>
				             </div>
			             </div>					         
			         :  	
			         filter === SHOW_CENTER_PANEL ?
			             <div className="cneter-panel">
			                  <div className="abs search" style={{"display": "none"}}>
					               <input className="ed-input" type="text" placeholder="搜索已补齐文件" ref="searchDownloadFileRef"/>
					               <a className="ed-abtn" onClick={this.searchDownloadFileBtn.bind(this)}>搜索<i className="icons icons-18 search-bg"></i></a>
			                  </div>
			                  <a className="ml-abtn" href="javascript:;" onClick={this.clearDetectBtn.bind(this)}><i className="icons icons-18 clear-bg"></i>清空历史记录</a>
			             </div>			             
			         :			             
			             null     		             	 
	             }
		     </div>  
	}	
}
Panel.propTypes = {
	
}
export default Panel