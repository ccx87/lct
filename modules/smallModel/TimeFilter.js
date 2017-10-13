import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty, toggleClass } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'

class TimeFilter extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("TimeFilter--时间过滤");		
  	}	
    clickTitleBtn(event) {
          event.stopPropagation();
          event.preventDefault();
          const this_Elem = event.currentTarget,
                sib_Elem = this_Elem.nextSibling,
                i_Elem = this_Elem.querySelector('.open-info-bg');
          showOrHideItem(sib_Elem, i_Elem, 'rotate-90-bg')      
    } 
    fileFilterBtn(item, event) {
        event.stopPropagation();
        event.preventDefault();
        toggleClass(event.currentTarget, 'active')        
    }       		
    render() {
        const { fmData, active } = this.props;

        fmData["time_filter"] = [
                                   {text: "2016/05/26", value: 5},
                                   {text: "2016/06/05", value: 12},
                                   {text: "2016/07/15", value: 25},
                                   {text: "2016/08/13", value: 1},
                                   {text: "2016/09/11", value: 45},
                                   {text: "2016/10/11", value: 5},
                                   {text: "2016/11/01", value: 15},
                                   {text: "2016/12/08", value: 8}
                                ]
        return (
            <div className={active ? "detail-item file-filter time-filter active" : "detail-item file-filter time-filter"}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn.bind(this)}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <i className="icons-local-material icons-20 file-time-filter-bg"></i>
                     <span className="text">按时间过滤</span>
                 </a> 
                 {   
                     fmData ?                                              
                         <div className="di-main">
                             <div className="filefilter-content">
                              {     
                                  fmData.time_filter && fmData.time_filter.length > 0 ?
                                      fmData.time_filter.map((item, index) => {
                                          return <p className="ffc-item flex flex-c" key={index} onClick={this.fileFilterBtn.bind(this, item)}>
                                                      <i className="icons-6 select-filter-bg flex flex-l-l flex-item-gsb-0"></i>
                                                      <span className="text flex flex-l-l col-3">{item.text}</span>
                                                      <span className="text flex flex-r-r col-6">{item.value}</span>
                                                  </p>
                                      }) 
                                  :
                                      null 
                              }       
                             </div>
                         </div>
                     :
                         null
                 }
            </div>   
        )
    }	  
}
export default immutableRenderDecorator(TimeFilter)