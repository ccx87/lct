import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'
import { SHOW_MINMIZE_SHITU_FEATURE, SHOW_DIALOG_SCAN_SHITU_FEATURE } from '../../constants/TodoFilters'

import PercentageBar from './PercentageBar'
import ScanCurrent from './ScanCurrent'

//扫描--获取识图信息
class ScanShiTuFeature extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            timer: null
        };
      	log("ScanShiTuFeature--获取识图信息");		
  	}	
    minimizePanel() {
        if( this.props.thisData && this.props.progressData && this.props.dialogData ){
            const total_progress = !isEmpty(this.props.progressData.total_progress) ? this.props.progressData.total_progress : 0,
                infoData = {
                    text: this.props.thisData.scan_content, 
                    value: total_progress <= 100 ? total_progress +'%' : '100%',
                    defaultValue: total_progress < 100 ? total_progress +'%' : '扫描结束' 
            };
            //data在最大化时数据用在进度百分比对应上
            //tipData是预览图生成所需要的组件--显示状态
            infoData['data'] = {
                scan_content: infoData.text,
                total_progress: total_progress,
                tipData: this.props.tipData
            }
            setTimeout(() => {
                this.props.actions.triggerMinmizeInfo({   
                    type: SHOW_MINMIZE_SHITU_FEATURE, 
                    mode:'add',
                    data: infoData,
                    rawData: this.props.dialogData.rawData ? this.props.dialogData.rawData : this.props.dialogData,
                    position: SHOW_DIALOG_SCAN_SHITU_FEATURE  
                })
            },50)
            this.props.actions.triggerDialogInfo(null)
        }else{
            log('---------最小化必要的数据为空，不作处理----------')
        }        
    }       		
    render() {
        return (
            <div className="scan-shitu-feature">
                <div className="minimize-btn abs flex flex-c flex-c-c" onClick={this.minimizePanel.bind(this)}>
                   ―
                   <span className="msg-hide abs">最小化</span> 
                </div>
                <div className="runing-model flex flex-c flex-c-c">
                     <PercentageBar {...this.props}/>
                     <ScanCurrent {...this.props}/>
                </div>                
            </div>
        )
    }
    componentDidMount() {
        //2分钟后默认最小化。
        this.state.timer = setTimeout(() => {
            this.minimizePanel(); 
        },120000);      
    }
    componentWillUnmount() {
        if( this.state.timer ){
            clearTimeout(this.state.timer);
        }       
    }                	  
}
export default immutableRenderDecorator(ScanShiTuFeature)