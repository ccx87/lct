import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { ROUTES } from '../../constants/DataConstant'
import { log  } from '../../constants/UtilConstant'
import { SHOW_REGIST_PHONE, SHOW_REGIST_EMAIL, SHOW_REGIST_SUCCESS } from '../../constants/TodoFilters'

import RegistPhone from './RegistPhone'
import RegistEmail from './RegistEmail'

import * as LoginActions from '../../actions/LoginActions'


class Regist extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: SHOW_REGIST_PHONE
    	};
    	log("Regist");		
	}
	signOut() {
		window.cancelLoginRequest("0") 
	}	
	handleChildShow(filter) {
		this.setState({ filter })
	}			
  render() {
  	const { login, actions, onHandleShow } = this.props
  	const { filter } = this.state
  	const onHandleChileShow = this.handleChildShow.bind(this)
    return (
	      <div className="regist">
	        <div className="container-layer" id="container">
	           <a className="abs close icons-login close-bg icons-30" title="关闭" onClick={this.signOut.bind(this)}>关闭</a>
	           <div className="layer">
	               <p className="p-tit">
	                  <span className="line abs l"></span>
	                  {
	                  	  filter === SHOW_REGIST_PHONE ?
	                  	     <span className="title">使用手机号注册</span>
	                  	  :
	                  	  filter === SHOW_REGIST_EMAIL ?
	                  	     <span className="title">使用邮箱注册</span>
	                  	  :
	                  	  filter === SHOW_REGIST_SUCCESS ?
	                  	     null
	                  	  :
	                  	     null   
	                  }
	                  <span className="line abs r"></span>
	               </p>
                   {
                   	   filter === SHOW_REGIST_PHONE ?
                   	      <RegistPhone onHandleShow={onHandleShow} onHandleChileShow={onHandleChileShow}/>
                   	   :
                   	   filter === SHOW_REGIST_EMAIL ? 
                   	      <RegistEmail onHandleShow={onHandleShow} onHandleChileShow={onHandleChileShow}/>
                   	   :
                   	   filter === SHOW_REGIST_SUCCESS ?
                   	      null
                   	   :
                   	      null         
                   	    
                   }
	           </div>
	           <div className="dialog-main-msg"><div className="dialog-main-opacity"></div><p className="p-msg"></p></div>
	        </div>
	      </div>
    )
  }	  
}
export default Regist
