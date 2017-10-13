import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { beginGuideHtml } from '../../constants/RenderHtmlConstant'
import { getFileInitObjectData } from '../../constants/ConfigInfo'
import { log, isEmpty, getDriveOrPath, addClass, removeClass, objClone } from '../../constants/UtilConstant'
import { SHOW_LOCAL_FOLDER_SCAN_SET, SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, NOT_LOGIN_UNACTIVE, 
         SHOW_FOLDER_SETTINGS, SCAN_STOP_ACTIVE, LOOP_SCAN_ACTIVE, SHOW_LOCAL_FILES_SCAN } from '../../constants/TodoFilters'
import { RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST, RECEIVE_ASYNC_ADD_SCAN_DOCS_PATH_REQUEST } from '../../constants/ActionsTypes'

class SidebarTop extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
           scanStatu: -1, //-1初始化中，0静止状态，1扫描状态，2暂停状态，3扫描结束状态
           scanMsg: '',
           beginguide: 0,
           isinIt: false
        };
        this.beginGuideNext = this.beginGuideNext.bind(this)
        this.beginGuideOne = this.beginGuideOne.bind(this)
        this.beginGuideClose = this.beginGuideClose.bind(this)
      	log("SidebarTop");		
  	}	
    stateScanStatu(statu, isinit) {
        this.setState({
            scanStatu: statu,
            isinIt: isinit
        })
    }
    loginPoint() {
        if( !this.props.login.loginUserData || !this.props.login.loginUserData.id ){
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_CONFIRM,
                title: '提示',
                text: '暂不支持扫描功能，请登录后设置',
                code: NOT_LOGIN_UNACTIVE,
                model: 'GO_LOGIN'
            })          
            return false
        } 
        return true     
    }	
    scanStartBtn(event){
        //开始初始化扫描
        if( !this.loginPoint() ){
            return false
        }
        if( this.props.noticeMsg && !this.props.noticeMsg.action ){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在扫描中，请稍候再操作",auto: true,speed: 1500,statu: 0})
            return false;
        }
        if( event ){
            event.stopPropagation();
            event.preventDefault();
            if( event.currentTarget ){
                event.currentTarget.disabled = true
                addClass(event.currentTarget, 'opacity8')                
            }
        }                 
        
        //获取外层盘符目录
        const startDom = $('#FirstItemP').closest('li').children('div.submenu'), 
              p_elems = startDom.children('ul').children('li').children('.item-p'),
              scanPathArray = [];         
        //更新子目录被移除扫描目录时弹窗提示
        //为符合要求的子目录添加class--hasScanPath
        const nextAddTipFn = elem => {
            if( elem.hasClass('checked') ){
                elem.addClass('hasScanPath');
                const nextElem = elem.siblings('div.submenu').children('ul').children('li').children('.item-p');
                if( nextElem.length > 0 ){
                    //自己递归检索
                    nextAddTipFn(nextElem)
                }                
            }
        }        
        //获取需要扫描的路径      
        const nextAddScanFn = elem => { 
            if( elem.hasClass('checked') ){
                const scanPath = elem.data('path');
                if( !isEmpty(scanPath) ){ 
                    scanPathArray.push(scanPath);
                }
                nextAddTipFn(elem)   
            }else{
                const nextElem = elem.siblings('div.submenu').children('ul').children('li').children('.item-p');
                if( nextElem.length > 0 ){
                    //开始递归检测
                    getCheckedFn(nextElem)
                }
            }
        }  
        //循环elems检索
        const getCheckedFn = elems => {
            elems.each((index, elem) => {
                nextAddScanFn($(elem))                    
            })
        }
        //开始checked检索
        getCheckedFn(p_elems);

        //获取所有需要扫描的路径。让noticeMessage发送出去，在盘符首页接收到，然后盘符图标变成动态图标
        //可以不必做去重处理
        const allPathArr = [];
        allPathArr.push(...scanPathArray);
        allPathArr.push(...this.getConfigPathArr());
        const allMobileArr = this.props.files.mobileDrive && this.props.files.mobileDrive.data; 
        const allData = {
            allScanPathData: allPathArr,
            allMobileDriveData: allMobileArr
        }
        if( scanPathArray.length > 0 ){
            //如树形目录看得到有选择的，则提交选择的路径
            this.startUpScan(scanPathArray, allData)
        }else{
            //如树形目录看不到已选择的扫描路径，则调用扫描设置里的路径
            this.startUpScan(this.getConfigPathArr(), allData)
        }
    }
    getConfigPathArr() {
        //获取配置信息里的扫描目录
        let configPathArray = [],
            pathArray = [],
            getConfig = this.props.getConfig,
            files = this.props.files;
        if( getConfig && getConfig.data ){
            const allDrive = [...files.driveLetter.data, ...files.mobileDrive.data]
            configPathArray = getDriveOrPath(getConfig.data.scan_docs_always_path, allDrive)
        }    
        if( configPathArray.length > 0 ){ 
            pathArray = configPathArray.map((item) => item.path)
            //this.startUpScan(pathArray) 
        }else{        
            //this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请先选择要扫描的文件夹",auto: true,speed: 1500,statu: 0})
            //return;
        }
        return pathArray
    }	
    startUpScan(scanPathArray, allData) {    
        const data = {add: scanPathArray}
        //const data = {add: scanPathArray, elem: eventTarget}
        //执行常规扫描
        this.props.actions.triggerDialogInfo({type: SHOW_LOCAL_FILES_SCAN, codeData: data, allData: allData})
        //this.props.actionsLF.asyncSetScanDocsPathRequest(data);
        //获取当前扫描路径
        // setTimeout(() => {
        //     this.props.actionsLF.asyncgetScanDocsRequest();
        // },50) 
        //this.stateScanStatu(1,'扫描中...',data);        
    }  
    showDialog(event){
        if( event ){
            event.stopPropagation();
            event.preventDefault();
        }
        if( !this.loginPoint() ){
            return false
        } 
        if( this.props.noticeMsg && !this.props.noticeMsg.action ){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在扫描中，请稍候再操作",auto: true,speed: 1500,statu: 0})
            return false;
        }      
        //打开扫描设置       
        this.props.actions.triggerDialogInfo({type: SHOW_LOCAL_FOLDER_SCAN_SET, filter: SHOW_FOLDER_SETTINGS})      
    }
    beginGuideClose() {
        const bodyDom = document.getElementById('body-opacity-layer') 
        if( bodyDom ){          
           bodyDom.style.cssText = "display:none;background:#000;opacity:.1";
        }  
        this.setState({beginguide: 0})        
    }
    beginGuideNext() {
        //第三步
        this.setState({beginguide: 3})
    } 
    beginGuideOne() {
        //调用C++接口
        //修改配置文件--更改面板设置
        let val = ""+ 1 +"";
        const data = [{key:"user_guide", value: val}]
        setTimeout(() => {
            this.props.actions.setConfigRequest(data,'INIT_SET_CONFIG_DEFAULT')
        },10)
        this.setState({beginguide: 0})//归0
        const bodyDom = document.getElementById('body-opacity-layer') 
        if( bodyDom ){          
            bodyDom.style.cssText = "display:none;background:#000;opacity:.1";
        }        
    }   
    render() {
        const { login } = this.props
        const { scanStatu, beginguide } = this.state
        return (
    	      <div className="sidebar-top flex flex-c flex-item-gsb-0">
                <div className="scan-content flex flex-c">
                    {
                        scanStatu == -1 ?
                            <button className="button scan-btn1 flex flex-c flex-c-c disabled-button">
                               <span className="btn-text flex flex-c flex-c-c">初始化中</span>
                            </button>
                        :                                
                        scanStatu == 0 ?
                            <div className="scan-ready flex flex-c">
                                <button id="ScanReadButton"
                                   className={!login.loginUserData || !login.loginUserData.id ? "button scan-btn1 disabled-button" : "button scan-btn1"} 
                                   onClick={this.scanStartBtn.bind(this)}>
                                   开始扫描
                                </button>
                                {
                                    beginguide == 2 ?
                                        beginGuideHtml(2,this.props.bgImg,this.props.bgText,this.beginGuideNext,
                                                      this.beginGuideOne,this.beginGuideClose)
                                    :
                                        null
                                }
                            </div>
                        :    
                            null       
                    }
                </div>
                <div className="set-content icons-20 flex flex-l flex-item-gsb-0">                   
                    <i className="icons-local-material icons-20 set-btn-bg" onClick={this.showDialog.bind(this)}></i>
                    {
                        beginguide == 3 ?
                            beginGuideHtml(3,this.props.bgImg2,this.props.bgText2,this.beginGuideClose,
                                          this.beginGuideOne,this.beginGuideClose)
                        :
                            null
                    }                    
                </div>
    	      </div>
        )
    }
    requestNewData() {
        const data = objClone(getFileInitObjectData);
        data.mode = 1;
        data.is_refresh = true;
        log('初始化后重新请求列表数据--获取扫描个数和扫描状态')
        this.props.actionsLF.asyncgetFileRequest(data)                
    }    
    componentDidMount() { 
        //初始化扫描
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanDocsInitRequest', '');    
    }
    componentWillReceiveProps(nextProps){
        //新手引导语
        if( nextProps.defaultMsg && nextProps.defaultMsgLastUpdated !== this.props.defaultMsgLastUpdated ) {
            if( nextProps.defaultMsg.beginguide == 2 ) {
                //新手引导第二步
                this.setState({beginguide: 2})
            }
        }
        //jsMsgHandle c++ ==> js 接口
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            if( nextProps.jsMsgHandle.module === 'scan_init_status_t' ){
                //1、初始化结束--修改--5月9号
                if( nextProps.jsMsgHandle.param && nextProps.jsMsgHandle.param.data && nextProps.jsMsgHandle.param.data.init ){
                    log('scan_init_status_t--初始化结束成功')
                    //判断上一次接收到的是不是init=true
                    if( this.state.isinIt ) return;                   
                    this.stateScanStatu(0,true)
                    //再次请求一下列表数据接口，获取扫描个数和扫描状态
                    this.requestNewData()
                    //定期扫描触发方法---调用
                    setTimeout(() => {this.props.actionsLF.asyncSetScanDocsLoopScanRequest()},50)
                    //初始化结束后调用站内消息(鉴黄)--5-17--目前不启用
                    // const loginData = nextProps.login.loginUserData
                    // if( loginData && loginData.id ){
                    //     //调用服务端消息通知
                    //     const data = {
                    //         userId: loginData.id,
                    //         type: 6,
                    //         dealState: '0'
                    //     }              
                    //     this.props.actionsLog.getNoDealMessageList(data)
                    //     //软件设置改版弹出层
                    //     //this.props.actions.triggerDialogInfo({type: 'show_dialog_setup'}) 
                    // }                                          
                }else{
                    //扫描按扭重新初始化
                    this.stateScanStatu(-1,false)
                    //初始化扫描
                    this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanDocsInitRequest', '');                    
                } 
            }
        }      
        //定期扫描触发方法
        if( nextProps.loopScan && nextProps.loopScanLastUpdated !== this.props.loopScanLastUpdated ){
            const loopCode = nextProps.loopScan.error_code
            if( loopCode == 0 ){
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: '扫描',
                    text: '即将执行定期扫描',
                    code: LOOP_SCAN_ACTIVE,
                    auto: true,
                    timeText: '秒后自动开始',
                    speed: 10,
                    _this: this
                })                
            }
        }                 
    }
    shouldComponentUpdate(nextProps, nextState) {            
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }	  
}
SidebarTop.defaultProps = {
    bgImg: 'compress/img/cable2.png',
    bgText: '点击开始扫描按钮，开始扫描文件。扫描是为了从素材文件中导出预览图，实现在您电脑上就能以图识图。',
    bgImg2: 'compress/img/cable2.png',
    bgText2: '点击设置，可以设置扫描区域、扫描文件类型',    
    scanStatu: {
        FINISH: 'scan_finish',
        STOP: 'scan_stop'
    }
}
const mapStateToProps = (state) => {
    return {      
      loopScan: state.events.loopScan,
      loopScanLastUpdated: state.events.loopScanLastUpdated,

      defaultMsg: state.msg.defaultMsg,
      defaultMsgLastUpdated: state.msg.defaultMsgLastUpdated            
    }
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(SidebarTop))