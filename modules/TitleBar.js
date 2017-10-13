import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { SHOW_DIALOG_CLFF, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'
import { log } from '../constants/UtilConstant'
import { PAGE_TYPE } from '../constants/DataConstant'

class TitleBar extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		isScan: {
				temp: 0,
				text: ''    			
    		},
    		scanTimeout: null
    	};
    	log("TitleBar");		
	}
	openSysFontDir(event) {
        event.stopPropagation()
        event.preventDefault()		
  		try{   
             window.openFileRequest(1, 'C:\\Windows\\Fonts') 
        }catch(e){   
			this.props.actions.triggerDialogInfo({
				type: SHOW_DIALOG_ALERT,
				text: "请确定是否存在该目录",
				auto: true,
				speed: 1500,
				statu: 0
			})              
        }		
	}
	openStorageDirectory(page, event){
		const getConfig = this.props.getConfig;
		if( getConfig && getConfig.data && getConfig.data ) {
			if( page === PAGE_TYPE.Font_Assistant.font_fill.PageName ){
				window.openFileRequest(1, getConfig.data.download_path.value)
			}else if( page === PAGE_TYPE.Font_Assistant.recycle_bin.PageName ){
				window.openFileRequest(1, getConfig.data.download_path.value)
			}
		}else{
			this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "路径不存在，请先配置路径",auto: true,speed: 1500,statu: 0})
		} 
	}
	goBackDetectionFontUpload() {
		this.props.actions.initializationData();
	}	
	scanMachineBtn(event){
		this.setState({
			isScan: {
				temp: 1,
				text: '正在更新本地字体库，请稍候...'
			}
		})
        window.setScanPathRequest()
        this.state.scanTimeout = setTimeout(() => {
			this.props.actions.isScanFinishedRequest(); 
        }, 100)
	}
	render() {
		const { data, onRecordItem, actions, getConfig, fonts } = this.props
		const { isScan } = this.state
		return <div className="title-bar">
		           {
		           	   data.type.PageName != PAGE_TYPE.Font_Assistant.search_font.PageName ?
		           	      <span className="title">{data.type.text}</span>
		           	   :
		           	      <span className="font-size-14">搜索 “ <span className="col-lan font-weight7">{data.type.text}</span> ” </span>   
		           }
		           {
		           	   data.type.PageName == PAGE_TYPE.Font_Assistant.local_font.PageName ?
				           <span>
				               <span>{data.dataLength}个字体</span>，
					           <a className="a-line" href="javascript:;" onClick={() => actions.triggerDialogInfo({type: SHOW_DIALOG_CLFF})}>选择扫描目录</a>
					           <span className="sp-line" style={{"display":"none"}}>或</span>
					           <a className="a-line" style={{"display":"none"}} onClick={this.scanMachineBtn.bind(this)}>扫描本机</a>					           
					           {
					           	   isScan.temp == 1 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-24 loading-gif"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>
					           	   	:  
					           	   isScan.temp == 2 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-18 loading-ok-red-bg"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>					           	   	  
					           	   :
					           	      null
					           }
				           </span>
				       :
				       data.type.PageName == PAGE_TYPE.Font_Assistant.installed_font.PageName ?
				           <span>
				               <span>{data.dataLength}个字体</span>，
					           <a className="a-line" href="javascript:;" onClick={this.openSysFontDir.bind(this)}>打开系统字体目录</a>
				           </span>
				       :
				       data.type.PageName == PAGE_TYPE.Font_Assistant.my_collection.PageName ?
				           <span>
				               <span>{data.dataLength}个字体</span>				           
				           	   {
					           	   isScan.temp == 1 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-24 loading-gif"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>
					           	   	:  
					           	   isScan.temp == 2 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-18 loading-ok-red-bg"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>			           	   	  
					           	   :
					           	      null
				           	   }   
			           	   </span>   
			           :
			           data.type.PageName == PAGE_TYPE.Font_Assistant.recycle_bin.PageName ?
				           <span>
				               <span>{data.dataLength}个字体</span>，
					           <a className="a-line" href="javascript:;" onClick={this.openStorageDirectory.bind(this, data.type.PageName)}>打开目录</a>
                               {
					           	   isScan.temp == 1 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-24 loading-gif"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>
					           	   	:  
					           	   isScan.temp == 2 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-18 loading-ok-red-bg"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>			           	   	  
					           	   :
					           	      null                               	
                               } 				           
				           </span>
			           : 
				       data.type.PageName == PAGE_TYPE.Font_Assistant.uninstall_font.PageName ?
				           <span>
				               <span>{data.dataLength}个字体</span>，
					           <a className="a-line" href="javascript:;" onClick={() => actions.triggerDialogInfo({type: SHOW_DIALOG_CLFF})}>选择目录</a>
					           <span className="sp-line" style={{"display":"none"}}>或</span>
					           <a className="a-line" style={{"display":"none"}} onClick={this.scanMachineBtn.bind(this)}>扫描本机</a>
				           </span>
				       :			                
				       data.type.PageName == PAGE_TYPE.Font_Assistant.font_fill.PageName ?
			               <span>
			                  <span className="loca">下载目录：{getConfig && getConfig.data ? getConfig.data.onewrapper_path.value : ""}</span>
			                  <a className="col-lan ml-abtn" href="javascript:;" onClick={this.openStorageDirectory.bind(this, data.type.PageName)}> 打开目录</a>
			               </span>
			           :   
				       data.type.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ?
				           <span>
				               {
				               	   data.dataLength > 0 ?
				               	        <span className="font-size-14 col-3">，找到 <span className="col-red">{data.dataLength}</span> 个字体</span>
				               	   :
				               	        null       
				               }
					           {
					           	   isScan.temp == 1 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-24 loading-gif"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>
					           	   	:  
					           	   isScan.temp == 2 ?
					           	   	  <p className="abs msg-scan">
					           	   	     <i className="icons icons-18 loading-ok-red-bg"></i>
					           	   	     <span>{isScan.text}</span>
					           	   	  </p>					           	   	  
					           	   :
					           	      null
					           }
				           </span>
				       :
				           null				               			                				          				               				               		           	   
		           }
		           {
		           	  data.type.PageName == PAGE_TYPE.Font_Assistant.font_fill.PageName && fonts.missingPsFileDetectData && fonts.missingPsFileDetectData.error_code == 0 ?
		           	      <a style={{"display":"none"}} className="abs missing-back" onClick={this.goBackDetectionFontUpload.bind(this)}>返回</a>
		              :
		                  null
		           }
		           {
		           	   data.type.PageName == PAGE_TYPE.Font_Assistant.history_record.PageName ?
		           	       	data.name != null ?   
				               <span>
				                  <span className="text">{data.name}</span>
				                  <a className="back abs" href="javascript:;" onClick={ () => onRecordItem() }>《返回历史列表</a>
				               </span>
				            :
				               null   
			           :
			               null    		           	       
		           }
		       </div>
	}
	componentWillReceiveProps(nextProps){
        if( nextProps.scanFinished && nextProps.scanFinishedLastUpdated !== this.props.scanFinishedLastUpdated ){
        	const n_c = nextProps.scanFinished
        	if( n_c.data ){
				this.setState({
					isScan: {
						temp: 2,
						text: '更新完成'
					}
				})
				//5秒后关闭提示
				setTimeout(() => {
					this.setState({
						isScan: {
							temp: 0,
							text: ''
						}
					})					
				}, 5000)
				//重新请求新数据
				this.props.fonts.common.offset = 0;
				this.props.fonts.common.temp = 1;
				this.props.actions.getFontRequest(this.props.fonts.common);				               
        	}else{
        		clearTimeout(this.state.scanTimeout)
				this.setState({
					isScan: {
						temp: 1,
						text: '正在更新本地字体库，请稍候...'
					}
				})        		
        		this.state.scanTimeout = setTimeout(() => {
					this.props.actions.isScanFinishedRequest(); 
        		}, 1000)
        	}
        }
	}
	componentWillUnmount() {
		if( this.state.scanTimeout ){
			clearTimeout(this.state.scanTimeout)
		}
	}
}
const mapStateToProps = (state) => {
	return {
		scanFinished: state.events.scanFinished,
		scanFinishedLastUpdated: state.events.scanFinishedLastUpdated
	}
}
export default connect(
  mapStateToProps
)(TitleBar)
