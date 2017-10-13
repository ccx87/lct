import { FONT_STATE, GET_FONT_STATE, PAGE_TYPE } from './DataConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM } from './TodoFilters'
import { isEmpty, getFontState, log } from './UtilConstant'

module.exports = {
	//下拉加载初始化
	getmCustomScrollbar: function($element, _this, option){
		if( $element.length > 0 ){
			if( _this && option == null ){
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:250,
				  	callbacks:{
				    	onTotalScrollOffset:50,
				    	onTotalScroll:function(res){
				    		log("触发下拉加载机制--->") 
				    		log(!_this.state.loading)
				    		log(_this.state.showLoad)
				    		if( !_this.state.loading && _this.state.showLoad ){
				    			log("下拉加载开始--->")
		                    	_this.getFontListData()
		               		}
				        }
					}			
				})
			}else{
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:250			
				})				
			}
			if( option ){
				log("调整滚动条")
				$element.mCustomScrollbar(option)
			}
		}		
	},	
	//获取本地字体和云端字体的font_id
	getLocalOrYunFontId: function(f_list){
        const local_fids = [],
              yun_fids = []; 
		for( let i = 0; i < f_list.length; i++ ){
            if( getFontState(f_list[i].font_state) === GET_FONT_STATE.installed || 
                getFontState(f_list[i].font_state) === GET_FONT_STATE.not_install ){
                local_fids.push(f_list[i].font_id)
            }else{
            	yun_fids.push(f_list[i].font_id)
            }
		}
		return {local_fids: local_fids, yun_fids: yun_fids}		
	},
	//获取替换image后的数据
	getUpdataImageFontList: function(p_data, t_data){
        for( let i = 0; i < p_data.length; i++ ){
            for( let j = 0; j < t_data.length; j++ ){
                if( p_data[i].font_id === t_data[j].font_id ){
                    t_data[j].font_image = p_data[i].font_image;
                    t_data[j].font_image_status = p_data[i].font_image_status;                       	
                	break;
                }
            }
    	}
    	return t_data
	},
	//复选框--选择
	getCheckBoxSelect: function(n_check, n_uncheck, t_uncheck, li_Elem){
		// 复选框--选择
		if( n_check ){
            for( let j = 0; j < n_check.length; j++ ){
				for( let i = 0; i < li_Elem.length; i++ ){
					const fid = li_Elem[i].querySelector('.font_id').value,
					      child_Elem = li_Elem[i].querySelector('.item-check'),
                          i_Elem = child_Elem.querySelector('i');
                    if( fid == n_check[j] ){
                    	i_Elem.className = 'icons icons-18 fn-checked'
                    	break
                    } 
            	}        
			}
		}
	    // 复选框--取消选择 
		if( n_uncheck ){
			if( !n_uncheck && t_uncheck ){
                n_uncheck = t_uncheck;
			}
			for( let i = 0; i < li_Elem.length; i++ ){
				const fid = li_Elem[i].querySelector('.font_id').value,
				      child_Elem = li_Elem[i].querySelector('.item-check'),
                      i_Elem = child_Elem.querySelector('i');    
                if( fid == n_uncheck ){
                    i_Elem.className = 'icons icons-18 fn-check'
                    break;
                } 
			}				
		}
		//全不选
		if( n_check == null && n_uncheck == null ){
			for( let i = 0; i < li_Elem.length; i++ ){
				const child_Elem = li_Elem[i].querySelector('.item-check'),
                      i_Elem = child_Elem.querySelector('i.icons');
                i_Elem.className = 'icons icons-18 fn-check';
			}				
		}			
        return false
	},
	//批量处理完后复选框操作
	getOptionsCheck: function(check_id, li_Elem, actions){
		for( let n = 0; n < li_Elem.length; n++ ){
			const fid = li_Elem[n].querySelector('.hidden.font_id').value,
			      check_Elem = li_Elem[n].querySelector('.item-check'),
                  i_Elem = check_Elem.querySelector('i');     
            if( fid === check_id ){   
            	actions.fontCheckItem({font_id: fid}, false)
            	i_Elem.className = 'icons icons-18 fn-check';
            	break;
        	}
		}
	},
    //字体助手--收藏or取消收藏
    getCollectSelect: function(n_collect, n_uncollect, n_c, actions, li_Elem){
        if( n_collect ){
            for( let i = 0; i < n_collect.length; i++ ){
            	let hasid = false;
				for( let j = 0; j < li_Elem.length; j++ ){
					const fid = li_Elem[j].querySelector('.font_id').value,
					      child_Elem = li_Elem[j].querySelector('.item-left .item-info .ii-fn'),
                          a_Elem = child_Elem.querySelector('.abtn'),
                          i_Elem = a_Elem.firstChild,
                          check_Elem = li_Elem[j].querySelector('.item-check i');
                    if( fid == n_collect[i].font_id ){
                    	hasid = true;
                        if( n_collect[i].font_state & FONT_STATE.kCollectState ){
                    		a_Elem.className = 'abtn active'
                        	i_Elem.className = 'icons icons-18 fn-collected'
                        	actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "已加入我的收藏",auto: true,speed: 1500,statu: 1})
                        	//批量处理完后复选框操作
					        if( check_Elem && check_Elem.classList.contains("fn-checked") ){
					        	module.exports.getOptionsCheck(fid, li_Elem, actions)
					        }
                    	}else{
                    		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "收藏失败",auto: true,speed: 2500,statu: 0})
                    	}
                        break
                    } 
				}
				if(!hasid){
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "收藏失败,该字体不存在",auto: true,speed: 2500,statu: 0})
				}					
			}                     
        }
        if( n_uncollect ){
            for( let i = 0; i < n_uncollect.length; i++ ){
            	let hasid = false;
				for( let j = 0; j < li_Elem.length; j++ ){
					const fid = li_Elem[j].querySelector('.font_id').value,
					      fstr = li_Elem[j].querySelector('.ii-name').innerHTML,
					      child_Elem = li_Elem[j].querySelector('.item-left .item-info .ii-fn'),
                          a_Elem = child_Elem.querySelector('.abtn'),
                          i_Elem = a_Elem.firstChild,
                          check_Elem = li_Elem[j].querySelector('.item-check i');
                    if( fid == n_uncollect[i].font_id ){
                    	if( !(n_uncollect[i].font_state & FONT_STATE.kCollectState) ){
                    		hasid = true;
	                    	if( n_c.PageName == PAGE_TYPE.Font_Assistant.my_collection.PageName ){
                                li_Elem[j].style.display = 'none'
                                actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消收藏成功",auto: true,speed: 1500,statu: 1})
	                    	}else{
		                    	a_Elem.className = 'abtn'
		                        i_Elem.className = 'icons icons-18 fn-collect'
		                        actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消收藏成功",auto: true,speed: 1500,statu: 1})
                            }
                        	//批量处理完后复选框操作
					        if( check_Elem && check_Elem.classList.contains("fn-checked") ){
					        	module.exports.getOptionsCheck(fid, li_Elem, actions)
					        }                            
                    	}else{
                            actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: fstr+" 取消收藏失败",auto: true,speed: 2500,statu: 0})
                    	}
                        break
                    } 
				}
				if(!hasid){
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消收藏失败,该字体不存在",auto: true,speed: 2500,statu: 0})
				}					
			}
        }
        return false        
    },
	//获取开始下载状态，有二种可能。一种是该字体无法下载，则去列队查询
	//是否还有要下载的字体。二种是可以下载则返回该字体id
	getBengingDownloadFontId: function(loginId, actions, downloadIds, downloadListData, downloadBeging){
     	if( downloadBeging && downloadBeging.result ){
     		console.log('开始当前下载')
     		actions.getDownloadList(1, downloadBeging.result)
    	}else{	
            if( downloadIds && downloadIds.length > 0 ){
                if( downloadIds[0] && !(downloadListData) || (downloadListData && downloadListData.length == 0) ){
	        		//开始新的下载
	        		console.log('开始新的下载')
					actions.getDownloadFontBeging(loginId, downloadIds[0])
	                return; 		                                    		
            	}else{
            		console.log('下载的id为空，或下载正忙')
            	}                	
            }
    		//退出下载
    		if( !downloadListData || downloadListData.length == 0 ){
    			console.log('没有下载列表了1')
    			return false
    		}
    		console.log('没有下载列表了2 或 下载正忙')
    	} 
	},
	//启动下载列队
	getDownloadingState: function(actions, loginId, downloadIds) {
		console.log('启动下载列队：', downloadIds[0])
        if( downloadIds && downloadIds.length > 0 ){
        	setTimeout(() => {
        		actions.getDownloadFontBeging(loginId, downloadIds[0])
        	},500)
        } 
	},
	//开始获取当前下载信息
	getDownloadingState0: function(actions, downloadBeging) {
		console.log('开始请求下载信息：', downloadBeging)
        if( downloadBeging && downloadBeging.result ){
        	setTimeout(() => {
        		actions.getDownloadList(1, downloadBeging.result)
        	},500)
        }
	},
	//获取正在下载时的状态---字体下载 1。
	getDownloadingState1: function(downloadListData, li_Elem, listData, actions){
		let hasState = false
		if( downloadListData && li_Elem && listData && actions ){
	        for( let i = 0; i < downloadListData.length; i++ ){
	        	if( downloadListData[i] != null && !isEmpty(downloadListData[i].font_id) ){
					for( let j = 0; j < li_Elem.length; j++ ){
						const fid = li_Elem[j].querySelector('.hidden.font_id').value,
	                          a_Elem = li_Elem[j].querySelector('.item-right .abtn'),
						      text_Elem = a_Elem.querySelector('.btn-text'),
						      radial_Elem = a_Elem.querySelector('i'),
						      check_Elem = li_Elem[j].querySelector('.item-check i');   
	                    if( fid == downloadListData[i].font_id ){
	                    	hasState = true
	                    	const statu = downloadListData[i].download_state
	                		if( radial_Elem.firstChild ){
	                		    $(radial_Elem.firstChild).remove()	                    			
	                		}	                    				                    	
	                    	if(  statu == 0 ){
	                    		//下载完成
	                        	//批量处理完后复选框操作
						        if( check_Elem && check_Elem.className == "icons icons-18 fn-checked" ){
						        	module.exports.getOptionsCheck(fid, li_Elem, actions)
						        }
						        setTimeout(() => {
                                    actions.initializationEventsCallback('DOWNLOAD', [fid])
						        },50)	
		                    	actions.downloadMessage({number: 1})						                            		
	                    		if( a_Elem ){
	                    			a_Elem.disabled = false;
	                    		}	                    									    		                    		
	                            for( let k = 0; k < listData.length; k++ ){
	                            	if( downloadListData[i].font_id == listData[k].font_id ){                                   		
	                            		listData[k].font_state = downloadListData[i].font_state;
	                            		listData[k].path = downloadListData[i].path;
	                            		if( listData[k].id ){
	                            			delete listData[k].id
	                            		}
	                            		break
	                            	}
	                            }                           
	                            actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "下载成功",auto: true,speed: 1500,statu: 1})	                            
	                    	}else if( statu == 1 ){	
		                		if( radial_Elem.firstChild ){
		                		    $(radial_Elem.firstChild).remove()	                    			
		                		}	                    	  
	                    		if( a_Elem ){
	                            	a_Elem.disabled = true;
	                        	}
	                        	if( text_Elem ){
	                            	text_Elem.innerHTML = '下载中';
	                        	}
	                    		//正在下载
							    $(radial_Elem).radialIndicator({
							        radius: 8,
							        barColor: '#0C73C2',
							        barWidth: 2,
							        initValue: Math.floor(downloadListData[i].downloaded_progress),
							        barBgColor: '#CCCCCC',
							        displayNumber: false
							    });
							    //重新获取下载信息
			                	console.log('时时获取下载信息1')
			                	setTimeout(() => {
									actions.getDownloadList(1, downloadListData[i].font_id)
			                	},500)
	                    	}else if( statu == 2 ){
	                    		//暂停中

	                    	}else if( statu == 3 ){
	                    		//下载失败	       
		                		if( radial_Elem.firstChild ){
		                		    $(radial_Elem.firstChild).remove()	                    			
		                		}	                    		             		
	                    		radial_Elem.className = 'icons icons-18 btn-download'
	                    		actions.initializationEventsCallback('DOWNLOAD', [fid])
	                    		if( a_Elem ){
	                            	a_Elem.disabled = false;
	                        	}
	                        	if( text_Elem ){
	                            	text_Elem.innerHTML = '下载';
	                        	}
	                    		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: downloadListData[i].error || "下载失败",auto: true,speed: 2500,statu: 0})
	                    	}
	                        break
	                    }
					}
				}	
			}
		}
		if( !hasState ){
			if( downloadListData && downloadListData[0] && downloadListData[0].downloaded_progress == 100 ){
		        setTimeout(() => {
                    actions.initializationEventsCallback('DOWNLOAD', [downloadListData[0].font_id])
		        },50)	
            	actions.downloadMessage({number: 1})                 
			}else{
				//重新请求，有时可能dom元素未加载完成导致匹配不了
				setTimeout(() => {
					console.log('重新请求，有时可能dom元素未加载完成导致匹配不了')
					actions.getDownloadList(1, downloadListData[0].font_id)
				}, 500)
			}
		}	
	},
	//获取正在下载时的状态---字体补齐 2。
	getDownloadingState2: function(font_id, downloadListData, tr_Elem, listData, actions, keyPadded){
        if( downloadListData && tr_Elem && listData && actions ){ 
	        for( let i = 0; i < downloadListData.length; i++ ){
	        	if( downloadListData[i] != null && !isEmpty(downloadListData[i].font_id) ){
					for( let j = 0; j < tr_Elem.length; j++ ){
						const fid = tr_Elem[j].lastChild.querySelector('.hidden.font_id').value,
						      i_Elem = tr_Elem[j].querySelector('.progress-bar .progress'),
						      text_Elem = tr_Elem[j].querySelector('.progress-bar .progress-text'),
						      btn_Elem = tr_Elem[j].querySelector('.download-btn');      
	                    if( fid == downloadListData[i].font_id ){
	                    	const statu = downloadListData[i].download_state
	                    	if(  statu == 0 ){
	                    		//下载完成
	                    		//[fid]是排除当前下载的id
	                    		actions.initializationEventsCallback('DOWNLOAD', [fid])
	                    		actions.downloadMessage({number: 1})
	                            for( let k = 0; k < listData.length; k++ ){
	                            	if( downloadListData[i].font_id == listData[k].font_id ){
	                            		listData[k].font_state = downloadListData[i].font_state;
	                            		listData[k].path = downloadListData[i].path;
	                            		if( listData[k].id ){
	                            			delete listData[k].id
	                            		}                                    		                                    		
	                            		if( btn_Elem ){
	                            			btn_Elem.style.display = 'block'
	                            		}
	                            		break
	                            	}
	                            }
	                            if( i_Elem && text_Elem ){									
									i_Elem.style.cssText = 'width:'+ Math.floor(downloadListData[i].downloaded_progress) +'%';
									text_Elem.innerHTML = Math.floor(downloadListData[i].downloaded_progress) +'%';	
								}
								setTimeout(() =>{
									if( tr_Elem[j].querySelector('.progress-bar') ){
										tr_Elem[j].querySelector('.progress-bar').style.display = 'none'
									}
								},30)

								if( keyPadded ){
									//自动安装
	                                if( keyPadded.codeData2 && keyPadded.codeData2.length > 0 ){
	                                	const n_padded = keyPadded.codeData2;
	                                	for( let h = 0; h < n_padded.length; h++ ){
	                                		if( n_padded[h].font_id == fid ){
	                                			setTimeout(() => {
	                                				actions.installFontAdd([{font_id: fid}])
	                                			},500)
	                                			break;
	                                		}
	                                	}
	                                }
								}						    	
						    	return false;		                    				                    		
	                    	}else if( statu == 1 ){
	                    		if( i_Elem && text_Elem ){
									i_Elem.style.cssText = 'width:'+ Math.floor(downloadListData[i].downloaded_progress) +'%';
									text_Elem.innerHTML = Math.floor(downloadListData[i].downloaded_progress) +'%';
								}
				                setTimeout(() => {
				                	console.log('时时获取下载信息2')
									actions.getDownloadList(1, downloadListData[i].font_id)
				                },500)
	                    		//正在下载
	                    	}else if( statu == 2 ){
	                    		//暂停中

	                    	}else if( statu == 3 ){
	                    		//[fid]是排除当前下载的id
	                    		setTimeout(() => {
	                    			actions.initializationEventsCallback('DOWNLOAD', [fid])
	                    		},10)
	                    		btn_Elem.style.display = 'block';
	                    		text_Elem.className = 'progress-text col-red';
	                    		text_Elem.innerHTML = '下载失败';
	                    		//下载失败
	                    	}
	                        break
	                    } 
					}
				}	
			}
		}
	},
	//字体助手--字体安装
	getFontsInstall: function(n_install, listData, actions, li_Elem, t_font){
		if( n_install && n_install.length > 0 ){
			const events_id_ok = [],
                  events_id_fail = [],
                  events_text_fail = [],
                  events_id_sys_fail = [],
                  events_text_sys_fail = [];      
            console.log("字体安装:", n_install)
            for( let i = 0; i < n_install.length; i++ ){
            	let hasid = false,fid = null,a_Elem = null, text_Elem = null,check_Elem = null, fstr= null;
				for( let j = 0; j < li_Elem.length; j++ ){
					if( li_Elem[j] && li_Elem[j].classList.contains("item-cf") ){
						//字体列表里的安装
					    fid = li_Elem[j].querySelector('.font_id').value;
					    a_Elem = li_Elem[j].querySelector('.item-right .abtn');
					    text_Elem = a_Elem.querySelector('.btn-text'),
					    check_Elem = li_Elem[j].querySelector('.item-check i'),
					    fstr = li_Elem[j].querySelector('.ii-name .text').innerHTML
					}else if( li_Elem[j] && li_Elem[j].classList.contains("col-line") ){
						//字体补齐里的安装
						fid = li_Elem[j].querySelector('.hidden.font_id').value;
						text_Elem = li_Elem[j].querySelector('.install-btn .install');
						fstr = li_Elem[j].querySelector('.sp-text').innerHTML;							
					}else{
						return false
					}  
                    if( fid == n_install[i].font_id ){
                    	hasid = true;
                    	if( a_Elem ){
                    		a_Elem.disabled = false;
                    	}
                    	if( text_Elem ){
                    		text_Elem.innerHTML = '安装';
                    	}
                    	if( getFontState(n_install[i].result.font_state) === GET_FONT_STATE.installed ){
                        	//安装成功
                        	//正确后批量处理完后复选框操作
					        if( check_Elem && check_Elem.className == "icons icons-18 fn-checked" ){
					        	module.exports.getOptionsCheck(fid, li_Elem, actions)
					        }
					        //改变安装后字体名的颜色
					        const color_name = $(li_Elem[j]).closest('li').find('.orignal-font-name');
					        if( color_name.length > 0 ){
					        	color_name.css('color', '#666');
					        }	                    		
                    		events_id_ok.push(n_install[i].font_id)
                    		//统计安装次数（目前使用在字体检测，字体缺失安装后重新计算缺失个数）
                    		actions.installMessage({installNum: 1, install: n_install[i]})
                            for( let k = 0; k < listData.length; k++ ){
                            	if( 'orignal_font_name' in listData[k] ){
                            		//此判断适用于字体补齐里的字体安装
	                            	if( n_install[i].orignal_font_name === listData[k].orignal_font_name && listData[k].data ){              
	                            		for( let m = 0; m < listData[k].data.length; m++ ){
	                                        if( n_install[i].font_id === listData[k].data[m].font_id ){
	                                        	const result = n_install[i].result;
	                                        	if( result ){
			                                        listData[k].data[m].font_state = result.font_state;
			                                        listData[k].data[m].path = result.path;
		                                		}                                             	
	                                        	break;
	                                        }
	                            		}
	                            		break;
	                            	}
                            	}else{
                            		//此判断适用于字体列表里的字体安装
                                    if( n_install[i].font_id === listData[k].font_id ){
                                    	const result = n_install[i].result;
                                    	if( result ){
	                                        listData[k].font_state = result.font_state;
	                                        listData[k].path = result.path;
	                                        if( t_font && PAGE_TYPE.Font_Assistant.recycle_bin.PageName === t_font.common.PageName ){
	                                        	 listData.splice(k, 1) 
	                                		}
                                		}                                             	
                                    	break;
                                    }                            		
                            	}
                            }                                
						}else {
							//安装失败
							if( n_install[i].error_code == 2120 ){
								events_id_sys_fail.push(n_install[i].font_id)
								events_text_sys_fail.push(fstr)
								const install_spDom = li_Elem[j].querySelector('.install-btn'),
                                      open_spDom = install_spDom && install_spDom.nextSibling;
                                if( install_spDom ){      
                                    install_spDom.style.display = 'none';
                             	}
                             	if( open_spDom ){
                                	open_spDom.style.display = 'block';
                            	}
							}else{
								events_id_fail.push(n_install[i].font_id)
								events_text_fail.push(fstr)
							}
						}
						break;	                    	
                    }
				}
				if( !hasid ) {
					if( a_Elem ){
						a_Elem.disabled = false;
					}
                	if( text_Elem ){
                		text_Elem.innerHTML = '安装';
                	}					
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装失败,该字体不存在",auto: true,speed: 2500,statu: 0})
				}	
			}				
            if( events_id_ok.length > 0 ){
            	if( events_id_fail.length > 0 ){ 
            		//普通安装错误处理                 		
            		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '安装成功，其中'+ events_text_fail.join('、') +"字体安装失败",auto: true,speed: 2500,statu: 1})
            	}else if( events_id_sys_fail.length > 0 ){
            		//特殊安装错误处理   
                    actions.triggerDialogInfo({
                    	type: SHOW_DIALOG_CONFIRM,
                    	text: "运行权限不足。是否以管理员身份重启链图云？",
                    	confirmBtnText: "确定",
                    	cancelBtnText: "取消",
                        confirmFn: () => {
                        	try{
                                window.restartLtyClient('')
                        	}catch(e){console.log('restartLtyClient接口调用出错')}
                        },
                        cancelFn: () => {
                        	actions.triggerDialogInfo(null)
                        }
                    })            		                		
            		//actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '安装成功，其中'+ events_text_sys_fail.join('、') +"字体因权限不足安装失败。win7以上系统请以管理员身份运行链图云，或者打开字体位置手动安装",auto: true,speed: 3000,statu: 1})
            	}else{
            	    //成功安装                		
            		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装成功",auto: true,speed: 1500,statu: 1})
            	}
            }else{
				if( events_id_sys_fail.length > 0 ){
       				//特殊安装错误处理 
                    actions.triggerDialogInfo({
                    	type: SHOW_DIALOG_CONFIRM,
                    	text: "运行权限不足。是否以管理员身份重启链图云？",
                    	confirmBtnText: "确定",
                    	cancelBtnText: "取消",
                        confirmFn: () => {
                        	try{
                                window.restartLtyClient('')
                        	}catch(e){console.log('restartLtyClient接口调用出错')}
                        },
                        cancelFn: () => {
                        	actions.triggerDialogInfo(null)
                        }
                    })
            		//actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "因权限不足安装失败。win7以上系统请以管理员身份运行链图云，或者打开字体位置手动安装",auto: true,speed: 3000,statu: 0})
				}else if( events_id_fail.length > 0 ){
            		//普通安装错误处理
            		if( events_id_fail.length == 1 ){
            			let errStr = (n_install[0] && n_install[0].error) || '安装失败';
                        actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text:errStr,auto:true,speed:2500,statu: 0})
            		}else{            		
            			actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装失败",auto: true,speed: 2500,statu: 0})						
					}
				}else{
					//安装失败
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装失败",auto: true,speed: 2500,statu: 0})
				}	                	
            }
            //events_id_ok 用去排除已成功的id，返回失败的id 
			actions.initializationEventsCallback('INSTALL', events_id_ok) 
		}else{
			for( let j = 0; j < li_Elem.length; j++ ){
				let a_Elem, text_Elem;
				if( li_Elem[j] && li_Elem[j].classList.contains("item-cf") ){
					//字体列表里的安装
				    a_Elem = li_Elem[j].querySelector('.item-right .abtn');
				    text_Elem = a_Elem.querySelector('.btn-text');
				}else if( li_Elem[j] && li_Elem[j].classList.contains("col-line") ){
					//字体补齐里的安装
					text_Elem = li_Elem[j].querySelector('.install-btn .install');						
				}else{
					return false
				}
				if( a_Elem ){
					a_Elem.disabled = false;
				}
            	if( text_Elem ){
            		text_Elem.innerHTML = '安装';
            	}                    
			}	
			actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装失败",auto: true,speed: 2500,statu: 0})
		}		
	},
	//字体助手--字体卸载
	getFontsUNinstall: function(n_uninstall, n_font, t_font, actions, li_Elem){
		if( n_uninstall ){
			const listData = t_font.fontListData.data.list,
                  events_id_ok = [],
                  events_id_fail = [],
                  events_text_fail = [],
                  events_id_sys_fail = [],
                  events_text_sys_fail = [];
            console.log("字体卸载:", n_uninstall)                        
            for( let i = 0; i < n_uninstall.length; i++ ){
            	let hasid = false,
            		post_go = false;
				for( let j = 0; j < li_Elem.length; j++ ){
					const fid = li_Elem[j].querySelector('.hidden.font_id').value,
					      btn_Elem = li_Elem[j].querySelector('.item-right .abtn'),
					      text_Elem = btn_Elem.querySelector('.btn-text'),
					      fstr = li_Elem[j].querySelector('.ii-name .text').innerHTML,
					      check_Elem = li_Elem[j].querySelector('.item-check i');
                    if( fid == n_uninstall[i].font_id ){
                    	hasid = true;
				    	btn_Elem.disabled = false;
				    	text_Elem.innerHTML = '卸载';                    	
                    	if( n_uninstall[i] && n_uninstall[i].result && n_uninstall[i].result.error_code == 0 ){
                        	//批量处理完后复选框操作
					        if( check_Elem && check_Elem.classList.contains("fn-checked") ){
					        	module.exports.getOptionsCheck(fid, li_Elem, actions)
					        }                    		
                    		events_id_ok.push(n_uninstall[i].font_id)
                            for( let k = 0; k < listData.length; k++ ){
                            	if( n_uninstall[i].font_id == listData[k].font_id ){
                                    listData[k].font_state = n_uninstall[i].result.font_state;
                                    listData[k].path = n_uninstall[i].result.path;
                                    const t_c = t_font.common;
                                    //判断该字体是不是在云端和收藏列表里
                                    if( PAGE_TYPE.Font_Assistant.search_font.PageName !== t_c.PageName &&
                                        PAGE_TYPE.Font_Assistant.my_collection.PageName !== t_c.PageName ){
                                        if( getFontState(n_uninstall[i].result.font_state) !== GET_FONT_STATE.installed &&
                                            getFontState(n_uninstall[i].result.font_state) !== GET_FONT_STATE.not_install ){
                                            listData.splice(k, 1);  
                                        }
                                	}
                            		break
                            	}
                            }
                            if( getFontState(n_uninstall[i].result.font_state) !== GET_FONT_STATE.installed && 
                                getFontState(n_uninstall[i].result.font_state) !== GET_FONT_STATE.not_install ){
								post_go = true
                            }                            		                    	
						}else if( n_uninstall[i] && n_uninstall[i].result && n_uninstall[i].result.error_code == 2111 ){
							events_id_sys_fail.push(n_uninstall[i].font_id)
							events_text_sys_fail.push(fstr)
						}else {
							events_id_fail.push(n_uninstall[i].font_id)
							events_text_fail.push(fstr)
						}
						break	                    	
                    } 
				}
            	if( post_go ){
            		//确认删除后，去云端获取该字体的状态，判断其是否下载
            		const postData = {
            			common: n_font.common,
            			fids: [n_uninstall[i].font_id]
            		}
            		//去云端获取字体信息
            		actions.fetchPostFontItemRequest(postData)
        		}
				if(!hasid){
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "卸载失败,该字体不存在",auto: true,speed: 2500,statu: 0})
				}	
			} 
            if( events_id_ok.length > 0 ){
            	if( events_id_fail.length > 0 ){ 
            		//普通卸载错误处理                 		
            		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '卸载成功，其中'+ events_text_fail.join('、') +"字体卸载失败",auto: true,speed: 2500,statu: 1})
            	}else if( events_id_sys_fail.length > 0 ){
            		//特殊卸载错误处理 
                    actions.triggerDialogInfo({
                    	type: SHOW_DIALOG_CONFIRM,
                    	text: "运行权限不足。是否以管理员身份重启链图云？",
                    	confirmBtnText: "确定",
                    	cancelBtnText: "取消",
                        confirmFn: () => {
                        	try{
                                window.restartLtyClient('')
                        	}catch(e){console.log('restartLtyClient接口调用出错')}
                        },
                        cancelFn: () => {
                        	actions.triggerDialogInfo(null)
                        }
                    })            		                  		
            		//actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '卸载成功，其中'+ events_text_sys_fail.join('、') +"字体因权限不足卸载失败，如果是win7以上的系统，请右键点击链图云，以管理员身份运行",auto: true,speed: 3000,statu: 1})
            	}else{
            	    //卸载安装                		
            		actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "卸载成功",auto: true,speed: 1500,statu: 1})
            	}
            }else{
				if( events_id_sys_fail.length > 0 ){
       				//特殊卸载错误处理   
                    actions.triggerDialogInfo({
                    	type: SHOW_DIALOG_CONFIRM,
                    	text: "运行权限不足。是否以管理员身份重启链图云？",
                    	confirmBtnText: "确定",
                    	cancelBtnText: "取消",
                        confirmFn: () => {
                        	try{
                                window.restartLtyClient('')
                        	}catch(e){console.log('restartLtyClient接口调用出错')}
                        },
                        cancelFn: () => {
                        	actions.triggerDialogInfo(null)
                        }
                    })       				                 		
            		//actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "因权限不足卸载失败，如果是win7以上的系统，请右键点击链图云，以管理员身份运行",auto: true,speed: 3000,statu: 0})
				}else if( events_id_fail.length > 0 ){
            		//普通卸载错误处理
            		if( events_id_fail.length == 1 ){
            			let errStr = (n_uninstall[0] && n_uninstall[0].result && n_uninstall[0].result.error) || '卸载失败';
                        actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text:errStr,auto:true,speed:2500,statu: 0})
            		}else{
            			actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "卸载失败",auto: true,speed: 2500,statu: 0})
            		}						
				} else{
					//卸载
					actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "卸载失败",auto: true,speed: 2500,statu: 0})
				}	                	
            }
            //events_id_ok 用去排除已成功的id，返回失败的id            
            actions.initializationEventsCallback('UNINSTALL', events_id_ok)
		}else{
			for( let j = 0; j < li_Elem.length; j++ ){
				const btn_Elem = li_Elem[j].querySelector('.item-right .abtn'),
				      text_Elem = btn_Elem.querySelector('.btn-text');
                if( btn_Elem && text_Elem ){
			    	btn_Elem.disabled = false;
			    	text_Elem.innerHTML = '卸载'; 
			    }	
			}   				
			actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "卸载失败",auto: true,speed: 2500,statu: 0})
		}		
	},
	//字体助手--卸载删除后重新从云端获取该字体状态，判断其是否可下载
	getUNinstallCallback: function(n_data, t_font){
		if( n_data && n_data.list && n_data.list.length > 0 ){
			const listData = t_font.fontListData.data.list,
			      n_l = n_data.list;
			for( let i = 0; i < n_l.length; i++ ){
                 for( let j = 0; j < listData.length; j++ ){
                      if( listData[j].font_id === n_l[i].font_id ){
                          listData[j].font_state = n_l[i].font_state 
                          break;
                      }
                 } 
			}
		}		
	},
	//字体助手--检测文件后重组字体数据
	//filter 是否要按已安装过滤数据
	getDetectsFontRest: function(f_ps, filter){
		let newArray = [],
            data = {};
		for( let i = 0; i < f_ps.length; i++ ){
			if( isEmpty(f_ps[i]) ){
				continue
			}
			const fontState = getFontState(f_ps[i].font_state);
            if( data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")] ){
        		const list = data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")];
        		let has_font = false;
        		// 搜索当前字体列表里是否有已安装的字体, 如果有其余的就舍弃
                for( let j = 0; j < list.length; j++ ){
                	const listState = getFontState(list[j].font_state);
                	if( filter && listState == GET_FONT_STATE.installed ){
						has_font = true;
						break;
                	}
                }
                if( has_font ){
                	continue
                }                   	
            	if( filter && fontState == GET_FONT_STATE.installed ){
            		//如果同一字体列表里有一个已安装的字体，其余的就舍弃
                    data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")].splice(0, data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")].length);
                    data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")].push(f_ps[i])
            	}else{
            		data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")].push(f_ps[i])
            	}
            }else{
            	data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")] = [];
            	data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")].push(f_ps[i]);
            	const font = {
            		orignal_font_name: f_ps[i].orignal_font_name,
            		file_name: f_ps[i].file_name,
            		data: data[(""+ f_ps[i].orignal_font_name +"").replace(/\s/g, "")]
            	}
            	newArray.push(font) 
        	}
		}
		return newArray		
	},
	getNewArrayFontList: function(rawData){
		if( isEmpty(rawData) || rawData.constructor != Array ){
			return {}
		}
        let newArray = [], //存储以"文件包含字体名"为key的对象
            fontData = [], //存储所有可以显示的字体
            paddedData = []; //存储一键补齐的字体
        newArray = module.exports.getDetectsFontRest(rawData, false);
		for( let m = 0; m < newArray.length; m ++ ){
			let hasIn = false;
			for( let n = 0; n < newArray[m].data.length; n++ ){
				if( getFontState(newArray[m].data[n].font_state) === GET_FONT_STATE.installed ){
					hasIn = true;
				}
				fontData.push(newArray[m].data[n]) //存储所有可以显示字体
			}
			if( !hasIn ){
				let hasPd = false;
				for( let k = 0; k < newArray[m].data.length; k++ ){
					if( !isEmpty(getFontState(newArray[m].data[k].font_state)) && getFontState(newArray[m].data[k].font_state) !== GET_FONT_STATE.not_download &&
						getFontState(newArray[m].data[k].font_state) !== GET_FONT_STATE.not_find ){
						hasPd = true;
						paddedData.push(newArray[m].data[k]) //用来判断一键补齐数据,只补齐第一个
						break;
					}
				}
				if( !hasPd ){
					paddedData.push(newArray[m].data[0]) //用来判断一键补齐数据,只补齐第一个
				}
			}
		}
		return {newArray: newArray, fontData: fontData, paddedData: paddedData}		
	},
	//本地素材
	//删除文件操作
	deleteFile: function(elem, temp){
		if( elem.length > 0 ){
	        const del = [],
	              del_scan = [];
	        let is_file = true;
	        if( elem.length > 0 ){      
	            elem.each((index, item) => {
	                const li_path = $(item).data('path'),
	                      hasScan = $(item).data('isscan');
	                is_file = $(item).data('isfile');
	                if( hasScan ){
	                    del_scan.push(li_path)
	                }else{
	                    del.push(li_path)
	                }
	            })
	        }
            if( del.length > 0 || del_scan.length > 0 ){
                let text = '',
                    lens = del.length + del_scan.length;
                if( lens > 1 ){
                	if( temp ){
                        text = '确实要永久删除这 '+ lens +' 项吗？'
                	}else{
                    	text = '确实要将这 '+ lens +' 项移动到回收站吗？'
                	}
                }else{
                    if( is_file ){
                    	if( temp ){
                        	text = '确实要永久性地删除此文件吗？'
                    	}else{
                    		text = '确实要把此文件放入回收站吗？'
                    	}
                    }else{
                    	if( temp ){
                            text = '确实要永久性地删除此文件夹吗？'
                    	}else{
                        	text = '确实要把此文件夹放入回收站吗？'
                    	}
                    }
                } 
                return {del: del, del_scan: del_scan, text: text}
            }   	        	        
        }
        return null		
	}
};
