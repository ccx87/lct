import React, { Component, PropTypes } from 'react'

import { SHOW_DIALOG_ALERT, SHOW_LIANTY_LOGIN } from '../../constants/TodoFilters'
import { isEmpty, log } from '../../constants/UtilConstant'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'

const doc = document
class Third extends Component {
	constructor(props) {
    	super(props);
    	this.state = { };
    	log("Third");		
	}
	createThirdUser(event) {
        const name = this.refs.createNickNameRef.value,
              get_c = this.props.getConfig.data;
        if( isEmpty(name) ){
        	this.refs.createNickNameRef.nextSibling.innerHTML = '用户名不能为空';
        	return false
        }
        event.currentTarget.innerHTML = '正在登录中'
        event.currentTarget.style.disabled = true
        const get_v = get_c && get_c.APP_Version ? get_c.APP_Version.value : '',
	          data = {
		    	type: 'qq',
		    	openId: this.props.openId,
		    	headPortraitPath: '',
		    	city: '',
		    	nickname: name,
				userAgent: 1,
				version: get_v		    	
	    	  };   	
        this.props.actions.createThirdPartyLogin(data)                		
	}
	signOut() {
		window.cancelLoginRequest("0") 
	}
	goBack() {
		window.setLoginWndSizeRequest("0")
		this.props.onHandleShow(SHOW_LIANTY_LOGIN)
	}	
  render() {
  	const { login } = this.props
    return (
		<div className = "common-row third-party-regist">
		    {
		    	login.thirdUserData ?
		    	   <div>
					    <a style={{"display": "none"}} className="abs close icons-login close-bg icons-30" title="关闭" onClick={this.signOut.bind(this)}>关闭</a>
						<p>
						   <i className="log-bg"></i>
						</p>
						<p className="color-light">
							<span className="font-big-16 color-nomal">Hi，</span>欢迎使用QQ账号登录 <span className="color-main">链图云客户端</span>
						</p>
						<div className="third-party-old">
							<div className="regist-input req clearfix">
								<div className="input-title g-l"><span className="color-error">*</span>用户名：</div>
								<div className="input-content g-l">
									<input ref="createNickNameRef" type="text" placeholder="请输入您的用户名" />
								    <span className="error-msg col-red"></span>
								</div>
							</div>
						</div>
						<div className="regist-input">
							<div className="input-content">
							    <input type="button" className="recommend" id="createThirdSubmit" value="完成，继续访问" onClick={this.createThirdUser.bind(this)} />
							    <br />
							    <input type="button" className="go-back" value="返回" onClick={this.goBack.bind(this)} /> 
							</div>							
						</div>		    	   
		    	   </div>
		    	:
		    	   loadingHtml2('正在第三方登录中')    
		    }
				
		</div>
    )
  }
  componentWillReceiveProps(nextProps) {
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
		    if( this.props.openId ){
		    	const get_c = nextProps.getConfig.data,
		    	      get_v = get_c && get_c.APP_Version ? get_c.APP_Version.value : '',
			          data = {
				    	type: 'qq',
				    	openId: this.props.openId,
				        userAgent: 1,
						version: get_v	
			    	 };  	  	
		        this.props.actions.thirdPartyLogin(data)
		    }            
        }
  }
  shouldComponentUpdate(nextProps) {
  	if(nextProps.login.thirdUserData){
  	  	log('===第三方登录===')
  	  	log(nextProps)
        const thirdObj = nextProps.login.thirdUserData;
  	  	if( thirdObj.errorCode == 0 ){
  	  		if( thirdObj.data != null ){
  	  			//third_login 这个默认值为name名称都为空时设置，如果要改这个默认值则要通知C++作相应的修改。
  	  	 		const third = thirdObj.data,
	  	  	  	      strData = { 
		  	  	  	  password: third.password,
		  	  	  	  auto_login: false,
		  	  	  	  name: third.loginPhone ? third.loginPhone : third.email ? third.email : 'third_login',
		  	  	  	  id: third.id,
		  	  	  	  headPortrait: third.headPortraitPath,
		  	  	  	  nick_name: third.nickName,
		  	  	  	  login_type: 2
		  	  	  	};   		
	  	  	  	setTimeout(() => {
					window.setLoginUserRequest(JSON.stringify(strData)) 
	  	  	  	},50)
  	  	    }	  	 	
  	  	}else{ 
			this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录失败",auto: true,speed: 1500,statu: 0})
  	  	}
  	}
  	return true
  }	  
}
export default Third
