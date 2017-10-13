import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import UtilConstant from '../constants/UtilConstant'
import InitializeSDK from '../constants/InitializeSDK'
import { CHAT_ROUTES } from '../constants/DataConstant'
import { SHOW_DIALOG_ALERT } from '../constants/TodoFilters'

import Sidebar from './chat/Sidebar'
import Main from './chat/Main'
import SmartMenu from '../modules/SmartMenu'
import DialogMain from '../modules/dialogModel/DialogMain'

import * as LoginActions from '../actions/LoginActions'
import * as ChatActions from '../actions/ChatActions'
import * as CommonActions from '../actions/CommonActions'

const doc = document
class ChatApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            code: 0,
            message: '',
            yxData: {},
            nim: null,
            Fn: null,
            db: null,
            yxSessionAt: null,
            yxReceivedAt: null,          
          	resize: {w: 0, h: 0}
      	};
      	UtilConstant.log("LocalFileApp");		
  	}        	
    render() {
        const { login, chats } = this.props
        const { resize, yxData, nim, Fn, yxSessionAt, yxReceivedAt, code, message } = this.state
        UtilConstant.log("-----ChatApp------") 
        console.log(99999,"初始化SDK=>：：",yxData, this.state)      
        return (
          code != 0 ? 
              <div className="app">
                  <div className="flex flex-c flex-c-c col-6" style={{"height": "100%"}}>{message}</div>
              </div>
          :                  
              <div className="app">
                  <div className="flex flex-l flex-l-l" style={{"height": "100%"}}>
                      <Sidebar 
                         {...this.props}
                         yxReceivedAt={yxReceivedAt}
                         yxSessionAt={yxSessionAt}
                         resize={resize} 
                         yxData={yxData} 
                         nim={nim} 
                         Fn={Fn}/>
                      <Main 
                         {...this.props}
                         yxReceivedAt={yxReceivedAt}
                         yxSessionAt={yxSessionAt}
                         resize={resize}
                         yxData={yxData} 
                         nim={nim} 
                         Fn={Fn}/>
                  </div>
                  <DialogMain 
                     {...this.props}
                     resize={resize}
                     yxData={yxData} 
                     nim={nim} 
                     Fn={Fn}/>
                  <SmartMenu {...this.props}/>  
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
        //获取用户信息
        this.props.actionsLog.getLoginUserRequest()
    	  this.findDimensions() 

        //---测试---
        this.props.actionsChat.getYunChatAccid(2660)
        this.props.login['loginUserData'] = {}
        this.props.login.loginUserData['id'] = 2660 
        //---测试--- 
        
  	    window.addEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }
    componentWillReceiveProps(nextProps) {
        console.log("ChatApp----componentWillReceiveProps",nextProps, this.props)
        if( nextProps.login && nextProps.loginLastUpdated !== this.props.loginLastUpdated ){
            const loginUserData = nextProps.login.loginUserData;
            if( loginUserData && loginUserData.id > 0 ){
                this.props.actionsChat.getYunChatAccid(loginUserData.id)
            } 
        }
        if( nextProps.chats && nextProps.chats.chatAccid && nextProps.chats.chatAccidLastUpdated !== this.props.chats.chatAccidLastUpdated ){
            const chatAccid = nextProps.chats.chatAccid,
                  adata = chatAccid.data;
            if( chatAccid.errorCode == 0 && adata && adata.appKey && adata.accid && adata.token ){
                //初始化SDK       
                InitializeSDK.yxSDK(adata.appKey, adata.accid, adata.token, this)   
            }else{
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: chatAccid.error,auto: true,speed: 1500,statu: 0})
                this.setState({
                   code: chatAccid.errorCode,
                   message: chatAccid.error
                })
            }
        }        
    }
    componentWillUnmount() {
  	    window.removeEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }  
}
ChatApp.propTypes = {
    login: PropTypes.object.isRequired  
}
const mapStateToProps = (state) => {
    return {
        login: state.login,
        loginLastUpdated: state.login.loginLastUpdated,

        getConfig: state.inIt.getConfig,
        configLastUpdated: state.inIt.configLastUpdated,       

        chats: state.chats        
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(CommonActions, dispatch),
      actionsChat: bindActionCreators(ChatActions, dispatch),
      actionsLog: bindActionCreators(LoginActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatApp)
