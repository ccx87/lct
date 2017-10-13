import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { showOrHideItem } from '../../constants/DomConstant'
import { log, isEmpty, toggleClass, addHueArray } from '../../constants/UtilConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'
import { HUE_LIST } from '../../constants/DataConstant'

class HueFilter extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("HueFilter--色调过滤");		
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

        fmData["hue_filter"] = [
                                   {value: 1, num: 5},
                                   {value: 2, num: 12},
                                   {value: 3, num: 25},
                                   {value: 4, num: 1},
                                   {value: 5, num: 45},
                                   {value: 6, num: 5}
                                ];
        const newArray = addHueArray(HUE_LIST, fmData.hue_filter);                        
        return (
            <div className={active ? "detail-item file-filter hue-filter active" : "detail-item file-filter hue-filter"}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn.bind(this)}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <i className="icons-local-material icons-20 file-hue-filter-bg"></i>
                     <span className="text">色调过滤</span>
                 </a>                                                  
                 <div className="di-main">
                     <div className="filefilter-content">
                        {     
                          fmData ?
                             fmData.hue_filter && fmData.hue_filter.length > 0 ?
                                 newArray && newArray.length > 0 ?
                                     newArray.map((item, index) => {
                                         return <p className="ffc-item flex flex-c" key={index} onClick={this.fileFilterBtn.bind(this, item)}>
                                                    <i className="icons-6 select-filter-bg flex flex-l-l flex-item-gsb-0"></i>
                                                    <span className="text flex flex-l-l col-6">
                                                       <em className="hue-color-bg" style={{"background": item.color}}></em>
                                                       <span className="hue-color-text">{item.text}</span>
                                                    </span>
                                                    <span className="text flex flex-r-r col-6">{item.num}</span>
                                                </p>
                                     })
                                 :
                                     null     
                             :
                                 null
                          :
                             null 
                        }       
                     </div>
                 </div>
            </div>   
        )
    }	  
}
export default immutableRenderDecorator(HueFilter)