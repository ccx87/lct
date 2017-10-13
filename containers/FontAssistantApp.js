import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import UtilConstant from '../constants/UtilConstant'

import Sidebar from './fontAssistant/Sidebar'
import Main from './fontAssistant/Main'
import SmartMenu from '../modules/SmartMenu'
import DialogMain from '../modules/dialogModel/DialogMain'
import Nav from '../modules/functionBarModel/Nav'
import NotificationMsg from '../modules/functionBarModel/NotificationMsg'

import * as FontActions from '../actions/fontsActions'
import * as LoginActions from '../actions/LoginActions'
import * as CommonActions from '../actions/CommonActions'

const doc = document
class FontAssistantApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
      		optHidetime: null,
      		resize: {w: 0, h: 0}
      	};
      	UtilConstant.log("FontAssistantApp");		
  	}	
    render() {
      const { login } = this.props
      const { resize } = this.state
      UtilConstant.log("-----App大重绘------", this.props)  
      return (
        <div className="app">
             <NotificationMsg
                 actions={this.props.actionsCommon} 
                 actionsLog={this.props.actionsLog} 
                 pcNoticeMsg={this.props.pcNoticeMsg}
                 pcNoticeMsgLastUpdated= {this.props.pcNoticeMsgLastUpdated}/>
            <div className="font-assistant-panel" style={{"position":"relative", "width":"100%", "height":"100%"}}>
              <Sidebar resize={resize} {...this.props}/>
              <Main resize={resize} {...this.props}/>
              <SmartMenu actions={this.props.actions} 
                 jsMsgHandleLastUpdated={this.props.jsMsgHandleLastUpdated}/>
              <DialogMain {...this.props} />
              <Nav {...this.props}/>
            </div>  
        </div>
      )
    }
    findDimensions() {
  	    const resizees = UtilConstant.dimensions()
        this.setState({
      	    resize: {w: resizees.w, h: resizees.h}
        })    
    } 
    componentDidMount() {
        //注入js函数，供C++调用
        this.props.actionsCommon.injectionJs_JsMsgHandle()
        //获取用户信息
        this.props.actionsLog.getLoginUserRequest()
        //获取配置信息
        setTimeout(() => {
           this.props.actions.getConfigInfo()
        },50) 

    	  this.findDimensions()
  	    window.addEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    } 
    componentWillReceiveProps(nextProps) {  
        if( nextProps.pcNoticeMsg && nextProps.pcNoticeMsgLastUpdated !== this.props.pcNoticeMsgLastUpdated ){
            const pcmsg = nextProps.pcNoticeMsg.data,
                  fapDom = document.querySelector('.font-assistant-panel');
            if( fapDom && pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                //35px + 36px
               fapDom.style.height = "calc(100% - 36px)"; 
            }
        }
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;
            if( jsModule === 'refresh_download_path_t' ){
                //重新获取配置信息--得到最近的设置的路径
                setTimeout(() => {
                   this.props.actions.getConfigInfo()
                },50)                 
            }                  
        }
    }    
    componentWillUnmount() {
    	  this.state.optHidetime = null
  	    window.removeEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }  
}
FontAssistantApp.propTypes = {
    login: PropTypes.object.isRequired  
}
const mapStateToProps = (state) => {
    return {
        login: state.login,
       
        getConfig: state.inIt.getConfig,
        configLastUpdated: state.inIt.configLastUpdated,

        pcNoticeMsg: state.login.pcNoticeMsg, 
        pcNoticeMsgLastUpdated: state.login.pcNoticeMsgLastUpdated,     

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated           
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
       actions: bindActionCreators(FontActions, dispatch),
       actionsLog: bindActionCreators(LoginActions, dispatch),
       actionsCommon: bindActionCreators(CommonActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FontAssistantApp)
