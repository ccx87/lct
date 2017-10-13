import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../constants/UtilConstant'
import { SHOW_DIALOG_CONFIRM, DO_NOT_LOGIN, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'

import DialogMain from '../modules/dialogModel/DialogMain'
import NotificationMsg from '../modules/functionBarModel/NotificationMsg'
import Main from './filesManagement/Main'

import * as LoginActions from '../actions/LoginActions'
import * as LocalFileActions from '../actions/localFileActions'
import * as FilesManagementActions from '../actions/filesManagementActions'
import * as CommonActions from '../actions/CommonActions'
import Perf from 'react-addons-perf'

const doc = document
class FilesManagementApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("FilesManagementApp");		
  	}   	  
    render() {
        log("||￣￣￣￣￣￣￣￣￣￣￣￣￣￣||")
        log("||-------------------------||")
        log("||---------素材管理---------||")
        log("||-------------------------||")
        log("||_________________________||")
        return (
            <div className="app">
                <NotificationMsg
                    actionsLog={this.props.actionsLog}
                    actions={this.props.actions} 
                    pcNoticeMsg={this.props.pcNoticeMsg}
                    pcNoticeMsgLastUpdated= {this.props.pcNoticeMsgLastUpdated}/>            
                <Main {...this.props}/>
                <DialogMain {...this.props}/>
            </div>
        )
    } 
    componentDidMount() {      
        //注入js函数，供C++调用
        this.props.actions.injectionJs_JsMsgHandle()
        //获取配置信息
        this.props.actions.getConfigInfo(null, 'FIRST_INIT_GET_CONFIG_INFO')              
        //获取用户信息
        setTimeout(() => {this.props.actionsLog.getLoginUserRequest()},50)
    }
    componentWillReceiveProps(nextProps) {                    
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
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }        
    componentWillUnmount() {}  
}
const mapStateToProps = (state) => {
    return {
        login: state.login,
        loginLastUpdated: state.login.loginLastUpdated,

        pcNoticeMsg: state.login.pcNoticeMsg, 
        pcNoticeMsgLastUpdated: state.login.pcNoticeMsgLastUpdated,

        getConfig: state.inIt.getConfig,
        configLastUpdated: state.inIt.configLastUpdated                                   
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CommonActions, dispatch),
        actionsLF: bindActionCreators(LocalFileActions, dispatch),
        actionsFM: bindActionCreators(FilesManagementActions, dispatch),
        actionsLog: bindActionCreators(LoginActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(immutableRenderDecorator(FilesManagementApp))