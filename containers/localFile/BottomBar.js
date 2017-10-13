import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { getIntervalValue } from '../../constants/ConfigInfo'
import { getListOffset } from '../../constants/InItConstant'
import { log, dragSilderDrop, isEmpty, formatSize, addClass, removeClass } from '../../constants/UtilConstant'
import { LOCAL_FILE_TOTAL_PANELS, LOCAL_FILE_DESKTOP, LOCAL_FILE_CONTENT, 
         SHOW_LOCAL_FILES_SCAN, SHOW_DIALOG_SCAN_RESULT, SHOW_DIALOG_ALERT,
         SHOW_LIST_MODE, SHOW_THUMBNAIL_MODE } from '../../constants/TodoFilters'        

class BottomBar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            scanPath:{
                show: false,
                text: '',
                statu: 0
            },
            timer: null
        };
      	log("BottomBar");		
  	}
    stateScanPath(show, text, statu) {
        this.setState({
            scanPath:{
                show: show,
                text: text,
                statu: statu
            }            
        })
    }	
    sizeScaleBtn(temp, event) {
        const $ui_line = $('.bc-slider').find('.ui-line'),
              $drag_btn = $('.bc-slider').find('.silder-drag-btn'),
              $elem = $('.file-list-table').find('.file-item'),
              icon_btn = $drag_btn.find('.size-silder-bg');
        clearTimeout(this.state.timer)
        if( $ui_line.length > 0 && $drag_btn.length > 0 ){
            if( !this.refs.bcSilderRef ){
                log('无法获取必要的节点2')
                return false
            }
            let parH,imgH,prop = 1,new_size = 0,thisW = 0,interval=[],
                btnW = $drag_btn[0].clientWidth,
                minW = 16, //16px为左临界点,也是滑动圆的宽度
                maxW = this.refs.bcSilderRef.clientWidth,//获取当前滑块的最大宽度 
                speed = getIntervalValue.thumbnail,//缩略图区间阀值
                displayMode = SHOW_LIST_MODE;
            prop = Math.floor(maxW/5);//按扭移动的比例
            interval = [0*prop,1*prop,2*prop,3*prop,4*prop,5*prop];
            if( prop > 1 ){
                speed = speed*prop;
            }     
            if( temp == 'LESS' ){ 
                //左点击   
                let hasInt = interval.indexOf(btnW), //是否刚好对应区间值
                    _simH = 0;//离上一个区间值的差  
                if( hasInt == -1 ){ 
                    interval.push(btnW)
                    interval.sort((a,b) => a-b)
                    const getIndex = interval.indexOf(btnW),
                          simVal = interval[getIndex-1];
                    if( !isEmpty(simVal) ){
                        thisW = simVal;
                        _simH = btnW - simVal;
                    } 
                    if( thisW < 0 ){
                        thisW = 0
                    }
                    if( _simH > 0 ){
                       //重新调用初始值getIntervalValue.thumbnail
                       speed = getIntervalValue.thumbnail*_simH;
                    }                     
                }else{
                    thisW = btnW - prop;//按扭点击控制为1px的比例
                    if( thisW < 0 ){
                        log(thisW)
                        log(btnW +'左临界点')
                        //less图标变灰
                        icon_btn.css('right', -16)
                        $('.size-less-bg').addClass('most-left-less')
                        return false;
                    }
                }
                if( thisW == 0 ){
                    icon_btn.css('right', -16) 
                    $('.size-less-bg').addClass('most-left-less')
                }else{
                    icon_btn.css('right', -8)
                    $('.size-plus-bg').removeClass('most-right-plus')
                }
                if( $elem.length > 0 ){
                    const firstItemH = parseInt($elem.find('img').eq(0).css('max-height'));
                    parH = $elem[0].clientHeight;
                    imgH = firstItemH-speed;
                    new_size = parH-speed;                 
                } 
            } else {   
                //右点击  
                let hasInt = interval.indexOf(btnW),
                      _simH = 0;//离下一个区间值的差                
                if( hasInt == -1 ){ 
                    interval.push(btnW)
                    interval.sort((a,b) => a-b)
                    const getIndex = interval.indexOf(btnW),
                          simVal = interval[getIndex+1];
                    if( !isEmpty(simVal) ){
                        thisW = simVal;
                        _simH = simVal - btnW;
                        if( thisW > maxW ){
                            thisW = maxW
                        }
                        if( _simH > 0 ){
                           speed = getIntervalValue.thumbnail*_simH;
                        }                        
                    }      
                }else{
                    thisW = btnW + prop;               
                    if( thisW > maxW ){//maxW为右临界点
                        log(thisW)
                        log(maxW)
                        log(maxW +'右临界点')
                        icon_btn.css('right', -4)
                        $('.size-plus-bg').addClass('most-right-plus')
                        return false;
                    }
                }               
                if( thisW == maxW ){
                    icon_btn.css('right', -4)
                    $('.size-plus-bg').addClass('most-right-plus')
                }else{
                    icon_btn.css('right', -8)
                    $('.size-less-bg').removeClass('most-left-less')
                }
                if( $elem.length > 0 ){
                    const firstItemH = parseInt($elem.find('img').eq(0).css('max-height'));
                    parH = $elem[0].clientHeight;
                    imgH = firstItemH+speed;
                    new_size = parH+speed;                    
                }                               
            }
            if( $elem.length > 0 ){
                if( $('#show_list_mode').length > 0 ){
                    displayMode = SHOW_LIST_MODE;
                    if( new_size < 28) new_size = 28;
                    $elem.css('height', new_size)
                    if( imgH < 20 ) imgH = 20;
                }else{
                    displayMode = SHOW_THUMBNAIL_MODE;
                    if( new_size < 80) new_size = 80;
                    $elem.css({"height": new_size, "width": new_size})
                    if( imgH < 36 ) imgH = 36;
                }
                $elem.find('img').css({'max-width': imgH, 'max-height': imgH})
            }
            $ui_line.css('width', thisW-2)
            $drag_btn.css('width', thisW)   
            //判断当前列表数据是否填充满页面
            this.isDataFullPage(displayMode)         
        } else{
            log('无法获取必要的节点1')
        }

    }
    isDataFullPage(displayMode) {
        if( !displayMode ){
           if( $('#show_list_mode').length > 0 ){
              displayMode = SHOW_LIST_MODE
           }else{
              displayMode = SHOW_THUMBNAIL_MODE 
           } 
        }
        this.state.timer = setTimeout(() => {
            clearTimeout(this.state.timer)
            const fetchSize = getListOffset(displayMode, document.getElementById('client_height_1'), document.querySelector('.bottom-bar .silder-drag-btn')),
                  fileCommon = this.props.files.common,
                  fileData = this.props.files.filesData,
                  fileAll = this.props.files.allFiles;
            if( fileCommon && fileData && fileAll ){
                if( fetchSize > fileCommon.fetch_size && fileAll.length < fileData.total ){
                    const data = {
                        route: this.props.route
                    }
                    log('缩略图触发重新加载当前路由')
                    this.props.actions.getInItRoute(data);
                }
            }               
        },100)
    }
    selectScanResult() {
        if( this.props.noticeMsg && this.props.noticeMsg.type == 'SCAN' && !this.props.noticeMsg.action ){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在扫描中，请稍候再操作",auto: true,speed: 1500,statu: 0})
            return false;
        }      
        //打开扫描结果模块时把扫描按扭定义成禁用状态。
        const scanBtnDom = document.getElementById('ScanReadButton');
        if( scanBtnDom ){
            scanBtnDom.disabled = true;
            scanBtnDom.classList.add('opacity8')            
        }         
        //打开扫描主窗口,并直接跳转到结果页面。
        this.props.actions.triggerDialogInfo({type: SHOW_LOCAL_FILES_SCAN, position: SHOW_DIALOG_SCAN_RESULT})        
    }
    render() {
        const { route, fileInfoMsg, getConfig } = this.props
        const { scanPath } = this.state
        //获取上次扫描时间
        let lastscantime = null
        if( getConfig && getConfig.data && getConfig.data.scan_docs_last_scan_time ) {
            const scantimeval = getConfig.data.scan_docs_last_scan_time.value
            if( !isEmpty(scantimeval) && scantimeval != 'null' ){
                lastscantime = scantimeval
            }
        }
        return (
          <div className="bottom-bar abs col-6">
              <div className="bottom-content flex flex-c">
                  <div className="bc-item bc-first flex flex-c flex-item-gsb-0">
                      {
                          fileInfoMsg ? 
                              <div className="flex flex-c">
                                  <p className="first-info">
                                  {
                                      !isEmpty(fileInfoMsg.text) ?
                                         <span className="fm-text" dangerouslySetInnerHTML={{__html: fileInfoMsg.text}}></span>
                                      :
                                         null
                                  }
                                  {
                                      !isEmpty(fileInfoMsg.msg) ?
                                         <span className="fm-msg" dangerouslySetInnerHTML={{__html: fileInfoMsg.msg}}></span>
                                      :
                                         null                                          
                                  }
                                  {
                                      !isEmpty(fileInfoMsg.size) ?
                                         <span className="fm-size" dangerouslySetInnerHTML={{__html: formatSize(fileInfoMsg.size)}}></span>
                                      :
                                         null                                          
                                  } 
                                  </p>                                    
                              </div>
                          :
                              null                               
                      }
                  </div>
                  <div className="bc-item bc-second flex flex-c flex-item-gsb-1">
                     {
                          lastscantime && scanPath.statu == 0 ?                           
                              <p className="col-6 msg-first flex-item-gsb-0">
                                 上次扫描结束时间：{lastscantime}
                                 <span className="col-lan hover-line left-m-10" onClick={this.selectScanResult.bind(this)}>查看扫描结果</span>
                              </p>
                          :
                              null
                     } 
                     {
                          lastscantime && scanPath.statu == 0 ?                           
                              <p className="col-6 left-10 msg-last flex-item-gsb-1" style={{"display":"none"}}>下次自动扫描时间：{lastscantime}</p>
                          :
                              null
                     }                                         
                  </div>

                  <div className="bc-item bc-third flex flex-c flex-r-r flex-item-gsb-0">
                     {
                         route && route.menu === LOCAL_FILE_CONTENT ?
                             <div className="slider-content flex flex-c">
                                 <span className="bc-title flex-item-gsb-0">缩略图</span>
                                 <p className="bc-slider flex flex-c flex-item-gsb-1">
                                     <i className="flex-item-gsb-0 icons-local-material icons-20 size-less-bg most-left-less"
                                        onClick={this.sizeScaleBtn.bind(this, 'LESS')}>
                                     </i>
                                     <span className="bc-slider-ui flex-item-gsb-0" ref="bcSilderRef">
                                         <span ref="dragPanelRef" className="silder-drag-btn abs">
                                            <i className="abs icons-local-material icons-20 size-silder-bg" ref="dragDivRef"></i>
                                         </span>
                                         <span className="ui-line flex flex-c flex-l-l"></span>
                                     </span>
                                     <i className="flex-item-gsb-0 icons-local-material icons-20 size-plus-bg"
                                        onClick={this.sizeScaleBtn.bind(this, 'PLUS')}>
                                     </i>
                                 </p>
                             </div>
                         :
                             null    
                     }
                     <p className="bc-se-resize flex-item-gsb-0"></p>
                  </div>

              </div>
          </div>
        )
    } 
    componentWillReceiveProps(nextProps){
        log('BottomBar============>componentWillReceiveProps')
        log(nextProps,this.props)             
    }
    shouldComponentUpdate(nextProps, nextState) {
        //判断数据是否变化       
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
              Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
              return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
              return true;
            }
        }
        log('shouldComponentUpdate---（BottomBar）优化起作用---')
        return false
    }      
    componentDidUpdate(nextProps) {
        log('BottomBar=========>componentDidUpdate')
        if( this.props.route && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
            if( this.props.route.menu === LOCAL_FILE_CONTENT ){ 
                //横向拖拽
                const dragElem = this.refs.dragDivRef,
                      parElem = this.refs.dragPanelRef;
                if( dragElem && parElem ){
                    //16px为临界点
                    log('初始化缩略图拖拽功能')
                    dragSilderDrop(this, dragElem, parElem, 0, 'right', this.refs.bcSilderRef, getIntervalValue.thumbnail)
                }
            }
        }
    }     
}
const mapStateToProps = (state) => {
    return {   
        route: state.inIt.route,
        subRoute: state.inIt.subRoute,
        routeLastUpdated: state.inIt.routeLastUpdated,

        files: state.files,

        fileInfoMsg: state.msg.fileInfoMsg,

        noticeMsg: state.msg.noticeMsg,
        noticeMsgLastUpdated: state.msg.noticeMsgLastUpdated            
    }
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(BottomBar))
