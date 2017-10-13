import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'

import PercentageBar from './PercentageBar'
import ScanCurrent from './ScanCurrent'
import ScanExecution from './ScanExecution'

//扫描主窗口头部
class ScanTop extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ScanTop--扫描详情页面头部");		
  	}	  	
    render() {
        return (
            <div className="scan-top flex flex-c h-full">
                <ScanCurrent {...this.props}/>
                <ScanExecution {...this.props} />
            </div>   
        )
    }	
    componentDidMount() {

    }             
    componentWillUnmount() {
    }    
}
export default immutableRenderDecorator(ScanTop)