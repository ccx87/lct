import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { log } from '../../constants/UtilConstant'
import { ROUTES } from '../../constants/DataConstant'

import * as CommonActions from '../../actions/CommonActions'

//导航---前进后退
let isNav = true;
class Nav extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            backward: [],
            ahead: [],
            newRoute: {
               route: null,
               subRoute: null 
            } 
        };
      	log("Nav");		
  	}		
    backward() {
        if( isNav ){
            isNav = false
            setTimeout(() => {
                isNav = true
            },800)      
            //后退
            const bdlen = this.state.backward.length,
                  faDom = document.getElementById('Lianty-FontAssistant');      
            if( bdlen > 0 ){
                if( $('.detection-font-main').length > 0 ){
                    this.props.actions.eventsInitializationData();
                    this.props.actions.initializationData();
                    return false;                       
                }                
                const bdroute = this.state.backward.splice(bdlen-1, 1)
                if( bdroute[0] && bdroute[0].route ){
                   bdroute[0].route['mode'] = 'nav'
                }
                if( faDom ){
                    //字体助手
                    //清空events数据
                    this.props.actions.eventsInitializationData();
                    //清空fonts数据
                    if( bdroute[0].route.common ){
                        this.props.actions.initializationLoadingData(bdroute[0].route.common );
                    }else{
                        this.props.actions.initializationLoadingData();
                    }
                    //清除滚动条,等待加载时样式还原
                    if( $(".scllorBar_commonList").length > 0 ){
                      $(".scllorBar_commonList").mCustomScrollbar("destroy");
                    }  
                } 
                setTimeout(() => {
                    this.props.actions.getInItRoute({
                        route: bdroute[0].route, 
                        subRoute: bdroute[0].subRoute
                    })
                },10)         
                this.state.ahead.push(this.state.newRoute)
                this.setState({
                    backward: this.state.backward,
                    ahead: this.state.ahead
                })
            }
        }
        return false
    }	
    ahead() {
        if( isNav ){
            isNav = false
            setTimeout(() => {
                isNav = true
            },800)      
            //前进
            const adlen = this.state.ahead.length,
                  faDom = document.getElementById('Lianty-FontAssistant'); 
            if( adlen > 0 ){
                if( $('.detection-font-main').length > 0 ){
                    this.props.actions.eventsInitializationData();
                    this.props.actions.initializationData();
                    return false;                       
                }                
                const adroute = this.state.ahead.splice(adlen-1, 1)
                if( adroute[0] && adroute[0].route ){
                   adroute[0].route['mode'] = 'nav'                   
                } 
                if( faDom ){
                    //字体助手
                    //清空events数据
                    this.props.actions.eventsInitializationData();
                    //清空fonts数据
                    if( adroute[0].route.common ){
                        this.props.actions.initializationLoadingData(adroute[0].route.common );
                    }else{
                        this.props.actions.initializationLoadingData();
                    }
                    //清除滚动条,等待加载时样式还原
                    if( $(".scllorBar_commonList").length > 0 ){
                      $(".scllorBar_commonList").mCustomScrollbar("destroy");
                    }  
                }
                setTimeout(() => {
                    this.props.actions.getInItRoute({
                        route: adroute[0].route, 
                        subRoute: adroute[0].subRoute
                    })
                },10)                       
                this.state.backward.push(this.state.newRoute)
                this.setState({
                    backward: this.state.backward,
                    ahead: this.state.ahead                
                })                        
            }
        } 
        return false       
    }
    render() {
        const { backward, ahead } = this.state
        let istyle_b = 'icons icons-30 nav-backward',
            istyle_a = 'icons icons-30 nav-ahead';
        if( backward.length > 0 ){
            istyle_b += ' active'
        }    
        if( ahead.length > 0 ){
            istyle_a += ' active'
        }
        return (
    	      <div className="nav-ahead-backward" id="nav-ahead-backward">
                <i className={istyle_b} title="后退" onClick={this.backward.bind(this)}>
                    <em className="abs">后退</em>
                </i>
                <i className={istyle_a} title="前进" onClick={this.ahead.bind(this)}>
                    <em className="abs">前进</em>
                </i>
    	      </div>
        )
    }	
    componentWillReceiveProps(nextProps) {
        if( nextProps.routeLastUpdated !== this.props.routeLastUpdated ) {
            if( nextProps.route && nextProps.route.mode !== 'nav' ){
                if( this.state.newRoute.route ){
                    const data = {
                        route: this.state.newRoute.route,
                        subRoute: this.state.newRoute.subRoute                 
                    }
                    this.state.backward.push(data)
                    this.setState({
                        backward: this.state.backward
                    })                 
                }
            }
            this.setState({
                newRoute: {
                   route: nextProps.route,
                   subRoute: nextProps.subRoute 
                }                
            })
        }
    }  
}
const mapStateToProps = (state) => {
    return {
        route: state.inIt.route,
        subRoute: state.inIt.subRoute,
        routeLastUpdated: state.inIt.routeLastUpdated
    }
}    
const mapDispatchToProps = (dispatch) => {
  return {
     actions: bindActionCreators(CommonActions, dispatch)
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav)