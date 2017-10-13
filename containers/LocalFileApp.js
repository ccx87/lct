import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, dimensions, throttle, isEmpty } from '../constants/UtilConstant'
import { clientHeight } from '../constants/DomConstant'
import { SHOW_DIALOG_CONFIRM, DO_NOT_LOGIN, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'

import Main from './localFile/Main'
import Sidebar from './localFile/Sidebar'
import BottomBar from './localFile/BottomBar'
import DialogMain from '../modules/dialogModel/DialogMain'
import MinimizeMain from '../modules/minimizeModel/MinimizeMain'
import SmartMenu from '../modules/SmartMenu'
import NotificationMsg from '../modules/functionBarModel/NotificationMsg'

import * as LoginActions from '../actions/LoginActions'
import * as LocalFileActions from '../actions/localFileActions'
import * as CommonActions from '../actions/CommonActions'
import Perf from 'react-addons-perf'

const doc = document
class LocalFileApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
      		resize: {w: 0, h: 0},
            msgNum: 0
      	};
      	log("LocalFileApp");		
  	}   	  
    render() {
        const { login } = this.props
        const { resize } = this.state
        log("-----LocalFileApp重绘------", this.props)
        return (
            <div className="app">
               <NotificationMsg
                   actionsLog={this.props.actionsLog}
                   actions={this.props.actions} 
                   pcNoticeMsg={this.props.pcNoticeMsg}
                   pcNoticeMsgLastUpdated= {this.props.pcNoticeMsgLastUpdated}/>            
                <div className="flex flex-l flex-l-l local-file-panel" style={{"height": "calc(100% - 36px)"}}>
                   <Sidebar resize={resize} {...this.props}/>  
                   <Main resize={resize} {...this.props}/>
                   <DialogMain resize={resize} {...this.props}/>
                   <SmartMenu resize={resize} {...this.props} optbody={true}/>
                   <MinimizeMain resize={resize} {...this.props}/>
                </div>
                <BottomBar 
                   resize={resize} 
                   actions={this.props.actions}
                   getConfig={this.props.getConfig}
                   configLastUpdated={this.props.configLastUpdated}/>
            </div>
        )
    }
    findDimensions() {
    	  const resizees = dimensions()
        this.setState({
          	resize: {w: resizees.w, h: resizees.h}
        })    
    } 
    componentDidMount() {
        //注入js函数，供C++调用
        this.props.actions.injectionJs_JsMsgHandle()      
        //获取用户信息
        setTimeout(() => {this.props.actionsLog.getLoginUserRequest()},50)
        //获取配置信息
        setTimeout(() => {this.props.actions.getConfigInfo(null, 'FIRST_INIT_GET_CONFIG_INFO')},80) 
        //启动窗口的放大缩小     
    	this.findDimensions()       
        window.addEventListener('resize', throttle(this.findDimensions.bind(this), 100), false)      
    }
    componentWillReceiveProps(nextProps) {  
        if( nextProps.pcNoticeMsg && nextProps.pcNoticeMsgLastUpdated !== this.props.pcNoticeMsgLastUpdated ){
            const pcmsg = nextProps.pcNoticeMsg.data,
                  lfpDom = document.querySelector('.local-file-panel');
            if( lfpDom && pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                //35px + 36px
               lfpDom.style.height = "calc(100% - 72px)"; 
            }
        }             
        if( nextProps.loginLastUpdated !== this.props.loginLastUpdated ){
            //未登录情况下提示。目前屏蔽
            // if( !loginData || !loginData.id ){
            //     this.props.actions.triggerDialogInfo({
            //         type: SHOW_DIALOG_CONFIRM,
            //         title: "提示",
            //         text: "未登录情况下很多功能将无法使用",
            //         code: DO_NOT_LOGIN,
            //         model: 'GO_LOGIN'
            //     })                  
            // }
        }
        //站内消息(鉴黄)--5-17--目前不启用
        if( nextProps.dealMessageListLastUpdated !== this.props.dealMessageListLastUpdated ){
            if( nextProps.dealMessageList && nextProps.dealMessageList.constructor == Object ){
                try{
                    const loginData = nextProps.login.loginUserData,
                          dmlData = nextProps.dealMessageList.data; 
                    if( loginData && loginData.id && dmlData && 
                        dmlData.constructor == Array && dmlData.length > 0 ){
                        const dmlIds = dmlData.map((item) => item.linkNeedId);
                        //有站内消息要处理  
                        log('站内消息连接c++参数：')
                        log(loginData.id)
                        log(dmlIds.join(','))  
                        const callbackPic = window.recordIllegalPic(loginData.id, dmlIds.join(',')),
                              jsonPic = JSON.parse(callbackPic);
                        log('站内消息c++处理返回：')
                        log(jsonPic)      
                        if( jsonPic && jsonPic.is_success && !isEmpty(jsonPic.data) ){
                            const data = {
                                stIdList: jsonPic.data,
                                dealState: '1'
                            }
                            this.props.actionsLog.doDeal(data)
                        }
                    }
                }catch(e){log('站内消息处理错误')}
            }
        }        
        //1获取新配置信息时
        //因要先关闭设置窗口显示修改中...,所以要在外部定义关闭修改中...的提示
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //设置配置信息时会先关闭窗口，然后显示提示。完成时在这里关闭提示。
            if( nextProps.getConfig.types === 'INIT_SET_CONFIG_HIDE_DIALOG' || 
                nextProps.getConfig.types === 'SET_GET_CONFIG_INFO' ){
                this.props.actions.triggerDialogInfo(null)
            }  
        }
        //2设置中，修改文件扫描的格式后显示提示，完成时在这里重新获取配置信息并且关闭提示 
        if( nextProps.setScanFilterLastUpdated !== this.props.setScanFilterLastUpdated ){
            this.props.actions.getConfigInfo(null, 'INIT_SET_CONFIG_HIDE_DIALOG')
        }                        
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }        
    componentWillUnmount() {
  	    window.removeEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }  
}
const mapStateToProps = (state) => {
    return {
        login: state.login,
        loginLastUpdated: state.login.loginLastUpdated,

        dealMessageList: state.login.dealMessageList,
        dealMessageListLastUpdated: state.login.dealMessageListLastUpdated,

        pcNoticeMsg: state.login.pcNoticeMsg, 
        pcNoticeMsgLastUpdated: state.login.pcNoticeMsgLastUpdated,

        getConfig: state.inIt.getConfig,
        configLastUpdated: state.inIt.configLastUpdated,

        setScanFilter: state.events.setScanFilter, 
        setScanFilterLastUpdated: state.events.setScanFilterLastUpdated                                    
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CommonActions, dispatch),
        actionsLF: bindActionCreators(LocalFileActions, dispatch),
        actionsLog: bindActionCreators(LoginActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(immutableRenderDecorator(LocalFileApp))