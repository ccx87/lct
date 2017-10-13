import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { log, isEmpty, getmCustomScrollbar4 } from '../../../constants/UtilConstant'
import { SCAN_FILE_TYPE } from '../../../constants/DataConstant'
import { absVerticalCenter2 } from '../../../constants/DomConstant'
import { msgAlertSuccessHtml } from '../../../constants/RenderHtmlConstant'
import { GENERAL_SET, DOWNLOAD_SET, FILESTYPE_SET, SCANTIME_SET, SHOW_DIALOG_ALERT, 
  SHOW_DIALOG_CONFIRM, SHOW_DIALOG_MOVE_PREVIEW_FILES } from '../../../constants/TodoFilters'

import StaticTitleBar from '../../../modules/StaticTitleBar'

class SetCommon extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            sendPath: null,
            alert: {
              show: false,
              text: ''
            },
            nextScamTime: null           
        };
        this.movePreview = postData => {
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_MOVE_PREVIEW_FILES})
            setTimeout(() => {
                this.props.actions.sendHandleMessage('SettingMsgProcess', 'changePreviewPath', postData)
            },10) 
        }
      	log("SetOther");		
  	}	
    setAlert(show, text) {
        this.setState({
            alert: {
                show: show,
                text: text
            }
        })        
    }
    updataPathBtn(key, value, event){
        this.state.sendPath = {key: key, value: value};
        this.props.actions.openFileRequest(3, value)
    }
    renderSetDownload(_props, item) {
        let fontDownloadPath = '',
            previewCachePath = ''; 
        if( _props.getConfig && _props.getConfig.data ){
            if( _props.getConfig.data.download_path ){
                fontDownloadPath = _props.getConfig.data.download_path.value;
            }
            if( _props.getConfig.data.thumb_base_path ){
                previewCachePath = _props.getConfig.data.thumb_base_path.value
            }
        }
        return <div className="sc-download">
                    <div className="main_container bottom-line">
                        <p className="item-title">路径设置</p>
                        <div className="item-other">
                            <div className="io-item font-size-14">
                                <p>
                                   <span className="col-3">字体下载目录：</span>
                                   <span className="col-hui">默认将下载到该文件夹目录下</span>
                                </p>
                                <p>
                                   <span className="path-text" id="font_download_path">{fontDownloadPath ? fontDownloadPath : "--"}</span>
                                   <a href="javascript:;" className="abtn" onClick={this.updataPathBtn.bind(this, 'download_path', fontDownloadPath)}>更改目录</a> 
                                </p>
                            </div>
                            <div className="io-item font-size-14">
                                <p>
                                   <span className="col-3">预览图缓存目录：</span>
                                   <span className="col-hui">默认将预览图缓存到该文件夹目录下</span>
                                </p>
                                <p>
                                   <span className="path-text" id="preview_cache_path">{previewCachePath ? previewCachePath : "--"}</span>
                                   <a href="javascript:;" className="abtn" onClick={this.updataPathBtn.bind(this, 'thumb_base_path', previewCachePath)}>更改目录</a> 
                                </p>
                            </div>                            
                        </div>
                    </div>
               </div>
    }
    renderSetGeneral(_props, item){
        let isCheck = 0,
            bit = 0;
        if( this.props.getConfig && this.props.getConfig.data && this.props.getConfig.data.ExitType ){
            if( this.props.getConfig.data.ExitType.value == "" ){
                isCheck = 0;
                bit = 0;  
            }else{
                isCheck = parseInt(this.props.getConfig.data.ExitType.value) & 0x01;
                bit = parseInt(this.props.getConfig.data.ExitType.value) & 0x02; 
            }
        }
        return <div className="sc-general">
                    <div className="main_container bottom-line">
                        <p className="item-title">常规设置</p>
                        <div className="item-other">
                            <div className="io-item clearfix">
                                 <div className="col-3 font-size-14 g-l">关闭面板：</div>
                                 <div className="col-6 g-l">
                                     <p className="p-1">
                                        <lable htmlFor="setPanel1" className="flex flex-c">
                                          {
                                              isCheck == 0 ? 
                                                 <i className="icons-14 outer-circle flex flex-c flex-c-c active" onClick={this.panelSet.bind(this, bit, 2)}>
                                                    <em className="icons-6 inner-circle"></em>
                                                 </i>
                                              :
                                                 <i className="icons-14 outer-circle flex flex-c flex-c-c" onClick={this.panelSet.bind(this, bit, 2)}>
                                                    <em className="icons-6 inner-circle"></em>
                                                 </i>         
                                          }
                                          <span className="sp-text" id="setPanel1">最小化到系统</span> 
                                        </lable>
                                     </p>
                                     <p className="p-1">
                                        <lable htmlFor="setPanel2" className="flex flex-c">
                                          {
                                              isCheck == 1 ? 
                                                 <i className="icons-14 outer-circle flex flex-c flex-c-c active" onClick={this.panelSet.bind(this, bit, 3)}>
                                                    <em className="icons-6 inner-circle"></em>
                                                 </i>                                                 
                                              :
                                                 <i className="icons-14 outer-circle flex flex-c flex-c-c" onClick={this.panelSet.bind(this, bit, 3)}>
                                                    <em className="icons-6 inner-circle"></em>
                                                 </i>    
                                          }
                                          <span className="sp-text" id="setPanel2">直接退出</span> 
                                        </lable>
                                     </p>                                     
                                 </div>
                            </div>
                        </div>
                    </div>
               </div>
    }
    panelSet(bit, type){
        //修改配置文件--更改面板设置
        let val = type;
        val = ""+ val +"";
        const data = [{key:"ExitType", value: val}]
        this.props.actions.setConfigRequest(data, 'UPDATE_PATH_SHOW_TIP'); 
    }
    selectTimeList(event) {
        event.stopPropagation();
        event.preventDefault();      
        const target = event && event.currentTarget,
              listDom = target && target.querySelector('.sub-time');
        if( listDom ){
            if( listDom.classList.contains('show') ){
                listDom.classList.remove('show')
            }else{
                listDom.classList.add('show')              
            }
        }
    }
    selectTimePost(time, text, event) {
        event.stopPropagation();
        event.preventDefault();
        const target = event.currentTarget,
              parDom = target && target.parentNode.parentNode,
              txtDom = parDom && parDom.querySelector('.text-con');
        if( txtDom ){      
            txtDom.innerHTML = text;
            target.parentNode.classList.remove('show');
            const data = [{key:"scan_docs_frequence", value: ""+ time +""}]
            this.props.actions.setConfigRequest(data, 'UPDATE_FREQUENCE_SHOW_TIP');             
        }           
    }
    setAutoTime(event) {
        event.stopPropagation();
        event.preventDefault();
        const target = event.currentTarget,
              switchText = target && target.querySelector('.rs-text'),
              switchDom = target && target.parentNode.parentNode.querySelector('.rs-item');
        if( target ){
            let switchVal = 0;
            if( target.classList.contains('open') ){
                target.classList.remove('open')
                target.classList.add('close')
                if( switchDom && switchText ){
                    switchDom.classList.remove('show')
                    switchText.innerText = '关'
                }
            }else{
                target.classList.remove('close')
                target.classList.add('open')
                switchDom.classList.add('show')
                if( switchDom && switchText ){
                    switchText.innerText = '开'
                    switchVal = 1
                }
            }
            const data = [{key:"auto_scan_switch", value: ""+ switchVal +""}]
            this.props.actions.setConfigRequest(data, 'UPDATE_FREQUENCE_SHOW_TIP');             
        }        
    }
    renderScanTime() {
        const getConfig = this.props.getConfig,
              data = getConfig && getConfig.data;
        let autoTime = 0,
            autoSwitch = true;      
        if( data ){
            if( data.auto_scan_switch && data.auto_scan_switch.value == 1 ){
                if( data.scan_docs_frequence ){
                    autoTime = isEmpty(data.scan_docs_frequence.value) ? 0 : data.scan_docs_frequence.value/3600; 
                    if( autoTime < 1 ){
                        autoTime = parseFloat(autoTime).toFixed(2)
                    }
                }  
            }else{
                autoSwitch = false;
            }
        }     
        return  <div className="sc-scan-time">
                    <div className="main_container bottom-line">
                        <p className="item-title">自动扫描设置</p>
                        <div className="item-other">
                            <div className="io-item font-size-14">
                                <div className="con-line flex flex-c">
                                    <span className="col-6" style={{"marginRight": "15px"}}>自动扫描开关</span>
                                    <span className={autoSwitch ? "r-switch open" : "r-switch close"} onClick={this.setAutoTime.bind(this)}>
                                       <span className="rs-text">开</span>
                                       <i className="rs-btn"></i>
                                    </span>
                                </div>
                                <div className={autoSwitch ? "rs-item show" : "rs-item"} style={{"display": "none"}}>                            
                                    <div className="con-line flex flex-c">
                                       <div className="col-6">自动扫描周期</div>
                                       <div className="sel-time" onClick={this.selectTimeList.bind(this)}>
                                           <a className="text-con">
                                               {autoTime} 小时
                                           </a>
                                           <i className="icons icons-18 drop-down-bg abs"></i>
                                           <ul className="sub-time">
                                               <li onClick={this.selectTimePost.bind(this, 1800, '0.5小时')}>0.5小时</li>
                                               <li onClick={this.selectTimePost.bind(this, 3600, '1小时')}>1小时</li>
                                               <li onClick={this.selectTimePost.bind(this, 18000, '5小时')}>5小时</li>
                                               <li onClick={this.selectTimePost.bind(this, 86400, '24小时')}>24小时</li>
                                           </ul>
                                       </div>
                                    </div>
                                    <div className="con-line flex">
                                       <div className="col-6">下次扫描时间</div>
                                       <div className="show-time col-lan">{this.state.nextScamTime ? this.state.nextScamTime : "0000-00-00 00:00"}</div>
                                    </div> 
                                </div>                                                                                               
                            </div>
                        </div>
                    </div>
                </div>        
    }
    updateScanFileType(text, event){
        event.stopPropagation();
        event.preventDefault();      
        const target = event.currentTarget;
        if( target ){
            if( target.classList.contains('active') ){
                target.classList.remove('active')
            }else{
                target.classList.add('active')
            }  
        }
        const list = document.querySelectorAll('.sc-files-type .type-list > li');
        const textArray = [];
        for( let i = 0, lens = list.length; i < lens; i++ ){
            if( list[i] && list[i].classList.contains('active') ){
                textArray.push(list[i].innerText)
                continue;
            }
        }      
        log(textArray) 
        setTimeout(() => {
            this.props.actions.setScanDocsFilterRequest(textArray, target)
        },10)
    }
    updateScanFileTypeAll(temp, event) {
        event.stopPropagation();
        event.preventDefault();
        const list = document.querySelectorAll('.sc-files-type .type-list > li');
        const textArray = [];
        for( let i = 0, lens = list.length; i < lens; i++ ){
            if( temp ){
                if( list[i] ){
                    textArray.push(list[i].innerText)
                    if( list[i].classList.contains('active') ){
                        continue;
                    }else{
                        list[i].classList.add('active')
                    }
                }
            }else{
                if( list[i] ){
                    if( !list[i].classList.contains('active') ){
                        continue;
                    }else{
                        list[i].classList.remove('active')
                    }
                }             
            }
        }
        log(textArray)
        if( temp ){
            setTimeout(() => {
                this.props.actions.setScanDocsFilterRequest(textArray)
            },10)      
        }else{
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请至少选择一种文件格式",auto: true,speed: 3000})
        }  
    }
    renderFilesType() {
        const getConfig = this.props.getConfig;
        let scanFilterArray = [];
        if( getConfig && getConfig.data ){
            try{
                const filterObj = getConfig.data.scan_docs_type_filter;
                if( !isEmpty(filterObj.value) ){
                    scanFilterArray = filterObj.value.toLowerCase().split(';');  
                }            
            }catch(e){}
        }         
        return  <div className="sc-files-type">
                    <div className="main_container">
                        <p className="item-title">扫描文件格式设置</p>
                        <div className="item-other">
                            <div className="io-top flex flex-c">
                                <button className="default-button all-btn" onClick={this.updateScanFileTypeAll.bind(this,1)}>全选</button>
                                <button className="default-button all-btn" onClick={this.updateScanFileTypeAll.bind(this,0)}>全不选</button>
                                <span>单击下方色块选中或取消</span>
                            </div>
                            <div className="io-content flex">
                                <div className="io-item">
                                    {
                                        SCAN_FILE_TYPE.slice(0, 4).map((item, index) => {
                                            return  <div key={index} className="zm-order flex flex-l">
                                                        <div className="zm-first flex flex-c">{item.text}</div>
                                                        <ul className="type-list flex flex-c flex-wrap">
                                                           {
                                                               item.data.map((it, inx) => {
                                                                   const itval = it.toLowerCase(),
                                                                         hasIndex = scanFilterArray.indexOf(itval);
                                                                   let classes = "flex flex-c flex-c-c";
                                                                   if( hasIndex > -1 ) 
                                                                      classes += " active"; 
                                                                   return  <li key={inx} className={classes} onClick={this.updateScanFileType.bind(this, it)}>{it}</li> 
                                                               })
                                                           }
                                                        </ul>
                                                    </div>
                                        })
                                    }                                                                                                                                       
                                </div>
                                <div className="io-item">
                                    {
                                        SCAN_FILE_TYPE.slice(4, 9).map((item, index) => {
                                            return  <div key={index} className="zm-order flex flex-l">
                                                        <div className="zm-first flex flex-c">{item.text}</div>
                                                        <ul className="type-list flex flex-c flex-wrap">
                                                           {
                                                               item.data.map((it, inx) => {
                                                                   const itval = it.toLowerCase(),
                                                                         hasIndex = scanFilterArray.indexOf(itval);
                                                                   let classes = "flex flex-c flex-c-c";
                                                                   if( hasIndex > -1 ) 
                                                                      classes += " active"; 
                                                                   return  <li key={inx} className={classes} onClick={this.updateScanFileType.bind(this, it)}>{it}</li> 
                                                               })
                                                           }
                                                        </ul>
                                                    </div>
                                        })                                        
                                    }                                                                                                          
                                </div>
                                <div className="io-item">
                                    {
                                        SCAN_FILE_TYPE.slice(9, 12).map((item, index) => {
                                            return  <div key={index} className="zm-order flex flex-l">
                                                        <div className="zm-first flex flex-c">{item.text}</div>
                                                        <ul className="type-list flex flex-c flex-wrap">
                                                           {
                                                               item.data.map((it, inx) => {
                                                                   const itval = it.toLowerCase(),
                                                                         hasIndex = scanFilterArray.indexOf(itval);
                                                                   let classes = "flex flex-c flex-c-c";
                                                                   if( hasIndex > -1 ) 
                                                                      classes += " active"; 
                                                                   return  <li key={inx} className={classes} onClick={this.updateScanFileType.bind(this, it)}>{it}</li> 
                                                               })
                                                           }
                                                        </ul>
                                                    </div>
                                        })                                        
                                    }                                                                                                                                                                                                                         
                                </div>
                                <div className="io-item">
                                    {
                                        SCAN_FILE_TYPE.slice(12, 13).map((item, index) => {
                                            return  <div key={index} className="zm-order flex flex-l">
                                                        <div className="zm-first flex flex-c">{item.text}</div>
                                                        <ul className="type-list flex flex-c flex-wrap">
                                                           {
                                                               item.data.map((it, inx) => {
                                                                   const itval = it.toLowerCase(),
                                                                         hasIndex = scanFilterArray.indexOf(itval);
                                                                   let classes = "flex flex-c flex-c-c";
                                                                   if( hasIndex > -1 ) 
                                                                      classes += " active"; 
                                                                   return  <li key={inx} className={classes} onClick={this.updateScanFileType.bind(this, it)}>{it}</li> 
                                                               })
                                                           }
                                                        </ul>
                                                    </div>
                                        })                                        
                                    }                                                                     
                                </div>
                                <div className="io-item">
                                    {
                                        SCAN_FILE_TYPE.slice(13, 18).map((item, index) => {
                                            return  <div key={index} className="zm-order flex flex-l">
                                                        <div className="zm-first flex flex-c">{item.text}</div>
                                                        <ul className="type-list flex flex-c flex-wrap">
                                                           {
                                                               item.data.map((it, inx) => {
                                                                   const itval = it.toLowerCase(),
                                                                         hasIndex = scanFilterArray.indexOf(itval);
                                                                   let classes = "flex flex-c flex-c-c";
                                                                   if( hasIndex > -1 ) 
                                                                      classes += " active"; 
                                                                   return  <li key={inx} className={classes} onClick={this.updateScanFileType.bind(this, it)}>{it}</li> 
                                                               })
                                                           }
                                                        </ul>
                                                    </div>
                                        })                                        
                                    }                                                                                                             
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>      
    }
    render() {
        const { route, subRoute, resize } = this.props
        const { alert } = this.state
        return (
          <div className="set-common">
              <StaticTitleBar fontSize={16} text='设置' backBtn={false}/>
              <div className="scroll-common" style={resize ? {"height": (resize.h-50)+"px"} : null}>
                {
                    subRoute && subRoute.length > 0 ?
                        subRoute.map((item, index) => {
                          return  <div key={index} className="common-list">
                                    {
                                      item.name === GENERAL_SET ?
                                          this.renderSetGeneral(this.props, item)
                                      :
                                      item.name === DOWNLOAD_SET ?
                                          this.renderSetDownload(this.props, item)
                                      :
                                      item.name === SCANTIME_SET ?
                                          this.renderScanTime(this.props, item)
                                      :    
                                      item.name === FILESTYPE_SET ?
                                          this.renderFilesType(this.props, item)
                                      :    
                                         null
                                    }
                                  </div>
                        })
                    :
                        null    
                }
               {
                    alert.show ?
                        msgAlertSuccessHtml(alert.text, 'false')
                    :
                        null    
               }  
             </div>             
          </div>
        )
    } 
    getInitAutotimeData() {
        //获取下次自动扫描的时间
        this.props.actions.sendHandleMessage('ScanMsgProcess','getAutoScanTime','');
    }    
    componentDidMount() {
        getmCustomScrollbar4($('.scroll-common'));
        this.getInitAutotimeData();
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            switch(nextProps.getConfig.types){
                case 'UPDATE_PATH_SHOW_TIP':
                    this.setAlert(false, '')
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设置已更新",auto: true,speed: 3000})
                break;
                case 'UPDATE_PATH_ERROR':
                    this.setAlert(false, '')
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "修改路径失败",auto: true,speed: 3000})
                break;
                case 'UPDATE_FREQUENCE_SHOW_TIP':
                    this.getInitAutotimeData();
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设置已更新",auto: true,speed: 3000})
                break;
            }
        }
        if( nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){
            if( nextProps.openFilePath_3.data && this.state.sendPath ){
                if( nextProps.openFilePath_3.data === this.state.sendPath.value )
                    return this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "目录未发生改变",auto: true,speed: 3000});              
                switch(this.state.sendPath.key){
                    case 'download_path':
                        this.state.sendPath.value = nextProps.openFilePath_3.data;
                        this.props.actions.setConfigRequest([this.state.sendPath], 'UPDATE_PATH_SHOW_TIP'); 
                    break;
                    case 'thumb_base_path': 
                        const postData = {"thumb_base_path": nextProps.openFilePath_3.data}                   
                        this.props.actions.triggerDialogInfo({
                            type: SHOW_DIALOG_CONFIRM,
                            title: '系统提示',
                            text: '预览图文件将移动至新路径“'+ nextProps.openFilePath_3.data +'”。这可能需要一段时间，请勿关闭软件或执行其他操作',
                            confirmBtnText: '移动',
                            cancelBtnText: '取消',
                            confirmFn: this.movePreview.bind(this, postData)
                        });                         
                    break;
                    default:
                    break;
                }
            }            
        }
        //js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
                log('---返回数据为空---')
                return;
            } 
            const jsVal = jsData.data;          
            try{
                switch( jsModule ){
                    case 'cancel_preview_move_rsp_t':
                        if( jsData.error_code != 0 ){
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000})
                            return
                        }
                        if( jsVal && jsVal.is_complete ){
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消成功",auto: true,speed: 3000})
                            this.props.actions.getConfigInfo();
                        }else{
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000})
                        }
                    break;
                    case 'preview_path_move_noexit_t':
                        const errorText = jsData.error ? jsData.error : '正在移动预览图，请勿退出系统(代码：'+ jsData.error_code +')'
                        this.setAlert(true, errorText)
                        setTimeout(() => {
                            this.setAlert(false, '')                          
                        }, 5000)
                    break;
                    case 'auto_scan_time_t':
                        //获取下次自动扫描时间
                        this._auto_scan_time_t(jsVal);
                    break;                                        
                    default:
                    break;
                }
            }catch(e){}
        } 
        //扫描文件格式修改
        if( nextProps.setScanFilter && nextProps.setScanFilterLastUpdated !== this.props.setScanFilterLastUpdated ){
            if( nextProps.setScanFilter.error_code == 0 ){
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设置已更新",auto: true,speed: 3000})
            }else{
                const target = nextProps.setScanFilter.target;
                if( target ){
                    if( target.classList.contains('active') ){
                        target.classList.remove('active')
                    }else{
                        target.classList.add('active')
                    }  
                }          
                const err = isEmpty(nextProps.setScanFilter.error) ? "设置更新失败" : nextProps.setScanFilter.error;     
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: err,auto: true,speed: 3000})
            }
        }                                 
    }  
    _auto_scan_time_t(jsVal) {
        //下次自动扫描时间
        if( jsVal.next_scan_time ) {
            this.setState({
                nextScamTime: jsVal.next_scan_time
            })
        }
    }    
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated && 
            (nextProps.jsMsgHandle.module === 'get_preview_move_progress_t' || 
            nextProps.jsMsgHandle.module === 'preview_path_move_rsp_t') ){
            return false
        }
        return true
    }
    componentDidUpdate(nextProps, nextState) {
        const alertDom = document.querySelector('.alert-dialog-layer');
        if( alertDom ){
            absVerticalCenter2(alertDom)
        }
    }    
}
const mapStateToProps = (state) => {
  return {
      openFilePath_3: state.events.openFilePath_3,
      openFile3LastUpdate: state.events.openFile3LastUpdate,

      setScanFilter: state.events.setScanFilter, 
      setScanFilterLastUpdated: state.events.setScanFilterLastUpdated,       

      jsMsgHandle: state.inIt.jsMsgHandle,
      jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated           
  }
}
export default connect(
  mapStateToProps
)(SetCommon)
