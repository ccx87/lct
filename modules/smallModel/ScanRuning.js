import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log } from '../../constants/UtilConstant'

import ScanFileing from './ScanFileing'
import ScanShiTuFeature from './ScanShiTuFeature'
import ScanFinish from './ScanFinish'
import ProgressBar from './ProgressBar'
import ScanTip from './ScanTip'

//扫描进行时模块
class ScanRuning extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ScanRuning--扫描进行时模块");        
  	}	       		
    render() {     
        const { activePage, dialogData } = this.props
        return (
            <div className="scan-runing h-full">
                {
                    activePage == 0 || activePage == 1 ?
                        <ScanFileing {...this.props}/>
                    :
                    activePage == 2 ?
                        <ScanShiTuFeature {...this.props}/>
                    :
                    activePage == 3 ?
                        <ScanFinish {...this.props}/>
                    :
                        null
                }
                <div className="progress-model">
                     <ProgressBar {...this.props}/>
                </div>
                <div className="tip-model">
                     <ScanTip {...this.props}/>
                </div>                
            </div>   
        )
    }	      
}
export default immutableRenderDecorator(ScanRuning)