import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'

import ScanResult from './ScanResult'
import ScanRuning from './ScanRuning'

//扫描主窗口内容块
class ScanMain extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ScanMain--扫描主窗口内容块");              
  	}	       		
    render() {     
        const { thisData, progressData, dialogData, activePage, 
                tipData, resultData, actions, stopCompleted, connectMsg,
                getConfig, configLastUpdated } = this.props
        return (
            <div className="scan-main h-full">
                {
                    activePage == 4 ?
                        <div className="h-full sm-result">
                            <ScanResult 
                               dialogData={dialogData} 
                               resultData={resultData}
                               actions={actions}
                               getConfig={getConfig}
                               configLastUpdated={configLastUpdated}/>                  
                        </div>
                    :
                        <div className="h-full sm-runing">
                            <ScanRuning
                                dialogData={dialogData}  
                                thisData={thisData} 
                                tipData={tipData}
                                activePage={activePage}
                                progressData={progressData}
                                actions={actions}
                                resultData={resultData}
                                stopCompleted={stopCompleted}
                                connectMsg={connectMsg}/>                  
                        </div>
                }
            </div>   
        )
    }	      
}
export default immutableRenderDecorator(ScanMain)