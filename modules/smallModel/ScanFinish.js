import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log } from '../../constants/UtilConstant'

import PercentageBar from './PercentageBar'
import ScanCurrent from './ScanCurrent'

//扫描--扫描文件结束
class ScanFinish extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            page_num: 0,
            page_size: 50           
        };
      	log("ScanFinish--扫描文件结束");		
  	}	       		
    render() {
        return (
            <div className="scan-finish">               
                <div className="close-btn abs flex flex-c flex-c-c" onClick={() => this.props.actions.triggerDialogInfo(null)}>
                   ×
                   <span className="msg-hide abs" >关闭</span> 
                </div>                 
                <div className="runing-model flex flex-c flex-c-c">
                    <PercentageBar {...this.props}/>
                    <ScanCurrent {...this.props}/>
                </div>                
            </div>
        )
    } 
    componentDidMount() {
        if( this.props.dialogData && this.props.dialogData.codeData ){
            //重新获取一下配置信息---获取扫描结束时间
            this.props.actions.getConfigInfo();        
        }      
        setTimeout(() => {
            //初始化请求扫描结果信息
            this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanInfo', {cmd:1, error_page_num: this.state.page_num, per_page_size: this.state.page_size})            
        },100)
        //通知其它区域--扫描完成后解除个别按扭的禁止行为。
        this.props.actions.noticeMessage({action: true, type: 'SCAN'})         
    }               	  
}
export default immutableRenderDecorator(ScanFinish)