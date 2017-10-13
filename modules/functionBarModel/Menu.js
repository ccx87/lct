import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { isEmpty, getFontState, log, hasClass } from '../../constants/UtilConstant'
import { PAGE_TYPE, FILE_INCLUDED, GET_FONT_STATE } from '../../constants/DataConstant'
import { 
    MENU_ALL_CHECK, 
    MENU_UNINSTALL, 
    MENU_INSTALL,
    MENU_UNCOLLECT, 
    MENU_COLLECT,
    MENU_REFRESH,
    MENU_DOWNLOAD,
    MENU_BATCH_EDIT, MENU_IMMEDIATELY_SCAN, MENU_DEL,
    SHOW_DIALOG_ALERT,
    SHOW_DIALOG_CONFIRM,
    SHOW_MANUAL_SCAN, 
    SORT_ALL, SORT_DAY, 
    SORT_INSTALLED, SORT_UNINSTALL, 
    SORT_WEEK, SORT_MONTH, 
    SORT_CLOUD, SORT_LANGUAGE_ALL, 
    SORT_CHINESE, SORT_ENGLISH, 
    SORT_JAPANESE, SORT_KOREAN, SORT_OTHER,
    SORT_FILE_NAME, SORT_FILE_SIZE, SORT_FILE_UPDATE_TIME, SORT_FILE_TYPE, SORT_ASC, SORT_DES,
    NOT_LOGIN_UNACTIVE, SHOW_THUMBNAIL_MODE, SHOW_LIST_MODE } from '../../constants/TodoFilters'
import { WIMDOW_UNINSTALL_FONT_DEL, RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST } from '../../constants/ActionsTypes'

const doc = document
let isClick = true
class Menu extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		sortListShow: false,
    		batchEditShow: false,
    		filter: this.props.inItData ? this.props.inItData : SORT_ALL,
    		filter_text: '筛选',
    		noticeMessage: {
    			action: true,
    			type: 'ALL'
    		}
    	};
    	this.oneBodyClick = this.oneBodyClick.bind(this)		
	}
    loginPoint(event) {
        event.stopPropagation();
        event.preventDefault();    	
        if( !this.props.login.loginUserData || !this.props.login.loginUserData.id ){
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_CONFIRM,
                title: '提示',
                text: '暂不支持该操作，请登录后操作',
                code: NOT_LOGIN_UNACTIVE,
                model: 'GO_LOGIN'
            })          
            return false
        } 
        return true     
    }		
	noticeMessageFn(data, event){
        event.stopPropagation();
        event.preventDefault();
        let msgText = '';
        if( !data.action ){
        	if( data.type == 'SCAN' ){
                msgText = '正在扫描中，请稍候再操作'
        	}else{
        		msgText = '正在等待中，请稍候再操作'
        	}
        }else{
        	let msgText = '请刷新后再重试';
        }
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: msgText,auto: true,speed: 1500,statu: 0})
	}
	menuItemBtn(elem, event) {
        event.stopPropagation();
        event.preventDefault();
        switch(elem.value) {
        	case MENU_UNINSTALL:
	        	const checkIds = this.props.checkIds
	        	if( !isEmpty(checkIds) && checkIds.length > 0 ){
	        		let uninstall = [];
	        		const li_Elem = doc.querySelectorAll('.list-ul .item-cf');
                    for( let i = 0; i < checkIds.length; i++ ){
	                    for( let j = 0; j < li_Elem.length; j++ ){
	                    	const fid = li_Elem[j].querySelector('.hidden.font_id').value,
	                              f_state = li_Elem[j].querySelector('.hidden.font_state').value,
	                              btn_Elem = li_Elem[j].querySelector('.right-abtn-height .btn-text'),
	                              get_state = getFontState(f_state);
	                    	if( fid == checkIds[i] ){
	                    		if( get_state === GET_FONT_STATE.installed ){
	                    			uninstall.push({font_id: fid, is_delete_file: false})
	                    		}
	                    		break;
	                    	}
	                    }
                    }      
                    if( uninstall.length > 0 ){              
						this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_CONFIRM,title: "字体卸载",text: "确认卸载选中的"+ uninstall.length +"个字体？",checkBox: "同时删除该字体文件，且在“回收站”不可找回",code: WIMDOW_UNINSTALL_FONT_DEL,codeData: uninstall}) 	
					} else{
						this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要卸载的字体",auto: true,speed: 1500,statu: 0})						
					}       		
				}else{
					this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要卸载的字体",auto: true,speed: 1500,statu: 0})
				}
				break

			case MENU_COLLECT:
			case MENU_UNCOLLECT:
			    if( this.props.login.loginUserData ){
			        const loginData = this.props.login.loginUserData;
			        if( loginData && loginData.id != null && loginData.id > 0 ){ 
			        	const checkIds = this.props.checkIds;
			        	if( !isEmpty(checkIds) && checkIds.length > 0 ){
			        		const li_Elem = doc.querySelectorAll('.list-ul .item-cf'),
                                  collect = [];
				        	for( let i = 0; i < checkIds.length; i++ ){
				        		for( let j = 0; j < li_Elem.length; j++ ){
				        			const fid = li_Elem[j].querySelector('.hidden.font_id').value,
									      child_Elem = li_Elem[j].querySelector('.item-left .item-info .ii-fn'),
				                          a_Elem = child_Elem.firstChild.firstChild,
				                          i_Elem = a_Elem.firstChild;				                          
				                    if( fid == checkIds[i] ){
				                        if( elem.value === MENU_COLLECT ){  
								            if( i_Elem.className == 'icons icons-18 fn-collect' ){
								            	collect.push(checkIds[i]);
								            }
							        	}else{
								            if( i_Elem.className == 'icons icons-18 fn-collected' ){
								            	collect.push(checkIds[i]);
								            }							        		
							        	}
							            break    
						            } 
				        		}
				        	} 
                            if( collect.length > 0 ){
                        		setTimeout(() => {
                        			if( elem.value === MENU_COLLECT ){ 
										this.props.actions.unOrCollectFonts(loginData.id, collect.join(','), 1)
									}else{
										this.props.actions.unOrCollectFonts(loginData.id, collect.join(','), 0)
									}
                        		}, 30)
                            }else{
								this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要操作字体",auto: true,speed: 1500,statu: 0})                            	
                            }
			        	}else{
							this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要操作的字体",auto: true,speed: 1500,statu: 0})			        		
			        	}
			        }
			        return false
			    } 
			    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录后才能收藏字体",auto: true,speed: 1500,statu: 0})    			
			    break

			case  MENU_INSTALL:
	        	const checkIds_2 = this.props.checkIds;
	        	if( !isEmpty(checkIds_2) && checkIds_2.length > 0 ){
	        		let install = [];
	        		const li_Elem = doc.querySelectorAll('.list-ul .item-cf');
                    for( let i = 0; i < checkIds_2.length; i++ ){
	                    for( let j = 0; j < li_Elem.length; j++ ){
	                    	const fid = li_Elem[j].querySelector('.hidden.font_id').value,
	                              f_state = li_Elem[j].querySelector('.hidden.font_state').value,
	                              btn_Elem = li_Elem[j].querySelector('.right-abtn-height .btn-text'),
	                              get_state = getFontState(f_state);
                            
	                    	if( fid == checkIds_2[i] ){
	                    		if( get_state === GET_FONT_STATE.not_install ){
		                    		install.push({font_id: checkIds_2[i]})
								    btn_Elem.innerHTML = '安装中'
								    btn_Elem.className = 'btn-text installing'
							    }
							    break;	 
	                    	}
	                    }
                    }
                    if( install.length > 0 ){
                    	this.props.actions.installFontAdd(install)
                	}else{
						this.props.actions.triggerDialogInfo({
							type: SHOW_DIALOG_ALERT,
							text: "请至少选择一个要安装的字体",
							auto: true,
							speed: 1500,
							statu: 0
						})                		
                	}
				}else{
					this.props.actions.triggerDialogInfo({
						type: SHOW_DIALOG_ALERT,
						text: "请至少选择一个要安装的字体",
						auto: true,
						speed: 1500,
						statu: 0
					})
				}
			    break 
            
            case MENU_REFRESH:
                try{
    				window.refreshScanFontRequest();
    		        this.state.scanTimeout = setTimeout(() => {
    					this.props.actions.isScanFinishedRequest(); 
    		        }, 100)
                }catch(e){
                    log('---刷新调用的方法出错啦---')
                }				
                break

            case MENU_DOWNLOAD:
	        	const checkIds_3 = this.props.checkIds,
	        	      login = this.props.login;
	        	if( !login.loginUserData || !login.loginUserData.id ){
					this.props.actions.triggerDialogInfo({
						type: SHOW_DIALOG_ALERT,
						text: "请先登录后再下载",
						auto: true,
						speed: 1500,
						statu: 0
					}) 	        		
	        		return false
	        	}      
	        	if( !isEmpty(checkIds_3) && checkIds_3.length > 0 ){
	        		let download = [],
                        fontsArr = [],
                        undownload = [];
	        		const li_Elem = doc.querySelectorAll('.list-ul .item-cf');
                    for( let i = 0; i < checkIds_3.length; i++ ){
	                    for( let j = 0; j < li_Elem.length; j++ ){
	                    	const fid = li_Elem[j].querySelector('.hidden.font_id').value,
	                    	      f_state = li_Elem[j].querySelector('.hidden.font_state').value,
				                  btn_Elem = li_Elem[j].querySelector('.item-right .abtn'),
				                  i_Elem = btn_Elem.querySelector('i'),
                                  font_name = li_Elem[j].querySelector('.ii-name .text').innerText,
				                  get_state = getFontState(f_state);
				            if( fid == checkIds_3[i] ){
				            	if( get_state === GET_FONT_STATE.download ){
                                    download.push(fid)
                                    fontsArr.push({font_id: fid, file_name: font_name, download_state: -1})
					                btn_Elem.disabled = true
					                btn_Elem.querySelector('.btn-text').innerHTML = '下载中'
					                i_Elem.className = 'radial';
					                if( i_Elem.firstChild ){
					                    $(i_Elem.firstChild).remove()
					                }
					                $(i_Elem).radialIndicator({
					                      radius: 8,
					                      barColor: '#0C73C2',
					                      barWidth: 2,
					                      initValue: 0,
					                      barBgColor: '#CCCCCC',
					                      displayNumber: false
					                });
				            	}else if( get_state === GET_FONT_STATE.not_download ){
                                    const fontStr = li_Elem[j].querySelector('.item-info .text').innerText;
                                    undownload.push(fontStr);
                                }
				            	break;
			                }
	                    }
                    }
                    if( download.length > 0 ){
                    	this.props.actions.addGetDownloadFont(download, fontsArr)
                        const unlen = undownload.length;
                        if( unlen > 0 ){
                            if( unlen == 1 ){
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: undownload[0]+"字体无法下载",auto: true,speed: 3500,statu: 0}) 
                            }else{
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: undownload.slice(0,5).join("、")+"等"+ undownload.length +"个字体无法下载",auto: true,speed: 3500,statu: 0}) 
                            }
                        }                            
                	}else{
                        const unlen = undownload.length;
                        if( unlen > 0 ){
                            if( unlen == 1 ){
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "应版权方要求该字体暂时无法下载 >_<",auto: true,speed: 2000,statu: 0}) 
                            }else{
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: undownload.slice(0,5).join("、")+"等"+ undownload.length +"个字体无法下载",auto: true,speed: 3500,statu: 0}) 
                            }
                        }else{
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要下载的字体",auto: true,speed: 1500,statu: 0})
                        }
                	}
				}else{
					this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一个要下载的字体",auto: true,speed: 1500,statu: 0})
				}
			    break                        
            
            case MENU_IMMEDIATELY_SCAN:
                //1马上扫描，这里不执行扫描接口，而是通知左侧扫描主区域进行扫描
                //2 改版---这里的扫描是扫描当前打开的路径里所有的文件
                const $table_Elem = $('.file-list-table .table'),
                      datapath =  $table_Elem.data('path'),
                      pathArray = [];
                if( datapath ){
                    pathArray.push(datapath)
                }
                if( pathArray.length > 0 ){
					//通知左侧扫描区域激活扫描。
                	this.props.actions.addScanMessage({statu: 'active', type: 'RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST', data:{add: pathArray}})
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请先选择要扫描的文件夹",auto: true,speed: 1500,statu: 0}) 
                }                 
                break;

            case MENU_DEL:
                //删除----本地素材删除按扭转移到右键菜单(smart-menu)
                const $li_Elem2 = $('.file-list-table .scllorBar_commonList').find('.file-item'),
                      del = [],
                      del_scan = [];
                $li_Elem2.each((indexLi, elemLi) => {
                	if( $(elemLi).hasClass('active') ){
                        const li_path = $(elemLi).data('path'),
                              hasScan = $(elemLi).data('isscan');
                        if( hasScan ){
                        	del_scan.push(li_path)
                        }else{
                        	del.push(li_path)
                        }
                	}
                })

                if( del.length > 0 || del_scan.length > 0 ){
                	this.props.actions.triggerDialogInfo({
                		type: SHOW_DIALOG_CONFIRM,
                		title: "提示",
                		text: "确认删除选中的文件夹或文件吗？",
                		checkBox: "同时永久删除该文件夹或文件，且在“回收站”不可找回",
                		code: RECEVIE_ASYNC_DELECTE_SCAN_DOCS_REQUEST,
                		codeData: {del: del, del_scan: del_scan}}) 
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请选择删除的文件夹或文件",auto: true,speed: 1500,statu: 0}) 
                }                 
                break;                    

			default:
			  return false       	
        }		
	}
	allCheckItem(event) {
        event.stopPropagation();
        event.preventDefault();
		const i_Elem = event.currentTarget.firstChild
        if( i_Elem ){
            if( i_Elem.classList.contains('fn-checked') ){
                i_Elem.classList.remove('fn-checked')
                i_Elem.classList.add('fn-check')
                this.props.actions.fontAllCheckItem(null, false)                
            }else{
                i_Elem.classList.remove('fn-check')
                i_Elem.classList.add('fn-checked')
                this.props.actions.fontAllCheckItem(this.props.fonts.fontListData.data.list, true)
            }
        }
	}
	sortListShow(event){
        event.stopPropagation();
        event.preventDefault();
        this.setState({
        	sortListShow: !this.state.sortListShow
        })        		
	}
	batchEditSelectShow(event){
        event.stopPropagation();
        event.preventDefault();
        this.setState({
        	batchEditShow: !this.state.batchEditShow
        }) 		
	}
	filterIncluded(item, event){
		
	}
	sortSelectItem1(item, event){
        event.stopPropagation();
        event.preventDefault();		      
        if( this.props.fonts.common ){
            const t_c = this.props.fonts.common 
            switch(item.value){
            	case SORT_ALL:
                case SORT_INSTALLED:
                case SORT_UNINSTALL:
                case SORT_CLOUD:            	
		        	t_c.offset = 0;
                    t_c.InstallTime = -1;
                    t_c.language = 0x0001; 
                    t_c.type = item.type;                   
                	break;

                case SORT_DAY:
                case SORT_WEEK:
                case SORT_MONTH:
                    t_c.offset = 0;
                    t_c.type = 0;
                    t_c.language = 0x0001;
                    t_c.InstallTime = item.time;
                    if( t_c.PageName == PAGE_TYPE.Font_Assistant.installed_font.PageName ||
                        t_c.PageName == PAGE_TYPE.Font_Assistant.uninstall_font.PageName ){
                    	t_c.PageName = PAGE_TYPE.Font_Assistant.local_font.PageName;
                    }
                    break;

                case SORT_LANGUAGE_ALL:
                case SORT_CHINESE:
                case SORT_ENGLISH:
                case SORT_JAPANESE:
                case SORT_KOREAN:
                case SORT_OTHER:
                    t_c.offset = 0;
                    t_c.type = 0;
                    t_c.InstallTime = -1;
                    t_c.language = item.language;

                    if( t_c.PageName == PAGE_TYPE.Font_Assistant.installed_font.PageName ||
                        t_c.PageName == PAGE_TYPE.Font_Assistant.uninstall_font.PageName ){
                    	t_c.PageName = PAGE_TYPE.Font_Assistant.local_font.PageName;
                    }
                    break;                        

            	default:
            	break; 
            }
            //联动排序且页面上要显示出来时调用下面方法。
            //this.props.actions.getSortFilterData(item, true) //true表示新增，false表示删除
			setTimeout(() => {
				this.props.actions.getFontRequest(t_c)
			},50)
		    this.refs.sortTextRef.innerHTML = item.text;		        
			//清空events数据
			this.props.actions.eventsInitializationData("sortFilterData");
			//清空fonts数据，但保留common数据
			this.props.actions.initializationLoadingData();
			//清除滚动条,等待加载时样式还原
			if( $(".scllorBar_commonList").length > 0 ){
				$(".scllorBar_commonList").mCustomScrollbar("destroy")
			} 			
			this.setState({
                filter: item.value,
                filter_text: item.text			
			})       	
        }
	}
	sortSelectItem2(item, event){
        event.stopPropagation();
        event.preventDefault();
        const route = this.props.route
		if( item && route && route.data ){
            let sort_type = 0, b_asec = true, data; 
            switch(item.value){
                case SORT_FILE_NAME:
                case SORT_FILE_TYPE:
                case SORT_FILE_SIZE:
                case SORT_FILE_UPDATE_TIME:
                     sort_type = item.key;
                     break;
                case SORT_ASC:
                case SORT_DES:
                     b_asec = item.key;
                     break;                     
                default:
                     break;     
            }
            data = {route: route};
	        if( item.value === SORT_ASC || item.value === SORT_DES ){
	        	this.state.filter[1] = item.value;
                data.route.data['b_asec'] = b_asec 
                data.route.data['b_asec_text'] = item.value                 
	        }else{
	        	this.state.filter[0] = item.value;
                data.route.data['sort_type'] = sort_type
                data.route.data['sort_type_text'] = item.value                
	        }
            //重新调用路由，刷新列表 
            this.props.actions.getInItRoute(data);		
			this.setState({
	            filter: this.state.filter
	        })
        }    		
	}	
    displayMode(mode, event){
        if( isClick ){
            isClick = false
            setTimeout(() => {
                isClick = true
            },500)
            this.props.actions.modeChangeMessage(mode)
        }
        return false
    }	
	oneBodyClick(event) {
		// if( hasClass(event.target, "unHide") && this.state.sortListShow ){				
		// 	return false;
		// }
		// if( hasClass(event.target, "unHideDefault") && this.state.sortListShow ){
	 //        event.stopPropagation();
	 //        event.preventDefault();				
		// 	return false;
		// }		
		if( this.state.sortListShow ){
			setTimeout(() => {
				this.setState({sortListShow: false, filter: this.state.filter})
			},50)
		}
		if( this.state.batchEditShow ){
			setTimeout(() => {
				this.setState({batchEditShow: false})
			},50)			
		}
	}	
	render() {
		const { menu, sort, menuModel, sortModel, displayMode, login } = this.props
		const { filter, filter_text, sortListShow, batchEditShow, noticeMessage } = this.state
		return <div className="function-bar flex flex-c">
		         <div className="menu-fb meun-left flex flex-c flex-l-l flex-item-gsb-0">
                   <ul>
                      {
	                      menu != null && menu.length > 0 ?
		                      menu.map((elem, index) =>
		                          {        
		                          	 if(elem.value == MENU_ALL_CHECK){
		                          	 	return <li key={elem.key} className={!noticeMessage.action ? "msg-disabled flex-item-gsb-0" : "flex-item-gsb-0"}>
			                          	           <a onClick={this.allCheckItem.bind(this)}
			                          	            style={{"width": "20px","paddingRight": "0px"}}>
			                          	              <i className={elem.icons}></i>
			                          	              {elem.text}
			                          	           </a>
			                          	        </li>
		                          	 }else if(elem.value == MENU_BATCH_EDIT){
			                          	 return <li style={{"display":"none"}} key={elem.key} className={!noticeMessage.action || !login.loginUserData  || !login.loginUserData.id ? "msg-disabled flex-item-gsb-0" : "flex-item-gsb-0"}>
			                          	           <a 
			                          	              onClick={
                                                        !login.loginUserData || !login.loginUserData.id ? 
                                                            this.loginPoint.bind(this)
                                                        :
                                                            noticeMessage.action ? 
                                                                this.batchEditSelectShow.bind(this)
                                                            :  
                                                                this.noticeMessageFn.bind(this, noticeMessage)}>
			                          	              <i className={elem.icons}></i>
			                          	              {elem.text}
			                          	              <i className="icons icons-10 list-more-bg"></i>
			                          	           </a>
			                          	           {
			                          	           	   batchEditShow ? 
									                        <span className="abs slide-panel col-6 leyer-panel">
									                            {
									                            	FILE_INCLUDED.map((item, index) => {
									                            		return <em onClick={noticeMessage.action ? this.filterIncluded.bind(this, item)  : this.noticeMessageFn.bind(this, noticeMessage)} key={index} className="slide-item flex flex-c">{item.text}</em>
									                            	})
									                            }
									                        </span>
									                    :
									                        null     			                          	           	      
			                          	           }
			                          	        </li>		                          	 	
		                          	 }else{
		                          	 	 if( elem.value == MENU_IMMEDIATELY_SCAN ){ 
				                          	 return <li 
				                          	            className={!noticeMessage.action || !login.loginUserData  || !login.loginUserData.id ? "msg-disabled flex-item-gsb-0 unbody" : "flex-item-gsb-0 unbody"} 
				                          	            key={elem.key} 
				                          	            onClick={
                                                            !login.loginUserData || !login.loginUserData.id ? 
                                                                this.loginPoint.bind(this) 
                                                            : 
                                                                noticeMessage.action ? 
                                                                   this.menuItemBtn.bind(this, elem) 
                                                                : 
                                                                   this.noticeMessageFn.bind(this, noticeMessage)}>
				                          	           <a className="unbody">
				                          	              <i className={elem.icons}></i>
				                          	              <span className="unbody">{elem.text}</span>
				                          	           </a>
				                          	        </li>
			                          	 } else{
				                          	 return <li 
				                          	            className={!noticeMessage.action ? "msg-disabled flex-item-gsb-0 unbody" : "flex-item-gsb-0 unbody"} 
				                          	            key={elem.key} 
				                          	            onClick={noticeMessage.action ? this.menuItemBtn.bind(this, elem) : this.noticeMessageFn.bind(this, noticeMessage)}>
				                          	           <a className="unbody">
				                          	              <i className={elem.icons}></i>
				                          	              <span className="unbody">{elem.text}</span>
				                          	           </a>
				                          	        </li>			                          	 	
			                          	 }      
		                          	 }
		                          }	                                 
		                      )
		                   :
		                      null 
	                   }  
                   </ul>
		       </div>
               <div className="menu-right flex flex-c flex-r-r flex-item-gsb-1">
    		       {
    		       	   displayMode ?
    		       	       <div className="display-mode flex flex-c flex-c-c flex-item-gsb-0">
                              {
                                  displayMode === SHOW_LIST_MODE ?
    		       	                  <i className="icons-local-material icons-20 thumbnail-mode-bg" onClick={this.displayMode.bind(this, SHOW_THUMBNAIL_MODE)}></i>
                                  :
                                  displayMode === SHOW_THUMBNAIL_MODE ?
                                      <i className="icons-local-material icons-20 list-mode-bg" onClick={this.displayMode.bind(this, SHOW_LIST_MODE)}></i>
                                  :
                                      null    
                              }
    		       	       </div>
    		       	   :
    		       	       null    
    		       }
                   {
                        sort ?
                            <div className="sort-fb flex flex-c flex-c-c flex-item-gsb-0" onClick={this.sortListShow.bind(this)}>
                                {
                                	!sortModel || sortModel != 2 ?
                                	    <i className="icons icons-18 sort-list-bg"></i>
                                	:
                                	    <i className="icons-local-material icons-20 sort-list-bg2"></i>    
                                }
                                {
                                	!sortModel || sortModel != 2 ?
                                	    <span ref="sortTextRef" className="">{filter_text}</span>
                                	:
                                	    <i className="icons icons-10 list-more-bg"></i>    
                                }
                                
                                {
                                	sortListShow ? 
    		                            <ul className="abs unHide">
    		                                {
    		                                 	sort.map((elem, index) => {
    		                                 		if( isEmpty(elem.data) ){
    		                                 			//单排数据
    			                                 		return  <li key={index} 
    			                                 		            onClick={!this.props.sortModel || this.props.sortModel != 2 ? this.sortSelectItem1.bind(this,elem) : this.sortSelectItem2.bind(this,elem)} 
    			                                 		            className={elem.value == filter ? "active unHide" : "unHide"}>
    					                                 		    {
    					                                                elem.value == filter ?
    					                                                    <i className="icons icons-18 sort-select-bg abs unHide"></i>
    					                                                :
    					                                                    null     
    					                                 		    }
    					                                 		    <span className="font-weight7 unHide">{elem.text}</span>
    					                                 		</li>    
    		                                 		}else{
    		                                 			//双排数据
    		                                 		    return  <li key={index} className="list unHideDefault">
    					                                 		    <span className="font-weight7 unHideDefault">{elem.text}</span>
    					                                 		    {
    					                                 		    	elem.data && elem.data.length > 0 ?
    					                                 		    	   <ul className="sublist unHide">
    					                                 		    	      {
    					                                 		    	      	 elem.data.map((list, indexs) => {
    					                                 		    	      	 	return <li key={indexs} 
    					                                 		    	      	 	            onClick={!this.props.sortModel || this.props.sortModel != 2 ? this.sortSelectItem1.bind(this,list) : this.sortSelectItem2.bind(this,list)} 
    					                                 		    	      	 	            className={list.value == filter ? "active unHide" : "unHide"}>
    	                                                                                        {
    												                                                filter.constructor == String && list.value == filter && (!this.props.sortModel || this.props.sortModel != 2) ?
    												                                                    <i className="icons icons-18 sort-select-bg abs unHide"></i>
    												                                                :
    												                                                filter.constructor == Array && list.value == filter[index] && this.props.sortModel && this.props.sortModel == 2 ?
                                                                                                        <i className="icons-6 select-filter-bg flex flex-l-l flex-item-gsb-0"></i>
    												                                                :
    												                                                    null                                                                                        	
    	                                                                                        }
    	                                                                                        <span className="unHide">{list.text}</span>
    					                                 		    	      	 	        </li>
    					                                 		    	      	 }) 
    					                                 		    	      }
    					                                 		    	   </ul>
    					                                 		    	:
    					                                 		    	   null    
    					                                 		    }
    				                                 			</li>
    				                                } 			
    		                                 	})
    		                                }
    		                            </ul>
    		                        :
    		                            null                                	
                                }
                            </div>
                        :
                            null
                   } 
               </div>		       
		   </div>  
	}
	componentDidMount() {
		//true 捕获， false 冒泡
		document.body.addEventListener('click', this.oneBodyClick)
	}	
	componentWillReceiveProps(nextProps){
		if( nextProps.fonts && nextProps.fonts.active && nextProps.fonts.active == 'search' ){
			this.setState({
				filter: SORT_ALL,
				filter_text: '筛选'
			})
		}
		if( nextProps.noticeMsgLastUpdated !== this.props.noticeMsgLastUpdated ){
			if( nextProps.noticeMsg ){
				if( !nextProps.noticeMsg.action ){
		            this.setState({
			    		noticeMessage: {
			    			action: false,
			    			type: nextProps.noticeMsg.type
			    		}            	
		            })
	        	}else{
		            this.setState({
			    		noticeMessage: {
			    			action: true,
			    			type: 'ALL'
			    		}            	
		            })	        		
	        	}
        	}
		}
        if( nextProps.route && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
            const data = nextProps.route.data;
            if( data && data.b_asec_text == null && data.sort_type_text == null ){
                this.setState({
                    filter: this.props.inItData
                })                
            } else{
                if( data.sort_type_text != null ){
                    this.state.filter[0] = data.sort_type_text;
                }
                if( data.b_asec_text != null ){
                    this.state.filter[1] = data.b_asec_text;
                }
                this.setState({
                    filter: this.state.filter
                })                                                         
            }                        
        }
	}
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }    
    componentDidUpdate(nextProps, nextState) {
        //改更点击时全选样式
        const i_Elem = document.querySelector('.menu-fb .fn-checked')
        if( this.props.checkLastUpdated && nextProps.checkLastUpdated !== this.props.checkLastUpdated ){
            if( this.props.checkIds ){
                if( this.props.checkIds.length < this.props.fonts.fontListData.data.list.length ){
                    if( i_Elem ){
                         i_Elem.className = 'icons icons-18 fn-check'
                    }
                }
            }else{
                if( i_Elem ){
                     i_Elem.className = 'icons icons-18 fn-check'
                }               
            }
            return false
        }        
        if( this.props.checkLastUpdated == null || this.props.checkIds == null ){
            if( i_Elem ){
                 i_Elem.className = 'icons icons-18 fn-check'
            }
        }
        //执行其它操作后的全选样式
        if( isEmpty(this.props.checkIds) ){
            if( i_Elem && hasClass(i_Elem, "fn-checked") ){
                i_Elem.className = "icons icons-18 fn-check"
            } 
        }
        if( this.props.checkIds && this.props.checkIds.length == 0 ){
            if( i_Elem && hasClass(i_Elem, "fn-checked") ){
                i_Elem.className = "icons icons-18 fn-check"
            }           
        }
        if( this.props.fonts && this.props.fonts.fontListData && this.props.fonts.fontListData.data && this.props.fonts.fontListData.data.list ){
            if( this.props.checkIds && this.props.checkIds.length > 0 && this.props.checkIds.length < this.props.fonts.fontListData.data.list.length ){
                if( i_Elem && hasClass(i_Elem, "fn-checked") ){
                    i_Elem.className = "icons icons-18 fn-check"
                }           
            }
        }
    } 
	componentWillUnmount() {
		document.body.removeEventListener('click', this.oneBodyClick)
	}			
}
const mapStateToProps = (state) => {
	return {
		checkLastUpdated: state.events.checkLastUpdated,
		checkIds: state.events.checkIds
	}
}	
export default connect(
  mapStateToProps
)(immutableRenderDecorator(Menu))