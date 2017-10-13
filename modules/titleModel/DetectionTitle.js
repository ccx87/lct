import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { isEmpty, getFontState, log } from '../../constants/UtilConstant'
import { MISSING_ONE_KEY_WARPE, MISSING_KEY_PADDED } from '../../constants/ActionsTypes'
import { GET_FONT_STATE } from '../../constants/DataConstant'

class DetectionTitle extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		warpe_list: []
    	};
    	log("DetectionTitle");		
	}	
	goBackDetectionFontUpload() {
        this.props.actions.eventsInitializationData();
		this.props.actions.initializationData();
	}
	keyPaddedBtn() {
        //一键补齐
        const paddedData = this.props.paddedData;
        let missing_num = 0,
            undownload_num = 0,
            toBeInstalled = [],
            toBeDownloaded = [];   
		if( paddedData ){
            if( paddedData.length > 0 ){
                for( let i = 0; i < paddedData.length; i++ ){
                    const statu = getFontState(paddedData[i].font_state)
                    if( statu == GET_FONT_STATE.not_install ){
                        toBeInstalled.push({font_id:paddedData[i].font_id})
                        missing_num += 1
                    }else if( statu == GET_FONT_STATE.download ){
						toBeDownloaded.push(paddedData[i])
                    	missing_num += 1
                    }else if( statu == GET_FONT_STATE.not_download || statu == GET_FONT_STATE.not_find ){
                    	undownload_num +=1
                    }
                }
            }
		}    
        if( toBeInstalled.length == 0 && toBeDownloaded.length == 0 ){
            if( undownload_num > 0 ){
            	this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: "提示",
                    text: "发现有 "+ undownload_num +" 个字体缺失且无法下载，您可以前往百度尝试下载这些字体。",
                    model: "SINGLE_OK" 
                })
            }else{
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: "提示",
                    text: "该文件已经补齐字体，如果设计软件依旧提示字体缺失，可能是字体版本不同造成的，您可以尝试继续下载同一字体的其它云端匹配的字体。",
                    model: "SINGLE_OK" 
                })                
            }
        	return false
        }
        let logid = null,
            msgText = "";
        if( undownload_num > 0 ){ 
            msgText = '发现有 '+ missing_num +' 个字体缺失、'+ undownload_num +' 个字体无法下载<br />您确定要一键补齐吗？';
        }else{
            msgText = '发现有 '+ missing_num +' 个字体缺失<br />您确定要一键补齐吗？';
        }
        if( toBeDownloaded.length > 0 ){
	        if( this.props.login ){
	            const login = this.props.login;
	            if( login.loginUserData && login.loginUserData.id != null && login.loginUserData.id > 0 ){ 
                    logid =  login.loginUserData.id
	            }
	        } 
	        if( isEmpty(logid) ){
	        	msgText = '发现有 '+ missing_num +' 个字体缺失。因当前处于未登录状态，要下载字体请先登录！'
	        }	        
        }
        const data = {
      			type: SHOW_DIALOG_CONFIRM,
      			title: "提示",
      			text: msgText,
      			code: MISSING_KEY_PADDED,
                codeData: toBeInstalled, //安装
      			logid: logid   	
        }
        if( logid ){
            data["codeData2"] =  toBeDownloaded; //下载                
        }
        this.props.actions.triggerDialogInfo(data)         
	}
	oneKeyWarpeBtn() {
        //一键打包
        event.stopPropagation()
        event.preventDefault()
        const fontData = this.props.fontData,
              paddedData = this.props.paddedData;
        let missing_num = 0,
            undownload_num = 0;
        this.state.warpe_list = [];    
		if( fontData ){
            if( fontData.length > 0 ){
                for( let i = 0; i < fontData.length; i++ ){
                    const statu = getFontState(fontData[i].font_state)
                    if( statu === GET_FONT_STATE.installed || statu === GET_FONT_STATE.not_install ){
                    	if( fontData[i].path.indexOf('.') > -1 ){
                        	this.state.warpe_list.push(fontData[i].path)
                    	}else{
                    		const path = fontData[i].path +'\\'+ fontData[i].file_name;
                    		this.state.warpe_list.push(path)
                    	}
                    }
                }
            }
		}
        if( paddedData ){
            if( paddedData.length > 0 ){
                for( let i = 0; i < paddedData.length; i++ ){
                    const statu = getFontState(paddedData[i].font_state)
                    if( statu == GET_FONT_STATE.not_install ){
                        missing_num += 1
                    }else if( statu == GET_FONT_STATE.download ){
                        missing_num += 1
                    }else if( statu == GET_FONT_STATE.not_download || statu == GET_FONT_STATE.not_find ){
                        undownload_num +=1
                    }
                }
            }
        }            
        if( this.state.warpe_list.length <=  0 ){
        	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "该文件没有发现可以打包的字体",auto: true,speed: 1500,statu: 0})
        	return false
        }
        let msgText = "",
            originalFile = null;
        if( undownload_num > 0 ){
            if( missing_num > 0 ){ 
                msgText = '发现有'+ missing_num +'个字体缺失、'+ undownload_num +'个字体无法下载。您确定要一键打包吗？';
            }else{
                msgText = '发现有'+ undownload_num +'个字体无法下载<br />您确定要一键打包吗？';
            }
        }else{
            if( missing_num > 0 ){
                msgText = '发现有'+ missing_num +'个字体缺失<br />您确定要一键打包吗？';
            }else{
                msgText = '您确定要一键打包吗？';
            }
        }   
        if( this.props.openFilePath_0 && this.props.openFilePath_0.data ){
            originalFile = this.props.openFilePath_0.data
        }		    
        const data = {
      			type: SHOW_DIALOG_CONFIRM,
      			title: "提示",
      			text: msgText,
                checkBox: "同时打包原文件",
      			code: MISSING_ONE_KEY_WARPE,
                originalFile: originalFile, 
      			codeData: this.state.warpe_list        	
        }
        this.props.actions.triggerDialogInfo(data)  		
	}
	render() {
		const { listData, paddedData, mode } = this.props
		return <div className="detection-title">
                   {
                       mode == 2 ?
                           null 
                       :
                           <button type="button" className="abtn go-back" onClick={this.goBackDetectionFontUpload.bind(this)}>返回</button>   
                   }
		           
		           <button type="button" className="abtn key-padded" onClick={this.keyPaddedBtn.bind(this)}>
		              <i className="icons icons-18 install-all-bg"></i>
		              <span className="text">一键补齐</span>
		           </button>
		           <button type="button" className="abtn key-warpe" onClick={this.oneKeyWarpeBtn.bind(this)}>
		              <i className="icons icons-18 all-key-package"></i>
		              <span className="text">字体打包</span>
		           </button>
		           <span className="text">
                      检测结果：
                      {
                          listData.length > 0 ?
                              <span>
                                   本文件包含<span className="col-lan sp-1">{listData.length}种</span>字体
                                   {
                                       paddedData && paddedData.length > 0 ?
                                           <span className="text" ref="missimgMsgRef">，本地缺少<span className="col-red sp-1"><span ref="diffNumRef">{paddedData.length}</span>种</span>字体</span>
                                       :
                                           <span className="col-6">，均已安装</span>    
                                   }                               
                              </span>
                           : 
                              <span>该文件未检测到字体</span>    
                      }
                   </span>   
		       </div>
	}
    componentWillReceiveProps(nextProps) {
		//打开浏览器，并选择了文件夹，打包开始。
		if( nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){      
			if( nextProps.openFilePath_3.data ){
				const btn_Elem = document.querySelector('.key-warpe'),
				      text_Elem = btn_Elem.querySelector('.text'),
				      i_Elem = btn_Elem.querySelector('i'),
				      data = {
						   file_list: this.state.warpe_list,
						   file_name: nextProps.fonts.missingPsFileDetectData ? nextProps.fonts.missingPsFileDetectData.file_name.split('.')[0] : 'lianty',
						   path: nextProps.openFilePath_3.data +'\\'
					  };
				btn_Elem.disabled = true;
				i_Elem.className = 'loading4-bg';
                text_Elem.innerHTML = '正在打包';
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在打包中，请稍候...",auto: false})				  
                setTimeout(() => {
                    this.props.actions.oneKeyWarperRequest(data)
				}, 50)
			}
		}
		//一键补齐
		if( nextProps.keyPadded && nextProps.keyPaddedLastUpdated !== this.props.keyPaddedLastUpdated ){
				const n_padded = nextProps.keyPadded;
                if( n_padded.codeData && n_padded.codeData.length > 0 ){
                	setTimeout(() => {
						this.props.actions.installFontAdd(n_padded.codeData)
                	}, 30)                    
                }
                if( n_padded.codeData2 && n_padded.codeData2.length > 0 ){
	            	const tr_Elem = document.querySelectorAll('.detection-table .table li .col-line-r .col-line');
                    for( let i = 0; i < n_padded.codeData2.length; i++ ){
                    	for( let j = 0; j < tr_Elem.length; j++ ){
                    		const fid = tr_Elem[j].querySelector('.hidden.font_id').value,
                    		      btn_Elem = tr_Elem[j].querySelector('.download-btn'),
                    		      progress_Elem = tr_Elem[j].querySelector('.progress-bar');
                            log(fid, n_padded.codeData2[i])      
                    		if( n_padded.codeData2[i].font_id == fid ){
                                progress_Elem.style.display = 'block'
                                btn_Elem.style.display = 'none'
                    		}
                    	}
                    }   
                    log(n_padded)            	
                	setTimeout(() => {
                        const idArray = n_padded.codeData2.map(item => {
                            return item.font_id
                        })
                        const fontsArray = n_padded.codeData2.map(item => {
                            item['download_state'] = -1
                            return item
                        })
						this.props.actions.addGetDownloadFont(idArray, fontsArray)
                	}, 100)
                }                					  		
		}
	}
	shouldComponentUpdate(nextProps, nextState){
		if( nextProps.keyWarper && nextProps.keyWarperLastUpdated !== this.props.keyWarperLastUpdated ){
			const btn_Elem = document.querySelector('.key-warpe'),
			      text_Elem = btn_Elem.querySelector('.text'),
			      i_Elem = btn_Elem.querySelector('i');
			btn_Elem.disabled = false;
			text_Elem.innerHTML = '一键打包';
			i_Elem.className = 'icons icons-18 all-key-package';			      			
			if( nextProps.keyWarper.data ){
				this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "一键打包成功",auto: true,speed: 1500,statu: 1})
			}else{
				this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "一键打包失败",auto: true,speed: 1500,statu: 0})
			}
			return false
		}			
		return true
	}
}
export default DetectionTitle
const mapStateToProps = (state) => {
	return {
  		keyWarper: state.events.keyWarper,
  		keyWarperLastUpdated: state.events.keyWarperLastUpdated,

        keyPadded: state.events.keyPadded,
  		keyPaddedLastUpdated: state.events.keyPaddedLastUpdated,

        openFilePath_3: state.events.openFilePath_3,
        openFile3LastUpdate: state.events.openFile3LastUpdate       
	}
}
export default connect(
  mapStateToProps
)(DetectionTitle)

