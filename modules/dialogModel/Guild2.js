import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'

/* 弹出层--引导2  */
class Guild2 extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            step: 1
        };
      	log("Guild2");
  	}
    stepNext(st, event) {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            step: st
        })
        if( st == 3 ){
            //修改配置文件--更改面板设置
            let val = ""+ 1 +"";
            const data = [{key:"user_guide", value: val}]
            setTimeout(() => {
                this.props.actions.setConfigRequest(data,'INIT_SET_CONFIG_DEFAULT')
            },10)
            this.props.actions.triggerDialogInfo(null)
        }
    }
  	render() {
  		const { actions, dialogData } = this.props
      const { step } = this.state
  		return <div className="dialog g-guild-layer">
                {
                    step == 1 ?
                        <p style={{"position":"absolute","width":"758px","height":"284px","top": "62px","left": "50%","marginLeft": "-379px"}}>
                           <img src="compress/img/guild2-1.png"/>
                           <a onClick={this.stepNext.bind(this,2)} className="abs" style={{"width":"135px","height":"50px","right":"44px","top":"0px"}}></a>
                        </p>
                    :
                    step == 2 ?
                        <p style={{"position":"absolute","width":"659px","height":"168px","top":"10px","left":"320px"}}>
                           <img src="compress/img/guild2-2.png"/>
                           <a onClick={this.stepNext.bind(this,3)} className="abs" style={{"width":"135px","height":"50px","right":"222px","bottom":"0px"}}></a>
                        </p>
                    :
                        null
                }
  		       </div>
  	}
}
export default Guild2
