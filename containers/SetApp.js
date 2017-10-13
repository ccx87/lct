import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import UtilConstant from '../constants/UtilConstant'
import * as LoginActions from '../actions/LoginActions'
import * as CommonActions from '../actions/CommonActions'

import Sidebar from './set/Sidebar'
import Main from './set/Main'
import SmartMenu from '../modules/SmartMenu'
import DialogMain from '../modules/dialogModel/DialogMain'

const doc = document
class SetApp extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
      		resize: {w: 0, h: 0}
      	};
      	UtilConstant.log("LocalFileApp");		
  	}
    setBackBtn(event){
        window.stopConfigRequest();
    }    	
    render() {
        const { login } = this.props
        const { resize } = this.state
        UtilConstant.log("-----SetApp------", this.props)  
        //<div className="top"><a className="icons icons-30 set-back-bg" onClick={this.setBackBtn.bind(this)}>设置</a></div> 
        return (
          <div className="app">
              <Sidebar resize={resize} {...this.props}/>
              <Main resize={resize} {...this.props}/>
              <DialogMain resize={resize} {...this.props}/>
              <SmartMenu resize={resize} {...this.props}/> 
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
        this.props.actions.injectionJs_JsMsgHandle()       
        //获取用户信息
        this.props.actionsLog.getLoginUserRequest()
        //获取配置信息
        setTimeout(() => {
           this.props.actions.getConfigInfo()
        },50)        
    	  this.findDimensions()
  	    window.addEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }
    componentWillUnmount() {
  	    window.removeEventListener('resize', UtilConstant.throttle(this.findDimensions.bind(this), 100), false)
    }  
}
SetApp.propTypes = {
    login: PropTypes.object.isRequired  
}
const mapStateToProps = (state) => {
    return {
       login: state.login,
       
       route: state.inIt.route,
       subRoute: state.inIt.subRoute,
       routeLastUpdated: state.inIt.routeLastUpdated,
      
       getConfig: state.inIt.getConfig,
       configLastUpdated: state.inIt.configLastUpdated       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      actionsLog: bindActionCreators(LoginActions, dispatch),
      actions: bindActionCreators(CommonActions, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SetApp)
