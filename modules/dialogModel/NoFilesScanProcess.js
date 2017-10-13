import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty } from '../../constants/UtilConstant'
import { GENERAL_SET, PATH_SET } from '../../constants/TodoFilters'
import { msgAlertSuccessHtml } from '../../constants/RenderHtmlConstant'

/* 弹出层--识图没文件时去扫描流程图  */
class NoFilesScanProcess extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("NoFilesScanProcess");		
  	}
    jumpFilesSet() {
        console.log(this.props.actions)
        this.props.actions.sendHandleMessage('SettingMsgProcess', 'jumpTabPage', {"index": 1})
        this.props.actions.triggerDialogInfo(null)
    }
	  render() {
  		  return <div className="dialog no-files-scan-process-layer" ref="verticalCenter">
                   <div className="dialog-title flex flex-c">
                       <span style={{"width": "100%"}}>系统设置</span>
                       <a className="close-dialog" onClick={() => this.props.actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
                   </div>
                   <div className="dialog-content">
                       <p className="col-3" style={{"paddingTop":"15px","paddingBottom":"5px"}}>想以图识图？只有扫描后的文件才能被识图到哦！</p>
                       <p className="col-6" style={{"paddingTop":"10px","paddingBottom":"10px"}}>第一步：切换到素材管理界面</p>
                       <p>
                          <img src="compress/img/help-scan-1.png" alt="img"/>
                       </p>
                       <p className="col-6" style={{"paddingTop":"10px","paddingBottom":"10px"}}>第二步：选你的素材文件，开始扫描</p>
                       <p>
                          <img src="compress/img/help-scan-2.png" alt="img"/>
                       </p>                       
                   </div>
                   <div className="dialog-footer flex flex-c flex-c-c">
                        <button className="dialog-btn button confirm-btn" onClick={this.jumpFilesSet.bind(this)}>知道了，去设置</button>
                   </div>                   
  		         </div>  
  	}
  	componentDidMount() {
    		if(this.refs.verticalCenter){
            absVerticalCenter2(this.refs.verticalCenter)
    		}	
        const parElem = document.querySelector('.no-files-scan-process-layer'),
              dragElem = parElem && parElem.querySelector('.dialog-title');
        if( dragElem ){          
            dragDrop(dragElem, parElem)
        }        
  	}    			
}
export default (immutableRenderDecorator(NoFilesScanProcess))
