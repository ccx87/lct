import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { clientHeight, clientWidth, marginLeftOrTop, domItemHeight, domEachHeight,
         getDropDownStyle1, getDropDownStyle2 } from '../constants/DomConstant'
import { SHOW_DIALOG_ALERT } from '../constants/TodoFilters'
import { isEmpty, log, getFontState, objClone, getmCustomScrollbar, getCss } from '../constants/UtilConstant'
import { ROUTES, FONT_STATE, PAGE_TYPE, GET_FONT_STATE } from '../constants/DataConstant'
import { loadingHtml, msgAlertErrorHtml } from '../constants/RenderHtmlConstant'
import { getOptionsCheck, getCheckBoxSelect, 
	     getUpdataImageFontList, getBengingDownloadFontId, getDownloadingState, getDownloadingState0, getDownloadingState1, 
	     getCollectSelect, getFontsInstall, getFontsUNinstall, getUNinstallCallback } from '../constants/EventsConstant'
import ConfigInfo from '../constants/ConfigInfo'

import DataNull from '../modules/DataNull'
import ListItem from './ListItem'


const doc = document
//字体列表
class commonList extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		timeout: null,
    		downloadTime: null,
    		showLoad: true,
    		loading: false,
    		sortFilter: false,
    		isTemp: false,
    		initDownload: true,
    		ii: 0
    	};
    	log("CommonList");		
	}
	showLoadDiv(_porps) {
		const t_f_f = _porps.fonts && _porps.fonts.fontListData ? _porps.fonts.fontListData : null,
		      t_data = t_f_f && t_f_f.data ? t_f_f.data : null,
		      t_f_c = _porps.fonts.common ? _porps.fonts.common : null;
		if( t_f_f && t_data && t_f_c ){      
			if( t_data ){
				const currNum = t_f_c.fetch_size * ( 1 + t_f_c.offset);
				if( currNum < t_data.total ){
					return true				
				}
			}
		}
		return false	
	}
	getFontListData(noOffset) {
		//noOffset=false在当前页码请求数据
		//下拉刷新
    	if( (!this.state.showLoad || this.state.loading) && (noOffset == null || noOffset) ){
    		log("阻止下拉刷新return false")
    		return false
    	}
		this.state.loading = true
		this.state.initDownload = true
		const load_Elem = doc.querySelector('.scllorBar_commonList .more-load')     
		getDropDownStyle2(load_Elem)   	
		const t_c = this.props.fonts.common,
		      data =  {
		        temp: 0,   
		        preview_text: t_c.preview_text,
	            search_text: t_c.search_text,
	            height: t_c.height,
	            text_size: t_c.text_size,
	            offset: !isEmpty(noOffset) && !noOffset ? t_c.offset : t_c.offset + 1,
	            fetch_size: t_c.fetch_size,
	            type: t_c.type,
	            language: t_c.language,
	            user_id: t_c.user_id,
	            PageName: t_c.PageName,
	            InstallTime: t_c.InstallTime			
			}; //此处不能直接引用或克隆对象，因为前后数据有对比操作

		this.state.timeout = setTimeout(() => {
			//this.props.actions.getFontRequest(data)
			//this.props.actions.asyncCallbackRequest(data, this.props.dispatch)
			this.props.actions.asyncGetFontRequest(data)		
		},30)		
	}
	delSortFilterItem(elem, event){
		this.props.actions.getSortFilterData(item, false)
	}		
	render() {
		const { fonts, inititlizeteCompleted, pullFonts, PullLastUpdated, sortFilterData } = this.props;
		const { sortFilter } = this.state;
		const hasData = fonts.fontListData != null && fonts.fontListData.data != null ? true : false,
		      error = fonts.error_code && fonts.error_code == 101 ? true : false,
		      isLizete = inititlizeteCompleted ? document.querySelector('.dialog-main #Scan') : false;
		let h=0, listData = null;
		if( hasData ){
			this.state.showLoad = this.showLoadDiv(this.props)
			listData = fonts.fontListData.data.list;	
			h = fonts.common.height + "px";
		}
		return  <div className="list scllorBar_commonList" ref="clientHeight" style={{"height": "100%"}}>
			      {
			      	  sortFilter && sortFilterData && sortFilterData.length > 0 ?
			      	      <p className="sort-list">
			      	         <span className="title font-weight7">字体筛选</span>
			      	         {
			      	         	sortFilterData.map((elem, lens) => {
			      	         		return  <span className="item" key={lens}>
							      	            <span className="text">{elem.text}</span>
							      	            <i onClick={this.delSortFilterItem.bind(this, elem)} className="icons icons-18 close-dialog-bg"></i>
							      	        </span>
			      	         	})
			      	         }			      	         
			      	      </p>
			      	  :
			      	      null    
			      }
	              <ul className="list-ul">
	                 {
	                 	hasData ?	                 	
	                 	    listData && listData.length > 0 ?
			                 	listData.map((item, index) =>
			                 	     <ListItem 
		             	     	          h={h}
		             	     	          item={item}
		             	     	          key={index}
		             	     	          index={index} 
		             	     	          {...this.props} />        			                 	 
			                 	)
			                :
			                    <DataNull {...this.props}/>  	
		                :
		                   error ?
                               msgAlertErrorHtml(fonts.error) 
		                   :

					           inititlizeteCompleted != null &&  inititlizeteCompleted.data ?
					               !isLizete ?
						               inititlizeteCompleted.data.status == 1 ?
						           	      null
						           	   :
						           	   inititlizeteCompleted.data.status == 0 || inititlizeteCompleted.data.status == 2 || inititlizeteCompleted.data.status == 3 ?
						           	      loadingHtml(true)
						           	   :
						           	      null
						           	:
						           	   null                
					           :
					               loadingHtml(true) 		                    	
	                }
		            {
		              	hasData ?
		              	    listData && fonts.fontListData.data.total > ConfigInfo.page.fetch_size ?  
			              	   this.state.showLoad ?  
				                     <div className="more-load" ref="clientWidth">
				                     	  <p className="p-1">下拉加载更多，您也可以点击<a href="javascript:;" onClick={this.getFontListData.bind(this)}  className="col-lan">这里</a></p>
			                       	      <p className="p-2"><i className="loading-bg"></i>正在加载中，请稍候</p>
				                     </div>
			                    :
		                             fonts.afterFids && fonts.afterFids.length > 0 && fonts.common ?
		                                 fonts.afterFids.length == ConfigInfo.page.fetch_size ?
			                                  fonts.common.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ?
	                                               null
	                                          :
								                  <div className="more-load" ref="clientWidth">
							                       	   <p className="p-2" style={{"display":"block"}}><i className="loading-bg"></i>正在加载云端字体中，请稍候</p>
								                  </div>
								         :
							                  <div className="more-load" ref="clientWidth">
						                       	   <p className="p-2" style={{"display":"block"}}><i className="loading-bg"></i>正在加载中，请稍候</p>
							                  </div> 								                      
		                             :   
					                      <div className="more-load">
					                        <p className="col-lan" style={{"display": "block"}}>没有更多字体了</p>
					                      </div>
			                :
			                listData && fonts.fontListData.data.total <= ConfigInfo.page.fetch_size ?
	                         		fonts.afterFids && fonts.common && fonts.afterFids.length > 0 && fonts.afterFids.length < fonts.common.fetch_size ?
		                                  fonts.common.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ?
                                               null
                                          :	                         		    
							                   <div className="more-load" ref="clientWidth">
						                       	    <p className="p-2" style={{"display":"block"}}><i className="loading-bg"></i>正在加载云端字体中，请稍候</p>
							                   </div>
					                :
					                    null                                              
	                        :

			                    null     
			            :
			                null      
		            }	                	                 
	            </ul>	            
	        </div>
	}
	componentDidMount() {
		if( this.props.fonts.common && this.props.fonts.common.PageName !==  PAGE_TYPE.Font_Assistant.search_font.PageName ){
			getmCustomScrollbar($(".scllorBar_commonList"), this)
		}
	}
	prevoewImageFn(previewData) {
        if( previewData.error_code && previewData.error_code == 101 ){
        	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: previewData.error, auto: true,speed: 1500,statu: 0})
        	return false
        }  
        if( previewData.callback.error_code && previewData.callback.error_code == 101 ){
        	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: previewData.callback.error, auto: true,speed: 1500,statu: 0})
        	return false
        }              
        const t_fonts = this.props.fonts.fontListData,
              t_data = t_fonts && t_fonts.data && t_fonts.data.list,
              p_data = previewData.callback.data;           
		if( t_data && t_data.length > 0 && p_data && p_data.length > 0 ){             
            getUpdataImageFontList(p_data, t_data)                  	
		}          
	}
	componentWillReceiveProps(nextProps){
		log('commonList===componentWillReceiveProps===>') 
		log(nextProps)
		log(this.props)
		const t_p = this.props,
		      actions = t_p.actions,
		      li_Elem = doc.querySelectorAll('.list-ul .item-cf'),
		      login_id = this.props.login && this.props.login.loginUserData && this.props.login.loginUserData.id,
              listData = nextProps.fonts.fontListData && nextProps.fonts.fontListData.data && nextProps.fonts.fontListData.data.list;
        //路由更新时
        if( nextProps.routeLastUpdated !== this.props.routeLastUpdated ) {
        	this.state.initDownload = true
        }
        //新数据更新时
        if( nextProps.fonts.lastUpdated !== this.props.fonts.lastUpdated ){
			//缓存正在下载的id
			if( listData && listData.length > 0 ) {
				this.state.ii = 0
				if( nextProps.downloadBeging && !isEmpty(nextProps.downloadBeging.result) ){
					if( this.state.initDownload || nextProps.downloadBeging.result !== this.props.downloadBeging.result ){
						if( listData.some(item => item.font_id == nextProps.downloadBeging.result ) ){
							setTimeout(() => {
								console.log('新列表数据更新时有对应的下载列表：', login_id, nextProps)
								//初始化下载--第二步
								getDownloadingState0(actions, nextProps.downloadBeging);
							},500)
							this.state.initDownload = false 
						}
					} 
				}else{
					 if( this.state.initDownload && nextProps.downloadIds && nextProps.downloadIds.length > 0 ){
		        		console.log('第一步0：', nextProps.downloadIds[0])
		        		this.state.initDownload = false
		        		getDownloadingState(actions, login_id, nextProps.downloadIds); 
	        		}                  
				}  				
			}
			//返回数据时有错提示
			if( nextProps.fonts.error_code && nextProps.fonts.error_code == 101 ){
				this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: nextProps.fonts.error, auto: true,speed: 2000,statu: 0})
			    return
			}						
        } 

        //点击下载按扭或列队第一个--第一步
        if( nextProps.addDownloadLastUpdated !== this.props.addDownloadLastUpdated ){
        	if( login_id ){
        		console.log('第一步1：', nextProps.downloadIds[0])
        		getDownloadingState(actions, login_id, nextProps.downloadIds);
            }else{
            	actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "要下载字体，请先登录！",auto: true,speed: 1500,statu: 0})
            }
        }
        //下载第二步
        if( nextProps.downloadBegingLastUpdated !== t_p.downloadBegingLastUpdated ){
        	console.log('第二步：', nextProps.downloadBeging && nextProps.downloadBeging.result)
        	getDownloadingState0(actions, nextProps.downloadBeging)
        } 

        //下载第三步
		if( nextProps.downloadLastUpdated !== t_p.downloadLastUpdated ){
	        //下载中
    		if( nextProps.downloadListData && this.props.downloadListData && nextProps.downloadListData[0] && this.props.downloadListData[0] &&
    			nextProps.downloadListData[0].downloaded_progress < this.props.downloadListData[0].downloaded_progress ){
                console.log('下载进度回朔，pass掉, 重新调用第二步')
                getDownloadingState0(actions, nextProps.downloadBeging)
                return
    		}
    		//if( nextProps.downloadListData && this.props.downloadListData && nextProps.downloadListData[0] && this.props.downloadListData[0] && 
    		//	nextProps.downloadListData[0].downloaded_progress == 100 && nextProps.downloadListData[0].downloaded_progress == this.props.downloadListData[0].downloaded_progress ) {
      //          actions.initializationEventsCallback('DOWNLOAD', [nextProps.downloadListData[0].font_id])
      //          console.log('已经下载完成了')
      //          return
    		//}
            setTimeout(() => {
			    const new_li_Elem = doc.querySelectorAll('.list-ul .item-cf'),
	                  new_listData = nextProps.fonts.fontListData && nextProps.fonts.fontListData.data && nextProps.fonts.fontListData.data.list;                     	
               console.log('第三步1：', nextProps.downloadListData, new_li_Elem, new_listData, actions)
               getDownloadingState1(nextProps.downloadListData, new_li_Elem, new_listData, actions)
            }, 200)
		}
        //安装
        if( nextProps.installLastUpdated && nextProps.installLastUpdated !== t_p.installLastUpdated ){
            getFontsInstall(nextProps.installIds, t_p.fonts.fontListData.data.list, actions, li_Elem, t_p.fonts)
			if( !listData || listData.length == 0 ){
				//检测到没有显示的字体，但还有下一页数据时重新请求当前页，最多请求3次
                const hasArr = this.showLoadDiv(nextProps)
                if( hasArr && this.state.ii < 3 ){
                	this.state.ii = this.state.ii + 1
                    this.getFontListData(false)
                }
			}            
        }
		//卸载
		if( nextProps.uninstallLastUpdated && nextProps.uninstallLastUpdated !== t_p.uninstallLastUpdated ){
            getFontsUNinstall(nextProps.uninstallIds, nextProps.fonts, t_p.fonts, actions, li_Elem)
		}
		//卸载后重新获取该字体状态，判断其是否可下载
		if( nextProps.unInstallCallback && nextProps.unInstallCallbackLastUpdate !== this.props.unInstallCallbackLastUpdate ){
			getUNinstallCallback(nextProps.unInstallCallback.data, this.props.fonts)
		}
        
		//替换预览图----本地
		if( nextProps.previewImageLocal && nextProps.previewImageLocalLastUpdate !== this.props.previewImageLoaclLastUpdate ){
            console.log("本地开始替换预览图++")
            this.prevoewImageFn(nextProps.previewImageLocal)         
		} 
		//替换预览图----云端
		if( nextProps.previewImageYun && nextProps.previewImageYunLastUpdate !== this.props.previewImageYunLastUpdate ){
            console.log("云端开始替换预览图++") 
            this.prevoewImageFn(nextProps.previewImageYun)          
		}
		//筛选
		if( nextProps.sortFilterData && nextProps.sortFilterLastUpdated !== this.props.sortFilterLastUpdated ){
            if( nextProps.sortFilterData.length > 0 ){
	            this.setState({
	            	sortFilter: true
	            })
        	}
		}				        				
	}
	shouldComponentUpdate (nextProps, nextState){
		log('commonList===shouldComponentUpdate===>')
		log(nextProps)
		log(this.props)
		const t_p = this.props,
		      actions = t_p.actions,
		      li_Elem = doc.querySelectorAll('.list-ul .item-cf'); 
		// 复选框--选择         
		if( nextProps.checkLastUpdated && nextProps.checkLastUpdated !== t_p.checkLastUpdated ){
			return getCheckBoxSelect(nextProps.checkIds, nextProps.unCheckIds, this.props.unCollectIds, li_Elem)
		}
		//收藏--or--取消收藏
		if( nextProps.collectLastUpdated && nextProps.collectLastUpdated !== t_p.collectLastUpdated ){
			const page = nextProps.fonts.common && nextProps.fonts.common.PageName;
			const isUpdate = getCollectSelect(nextProps.collectIds, nextProps.unCollectIds, nextProps.fonts.common, actions, li_Elem);
		    if( li_Elem && page == PAGE_TYPE.Font_Assistant.my_collection.PageName ){
		    	let isShow = false
		    	for( let i = 0, lens = li_Elem.length; i < lens; i++ ){
		    		if( getCss(li_Elem[i],'display') === 'block' ){
		    			isShow = true
                        break;
		    		}
		    	}
		    	if( !isShow ){
		    		//查找下一页字体数据
		    		this.getFontListData(false)
		    	}
        	}
		    return isUpdate
		}	
		if( nextProps.downloadLastUpdated !== this.props.downloadLastUpdated ){
			return false
		}							
		return true
	}
	componentDidUpdate(nextProps, nextState) {
        log('commonList===componentDidUpdate===>')
        log(nextProps)
        log(this.props)
		const n_c = nextProps.fonts.common,
              t_c = this.props.fonts.common,        		
              load_Elem = doc.querySelector('.scllorBar_commonList .more-load'),
              li_Elem = doc.querySelectorAll('.list-ul .item-cf');		

		if($('.list > .mCustomScrollBox').length <= 0 && this.props.fonts.error_code != 101 ){
			//重新调用滚动插件
			log('重新调用滚动插件')
			getmCustomScrollbar($(".scllorBar_commonList"), this)
		}
		if($('.alert-dialog-layer').length > 0 && this.props.fonts.error_code == 101){
			marginLeftOrTop($('.alert-dialog-layer'));			
		}             
		if( n_c && t_c ){
			//设置滚动条
			if( n_c.offset != t_c.offset || n_c.font_size != t_c.font_size || nextProps.resize.h !== this.props.resize.h ){
				getmCustomScrollbar($(".scllorBar_commonList"), this, "update")
			}
			//设置等高
	    	if( n_c.text_size !== t_c.text_size || n_c.offset !== t_c.offset || 
	    		(nextProps.fontListData == null && this.props.fonts.fontListData) ){
	    		domEachHeight(this.props.fonts.common.height, $('.right-abtn-height'), $('.check-lable-height'))  		
	    	}
	    	//设置下拉加载样式1			
	    	if( this.state.loading && this.state.showLoad ){
	    		if( this.props.fonts.afterFids && this.props.fonts.afterFids.length > 0 ){

	    		}else{
		    		getDropDownStyle1(load_Elem)	    		
		            setTimeout(() => {
		                this.state.loading = false
		            }, 20)
	        	}
	    	}
	    	//设置下拉加载
	    	if( n_c.temp == 1 && n_c.temp == t_c.temp ){
	    		if( this.props.fonts.afterFids && this.props.fonts.afterFids.length > 0 ){

	    		}else{	    		
		            setTimeout(() => {
		                this.state.loading = false
		            }, 20)
	        	}	    			    		
	    	}
    	}
        //新数据更新时
        if( nextProps.fonts.lastUpdated !== this.props.fonts.lastUpdated ){        	
            //有下载的字体时处理
			if( this.props.downloadIds && this.props.downloadIds.length > 0 &&
			    this.props.fonts.fontListData && li_Elem && li_Elem.length > 0 ){
				this.props.downloadIds.forEach((item, index) => {
					for(let i = 0, lens = li_Elem.length; i < lens; i++){
                        const fid = li_Elem[i].querySelector('.hidden.font_id').value;
                        const loadId = this.props.downloadListData && this.props.downloadListData[0];
                        if( fid == item && fid != loadId ){
			                const a_Elem = li_Elem[i].querySelector('.item-right .abtn'),
			                      i_Elem = a_Elem.querySelector('i');
			                if( a_Elem.disabled ){
			                	break;
			                }      
			                a_Elem.disabled = true
			                a_Elem.querySelector('.btn-text').innerText = '下载中'
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
			                break;                        	
                        }
					}
				})
			}
			//返回数据时出错处理
			if( this.props.fonts.error_code && this.props.fonts.error_code == 101 ){
	    		getDropDownStyle1(load_Elem)	    		
	            setTimeout(() => {
	                this.state.loading = false
	            }, 20)			
			} 
        	//收藏列表是否有隐藏li
		    if( li_Elem && nextProps.fonts.common && nextProps.fonts.common.PageName == PAGE_TYPE.Font_Assistant.my_collection.PageName ){
		    	for( let i = 0, lens = li_Elem.length; i < lens; i++ ){
		    		if( getCss(li_Elem[i],'display') === 'none' ){
		    			li_Elem[i].style.display = 'block'
		    		}
		    	}
        	}												
        }		 	
    	if( nextProps.fonts.common == null && this.props.fonts.common && this.props.fonts.fontListData ){
    		//设置等高
    		domEachHeight(this.props.fonts.common.height, $('.right-abtn-height'), $('.check-lable-height')) 
    	}
        //设置下拉加载样式2
    	if( this.props.fonts.afterFids && this.props.fonts.afterFids.length > 0 ){
    		getDropDownStyle2(load_Elem)    		   		
    	}else{
			getDropDownStyle1(load_Elem)    		    		
    	}    	     	
	}
    componentWillUnmount(){
        clearTimeout(this.state.timeout) 
    }			
}
const mapStateToProps = (state) => {
	log("CommonList-->")
	log(state)
	return {
    	menuSingleData: state.inIt.menuSingleData,
    	singleLastUpdated: state.inIt.singleLastUpdated,

		checkLastUpdated: state.events.checkLastUpdated,	
		checkIds: state.events.checkIds,
		unCheckIds: state.events.unCheckIds,

		collectLastUpdated: state.events.collectLastUpdated,
		collectIds: state.events.collectIds,
		unCollectIds: state.events.unCollectIds,

		uninstallLastUpdated: state.events.uninstallLastUpdated,
		uninstallIds: state.events.uninstallIds,

        installLastUpdated: state.events.installLastUpdated,
		installIds: state.events.installIds,

		pullFonts: state.events.PullDownLoading,
		PullLastUpdated: state.events.PullLastUpdated,
        
        previewImageYun: state.events.previewImageYun,
		previewImageYunLastUpdate: state.events.previewImageYunLastUpdate,

        previewImageLocal: state.events.previewImageLocal,
		previewImageLocalLastUpdate: state.events.previewImageLocalLastUpdate,		

        unInstallCallback: state.events.unInstallCallback,
		unInstallCallbackLastUpdate: state.events.unInstallCallbackLastUpdate,

        sortFilterData: state.events.sortFilterData,
		sortFilterLastUpdated: state.events.sortFilterLastUpdated
	}
}	
export default connect(
  mapStateToProps
)(commonList)
