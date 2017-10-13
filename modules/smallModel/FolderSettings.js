import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { GET_DRIVE_STATE, GET_REGEX_MATCH } from '../../constants/DataConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'
import { msgConfirmHtml, msgAlertSuccessHtml, beginGuideHtml } from '../../constants/RenderHtmlConstant'
import { showOrHideItem, clientHeight, absVerticalCenter2 } from '../../constants/DomConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM } from '../../constants/TodoFilters'
import { log, isEmpty, hasClass, addClass, removeClass, getSystemDriveState, getmCustomScrollbar, regexStr, getDriveOrPath } from '../../constants/UtilConstant'

let scanType = 1;
class FolderSettings extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            confirm: {
                show: false,
                data: null
            }, 
            scanPathDel: false,
            setting: {
                show: false,
                text: ''
            },
            beginguide: 0,
            isoper: false
        };
        this.beginGuideTwo = this.beginGuideTwo.bind(this)
        this.beginGuideClose = this.beginGuideClose.bind(this)
      	log("FolderSettings");		
  	}	
    stateSetting(show, text) {
        this.setState({setting: {show: show,text: text}})
        setTimeout(() => {
            this.setState({setting: {show: false,text: ''}})                  
        },1500)        
    }
    changeSacnMethod(event) {
        event.stopPropagation();
        event.preventDefault();
        const this_Elem = event.currentTarget,
              $par_Elem = $(this_Elem).closest('.item-constent'),
              $active_Elem = $par_Elem.find('.outer-circle');
        $active_Elem.removeClass('active')           
        addClass(this_Elem, 'active')
        this.setState({isoper:true})       
    } 
    openFileLocation(path, event) {
        event.stopPropagation()
        event.preventDefault()
        log(path)
        if( isEmpty(path) ){
            this.stateSetting(true, '文件路径不存在或已移除')
            return false;
        }
        try{
            window.openFileRequest(1, path)
        }catch(e){
            this.stateSetting(true, '文件路径不存在或已移除')
        }
        return false
    }
    onCloseHtml(){
        this.setState({
            confirm: {
                show: false,
                data: null
            }
        })         
    }
    onConfirmHtml(element){
        addClass(element, 'del-hidden'); 
        this.setState({
            confirm: {
                show: false,
                data: null
            },
            isoper: true
        })       
    }
    delScanPath(path, event){
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            confirm: {
                show: true,
                data: {
                    title: '扫描设置',
                    text: '<span>您确定要取消扫描该目录？</span>',
                    onClose: this.onCloseHtml.bind(this),
                    onConfirm: this.onConfirmHtml.bind(this, event.currentTarget.parentNode.parentNode)
                }
            }
        })
    } 
    changeVal(event){
        const e = event || window.event;
        if( e.keyCode == 8 ){
            return false
        }
        if( !event.currentTarget ){
            return false
        }
        let val = event.currentTarget.value;
        const regVal = regexStr(val, GET_REGEX_MATCH.integer_greater_0)
        if( !regVal ){
            this.setState({
                setting: {
                    show: true,
                    text: '只能输入大于等于1的整数'
                }
            })
            setTimeout(() => {
                this.setState({
                    setting: {
                       show: false,
                       text: ''
                    }
                })                  
            },1500)
            event.currentTarget.value = scanType
            return
        }
        if( val != scanType ){
            event.currentTarget.classList.add('new-value')
        } else{
            event.currentTarget.classList.remove('new-value')
        }
    }   
    setScanPathConfirm(event){
        const $li_Elem = $('.scllorBar_scan_path').find('li'),
              delPath = [],
              addPath = [];
        let scanTypeVal = 0; 
        //获取删除的扫描目录   
        $li_Elem.each((indexLi, elemLi) => {
            const li_path = $(elemLi).data('path'),
                  type = $(elemLi).data('type');
            if( $(elemLi).hasClass('del-hidden') ){
                delPath.push(li_path)
            }else{
                addPath.push(li_path)
            }
        })        
        //执行【扫描方式】的更改 
        $('.scan-method .p-line').each((indexP, elemP) => {
            if( $(elemP).find('i.outer-circle').hasClass('active') ){
                scanTypeVal = $(elemP).find('input.txt-input').val()
                if( isEmpty(scanTypeVal) ){
                    scanTypeVal = scanType
                } else{
                    scanType = scanTypeVal
                }               
                return false;
            }
        })       
        const val = ""+ (scanTypeVal*this.props.defaultTime) +"",
              data = [{key:"scan_docs_frequence", value: val}];       
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设置更新中...",auto: false})         
        //判断是否有修改扫描删除操作
        if( delPath.length > 0 ){
            //1先修改右侧设置
            this.props.actions.setConfigRequest(data, 'INIT_SET_CONFIG_DEFAULT') 
            //2再修改左侧设置   
            //先删除滚动条
            getmCustomScrollbar($(".scllorBar_scan_path"), null, "destroy")                                
            setTimeout(() => {
                const sendData = {add: addPath, del: delPath};
                try{
                      const result = window.delScanPath(JSON.stringify(sendData))
                      const json_result = $.parseJSON(result)
                      log('设置里取消扫描目录：出参和回参')
                      log(sendData)
                      log(json_result)                      
                      if( json_result && json_result.error_code === 0 ){
                        //重新获取配置信息
                        //每确定一次重新配置一次，列表数据会重新获取最新的，比如扫描个数、扫描状态
                        this.props.actions.getConfigInfo(null, 'SET_GET_CONFIG_INFO')
                        //如果左侧树菜单展开了且有checked的选项，则对应一一删除样式。
                        sendData.del.forEach((item) => {
                            this.props.actions.eventsUnCheck({path: item});
                        })
                      }else{
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(json_result.error) ? json_result.error : "取消扫描目录失败(代码："+ json_result.error_code +")",auto: true,speed:2000,statu: 0})
                      }
                }catch(e){
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消扫描目录失败",auto: true,speed:2000,statu: 0})
                } 
            },300)                           
        }else{
            setTimeout(() => {
                this.props.actions.setConfigRequest(data,'INIT_SET_CONFIG_HIDE_DIALOG')
            },300) 
        }                        
    } 
    beginGuideClose() {
        this.setState({beginguide: 0})         
    }    
    openBeginGuide(config) {
        if( config && config.data && config.data.user_guide ) {
            try{
               const ugVal = parseInt(config.data.user_guide.value)
               if( ugVal != 2 ){
                   //第四步
                   this.setState({beginguide:4})                
               } 
            }catch(e){}
        } 
    }    
    beginGuideTwo() {
        //调用C++接口
        //修改配置文件--更改面板设置
        let val = ""+ 2 +"";
        const data = [{key:"user_guide", value: val}]
        setTimeout(() => {
            this.props.actions.setConfigRequest(data, 'INIT_SET_CONFIG_DEFAULT')
        },20)
        this.setState({beginguide:0})//归0
    } 
    closeSet(event) {
        if( this.state.isoper ){
            this.setState({
                confirm: {
                    show: true,
                    data: {
                        title: '扫描设置',
                        text: '扫描设置有修改，要保存修改吗？',
                        onClose: this.onClose.bind(this),
                        onConfirm: this.setScanPathConfirm.bind(this)
                    }
                }
            })            
        }else{
            this.props.actions.triggerDialogInfo(null)
        }
    } 
    onClose() {
        this.props.actions.triggerDialogInfo(null)
    }      		
    render() {
        const { actions, getConfig, files, defaultTime } = this.props
        const { confirm, setting, beginguide } = this.state
        let scanPathArray = [];
        if( getConfig && getConfig.data ){
            try{
                const allDrive = [...files.driveLetter.data, ...files.mobileDrive.data]
                scanPathArray = getDriveOrPath(getConfig.data.scan_docs_always_path, allDrive)
                if( getConfig.data.scan_docs_frequence ){
                    const min = parseInt(getConfig.data.scan_docs_frequence.value);
                    if( min > 0 ){
                       scanType = parseFloat(min/defaultTime).toFixed(0);
                    }
                } 
            }catch(e){}
        }
        return (
            <div className="folder-settings">
                <div className="flex fs-content">
                  <div className="fs-left">
                      <div className="fs-item">
                         <p className="col-3 item-title font-weight7 flex flex-c">
                             设置扫描目录<span className="pic-msg col-6 font-weight4 flex flex-c">
                                    （已扫描：<img src="compress/img/ic_scan.png" alt="已扫描" className="pic-1"/>
                                     待扫描：<img src="compress/img/ic_wait.png" alt="待扫描" className="pic-2"/>）
                                </span>
                         </p>
                         <div className="item-constent col-6" ref="clientHeight">
                          {
                              scanPathArray && scanPathArray.length > 0?                         
                                  <ul className="scllorBar_scan_path">
                                      {
                                          scanPathArray.map((item, index) => {
                                               return <li className={item.is_exist ? "flex flex-c ssp-item" : "flex flex-c ssp-item text-through"} key={index} data-path={item.path} data-type={item.type}>
                                                         <span className="item-left flex flex-c flex-item-gsb-1">
                                                             {
                                                                  item.prop && getSystemDriveState(item.prop) === GET_DRIVE_STATE.systemVol ?
                                                                     <i className="flex-item-gsb-0 icons-local-material right-m-8 icons-20 lm-plate4-bg">
                                                                         {
                                                                             item.type == 5 ?
                                                                                 <img src="compress/img/ic_wait.png" alt="待扫描" className="abs pic-show" />
                                                                             :
                                                                                 <img src="compress/img/ic_scan.png" alt="已扫描" className="abs pic-show" />   
                                                                         }
                                                                     </i>
                                                                  :
                                                                  item.prop && getSystemDriveState(item.prop) === GET_DRIVE_STATE.noSystemVol ?
                                                                     <i className="flex-item-gsb-0 icons-local-material right-m-8 icons-20 lm-plate5-bg">
                                                                         {
                                                                             item.type == 5 ?
                                                                                 <img src="compress/img/ic_wait.png" alt="待扫描" className="abs pic-show" />
                                                                             :
                                                                                 <img src="compress/img/ic_scan.png" alt="已扫描" className="abs pic-show" />   
                                                                         }                                                                     
                                                                     </i>
                                                                  :
                                                                     <i className="flex-item-gsb-0 icons-local-material right-m-8 icons-20 sb-file-bg">
                                                                         {
                                                                             item.type == 5 ?
                                                                                 <img src="compress/img/ic_wait.png" alt="待扫描" className="abs pic-show" />
                                                                             :
                                                                                 <img src="compress/img/ic_scan.png" alt="已扫描" className="abs pic-show" />   
                                                                         }                                                                     
                                                                     </i>     
                                                             }                                                         
                                                             <span className="path-name flex-item-gsb-1">
                                                                {item.path}
                                                             </span>
                                                             <em className="abs hover-em-msg hem-0">
                                                                {
                                                                  item.is_exist ?
                                                                      item.path
                                                                  :
                                                                      item.path + '（注：目录已被移除或已被重命名）'
                                                                }
                                                             </em>
                                                         </span> 
                                                         <span className="item-right flex flex-c flex-item-gsb-0">
                                                              <a className="fn-btn" onClick={this.openFileLocation.bind(this,item.path)}>
                                                                  <i className="icons icons-18 fn-postion"></i>
                                                                  <em className="abs hover-em-msg hem-1">打开位置</em>
                                                              </a>
                                                              <a className="fn-btn" onClick={this.delScanPath.bind(this,item.path)}> 
                                                                  <i className="icons icons-20 clear-bg"></i>
                                                                  <em className="abs hover-em-msg hem-2">删除</em>
                                                              </a>
                                                         </span>
                                                      </li>  
                                          })
                                      }
                                  </ul>
                              :
                                  <p className="flex flex-c flex-c-c" style={{"height": "100%"}}>暂时未选择任何扫描文件夹</p>   
                          }
                         </div>                       
                      </div>
                  </div> 
                  <div className="fs-right">
                      <div className="fs-item" style={{"display":"none"}}>
                         <p className="col-3 font-weight7 item-title">图标示例</p>
                         <div className="item-constent col-6 example-icon">
                             <p className="p-line flex flex-c">
                                <i className="icons icons-18 fn-check"></i>
                                不扫描 
                             </p>
                             <p className="p-line flex flex-c">
                                <i className="icons icons-18 fn-checked2"></i>
                                扫描                           
                             </p>
                         </div>
                      </div>
                      <div className="fs-item">
                         <p className="col-3 font-weight7 item-title">设置扫描频率</p>
                         <div className="item-constent col-6 scan-method">
                             <p className="p-line flex flex-c" style={{"display":"none"}}>                               
                                <i className={scanType > 0 ? "icons-14 outer-circle flex flex-c flex-c-c" : "icons-14 outer-circle flex flex-c flex-c-c active"} 
                                    onClick={this.changeSacnMethod.bind(this)}>
                                    <em className="icons-6 inner-circle"></em>
                                </i>
                                <span className="txt-line">
                                    智能扫描
                                    <span className="col-9">（系统空闲时自动扫描）</span>
                                    <input type="hidden" className="txt-input" value="0" />
                                </span> 
                             </p>
                             <div className="p-line flex flex-c">
                                <i style={{"display":"none"}} className={scanType > 0 ? "icons-14 outer-circle flex flex-c flex-c-c active" : "icons-14 outer-circle flex flex-c flex-c-c"}
                                   onClick={this.changeSacnMethod.bind(this)}>
                                   <em className="icons-6 inner-circle"></em>
                                </i>
                                <span className="txt-line">
                                    每隔
                                    <input type="text" className="txt-input" defaultValue={scanType > 0 ? scanType : 1} onKeyUp={this.changeVal.bind(this)}/>
                                    天扫描一次 
                                </span>
                                {
                                    beginguide == 4 ?
                                        beginGuideHtml(4,this.props.bgImg,this.props.bgText,this.beginGuideClose,
                                                      this.beginGuideTwo,this.beginGuideClose)
                                    :
                                        null    
                                }                                                            
                             </div>                                                                                  
                         </div>
                      </div>                    
                  </div>
                </div>
                <div className="dialog-footer flex flex-c">
                    <p className="flex flex-l-l" style={{"width":"100%","display":"none"}}>
                       注：此设置页面以右侧点击“确认”按扭后生效。
                    </p>
                    <p className="flex flex-r-r" style={{"width":"100%"}}>
                      <a className="dialog-btn confirm-btn" onClick={this.setScanPathConfirm.bind(this)}>确认</a>
                      <a className="dialog-btn cancel-btn" onClick={() => this.props.actions.triggerDialogInfo(null)}>取消</a> 
                    </p>
                </div>
                {
                    confirm.show && confirm.data ?
                       msgConfirmHtml(confirm.data)
                    :
                       null   
                } 
                {
                    setting.show ? 
                        msgAlertSuccessHtml(setting.text)
                    :
                        null
                }                                
            </div>   
        )
    }	
    componentDidMount() {
        getmCustomScrollbar($(".scllorBar_scan_path"))
        //新手引导
        this.openBeginGuide(this.props.getConfig)
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.colseAt !== this.props.colseAt ){
            this.closeSet()
        }
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            this.setState({refresh:true})
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){ 
            if( nextProps.getConfig.types != 'INIT_GET_CONFIG_INFO' && 
                nextProps.getConfig.types != 'INIT_GET_CONFIG_DEFAULT' ){
                //第二个不相等是为了进入设置页面重新调用配置信息后能实时更新      
                log('FolderSettings=====>shouldComponentUpdate----阻止刷新了')
                return false
            }
        }
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))               
    }
    componentDidUpdate(nextProps, nextState) {
        if( $('.scllorBar_scan_path.mCustomScrollBox').length <= 0 ){
            //重新调用滚动插件
            //log('重新调用滚动插件')
            getmCustomScrollbar($(".scllorBar_scan_path"))
        }
        if(nextProps.resize.h !== this.props.resize.h){
            getmCustomScrollbar($(".scllorBar_scan_path"), null, "update")
        }
        if( this.refs.msgConfirmHtmlRef ){
            absVerticalCenter2(this.refs.msgConfirmHtmlRef)
        } 
        if( this.refs.msgAlertSuccessHtmlRef ){
             absVerticalCenter2(this.refs.msgAlertSuccessHtmlRef)
        }                                  
    }      
}
FolderSettings.defaultProps = {
    defaultTime: 3600*24,
    bgImg: 'compress/img/cable2.png',
    bgText: '选择扫描频率：您可以设置固定周期自动扫描'
}
export default immutableRenderDecorator(FolderSettings)