import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { map, is } from 'immutable'


import { MY_COMPUTER } from '../../constants/TextConstant'
import { beginGuideHtml } from '../../constants/RenderHtmlConstant'
import { getFileInitObjectData } from '../../constants/ConfigInfo'
import { showOrHideItem, clientHeight } from '../../constants/DomConstant'
import { GET_DRIVE_STATE } from '../../constants/DataConstant'
import { LOCAL_FILE_TOTAL_PANELS, LOCAL_FILE_DESKTOP, LOCAL_FILE_CONTENT, SHOW_DIALOG_ALERT, 
         SHOW_DIALOG_CONFIRM, SHOW_SCAN_TREE, SHOW_ALL_TREE, SCAN_DRIVE_MSG,
         SHOW_DIALOG_MOVE_PREVIEW_FILES } from '../../constants/TodoFilters'
import { log, isEmpty, objClone, getSystemDriveState, dragLineDrop, hasClass, addClass, removeClass, 
         toggleClass, getmCustomScrollbar2, getmCustomScrollbar3, getNavigation } from '../../constants/UtilConstant'

const doc = document;
class SidebarFiles extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            clickTime: null,
            mobileHardDisk: null
        };
      	log("SidebarFiles");		
  	}
    styleTreeItem(){
        const $mc_Elem = $('#FirstMeunUl'),
              $select = $mc_Elem.find('p.item-p.select'),
              $active = $mc_Elem.find('p.item-p.active:not(.active-old)');
        if( $select.length > 0 ){
            $select.removeClass('select default') 
        }
        if( $active.length > 0 ){
            $active.addClass('active-old')
        }        
    }
    selectTreeItem(thisPath){
        const ulDom = doc.getElementById('FirstMeunUl'),
              $p_Elem = $(ulDom).find('li > p'),
              target = this;
        let hasPath = false;
        $p_Elem.each((index, elem) => {
            const path = $(elem).data('path');
            if( path === thisPath ){
                hasPath = true;
                target.styleTreeItem();                        
                $(elem).addClass('select')
                return false;
            }
        })
        if( hasPath ){
            return true
        }
        return false
    }
    routesTotalPanelsBtn(elem, event){
        event.stopPropagation();
        event.preventDefault();
        elem['IDS'] = LOCAL_FILE_TOTAL_PANELS;
        const navData = getNavigation(this.props.route, elem);      
        const data = {
           route: {
              menu: LOCAL_FILE_TOTAL_PANELS,
              data: elem,
              nav:{
                 fore: navData.fore,
                 now: navData.now,
                 after: navData.after
              },
              host: !isEmpty(elem.path) ? elem.path.split('\\') : [elem.file_name]
           }
        }
        this.props.actions.getInItRoute(data);        
    }
    routesContentInfo(elem) {
        elem['IDS'] = LOCAL_FILE_CONTENT;
        const navData = getNavigation(this.props.route, elem)      
        const data = {
           route: {
              menu: LOCAL_FILE_CONTENT,
              data: elem,
              nav:{
                 fore: navData.fore,
                 now: navData.now,
                 after: navData.after
              },
              host: !isEmpty(elem.path) ? elem.path.split('\\') : [elem.file_name]              
           }
        } 
        setTimeout(() => {       
            this.props.actions.getInItRoute(data);  
        },20)      
    }
    routesFileBtn(elem, event){  
        clearTimeout(this.state.clickTime)
        if( event ){  
            event.stopPropagation()
            event.preventDefault()
            this.styleTreeItem()
            event.currentTarget.classList.add('select')
            event.currentTarget.classList.remove('default')
        }
        const route = this.props.route && this.props.route.data
        if( elem && route && route.mode != 'search' && elem.path === route.path ){
            return false
        }        
        this.state.clickTime = setTimeout(() => {
            if( this.props.treeFilter.filter ===  SHOW_SCAN_TREE ){
                elem['get_filter'] = 2
            } else {
                elem['get_filter'] = 0
            }                    
            this.routesContentInfo(elem)
        },300)
    }   
    scanSelectBtn(elem, isDrive, event){
        try{
            event.stopPropagation();
            event.preventDefault();
            const p_elem = event.currentTarget.parentNode;
            if( hasClass(p_elem, 'checked') ){
                if( hasClass(p_elem, 'mode-dialog') ){
                    //如果是在弹窗中选择
                    return
                }                
                if( hasClass(p_elem, 'hasScanPath') && this.props.mode !== "dialog" ){                   
                    if( this.props.noticeMsg && !this.props.noticeMsg.action ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在扫描中，请稍候再操作",auto: true,speed: 1500,statu: 0})
                        return false;
                    }
                    const data = {
                        type: SHOW_DIALOG_CONFIRM,
                        title: "扫描",
                        text: "您确定要取消扫描该目录？",
                        code: 'RECEIVE_ASYNC_SET_SCAN_DOCS_PATH_REQUEST',
                        codeData: {elem: elem},
                        element: p_elem          
                    }
                    this.props.actions.triggerDialogInfo(data)                 
                }else{
                    this.props.actions.eventsUnCheck(elem);
                    removeClass(p_elem, 'checked')
                }
            }else{
                if( isDrive > -1 && this.props.mode !== "dialog" ){
                    const data = {
                        type: SHOW_DIALOG_CONFIRM,
                        title: "扫描",
                        text: "扫描根目录将占用大部分资源，不建议此操作。",
                        code: SCAN_DRIVE_MSG,
                        codeData: {elem: elem},
                        element: p_elem          
                    }
                    this.props.actions.triggerDialogInfo(data)                     
                }else{
                    this.props.actions.eventsCheck(elem);
                    addClass(p_elem, 'checked')
                }
            }
        }catch(e){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "您选择的目录不存在",auto: true,speed: 2000,statu: 0})
        }
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
        if( this.props.actionsLF ){
            setTimeout(() => {
                //请求左侧树形菜单数据
                this.props.actionsLF.asyncgetFileRequest(data)
            },30)       
        }
    }
    getTreeOffset(displayMode) {
        //计算当前页面可以加载多少条数据
        const panElem = doc.getElementById('tree_menu_panel')
        let _h = 24, //li的最小高度
            fetch_size = 50; //初始值        
        if( panElem ){
            try{
                const parH = $(panElem).height();
                fetch_size = Math.ceil(parH/_h) + 5 
            }catch(e){}
        }
        return fetch_size
    } 
    getTreeScllorData(pullload) {
        //下拉时加载的数据
        const data = objClone(getFileInitObjectData),
              fetch_size = this.getTreeOffset();
        if( fetch_size > 0 ){      
            data.fetch_size = fetch_size
        }
        if( this.props.treeFilter.filter ===  SHOW_SCAN_TREE ){
            data.get_filter = 2
        } else {
            data.get_filter = 1
        }   
        //对应的树节点有问题。。。      
        if( this.props.files && this.props.files.common ){
            data.node = this.props.files.common.node
            data.dir = this.props.files.common.dir
        }
        if( this.props.files && this.props.files.common ){ 
            if( pullload != null && pullload ) {
                data.pull_load = pullload
                data.offset = this.props.files.common.offset + 1
            } else {
                data.pull_load = false
                data.offset = 0
            } 
        }        
        if( this.props.actionsLF ){
            this.props.actionsLF.asyncgetFileRequest(data) 
        }      
    }
    getTreeData(temp, elem, _this, _par, _sib) {
        const data = objClone(getFileInitObjectData),
              fetch_size = this.getTreeOffset();
        if( fetch_size > 0 ){      
            data.fetch_size = fetch_size
        }
        data.dir = elem.path
        data.is_tab = false //默认不分页
        if( this.props.treeFilter.filter ===  SHOW_SCAN_TREE ){
            data.get_filter = 2
        } else {
            data.get_filter = 1
        }         
        if( _this && _par && _sib ){
            data.node = {_this:_this,_par:_par,_sib:_sib}
        } else {
            if( this.props.files && this.props.files.common ){
                data.node = this.props.files.common.node
            }
        }        
        if( temp == 2 ){ //2是双击,右侧列表响应。1是单击，右侧列表不响应
            if( this.props.treeFilter.filter ===  SHOW_SCAN_TREE ){
                elem['get_filter'] = 2
            }else{
                elem['get_filter'] = 0
            }
            this.routesContentInfo(elem)
            if( this.props.actionsLF ){
                setTimeout(() => {
                    this.props.actionsLF.asyncgetFileRequest(data)
                },20)
            }
        } else {
            if( this.props.actionsLF ){
                this.props.actionsLF.asyncgetFileRequest(data)
            }
        }      
    }   
    submenuBtn(elem, temp, event){
        clearTimeout(this.state.clickTime);
        event = event || window.event;
        event.stopPropagation();
        event.preventDefault();
        const $active_Elem = $('#FirstMeunUl').find('p.active:not(.active-old)'),
              eventType = event.type;
        let this_Elem,par_Elem,sib_Elem;
        if( eventType && eventType.toLowerCase() == 'click' ){
            this_Elem = event.currentTarget,
            par_Elem = this_Elem.parentNode, //定位到p标签
            sib_Elem = par_Elem.nextSibling;
        } else {
            par_Elem = event.currentTarget,
            this_Elem = par_Elem.querySelector('.list-more-bg2'),
            sib_Elem = par_Elem.nextSibling;
            this.selectTreeItem(par_Elem.getAttribute('data-path'));          
        }     
        if( $active_Elem.length > 0 ){
            $active_Elem.addClass('active-old')
        }
        if( hasClass(par_Elem, 'active') ){
            removeClass(par_Elem, 'active')
            const replaceHtml = rep => {
                if( rep && rep.children ){
                    $(rep.children).remove()
                    let _left = parseInt(par_Elem.getAttribute('data-left')) + 21;
                    $(rep).html('<span class="load-msg"><i class="loading-bg2" style="margin-left:'+_left+'px;"></i>加载中...</span>');                    
                }
                if( rep.nextSibling ){
                    replaceHtml(rep.nextSibling)
                }
            }
            replaceHtml(sib_Elem)
        }else{
            const route = this.props.route,
                  loadDom = sib_Elem.querySelector('.load-msg');
            if( elem && route && route.data && elem.path === route.data.path && elem.is_empty ){
                return false
            }   
            addClass(par_Elem, 'active')
            if( loadDom && !elem.is_empty ){
                loadDom.style.display = 'block'
            }                   
            this.getTreeData(temp, elem, this_Elem, par_Elem, sib_Elem)
        }  
    }    
    renderSidbarMenuRecursion(data, _node, drive) {
        if( data.constructor != Array ){
            return null;
        }
        let _Left = 0, _width = null, wobj = null, p_class = '',
           configPath = [], scanPaths = [], drivePath = [], lastDrPath = null;
        if( _node ){
            _Left = parseInt($(_node._par).data('left')) + 10;
            _width = _node._par.parentNode.style.width;
            if( _width ){
                wobj = {"width": _width}
            }
            if( hasClass(_node._par, 'checked') ){//选择扫描状态
                p_class += ' checked'
            }
            if( hasClass(_node._par, 'hasScanPath') ){//选择扫描状态，取消扫描时有用
                p_class += ' hasScanPath'
            } 
            if( hasClass(_node._par, 'mode-dialog') ){//选择扫描状态，弹窗选择有用
                p_class += ' mode-dialog'
            }                       
        }
        if( drive && drive.constructor == Array ) {
            //实际生产时-1
            lastDrPath = drive[drive.length - 1].path 
            //获取盘符，包括移动硬盘
            drivePath = drive.map((dr) => dr.path)           
        }       
        try{
            const getConfig = this.props.getConfig;
            if( getConfig && getConfig.data ){
                configPath = JSON.parse(getConfig.data.scan_docs_always_path.value)
                scanPaths = configPath.map((config) => config.path)
            }
        }catch(e){}      
        return <ul className="menu-ul" key={Date.now()}>
                {
                    data.map((elem, index) => {
                        if( !elem.is_file ){
                            let p_classes = 'item-p flex flex-c'+ p_class,
                                p_type = null;   
                            if( scanPaths.length > 0 ){ //表示执行扫描过的文件
                                const hasIndex = scanPaths.indexOf(elem.path)
                                if( hasIndex != -1 ){
                                    p_type = configPath[hasIndex].type;
                                    p_classes += ' checked hasScanPath';
                                    elem['scan_type'] = p_type;
                                    if( this.props.mode == "dialog" ){
                                        p_classes += " mode-dialog"
                                    }
                                }
                            }
                            const isDrive = drivePath.indexOf(elem.path);  
                            return <li key={index} className="menu-item" style={wobj}>
                                      {
                                          this.props.beginguide == 0 && lastDrPath === elem.path ?
                                              <div id="last-drive"></div>
                                          :
                                              null    
                                      }
                                      <p className={p_classes} data-left={_Left} 
                                         data-path={elem.path} data-type={p_type} 
                                         style={{"paddingLeft":_Left+"px"}} 
                                         onClick={this.routesFileBtn.bind(this, elem)}
                                         onDoubleClick={this.submenuBtn.bind(this, elem, 2)}>
                                         <i className="icons icons-18 fn-check right-m-5 flex-item-gsb-0" 
                                            onClick={this.scanSelectBtn.bind(this, elem, isDrive)}></i>
                                         {
                                             !elem.is_empty ?
                                                 <i className="flex-item-gsb-0 icons icons-10 list-more-bg2 right-m-5" onClick={this.submenuBtn.bind(this, elem, 1)}></i>
                                             :
                                                 <i className="flex-item-gsb-0 icons icons-10 list-more-bg2 right-m-5 visible-hidden"></i>      
                                         }      
                                         {
                                              elem.file_prop && getSystemDriveState(elem.file_prop) === GET_DRIVE_STATE.systemVol ?
                                                 <i className="flex-item-gsb-0 icons-local-material right-m-5 icons-20 lm-plate4-bg"></i>
                                              :
                                              elem.file_prop && getSystemDriveState(elem.file_prop) === GET_DRIVE_STATE.noSystemVol ?
                                                 <i className="flex-item-gsb-0 icons-local-material right-m-5 icons-20 lm-plate5-bg"></i>
                                              :
                                                 <i className="flex-item-gsb-0 icons-local-material right-m-5 icons-20 sb-file-bg"></i>     
                                         }
                                         <span className="item-text">{elem.volume_name ? (elem.volume_name+'（'+ elem.file_name.toUpperCase() +'）') : elem.file_name}</span>
                                      </p>
                                      <div className="submenu"><span className="load-msg"><i className="loading-bg2" style={{"marginLeft": (_Left+21)+"px"}}></i>加载中...</span></div>
                                   </li>
                        }
                        return null
                    })
                }
               </ul>             
    }	
    render() {
      const { inItData } = this.props          
      return (
           <div className="menu-content scllorBar_menu col-0" ref="clientHeight1" id="tree_menu_panel">
                <ul className="menu-ul" id="FirstMeunUl">
                     <li className="menu-item">
                        <p className="item-p flex flex-c active" id="FirstItemP" data-left="0" data-path={"null"} onClick={this.routesTotalPanelsBtn.bind(this, inItData)}>
                           <i className="icons icons-18 fn-check right-m-5 flex-item-gsb-0"
                              onClick={this.scanSelectBtn.bind(this, inItData, 0)}></i>
                           <i id="FirstListMoreBg" className="flex-item-gsb-0 icons icons-10 list-more-bg2 right-m-5" onClick={this.submenuBtn.bind(this, inItData, 1)}></i>
                           <i className="flex-item-gsb-0 icons-local-material right-m-5 icons-20 sb-mycomputer-bg"></i>
                           <span className="item-text">{inItData.file_name}</span>
                        </p>
                        <div className="submenu" id="FirstMenuDiv"><span className="load-msg"><i className="loading-bg2" style={{"marginLeft":"21px"}}></i>加载中...</span></div>
                        <div className="submenu" id="MobileFirstMenuDiv"><span className="load-msg"><i className="loading-bg2" style={{"marginLeft":"21px"}}></i>加载中...</span></div>
                     </li>                        
                </ul>                        
           </div>
      )
    }	
    _scllorFn() {
        const files = this.props.files
        if( files && files.filesData && files.filesData.data ){
            log("tree下拉加载开始--->")
            this.getTreeScllorData(true)
        }    
    }    
    componentDidMount() {
        //初始化获取menu菜单列表（获取盘符数据）并右侧跳转到面板盘符页面
        this.inItTotalPanel(this.state.treeFilter)
        this.inItAsyncgetFileRequest(this.state.treeFilter);

        //样式，初始化加载过滤条件滚动条
        getmCustomScrollbar3($('.scllorBar_menu'))        
    } 
    componentWillReceiveProps(nextProps){
        log('SidebarFiles----componentWillReceiveProps')
        //tree渲染
        if( nextProps.files && nextProps.files.filesLastUpdated != this.props.files.filesLastUpdated ){
            if( nextProps.files.common && nextProps.files.common.mode === 0 ){
                if( nextProps.files.filesData && nextProps.files.filesData.error_code == 0 ){
                    console.time("渲染树形结构时间：")
                    if( nextProps.files.filesData.data && nextProps.files.filesData.data.length > 0 ){
                        const _common = nextProps.files.common,
                              _node = _common.node,
                              _mobileNode = _common.mobileNode,
                              file_data = nextProps.files.filesData.data, //当前数据
                              drive_data = nextProps.files.driveLetter.data, //本地硬盘
                              mobile_data = nextProps.files.mobileDrive.data; //移动硬盘

                        //总盘符
                        const allDrive = [...drive_data, ...mobile_data]    
                        //判断移动硬盘插入与拔出，如果是则不更新本地硬盘
                        if( !_common.keys || _common.keys !== 'MOBILE-HARD-DISK' ){      
                            //判断file_data里是否有移动硬盘盘符数据，有的话就删除
                            if( _common.dir == null && mobile_data && mobile_data.length > 0 ){
                                mobile_data.forEach((moblieItem, index) => {
                                    for( let i = 0, lens = file_data.length; i < lens; i++ ){
                                        if( file_data[i].path === moblieItem.path ){
                                            file_data.splice(i, 1)
                                            break
                                        }
                                    }
                                })
                            }
                            if( _node ){
                                if( _node._this && _node._sib ){
                                    $(_node._sib).empty() //清空dom下所有节点，加载状态节点
                                    if( hasClass(_node._par, 'active') ){
                                        render(this.renderSidbarMenuRecursion(file_data, _node, allDrive), _node._sib) 
                                        if( this.props.beginguide == 0 && this.props.openBeginGuide ){
                                            this.props.openBeginGuide() 
                                        }
                                    }                            
                                }
                            }
                        }
                        //定位到获取盘符数据时
                        if( _common.dir == null && mobile_data ){
                            const _cloneNode = objClone(_node)
                            _cloneNode._sib = doc.getElementById('MobileFirstMenuDiv')
                            if( _cloneNode._this && _cloneNode._sib ){
                                $(_cloneNode._sib).empty() //清空dom下所有节点，加载状态节点
                                if( hasClass(_cloneNode._par, 'active') ){
                                    render(this.renderSidbarMenuRecursion(mobile_data, _cloneNode, allDrive), _cloneNode._sib) 
                                    if( this.props.beginguide == 0 && this.props.openBeginGuide ){
                                        this.props.openBeginGuide() 
                                    }                                
                                }                            
                            }
                        }
                    }
                    //节点样式对应右侧路由目录
                    this.selectTreeItem(this.props.route.data.path)
                    //重新调整滚动条
                    getmCustomScrollbar2($('.scllorBar_menu'),'update')
                    console.timeEnd("渲染树形结构时间：")                                    
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "获取文件夹失败",auto: true,speed: 1500,statu: 0})
                }
            } 
        }
        //获取对应的节点状态样式
        if( nextProps.route && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
            const routeData = nextProps.route.data;
            if( routeData ){
                const isSelectTree = this.selectTreeItem(routeData.path)
                //如果当前是搜索状态
                if( routeData.mode == 'search' ){
                    const selectDom = doc.getElementById('FirstMeunUl').querySelector('.item-p.select')
                    if( selectDom ) {
                        addClass(selectDom, 'default')
                    }
                } else {
                    // const defaultDom = doc.getElementById('FirstMeunUl').querySelector('.item-p.default')
                    // if( defaultDom ){
                    //     removeClass(defaultDom, 'default')
                    // }
                }
                //如果节点没有找到，则选择最上级父节点
                // if( !isSelectTree && routeData.path ){
                //     const rdArray = routeData.path.split('\\');
                //     this.selectTreeItem(rdArray[0])
                // }
            }
        }
        //获取对应的节点选择扫描状态
        if( nextProps.check && nextProps.checkLastUpdated !== this.props.checkLastUpdated ){
            const $p_Elem = $('#FirstMeunUl').find('li > p') //要从最上级开始往下找
            const closestAddFn = (element) => {
                //向上递归
                const li_Elem = element.closest('li.menu-item').siblings('li.menu-item'),
                      p_nocheck_Elem = li_Elem.children('p.item-p:not(.checked)');
                if( p_nocheck_Elem.length == 0 ){
                    const p_elem = element.closest('div.submenu').siblings('p.item-p'),
                          par_p_elem = p_elem.closest('div.submenu').siblings('p.item-p');
                    if( !nextProps.check.hasScanPath ){      
                        p_elem.addClass('checked');
                    }else{
                        p_elem.addClass('checked hasScanPath');
                    }
                    if( par_p_elem.length > 0 ){
                        //递归调用
                        closestAddFn(p_elem)
                        //arguments.callee(p_elem) 严格模式下arguments.callee()不可用。
                    }
                }
            }      
            $p_Elem.each((index, elem) => {
                const path = $(elem).data('path'),
                      pDom = $(elem).siblings('div.submenu').find('p.item-p');
                if( path == nextProps.check.path ){
                    if( !nextProps.check.hasScanPath ){
                        $(elem).addClass('checked')
                        pDom.addClass('checked')
                    }else{
                        $(elem).addClass('hasScanPath checked')
                        pDom.addClass('hasScanPath checked')
                    }                    
                }     
            })            
        }
        //获取对应的节点选择不扫描状态
        if( nextProps.uncheck && nextProps.uncheckLastUpdated !== this.props.uncheckLastUpdated ){
            const $p_Elem = $('#FirstMeunUl').find('li > p') //要从最上级开始往下找
            const closestRemoveFn = (element) => {
                const p_elem = element.closest('div.submenu').siblings('p.item-p:not(.mode-dialog)'),
                      par_p_elem = p_elem.closest('div.submenu').siblings('p.item-p:not(.mode-dialog)');     
                p_elem.removeClass('checked hasScanPath')
                if( par_p_elem.length > 0 ){
                    //递归调用
                    closestRemoveFn(p_elem)
                }
            }                   
            $p_Elem.each((index, elem) => {
                const path = $(elem).data('path');
                if( path === nextProps.uncheck.path ){
                    closestRemoveFn($(elem))
                    $(elem).siblings('div.submenu').find('p.item-p:not(.mode-dialog)').removeClass('checked hasScanPath')
                    $(elem).removeClass('checked hasScanPath')                   
                }
            })           
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
                case 'device_change_msg':
                    if( jsData && jsData.error_code == 0  && jsData.data ){
                        //获取移动硬盘---一同获取电脑本地硬盘（获取左侧盘符数据，但跳转页面）
                        //如在面板页调用初始面板路由，如在其它页面启用最小化提示（最小化目前不开发）。
                        const route = nextProps.route,
                              paramData = nextProps.jsMsgHandle.param.data,
                              status = paramData && paramData.status;
                        if( route ){
                            let hasPath = false
                            if( status === 0 && route.data ){
                                const mobilePath = paramData.drive_lable,
                                      routePath = route.data.path;   
                                if( routePath && mobilePath && routePath.indexOf(mobilePath) == 0 ){
                                    hasPath = true
                                }      
                            }
                            route.menu === LOCAL_FILE_TOTAL_PANELS || hasPath ? this.inItTotalPanel(this.props.treeFilter, 'MOBILE-HARD-DISK') : null
                        }
                        this.inItAsyncgetFileRequest(this.props.treeFilter, 'MOBILE-HARD-DISK')

                        //获取配置信息，扫描设置里的数据加载移动硬盘等数据
                        setTimeout(() => {this.props.actions.getConfigInfo(null, 'FIRST_INIT_GET_CONFIG_INFO')},80)                     
                    } 
                break;                
                default:
                break;
            }
        }                
    }
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            if( nextProps.jsMsgHandle.module !== 'device_change_msg' ){
                log('SidebarFiles----------------shouldComponentUpdate：阻止渲染了0')
                return false
            }
        }
        if( nextProps.files && this.props.files && 
            nextProps.files.filesLastUpdated != this.props.files.filesLastUpdated ){
            //mode不等于0时不组织tree结构
            if( nextProps.files && nextProps.files.common && nextProps.files.common.mode !== 0 ){ 
                log('SidebarFiles----------------shouldComponentUpdate：阻止渲染了1')
                return false
            }
        }
        if( nextProps.checkLastUpdated !== this.props.checkLastUpdated || 
            nextProps.uncheckLastUpdated !== this.props.uncheckLastUpdated ){
            log('树形菜单选择：样式调整不再渲染页面')    
            log('SidebarFiles----------------shouldComponentUpdate：阻止渲染了2')    
            return false
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
        if( nextProps.resize && this.props.resize && nextProps.resize.h !== this.props.resize.h ){
            getmCustomScrollbar2($(".scllorBar_menu"),'update')
        }          
    }
    componentWillUnmount() {      
    }                 
}
SidebarFiles.defaultProps = { 
    inItData: {file_name:MY_COMPUTER, dir: null, path: null, mode: 'drive',IDS: LOCAL_FILE_TOTAL_PANELS}
}
const mapStateToProps = (state) => {
    return {
        route: state.inIt.route,
        subRoute: state.inIt.subRoute,
        routeLastUpdated: state.inIt.routeLastUpdated,

        files: state.files,

        check: state.events.check,
        checkLastUpdated: state.events.checkLastUpdated,

        uncheck: state.events.uncheck,
        uncheckLastUpdated: state.events.uncheckLastUpdated,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated                         
    }
} 
export default connect(
    mapStateToProps
)(immutableRenderDecorator(SidebarFiles))