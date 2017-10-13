import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log } from '../../constants/UtilConstant'

import Progress from './Progress'
import Info from './Info'

class Status extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("Status");		
  	}	
    render() {
        return (
        <div className="t-left flex">
            <div className="t-top flex">
                <div className="t-title">扫描状态</div>
                <div className="set-right">
                    <button className="default-button setting-btn" onClick={() => this.props.actions.sendHandleMessage('SettingMsgProcess', 'jumpTabPage', {index: 3})}>{/*扫描设置*/}</button>
                </div>
            </div>
            <div className="t-content">
                <Progress {...this.props}/>
                <Info {...this.props}/>                                
            </div>
        </div>
        )
    } 
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }    
}
export default (immutableRenderDecorator(Status))
