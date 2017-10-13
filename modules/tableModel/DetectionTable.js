import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { FONT_STATE, GET_FONT_STATE } from '../../constants/DataConstant'
import { loadingHtml } from '../../constants/RenderHtmlConstant'
import { isEmpty, getFontState, log, hasClass, addClass, removeClass } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { getDownloadingState2, getBengingDownloadFontId, getFontsInstall, getmCustomScrollbar } from '../../constants/EventsConstant'
import { jqTableCellDom, clientHeight } from '../../constants/DomConstant'

const doc = document
class DetectionTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		timeout: null,
    		fontNameArray: [],
    		sortListData: null
    	};
    	log("DetectionTable");		
	}	
	downloadFontBtn(item, event) {
        event.stopPropagation()
        event.preventDefault()
        if( this.state.timeout ){
        	clearTimeout(this.state.timeout)
    	}
        if( this.props.login ){
            const login = this.props.login;
            if( login.loginUserData && login.loginUserData.id != null && login.loginUserData.id > 0 ){ 
            	const progress_Elem = event.currentTarget.parentNode.parentNode.previousSibling.querySelector('.progress-bar');
            	if( progress_Elem ){
            		progress_Elem.style.display = 'block'
            	}
            	if( !isEmpty(item.font_id) ){
	            	event.currentTarget.parentNode.style.display = 'none'
	                this.props.actions.addGetDownloadFont(item.font_id, item)
            	}else{
            		const progressText = progress_Elem.querySelector('.progress-text');
            		if( progressText ){
						progressText.className = 'progress-text col-red'
						progressText.innerHTML = '下载失败'
            		}
            	}
                return false 
            }
        } 
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录后才能下载字体",auto: true,speed: 1500,statu: 0})
	}
	installFontBtn(item, event) {
        event.stopPropagation()
        event.preventDefault()    
        if( isEmpty(item.font_id) ){
        	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "安装失败",auto: true,speed: 1500,statu: 0})
        	return false
        }
        event.currentTarget.innerHTML = '安装中...'
        const data = [
            {font_id: item.font_id}
        ]
        this.props.actions.installFontAdd(data) 
	}
  	openFileLocation(path, event) {
        event.stopPropagation()
        event.preventDefault()        
        window.openFileRequest(2, path);
  	}
  	openBaiDuUrl(url, event){
        window.openFileRequest(4, url);
        return false;
  	} 	
    inItSortListData() {
		const { listData, paddedData } = this.props;
		let fnArray = [];
		if( paddedData && paddedData.length > 0 ){
			fnArray = paddedData.map((elem) => elem.orignal_font_name);
		}
		if( fnArray.length > 0 && listData && listData.length > 0 ){
			listData.map((item) => {
				if( fnArray.indexOf(item.orignal_font_name) > -1 ){
					item['sort'] = 1
				}else{
					item['sort'] = 0
				}
				return item
			})
			listData.sort((a,b) => b.sort-a.sort)
		}  
		this.setState({
            fontNameArray: fnArray,
			sortListData: listData
		});  	
    }	
	render() {
		const { sortListData, fontNameArray } = this.state
		return <div className="detection-table">
	                <div className="thead">
	                    <div className="col-1"><span className="sp-line"></span></div>
	                    <div className="col-2"><span className="left-10 sp-line">文件包含字体</span></div>
	                    <div className="col-3">
	                        <span className="left-10 sp-line">云端匹配字体
			                    <span className="msg-help">
			                        <i className="icons icons-20 help-question"></i>
			                        <span className="abs abs-msg" ref="msgHelpRef1">
			                            <span className="sp-1">字体助手会在云端按文件名搜索字体，可能会列出同名的若干字体，这些字体虽然同名但是字体内容不一样，一键补齐时只会补齐其中的第一个。</span>
			                        </span>                   
			                    </span>	                        
	                        </span>
	                    </div>
	                    <div className="col-6" style={{"display":"none"}}>
	                        <span className="left-10 sp-line">字体版本</span>
	                    </div>	                    
	                    <div className="col-4">
	                        <span className="left-10 sp-line">字体状态
			                    <span className="msg-help">
			                        <i className="icons icons-20 help-question"></i>
			                        <span className="abs abs-msg" ref="msgHelpRef2">
			                            <span className="sp-1">【字体缺失】在云端找到但还没下载；</span>
			                            <span className="sp-1">【已安装】已在本地安装；</span>
			                            <span className="sp-1">【字体存在本地未安装】已下载到本地但未安装；</span>
			                            <span className="sp-1">【无法下载】版权等问题无法下载</span>
			                        </span>                   
			                    </span>	                        
	                        </span>	                        
	                    </div>
	                    <div className="col-5">
	                        <span className="left-10 sp-line">操作
	                    		<span className="msg-help" style={{"display":"none"}}>
			                        <i className="icons icons-20 help-question"></i>
			                        <span className="abs abs-msg" ref="msgHelpRef2">
			                            <span className="sp-1">【更新】有新的版本可下载更新；</span>
			                            <span className="sp-1">【下载】可下载；</span>
			                            <span className="sp-1">【安装】已在本地可安装</span>
			                        </span>                   
			                    </span>	                        
	                        </span>
	                    </div>
	                </div>
	                <ul className="table scllorBar_table" ref="clientHeight" style={{"height": "calc(100% - 27px)"}}>
                        {
							sortListData ?
	                       	    sortListData.length > 0 ?
                                    sortListData.map((item, index) => {
                                    	let hasIndex = -1;
                                    	if( fontNameArray.length > 0 ){
                                    	   hasIndex = fontNameArray.indexOf(item.orignal_font_name)
                                    	}
                                        return (
	                                        <li key={index} className="clearfix flex flex-c">
	                                            <div className="col-line-l g-l">
	                                                <div className="col-line table-cell">
			                                            <div className="col-1">
							                    	        <span className="center">
							                    	        {
							                               	    index < 9 ?
							                               	        '0'+ (index+1) +''
							                               	    :
							                               	        (index+1)	                    	         	
							                    	        }
							                    	        </span>                                           
			                                            </div>
			                                            <div className="col-2">
                    	        							<span style={hasIndex > -1 ? {"color": "#c62f2f"} : null} className="left-10 orignal-font-name">
															    {item.orignal_font_name}
							                    	        </span>						                    	                                                      
			                                            </div>
		                                            </div>
	                                            </div>
	                                            <div className="col-line-r g-r">
	                                            {
		                                            item.data.map((elem, i) => {
					                         			const bdurl = 'https://www.baidu.com/s?wd='+ elem.font_name,
					                         		          btn_statu = getFontState(elem.font_state);		                                            	
		                                            	return (
			                                                <div className="col-line flex-important flex-c" key={i}>
					                                            <div className="col-3">
																    {
																    	isEmpty(elem.file_name) ?
																    	    <span className="left-10 sp-text">--</span>
																    	:
																    	    <span className="left-10 sp-text">{elem.file_name}</span>
																    }			                                            
					                                            </div>
					                                            <div className="col-6" style={{"display":"none"}}>
					                                                <span className="left-10 sp-version right-p-10">
					                                                    {
					                                                    	isEmpty(elem.font_version) ? 
					                                                    	    '--' 
					                                                    	: 
					                                                    	    elem.font_version.replace('Version','')
					                                                    }					                                                
					                                                </span>
                                                					{
					                                                	!isEmpty(elem.font_version) ?
                                                                            <span className="abs show-version">
                                                                               {elem.font_version.replace('Version','')}
                                                                            </span>
					                                                	:
					                                                	    null
						                                            }					                                                
					                                            </div>
					                                            <div className="col-4">
										                            {	
										                             	btn_statu == GET_FONT_STATE.installed || btn_statu == GET_FONT_STATE.in_needupdate ?
									                             	        <span className="font-statu left-10">
									                             	            <i className="icons icons-18 font-install-bg"></i>
									                             	            <b>已安装</b>
									                             	        </span>
									                             	    :
									                             	    btn_statu == GET_FONT_STATE.not_install || btn_statu == GET_FONT_STATE.not_in_needupdate ?      
									                             		    <span className="font-statu left-10">
									                             		        <i className="icons icons-18 font-missing-bg"></i>
									                             		        字体存在本地未安装
									                             		    </span>
									                             		:     
									                             		btn_statu == GET_FONT_STATE.download ?     
									                             	        <span className="font-statu left-10">
									                             	            <i className="icons icons-18 font-missing-bg"></i>
									                             	         	字体缺失
									                             	        </span> 
									                             	    :     
									                             	    btn_statu == GET_FONT_STATE.not_download ?     
									                             	        <span className="font-statu left-10">
									                             	            <i className="icons icons-18 font-undownload-bg"></i>
									                             	         	无法下载
									                             	        </span>
									                             	    :         									                             	    
				                         	         						<span className="font-statu left-10">
									                             	            <i className="icons icons-18 font-not-found-bg"></i>
									                             	         	云端未找到
									                             	        </span>								                             	  
												                             	          							                             	              	
										                            }
										                            {
										                            	btn_statu == GET_FONT_STATE.download || btn_statu == GET_FONT_STATE.in_needupdate || btn_statu == GET_FONT_STATE.not_in_needupdate ?
												                            <span className="progress-bar left-10">
												                                <span className="progress-line">
												                                   <i className="progress"></i>
												                                </span>
												                                <span className="progress-text">
												                                   0%
												                                </span> 
												                            </span>
												                        :
												                            null    										                            	                 
										                            }	
					                                            </div>
					                                            <div className="col-5">
																    <input type="hidden" className="hidden font_id" value={elem.font_id}/>
										                            {	
										                             	btn_statu == GET_FONT_STATE.installed ?
									                             	        <span className="open-file-btn left-10" style={{"display":"none"}}>
									                             	            <i className="icons icons-18 font-open-bg"></i>
									                             	            <a href="javascript:;" className="abtn open-local" onClick={this.openFileLocation.bind(this, elem.path)}>打开字体位置</a>
									                             	        </span>  
										                             	:
										                             	btn_statu == GET_FONT_STATE.not_install ?
									                             		    <span className="install-btn left-10">
									                             		        <i className="icons icons-18 btn-installation-bg"></i>
									                             		        <a href="javascript:;" className="abtn install" onClick={this.installFontBtn.bind(this, elem)}>安装</a>
									                             		    </span>
										                             	:
										                             	btn_statu == GET_FONT_STATE.download ? 
									                             	        <span className="download-btn left-10">
									                             	            <i className="icons icons-18 font-download-only-bg"></i>
									                             	         	<a href="javascript:;" className="abtn download" onClick={this.downloadFontBtn.bind(this, elem)}>下载</a>
									                             	        </span>
												                        :
												                        btn_statu == GET_FONT_STATE.not_download ?
									                             	        <span className="download-btn left-10">
									                             	            <i className="icons icons-18 font-go-baidu-bg"></i>
									                             	         	<a href="javascript:;" className="abtn download" onClick={this.openBaiDuUrl.bind(this, bdurl)}>百度</a>
									                             	        </span>
												                        :
										                             	btn_statu == GET_FONT_STATE.in_needupdate || btn_statu == GET_FONT_STATE.not_in_needupdate ? 
									                             	        <span className="download-btn left-10">
									                             	            <i className="icons icons-18 font-download-only-bg"></i>
									                             	         	<a href="javascript:;" className="abtn download" onClick={this.downloadFontBtn.bind(this, elem)}>更新</a>
									                             	        </span>
												                        :												                        
												                            <span className="download-btn left-10">
									                             	            <i className="icons icons-18 font-go-baidu-bg"></i>
									                             	         	<a href="javascript:;" className="abtn download" onClick={this.openBaiDuUrl.bind(this, bdurl)}>百度</a>
									                             	        </span>      							                             	            	
										                            }
										                            {
										                            	btn_statu == GET_FONT_STATE.not_install ?
					                             	        				<span className="open-file-btn left-10" style={{"display":"none"}}>
									                             	            <i className="icons icons-18 font-open-bg"></i>
									                             	            <a href="javascript:;" className="abtn open-local" onClick={this.openFileLocation.bind(this, elem.path)}>打开字体位置</a>
									                             	        </span>
										                            	:
										                            	    null    
										                            }				                                            
					                                            </div>
			                                                </div>	                                            	     
		                                            	)
		                                            })
	                                            }
	                                            </div> 

	                                        </li>
                                        )
                                    })
	                       	    :
	                       	    	<div className="center no-data"><p className="flex">未检测到该文件含有字体</p></div>
	                       	:     	
		                    	loadingHtml(true)  	                       	

                        } 
	                </ul>		           
		       </div>
	}
	componentDidMount() {
		jqTableCellDom($('.table.scllorBar_table li .table-cell'), '.col-line-l', '.col-line-r', false);
		this.inItSortListData()								
	}	
	componentWillReceiveProps(nextProps) {
		log('DetectionTable======>')
		log(nextProps)
		log(this.props)
		const t_p = this.props,
		      actions = t_p.actions,
		      tr_Elem = doc.querySelectorAll('.detection-table .table li .col-line-r .col-line'),
		      login_id = this.props.login && this.props.login.loginUserData && this.props.login.loginUserData.id && this.props.login.loginUserData.id > 0 ? this.props.login.loginUserData.id : null;

        //下载第一步
        if( nextProps.addDownloadLastUpdated !== this.props.addDownloadLastUpdated ){
        	if( login_id ){
           	    getBengingDownloadFontId(login_id, actions, nextProps.downloadIds, nextProps.downloadListData);  
            }else{
            	actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "要下载字体，请先登录！",auto: true,speed: 1500,statu: 0})
            }   	
        }
        //下载第二步
        if( nextProps.downloadBeging && nextProps.downloadBegingLastUpdated !== t_p.downloadBegingLastUpdated ){
        	if( login_id ){
        		getBengingDownloadFontId(login_id, actions, nextProps.downloadIds, nextProps.downloadListData, nextProps.downloadBeging)
        	}else{
            	actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "要下载字体，请先登录！",auto: true,speed: 1500,statu: 0})
            } 
        } 
        //下载第三步
		if( nextProps.downloadLastUpdated && nextProps.downloadLastUpdated !== t_p.downloadLastUpdated ){
	        //下载中
            //console.log('第三步：', nextProps.downloadListData)
            if( login_id ){
	       		const downloadListData = nextProps.downloadListData,
	                  fontData = this.props.fontData;
	        	getDownloadingState2(nextProps.downloadBeging.result, downloadListData, tr_Elem, fontData, actions, nextProps.keyPadded)					             	
		    }else{
            	actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "要下载字体，请先登录！",auto: true,speed: 1500,statu: 0})
            }
		}		      		
        //安装
        if( nextProps.installLastUpdated && nextProps.installLastUpdated !== t_p.installLastUpdated ){
            //这里要传this.props.listData是为了和引用字段sortListData对应，这样安装后就不会重新排序了。
            getFontsInstall(nextProps.installIds, this.props.listData, actions, tr_Elem)           
        }           
	} 
	componentDidUpdate(nextProps, nextState) {
		if( $(".scllorBar_table.mCustomScrollbar").length == 0 ){
			getmCustomScrollbar($(".scllorBar_table"))
		}
		jqTableCellDom($('.table.scllorBar_table li .table-cell'), '.col-line-l', '.col-line-r', false);
		if( nextProps.resize && this.props.resize && nextProps.resize.h !== this.props.resize.h 
			&& $(".scllorBar_table.mCustomScrollbar").length > 0 ){
			getmCustomScrollbar($(".scllorBar_table"), null, "update")
		}		
	}
	componentWillUnmount(){
        if( this.state.timeout ){
        	clearTimeout(this.state.timeout)
    	}  			
	}
}
const mapStateToProps = (state) => {
	log("DetectionTable-->", state)
	return {
        installLastUpdated: state.events.installLastUpdated,
		installIds: state.events.installIds,

        keyPadded: state.events.keyPadded,
  		keyPaddedLastUpdated: state.events.keyPaddedLastUpdated		
	}
}	
export default connect(
  mapStateToProps
)(DetectionTable)