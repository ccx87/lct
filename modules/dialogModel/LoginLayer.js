import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { log } from '../../constants/UtilConstant'
import { SHOW_LIANTY_LOGIN, SHOW_REGIST_PHONE, SHOW_THIRD_LOGIN, SHOW_DIALOG_LOGIN_LAYER } from '../../constants/TodoFilters'

import Login from '../../containers/login/Login'
import * as LoginActions from '../../actions/LoginActions'

/* 弹出层--登录窗口 */
const doc = document
class LoginLayer extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
			filter: SHOW_LIANTY_LOGIN,
    	};
    	log("LoginLayer--弹窗");		
	}
	handleShow(filter) {
	    this.setState({ filter })
	}
	loadCss(url) { 
		const link = doc.createElement( "link" ); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		link.href = url;
		doc.getElementsByTagName( "head" )[0].appendChild( link ); 
	}
	loadScript(url, data) { 
		const script = doc.createElement( "script" ); 
		script.type = "type/javascipt"; 
		script.src = url; 
		if( data ){
			script.setAttribute(data.key, data.val)
		}
		doc.getElementsByTagName( "head" )[0].appendChild( script ); 
	}				
	render() {
		const { dialogData, actionsLogin, login } = this.props
  		const onHandleShow = this.handleShow.bind(this)		
		return <div className="login-dialog-layer abs" ref="verticalCenter">
		           <div className="load-panel">
                   	  <Login onHandleShow={onHandleShow} actions={actionsLogin} login={login} model={SHOW_DIALOG_LOGIN_LAYER}/>
                   </div>
		       </div>	  
	}
	componentDidMount() {
		this.loadCss('compress/css/login.css')
		this.loadScript('http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js', {key: 'data-appid', val: 101313065})
		absVerticalCenter2(this.refs.verticalCenter)
		$('.login-dialog-layer .load-panel').fadeIn("slow");		
	}
	shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))			
	}		
}
function mapDispatchToProps(dispatch) {
    return {
        actionsLogin: bindActionCreators(LoginActions, dispatch)
    }
}
export default connect(
    null,
    mapDispatchToProps
)(immutableRenderDecorator(LoginLayer))
