import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { FONTS, KEY_PADDED, FILE_NOT_FONTS } from '../../constants/TextConstant'

class FileFonts extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("FileAttr");		
  	}	
    clickTitleBtn(event) {
          event.stopPropagation();
          event.preventDefault();
          const this_Elem = event.currentTarget,
                sib_Elem = this_Elem.nextSibling,
                i_Elem = this_Elem.querySelector('.open-info-bg');
          showOrHideItem(sib_Elem, i_Elem, 'rotate-90-bg')      
    } 
    keyPaddedBtn(event) {
        //一键补齐
        //跳转字体助手进行文件检测，然后再一键补齐 
        event.stopPropagation();
        event.preventDefault();       
    }       		
    render() {
        const { fmData, active } = this.props;
        return (
            <div className={active ? "detail-item file-fonts active" : "detail-item file-fonts"}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn.bind(this)}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <span className="text">{FONTS}{fmData ? fmData.length > 0 ? "（"+ fmData.length +"）" : "（0）" : null}</span>
                     <em className="abs em-normal key-padded" onClick={this.keyPaddedBtn.bind(this)}>{KEY_PADDED}</em>
                 </a> 
                 {
                     fmData ?                                                                  
                         <div className="di-main">
                              <div className="fonts-content">
                                  { 
                                     fmData.length > 0 ?
                                          fmData.map((item, index) => {
                                             if( item.constructor != Object ){
                                                 return <p key={index} className="flex flex-c flex-c-c col-6" style={{"width":"100%"}}>{FILE_NOT_FONTS}</p>
                                             }
                                             return <p className="font-name col-3" key={index}>{isEmpty(item.orignal_font_name) ? "-" : item.orignal_font_name}</p>                                        
                                          }) 
                                     :
                                     <p className="flex flex-c flex-c-c col-6" style={{"width":"100%"}}>{FILE_NOT_FONTS}</p> 
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
export default immutableRenderDecorator(FileFonts)