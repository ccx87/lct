import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import Home from '../Home'
import { FOLDER_EMPTY, MY_COMPUTER } from '../../constants/TextConstant'
import { getFileInitObjectData, getIntervalValue } from '../../constants/ConfigInfo'
import { jqTableCellDom, clientHeight, absVerticalCenter2 } from '../../constants/DomConstant'
import { loadingHtml3, NoDataHtml } from '../../constants/RenderHtmlConstant'
import { deleteFile } from '../../constants/EventsConstant'

import { SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, INCLUDED_ALL, FILE_0_TYPE_ALL, LOCAL_FILE_CONTENT, 
         SHOW_THUMBNAIL_MODE, SHOW_LIST_MODE, SHOW_LOCAL_FOLDER_SCAN_SET,SHOW_PARAMENTER_SETTINGS,
         SMART_MENU_OPEN_DEFAULT,SMART_MENU_COPY,SMART_MENU_PASTE,SMART_MENU_CUT,SMART_MENU_DELETE_FILE,
         SMART_MENU_RENAME, SMART_MENU_NEW, SMART_MENU_NEW_FOLDER, SMART_MENU_OPEN_ROUTE,SMART_MENU_ADD_SCAN,
         SMART_MENU_OPEN_LOCAL,UPDATE_FILE_NAME, FILE_TYPE_VERIFY,INCLUDED_NOHAS,INCLUDED_HAS,INCLUDED_FAIL,
         INCLUDED_NOT,INCLUDED_IGNORE,SMART_MENU_REFRESH,PERMANENT_DELECTE_FILE } from '../../constants/TodoFilters'

import { GET_FILE_INCLUDED, FILE_FORMAT_ICONS, FILE_INCLUDED, FILE_0_TYPE, GET_FILE_0_TYPE, 
         SMART_MENU } from '../../constants/DataConstant'

import { isEmpty,objClone,getFontState,log,hasClass,addClass,removeClass,formatSize,getMousePos, 
         getmCustomScrollbar2,getmCustomScrollbar3,getNavigation,addArrayObj,addArray,getNewRoute,
         pullArea, routesBackLocal, getEncodeURIComponentPath, getCss } from '../../constants/UtilConstant'
import { getListOffset, listEquqlBCdrag, getTextMsg, selectLiItem } from '../../constants/InItConstant'
import Perf from 'react-addons-perf'
const doc = document,
      dbody = doc.body;
let smartItem = false, //鼠标右键是否激活
    ctrlKey = false, //ctrl键是否按住
    shiftKey = false, //shift键是否按住
    shiftIndex = -1, //shift第一次选中的下标，默认值为-1
    activees = false, //是否多个文件被选中
    newFolder = false; //是否在新建文件夹
class FileListTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		checkAll: false,
    		changeFile: false,
    		filterIncluded: FILE_INCLUDED[0],
    		filterFileType: FILE_0_TYPE[0],
            keyData: null,
            clickTime: null,
            keyEventAll: false,
            mouseArea: false,
            reName: false
    	};
        this.eventsKeyDown = this.eventsKeyDown.bind(this)
        this.eventsKeyUp = this.eventsKeyUp.bind(this)
        this._oneBodyClick = this._oneBodyClick.bind(this)       
    	log("FileListTable");		
	}
    GlobalActiveesFn(temp) {
        activees = temp
    }
    inItGetFileData(route,displayMode,pullload) {
        //初始化列表数据
        if( route && route.data ){
            this.asyncGetFileList(route,displayMode,pullload)
        }        
    }   
    asyncGetFileList(route,displayMode,pullload){
        const data = objClone(getFileInitObjectData),
              fetch_size = getListOffset(displayMode, doc.getElementById('client_height_1'), doc.querySelector('.bottom-bar .silder-drag-btn')),
              fi = this.state.filterIncluded,
              files = this.props.files;
        if( fetch_size > 0 ){      
            data.fetch_size = fetch_size
        }  
        if( fi && fi.value > 0 ){
            data.get_filter = fi.value
        }else{
            if( route.data.get_filter ){
                data.get_filter = route.data.get_filter                
            }
        }  
        if( route.data.sort_type != null ){
            data.sort_type = route.data.sort_type
        }
        if( route.data.b_asec != null ){
            data.b_asec = route.data.b_asec
        }
        if( files && files.common ){ 
            if( pullload != null && pullload ) {
                data.pull_load = pullload
                data.offset = files.common.offset + 1
            } else {
                data.pull_load = false
                data.offset = 0
            } 
        }
        if( route.data.is_refresh != null ){
            if( data.offset == 0 ){
                data.is_refresh = route.data.is_refresh
            }else{
                data.is_refresh = false;
            }
        }  
        data['dm'] = displayMode;      
        data.mode = 1;
        data.dir = route.data.path;
        if( route.data.mode == 'search' ){
            //搜索请求
            data['search'] = route.data.file_name;
            setTimeout(() => {              
                this.props.actionsLF.asyncsearchFileByTextRequest(data) 
            },30)
        } else{ 
            //正常路径下请求               
            setTimeout(() => {
                this.props.actionsLF.asyncgetFileRequest(data)
            },30)
        }
    }   	
    moveEnterLayer(event){
    	const element = event.currentTarget.querySelector('.leyer-panel');
        element && element.classList.add('show');
    }
    moveLeaveLayer(event){
    	const element = event.currentTarget.querySelector('.leyer-panel');
        element && element.classList.remove('show');
    } 
    routesFileBtn(elem, event){
        const isFocus = $('#update_file_name').is(':focus');
        if( !isFocus ){ 
            clearTimeout(this.state.clickTime);       
            elem['IDS'] = LOCAL_FILE_CONTENT;
            const navData = getNavigation(this.props.route, elem); 
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
            this.props.actions.getInItRoute(data); 
        }       
    } 
    stateKeyData(item, diff) {
        let num = 0, msgData = null, sizes = 0, lens = 0;
        const files = this.props.files,
              activeDom = $('.file-list-table').find('.file-item.active'); 
        log('选中的列表个数：'+activeDom.length)         
        if( files && files.filesData && files.filesData.total ) {
            if( diff ) files.filesData.total = files.filesData.total - diff;
            num = files.filesData.total >= 0 ? files.filesData.total : num;
        }                  
        if( ctrlKey || shiftKey || this.state.mouseArea ){
            activeDom.each((inex,ad) => {
                const isfile = $(ad).data('isfile'),
                      size = parseInt($(ad).data('size'));
                if( !isfile ){
                    sizes = null
                    return false
                }
                sizes += size
            })
        }else{
            if( item ) sizes = parseInt(item.file_size); 
        }
        if( activeDom.length > 0 ){
            lens = activeDom.length;
            this.GlobalActiveesFn(lens > 1 ? true : false)
        } 
        //通知底部显示选中的信息
        log('-----stateKeyData ===>getTextMsg=====>fileInfoMessage -----')
        msgData = getTextMsg(num, lens, sizes)         
        this.props.actions.fileInfoMessage(msgData);  
        this.setState({keyData: item})
    }  
    shfitSelectItem(frist, last) {
        //shfit后样式调整
        if( isEmpty(frist) || isEmpty(last) ){
            log('shfit后样式调整----参数错误')
            return false
        }
        const $elem = $('.file-list-table').find('.file-item')
        selectLiItem()
        this.eventsKeyUp()
        this.GlobalActiveesFn(false)        
        log('shfitSelectItem---清除样式')
        if( frist < last ){
            log('shift向下连接')
            $elem.each((index,elem) => {
                if( index >= frist && index <= last ){
                    $(elem).addClass('active')
                } 
            })
        }else{
            log('shift向上连接')
            $elem.each((index,elem) => {
                if( index >= last && index <= frist ){
                    $(elem).addClass('active')
                } 
            })
        }
    }       
    fileInfoDetail(item, event){
        if( this.state.reName ){
            //此时是在重命名
            return;
        }
        if( item && this.state.keyData && item.path !== this.state.keyData.path ){
            const ufnDom = doc.getElementById('update_file_name');
            if( ufnDom ){
                $(ufnDom).blur()
                this.updateFileName(this.state.keyData)
                this.state.reName = false
                return false
            } 
        }   
        if( event ){
            if( !ctrlKey && !shiftKey && !activees ){
                log('fileInfoDetail---先清除焦点样式，再添加当前event样式')
                selectLiItem()
                this.eventsKeyUp()
                this.GlobalActiveesFn(false)                
                const ct = event.target;    
                if( $(ct).hasClass('file-item') ){
                    $(ct).addClass('active default') 
                }else if( $(ct).closest('.file-item').length > 0 ) {
                    $(ct).closest('.file-item').addClass('active default')
                }    
            }
        }
        clearTimeout(this.state.clickTime)
        this.state.clickTime = setTimeout(() => {
            log('-----fileInfoDetail ==时间差=>stateKeyData-----')
            //放里面是双击时不会触发底部信息修改。
            this.stateKeyData(item)            
            if( item && item.is_file && item.path ) {
                //同时再请求一次这接口是为了获取文件属性和颜色通道等数据
                setTimeout(() => {
                    this.props.actionsLF.asyncgetDocsInfoRequest(item.path); 
                },20)
            }
            this.props.actions.getAttributes(item)
        },200)            
    } 
    filterIncluded(item, event){
        //文件状态过滤
        this.setState({
        	filterIncluded: item
        })
    	const element = event.currentTarget.parentNode,
              data = {
                  route: this.props.route
              };        
        this.props.actions.getInItRoute(data);
        element && element.classList.remove('show');
    } 
    filterFileType(item, event){
        this.setState({
        	filterFileType: item
        })
    	const element = event.currentTarget.parentNode;
        element && element.classList.remove('show');   	
		//清除滚动条,等待加载时样式还原
		if( $(".scllorBar_commonList").length > 0 ){
            getmCustomScrollbar2($(".scllorBar_commonList"), "destroy")
		}	             
    }   
    changeDefaultItemStyle(temp) {
        const $li_elem = $('.file-list-table').find('.file-item'),
              li_len = $li_elem.length - 1,
              allFiles = this.props.files.allFiles;
        let has_active = false;  
        //列表正常顺序模式
        if( this.state.keyEventAll ){
            this._ctrlA(false) //处理键盘全选事件
        }        
        if( $li_elem.length > 0 ){
            $li_elem.each((indexLi, elemLi) => {
                if( $(elemLi).hasClass('active') || $(elemLi).hasClass('default') ){
                    has_active = true
                    if( temp == 1 ){
                        if( indexLi != 0 ){
                            selectLiItem()
                            this.eventsKeyUp()
                            this.GlobalActiveesFn(false)                            
                            $li_elem.eq(indexLi-1).addClass('active default');
                            if( allFiles.length > 0 ){
                                //选中并显示属性预览
                                this.fileInfoDetail(allFiles[indexLi-1])
                            }                            
                        }
                    }else if( temp == 2 ){
                        if( indexLi != li_len ){
                            selectLiItem()
                            this.eventsKeyUp()
                            this.GlobalActiveesFn(false)                            
                            $li_elem.eq(indexLi+1).addClass('active default');
                            if( allFiles.length > 0 ){
                                this.fileInfoDetail(allFiles[indexLi+1])
                            }                             
                        }                       
                    }
                    return false
                }
            })
        }         
        if( !has_active && temp == 2 ){
            if( $li_elem.length > 0 ){
                $li_elem.eq(0).addClass('active default')                 
            }
            if( allFiles.length > 0 ){
                this.fileInfoDetail(allFiles[0])                
            }                        
        }
    }
    changeThumbnailItemStyle(temp) {
        const $a_elem = $('.file-list-table').find('.file-item'),
              parWidth = $a_elem.eq(0).parent().width(),
              aWidth = $a_elem.eq(0).outerWidth(true),
              rowNum = Math.floor(parWidth/aWidth),
              a_len = $a_elem.length - 1,
              allFiles = this.props.files.allFiles;
        let has_active = false; 
        //缩略图上下模式
        if( this.state.keyEventAll ){
            this._ctrlA(false) //处理键盘全选事件
        }        
        if( $a_elem.length > 0 ){
            $a_elem.each((indexA, elemA) => {
                if( $(elemA).hasClass('active') || $(elemA).hasClass('default') ){
                    has_active = true
                    if( temp == 1 ){
                        if( indexA >= rowNum ){
                            selectLiItem()
                            this.eventsKeyUp()
                            this.GlobalActiveesFn(false)                            
                            $a_elem.eq(indexA-rowNum).addClass('active default');
                            if( allFiles.length > 0 ){
                                this.fileInfoDetail(allFiles[indexA-rowNum])                                
                            }                             
                        }
                    }else if( temp == 2 ){
                        if( a_len >= rowNum ){
                            const followElem = $a_elem.eq(indexA+rowNum);
                            selectLiItem()
                            this.eventsKeyUp()
                            this.GlobalActiveesFn(false)                            
                            if( followElem.length > 0 ){
                                $a_elem.eq(indexA+rowNum).addClass('active default')
                                if( allFiles.length > 0 ){
                                    this.fileInfoDetail(allFiles[indexA+rowNum])                                     
                                }                             
                            }else{
                                $a_elem.eq(a_len).addClass('active default')
                                if( allFiles.length > 0 ){
                                    this.fileInfoDetail(allFiles[a_len]) 
                                }
                            }
                        }
                    }                   
                    return false                    
                }
            })
        }         
        if( !has_active && temp == 2 ){
            if( $a_elem.length > 0 ){
                $a_elem.eq(0).addClass('active default')
            }
            if( allFiles.length > 0 ){
                this.fileInfoDetail(allFiles[0])                
            }                        
        }                       
    }
    routesBackLocal() {//返回上一级文件夹
        const route = this.props.route,
              newpath = routesBackLocal(route),
              data = getNewRoute(route,newpath);
        this.props.actions.getInItRoute(data); 
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
    showSet(event){
        event.stopPropagation();
        event.preventDefault();
        if( !this.loginPoint() ){
            return false
        }        
        this.props.actions.triggerDialogInfo({type: SHOW_LOCAL_FOLDER_SCAN_SET, filter: SHOW_PARAMENTER_SETTINGS})       
    }  
    openScanDocsImage(item, temp) {    
        const isFocus = $('#update_file_name').is(':focus');
        if( !isFocus ){
            //双击打开电脑默认看图软件
            clearTimeout(this.state.clickTime);
            try{
                if( item && item.is_file ){
                    if( temp == 1 ){
                        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getPreviewRequset', {org_path: item.path}); 
                    }else{
                        window.openScanDocsImageRequest(item.path) 
                    }
                }
            }catch(e){} 
        }
        return false    
    } 
    getInputHideObj(parDom){
        let data = {};
        try{
            data = $.parseJSON(parDom.querySelector('input[type=hidden]').value);
        }catch(e){}                         
        return data
    } 
    updateFileName(item, event){
        //修改文件名称--重命名
        if( !item || !item.file_name ){
            return false
        }
        let itemDom = null;
        if( event ){
            itemDom = event.currentTarget;             
        } else{
            const ufnDom = doc.getElementById('update_file_name');
            if( ufnDom ){
                itemDom = ufnDom.parentNode;
            }else{
                const $elem = $('.file-list-table').find('.file-item.active');
                $elem.each((index,elem) => {
                    let path = null;
                    const oldpath = elem.getAttribute('data-oldpath');
                    if( isEmpty(oldpath) ){
                        path = elem.getAttribute('data-path')
                    }else{
                        path = oldpath
                    }
                    log('列表路径'+path)
                    log('修改路径'+item.path)
                    if( path === item.path ){
                        elem.removeAttribute('data-oldpath')
                        itemDom = $(elem).find('.fi-name').get(0);
                        return false
                    }
                })
            }
        }
        if( itemDom ){
            const parDom = itemDom.parentNode.parentNode,
                  inputDom = itemDom.querySelector('#update_file_name'),
                  textDom = itemDom.querySelector('.name-text'),
                  hiddenDom = parDom.querySelector('input[type=hidden]'),
                  parIndex = parseInt(parDom.getAttribute('data-index')),
                  keyData = this.state.keyData;
            if( inputDom ){
                const isFocus = $(inputDom).is(':focus');      
                if( !isFocus ){ //未获得焦点
                    let idVal = inputDom.value,
                        $elem = $('.file-list-table').find('.file-item');   
                    if( isEmpty(idVal) ){
                        //删除input框 初始化列表
                        $(inputDom).remove()
                        textDom.style.display = 'block'
                        log('文件名为空，则还原文件名===selectLiItem==初始化样式')
                        return false                        
                    }      
                    if( idVal == '.'+ item.file_type ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "必须键入文件名",auto: true,speed: 2000,statu: 0})
                        $(inputDom).remove()
                        textDom.style.display = 'block'
                        log('必须键入文件名===selectLiItem==初始化样式')
                        return false 
                    }      
                    const inputHideObj = this.getInputHideObj(parDom)
                    if( idVal == inputHideObj.file_name && !newFolder ){
                        $(inputDom).remove()
                        textDom.style.display = 'block'
                        log('相同文件名===selectLiItem==初始化样式')
                        return false
                    } 
                    let hasPath = false,
                        cnum = 1,
                        reg = /\((.+?)\)/, //正则--获取最后一个小括号和里面的内容
                        regtype = /\.(\w+)$/, //正则--获取最后一个后缀
                        error = false,
                        lastType = null,
                        thisType = item.file_type;     
                    if( item.is_file ){ 
                        //是文件的时候判断其后缀名    
                        const typeArr = idVal.match(regtype);
                        lastType = typeArr ? typeArr[typeArr.length-1] : null;
                        if( lastType ){
                            lastType = lastType.toLowerCase()
                        }
                        if( thisType ){
                            thisType = thisType.toLowerCase()
                        }
                        if( !item.DownExe && lastType != thisType ){
                            this.props.actions.triggerDialogInfo({
                                type: SHOW_DIALOG_CONFIRM,
                                title: '重命名',
                                text: '如果改变文件扩展名，可能会导致文件不可用。',
                                textMsg: '确定要更改吗？',
                                code: FILE_TYPE_VERIFY,
                                elem: {inputDom: $(inputDom),textDom: $(textDom), hiddenDom: $(hiddenDom)},
                                _this: this,
                                codeData: {item:item}
                            })
                            //reName表示正在重命名判断
                            //true为锁死右键菜单和点击其它地方触发fileInfoDetail方法，防止页面卡死
                            this.state.reName = true
                            return;                        
                        }
                    }
                    if( $elem.length > 0 ){
                        $elem.each((index, el) => {
                            //跳过隐藏列表
                            if( $(el).is(':hidden') ){
                                return true
                            }
                            //跳过本身
                            if( $(el).hasClass('active') && $(el).closest('.page-item.new-dom').length > 0 ){
                                return true
                            } 
                            //检查是否有重名
                            let data = null;
                            try{
                                data = this.getInputHideObj(el);
                                if( idVal == data.file_name && index != parIndex ){
                                    hasPath = true
                                    const arr = data.file_name.match(reg);
                                    if( arr && arr.constructor == Array && arr.length > 0 ){
                                        const last = parseInt(arr[arr.length-1])
                                        cnum = last + cnum
                                    }
                                    return false  
                                }
                            }catch(e){error=true}
                        }) 
                        if( error ){
                            this.state.reName = false;
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '检测重名时出错',auto: true,speed:1500,statu: 0})
                            return false
                        }  
                    } 
                    let routePath = this.props.route.data.path,
                        newPath = routePath +'\\'+ idVal;  
                    if( hasPath ){
                        this.state.reName = true
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '该目录有相同文件名',auto: true,speed:1500,statu: 0})
                        if( this.state.keyData ){
                            textDom.innerHTML = this.state.keyData.file_name
                        }
                        inputDom.focus();
                        return false
                    }else{
                        //文件重命名 ---- 无重名的时候
                        try{
                            let result;                           
                            if( newFolder ){
                                //新建文件夹
                                result = window.createNewFolder(routePath, idVal)
                                log('调用新建文件夹接口')
                                log(routePath)
                                log(idVal)
                            }else{
                                //重命名
                                const oldPath = parDom.getAttribute('data-path')
                                result = window.renameData(oldPath, newPath);
                                log('调用重命名接口')
                                log(oldPath)
                                log(newPath)
                            }
                            log('修改文件名或新建文件夹回调：')
                            const json_result = $.parseJSON(result);
                            log(json_result)
                            if( !json_result.is_success ){
                                if( newFolder ){
                                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '新建文件夹失败',auto: true,speed:1500,statu: 0})
                                    $('.page-item.new-dom').remove();
                                    newFolder = false;
                                }else{
                                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '重命名失败',auto: true,speed:1500,statu: 0})
                                }
                            } else{                           
                                log('无重名时----修改文件名成功')
                                textDom.innerHTML = idVal
                                if( newFolder ){
                                    //记录旧路径，用于事件绑定处理路径时在没有刷新的情况下路径相等的问题
                                    const itempath = parDom.getAttribute('data-path')
                                    parDom.setAttribute('data-oldpath', itempath)
                                    newFolder = false;
                                    if( json_result.data && json_result.data.constructor == Array && json_result.data.length > 0
                                        && !isEmpty(json_result.data[0]) && json_result.data[0].constructor == Object ){
                                        item = json_result.data[0]
                                        this.state.keyData = json_result.data[0]
                                        if( parDom.querySelector('.file-time-item') ){
                                            parDom.querySelector('.file-time-item').innerHTML = json_result.data[0].operate_time
                                        }                                        
                                    } 
                                    //通知底部修改总项目数
                                    this.props.files.filesData.total += 1;
                                    log('-----updateFileName ===>stateKeyData-----')
                                    this.stateKeyData(this.state.keyData)
                                }
                                if( this.state.keyData ){
                                    //赋值一处
                                    item.file_name = idVal;
                                    item.path = newPath;
                                    this.state.keyData.file_name = idVal;
                                    this.state.keyData.path = newPath;
                                    if( lastType ){
                                        item.file_type = lastType
                                        this.state.keyData.file_type = lastType;
                                    }
                                    if( this.state.keyData.thumb_image && this.state.keyData.thumb_image.constructor == Object ){
                                        if( item.thumb_image ){
                                            item.thumb_image.file_name = idVal
                                        }
                                        this.state.keyData.thumb_image.file_name = idVal
                                    }
                                }
                                if( $(hiddenDom).length > 0 ){
                                    try{
                                        //赋值二处
                                        const hVal = $.parseJSON($(hiddenDom).val());
                                        hVal.file_name = idVal;
                                        if( lastType ){
                                            hVal.file_type = lastType;
                                        }
                                        $(hiddenDom).val(JSON.stringify(hVal))
                                    }catch(e){}
                                }
                                if( parDom ){
                                    //赋值三处
                                    parDom.setAttribute('data-path', newPath)
                                } 
                                if( item.is_file ){
                                    //刷新右侧属性栏
                                    this.fileInfoDetail(this.state.keyData)
                                }                                 
                            }                                                       
                        }catch(e){                                        
                            if( newFolder ){
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '新建文件夹失败',auto: true,speed:1500,statu: 0})
                                $('.page-item.new-dom').remove();
                                newFolder = false;
                            }else{
                                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '重命名失败',auto: true,speed:1500,statu: 0})
                            }
                        } 
                        //重命名流程结束---初始化列表
                        $(inputDom).remove();
                        textDom.style.display = 'block'                                    
                    }
                }
                return false 
            } 
            //创建input
            if( parDom && ((keyData && keyData.path === item.path) || !keyData) ){
                if( $('.update_file_name').length > 0 ){
                    $('.update_file_name').remove()
                }
                const inputHideObj = this.getInputHideObj(parDom);             
                const twidth = textDom.offsetWidth + 20; //增长10px
                textDom.style.display = 'none';
                const createDom = doc.createElement("input");
                createDom.type = 'text';
                createDom.id = 'update_file_name';
                createDom.className = 'update_file_name';
                createDom.value = inputHideObj.file_name;
                createDom.style.width = twidth +'px';
                itemDom.appendChild(createDom);
                createDom.focus();
                createDom.select();
                createDom.addEventListener('click', (event) => {
                    log('触发input事件-------')
                    event.preventDefault();
                    event.stopPropagation(); 
                }, false)
            }
        }           
    }
    renderCreateNewFolder() {
        try{
            const nodataDom = doc.getElementById('no_data_msg'),
                  $elem = $('.file-list-table').find('.file-item');
            if( nodataDom ){
                $(nodataDom).closest('.page-item.data-dom').remove();
            }
            let fileName = '新建文件夹';
            const target = this;
            function verNameFn(file_name) {
                $elem.each((index, el) => {
                    if( $(el).is(':hidden') ){
                        return true
                    }                     
                    //检查是否有重名
                    const data = target.getInputHideObj(el);
                    if( file_name == data.file_name ){
                        fileName += ' - 副本'
                        verNameFn(fileName)
                        return false  
                    }
                })
            }
            verNameFn(fileName);
            const route = this.props.route.data,
                  dm = this.props.displayMode,
                  num = this.props.files.filesData.total,
                  data = [{
                    error: '',
                    error_code: 0,
                    file_name: fileName,
                    file_prop: 0,
                    file_scan_num: '0',
                    file_scan_sync_flag: 0,
                    file_size: '0',
                    file_size_max: '0',
                    file_type: '',
                    is_empty: true,
                    is_file: false,
                    is_hidden: false,
                    is_modify: false,
                    operate_time: '',
                    operate_time_value: '',
                    path: route.path +'\\'+ fileName,
                    thumb_image: '',
                    volume_name: '',          
                }]; 
            //全局变量newFolder起到特殊事件时处理    
            newFolder = true;
            this.renderNewData(dm, false, num, data)
            //创建新文件夹时定位是列表底部，所以当有滚动条时要对焦到底部去
            if( $('.scllorBar_commonList.mCustomScrollbar').length > 0 ){
                $('.scllorBar_commonList').mCustomScrollbar('scrollTo','bottom', { moveDragger:true })                 
            }            
        }catch(e){this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "新建文件夹失败",auto: true,speed: 1500,statu: 0})}
    }    
    openFileLocal(path, event) {
        event.stopPropagation();
        event.preventDefault();
        try{
            window.openFileRequest(2, path) 
        }catch(e){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "打开文件(夹)位置失败",auto: true,speed: 1500,statu: 0})
        }        
    }
    renderFileInfoLayer(item) { 
        return <div className="abs leyer-panel col-0 info-msg layer-info-msg">
                   <span className="top-arrow"><i className="top-arrow1"></i><i className="top-arrow2"></i></span> 
                   <span className="layer-title">{item.file_name ? item.file_name : '--'}</span>
                   <dl className="layer-content">
                        <dt>路径：</dt> 
                        <dd className="col-lan lc-path"
                           onClick={item.path ? this.openFileLocal.bind(this, item.path) : null}>
                           {item.path ? item.path : '--'}
                        </dd>
                        <dt>扫描时间：</dt> 
                        <dd className="col-9">{item.included_time ? item.included_time : '--'}</dd>
                        <dt>文件大小：</dt> 
                        <dd className="col-9">{!isEmpty(item.file_size) ? formatSize(item.file_size) : '--'}</dd>                                                                                        
                   </dl>  
               </div> 
    } 
    renderFailMsgLayer(msg) {
        if( !isEmpty(msg) ){
            return <span className="abs leyer-panel fail-msg layer-text-msg">
                       {msg}
                   </span> 
        }  
        return null                             
    }  
    renderSpanDomStatu(statu, text, col, msg, icons) {
        const classes = 'includ flex flex-c '+ col;
        return (
            statu ?
                <span className={classes}>{text}</span>
            :
                <span className={classes} 
                   onMouseEnter={this.moveEnterLayer.bind(this)}
                   onMouseLeave={this.moveLeaveLayer.bind(this)}>
                   {text}
                   {icons ? <i className="shitu-icon icons-20 select-prob"></i> : null}
                   {this.renderFailMsgLayer(msg)}
                </span>                   
        )
    }  
    renderItemScanResult(item) {
        //文件列表扫描后的状态解析
        if( item && item.file_scan_sync_flag != 0 && item.file_scan_sync_flag != 15 && isEmpty(item.error) ){
            switch(item.file_scan_sync_flag){
                case 1:
                    //失败--预览图生成失败
                    item.error = '预览图生成失败，请点击 “开始扫描” 重新扫描'                
                break;
                case 2:
                    //完成--预览图生成ok但未上传的情况
                    item.error = '正在上传预览图...'                
                break;
                case 5:
                    //失败--的情况
                    item.error = '未知错误(代码：'+ item.error_code +')'                
                break;
                case 10:
                    //完成--预览图生成ok已上传但还未获取识图信息
                    item.error = '正在获取识图信息...'                 
                break;
                case 20:
                    //失败--违规的情况
                    item.error = '该文件涉嫌违规类文件'                
                break;
                case 25:
                    //失败--获取识图信息失败（因为服务没有数据），此种错误，需要重新上传预览图。
                    item.error = '获取识图信息失败，请点击 “开始扫描” 重新上传预览图' 
                break;
                default:
                    //失败--状态码不在定义范围内
                    item.error = '未知错误(代码：'+ item.file_scan_sync_flag +')'                     
                break;
            }
        }
        return (
            item.file_scan_sync_flag == 0 ?
                null
            :
            item.file_scan_sync_flag == 15 ?
                this.renderSpanDomStatu(true, '完成', 'col-lan')
            :
            item.file_scan_sync_flag == 1 || item.file_scan_sync_flag == 5 || item.file_scan_sync_flag == 25 ?
                item.is_skipped_error ?
                    this.renderSpanDomStatu(false, '忽略', 'col-6', item.error)
                :
                    this.renderSpanDomStatu(false, '失败', 'col-red', item.error)    
            :    
            item.file_scan_sync_flag == 10 || item.file_scan_sync_flag == 2 ?
                item.error_code === 0 ?
                    this.renderSpanDomStatu(false, '未完成', 'col-red', item.error, true)
                :
                    this.renderSpanDomStatu(false, '失败', 'col-red', item.error)     
            :
            item.file_scan_sync_flag == 20 ?
                this.renderSpanDomStatu(false, '问题文件', 'col-red', item.error)                                                           
            :   
                this.renderSpanDomStatu(true, '获取状态失败', 'col-6', item.error)              
        )
    }
    renderListMode(data, pl) {
        const route = this.props.route,
              routepath = route && route.data ? route.data.path : null;
        if( data && data.constructor == Array ){
            const lastDom = $('.page-item.data-dom').find('.file-item').last();
            let _index = 0;     
            if( lastDom.length > 0){
               _index = lastDom.data('index') + 1
            }
            return <ul key={routepath} className="list-mode" data-path={routepath}
                       onMouseDown={this.smartMenuPanel.bind(this)}> 
                    {
                        data.map((item, index) => {
                            const img_src = getEncodeURIComponentPath(item)
                            return  <li key={item.path} data-index={_index+index} data-isscan={item.file_scan_sync_flag} data-size={item.file_size} 
                                        data-isfile={item.is_file} data-path={item.path} className="flex col-column flex-c file-item"
                                        onClick={this.fileInfoDetail.bind(this,item)}
                                        onMouseDown={this.keyboardEvent.bind(this, item)}
                                        onDoubleClick={!item.is_file ? this.routesFileBtn.bind(this,item) : this.openScanDocsImage.bind(this,item,2)}>
                                        <input type="hidden" value={'{"file_name":"'+ item.file_name +'","file_prop":'+ item.file_prop +',"is_file":'+ item.is_file +',"file_type":"'+ item.file_type +'"}'} />
                                        <span className="col-c-2 flex flex-c flex-item-gsb-1 file-name-item left-5">
                                            {
                                                item.is_file ? 
                                                    <span className="flex flex-c flex-c-c flex-item-gsb-0 file-img"
                                                        onMouseEnter={this.moveEnterLayer.bind(this)}
                                                        onMouseLeave={this.moveLeaveLayer.bind(this)}
                                                        onMouseDown={this.smartMenuItem.bind(this, item)}>
                                                        <img alt={item.file_name} src={img_src}/>
                                                        {this.renderFileInfoLayer(item)}
                                                    </span>                                                                                
                                                :
                                                    <span className="flex flex-c flex-c-c flex-item-gsb-0 file-img"
                                                        onMouseDown={this.smartMenuItem.bind(this, item)}>
                                                        <img alt={item.file_name} src={img_src}/>
                                                    </span>                                                                                                                                                    
                                            }
                                            <span className="col-0 fi-name left-m-5"
                                                onMouseDown={this.smartMenuItem.bind(this, item)}>
                                                <span className="name-text">{item.file_name}</span>
                                            </span>
                                            <span className="fi-fn flex-in left-m-15" style={{"display":"none"}}>
                                                <i className="icons-local-material icons-20 fn-tag left-m-5"></i>
                                            </span>
                                        </span>
                                        <span className="col-c-3 left-10 file-statu-item flex-item-gsb-0"
                                            onMouseDown={this.smartMenuItem.bind(this, item)}>
                                            {item.is_file ? this.renderItemScanResult(item) : null}
                                        </span>                                         
                                        <span className="col-c-5 left-10 file-time-item flex-item-gsb-0"
                                             onMouseDown={this.smartMenuItem.bind(this, item)}>
                                             {item.operate_time ? item.operate_time : '--'}
                                        </span>                        
                                    </li>                                   
                        })
                    }                                                                                                                                                                       
                  </ul> 
        }
        return  this.renderNoData()                       
    } 
    renderThumbnailMode(data, pl) {
        const route = this.props.route,
              routepath = route && route.data ? route.data.path : null;        
        if( data && data.constructor == Array ){
            const lastDom = $('.page-item.data-dom').find('.file-item').last();
            let _index = 0;     
            if( lastDom.length > 0){
               _index = lastDom.data('index') + 1
            }            
            return <div key={routepath} className="thumbnail-mode" data-path={routepath}
                        onMouseDown={this.smartMenuPanel.bind(this)}>
                    {
                        data.map((item, index) => {
                            const img_src = getEncodeURIComponentPath(item)
                            return  <a key={item.path} data-index={_index+index} 
                                       data-isscan={item.file_scan_sync_flag} data-isfile={item.is_file} 
                                        data-path={item.path} className="flex-in flex-c flex-c-c flex-dir-column file-item"
                                        data-size={item.file_size}
                                        onMouseDown={this.keyboardEvent.bind(this, item)}
                                        onClick={this.fileInfoDetail.bind(this,item)}
                                        onDoubleClick={!item.is_file ? this.routesFileBtn.bind(this,item) : this.openScanDocsImage.bind(this,item,2)}>
                                        <input type="hidden" value={'{"file_name":"'+ item.file_name +'","file_prop":'+ item.file_prop +',"is_file":'+ item.is_file +',"file_type":"'+ item.file_type +'"}'} />                                                                 
                                        <span className="flex flex-c flex-c-c flex-item-gsb-1 file-img"
                                            onMouseDown={this.smartMenuItem.bind(this, item)}>
                                            <img alt={item.file_name} src={img_src}/>                                            
                                        </span>
                                        <span className="file-name flex flex-c flex-item-gsb-0 flex-c-c"
                                            onMouseDown={this.smartMenuItem.bind(this, item)}>
                                            <span className="text-of fi-name col-0">
                                                <span className="name-text">{item.file_name}</span>
                                            </span>    
                                        </span>
                                    </a>

                        })                                                   
                    }                                            
                    </div>
        }
        return  this.renderNoData()             
    }
    renderModeNoLoad() {
        return  <div className="no-data abs" id="no_data_msg">
                  <div className="center">
                      <i className="img-files-bg icons-80"></i>
                      <p className="no-data-text col-9">
                         该显示模式无法加载文件
                      </p>
                  </div>
                </div>        
    } 
    renderNoDataShowMsg(msg, temp) {
        return  <p className="no-data-text col-9">
                   {msg}
                   {temp ? <a className="col-lan" onClick={this.showSet.bind(this)}> 设置</a> : null}
                </p>
    }
    renderNoData() {
        const filter = this.state.filterIncluded.filter;
        return <div className="no-data abs" id="no_data_msg">
                  <div className="center">
                      <i className="img-files-bg icons-80"></i>
                      {
                          filter === INCLUDED_NOHAS ?
                              this.renderNoDataShowMsg('该文件夹（分区）内没有已扫描且还未更新到链图云的文件')
                          :
                          filter === INCLUDED_HAS ?
                              this.renderNoDataShowMsg('该文件夹（分区）内没有已扫描的文件')
                          :
                          filter === INCLUDED_FAIL ?
                              this.renderNoDataShowMsg('该文件夹（分区）内没有扫描失败的文件')
                          :
                          filter === INCLUDED_NOT ?
                              this.renderNoDataShowMsg('该文件夹（分区）内没有问题文件')
                          :
                          filter === INCLUDED_IGNORE ?
                              this.renderNoDataShowMsg('该文件夹（分区）内没有忽略文件')
                          :
                              this.renderNoDataShowMsg('该文件夹（分区）内没有可预览文件', 'set')                                                           
                      }
                  </div>
                </div>        
    } 
    renderErrorData() {
        const route = this.props.route ? this.props.route.data : {}
        return <div className="no-data abs" id="no_data_msg">
                  <div className="center">
                      <i className="img-files-bg icons-80"></i>
                      <p className="no-data-text col-9">
                          数据读取错误，请重新 <a className="col-lan" onClick={this.routesFileBtn.bind(this, route)}>刷新</a>
                      </p>
                  </div>
                </div>         
    }
    renderWaitDom() {
        return <div className="page-item wait-dom">{loadingHtml3('加载文件中，请稍候...')}</div>
    } 	
    renderNewData(dm, pl, num, fileData) {
        let renderPanDom = null,
            renderDom = null;
        if( isEmpty(dm) ){
            dm = SHOW_LIST_MODE 
        }else{                     
            renderPanDom = doc.getElementById(dm)
            if( !renderPanDom ){
                renderPanDom = doc.querySelector('.file-list-table .table-mode');
            }
        }        
        if( renderPanDom ){
           renderDom = renderPanDom.lastChild
        }
        if( arguments.length == 0 ){
            if( renderDom ){
                log('==============================')
                log('=                            =')
                log('=      渲染列表数据错误1     =')
                log('=                            =')
                log('==============================')
                $(renderDom).empty();
                $(renderDom).siblings('.page-item').remove();
                render(this.renderErrorData(),renderDom);
            }
            return false
        }               
        try{
            if( !pl ) {       
                log('-----renderNewData ===>getTextMsg=====>fileInfoMessage -----')
                //更新底部栏信息 
                this.GlobalActiveesFn(false);            
                const msgData = getTextMsg(num); 
                this.props.actions.fileInfoMessage(msgData) 
            }
            if( renderDom ){
                if( !fileData && pl ) {
                    $(renderDom).empty()
                } else {
                    if( hasClass(renderDom, 'wait-dom') ){
                        //判断一下page-item里面是否有其它特殊显示(错误显示、空数据显示...)
                        const pageitemDom = $(renderDom).siblings('.page-item');
                        pageitemDom.each((index, elem) => {
                            if( $(elem).find('#no_data_msg').length > 0 ){
                                $(elem).remove();
                            }
                        })
                        //清空一下当前装载数据的容器
                        $(renderDom).empty()
                        //fileData[0]每次新建时数组里只有一条数据
                        if( newFolder && fileData.length == 1 ){
                            $(renderDom).removeClass('wait-dom').addClass('data-dom new-dom')
                            if( dm === SHOW_LIST_MODE ){
                                render(this.renderListMode(fileData, pl), renderDom)
                            }else{
                                render(this.renderThumbnailMode(fileData, pl), renderDom)
                            }
                            selectLiItem()
                            this.eventsKeyUp()
                            this.GlobalActiveesFn(false)
                            $(renderDom).find('.file-item').addClass('active')
                            listEquqlBCdrag(this.props.displayMode, $(renderDom).find('.file-item'), $('.bottom-bar').find('.silder-drag-btn'))
                            this.state.keyData = fileData[0]
                            this.updateFileName(fileData[0])
                        }else{
                            $(renderDom).removeClass('wait-dom').addClass('data-dom')
                            if( dm === SHOW_LIST_MODE ){
                                render(this.renderListMode(fileData, pl), renderDom)
                            }else{
                                render(this.renderThumbnailMode(fileData, pl), renderDom)
                            }                                                         
                        }                       
                        const rid = $(renderDom).data('reactid'),
                              ridarray = rid.split('.'),
                              len = ridarray.length,
                              lastVal = parseInt(ridarray[len-1]);
                        if( lastVal >= 0 ){      
                            ridarray[len-1] = lastVal + 1 
                        } else {
                            ridarray[len-1] = ridarray[len-1]+'.0'
                        }
                        $(renderDom).after(`<div class="page-item wait-dom" data-reactid=${ridarray.join('.')}></div>`);                                      
                    }
                    if( $('.scllorBar_commonList').length > 0 ){
                        //重新调整滚动条
                        getmCustomScrollbar2($('.scllorBar_commonList'), 'update') 
                    }                    
                } 
            }else{
                log('=============找不到DOM元素节点==============')
            }               
        }catch(e){
            if( renderDom ){
                log('==============================')
                log('=                            =')
                log('=      渲染列表数据错误2     =')
                log('=                            =')
                log('==============================')
                $(renderDom).empty();
                $(renderDom).siblings('.page-item').remove();
                render(this.renderErrorData(),renderDom);
            }
        }       
    }	
    renderEmptyMode() {
        //获取变换模式前的dom
        let renderPanDom = doc.getElementById('show_list_mode');
        if( !renderPanDom ){
            renderPanDom = doc.getElementById('show_thumbnail_mode'); 
        }
        if( renderPanDom ){
            $(renderPanDom).empty()
            render(this.renderWaitDom(), renderPanDom)
        }       
    } 
	render() {
		const { files, route, displayMode } = this.props;
        const { filterIncluded, filterFileType, checkAll } = this.state;
        log('==============================')
        log('‖                            ‖')
        log('‖     列表重新render渲染     ‖')
        log('‖                            ‖')
        log('==============================')        
		return <div className="file-list-table col-6" style={{"height": "calc(100% - 31px)"}}>
	                <div className="thead col-column flex">
	                    <span className="col-c-2 left-5 file-name flex-item-gsb-0">名称</span>
                        {
                            displayMode === SHOW_LIST_MODE ?
                                <span className="col-c-3 left-10 file-statu flex-item-gsb-0"
                                    onMouseEnter={this.moveEnterLayer.bind(this)}
                                    onMouseLeave={this.moveLeaveLayer.bind(this)}>
                                    扫描状态
                                    <i className="icons icons-20 drop-down-bg abs"></i>
                                    <span className="abs slide-panel leyer-panel">
                                        {
                                            FILE_INCLUDED.map((item, index) => {
                                                if( item.filter === filterIncluded.filter ){
                                                    return <em key={index} className="slide-item flex flex-c active col-lan">{item.text}</em>
                                                }
                                                return <em onClick={this.filterIncluded.bind(this, item)} key={index} className="slide-item flex flex-c">{item.text}</em>
                                            })
                                        }
                                    </span> 
                                </span>
                            :
                                null                                
                        }
                        {
                            displayMode === SHOW_LIST_MODE ?
                               <span className="col-c-5 left-10 file-statu flex-item-gsb-0">修改日期</span>
                            :
                               null   
                        }                        
                        {
                            displayMode === SHOW_LIST_MODE && 1 > 1 ?
                                <span className="col-c-4 left-10 file-type flex-item-gsb-0"
                                    onMouseEnter={this.moveEnterLayer.bind(this)}
                                    onMouseLeave={this.moveLeaveLayer.bind(this)}>
                                    类型
                                    <i className="icons icons-20 drop-down-bg abs"></i>
                                    <span className="abs slide-panel leyer-panel">
                                        {
                                            FILE_0_TYPE.map((item, index) => {
                                                if( item.filter === filterFileType.filter ){
                                                    return <em key={index} className="slide-item flex flex-c active col-lan">{item.text}</em>
                                                }                                       
                                                return <em onClick={this.filterFileType.bind(this, item)} key={index} className="slide-item flex flex-c">{item.text}</em>
                                            })
                                        }                            
                                    </span>                         
                                </span>
                            :
                                null                                
                        }
	                </div>
	                <div className="table flex flex-c flex-c-c" id="client_height_1"
                         style={{"height": "calc(100% - 27px)"}} 
                         data-path={route && route.data ? route.data.path : null}
                         onMouseDown={this.smartMenuPanel.bind(this)}>
	                    {                                    
                            displayMode === SHOW_LIST_MODE ?
                                <div className="scllorBar_commonList">
                                    <div id="show_list_mode" className="table-mode">
                                        {this.renderWaitDom()}
                                    </div>
                                </div>
                            :
                            displayMode === SHOW_THUMBNAIL_MODE ?
                                <div className="scllorBar_commonList">
                                    <div id="show_thumbnail_mode" className="table-mode">
                                        {this.renderWaitDom()}
                                    </div>
                                    
                                </div>
                            :
                                this.renderModeNoLoad()
		            	}
                        <div className="mouse-area abs" id="mousearea"></div> 
	                </div>		           
		       </div>
	}  
    eventsList(temp) {
        const $li = $('.file-list-table').find('.file-item.active'),
              imgArr = [],
              folderArr = [];
        $li.each((index, elem) => {
            try{
                const path = $(elem).data('path'),
                      is_file = $(elem).data('isfile'),
                      hideData = JSON.parse(elem.querySelector('input[type=hidden]').value);
                hideData['path'] = path;
                if( is_file ){
                    imgArr.push(hideData)
                }else{
                    folderArr.push(hideData)
                }
            }catch(e){}
        })
        if( imgArr.length > 0 ){
            imgArr.forEach((item) => {
                //选中的图片---打开系统默认看图软件
                this.openScanDocsImage(item, temp)                            
            })
        }else{
            //打开选中的目录--第一个
            if( folderArr.length > 0 ){
                this.routesFileBtn(folderArr[0])
            }                            
        }        
    }
    eventsKeyDown(evnet) {
        if( doc.querySelector('.dialog-main.unbody').childNodes[1] ){
            log("--tip弹出窗口开启状态中，不允许触发键盘事件0--")
            return false
        }
        if( smartItem || $('.smart-menu-list').length > 0 ){
            log("--鼠标右键开启状态中，不允许触发键盘事件1--")
            return false
        }        
        const e = event || window.event,
              displayMode = this.props.displayMode, 
              ufnDom = doc.getElementById('update_file_name'),
              isFocus = $('#Lianty-LocalFile input[type=text]').is(':focus');
        if( ufnDom ){
             switch(e.keyCode){
                case 13: //Enter键                                
                    if( this.state.keyData ){
                        $(ufnDom).blur()
                        this.updateFileName(this.state.keyData)
                        //解除验证弹窗，使得继续修改流程。
                        this.state.reName = false                        
                    }
                    break;   
                default:
                    break;            
             }
        }else{      
            if( isFocus ){
                log('input框正在焦点中')
                return false;
            }                                
            if( e.ctrlKey ){
                ctrlKey = true;
                log('按下了ctrl键')
                return false;
            } 
            if( e.shiftKey ){
                shiftKey = true;
                log('按下了shift键')
                return false;
            }     
            switch(e.keyCode){
                case 37: //左键
                    this.changeDefaultItemStyle(1)                
                    break;
                case 38: //上键
                    if( displayMode === SHOW_LIST_MODE){
                        this.changeDefaultItemStyle(1) 
                    } else if( displayMode === SHOW_THUMBNAIL_MODE ){
                        this.changeThumbnailItemStyle(1)
                    }
                    break;
                case 39: //右键
                    this.changeDefaultItemStyle(2)
                    break;
                case 40: //下键
                    if( displayMode === SHOW_LIST_MODE){
                        this.changeDefaultItemStyle(2) 
                    } else if( displayMode === SHOW_THUMBNAIL_MODE ){
                        this.changeThumbnailItemStyle(2)
                    }                            
                    break;
                case 13: //Enter键 
                    const enterdata = this.state.keyData;
                    if( 'is_file' in enterdata ){                
                        if( enterdata.is_file ){
                            //选中的图片---打开系统默认看图软件
                            this.openScanDocsImage(enterdata,2)
                        }else{
                            //打开选中的目录
                            this.routesFileBtn(enterdata)
                        }
                    }else{
                        this.eventsList(2)
                    }                   
                    break;   
                case 32: //spaceBar 空格键 
                    const spacebardata = this.state.keyData;
                    if( 'is_file' in spacebardata ){
                        if( spacebardata.is_file ){
                            //选中的图片---打开系统默认看图软件
                            this.openScanDocsImage(spacebardata,1)
                        }else{
                            //打开选中的目录
                            this.routesFileBtn(spacebardata)
                        }
                    } else{
                        this.eventsList(1)
                    }                          
                    break;
                case 8: //Backspace 回格键   
                    if( !isFocus ){
                        this.routesBackLocal()                                          
                    }                 
                    break;    
                default:
                    break;
            } 
        }       
    }
    eventsKeyUp(event) {
        //初始化参数
        ctrlKey = false;
        shiftKey = false;
        shiftIndex = -1;         
        if( event ){
            log('取消了键盘按下事件')
        }else{
            log('初始化键盘按下事件参数')
        }
    } 
    mouseDownInit() {
        //区域拉宽选择
        if( this.state.mouseArea ){
            selectLiItem()
            this.eventsKeyUp()
            this.GlobalActiveesFn(false)
            this.state.mouseArea = false 
            log('mouseDownInit---清除样式1')
            return false
        }
        if( !ctrlKey && !shiftKey && !smartItem ){
            selectLiItem()
            this.eventsKeyUp()
            this.GlobalActiveesFn(false)
            log('mouseDownInit---清除样式2')
        }
    }     
    keyboardEvent(item, event) {
        if( event ){
            if( event.button == 0 ){
                //鼠标左键+键盘事件
                const downDom = event.currentTarget; 
                if( ctrlKey || shiftKey ){
                    if( ctrlKey ){
                        //ctrl键盘事件
                        if( hasClass(downDom, 'active') ){
                            removeClass(downDom, 'active')
                        }else{
                            addClass(downDom, 'active')
                        }
                        log('按下了ctrl键同时按下了鼠标左键')
                        return false;
                    }
                    if( shiftKey ){
                        //shift键盘事件
                        //先判断当前列表有没有被选中的项，并选择第一项
                        const selectDom = $('.file-list-table').find('.file-item.active').first();
                        if( selectDom.length > 0 ){
                            shiftIndex = selectDom.data('index')
                        }else{
                            //记住第一次shft的位置 第一次阻止
                            shiftIndex = downDom.getAttribute('data-index')
                            if( !hasClass(downDom, 'active') ){
                                addClass(downDom, 'active')  
                            }
                            log('按下了shift键同时按下了鼠标左键---第一次阻止往下执行')
                            return false                        
                        }
                        if( shiftIndex > -1 ){
                            const newindex = downDom.getAttribute('data-index')
                            this.shfitSelectItem(shiftIndex, newindex)
                        }   
                        log('按下了shift键同时按下了鼠标左键')
                        return false; 
                    }
                }else{
                    this.GlobalActiveesFn(false)
                    log('按下了鼠标左键但ctrlKey和shiftKey没有触发')
                    //this.fileInfoDetail(item, event) 
                }
                log('按下了鼠标左键')
            }             
        }
    }   
    smartMenuItem(item, event) {
        //右键---列表item区域
        if( event ){
            //删除此冒泡等行为是为了重命名框光标可以聚焦
            // event.stopPropagation();
            // event.preventDefault();
            if( event.button == 2 ){
                if( this.state.reName ){
                    //是否有重命名验证的弹窗
                    return false
                }   
                const ufnDom = doc.getElementById('update_file_name');
                if( !ufnDom ){
                    //鼠标右键开启中
                    let downDom = $(event.currentTarget);
                    if( !downDom.hasClass('file-item') ){
                        downDom = downDom.closest('.file-item')
                    }
                    smartItem = true
                    let data = {} ;
                    if( downDom.length > 0 && !downDom.hasClass('active') ){
                        this.GlobalActiveesFn(false)
                    }
                    log('右键触发条件：')
                    log(activees)                    
                    if( !activees ) {
                        //单个文件触发右键
                        this.fileInfoDetail(item,event)
                        //默认为文件夹
                        let smData = this.props.smartMenuItem2,
                            onEvent = this.routesFileBtn.bind(this,item);
                        if( item && item.is_file ){
                           //预览  
                           smData = this.props.smartMenuItem1
                           onEvent = this.openScanDocsImage.bind(this,item,1)
                        }               
                        data = {
                           mode: 'ONE', 
                           smartMenu: smData,
                           item: item,
                           pageX: event.pageX,
                           pageY: event.pageY,
                           onEvent: onEvent,
                           _this: this
                        }                    
                    }else{
                        //多个文件触发右键
                        const elemDom = $('.file-list-table').find('.file-item.active');
                        let smData = this.props.smartMenuItem3;
                        if( elemDom.length > 0 ){
                            elemDom.each((index,elem) => {
                                const isfile = $(elem).data('isfile')
                                if( !isfile ){
                                    //判断多选中是否有文件夹
                                    smData = this.props.smartMenuItem4;
                                    return false
                                }
                            })  
                        }             
                        data = {
                           mode: 'MOST', 
                           smartMenu: smData,
                           item: item,
                           pageX: event.pageX,
                           pageY: event.pageY,
                           _this: this
                        }
                        this.setState({keyData: item})
                    }
                    setTimeout(() => {
                        this.props.actions.smartMenuShow(data);
                        smartItem = false
                    },100)
                } else{
                    $(ufnDom).blur()
                    this.updateFileName(this.state.keyData)
                    this.smartMenuItem(item, event)
                    //解除验证弹窗，使得继续修改流程。
                    this.state.reName = false
                }
                log('按下的鼠标右键')
            }
        }     
    }
    smartMenuPanel(event) {
        //触发鼠标事件       
        if( event && !smartItem ){
            //删除此冒泡等行为是为了重命名框光标可以聚焦
            // event.stopPropagation();
            // event.preventDefault();
            if( event.button == 2 ){
                if( this.state.reName ){
                    return false
                }                 
                const ufnDom = doc.getElementById('update_file_name');
                if( !ufnDom ){  
                    //右键---列表空白区域
                    smartItem = true
                    let activeDom = $(event.target),
                        data = {};
                    if( activeDom.length > 0 && 
                        (activeDom.hasClass('file-item active') || activeDom.closest('.file-item.active').length > 0) ){
                        let idx, path;
                        if( activeDom.hasClass('file-item active') ){
                            idx = activeDom.data('index') 
                            path = activeDom.data('path')
                        }else{
                            idx = activeDom.closest('.file-item.active').data('index')
                            path = activeDom.closest('.file-item.active').data('path')
                        }
                        if( idx >= 0 ){
                            const idxData = this.props.files.allFiles[idx];
                            if( idxData && idxData.path == path )this.state.keyData = idxData; 
                        }
                        if( !activees ){
                            this.fileInfoDetail(this.state.keyData, event)
                            //默认为文件夹
                            let smData = this.props.smartMenuItem2,
                                onEvent = this.routesFileBtn.bind(this, this.state.keyData);
                            if( this.state.keyData && this.state.keyData.is_file ){
                               //预览  
                               smData = this.props.smartMenuItem1
                               onEvent = this.openScanDocsImage.bind(this,this.state.keyData,1)
                            }               
                            data = {
                               mode: 'ONE', 
                               smartMenu: smData,
                               item: this.state.keyData,
                               pageX: event.pageX,
                               pageY: event.pageY,
                               onEvent: onEvent,
                               _this: this
                            }                    
                        }else{
                            //多选文件
                            const elemDom = $('.file-list-table').find('.file-item.active');
                            let smData = this.props.smartMenuItem3;
                            if( elemDom.length > 0 ){
                                elemDom.each((index,elem) => {
                                    const isfile = $(elem).data('isfile')
                                    if( !isfile ){
                                        //判断多选中是否有文件夹
                                        smData = this.props.smartMenuItem4;
                                        return false
                                    }
                                })  
                            }             
                            data = {
                               mode: 'MOST', 
                               smartMenu: smData,
                               item: this.state.keyData,
                               pageX: event.pageX,
                               pageY: event.pageY,
                               _this: this
                            }
                        }
                    }else{
                        selectLiItem()
                        this.eventsKeyUp()
                        this.GlobalActiveesFn(false)
                        log('smartMenuPanel---清除所有聚焦样式')
                        //重新刷新底部信息栏
                        this.stateKeyData({})
                        data = {
                               smartMenu: this.props.smartMenuPanel,
                               item: null,
                               pageX: event.pageX,
                               pageY: event.pageY,
                               _this: this
                        }
                    }
                    setTimeout(() => {
                        this.props.actions.smartMenuShow(data);
                        smartItem = false
                    },100)
                }else{
                    $(ufnDom).blur()
                    this.updateFileName(this.state.keyData)
                    this.smartMenuPanel(event)
                    this.state.reName = false
                }                
            }
        }    
        //关闭鼠标右键开启状态 
        //smartItem = false                 
    }        
    _scllorFn() {
        const files = this.props.files
        if( files && files.filesData && files.filesData.data ){
            log("下拉加载开始，并开始请求数据--->")
            $('.file-list-table .page-item.wait-dom').html('<i class="loading-bg2"></i>加载文件中，请稍候...');
            this.inItGetFileData(this.props.route,this.props.displayMode,true);
        }    
    } 
    _itemSelectBlur() {
        const files = this.props.files;
        let num = 0;
        if( files && files.filesData && files.filesData.total )  {
            num = files.filesData.total;
        }     
        selectLiItem('default')
        this.eventsKeyUp()
        this.GlobalActiveesFn(false)                
        //通知底部显示选中的信息
        log('-----_itemSelectBlur ===>getTextMsg=====>fileInfoMessage -----')
        const msgData = getTextMsg(num);
        this.props.actions.fileInfoMessage(msgData);
    }
    _oneBodyClick(event) {
        let body = null;
        if( event && event.target ){
            const cn = event.target.className,
                  id = event.target.id;      
            if( cn && (cn.indexOf('unbody') > -1 || 
                $(event.target).hasClass('file-item') || 
                $(event.target).closest('.file-item').length > 0 ) ) {
                body = event.target.className
                //return;
                //不return 去掉input框
            }
            if( id == "update_file_name" ) {
                body = event.target.id
                //return;                
            }
            const ufnDom = doc.getElementById('update_file_name'),
                  isFocus = $(ufnDom).is(':focus');
            if( body == null ){
                if( !ufnDom ){
                    if( this.state.keyEventAll ){
                        this._ctrlA(false)
                    }else{ 
                        if( !ctrlKey && !shiftKey ){ 
                            if( this.state.mouseArea ){
                                this.state.mouseArea = false
                            }else{
                                log('_oneBodyClick---清除样式')
                                this._itemSelectBlur()
                                this.eventsKeyUp()
                            }
                        }
                    }
                }else{
                    $(ufnDom).blur()
                    this.updateFileName(this.state.keyData)
                    this.state.reName = false
                }
            }else{
                if( ufnDom ){
                    if( !isFocus || body != 'update_file_name' ){
                        $(ufnDom).blur()
                        this.updateFileName(this.state.keyData)
                        this.state.reName = false
                    }                    
                }
            }            
        }
        //关闭鼠标右键开启状态, 防止之前未关闭
        smartItem = false
    }
    _ctrlA(isall) {
        //全选 or 全不选
        if( smartItem || $('.smart-menu-list').length > 0 ){
            log("--鼠标右键开启状态中，不允许触发键盘全选事件2--")
            return false
        }
        log("--触发键盘全选事件--")
        const files = this.props.files,
              listDom = $('.file-list-table').find('.table-mode');
        let num = 0, selectnum = 0, sizes = null, msgData = null;
        if( files && files.filesData && files.filesData.total )  {
            num = files.filesData.total;
        }         
        if( listDom.length > 0 ){
            const fileItemArray = listDom.find('.file-item'),
                  selectnum = fileItemArray.length; 
            fileItemArray.each((inex,item) => {
                const isfile = $(item).data('isfile'),
                      size = parseInt($(item).data('size'));
                if( !isfile ){
                    sizes = null
                    return false
                }
                sizes += size
            })            
            log('-----_ctrlA ===>getTextMsg=====>fileInfoMessage -----')
            if( isall ){
                listDom.addClass('key-ctrl-a')
                fileItemArray.addClass('active')
                this.GlobalActiveesFn(selectnum > 1 ? true : false)
                this.setState({keyEventAll: true})
                msgData = getTextMsg(num, selectnum, sizes)                 
            }else{
                listDom.removeClass('key-ctrl-a')
                this.GlobalActiveesFn(false)
                this.setState({keyEventAll: false})
                if( !ctrlKey && !shiftKey ){
                    fileItemArray.removeClass('active')
                }
                msgData = getTextMsg(num)
            }  
            //通知底部显示选中的信息
            this.props.actions.fileInfoMessage(msgData);            
        }            
    }
    _ctrlC(event) {
        if( event ){
            event.preventDefault();
            event.stopPropagation();            
        }
        //复制
        try{
            log("--触发键盘复制事件--")
            const listDom = $('.file-list-table').find('.file-item'); 
            if( listDom.length > 0 ){
                const cd = [];
                listDom.each((index, item) => {
                    if( $(item).hasClass('active') ){
                        const path = $(item).data('path')
                        if( path ){
                            cd.push(path)
                        }
                    }
                })
                if( cd.length > 0 ){
                    window.copyData(JSON.stringify(cd))
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '复制成功',auto: true,speed:1500,statu: 1})
                } 
            }                 
        }catch(e){log('复制出错啦')}
    }
    _ctrlV(event) {
        if( event ){
            event.preventDefault();
            event.stopPropagation();
        }
        //发起粘贴请求
        //try{
           log("--触发键盘粘贴事件--")
           if( this.props.route && this.props.route.data )
               this.props.actionsLF.asyncPasteData(this.props.route.data.path);
        //}catch(e){log('粘贴出错啦')}
    }
    _shiftDelete(event) {
        //永久删除文件操作
        log('永久删除文件操作')
        if( event ){
            event.preventDefault();
            event.stopPropagation();
        }        
        const $fileList = $('.file-list-table').find('.file-item.active'),
              delObj = deleteFile($fileList, true);
        if( delObj ){  
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_CONFIRM,
                title: '删除文件',
                text: delObj.text,
                code: PERMANENT_DELECTE_FILE,
                codeData: {del: delObj.del, del_scan: delObj.del_scan, delType: 1}
           }) 
        }else{
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '请先选择要删除的文件夹或文件',auto: true,speed: 1500,statu: 0})
        }          
    }
	componentDidMount() {
        //jwerty插件键盘事件初始化
        jwerty.key('ctrl+A', () => this._ctrlA(true), this, '#client_height_1');
        jwerty.key('ctrl+C', (event) => this._ctrlC(event), this, '#client_height_1');
        jwerty.key('ctrl+V', (event) => this._ctrlV(event), this, '#client_height_1');
        jwerty.key('shift+Delete',(event) => this._shiftDelete(event), this, '#client_height_1');
        const ch1Dom = doc.getElementById('client_height_1'),
              areaDom = doc.getElementById('mousearea'),
              tmDom = doc.querySelector('.file-list-table .table-mode');

        //预加载容器宽高、滚动条预加载
		//clientHeight(ch1Dom, this.props.resize.h, 58)
		getmCustomScrollbar3($(".scllorBar_commonList"), this._scllorFn.bind(this), 400)
        //mCSB_container样式调整, 为了让正在加载中图标字样在正中间显示
        if( tmDom ){
            //mCSBDom.style.height = "100%";
            tmDom.style.minHeight = getCss(doc.getElementById('client_height_1'), 'height');
        }        
        //区域拉框
        pullArea(ch1Dom, areaDom, this)
        //初始化列表数据
        this.inItGetFileData(this.props.route, this.props.displayMode)       
        dbody.addEventListener('keydown', this.eventsKeyDown)
        dbody.addEventListener('keyup', this.eventsKeyUp)
        dbody.addEventListener('click', this._oneBodyClick)   	
	}	
	componentWillReceiveProps(nextProps) {
		log('FileListTable======>componentWillReceiveProps')
		log(nextProps)
		log(this.props)

        //1路由重新调用时，请求新文件夹数据
        if( nextProps.route && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
            const route = nextProps.route,
                  dm = nextProps.displayMode; 
            //清空一下列表
            this.renderEmptyMode()   
            if( $(".scllorBar_commonList.mCustomScrollbar").length > 0 ){
                getmCustomScrollbar2($(".scllorBar_commonList"), "destroy")
            }     
            //此处不用setState是为了不会把filterIncluded还原到默认值      
            this.state.filterIncluded = FILE_INCLUDED[0]; 
            setTimeout(() => {
                this.inItGetFileData(route,dm) 
            },30) 
            //初始化最右侧属性栏
            this.props.actions.getAttributes({init:'初始化最右侧属性栏'})
            //初始化变量
            this.eventsKeyUp()        
        } 
        //2配置信息有改变，重新刷新一下当前路径
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            if( nextProps.getConfig.types === 'INIT_SET_CONFIG_ADD_SCAN' ||
                nextProps.getConfig.types === 'INIT_SET_CONFIG_DEFAULT' ||
                nextProps.getConfig.types === 'INIT_GET_CONFIG_DEFAULT' ||
                nextProps.getConfig.types === 'INIT_SET_CONFIG_HIDE_DIALOG' ||
                nextProps.getConfig.types === 'FIRST_INIT_GET_CONFIG_INFO' ){
                log('-----部分设置扫描配置信息时，不再请求当前页面数据-----')
                return false
            }            
            const route = nextProps.route,
                  dm = nextProps.displayMode;                   
            if( $(".scllorBar_commonList.mCustomScrollbar").length > 0 ){
                getmCustomScrollbar2($(".scllorBar_commonList"), "destroy")
            }
            //清空一下列表
            this.renderEmptyMode()            
            setTimeout(() => {
                this.inItGetFileData(route,dm) 
            },30)
            //初始化变量
            this.eventsKeyUp()                                                     
        }        
        //列表模式改变时
        if( this.props.displayMode !== nextProps.displayMode ) {
            if( $(".scllorBar_commonList.mCustomScrollbar").length > 0 ){
                getmCustomScrollbar2($(".scllorBar_commonList"), "destroy")
            }
            const dm = nextProps.displayMode,
                  route = nextProps.route;
            //清空一下列表
            this.renderEmptyMode()            
            this.inItGetFileData(route,dm)
            //初始化变量
            this.eventsKeyUp()                                   
        }         
        //文件夹新数据接收后更新列表
        if( nextProps.files && nextProps.files.common && nextProps.files.common.mode !== 0 && 
            nextProps.files.filesLastUpdated !== this.props.files.filesLastUpdated ){
            try{    
                const dm = nextProps.displayMode,
                      pl = nextProps.files.common.pull_load,
                      fileData = nextProps.files.filesData.data,
                      thisCommon = this.props.files.common,
                      nextCommon = nextProps.files.common,
                      pagePathDom = doc.getElementById('client_height_1');   
                
                //情况一：如果files里data的数据是一样的。则不重新render，防止重新render相同的数据。      
                //data:null时不进行判断
                if( fileData && fileData.constructor == Array && fileData.length > 0 ){
                    if( pagePathDom ){
                        //1判断数据是否属于同一个页面的
                        const pagepath = pagePathDom.getAttribute('data-path'); 
                        if( pagepath != nextCommon.dir ) {
                            log('---'+ pagepath +'---触发了数据不属于同一个页面的机制，先删除dom不render当前数据---'+ nextCommon.dir +'---')
                            this.renderEmptyMode()
                            return;
                        } 
                        //2数据多且返回比较慢时---判断文件名有没有重复
                        let _index = nextCommon.offset,
                            oldDom = $(pagePathDom).find('.page-item.data-dom').eq(_index);
                        const hasDomFn = __index => {                              
                            oldDom = $(pagePathDom).find('.page-item.data-dom').eq(__index);
                            if( oldDom.length == 0 && __index > 0 ){
                                hasDomFn(__index-1);
                            }
                        } 
                        if( oldDom.length == 0 && _index > 0 ){
                            hasDomFn(_index-1);
                        } 
                        let oldLi = oldDom.find('li'),
                            firstPath = fileData[0].path,
                            isRepeat = false;
                        oldLi.each((ind, itm) => {
                            const path = $(itm).data('path');
                            if( path === firstPath ){
                                log('---'+ path +'---触发了数据重复机制，不删除dom不render当前数据---'+ firstPath +'---')
                                isRepeat = true;
                                return false;                                
                            }
                        })       
                        if( isRepeat ){
                            //删除加载提示语
                            $(pagePathDom).find('.page-item.wait-dom').empty();
                            return;
                        }                           
                    }                       
                }
                //情况四：变换浏览模式时，数据回来的慢时会重叠
                if( thisCommon.dir == nextCommon.dir && thisCommon.dm != nextCommon.dm ){
                    log('---'+ dm +'---触发了数据不属于同一个浏览模式，先删除dom再render当前数据---'+ this.props.displayMode +'---')
                    this.renderEmptyMode()                    
                }                 
                //情况二：当前页进行扫描状态选择时
                if( thisCommon.dir == nextCommon.dir && thisCommon.get_filter != nextCommon.get_filter ){
                    log('---'+ thisCommon.get_filter +'---触发了数据不属于同一个扫描状态的机制，先删除dom再render当前数据---'+ nextCommon.get_filter +'---')
                    this.renderEmptyMode()                 
                }
                let num = 0;
                if( nextProps.files.filesData && nextProps.files.filesData.total )  {
                   num = nextProps.files.filesData.total 
                }  
                //情况三：当前页面接收到无数据且数据的页面路径和当前页面路径不一至。
                if( num == 0 && isEmpty(fileData) ){
                    //这边清空是为了确保无数据时显示无数据提示。
                    this.renderEmptyMode()
                }  
                //情况五：创建新文件夹时触发分页请求，返回的数据是包含有创建的文件。
                if( newFolder && !isEmpty(fileData) ){
                    const $newItemDom = $('.file-list-table .page-item.new-dom').find('.file-item'),
                          fileDataPathArr = fileData.map(item => item.path);
                    if( $newItemDom.length > 0 ){
                        $newItemDom.each((index, elem) => {
                            const path = $(elem).data('path'),
                                  hasInd = fileDataPathArr.indexOf(path);
                            //一、如果返回的数据里有新建的文件，则删除新建的dom
                            //二、如果返回的数据里有新建的文件, 则删除返回数据里对应的数据
                            if( hasInd > -1 ){
                                //$(elem).closest('.page-item.new-dom').remove()
                                fileData.splice(hasInd, 1)
                            }  
                        })
                    }
                }      
                this.renderNewData(dm, pl, num, fileData) 
            }catch(e){this.renderNewData()} 
            //初始化变量
            this.eventsKeyUp()                        
        }                     
        //删除文件夹或文件 
        if( nextProps.delectScanDocs && nextProps.delectScanDocsLastUpdated !== this.props.delectScanDocsLastUpdated ){
            if( nextProps.delectScanDocs.error_code == 0 ){
                //删除成功后隐藏
                const $list_Elem = $('.file-list-table .scllorBar_commonList').find('.file-item.active');
                if( $list_Elem.length > 0 ){
                    $list_Elem.each((indexList, elemList) => {
                        const path = $(elemList).data('path');
                        if( this.state.keyData && this.state.keyData.path === path ){
                            //初始化最右侧属性栏
                            this.props.actions.getAttributes({init:'当前显示属性的文件或图片已删除'})                            
                        }
                        $(elemList).removeClass('active').hide();
                    })  
                    //清除属性栏和更新底部显示数据
                    this.stateKeyData(null, $list_Elem.length);              
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '删除成功',auto: true,speed: 1500,statu: 1}) 
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '请先选择要删除的文件夹或文件',auto: true,speed: 1500,statu: 0})
                }
            }else{
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '删除失败',auto: true,speed: 1500,statu: 0}) 
            }
            //初始化变量
            this.eventsKeyUp()            
        }
        //粘贴
        if( nextProps.pasteData && nextProps.pasteDataLastUpdated !== this.props.pasteDataLastUpdated ){
            if( nextProps.pasteData.is_success ){
                let pd = nextProps.pasteData.data;
                if( pd ){
                    const statu = parseInt(pd.status),
                          failList = pd.failList;
                    if( statu == 1 ){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '正在粘贴文件中，请稍候...',auto: false})
                    }else if( statu == 2 ){
                        if( failList && failList.length > 0 ){
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '“'+ failList.join(',') +'” 粘贴失败。<br />或因当前目录存在该文件或文件夹',auto: true,speed: 3000,statu: 0})
                        }else{
                            this.props.actions.triggerDialogInfo(null)
                        }
                        //重新调用路由，刷新页面。
                        if( nextProps.route.data ){
                            nextProps.route.data['is_refresh'] = true;
                        }
                        const data = {
                            route: nextProps.route
                        }
                        this.props.actions.getInItRoute(data) 
                    }
                }
            }else{
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '粘贴失败',auto: true,speed: 1500,statu: 0}) 
            }
            //初始化变量
            this.eventsKeyUp()            
        }
        //查看预览图(右键和空格键)
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated != this.props.jsMsgHandleLastUpdated ){
            if( nextProps.jsMsgHandle.module == 'create_preview_rsp_t' ){
                if( nextProps.jsMsgHandle.param && nextProps.jsMsgHandle.param.data && nextProps.jsMsgHandle.param.error_code == 0 ){
                    const pdata = nextProps.jsMsgHandle.param.data;
                    try{
                        window.openScanDocsImageRequest(pdata.thumb_mid_path); 
                    }catch(e){
                        log('openScanDocsImageRequest方法未注入');
                    }
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "该文件暂时无法预览噢",auto: true,speed: 2000,statu: 0})
                }
            }  
        }
	} 
    shouldComponentUpdate(nextProps, nextState){
        //判断config更新时是否执行渲染
        if( nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //部分配置信息设置不再渲染页面    
            if( nextProps.getConfig.types === 'INIT_SET_CONFIG_ADD_SCAN' ||
                nextProps.getConfig.types === 'INIT_SET_CONFIG_DEFAULT' ||
                nextProps.getConfig.types === 'INIT_GET_CONFIG_DEFAULT' || 
                nextProps.getConfig.types === 'INIT_SET_CONFIG_HIDE_DIALOG'||
                nextProps.getConfig.types === 'FIRST_INIT_GET_CONFIG_INFO' ){
                log('-----设置部分扫描配置信息，不再渲染当前界面-----')
                log('shouldComponentUpdate---（FileListTable）优化起作用0---')
                return false                
            }                
        }        
        //判断files更新时列表是否要执行渲染
        if( nextProps.files && nextProps.files.common && nextProps.files.common.mode == 0 && 
            nextProps.route && nextProps.route.data && this.props.route && this.props.route.data && 
            nextProps.route.data.path == this.props.route.data.path ){
            log('shouldComponentUpdate---（FileListTable）优化起作用1---')    
            return false
        }        
        //时时获取新文件信息---文件太多会有点卡，so，在此生命周期里dom处理。
        if( nextProps.fileItemData && nextProps.fileItemDataLastUpdated !== this.props.fileItemDataLastUpdated ){
            if( nextProps.fileItemData.error_code == 0 && nextProps.fileItemData.data ){
                try{                                                 
                    if( nextProps.fileItemData.data.constructor == Array ){ 
                        const cbArray = nextProps.fileItemData.data,
                              fileAll = nextProps.files.allFiles;
                        if( cbArray.length > 0 ){
                            for( let i = 0, ilen = cbArray.length; i < ilen; i++ ){ 
                                const pageDom = $('.file-list-table .page-item.data-dom').eq(cbArray[i].page_offset),
                                      itemDom = pageDom.find('.file-item').eq(cbArray[i].file_pos),
                                      itemIndex = itemDom.data('index'),
                                      cbData = JSON.parse(cbArray[i].thumb_image);
                                if( cbData && (!isEmpty(cbData.images) || !isEmpty(cbData.path)) ) {     
                                    const img_src = getEncodeURIComponentPath({thumb_image: cbData},fileAll[itemIndex])
                                    if( img_src ){
                                        itemDom.find('img').attr('src', img_src)
                                    }
                                }
                                fileAll[itemIndex].thumb_image = cbData                                      
                            } 
                        }
                   }       
                }catch(e){}
            }
            log('shouldComponentUpdate---（FileListTable图片src替换）优化起作用2---')
            return false
        } 
        if( ctrlKey || shiftKey || nextState.mouseArea ){
            log('shouldComponentUpdate---（ctrlKey || shiftKey || nextState.mouseArea）优化起作用3---')
            return false            
        }
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
        log('shouldComponentUpdate---（FileListTable）优化起作用4---')
        return false;        
    }    
	componentDidUpdate(nextProps, nextState) {
        log("FileListTable----componentDidUpdate")
		if($('.scllorBar_commonList.mCustomScrollbar').length <= 0 ){
			//重新调用滚动插件
            log('重新调用滚动插件')
			getmCustomScrollbar3($(".scllorBar_commonList"), this._scllorFn.bind(this), 300)
		}		
		if(nextProps.resize.h !== this.props.resize.h){
            //clientHeight(doc.getElementById('client_height_1'),this.props.resize.h,58)
			getmCustomScrollbar2($(".scllorBar_commonList"), "update")
		}  
        //下拉加载时处理滚动条 或 新建文件夹时
        if( this.props.files.common.pull_load && 
            nextProps.files.common.offset !== this.props.files.common.offset ){
            getmCustomScrollbar2($(".scllorBar_commonList"), "update")                    
        }
        //文件夹数据接收有更新时，列表的宽高同步于缩略图按扭的值
        if ( nextProps.files && this.props.files && 
             nextProps.files.filesLastUpdated !== this.props.files.filesLastUpdated ) {
            listEquqlBCdrag(nextProps.displayMode, $('.file-list-table').find('.file-item'), $('.bottom-bar').find('.silder-drag-btn'))
        }
        //列表显示模式改变时列表的宽高同步于缩略图按扭的值
        if( nextProps.displayMode !== this.props.displayMode ){
            listEquqlBCdrag(nextProps.displayMode, $('.file-list-table').find('.file-item'), $('.bottom-bar').find('.silder-drag-btn'))
        } 
        //提示页面样式居中
        if( doc.getElementById('no_data_msg') ){
            absVerticalCenter2(doc.getElementById('no_data_msg'))
        }       
        //Perf.stop()
        // Perf.printInclusive()
        // Perf.printExclusive()
        // Perf.printWasted()                                        		
	}
    componentWillUnmount() {
        dbody.removeEventListener('keydown', this.eventsKeyDown)
        dbody.removeEventListener('keyup', this.eventsKeyUp)
        dbody.removeEventListener('click', this._oneBodyClick)          
    }    
}	
FileListTable.defaultProps = {
    smartMenuItem1: addArray(SMART_MENU, [SMART_MENU_OPEN_DEFAULT,SMART_MENU_OPEN_LOCAL, SMART_MENU_COPY, SMART_MENU_DELETE_FILE, SMART_MENU_RENAME]),
    smartMenuItem2: addArray(SMART_MENU, [SMART_MENU_OPEN_ROUTE, SMART_MENU_ADD_SCAN,SMART_MENU_OPEN_LOCAL, SMART_MENU_COPY, SMART_MENU_DELETE_FILE, SMART_MENU_RENAME]), 
    smartMenuItem3: addArray(SMART_MENU, [SMART_MENU_OPEN_LOCAL, SMART_MENU_COPY, SMART_MENU_DELETE_FILE, SMART_MENU_RENAME]),
    smartMenuItem4: addArray(SMART_MENU, [SMART_MENU_OPEN_LOCAL,SMART_MENU_ADD_SCAN, SMART_MENU_COPY, SMART_MENU_DELETE_FILE, SMART_MENU_RENAME]),          
    smartMenuPanel: addArrayObj(SMART_MENU, [SMART_MENU_PASTE, SMART_MENU_REFRESH, SMART_MENU_NEW, SMART_MENU_NEW_FOLDER]) 
}
export default immutableRenderDecorator(FileListTable)