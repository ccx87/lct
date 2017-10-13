import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { SCAN_TIP_MODULE } from '../../constants/DataConstant'
import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { log, isEmpty, getmCustomScrollbar4 } from '../../constants/UtilConstant'

//扫描底部下载组件信息
class ScanTip extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            mobileTip: false
        };
      	log("ScanTip--扫描底部下载组件信息");		
  	}	  
    downMsg(item, str) {
        if( item.download_progress > 0 && item.download_progress < 100 ){
              return  <span className="hid-msg">
                          <span>
                              正在下载<span className="col-lan">{str}</span>预览图组件，下载进度：{item.download_progress}%
                          </span>                                                                
                      </span>
        } else if( item.download_progress >= 100 ){
            return  <span className="hid-msg">
                       <span>
                          下载好了：<span className="col-lan">{str}</span>预览图组件已更新成功
                       </span>                                                                
                    </span>
        }else{ return null} 
    }
    mobileTip(dialogData){
        const allData = dialogData.rawData ? dialogData.rawData.allData : dialogData.allData,
              scanPathData = allData.allScanPathData || [],
              mobileData = allData.allMobileDriveData || [];
        const scanArr = scanPathData.map((item) => {
            return item.split(':')[0] +':' 
        })
        let hasUsb = false;
        for( let i = 0, len = mobileData.length; i < len; i++ ){
            if( scanArr.indexOf(mobileData[i].path) > -1 ){
                hasUsb = true;
                break;
            }
        }
        this.setState({
            mobileTip: hasUsb
        })               
    }     		
    render() {
        const { tipData } = this.props
        const { mobileTip } = this.state
        return (
            <div className="scan-tip flex-item-gsb-0 flex flex-c h-full">
                {
                    tipData && tipData.length > 0 ?
                         <p style={{"height": "22px"}} className="col-6 flex flex-c flex-self-r flex-item-gsb-0">
                            预览图高级组件：
                            {
                                tipData.map((item, index) => {
                                    if( !item ) return null;
                                    let itemclass = 'tip-item flex flex-c flex-c-c flex-item-gsb-0', 
                                        tipicons = 'icons-20 icons-scan tip-'+ item.plugin_name +'-bg';   
                                    if( item.download_progress >= 100 ){
                                       itemclass += ' active'; 
                                    }    
                                    return  <span key={index} data-name={item.plugin_name} className={itemclass}>
                                                <i className={tipicons}></i>
                                                <i className="radial"></i>
                                                {
                                                    item.plugin_name == SCAN_TIP_MODULE[0].plugin_name ?
                                                        this.downMsg(item, 'CDR')
                                                    :
                                                    item.plugin_name == SCAN_TIP_MODULE[1].plugin_name ?
                                                        this.downMsg(item, 'AI')
                                                    :
                                                    item.plugin_name == SCAN_TIP_MODULE[2].plugin_name ?
                                                        this.downMsg(item, 'PSD')
                                                    :
                                                    item.plugin_name == SCAN_TIP_MODULE[3].plugin_name ?
                                                        this.downMsg(item, '金昌')
                                                    :                                                     
                                                       null                                                                                                                                                              
                                                }
                                            </span>
                                })
                            }
                         </p>
                    :
                         null     
                }
                {
                    mobileTip ?
                        <p style={{"height": "22px", textAlign: "right"}} className="col-6 flex flex-c flex-self-r flex-item-gsb-1"><span style={{"width":"100%"}}>此次扫描包含移动硬盘或U盘，扫描过程中<span className="col-red">请勿移除此设备</span></span></p>  
                    :
                        null    
                }                                               
            </div>
        )
    }
    componentDidMount() {
        this.mobileTip(this.props.dialogData)
    }
    componentWillReceiveProps(nextProps) {

    }        
    componentDidUpdate(nextProps, nextState) {
        const tipData = this.props.tipData;
        if( tipData && tipData.length > 0 ){
                const nameayy = tipData.map((item) => item.plugin_name),
                      tipDom = document.querySelectorAll('.scan-tip .tip-item'),
                      tempayy = [];    
                tempayy.forEach.call(tipDom, (dom) => {
                    const custext = dom.getAttribute('data-name'),
                          radiusDom = dom.querySelector('.radial'),
                          hasindex = nameayy.indexOf(custext);     
                    if( hasindex > -1 ){
                        if( radiusDom && radiusDom.firstChild ){
                           radiusDom.removeChild(radiusDom.firstChild)
                        }       
                        const dp = tipData[hasindex].download_progress > 0 ? tipData[hasindex].download_progress : 0;                     
                        if( dp > 0 ){
                            $(radiusDom).radialIndicator({
                                  radius: 9,
                                  barColor: '#0C73C2',
                                  barWidth: 2,
                                  initValue: dp,
                                  barBgColor: '#CCCCCC',
                                  displayNumber: false
                            });
                        }
                        if( dp >= 100 ){
                            if( radiusDom && radiusDom.firstChild ){
                               radiusDom.removeChild(radiusDom.firstChild)
                            }
                        }
                    }      
                })            
        }      
    }            	  
}
export default immutableRenderDecorator(ScanTip)