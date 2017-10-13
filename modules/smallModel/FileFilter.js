import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty, toggleClass } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'

class FileFilter extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("FileFilter--文件格式过滤");		
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

        fmData["file_filter"] = [
                                   {text: "psd", value: 5},
                                   {text: "eps", value: 12},
                                   {text: "cdr", value: 25},
                                   {text: "ai", value: 1},
                                   {text: "jpg", value: 45}
                                ]
        return (
            <div className={active ? "detail-item file-filter format-filter active" : "detail-item file-filter format-filter"}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn.bind(this)}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <i className="icons-local-material icons-20 file-format-filter-bg"></i>
                     <span className="text">文件格式过滤</span>
                 </a>                                                  
                 <div className="di-main">
                     <div className="filefilter-content">
                        {     
                          fmData ?
                             fmData.file_filter && fmData.file_filter.length > 0 ?
                                 fmData.file_filter.map((item, index) => {
                                     return <p className="ffc-item flex flex-c" key={index} onClick={this.fileFilterBtn.bind(this, item)}>
                                                <i className="icons-6 select-filter-bg flex flex-l-l flex-item-gsb-0"></i>
                                                <span className="text flex flex-l-l col-3">{item.text}</span>
                                                <span className="text flex flex-r-r col-6">{item.value}</span>
                                            </p>
                                 }) 
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
export default immutableRenderDecorator(FileFilter)