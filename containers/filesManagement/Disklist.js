import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, getmCustomScrollbar5, getmCustomScrollbar2 } from '../../constants/UtilConstant'
import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

class Disklist extends Component {
  	constructor(props) {
      	super(props);
        this.state = {};
      	log("Disklist");		
  	}	
    render() {
        const { diskListArray, diskLocalArray, diskMobileArray, diskOfflineArray } = this.props
        return (
            <div className="m-disk-summary" style={{"height":"calc(100% - 45px)", "marginTop": "10px"}}>
                <div className="scroll-list" style={{"height":"100%"}}>
                    <div className="disk-item local">
                        <div className="title box-c">
                            <span className="tit-txt">
                                <i className="icons-local-material icons-10 lm-tit-bg"></i>
                                本机硬盘（{diskLocalArray ? diskLocalArray.length : 0}）
                            </span>
                            <span className="sp-line abs"></span>
                        </div>
                        <div className="list">
                            {
                                diskLocalArray ?
                                    diskLocalArray.length > 0 ?
                                        diskLocalArray.map((item ,index) => {
                                            let i_classes = 'icons-local-material icons-40'; 
                                            if( index == 0 )
                                                i_classes += ' lm-plate0-bg'
                                            else 
                                                i_classes += ' lm-plate1-bg'
                                            return  <div key={index} className="item">
                                                        <div className="icons-40" style={{"marginRight": "10px"}}>
                                                            <i className={i_classes}></i>
                                                        </div>
                                                        <div className="info">
                                                            <span className="col-3">{item.vol_name}（{isEmpty(item.vol_label) ? "未知" : item.vol_label.toUpperCase() }）</span>
                                                            <span className="col-6"><s className="num">{item.cnt}个</s>可识图素材</span>
                                                        </div>
                                                    </div>
                                        })
                                    :
                                        <div className="no-data">暂无盘符数据</div>    
                                :
                                    <div className="default-div" style={{"width": "100%", "height":"100%"}}>
                                        {loadingHtml3()}                                         
                                    </div>      
                            }                                                                                                                                                                                                                                                                     
                        </div>
                    </div>                                     
                    {
                        diskMobileArray && diskMobileArray.length > 0 ?
                            <div className="disk-item mobile">
                                <div className="title box-c">
                                    <span className="tit-txt">
                                        <i className="icons-local-material icons-10 lm-tit-bg"></i>
                                        移动设备（{diskMobileArray.length}）
                                    </span>
                                    <span className="sp-line abs"></span>
                                </div>
                                <div className="list">
                                    {
                                        diskMobileArray.map((item, index) => {
                                            return  <div key={index} className="item">
                                                        <div className="icons-40" style={{"marginRight": "10px"}}>
                                                            <i className="icons-local-material icons-40 lm-plate7-bg"></i>
                                                        </div>
                                                        <div className="info">
                                                            <span className="col-3">{item.vol_name}（{isEmpty(item.vol_label) ? "未知" : item.vol_label.toUpperCase() }）</span>
                                                            <span className="col-6"><s className="num">{item.cnt}个</s>可识图素材</span>
                                                        </div>
                                                    </div>
                                        })
                                    }                                                                                                                                                                                    
                                </div>
                            </div> 
                        :
                            null
                    }
                    {
                        diskOfflineArray && diskOfflineArray.length > 0 ?
                            <div className="disk-item mobile">
                                <div className="title box-c">
                                    <span className="tit-txt">
                                        <i className="icons-local-material icons-10 lm-tit-bg"></i>
                                        离线设备（{diskOfflineArray.length}）
                                    </span>
                                    <span className="sp-line abs"></span>
                                </div>
                                <div className="list">
                                    {
                                        diskOfflineArray.map((item, index) => {
                                            return  <div key={index} className="item">
                                                        <div className="icons-40" style={{"marginRight": "10px"}}>
                                                            <i className="icons-local-material icons-40 lm-plate6-bg"></i>
                                                        </div>
                                                        <div className="info">
                                                            <span className="col-3">{item.vol_name}（{isEmpty(item.vol_label) ? "未知" : item.vol_label.toUpperCase() }）</span>
                                                            <span className="col-6"><s className="num">{item.cnt}个</s>可识图素材</span>
                                                        </div>
                                                    </div>
                                        })
                                    }                                                                                                                                                                                    
                                </div>
                            </div> 
                        :
                            null
                    }
                </div>                                                                                                 
            </div>       
        )
    }
    initMcScroll() {
        const scrollDom = document.querySelector('.m-disk-summary .scroll-list');
        if( scrollDom ){
            if( scrollDom.classList.contains('mCustomScrollbar') ){
                getmCustomScrollbar2($('.m-disk-summary .scroll-list'), 'update')
            }else{
                getmCustomScrollbar5($('.m-disk-summary .scroll-list'))
            }
        }        
    }     
    componentDidMount() {
        this.initMcScroll()
    }       
    componentDidUpdate(nextProps, nextState) {
        if( this.props.diskAt !== nextProps.diskAt ){
            this.initMcScroll()
        }
    }        
}
export default (immutableRenderDecorator(Disklist))
