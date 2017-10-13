import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { IMG_EXTENSION, IMG_MINI_TYPE } from '../../constants/AcceptConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { PAGE_TYPE } from '../../constants/DataConstant'
import { log, isEmpty, formatSize, objClone } from '../../constants/UtilConstant'
import { FILE_MINI_TYPE } from '../../constants/AcceptConstant'


class DetectionFontUpload extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		uploadObj: null,
    		detection: 0 // 0表示检测前， 1表示检测中，2表示检测失败
    	};
    	log("DetectionFontUpload");		
	}
	fileOpen() {
		this.props.actions.openFileRequest(0)
	}
  	openUrl(url, event){
        window.openFileRequest(4, url);
        return false;
  	}		
	render() {
		const { fonts, actions, mode } = this.props
		const { detection } = this.state
		let classes;
		if( mode == 1 ){
			classes = "upload-opt abs"
		}else if( mode == 2 ){
			classes = "mode-2-upload-opt"
		}
		return <div className="detection-font-upload" style={{"top":"-10px"}}>
			        <div className={classes}>
			            <div className="drag-here">
			                 <div className="dh">
			                     {
			                     	 detection == 0 ? 
					                     <div className="drag-div table-cell">
								            {
								            	mode == 2 ?
								            	   <h2 className="search-title">字体补齐</h2>
								            	:
								            	   null   
								            }					                     
					                     	<p>拖拽文件到此处</p>
					                     	<p>自动检测文件字体，一键补齐文件内所缺字体</p>
					                     	<p>（识别图片上的字体，请前往
					                     	    <a href="javascript:;" className="col-lan" onClick={this.openUrl.bind(this, "www.qiuziti.com")}>求字体网www.qiuziti.com</a>）
					                     	</p>
							                <div className="stupload" id="fileOpenBtn" ref="fileOpenBtnRef" onClick={this.fileOpen.bind(this)}>
											    打开文件
							                </div>					                     	 
					                     </div>
					                 :
					                 detection == 1 ?
					                     <div className="drag-div table-cell">
					                     	 <img className="drag-laod" src="../public/compress/img/loading2.gif" draggable="false"/>
					                     	 <span className="drag-text">正在努力为您检测中...</span>
					                     </div>
					                 :
					                 detection == 2 ?
					                     <div className="drag-div table-cell">
								            {
								            	mode == 2 ?
								            	   <h2 className="search-title">字体补齐</h2>
								            	:
								            	   null   
								            }					                     
					                     	 <p>检测失败。</p>
					                     	 <p>拖拽文件到此处进行检测！</p>
					                     	 <p>（识别图片上的字体，请前往
					                     	     <a href="javascript:;" className="col-lan" onClick={this.openUrl.bind(this, "www.qiuziti.com")}>求字体网www.qiuziti.com</a>）
					                     	 </p>					                     	 
							                 <div className="stupload" id="fileOpenBtn" ref="fileOpenBtnRef" onClick={this.fileOpen.bind(this)}>
											     打开文件
							                 </div>						                     	 
					                     </div>
					                 :
					                     <div className="drag-div table-cell">
								            {
								            	mode == 2 ?
								            	   <h2 className="search-title">字体补齐</h2>
								            	:
								            	   null   
								            }					                     
					                     	 <p>拖拽文件到此处</p>
					                     	 <p>自动检测文件字体，一键补齐文件内所缺字体</p>
					                     	 <p>（识别图片上的字体，请前往
					                     	     <a href="javascript:;" className="col-lan" onClick={this.openUrl.bind(this, "www.qiuziti.com")}>求字体网www.qiuziti.com</a>）
					                     	 </p>					                     	 
							                 <div className="stupload" id="fileOpenBtn" ref="fileOpenBtnRef" onClick={this.fileOpen.bind(this)}>
											     打开文件
							                 </div>						                     	 
					                     </div>					                         					                      					                         			                     	 
			                     }
				                 <i className="icons icons-40 drag-bg drag-bg-1"></i>
				                 <i className="icons icons-40 drag-bg drag-bg-2"></i>
				                 <i className="icons icons-40 drag-bg drag-bg-3"></i>
				                 <i className="icons icons-40 drag-bg drag-bg-4"></i>
			                 </div>
			            </div>
			            {
			            	mode == 1 ?
			            	    <div className="drag-other"><i className="icons drag-other-bg"></i></div>
			            	:
			            	    null    
			            }
			        </div>		
		       </div>
	}
	componentDidMount() {
		if( !this.props.fonts.common || (this.props.fonts.common && this.props.fonts.common.PageName !== this.props.type.PageName) ){
			log("开启拖拽监听")
            if( this.props.mode == 1 ){
            	this.props.actions.asyncDragdropRequest()//重新开启拖拽监听	
            }else{
            	this.props.actionsST.startGetDragDropFile('FONT')//重新开启拖拽监听
            }
		}   	
	}
	componentWillReceiveProps(nextProps) {
		const n_f_m = nextProps.openFilePath_0,
		      n_ps = nextProps.fonts.missingPsFileDetectData;
		if(  n_f_m && nextProps.openFile0LastUpdate !== this.props.openFile0LastUpdate ){
			if( n_f_m.error != 'nothing was selected!'){
			    if( n_f_m.data ){
			    	let types = FILE_MINI_TYPE.split(','),
			    		type = /\.[^\.]+$/.exec(n_f_m.data),
			    	    falg = false;	
			    	if( type ){    
			    	    if( types.indexOf(type[0]) > -1 ){
			    	    	falg = true;
			    	    }		    	    
			    	}
			    	if( !falg ){
			    		this.setState({detection: 0})
			    		this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '该文件格式不支持<br />支持格式：AI、CDR、PSD、PDF',auto: true,speed: 3000,statu: 0})
			            log("重新开启拖拽监听1")
			            if( nextProps.mode == 1 ){
			            	this.props.actions.asyncDragdropRequest()//重新开启拖拽监听	
			            }else{
			            	this.props.actionsST.startGetDragDropFile('FONT')//重新开启拖拽监听
			            }		    		
			    	    return false;
			    	}else{ 
			            this.setState({detection: 1})
			            if( nextProps.mode == 2 ){
			            	//从搜索中心补齐字体
			            	setTimeout(() => {
                            	this.props.actions.searchfont({data:n_f_m.data, type: 'MissingMain'})
                        	}, 1000)
						}else {
							setTimeout(() => {
								this.props.actions.psFileDetectRequest(n_f_m.data, objClone(this.props.type))
							}, 1000)
						}
					}		             
			    }else{
		            this.setState({detection: 2})
			    }				
			}else{
	            this.setState({detection: 0})
			}
   	    }
        if( n_ps && n_ps.error_code != 0 ){
            this.setState({detection: 0})
            let errorStr = n_ps.error;
            if( isEmpty(errorStr) ){
            	errorStr = '文件检测失败(代码：'+ n_ps.error_code +')'
            }
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: errorStr,auto: true,speed: 3000})
            setTimeout(() => {
				log("重新开启拖拽监听2")
	            if( nextProps.mode == 1 ){
	            	this.props.actions.asyncDragdropRequest()//重新开启拖拽监听	
	            }else{
	            	this.props.actionsST.startGetDragDropFile('FONT')//重新开启拖拽监听
	            }           	
				this.props.actions.initializationLoadingData();
            },1000)
            return false;            
        }            
	}
	componentDidUpdate(nextProps, nextState) {

	}
	componentWillUnmount() {
		try{
			//字体助手关闭
        	window.stopAsyncGetDragDropFileRequest() //关闭拖拽监听
    	}catch(e){}
	}				
}
const mapStateToProps = (state) => {
	return {
		openFilePath_0: state.events.openFilePath_0,
		openFile0LastUpdate: state.events.openFile0LastUpdate
	}
}
export default connect(
  mapStateToProps
)(DetectionFontUpload)