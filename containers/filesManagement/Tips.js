import React, { Component, PropTypes } from 'react'
// import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { isEmpty, getmCustomScrollbar5 } from '../../constants/UtilConstant'

class Tips extends Component {
  	constructor(props) {
      	super(props);
      	this.state = { };
      	console.info("Tips");
  	}
    render() {
        let autoSwitch = true;
        const getConfig = this.props.getConfig,
            data = getConfig && getConfig.data;
        if ( data ) {
            // autoSwitch = (data.auto_scan_switch && data.auto_scan_switch.value == 1);

            if( data.auto_scan_switch && data.auto_scan_switch.value == 1 ) {

            } else {
                autoSwitch = false;
            }
        }
        return (
            <div className="t-right flex">
                <div className="t-title">小贴士</div>
                <div className="t-content">
                    <div className="scroll-list" ref="scroll">
                        <div className="t-item" style={{display: 'none'}}>
                            <i className="icon-bg"></i>
                            <span className="text-line">自动扫描时间间隔：{autoSwitch ? <span><s id="tipScanTime">--</s>小时</span> : '已关闭'}</span>
                        </div>
                        <div className="t-item">
                            <i className="icon-bg"></i>
                            <span className="text-line">下次扫描时间：{autoSwitch ? <span id="nextScanTime"></span> : '已关闭'}</span>
                        </div>
                        <div className="t-item">
                            <i className="icon-bg"></i>
                            <span className="text-line">扫描图像格式：<s id="tipTypeFiles">0</s>种</span>
                        </div>
                        <div className="t-item">
                            <i className="icon-bg"></i>
                            <span className="text-line">我的链图邻居：<s id="tipNeighbor">0</s>个</span>
                        </div>
                        <div className="t-item">
                            <i className="icon-bg"></i>
                            <span className="text-line">已扫描<s id="tipMobileDisk">0</s>个移动设备,无需插入移动设备也可搜索移动设备素材</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //- 组件第一次渲染完成之后
    componentDidMount() {
        const scrollDom = this.refs.scroll;
        if ( scrollDom ) {
            //- 初始化滚动条
            getmCustomScrollbar5($(scrollDom));
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if( this.props.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            const data = this.props.getConfig.data
            if( data ){
                if( data.scan_docs_type_filter ){
                    let arr = [],
                        lens = arr.length;
                    if( !isEmpty(data.scan_docs_type_filter.value) ){
                        arr = data.scan_docs_type_filter.value.split(';') || [];
                    }
                    lens = arr.length;
                    if( document.getElementById('tipTypeFiles') ){
                        document.getElementById('tipTypeFiles').innerText = lens
                    }
                }
                if( data.auto_scan_switch && data.auto_scan_switch.value == 1 ) {
                    if( data.scan_docs_frequence ) {
                        let times = isEmpty(data.scan_docs_frequence.value) ? 0 : data.scan_docs_frequence.value/3600;
                        if( times < 1 ){
                            times = parseFloat(times).toFixed(2);
                        }
                        if( document.getElementById('tipScanTime') ){
                            document.getElementById('tipScanTime').innerText = times > 0 ? times : '--'
                        }
                    }
                }
            }
        }
    }
    //- 组件判断是否重新渲染时调用
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }
    //- 已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {

    }
}
export default (immutableRenderDecorator(Tips))
