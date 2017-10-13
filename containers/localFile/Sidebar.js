import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { map, is } from 'immutable'

import { MY_COMPUTER } from '../../constants/TextConstant'
import { beginGuideHtml } from '../../constants/RenderHtmlConstant'
import { getFileInitObjectData } from '../../constants/ConfigInfo'
import { showOrHideItem, clientHeight } from '../../constants/DomConstant'
import { GET_DRIVE_STATE, TREE_FILTER } from '../../constants/DataConstant'
import { LOCAL_FILE_TOTAL_PANELS, LOCAL_FILE_DESKTOP, LOCAL_FILE_CONTENT, SHOW_DIALOG_ALERT, 
         SHOW_DIALOG_CONFIRM, SHOW_SCAN_TREE, SHOW_ALL_TREE, SCAN_DRIVE_MSG,
         SHOW_DIALOG_MOVE_PREVIEW_FILES } from '../../constants/TodoFilters'
import { log, isEmpty, objClone, getSystemDriveState, dragLineDrop, hasClass, addClass, removeClass, 
         toggleClass, getmCustomScrollbar2, getmCustomScrollbar3, getNavigation } from '../../constants/UtilConstant'

import SidebarTop from './SidebarTop'
import SidebarFiles from './SidebarFiles'
import FileFilter from '../../modules/smallModel/FileFilter'
import TimeFilter from '../../modules/smallModel/TimeFilter'
import HueFilter from '../../modules/smallModel/HueFilter'

