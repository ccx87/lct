import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import { SHOW_REGIST_PHONE, SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT, SHOW_DIALOG_LOGIN_LAYER, DO_NOT_LOGIN } from '../../constants/TodoFilters'
import { isEmpty, log } from '../../constants/UtilConstant'

const doc = document
class Login extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		autoLogin: false,
    		remember: false
    	};
    	log("Login");		
	}
	signOut() {
		window.cancelLoginRequest("0") 
	}
	closeDialog() {
		this.props.actions.triggerDialogInfo(null)
	}
	checkRememberPassword(event){
		this.setState({
			remember: !this.state.remember
		})
	}
	checkAutoLogin() {
		this.setState({
			autoLogin: !this.state.autoLogin
		})
		if( !this.state.autoLogin && !this.state.autoLogin ) {
			this.setState({
				remember: !this.state.autoLogin
			})			
		}
	}
	jumpLogin() {
  	  	const strData = {password:null,auto_login:null,name:null,id:null,headPortrait:null,login_type:0};
  	  	window.setLoginUserRequest(JSON.stringify(strData))		 		
	}
	eventsKeyDown(event) {
		var keyCode = window.event ? event.keyCode : event.which;
		if(keyCode == 13) {
			this.loginUserSubmit()
		}		
	}
	loginUserSubmit(event) {
		const elem = doc.getElementById('LOGIN_submit'),
		      name = doc.getElementById('LOGIN_userName').value,
		      password = doc.getElementById('LOGIN_userPwd').value,
			  get_c = this.props.getConfig && this.props.getConfig.data;		
		if(isEmpty(name)){
			doc.getElementById('REG_userName_msg').innerHTML = '帐号不能为空'
			return false
		}
		if(isEmpty(password)){
			doc.getElementById('REG_userPwd_msg').innerHTML = '密码不能为空'
			return false
		}
		elem.disabled = true
		elem.innerHTML = '正在登录中...'
		const get_v = get_c && get_c.APP_Version && get_c.APP_Version.value,
		      data = {
				loginCode: name,
				password: password,
				autoLgn: this.state.autoLogin,
				userAgent: 1,  //1表示客户号登录，其它目前表示网页登录
				version: get_v	//客户端版本号		
			  };  			  	  
		setTimeout(() => {
			this.props.actions.loginUserSubmit(data)
		}, 10)
	}
	selectWindowSize(event) {
		const div_Elem = doc.querySelector('#container')
		div_Elem.style.visibility = 'hidden'
        window.setLoginWndSizeRequest("1")
	}		
  	render() {
	  	const { login, actions, onHandleShow, model } = this.props
	  	const { autoLogin, remember } = this.state
	    return (
		      <div className="login" onKeyDown={this.eventsKeyDown.bind(this)}> 
		        <div className="container-layer" id="container">
		           <div className="abs dialog-opacity-layer"></div>
		           <a className="abs close icons-login close-bg icons-30" title="关闭" onClick={model && model == SHOW_DIALOG_LOGIN_LAYER ? this.closeDialog.bind(this) : this.signOut.bind(this)}>关闭</a>
		           <div className="layer">
		               <p className="p-tit"><span className="line abs l"></span><span className="title">使用链图云帐号登录</span><span className="line abs r"></span></p>
		               <div className="mod-reg">
		                   <form id="QIUZITI_LONIG_form" method="POST">
		                       <p>
		                          <input id="LOGIN_userName" type="text" name="userName" className="text-input text-input-userName" placeholder="输入手机号/邮箱/链图云帐号" />
		                          <span className="sp-msg col-red" id="REG_userName_msg"></span>
		                       </p>
		                       <p>
		                          <input id="LOGIN_userPwd" type="password" name="userPwd" className="text-input text-input-userPwd" placeholder="请输入密码" />
		                          <span className="sp-msg col-red" id="REG_userPwd_msg"></span>
		                       </p>
		                       <p className="p-1 clearfix">
		                          <lable className="check-lable flex flex-c g-l check-remember" onClick={this.checkRememberPassword.bind(this)}>
		                              <i className={ remember ? "icons-login icons-18 checked-bg" : "icons-login icons-18 check-bg" }></i>
		                              记住密码
		                          </lable>
		                          <lable className="check-lable flex flex-c g-r check-auto" onClick={this.checkAutoLogin.bind(this)}>
		                              <i className={ autoLogin ? "icons-login icons-18 checked-bg" : "icons-login icons-18 check-bg" }></i>
		                              自动登录
		                          </lable>	  
		                       </p>
		                       <p className="p-2">
		                          <button type="button" id="LOGIN_submit" className="btn-input btn-input-submit" onClick={this.loginUserSubmit.bind(this)}>登录</button>    
		                       </p>
		        		   </form>
	                       <p className="p-2">
	                          <a style={{"display": "none"}} href="javascript:;" className="go-regist" onClick={ () => onHandleShow(SHOW_REGIST_PHONE) }>新用户注册</a>
	                          <a href="javascript:;" className="go-regist" onClick={ () => openFileRequest(4, "http://www.lianty.com/site/login?page=reg") }>新用户注册</a>
	                       </p>
	                       <p className="p-1 clearfix">
	                       	  <a className="reg-msg g-l col-lan" onClick={() => openFileRequest(4, "http://www.lianty.com/site/login?page=forget")}>忘记密码？</a>
	                          {
	                          	  model && model == SHOW_DIALOG_LOGIN_LAYER ?
	                          	      null
	                          	  :
	                          	      <a style={{"display": "none"}} className="jump-login g-r col-lan" onClick={ this.jumpLogin.bind(this) }>&gt;&gt; 跳过登录</a>    
	                          }
	                       </p>        		   
		               </div>
		               <p className="p-tit">
		                  <span className="line abs l"></span>
		                  <span className="title">使用第三方帐号登录</span>
		                  <span className="line abs r"></span>
		               </p>
		               <p className="p-third">
		                  <a href="" style={{"display":"none"}}>
		                     <i className="icons-login icons-40 sina-bg"></i>
		                  </a>
		                  <a href="https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101313065&redirect_uri=http%3A%2F%2Fwww.lianty.com%2Fsite%2FpcQQLog&scope=all" onClick={this.selectWindowSize.bind(this)} className="icons-login icons-40 qq-bg">
		                  </a>
		                  <a href="" style={{"display":"none"}}>
		                     <i className="icons-login icons-40 weixin-bg"></i>
		                  </a>
		               </p>	               
		           </div>
		           <div className="dialog-main-msg"><div className="dialog-main-opacity"></div><p className="p-msg"></p></div>
		        </div>     
		      </div>
	    )
  	}
  	componentDidMount() { 
		setTimeout(() => {
			this.props.actions.getHistoryUserData()	
		},30) 
  	}
  	componentWillUpdate(nextProps) {
  		if( !nextProps.setUserLogin ){
		  	if(nextProps.login.userData){
		  	  	if( nextProps.login.loginleLastUpdated !== this.props.login.loginleLastUpdated &&
		  	  	    nextProps.login.userData.errorCode == 0 ){
		  	  		let com = nextProps.login.commitData,
		  	  	        user = nextProps.login.userData.data;
                    com = com || {};
                    user = user || {};
		  	  	    const strData = { 
				  	  	  	    password: this.state.remember ? com.password : null,
				  	  	  	    auto_login: com.autoLgn,
				  	  	  	    name: com.loginCode,
				  	  	  	    id: user.id,
				  	  	  	    nick_name: user.nickName,
				  	  	  	    headPortrait: user.headPortraitPath,
				  	  	  	    login_type: 1
				  	  	  }; 	    
		  	  	  	this.props.actions.setLoginUserRequest(strData)
		  	  	}	  	  
		  	}    
			if( nextProps.login.historyUserData && this.props.login.userData == null && 
			  	nextProps.login.historyLastUpdated !== this.props.login.historyLastUpdated ){
				const submit_Elem = doc.getElementById('LOGIN_submit'),
				      name_Elem = doc.getElementById('LOGIN_userName'),
				      pw_Elem = doc.getElementById('LOGIN_userPwd'),
				      body_Elem = doc.querySelector('.dialog-opacity-layer'),
				      auto_Elem = doc.querySelector('.check-lable.check-auto i'),
				      remember_Elem = doc.querySelector('.check-lable.check-remember i'),
				      get_c = nextProps.getConfig.data;		
			  	const t_history = nextProps.login.historyUserData,
			  	      get_v = get_c && get_c.APP_Version ? get_c.APP_Version.value : ''; 
			  	if(t_history.data){
			  	  	const len = t_history.data.length 
			  	  	if( len > 0 ){
			  	  	  	const history = t_history.data[len-1]
			  	  	  	name_Elem.value = history.name
			  	  	  	pw_Elem.value = history.password
			  	  	  	if( !isEmpty(history.password) ){
			  	  	  	    remember_Elem.className = 'icons-login icons-18 checked-bg';
			  	  	  	  	this.state.remember = true;
			  	  	  	}
			  	  	  	if(history.auto_login){
			  	  	  	    auto_Elem.className = 'icons-login icons-18 checked-bg';
			  	  	  	    this.state.autoLogin = true;
			  	  	  	    body_Elem.style.display = 'block';      
						    submit_Elem.disabled = true;
						    submit_Elem.innerHTML = '正在自动登录中...';
						    const data = {
								loginCode: history.name,
								password: history.password,
								autoLgn: history.auto_login,
								userAgent: 1,
								version: get_v									
						    };
						    setTimeout(() => {
								this.props.actions.loginUserSubmit(data)
						    }, 500)
			  	  	  	}    
			  	  	}
			  	}
			} 
		}
		if( nextProps.setUserLogin && nextProps.setUserLoginLastUpdated !== this.props.setUserLoginLastUpdated ) {
            if( nextProps.setUserLogin.data && this.props.model == 'show_dialog_login_layer' ){
            	this.props.actions.getLoginUserRequest()
                this.props.actions.triggerDialogInfo(null)
            }
		}

  	} 
  	componentDidUpdate(nextProps) {
  	  	const submit_Elem = doc.getElementById('LOGIN_submit'),
  	          body_Elem = doc.querySelector('.dialog-opacity-layer'),
  	          name_sp_Elem = doc.getElementById('REG_userName_msg');        	
	  	if( this.props.login.loginleLastUpdated !== nextProps.login.loginleLastUpdated && 
	  		this.props.login.userData ){
	  	    if( this.props.login.userData.errorCode == 101 ){
	  	  	    body_Elem.style.display = 'none'
	  	  	    submit_Elem.innerHTML = '登录'
	  	  	    submit_Elem.disabled = false
	  	  	    name_sp_Elem.innerHTML = this.props.login.userData.error
	  	    }
	  	}
	  	if( this.props.login.loginleLastUpdated !== nextProps.login.loginleLastUpdated &&
	  		this.props.login.error && this.props.login.errorCode == 101 ){
	  	    body_Elem.style.display = 'none'
	  	    submit_Elem.innerHTML = '登录'
	  	  	submit_Elem.disabled = false
	  	  	this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: this.props.login.error,auto: true,speed: 3000,statu: 0})	  		
	  	}	  
  	} 	  
}
function mapStateToProps(state) {
  	return { 
  		setUserLogin: state.login.setUserLogin,
        setUserLoginLastUpdated: state.login.setUserLoginLastUpdated 
    }
}
export default connect(
    mapStateToProps
)(Login)