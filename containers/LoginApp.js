import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { SHOW_LIANTY_LOGIN, SHOW_REGIST_PHONE, SHOW_THIRD_LOGIN, SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT } from '../constants/TodoFilters'
import { isEmpty, getQueryString, log } from '../constants/UtilConstant'
import { absVerticalCenter2 } from '../constants/DomConstant'

import Home from './Home'
import Login from './login/Login'
import Regist from './login/Regist'
import Third from './login/Third'
import DialogMain from '../modules/dialogModel/DialogMain'

import * as LoginActions from '../actions/LoginActions'

class LoginApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
  			filter: SHOW_LIANTY_LOGIN,
            openId: null          		
      	};
      	log("Login");		
  	}	
    handleShow(filter) {
    		this.setState({ filter })
    }		
    render() {
    	const { login, actions } = this.props
    	const { filter, openId, docsInit } = this.state
    	const onHandleShow = this.handleShow.bind(this)
      return (
      	<div className="main">
      	      {
  	            filter === SHOW_LIANTY_LOGIN ?
  	               <Login onHandleShow={onHandleShow} {...this.props}/>
  	            :
  	            filter === SHOW_REGIST_PHONE ? 
  	               <Regist onHandleShow={onHandleShow} {...this.props}/>
  	            :
                filter === SHOW_THIRD_LOGIN ?
                   <Third onHandleShow={onHandleShow} {...this.props} openId={openId}/>
                :     
  	                null
              }
              <DialogMain {...this.props} />        
          </div>
      )
    }
    componentWillMount() {
        const openId = getQueryString('openId');
        if( !isEmpty(openId) ){
            this.state.filter = SHOW_THIRD_LOGIN;
            this.state.openId = openId;
        }  	
    }
    componentDidMount() {           
        //获取版本号
        this.props.actions.getConfigInfo([{"key": "APP_Version"}])
    } 
    componentDidUpdate(nextProps, nextState) {
        const alertDom = document.querySelector('.alert-dialog-layer');
        if( alertDom ){
            absVerticalCenter2(alertDom)
        }
    }    
}
LoginApp.propTypes = {
    login: PropTypes.any.isRequired,
    actions: PropTypes.object.isRequired
}
function mapStateToProps(state) {
  	return { 
        login: state.login,
        getConfig: state.inIt.getConfig,
        configLastUpdated: state.inIt.configLastUpdated              
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(LoginActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginApp)
