import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { FILE_ATTRIBUTES, FILE_NAME, DOCUMENT_FORMAT, CREATE_SOFTWARE, DATE_CREATED, MODIFIED_DATE, SIZE, RESOLUTION, NOT_YET } from '../../constants/TextConstant'

class FileAttr extends Component {
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
    render() {
        const { fmData, active, attrData } = this.props;
        let filetype = null
        if( attrData && !isEmpty(attrData.file_type) ){
            filetype = attrData.file_type
        }else{
            const regtype = /\.(\w+)$/; //正则--获取最后一个后缀
            if( fmData && fmData.file_name ){
                const typeArr = fmData.file_name.match(regtype);
                if( typeArr && typeArr.constructor == Array && typeArr.length > 0 ){
                     filetype = typeArr[typeArr.length-1]
                }
            }
        }
        return (
            <div className={active ? "detail-item file-attr active" : "detail-item file-attr"} key={this.props.attributesLastUpdated}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn.bind(this)}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <span className="text">{FILE_ATTRIBUTES}</span>
                 </a> 
                 {
                       fmData !== null ?
                            <div className="di-main">
                                <div className="fileAttr-content">
                                    <dl>
                                        <dt>{FILE_NAME}</dt>
                                        <dd>{isEmpty(fmData.file_name) ? '-' : fmData.file_name}</dd>
                                        <dt>{DOCUMENT_FORMAT}</dt>
                                        <dd>
                                           {
                                              filetype ?
                                                  filetype
                                              :
                                                  '-' 
                                           }
                                        </dd>
                                        <dt>{CREATE_SOFTWARE}</dt>
                                        <dd>{isEmpty(fmData.product_name) ? '-' : fmData.product_name}</dd>
                                        <dt>{DATE_CREATED}</dt>
                                        <dd>{isEmpty(fmData.create_time) ? '-' : fmData.create_time}</dd>
                                        <dt>{MODIFIED_DATE}</dt>
                                        <dd>{isEmpty(fmData.last_modify_time) ? '-' : fmData.last_modify_time}</dd>
                                        <dt>{SIZE}</dt>
                                        <dd>{isEmpty(fmData.size_display) ? '-' : fmData.size_display}</dd>
                                        <dt>{RESOLUTION}</dt>
                                        <dd>{isEmpty(fmData.dpi) ? '-' : fmData.dpi}</dd>                                                                                                                                                                                                                                                                                             
                                    </dl>
                                </div>
                            </div>
                       :
                            null                           
                 }                                                 
            </div>   
        )
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))      
    }	  
}
export default immutableRenderDecorator(FileAttr)