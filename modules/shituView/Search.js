import React, { Component, PropTypes } from 'react'
import ApiConstant from '../../constants/ApiConstant'
import { log, isEmpty, regexStr } from '../../constants/UtilConstant'
import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { SEARCH_ROUTES, CHANGE_RANGE, SHITU_MODE, GET_REGEX_MATCH } from '../../constants/DataConstant'
import {SEARCH_CENTER_TYPE} from '../../constants/AcceptConstant'
import { SHOW_SHITU_MAIN, SHOW_SHITU_INFO, SHOW_NO_FILES_SCAN_PROCESS, 
  SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, JUMP_PAGE } from '../../constants/TodoFilters'

import Commom from './common'  

class Search extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            shituRange: CHANGE_RANGE.loca
      	}
  	}	 
    moveEvents(temp, event) {
      const aDom = event.currentTarget,
            alertDom = aDom && aDom.parentNode.querySelector('.layer-alert-msg');
      if( !alertDom ) {
        return
      }
      alertDom.classList.toggle('show')
    }
    changeRange(rg, event) {
       // if( rg.value === CHANGE_RANGE.neighbor.value ){
       //    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '您还没有链图云邻居，暂时无法搜索邻居素材',auto: true, speed: 2000})
       //    return
       // }
       this.setState({
          shituRange: rg
       })
    }      
    render() {
        const { shituRange } = this.state
        let rangeText;
        if( shituRange.value === CHANGE_RANGE.neighbor.value ){
           rangeText = '邻居'
        }else{
           rangeText = '本机'
        }   
        return (
          <div className="box-panel">
            <div className="filter-line flex">
                <div className="col-6"><b>搜索范围：</b></div>
                <div className="fl-item">
                    <a className={shituRange.value === CHANGE_RANGE.loca.value ? "active" : null} onClick={this.changeRange.bind(this, CHANGE_RANGE.loca)}>
                        <i className="shitu-icon icons-20 search-loca-bg"></i>
                        <span>搜本机</span>
                    </a>
                </div>
                <s></s>
                <div className="fl-item">
                    <a className={shituRange.value === CHANGE_RANGE.neighbor.value ? "active" : null} 
                       onClick={this.changeRange.bind(this, CHANGE_RANGE.neighbor)}
                       onMouseEnter={this.moveEvents.bind(this, 1)}
                       onMouseLeave={this.moveEvents.bind(this, 0)}>
                        <i style={{"top":"-2px"}} className="shitu-icon icons-20 search-ng-bg"></i>
                        <span>搜邻居</span>
                    </a>
                    <div className="abs layer-alert-msg">
                        <span className="top-arrow">
                            <i className="top-arrow1"></i>
                            <i className="top-arrow2"></i>
                        </span>
                        <p>搜索同一局域网下登录链图云的用户电脑素材</p>   
                    </div>
                </div>
                <s></s>
            </div>            
          	<div className='clearfix search-img' id='imgSearch'>
  		          <h3 className='search-title'>{rangeText}素材搜索识别
                </h3>
                <Commom {...this.props} shituRange={shituRange} page={"SEARCH"}/>
  		          <div className="drag-text-tip">拖拽图片到此处或截图后按Ctrl+V试试</div>
          	</div>
          </div>
        )
    } 
    componentWillMount() {
        const srData = this.props.shituResultData;
        if( srData && srData.sendPost && 
            srData.sendPost.range.value != CHANGE_RANGE.loca.value ){
            this.setState({
                shituRange: srData.sendPost.range  
            })  
        }      
    }
    componentDidMount() {
        //开启拖拽
        this.props.actionsST.startGetDragDropFile() 
    }     
    componentWillReceiveProps(nextProps) {            
        //开启和关闭识图服务
        if(nextProps.shituSeriveData && nextProps.shituSeriveDataLastUpdated != this.props.shituSeriveDataLastUpdated){
            if (nextProps.shituSeriveData.error_code == 0) {
                //重新调用更新后的配置信息
                //有时会延时，直接使用返回的值去修改getConfig
                //this.props.actions.getConfigInfo()
                const getConfig = nextProps.getConfig
                if( getConfig && getConfig.data && getConfig.data.scan_docs_feature_switch ){
                   getConfig.data.scan_docs_feature_switch.value = nextProps.shituSeriveData.data 
                }  
                this.props.actions.triggerDialogInfo(null)                 
            }else{
               this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: nextProps.shituSeriveData.error ,auto: true,speed: 2000,statu: 0})
            }
        }
    } 
    componentWillUnmount() {
        try{
            window.asyncStopGetDragDropFileRequest() //关闭拖拽监听
        }catch(e){}
    }     
}
export default Search