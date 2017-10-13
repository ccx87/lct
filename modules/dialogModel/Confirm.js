import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { absVerticalCenter } from '../../constants/DomConstant'
import { WIMDOW_UNINSTALL_FONT_DEL, MISSING_ONE_KEY_WARPE, MISSING_KEY_PADDED, EVENTS_CLEAR_DETECT, 
	     RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST } from '../../constants/ActionsTypes'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_LOGIN_LAYER, NOT_LOGIN_UNACTIVE, DO_NOT_LOGIN, SMART_MENU_DELETE_FRIEND, 
	     SMART_MENU_ADD_BLACKLIST, SMART_MENU_DELETE_SESSION,UPDATE_FILE_NAME,FILE_TYPE_VERIFY,SCAN_STOP_ACTIVE, 
	     PERMANENT_DELECTE_FILE, DELETE_FILE_RECYCLE_BIN, LOOP_SCAN_ACTIVE, SCAN_DRIVE_MSG,
	     SCAN_RESTART_LOCAL_SERVICE, SHOW_LOCAL_FILES_SCAN, JUMP_PAGE } from '../../constants/TodoFilters'
import { log, isEmpty, dragDrop, addClass, removeClass, objClone, cloneObj } from '../../constants/UtilConstant'

const doc = document;
/* 弹出层--信息确认 */
class Confirm extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		isCheck: false,
    		auto: false,
    		speed: 0,
    		timer: null,
    		btnTimer: null,
    		isScanWait: false
    	};
    	log("Confirm");		
	}
	checkBtn(event){
        this.setState({
        	isCheck: !this.state.isCheck
        })
	}
	alertTip(temp,text) {
		//好友中心---引用回调
        if( this.props.dialogData && this.props.dialogData.code == SMART_MENU_DELETE_SESSION ){
        	this.props.Fn.updateLocalSession(this.props.dialogData.codeData.account, this)
        } 		
		let statu = 0;
		if(temp){
		    statu = 1
		}
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: text,auto: true,speed:1500,statu: statu})
	}	
	confirmBtn(data, temp) {
		if( data == null || data.code == null ){
			return
		}
		switch(data.code){
            case DO_NOT_LOGIN:
                if( data.model && data.model == 'GO_LOGIN' ){
                	this.props.actions.triggerDialogInfo({type:SHOW_DIALOG_LOGIN_LAYER})
                }else{
                	this.props.actions.triggerDialogInfo(null)
            	}
	  	  	  	break 			
            case NOT_LOGIN_UNACTIVE:
                this.props.actions.triggerDialogInfo({type:SHOW_DIALOG_LOGIN_LAYER})
                break
			case WIMDOW_UNINSTALL_FONT_DEL:
			    if(data.codeData == null){
			   	   return
			    }
			    if( data.element ){
			    	data.element.disabled = true;
			    	data.element.querySelector('.btn-text').innerHTML = '卸载中'
			    }
			    if( data.codeData && data.codeData.length > 0 ){
			    	for( let i = 0; i < data.codeData.length; i++ ){
			    		if( data.codeData[i].is_delete_file ){
			    			data.codeData[i].is_delete_file = this.state.isCheck
			    		}else{
			    			data.codeData[i]['is_delete_file'] = this.state.isCheck
			    		}
			    	}
			    }
			    setTimeout(() => {
					this.props.actions.uninstallFontDel(data.codeData)
			    },50)
			    break 
            case MISSING_ONE_KEY_WARPE:
			    if( data.codeData && data.codeData.length > 0 && data.originalFile ){
			    	let has_file = false,
			    	    file_index = 0;
			    	for( let j = 0; j < data.codeData.length; j++ ){
		    			if( data.codeData[j] == data.originalFile ){
                            has_file = true;
                            file_index = j;
                            break; 
		    			}
			    	}
			    	if( this.state.isCheck ){
			    		if( !has_file ){
                        	data.codeData.push(data.originalFile)
                    	}
			    	}else{
			    		if( has_file ){
                            data.codeData.splice(file_index, 1);
			    		}
			    	}
			    }
                this.props.actions.openFileRequest(3)
                this.props.actions.triggerDialogInfo(null)
	  	  	  	break;              
            case MISSING_KEY_PADDED:
                //log('正在补齐中')
                this.props.actions.missingKeyPadded(data)
                this.props.actions.triggerDialogInfo(null)
                break;

            case EVENTS_CLEAR_DETECT:
                this.props.actions.clearDetectRequest()
                this.props.actions.triggerDialogInfo(null)   
                break; 

            case RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST:
			    //左侧树形列表删除扫描目录
			    //先删除后DOM操作
			    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "该扫描目录正在取消中...",auto: false})
			    const delElem = data.codeData.elem,
			          scanPathArray = [];
                this.props.actions.eventsUnCheck(delElem);
                //开启时间戳，不然上面的DOM操作还没完成。
                setTimeout(() => {
	                const updataItemDom = () => {
				        const startDom = $('#FirstItemP').closest('li').children('div.submenu'), 
				              p_Elem = startDom.children('ul').children('li').children('p.item-p');	
		                //获取需要扫描的路径 ----修改：当前层级     
		                const nextAddFn = (next_Elem) => {
		                    next_Elem.each((indexNext, elemNext) => {
		                    	const path = $(elemNext).data('path');
		                    	//jq---hasClass判断两个及以上的类名是有顺序之分的
		                        if( path !== delElem.path && $(elemNext).hasClass('hasScanPath checked') ){
		                            scanPathArray.push(path);
		                            return true;
		                        }else{
		                            const next_p_elem = $(elemNext).siblings('div.submenu').children('ul').children('li').children('.item-p');
		                            if( next_p_elem.length > 0 ){	                            	
		                                nextAddFn(next_p_elem)
		                            }
		                        }
		                    })
		                }      
		                p_Elem.each((indexP, elemP) => {
		                	const path = $(elemP).data('path');
		                	//jq---hasClass判断两个及以上的类名是有顺序之分的
		                    if( path !== delElem.path && $(elemP).hasClass('hasScanPath checked') ){  
		                        scanPathArray.push(path);
		                        return true;
		                    }else{
		                        const next_p_elem = $(elemP).siblings('div.submenu').children('ul').children('li').children('.item-p');
	                            if( next_p_elem.length > 0 ){	
		                            //递归                            	
	                                nextAddFn(next_p_elem)
	                            }
		                    }
		                })
		            } 
		            updataItemDom()
	                try{
	                	const data = {add: scanPathArray, del: [delElem.path]}
	                    const result = window.delScanPath(JSON.stringify(data))
	                    const json_result = $.parseJSON(result)
	                    log('树形菜单取消扫描目录：出参和回参')
	                    log(data)
	                    log(json_result)
	                    if( json_result && json_result.error_code === 0 ){
	                    	//重新获取配置信息，每取消一次重新配置一次，列表数据会重新获取最新的，比如扫描个数、扫描状态
	                    	//this.props.actions.eventsUnCheck(delElem);
	                    	this.props.actions.getConfigInfo()
	                    	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "扫描目录取消成功",auto: true,speed:1500,statu: 1})
	                    }else{
	                    	this.props.actions.eventsCheck(delElem);
	                    	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(json_result.error) ? json_result.error : "扫描目录取消失败(代码："+ json_result.error_code +")",auto: true,speed:1500,statu: 0})
	                    }
	                }catch(e){
	                	this.props.actions.eventsCheck(delElem);
	                	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "扫描目录取消失败",auto: true,speed:1500,statu: 0})
	                }
                }, 1000)	                                                     
                break;
            case PERMANENT_DELECTE_FILE:    
            case DELETE_FILE_RECYCLE_BIN:
                //删除文件
                const delCode = data.codeData;
                if( delCode && delCode.del && delCode.del_scan && !isEmpty(delCode.delType) ){  
			    	const delObj = {del: {del: delCode.del}, del_scan: {del_scan: delCode.del_scan}, delType: delCode.delType};           
	                this.props.actionsLF.asyncDeleteScanDocsRequest(delObj)
	                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "删除中，请稍候...",auto: false})
            	}else{
            		this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "删除失败",auto: true,speed:1500,statu: 0})
            	}
                break;
            case SMART_MENU_DELETE_FRIEND:
                //删除好友
                this.props.Fn.deleteFriend(data.codeData.account, this)
                break;
            case SMART_MENU_ADD_BLACKLIST:
                //添加到黑名单
                this.props.Fn.markInBlacklist(data.codeData.account, true, this)
                break; 
            case SMART_MENU_DELETE_SESSION:
                //删除会话
                this.props.Fn.deleteSession(data.codeData.account, this)
                //this.props.Fn.deleteLocalSessionDone(data.codeData.account, this)
                break;
            case SCAN_STOP_ACTIVE:
                //取消本次扫描
                //此方法扫描改版后(6月1日)没有在使用
                if( this.props.actionsLF ){
                	this.props.actionsLF.asyncStopScanDocsRequest(data.codeData) 
                } 
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '正在取消本次扫描，请稍候...',auto: false})
                break;    
            case UPDATE_FILE_NAME:
                //文件重命名 ---- 有重名的时候
                let json_result = {};
                try{
                    const result = window.renameData(data.codeData.oldPath, data.codeData.newPath);
                    json_result = $.parseJSON(result);
                    if( !json_result.is_success ){                    	
						this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '重命名失败',auto: true,speed:1500,statu: 0})
                    }else{
	                    log('重名弹窗----修改文件名成功')
	                    this.props.actions.triggerDialogInfo(null)
		                if( data._this && data._this.state.keyData ){
		                	//赋值一处
		                	const kdata = data._this.state.keyData,
		                	      dcdata = data.codeData;
		                	if( dcdata ){
		                	    if( dcdata.idVal ){       
				                	kdata.file_name = dcdata.idVal;
					                if( kdata.thumb_image && kdata.thumb_image.constructor == Object ){
					                	kdata.thumb_image.file_name = dcdata.idVal;
					                } 			                	
				            	}
				            	if( dcdata.newPath ){
				                	kdata.path = dcdata.newPath;
				            	}
				                if( dcdata.ftype ){
				                	kdata.file_type = dcdata.ftype;
				            	}
			                }                	
		            	}
						if( data.elem ){
							//jq对象
							const textDom = data.elem.textDom,
							      hiddenDom = data.elem.hiddenDom,
							      dcdata = data.codeData;
							if( textDom.length > 0 ){
								textDom.text(dcdata.idVal)
		                    }
		                    if( hiddenDom.length > 0 ){
		                    	try{
		                    		//赋值二处
		                        	const hVal = $.parseJSON(hiddenDom.val());
		                        	if( dcdata.idVal ){
		                        		hVal.file_name = dcdata.idVal;
		                        	}
		                        	if( dcdata.ftype ){
		                        		hVal.file_type = dcdata.ftype;
		                        	}
		                        	hiddenDom.val(JSON.stringify(hVal))
		                    	}catch(e){}
		                    }					
						}				
		                if( data.codeData && data.codeData.item ){
		                	data.codeData.item['DownExe'] = false
		                }
		                //2删除自建的属性
		                //delete data.codeData.item.DownExe	
	                }                     
                }catch(e){                	
                	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '重命名失败',auto: true,speed:1500,statu: 0})
                } 
                //重命名结束----取消重命名判断
                if( data._this ){
                	data._this.state.reName = false
                } 
                //重命名流程结束----不管成功与否初始化列表
                if( data.elem ){
					const textDom = data.elem.textDom,
					      inputDom = data.elem.inputDom;
					if( inputDom.length > 0 ){
						inputDom.remove()
					}                     	
					if( textDom.length > 0 ){
						textDom.css('display','block')
	                }  
                }                                            				                
                break;
            case FILE_TYPE_VERIFY:
                //改变扩展名的时候
                if( data.codeData ){
                	//自建DownExe属性，表示可以修改扩展名，而当前不再进行扩展名判断。
                	const dcdata = data.codeData;
                	if( dcdata.item ){
	                	dcdata.item['DownExe'] = true
	                	data._this.updateFileName(dcdata.item)
                	}
                }
                if( data._this ){
                	//取消重命名判断
                	data._this.state.reName = false
                }
                this.props.actions.triggerDialogInfo(null)
                break; 
            case LOOP_SCAN_ACTIVE:
                //定期扫描触发方法
                if( temp != null && !temp && data.auto && data.speed ){
                	//倒计时到了后执行扫描
                	let sp = data.speed - 1,
                	    timerDom = document.getElementById('p-timer');
                	clearTimeout(this.state.timer);
                    const activeFn = (time) => {
                    	this.state.timer = setTimeout(() => {
                    		if( timerDom ){
                    			timerDom.innerHTML = time + data.timeText;
                    		}                        		
                            if( time > 0 ){
                            	time--;	                            	
                            	activeFn(time)
                            }else{
                            	clearTimeout(this.state.timer)//清除定时器1
                            	this.props.actions.sendHandleMessage('ScanMsgProcess', 'startScan', '')
						        try{
						            window.JsMsgHandle('add_scan_path_t', {error_code: 0, error: '', data: 'All', desc: '<定期扫描触发>自己触发添加全部扫描列表'})
						        }catch(e){}                            	
                            	this.props.actions.triggerDialogInfo(null)
                            }	                            
                        },1000)  
                    }
                    activeFn(sp)
                }else{
                	//立即执行扫描
                	clearTimeout(this.state.timer)//清除定时器2
                    this.props.actions.sendHandleMessage('ScanMsgProcess', 'startScan', '')
			        try{
			            window.JsMsgHandle('add_scan_path_t', {error_code: 0, error: '', data: 'All', desc: '<定期扫描触发>自己触发添加全部扫描列表'})
			        }catch(e){}                     
                    this.props.actions.triggerDialogInfo(null)
                }
                break;
            case JUMP_PAGE:
                //自动触发跳转页面
                if( temp != null && !temp && data.auto && data.speed ){
                	//倒计时到了后执行扫描
                	let sp = data.speed - 1,
                	    timerDom = document.getElementById('p-timer');
                	clearTimeout(this.state.timer);
                    const activeFn = (time) => {
                    	this.state.timer = setTimeout(() => {
                    		if( timerDom ){
                    			timerDom.innerHTML = time + data.timeText;
                    		}                        		
                            if( time > 0 ){
                            	time--;	                            	
                            	activeFn(time)
                            }else{
								//特殊方法处理
								if( data.defaultFn ){
									data.defaultFn()
								}                            	
                            	clearTimeout(this.state.timer)//清除定时器1
                            	this.props.actions.sendHandleMessage('SettingMsgProcess', 'jumpTabPage', data.codeData)
                            	this.props.actions.triggerDialogInfo(null)
                            }	                            
                        },1000)  
                    }
                    activeFn(sp)
                }else{
					//特殊方法处理
					if( data.defaultFn ){
						data.defaultFn()
					}                	
                	//立即执行扫描
                	clearTimeout(this.state.timer)//清除定时器2
                    this.props.actions.sendHandleMessage('SettingMsgProcess', 'jumpTabPage', data.codeData)
                    this.props.actions.triggerDialogInfo(null)
                }                
                break;    
            case SCAN_DRIVE_MSG:
                //扫描根目录时提示
                if( data.element && data.codeData ){
                    this.props.actions.eventsCheck(data.codeData.elem);
                    addClass(data.element, 'checked')                	
                }
                this.props.actions.triggerDialogInfo(null)
                break;
            case SCAN_RESTART_LOCAL_SERVICE:
                //本地服务重启成功后重新扫描
		        const confirmDom = document.querySelector('.dialog-footer .confirm-btn');
		        if( confirmDom && confirmDom.classList.contains('unactive') ){
                    return;
		        }
		        //执行常规扫描
		        this.props.actions.triggerDialogInfo({type: SHOW_LOCAL_FILES_SCAN, codeData: data.codeData, allData: data.allData})                 
            break;                              
			default:
			    break;
		}
	}
	closeDialogLoop() {
		//不清除定时器，关闭后倒计时到了自动扫描
		this.props.actions.triggerDialogInfo(null)
	}
	closeDialogInfo() {
		//关闭弹窗----初始化相关流程
		clearTimeout(this.state.timer)//清除定时器3
		clearInterval(this.state.btnTimer)//清除定时器
		this.props.actions.triggerDialogInfo(null)
		const data = this.props.dialogData;
        //特殊方法处理
		if( data.defaultFn ){
			data.defaultFn()
		}		
		if( data == null || data.code == null ){
			return
		}
		switch(data.code){
            case UPDATE_FILE_NAME:
                //文件重名
				if( data.elem ){
					//jq对象
					const textDom = data.elem.textDom,
					      inputDom = data.elem.inputDom;
					if( inputDom.length > 0 ){
						inputDom.remove()
					}      
					if( textDom.length > 0 ){
						textDom.css('display','block')
					}
					if( data._this ){
						data._this.state.reName = false
						data._this.selectLiItem();
					}
					//1false掉。可以重新检测扩展名
	                if( data.codeData && data.codeData.item ){
	                	data.codeData.item['DownExe'] = false
	                }
	                //2删除自建的属性
	                //delete data.codeData.item.DownExe					
				}
            	break;
            case FILE_TYPE_VERIFY:
                //文件扩展名
				if( data.elem ){
					//jq对象
					const textDom = data.elem.textDom,
					      inputDom = data.elem.inputDom;
					if( inputDom.length > 0 ){
						inputDom.remove()
					}      
					if( textDom.length > 0 ){
						textDom.css('display','block')
					}
					if( data._this ){
						data._this.state.reName = false
						data._this.selectLiItem();
					}
					//false掉。可以重新检测扩展名
	                if( data.codeData && data.codeData.item ){
	                	data.codeData.item['DownExe'] = false
	                }
	                //2删除自建的属性
	                //delete data.codeData.item.DownExe		                										
				}
                break; 
            case SCAN_STOP_ACTIVE:
                //取消本次扫描
                if( data.elem ){
                	const de = data.elem;
                	if( de.carryonDom ){
                	   de.carryonDom.disabled = false
		               removeClass(de.carryonDom, 'opacity8')                 		
                	}
                	if( de.pauseonDom ){
                	   de.pauseonDom.disabled = false
		               removeClass(de.pauseonDom, 'opacity8')                 		
                	} 
                	if( de.eventTarget ){
                	   de.eventTarget.disabled = false               		
                	}                	               	
                }
                break;                    	
            default:
                 break;	 
        }         
	}
	render() {
		const { dialogData } = this.props
		const { isCheck, auto } = this.state
		return <div className="confirm-dialog-layer dialog unbody" id="Confirm" ref="verticalCenter">
		           <div className="dialog-title unbody">
		                <span className="unbody">{dialogData.title}</span>
		                {
		                	!dialogData.disabled ?
		               			<a className="abs close-dialog unbody" onClick={this.closeDialogInfo.bind(this)}><i className="icons icons-18 close-dialog-bg"></i></a>
		               		:
		               		    null			                	
		                }
		           </div>
		           <div className="dialog-content unbody">
		               <div style={ dialogData.checkBox ? {"height": "60px"} : null} className={dialogData.model && dialogData.model == "SINGLE_OK" ? "table-cell text-left unbody" : "table-cell unbody"}>
			               <p className="unbody" id="dcMsgText" dangerouslySetInnerHTML={{__html: !isEmpty(dialogData.text) ? dialogData.text : '哎呀，提示语丢掉了...'}}></p>
			               {
			               	   dialogData.textMsg ?
			               	       <p className="unbody">{dialogData.textMsg}</p>
			               	   :
			               	       null   
			               }
			               {
			               	   dialogData.auto != null ? 
                                   <p className="unbody" id="p-timer">
                                      {
                                      	  dialogData.speed ?
                                      	     dialogData.code == SCAN_RESTART_LOCAL_SERVICE ?
                                      	        '正在为您重启服务：'+ dialogData.speed + dialogData.timeText
                                      	     :   
                                      	     	dialogData.speed + dialogData.timeText
                                      	  :
                                      	     null   
                                      }
                                   </p> 
			               	   :
			               	       null
			               }
		               </div>
		               {
		               	  dialogData.checkBox ? 
		               	     <p className="check-p unbody">
		               	       <lable className="clearfix unbody" onClick={this.checkBtn.bind(this)}>
		               	          <i className={isCheck ? "icons icons-18 fn-checked2 g-l unbody" : "icons icons-18 fn-check g-l unbody"}></i>
		               	          <span className="unbody">{dialogData.checkBox}</span>
		               	       </lable> 
		               	     </p>
		               	  :
		               	     null   
		               }		               
		           </div>
		           {
		           	   !dialogData.disabled ?
			           	   dialogData.confirmBtnText || dialogData.cancelBtnText ?
					            <div className="dialog-footer unbody">
					            	<a className="dialog-btn cancel-btn unbody" onClick={dialogData.cancelFn ? () => dialogData.cancelFn() : this.closeDialogInfo.bind(this)}>{dialogData.cancelBtnText}</a>
					           	    <a className="dialog-btn confirm-btn unbody" onClick={dialogData.confirmFn ? () => dialogData.confirmFn() :  this.closeDialogInfo.bind(this)}>{dialogData.confirmBtnText}</a> 
					            </div>
			           	   :
				           	   dialogData.model ?
					           	    dialogData.model == "SINGLE_OK" || dialogData.model == "DEFAULT_OK" ?
							            <div className="dialog-footer unbody">
							           	    <a className="dialog-btn confirm-btn unbody" onClick={this.closeDialogInfo.bind(this)}>知道了</a> 
							            </div>
							        :    
							        dialogData.model == "GO_LOGIN" ?
							            <div className="dialog-footer unbody">
							           	    <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>稍后再说</a> 
							                <a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>立即登录</a>
							            </div>
							        :   
							        dialogData.model == 'SCAN_WAIT' ?
							            <div className="dialog-footer unbody">
							           	    <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>取消扫描</a> 
							                <a className="dialog-btn unactive confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>重新扫描</a>
							            </div>
							        :
							            null   
						       :
						           dialogData.code == SCAN_DRIVE_MSG ?
							           <div className="dialog-footer unbody">
							           	    <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>不扫描</a> 
							           	   	<a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>继续扫描</a>    
							           </div>
						           :
						           dialogData.code == LOOP_SCAN_ACTIVE ?
						               <div className="dialog-footer unbody">
						           	   	    <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>取消</a> 
						           	   		<a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>扫描</a>
						               </div>
						           :
						           dialogData.code == JUMP_PAGE ?
						               <div className="dialog-footer unbody">
						           	   	    <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>取消</a> 
						           	   		<a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>确认</a>
						               </div>
						           :
						           <div className="dialog-footer unbody">
						           	   <a className="dialog-btn cancel-btn unbody" onClick={this.closeDialogInfo.bind(this)}>取消</a> 
						           	   {
						           	   	   dialogData.auto ?
						           	   	       <a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>立即</a>
						           	   	   :
						           	   	       <a className="dialog-btn confirm-btn unbody" onClick={this.confirmBtn.bind(this, dialogData)}>确认</a>    
						           	   }
						           </div>
						:
						    null           		           		           	   
		           }		           		           
		       </div>	  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = doc.querySelector('.confirm-dialog-layer'),
			      dragElem = parElem.querySelector('.dialog-title');
			dragDrop(dragElem, parElem);
			absVerticalCenter(this.refs.verticalCenter);
		}
		const dialogData = this.props.dialogData;
		if( dialogData ){
			//判断是否要自动执行
			if( dialogData.auto != null && dialogData.auto ){
				//false表示不立即执行，等时间到了再执行。
				this.confirmBtn(dialogData, false)
			}
			//确定按扭倒计时
			if( dialogData.model == 'SCAN_WAIT' ){
				this._inItConfirmBtnFn(dialogData)	
				this.setState({
					isScanWait: true
				})			
			}
		}		
	}
	_inItConfirmBtnFn(data) {
		const timerDom = document.getElementById('p-timer');
		let times = data.speed;
        this.state.btnTimer = setInterval(() => {
            times--
            if( times <= 0 ){
                clearInterval(this.state.btnTimer);
	            if( timerDom ){
	            	const contentDom = document.getElementById('dcMsgText');
	            	if( contentDom ){
	            		contentDom.innerText = '本地服务重启失败';
	            	}
	            }
                return false;
            }
            if( timerDom ){
                timerDom.innerText = '正在为您重启服务：'+ times + data.timeText;
            }                    
        }, 1000) 
	}
    componentWillReceiveProps(nextProps) {
    	//js分发数据jsMsgHandle
    	//目前只处理扫描素材时
    	//因扫描弹窗关闭了，所以要在这里执行。
        if( this.state.isScanWait && nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
				log('---返回数据为空---')
            	return;
            }  
            const jsVal = jsData.data;  
            if( isEmpty(jsVal) ){
            	log('---返回数据data字段为空---');
                return;
            }        
            switch( jsModule ){
                case 'connect_msg_t':
                    //链图云服务器崩溃时，客户端须有对应处理方案。
                    //本地服务掉线 2501
                    //成功代码均为0
                    //这里只处理本地服务
                    if( jsData.error_code == 0 && jsVal.server == 0 ){
                    	this._connectMsg(jsVal)
                	}
                break;
            	default:
                    return false;
            	break;
            }
        }
    }	
    _connectMsg(jsData) {
    	const btnDom = document.querySelector('.dialog-footer .confirm-btn'),
    	      contentDom = document.getElementById('dcMsgText'),
    	      timerDom = document.getElementById('p-timer');
    	clearInterval(this.state.btnTimer);
    	if( btnDom ){
	        btnDom.classList.remove('unactive');
	    } 
	    if( contentDom ){
	    	contentDom.innerText = '本地服务重新启动成功';
	    } 
	    if( timerDom ){
	    	timerDom.style.display = 'none';
	    } 
	    this.setState({
	    	isScanWait: false
	    })        
    }
	componentWillUnmount() {
		clearTimeout(this.state.timer)
		clearInterval(this.state.btnTimer)
	}	
}
export default immutableRenderDecorator(Confirm)