const doc = document;
class Sidebar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            isShowFilter: false,
            treeFilter: TREE_FILTER[0], 
            clickTime: null,
            userguide: true,
            beginguide: 0,
            mobileHardDisk: null
        };
        this.beginGuideNext = this.beginGuideNext.bind(this)
        this.beginGuideClose = this.beginGuideClose.bind(this)
        this.beginGuideSend = this.beginGuideSend.bind(this)
        this.oneBodyClick = this.oneBodyClick.bind(this)
        this.eventsKeyDown = this.eventsKeyDown.bind(this)
      	log("Sidebar");		
  	}
    inItTotalPanel(treefilter, keys) {
        //初始化路由
        if( treefilter && treefilter.filter === SHOW_SCAN_TREE ){
            this.props.inItData['get_filter'] = 2
        }        
        const routeData = {
           route: {
              types: 'first-route',
              menu: LOCAL_FILE_TOTAL_PANELS,
              data: this.props.inItData,
              nav:{
                 fore: [],
                 now: this.props.inItData,
                 after: []
              },
              host: [this.props.inItData.file_name]              
           }
        } 
        if( keys ) {
            routeData.route.data['keys'] = keys
        }
        //开启路由，让右侧面板获取数据并显示盘符
        this.props.actions.getInItRoute(routeData);               
    }
    inItAsyncgetFileRequest(treefilter, keys){
        //初始化请求数据
        const data = objClone(getFileInitObjectData);
        let par_Elem = doc.getElementById('FirstItemP'),
            this_Elem = doc.getElementById('FirstListMoreBg'),
            sib_Elem = doc.getElementById('FirstMenuDiv');         
        data.node = {_this:this_Elem,_par:par_Elem,_sib:sib_Elem}
        if( treefilter && treefilter.filter === SHOW_SCAN_TREE ){
            data.get_filter = 2;
        }
        if( keys ) {
            data.keys = keys
        }
        setTimeout(() => {
            //请求左侧树形菜单数据
            this.props.actionsLF.asyncgetFileRequest(data)
        }, 30)       
    }  
    showTreeFilter(event) {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isShowFilter: !this.state.isShowFilter
        })
    }
    changeTreeFilter(item, event) {
        event.stopPropagation();
        event.preventDefault();
        if( item.filter === this.state.treeFilter.filter ){
            return false
        }
        this.setState({
            treeFilter: item
        })
        //选择后初始化盘符与数据
        this.inItTotalPanel(item)
        this.inItAsyncgetFileRequest(item)
        //底部左侧显示区域初始化
        this.props.actions.fileInfoMessage(null)       
    } 
    eventsKeyDown(evnet) {
        //右键菜单---暂时不开发
        const e = event || window.event,
              isFocus = $('#Lianty-LocalFile input[type=text]').is(':focus');  
        switch(e.keyCode){
            case 37: //左键
                break;
            case 38: //上键
                //console.log("进来了这里1？")
                break;
            case 39: //右键

                break;
            case 40: //下键
                 //console.log("进来了这里2？")          
                break;
            case 13: //Enter键    
            case 32: //spaceBar 空格键

                break;
            case 8: //Backspace 回格键   
                
                break;    
            default:
                break;
        }
        return false         
    }
    oneBodyClick(event) {   
        if( this.state.isShowFilter ){
            setTimeout(() => {
                this.setState({isShowFilter: false}) 
            },50)     
        }
    } 
    beginGuideClose() {
        $('#begin-guide').remove()
        const bodyDom = doc.getElementById('body-opacity-layer') 
        if( bodyDom ){          
           bodyDom.style.cssText = "display:none;background:#000;opacity:.1";
        } 
        this.setState({beginguide: -1})         
    }    
    openBeginGuide(config) {
        //第一步 
        const bodyDom = doc.getElementById('body-opacity-layer'),
              lastDriveDom = doc.getElementById('last-drive');      
        if( bodyDom && lastDriveDom ){          
            bodyDom.style.cssText = "display:block;background:#FFF;opacity:.3";
            render(beginGuideHtml(1,this.props.bgImg,this.props.bgText,this.beginGuideNext,this.beginGuideSend,this.beginGuideClose), lastDriveDom)
        }        
    }
    beginGuideNext() {
        //下一步 
        this.beginGuideClose()
        this.props.actions.defaultMessage({beginguide: 2})
    } 
    beginGuideSend() {
        //调用C++接口
        //修改配置文件--更改面板设置
        let val = ""+ 1 +"";
        const data = [{key:"user_guide", value: val}]
        setTimeout(() => {
            this.props.actions.setConfigRequest(data, 'INIT_SET_CONFIG_DEFAULT')
        },10)
        this.beginGuideClose()        
    } 	
    render() {
      const { inItData } = this.props
      const { isShowFilter, treeFilter, beginguide } = this.state  
      let istyle = 'icons icons-20 drop-down-bg flex flex-c flex-r-r flex-item-gsb-0' 
      if( isShowFilter ){
         istyle += ' rotate-180-bg'
      }         
      return (
  	      <div className="sidebar flex-item-gsb-0 flex flex-dir-column" ref="dragPanelRef">
               <div className="drag-line-vertical abs" ref="dragDivRef"></div>
               <SidebarTop 
                 actions={this.props.actions}
                 actionsLF={this.props.actionsLF}
                 actionsLog={this.props.actionsLog}
                 getConfig={this.props.getConfig}
                 login={this.props.login}
                 files={this.props.files}
                 noticeMsg={this.props.noticeMsg}
                 noticeMsgLastUpdated={this.props.noticeMsgLastUpdated}
                 jsMsgHandle={this.props.jsMsgHandle}
                 jsMsgHandleLastUpdated={this.props.jsMsgHandleLastUpdated}/>
               <div className="sidebar-menu flex flex-l flex-l-l flex-dir-column">
                   {
                       TREE_FILTER && TREE_FILTER.length > 0 ?
                           <div className="sm-filter flex flex-c flex-l-l col-0">
                               <p className="change-text active flex flex-c" id="tree-filter-mode" data-treefilter={treeFilter.value} onClick={this.showTreeFilter.bind(this)}>
                                  <i className={treeFilter.icon}></i>
                                  <span className="text-sp">{treeFilter.text}</span>
                                  <i className={istyle}></i> 
                               </p>
                               {
                                   isShowFilter ?
                                       <ul className="abs sm-f-ul">
                                           {
                                               TREE_FILTER.map((item, index) => {
                                                   if( item.filter === treeFilter.filter ) {
                                                       return <li key={index} className="sm-f-li active flex flex-c flex-l-l" onClick={this.changeTreeFilter.bind(this, item)}>
                                                                <i className={item.icon}></i>
                                                                {item.text}
                                                              </li>
                                                   }
                                                   return <li key={index} className="sm-f-li flex flex-c flex-l-l" onClick={this.changeTreeFilter.bind(this, item)}>
                                                            <i className={item.icon}></i>
                                                            {item.text}
                                                          </li>
                                               })
                                           }
                                       </ul>
                                    :
                                       null                                      
                               }
                           </div>
                        :
                            null                           
                   } 
                   <SidebarFiles 
                        {...this.props} 
                        noticeMsg={this.props.noticeMsg}
                        treeFilter={treeFilter} 
                        beginguide={beginguide} 
                        openBeginGuide={this.openBeginGuide.bind(this)}/>
                   <a href="javascript:;" className="drag-up-down abs" ref="dragDivRef2">＝</a>
               </div>
               <div className="filter-panel scllorBar_filter" ref="clientHeight2">
                   {
                       true ?
                           null 
                       :
                           <div>
                           <FileFilter fmData={{}} active={false}/>
                           <TimeFilter fmData={{}} active={false}/>
                           <HueFilter fmData={{}} active={false}/>
                           </div>                       
                   }

               </div>
  	      </div>
      )
    }	   
    componentDidMount() {
        //样式，初始化加载过滤条件滚动条
        getmCustomScrollbar3($('.scllorBar_filter'))

        //横向拖拽
        const dragElem = this.refs.dragDivRef,
              parElem = this.refs.dragPanelRef;
        if( dragElem && parElem ){
          dragLineDrop(dragElem, parElem, 220, 'right', $('.menu-content .menu-item'))
        } 
        //纵向拖拽
        const dragElem2 = this.refs.dragDivRef2,
              parElem2 = this.refs.clientHeight1;
        if( dragElem2 && parElem2 ){
          dragLineDrop(dragElem2, parElem2, 220, 'bottom', null, $('.scllorBar_menu'))
        }
        //委托事件
        doc.body.addEventListener('click', this.oneBodyClick) 
        doc.body.addEventListener('keydown', this.eventsKeyDown)         
    } 
    componentWillReceiveProps(nextProps){
        log('Sidebar----componentWillReceiveProps')
        //配置信息  
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //新手引导
            const configObj = nextProps.getConfig.data;
            if( configObj && this.state.beginguide == 0 ){
                if( configObj.user_guide ){
                    const ugVal = parseInt(configObj.user_guide.value)
                    if( ugVal != 0 ){
                        this.setState({
                            beginguide : -1
                        })
                    }                                        
                }                
            }
        }
        //jsMsgHandle c++ ==> js 接口
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsData = nextProps.jsMsgHandle.param,
                  module = nextProps.jsMsgHandle.module;
            if( !jsData ){
                log('---返回数据为空---')
                return;
            } 
            const jsVal = jsData.data;                  
            switch(module){
                case 'preview_continue_move_info_t':
                    //初始化时获取上次迁移预览图路径时软件未正常关闭
                    if( jsData && jsData.error_code == 0  && jsData.data  ){
                        const path = jsData.data.previous_move_path;
                        this.props.actions.triggerDialogInfo({
                            type: SHOW_DIALOG_CONFIRM,
                            title: '系统提示',
                            text: '因上次软件未正常关闭，预览图路径修改至“'+ path +'”失败。是否继续修改？',
                            confirmBtnText: '继续',
                            cancelBtnText: '取消',
                            confirmFn: () => {
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_MOVE_PREVIEW_FILES})
                                setTimeout(() => {
                                    this.props.actions.sendHandleMessage('SettingMsgProcess', 'changePreviewPath', {thumb_base_path:path})
                                },10) 
                            }
                        });                        
                    }
                break;
                case 'cancel_preview_move_rsp_t':
                    //取消预览图迁移操作
                    if( jsData.error_code != 0 ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000,statu: 1})
                        return
                    }
                    if( jsVal && jsVal.is_complete ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "取消成功",auto: true,speed: 3000,statu: 1})
                        this.props.actions.getConfigInfo();
                    }else{
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(jsData.error) ? jsData.error : "取消失败(代码："+ jsData.error_code +")",auto: true,speed: 3000,statu: 1})
                    }
                break;                
                default:
                break;
            }
        }                
    }
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            if( nextProps.jsMsgHandle.module !== 'scan_init_status_t' ){
                log('Sidebar----------------shouldComponentUpdate：阻止渲染了0')
                return false
            }
        }
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
                        
    }
    componentDidUpdate(nextProps, nextState) {    
        const dragElem = this.refs.dragDivRef,
              parElem = this.refs.dragPanelRef;
        if( dragElem && parElem ){
            //不能删除，同步menu UI的宽度。 
            dragLineDrop(dragElem, parElem, 220, 'right', $('.menu-content .menu-item'))
        }
        if(nextProps.resize.h !== this.props.resize.h){
            //clientHeight(this.refs.clientHeight2,this.props.resize.h, 293)       
        }
        if(nextProps.resize.h !== this.props.resize.h){
            getmCustomScrollbar2($(".scllorBar_filter"),'update')
        }          
    }
    componentWillUnmount() {
        doc.body.removeEventListener('click', this.oneBodyClick)
        doc.body.removeEventListener('keydown', this.eventsKeyDown)        
    }                 
}
Sidebar.defaultProps = { 
    bgImg: 'compress/img/cable1.png',
    bgText: '勾选您要扫描的分区或文件夹，设置链图云允许扫描的范围。',  
    inItData: {file_name:MY_COMPUTER, dir: null, path: null, mode: 'drive',IDS: LOCAL_FILE_TOTAL_PANELS}
}
const mapStateToProps = (state) => {
    return {
        files: state.files,

        noticeMsg: state.msg.noticeMsg,
        noticeMsgLastUpdated: state.msg.noticeMsgLastUpdated,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated                         
    }
} 
export default connect(
    mapStateToProps
)(immutableRenderDecorator(Sidebar))