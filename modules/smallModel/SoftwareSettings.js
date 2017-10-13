import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, toggleClass } from '../../constants/UtilConstant'
import { showOrHideItem, clientHeight } from '../../constants/DomConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'

class SoftwareSettings extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("FolderSettings");		
  	}	 
    changeSoftware(event) {
        event.stopPropagation();
        event.preventDefault();
        toggleClass(event.currentTarget, 'active')        
    }       		
    render() {
        const { actions } = this.props
        return (
            <div className="software-settings"> 
                <div className="ss-content flex">
                    <div className="ss-item">
                       <p className="col-3 item-title">注：<span className="col-9">我们需要依靠以下设计软件来生成文件预览图</span></p>
                       <div className="item-constent flex flex-l col-6">
                           <div className="ss-left col-3 flex flex-c flex-item-gsb-0">
                                <i className="icons-local-material icons-20 file-format-psd-bg right-m-5"></i>
                                默认软件设置：
                           </div>
                           <div className="ss-right">                            
                               <p className="p-line flex flex-c">
                                  <i className="icons-14 outer-circle flex flex-c flex-c-c active" onClick={this.changeSoftware.bind(this)}>
                                      <em className="icons-6 inner-circle"></em>
                                  </i>
                                  <span className="txt-line">
                                      Photoshop CC 2015（<span className="col-lan">已安装</span>）
                                  </span> 
                               </p>
                               <p className="p-line flex flex-c">
                                  <i className="icons-14 outer-circle flex flex-c flex-c-c" onClick={this.changeSoftware.bind(this)}>
                                      <em className="icons-6 inner-circle"></em>
                                  </i>
                                  <span className="txt-line">
                                      Photoshop CC 2014（<span className="col-lan">已安装</span>）
                                  </span>                           
                               </p>
                           </div>
                       </div>
                       <div className="item-constent flex flex-l col-6">
                           <div className="ss-left col-3 flex-c flex flex-item-gsb-0">
                                <i className="icons-local-material icons-20 file-format-ai-bg right-m-5"></i>
                                默认软件设置：
                           </div>
                           <div className="ss-right">                            
                               <p className="p-line flex flex-c">
                                  <i className="icons-14 outer-circle flex flex-c flex-c-c active" onClick={this.changeSoftware.bind(this)}>
                                      <em className="icons-6 inner-circle"></em>
                                  </i>
                                  <span className="txt-line">
                                      Adobe Illustrator CC 2015（<span className="col-lan">已安装</span>）
                                  </span> 
                               </p>
                           </div>
                       </div>
                       <div className="item-constent flex flex-l col-6">
                           <div className="ss-left flex flex-c col-3 flex-item-gsb-0">
                                <i className="icons-local-material icons-20 file-format-cdr-bg right-m-5"></i>
                                默认软件设置：
                           </div>
                           <div className="ss-right">                            
                               <p className="p-line flex flex-c">
                                  <span className="txt-line col-9">
                                      Corel DRAW（<span className="col-red">已安装</span>）
                                  </span> 
                               </p>
                               <p className="p-msg col-9">
                                  建议
                                  <a className="col-lan">马上去下载</a>
                                  ，以便本地文件预览图的查看
                               </p>
                           </div>
                       </div>
                       <div className="item-constent flex flex-l col-6">
                           <div className="ss-left col-3 flex flex-c flex-item-gsb-0">
                                <i className="icons-local-material icons-20 file-format-jc1-bg right-m-5"></i>
                                默认软件设置：
                           </div>
                           <div className="ss-right">                            
                               <p className="p-line flex flex-c">
                                  <i className="icons-14 outer-circle flex flex-c flex-c-c active" onClick={this.changeSoftware.bind(this)}>
                                      <em className="icons-6 inner-circle"></em>
                                  </i>
                                  <span className="txt-line">
                                      金昌（<span className="col-lan">已安装</span>）
                                  </span> 
                               </p>
                           </div>
                       </div>                                              

                    </div>                    
                </div>
                <div className="dialog-footer flex flex-c">
                    <p className="flex flex-r-r" style={{"width":"100%"}}>
                      <a className="dialog-btn cancel-btn" onClick={() => actions.triggerDialogInfo(null)}>取消</a> 
                      <a className="dialog-btn confirm-btn">确认</a>
                    </p>
                </div>                
            </div>   
        )
    }	
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }         
}
export default immutableRenderDecorator(SoftwareSettings)