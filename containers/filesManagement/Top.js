import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log } from '../../constants/UtilConstant'

import Status from './Status'
import Tips from './Tips'

class Top extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("Top");		
  	}	
    render() {
        return (
            <div className="fm-top">
                <Status {...this.props}/>
                <Tips {...this.props}/>
            </div>
        )
    } 
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }    
}
export default (immutableRenderDecorator(Top))
