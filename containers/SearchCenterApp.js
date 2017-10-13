import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Assign from 'lodash.assign'

import { SEARCH_ROUTES, PAGE_TYPE } from '../constants/DataConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, SHOW_DIALOG_MOVE_PREVIEW_FILES, 
         SHOW_GUILD_2, SHOW_IMAGE_MATERIAL } from '../constants/TodoFilters'
import { log, isEmpty,dimensions,throttle, objClone } from '../constants/UtilConstant'
import SearchIndex from '../modules/shituView/SearchIndex'
import SearchFont from '../modules/shituView/SearchFont'
import MissingFont from '../modules/shituView/MissingFont'
import ShituImg from '../modules/shituView/ShituImg'
import DialogMain from '../modules/dialogModel/DialogMain'
import NotificationMsg from '../modules/functionBarModel/NotificationMsg'

import * as ShituAction from '../actions/ShituAction'
import * as CommonActions from '../actions/CommonActions'
import * as LoginActions from '../actions/LoginActions'
import * as FontActions from '../actions/fontsActions'

//合并一下actions, 之前字体助手有使用actions, 现在公共也有个actions。
const coCommon = objClone(CommonActions),
      coFont = objClone(FontActions);
const ExtendAction = function(o, n){
   for (var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
            o[p] = n[p];
    }
}; 
ExtendAction(coCommon, coFont) 

