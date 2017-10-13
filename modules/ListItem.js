import React, { Component, PropTypes } from 'react'

import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'
import { WIMDOW_UNINSTALL_FONT_DEL } from '../constants/ActionsTypes'
import { FONT_STATE, GET_FONT_STATE, PAGE_TYPE } from '../constants/DataConstant'
import { isEmpty, dragDrop, getFontState, getFileType, log } from '../constants/UtilConstant'

const doc = document
//字体单个列表
class ListItem extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
        timeout: null,
    		progressTimeout: null
    	};		
	}
	checkItem(item, event) {
        event.stopPropagation();
        event.preventDefault();
		const i_Elem = event.currentTarget.querySelector('i');
		if( i_Elem.className == 'icons icons-18 fn-check' ){
			this.props.actions.fontCheckItem(item, true)
		}else{
			this.props.actions.fontCheckItem(item, false)
		}
	}
	clickItem(item, event) {
      event.stopPropagation();
      event.preventDefault();
      setTimeout(() => {
        this.props.actions.fontAttributes(item)
      },10)
	}
	showCreateSingleFontLayer(event) {
        const nsElem = event.currentTarget.nextSibling,
              optElem = doc.querySelector('.body-opacity-layer'),
              parElem = event.currentTarget.parentNode.parentNode,
              fnElem = parElem.querySelectorAll('.abtn'),
              liElem = parElem.parentNode.parentNode.parentNode,
              dragElem = nsElem.querySelector('.p-title')
        if(nsElem.style.display == '' || nsElem.style.display == 'none'){
        	for( let j = 0; j < fnElem.length; j++ ){
        		fnElem[j].className = fnElem[j].className + ' add-active'
        	}
        	liElem.className = liElem.className + ' hover'
        	optElem.style.display = 'block'
        	nsElem.style.cssText = 'top:0px;left:30px;display:block'
          //$(".scllorBar_commonList").mCustomScrollbar('disable');
        	dragDrop(dragElem, nsElem)
        }
	}
	closeCreateSingleFontLayer(event) {
        event.stopPropagation()
        event.preventDefault()
        const parElem = event.currentTarget.parentNode.parentNode,
              optElem = doc.querySelector('.body-opacity-layer'),
              parsElem = parElem.parentNode.parentNode,
              fnElem = parsElem.querySelectorAll('.abtn'),
              liElem = parsElem.parentNode.parentNode.parentNode
    	for( let j = 0; j < fnElem.length; j++ ){
    		let classes = []
    		if( fnElem[j].className.indexOf('add-active') > -1 ){
    			  classes = fnElem[j].className.split('add-active')
    		}else{
    			  classes.push('abtn')
    		}
    		fnElem[j].className = classes.join('')
    	}
    	liElem.className = 'item-cf'                             
      optElem.style.display = 'none'      
      parElem.style.display = 'none'
      $(".scllorBar_commonList").mCustomScrollbar('update')	
	}
	collectFontBtn(item , event) {
      event.stopPropagation()
      event.preventDefault()
      if( this.props.login.loginUserData ){
          const loginData = this.props.login.loginUserData;
          if( loginData && loginData.id != null && loginData.id > 0 ){ 
              const i_Elem = event.currentTarget.firstChild
              this.state.tiomeout = setTimeout(() => {
                  if( i_Elem.className == 'icons icons-18 fn-collect' ){
                    this.props.actions.unOrCollectFonts(loginData.id, item.font_id, 1)
                  }else{
                    this.props.actions.unOrCollectFonts(loginData.id, item.font_id, 0)
                  }
              },1)
              return false 
          }
      } 
      this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录后才能收藏字体",auto: true,speed: 1500,statu: 0})        				
	}
	uninstallFontBtn(item, event) {
        event.stopPropagation()
        event.preventDefault()
        const list = [{font_id: item.font_id, is_delete_file: false}]
        const data = {
      			type: SHOW_DIALOG_CONFIRM,
      			title: "字体卸载",
      			text: "确认卸载该字体吗？",
            checkBox: "同时删除该字体文件，且在“回收站”不可找回",
      			code: WIMDOW_UNINSTALL_FONT_DEL,
      			codeData: list,
            element: event.currentTarget         	
        }
        this.props.actions.triggerDialogInfo(data)       		
	}
  installFontBtn(item, event) {
        event.stopPropagation()
        event.preventDefault()
        if( event.currentTarget.disabled ){
           return false
        }
        event.currentTarget.disabled = true      
        event.currentTarget.querySelector('.btn-text').innerHTML = '安装中'
        event.currentTarget.querySelector('.btn-text').className = 'btn-text installing'
        const data = [
            {font_id: item.font_id}
        ]
        this.state.timeout = setTimeout(() => {
           this.props.actions.installFontAdd(data)
        },50)
  }
	downloadFontBtn(item, event) {
        event.stopPropagation()
        event.preventDefault()
        if( event.currentTarget.disabled ){
           return false
        }
        if( this.props.login ){
            const login = this.props.login;
            if( login.loginUserData && login.loginUserData.id != null && login.loginUserData.id > 0 ){
                const btn_Elem = event.currentTarget,
                      i_Elem = btn_Elem.querySelector('i');
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
                this.state.timeout = setTimeout(() => {
                    item["download_state"] = -1
                    this.props.actions.addGetDownloadFont(item.font_id, item)
                },10)
                return false 
            }
        } 
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录后才能下载字体",auto: true,speed: 1500,statu: 0})
	}
	addSingleFontsItem(item, elem, event) {
        event.stopPropagation()
        event.preventDefault()
        log(item)
        log(elem)	
        return false;	
	}
  divDefault(event) {
     event.stopPropagation()
     event.preventDefault()
     return false;    
  }  
	renderCreateSingleFontLayer(item, event) {
		const singleFontsListData = this.props.menuSingleData
		return 	<div className="abs create-single-font-layer box-layer" onClick={this.divDefault.bind(this)}>
		            <p className="p-title">
		                <span className="text">添加到字体单</span>
		                <i className="abs i-close-csfl" onClick={this.closeCreateSingleFontLayer.bind(this)}>×</i>
		            </p>
                    <ul className="single-font-list">
                       <li className="first">
                          <a>+</a><span>创建为新字体单</span>
                       </li>
                       {
                       	   singleFontsListData != null && singleFontsListData.data != null ?
                       	      singleFontsListData.data.length > 0 ?
                       	          singleFontsListData.data.map((elem, index) =>{
                                      return <li key={index} onClick={this.addSingleFontsItem.bind(this, item, elem)}>
                                               <img src={elem.cover_img} alt="图片" className="icons-40" />
                                               <div className="elem-line">
                                                  <p className="p-1">{elem.list_name}</p>
                                                  <p className="p-2">{elem.font_count}个字体</p>
                                               </div>
                                             </li>                                            
                       	          })   
                       	      :
                       	          null 
                       	   :
                       	      null
                       }
                    </ul> 
				 </div>	
	}			
  openFileLocation(path, statu, event) {
      event.stopPropagation()
      event.preventDefault()
      if( statu == GET_FONT_STATE.installed ){
          window.openFileRequest(1, path)
      }else if( statu == GET_FONT_STATE.not_install ){
          window.openFileRequest(2, path) 
      }
  }
  unDownload(item, event){
      this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "应版权方要求该字体暂时无法下载 >_<",auto: true,speed: 1500,statu: 0})
  }
	render() {
		const { item, hasCheck, h, index, fonts, events } = this.props
    const btn_statu = getFontState(item.font_state)
		return  <li className="item-cf" key={index+item.font_state} onClick={this.clickItem.bind(this, item)} style={{"display": item.display != null && !item.display ? "none" : "block" }}>
     	     	     <input type="hidden" name="hidden" className="hidden font_state" value={item.font_state} />
                 <input type="hidden" name="hidden" className="hidden font_id" value={item.font_id} />
     	     	     {
     	     	     	 hasCheck ?
     	     	     	    <div className="item-check" onClick={this.checkItem.bind(this, item)}>
     	     	     	        <lable className="table-cell check-lable-height"><i className="icons icons-18 fn-check"></i></lable>
     	     	     	    </div>
     	     	     	 :
     	     	     	    null   
     	     	     }
                     <div className="item-left">
                         <div className="item-left-main"> 
                             <a className="aimg" style={{"height": h}}>
                                <img className="img" src={item.font_image_status ? "data:image/png;base64,"+ item.font_image : null} alt="" />
                             </a>
                             <div className="item-info">
                                 {
                                    fonts.common ?
                                        fonts.common.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ?
                                              btn_statu === GET_FONT_STATE.installed ?
                                                  <div className="ii-local"><i className="icons icons-18 installed-font-bg"></i>本地已安装</div> 
                                              :
                                              btn_statu == GET_FONT_STATE.not_install ?
                                                  <div className="ii-local"><i className="icons icons-18 uninstall-font-bg"></i>本地未安装</div>
                                              :
                                                  <div className="ii-local"><i className="icons icons-18 yun-font-bg"></i>云端字体</div>          
                                        :
                                             btn_statu == GET_FONT_STATE.installed ?
                                                <div className="ii-local"><i className="icons icons-18 installed-font-bg"></i>本地已安装</div> 
                                             :
                                             btn_statu == GET_FONT_STATE.not_install ?
                                                <div className="ii-local"><i className="icons icons-18 uninstall-font-bg"></i>本地未安装</div>
                                             :
                                                <div className="ii-local"><i className="icons icons-18 yun-font-bg"></i>云端收藏字体</div>
                                    :  
                                       null
                                 }
                                 <div className="ii-name">
                                    {
                                       getFileType(item.file_type) == 't' ?
                                          <i className="icons icons-18 ttf-type-bg"></i>
                                       :
                                       getFileType(item.file_type) == 'o' ?
                                          <i className="icons icons-18 otf-type-bg"></i>
                                       :
                                          null          
                                    }
                                    <span className="text">{isEmpty(item.font_name) ? "-" : item.font_name}</span>
                                 </div>
                                 <div className="ii-lang">支持语言：{isEmpty(item.language) ? "未知" : item.language}</div>
                                 <div className="ii-fn">
                                     <div className="fn-btn" title="收藏">
                                     	 <a className={item.font_state & FONT_STATE.kCollectState ? "abtn active" : "abtn"} title={item.font_state & FONT_STATE.kCollectState ? "取消收藏" : "收藏"} onClick={this.collectFontBtn.bind(this, item)}>
                                     	    <i className={item.font_state & FONT_STATE.kCollectState ? "icons icons-18 fn-collected" : "icons icons-18 fn-collect"}></i>
                                     	 </a>    
                                     </div>
                                     {
                                         (btn_statu == GET_FONT_STATE.installed || btn_statu == GET_FONT_STATE.not_install ) && !isEmpty(item.path) ?
                                             <div className="fn-btn" title="打开位置">
                                               <a className="abtn" title="打开位置" onClick={this.openFileLocation.bind(this, item.path, btn_statu)}><i className="icons icons-18 fn-postion"></i></a>
                                             </div>
                                         :
                                              null                                        
                                     }
                                     <div className="fn-btn" title="添加到字体单" style={{"display": "none"}}>
    	                                 <a className="abtn" title="添加到字体单" onClick={this.showCreateSingleFontLayer.bind(this)}>
    	                                      <i className="icons icons-18 add-csfl-bg"></i>
    	                                 </a>
                                         {this.renderCreateSingleFontLayer(item)} 
                                     </div>
                                     <div className="fn-btn" style={{"display":"none"}} title="添加效果图">
                                     	 <a className="abtn" title="添加效果图"><i className="icons icons-18 fn-addRender"></i></a>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                     <div className="item-right">                                          
                         <div className="table-cell right-abtn-height">
                             {	

                                 btn_statu == GET_FONT_STATE.installed ?
                                       <button type="button" className="abtn clearfix" title="卸载" onClick={this.uninstallFontBtn.bind(this, item)}>
                                       <i className="icons icons-18 btn-uninstall"></i> 
                                       <span className="btn-text">卸载</span>
                                       </button>
                                  :
                                 btn_statu == GET_FONT_STATE.not_install ?    
                                       <button type="button" className="abtn clearfix" title="安装" onClick={this.installFontBtn.bind(this, item)}>
                                       <i className="icons icons-18 btn-installation-bg"></i>
                                       <span className="btn-text">安装</span>
                                       </button>
                                  :     
                                  btn_statu == GET_FONT_STATE.download ?
                                       <button type="button" className="abtn clearfix" title="下载" onClick={this.downloadFontBtn.bind(this, item)}>
                                       <i className="icons icons-18 btn-download"></i>
                                       <span className="btn-text">下载</span>
                                       </button> 
                                  :
                                  btn_statu == GET_FONT_STATE.not_download ?
                                       <button type="button" className="abtn clearfix" title="无法下载" onClick={this.unDownload.bind(this, item)}>
                                       <i className="icons icons-18 btn-download"></i>
                                       <span className="btn-text">下载</span>
                                       </button>
                                  :
                                       <button type="button" className="abtn clearfix" title="无法下载" onClick={this.unDownload.bind(this, item)}>
                                       <i className="icons icons-18 btn-download"></i>
                                       <span className="btn-text">下载</span>
                                       </button>
                              }                                                                                                                        
                         </div>
                     </div>
                 </li>
	}
  	componentDidMount() {
      //添加到字体单滚动插件
      $(".single-font-list").mCustomScrollbar({
        theme:"dark-3",
        onScrollStart:function(e){
           var e = e || window.event;
           e.stopPropagation();
           e.preventDefault();
        }
      })      			
  	}
    componentWillUnmount(){
        clearTimeout(this.state.timeout) 
    }  
}	
export default ListItem