import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'

//百分比图显
class PercentageBar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("PercentageBar--百分比图显");		
  	}	       		
    render() {
        const { progressData, activePage, dialogData } = this.props
        return (
            <div className="percentage-bar flex-item-gsb-0">
                {
                    activePage == 4 ? 
                       <div className="pb-content pb-result flex flex-c flex-c-c">
                           <i className="icons-50 icons-scan scan-ok-bg"></i>
                       </div>
                    :
                    activePage == 3 ?
                       <div className="pb-content pb-rundiv flex flex-c flex-c-c">
                            <div className="flex flex-c flex-c-c pb-runing">
                                <img src="compress/img/scan-success.png" alt="success"/>                                
                            </div>
                       </div> 
                    :
                       <div className="pb-content pb-rundiv flex flex-c flex-c-c">
                            <div className="flex flex-c flex-c-c pb-runing">
                                <span className="pb-val">
                                    {
                                        progressData && progressData.total_progress > 0 ? 
                                            progressData.total_progress <= 100 ? 
                                               progressData.total_progress 
                                            :  
                                               100 
                                        : 
                                            0 
                                    }
                                </span>
                                 <span className="pb-bol flex flex-c"><em className="normal flex-self-r">%</em></span>
                                 {
                                     progressData != null && !(progressData.total_progress >= 100) ?
                                       <div className="scan-animation abs">
                                           <div id="rotateScan" className="run"></div>
                                       </div>
                                     :
                                       null                                         
                                 }
                                  <div className="scan-animation abs" style={{"visibility": "hidden"}}>
                                      <div id="runScan" className="run"></div>
                                  </div>                                 
                            </div>
                       </div>   
                }
            </div>   
        )
    }
    componentDidMount() {
        //<i className="icons-50 icons-scan scan-logo-bg"></i>             
        //document.getElementById('rotateScan').classList.add('run')        
    }	  
}
export default immutableRenderDecorator(PercentageBar)