class SearchCenterApp extends Component {
  	constructor(props) {
    	super(props);
        //'服务器已断开，请稍候再试。(代码：'+ cmsgData.connect_flag + cmsgData.server +')';
        //connect_flag = 0; //-2已断开连接 -1重连失败 0连接成功
        //server = 0; //0本地服务  1机器学习服务器 2下载服务器  
    	this.state = {
    	    route: SEARCH_ROUTES[0],
            resize: {w: 0, h: 0},
            inItDocs: {
                isInit: false,
                isScan: false,
                isConnection: {
                    connect_flag: 0,
                    server: 0
                }
            },
            filter: SHOW_IMAGE_MATERIAL
    	};
        this.setRoute = this.setRoute.bind(this)
  	}       	
    setRoute(data) {
        this.setState({
           route: data,
        })       
    }
    handleShow(filter) {
        this.setState({ filter })
    }    
    render() {
        const { route, resize, inItDocs, filter } = this.state
    	return (
            <div className="search-center">
               <NotificationMsg
                   actions={this.props.actions}
                   actionsLog={this.props.actionsLog} 
                   pcNoticeMsg={this.props.pcNoticeMsg}
                   pcNoticeMsgLastUpdated= {this.props.pcNoticeMsgLastUpdated}/>            
        		<div className="shitu-main" style={{"width": "100%", "height": "100%"}}>
        		     {
        		    	route.menu === 'show_shitu_main' ?
                            <SearchIndex {...this.props} setRoute={this.setRoute} inItDocs={inItDocs} filter={filter} onShow={this.handleShow.bind(this)}/> 
        		    	:	
        		    	route.menu === 'show_shitu_info' ?
        		    	    <ShituImg {...this.props} setRoute={this.setRoute}  resize={resize} inItDocs={inItDocs}/>
        		    	:
                        route.menu === 'show_searchfont_info'?
        		    	    <SearchFont  {...this.props} setRoute={this.setRoute} resize={resize} inItDocs={inItDocs}/>
                        :
                        route.menu === 'show_missingfont_info' ?
                            <MissingFont {...this.props} setRoute={this.setRoute} resize={resize} inItDocs={inItDocs}/>
                        :
                            null     	
        		    }
        		</div>
                <DialogMain resize={resize} {...this.props}/>
            </div>
    	)
    }
    findDimensions() {
        const resizees = dimensions()
        this.setState({
            resize: {w: resizees.w, h: resizees.h}
        })    
    } 
    docsInitData() {
        //this.props.actions.triggerDialogInfo({
        //    type: SHOW_DIALOG_CONFIRM,
        //    title: '系统提示',
        //    text: text,
        //    disabled: true
        //})
        //初始化准备
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanDocsInitRequest', '');       
    }
    showAlert(text) {
        this.props.actions.triggerDialogInfo({
            type: SHOW_DIALOG_ALERT,
            text: '<img class="icons-40" src="compress/img/loading6.gif"/>'+ text,
            auto: false
        })
    }    
    componentDidMount() {
        //注入js函数，供C++调用
        this.props.actions.injectionJs_JsMsgHandle() 
        //调用系统初始化
        this.docsInitData()     
        //获取用户信息
        this.props.actionsLog.getLoginUserRequest()  
        setTimeout(() => {
            this.props.actions.getConfigInfo()
        }, 20)      
        //启动窗口的放大缩小     
        this.findDimensions()
        window.addEventListener('resize', throttle(this.findDimensions.bind(this), 100), false)
    } 
    showGuild(getConfig) {
        //新手引导
        const configObj = getConfig && getConfig.data;
        if( configObj && configObj.user_guide ){
            const ugVal = parseInt(configObj.user_guide.value)
            if( ugVal == 0 ){
                this.props.actions.triggerDialogInfo({type: SHOW_GUILD_2})
            }                                                        
        }
    }
    componentWillReceiveProps(nextProps) { 
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //初始化完后调用
            if( this.state.inItDocs.isScan ){
                this.showGuild(nextProps.getConfig)
            }
        }               
        //有系统消息时样式修改
        if( nextProps.pcNoticeMsg ){
            const pcmsg = nextProps.pcNoticeMsg.data,
                  smDom = document.querySelector('.search-center .shitu-main');            
            if( nextProps.pcNoticeMsgLastUpdated !== this.props.pcNoticeMsgLastUpdated ){
                if( smDom && pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                    smDom.style.height = "calc(100% - 36px)"; 
                }else{
                    smDom.style.height = "100%";
                }
            }else{
                //如果关闭了就不需要修改height了。
                const msgDom = document.querySelector('.sys-msg');     
                if( smDom && msgDom && pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                    smDom.style.height = "calc(100% - 36px)";
                }else{
                    smDom.style.height = "100%";
                }
            }
        }        
        // 文字搜索跳转结果界面
        if( nextProps.searchFontData && nextProps.searchFontDataLastUpdated !== this.props.searchFontDataLastUpdated ){
           switch(nextProps.searchFontData.type) {
              case 'FontMain':
                  this.setRoute(SEARCH_ROUTES[2])
              break;
              case 'MissingMain':
                  //从搜索中心补齐字体
                  setTimeout(() => {
                      this.props.actionsFont.psFileDetectRequest(nextProps.searchFontData.data, objClone(PAGE_TYPE.Font_Assistant.font_fill))
                  }, 10)                   
                  
              break;
           }
        }
        //字体补齐时触发fonts
        if( nextProps.fonts.missingPsLastUpdate !== this.props.fonts.missingPsLastUpdate ){
            //写到这边的情况是处理检测出错的时候可以正常返回到搜索中心字体补齐界面
            const psData = nextProps.fonts.missingPsFileDetectData
            if( psData ){
                if( nextProps.fonts.missingPsFileDetectData.error_code == 0 ){
                    this.setRoute(SEARCH_ROUTES[3])
                }else{
                    let errorStr = psData.error;
                    if( isEmpty(errorStr) ){
                        errorStr = '文件检测失败(代码：'+ psData.error_code +')'
                    }
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: errorStr,auto: true,speed: 3000})                                        
                }
            }
        }
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsData = nextProps.jsMsgHandle.param,
                  module = nextProps.jsMsgHandle.module;
            if( !jsData ){
                log('---返回数据为空---')
                return;
            } 
            const jsVal = jsData.data;                  
            switch(module){
                case 'scan_init_status_t':
                    //获取数据库初始化完成状态
                    if( jsVal && jsVal.init ){
                        log('scan_init_status_t--初始化结束成功')
                        //判断上一次接收到的是不是init=true
                        if( this.state.inItDocs.isScan ) return; 
                        this.setState({
                            inItDocs:{
                                isInit: true,
                                isScan: true,
                                isConnection: this.state.inItDocs.isConnection
                            }
                        })
                        this.showGuild(nextProps.getConfig)  
                        setTimeout(() => {                      
                            if( document.getElementById('Alert') ){
                                this.props.actions.triggerDialogInfo(null)
                            }
                        }, 1000)
                    }else{ 
                        if( this.state.inItDocs.isInit ){                  
                            //重新初始化定义
                            //不再发起请求8月30
                            //this.docsInitData()
                        } 
                        const err = isEmpty(jsVal.init_info) ? '系统更新中，请稍候...' : jsVal.init_info;
                        this.showAlert(err)
                        this.setState({
                            inItDocs:{
                                isScan: false,
                                isConnection: this.state.inItDocs.isConnection
                            }
                        })                                               
                    }
                break;
                case 'connect_msg_t':
                    //服务器已断开-重连-处理
                    if( !jsVal ) return;
                    this.setState({
                        inItDocs:{
                            isScan: this.state.inItDocs.isScan,
                            isConnection: {
                                connect_flag: jsVal.connect_flag,
                                server: jsVal.server
                            }
                        }
                    })                    
                break;
                case 'preview_continue_move_info_t':
                    if( jsData.error_code == 0  && jsVal  ){
                        const path = jsVal.previous_move_path;
                        try{
                            //弹出层时关闭拖拽
                            setTimeout(() => {
                                //首页的关闭
                                window.asyncStopGetDragDropFileRequest()
                            }, 500)
                        }catch(e){}                         
                        this.props.actions.triggerDialogInfo({
                            type: SHOW_DIALOG_CONFIRM,
                            title: '系统提示',
                            text: '因上次软件未正常关闭，预览图路径修改至“'+ path +'”失败。是否继续修改？',
                            confirmBtnText: '继续',
                            cancelBtnText: '取消',
                            confirmFn: () => {
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_MOVE_PREVIEW_FILES})
                                setTimeout(() => {
                                    this.props.actions.sendHandleMessage('SettingMsgProcess', 'changePreviewPath', {thumb_base_path:path})
                                },10) 
                            },
                            defaultFn: () => {
                                //开启拖拽
                                this.props.actionsST.startGetDragDropFile()                         
                            }                            
                        });                        
                    }
                break;
                case 'cancel_preview_move_rsp_t':
                    if( jsData.error_code != 0 ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000,statu: 1})
                        return
                    }
                    if( jsVal && jsVal.is_complete ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消成功",auto: true,speed: 3000,statu: 1})
                        this.props.actions.getConfigInfo();
                    }else{
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000,statu: 1})
                    }
                break;                
                default:
                break;
            }           
        }
    }    
    componentWillUnmount() {
        window.removeEventListener('resize', throttle(this.findDimensions.bind(this), 100), false)
    }     

}
function mapStateToProps(state) {
    return {
        login: state.login,
        loginLastUpdated: state.login.loginLastUpdated, 

        shituSeriveData: state.shitu.shituSeriveData,
        shituSeriveDataLastUpdated:state.shitu.shituSeriveDataLastUpdated, 

        shituIdData: state.events.openFilePath_0,
        shituIdDataLastUpdated: state.events.openFile0LastUpdate,

        searchFontData: state.searchfont.searchFontData,
        searchFontDataLastUpdated: state.searchfont.searchFontDataLastUpdated,

        shituResultData: state.shitu.shituResultData,
        shituResultDataLastUpdated: state.shitu.shituResultDataLastUpdated,

        shituDragResultData:state.shitu.shituDragResultData,
        shituDragResultDataLastUpdated:state.shitu.shituDragResultDataLastUpdated,

        shituInputData:state.shitu.shituInputData,
        shituInputDataLastUpdated:state.shitu.shituInputDataLastUpdated,

        getConfig:state.inIt.getConfig,
        configLastUpdated:state.inIt.configLastUpdated,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated,

        pcNoticeMsg: state.login.pcNoticeMsg, 
        pcNoticeMsgLastUpdated: state.login.pcNoticeMsgLastUpdated,       

        fonts: state.fonts                
    }
}
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(coCommon, dispatch),
  	  actionsST: bindActionCreators(ShituAction, dispatch),
      actionsLog: bindActionCreators(LoginActions, dispatch),
      actionsFont: bindActionCreators(FontActions, dispatch)
    }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps	
)(SearchCenterApp)