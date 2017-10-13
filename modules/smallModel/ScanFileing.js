import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log } from '../../constants/UtilConstant'

import PercentageBar from './PercentageBar'
import ScanCurrent from './ScanCurrent'

//扫描--正在扫描文件中
class ScanFileing extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ScanFileing--正在扫描文件中");		
  	}	       		
    render() {
        return (
            <div className="scan-fileing">
                 <div className="runing-model flex flex-c flex-c-c">
                     <PercentageBar {...this.props}/>
                     <ScanCurrent {...this.props}/>
                </div>
            </div>
        )
    }            	  
}
export default immutableRenderDecorator(ScanFileing)