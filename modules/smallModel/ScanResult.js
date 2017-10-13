import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { log, isEmpty } from '../../constants/UtilConstant'

import ScanResultItem from './ScanResultItem'

//扫描结果
class ScanResult extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {  
            page_num: 0,
            page_size: 50            
        };
      	log("ScanResult--扫描结果");		
  	}	       		
    render() {       
        const { resultData } = this.props  
        const { page_num, page_size } = this.state                
        return (
            <div className="scan-result h-full">
                {
                    resultData ?
                        <div className="sr-content h-full">
                            <ScanResultItem 
                              {...this.props} 
                              page_num={page_num} 
                              page_size={page_size}/>                                                            
                        </div>    
                    :
                        <div className="flex flex-c flex-c-c h-full">
                            {loadingHtml3('请求数据中，请稍候...')}
                        </div>                    
                }
            </div>
        )
    }
    componentDidMount() {
        setTimeout(() => {
            //初始化请求扫描结果信息
            this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanInfo', {cmd:1, error_page_num: this.state.page_num, per_page_size: this.state.page_size})            
        },100)
    }            	  
}
export default immutableRenderDecorator(ScanResult)