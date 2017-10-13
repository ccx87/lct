import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'

/* 弹出层--引导1  */
class Guild1 extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            step: 1
        };
      	log("Guild1");
  	}
    stepNext(st, event) {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            step: st
        })
        if( st == 3 ){
            //修改配置文件--更改面板设置
            let val = ""+ 2 +"";
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
                        <p style={{"position":"absolute","width":"650px","height":"138px","top":"15px","right":"20px"}}>
                           <img src="compress/img/guild1-1.png"/>
                           <a onClick={this.stepNext.bind(this,2)} className="abs" style={{"width":"135px","height":"50px","left":"175px","bottom":"0px"}}></a>
                        </p>
                    :
                    step == 2 ?
                        <p style={{"position":"absolute",/*"width":"581px","height":"169px",*/"top":"52px","left":"260px"}}>
                           <img src="compress/img/guild1-2.png"/>
                           <a onClick={this.stepNext.bind(this,3)} className="abs" style={{"width":"135px","height":"50px","left":"230px","bottom":"0px"}}></a>
                        </p>
                    :
                        null
                }
  		       </div>
  	}
}
export default Guild1
