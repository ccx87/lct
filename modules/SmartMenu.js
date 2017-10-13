import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { CHAT_ROUTES } from '../constants/DataConstant'
import { log, isEmpty, hasClass, addClass, removeClass } from '../constants/UtilConstant'
import { SHOW_DIALOG_ALERT,SHOW_DIALOG_CONFIRM, SHOW_MODIFY_COMMENT, SMART_MENU_CHECK_DATA, 
         SMART_MENU_MODIFY_COMMENTS, SMART_MENU_DELETE_SESSION, SMART_MENU_DELETE_FRIEND, 
         SMART_MENU_ADD_BLACKLIST, SMART_MENU_OPEN_DEFAULT, SMART_MENU_COPY, SMART_MENU_PASTE, 
         SMART_MENU_DELETE_FILE, SMART_MENU_RENAME, SMART_MENU_NEW, SMART_MENU_OPEN_ROUTE,
         SMART_MENU_NEW_FOLDER, SMART_MENU_CUT,SMART_MENU_ADD_SCAN,SMART_MENU_OPEN_LOCAL,
         SMART_MENU_REFRESH, DELETE_FILE_RECYCLE_BIN, SMART_MENU_OPEN, SMART_MENU_DEL } from '../constants/TodoFilters'
import { deleteFile } from '../constants/EventsConstant'         

const dbody = document.body;
class SmartMenu extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
        this.oneBodyClick = this.oneBodyClick.bind(this)
      	log("SmartMenu---右键菜单");		
  	}		
    smartMenuFn(elem, data, event) {
        event.stopPropagation();
        event.preventDefault();      
        if( isEmpty(elem) ) {
            return false;
        }
        switch(elem.value) {
            case SMART_MENU_CHECK_DATA:
                //log("好友中心--查看资料")
                const routeData = CHAT_ROUTES[1];
                routeData['data'] = data.item;
                setTimeout(() => {
                   this.props.actions.getInItRoute({
                      route: routeData
                    })
                },10)  
                break;
            case SMART_MENU_MODIFY_COMMENTS:
                //log("好友中心--修改备注")
                this.props.actions.triggerDialogInfo({type: SHOW_MODIFY_COMMENT, data: data.item})
                break; 
            case SMART_MENU_DELETE_FRIEND:
                //log("好友中心--删除好友")
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: '提示',
                    text: '确认删除该好友吗？',
                    code: SMART_MENU_DELETE_FRIEND,
                    codeData: data.item 
                })                
                break;
            case SMART_MENU_ADD_BLACKLIST:
                //log("好友中心--加入到黑名单")
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: '提示',
                    text: '确认把该好友加入到黑名单吗？',
                    code: SMART_MENU_ADD_BLACKLIST,
                    codeData: data.item 
                })                
                break;
            case SMART_MENU_DELETE_SESSION:
                //log("好友中心--删除本地会话")
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: '提示',
                    text: '确认删除该好友的会话记录吗？',
                    code: SMART_MENU_DELETE_SESSION,
                    codeData: data.item 
                })                
                break;
            case SMART_MENU_OPEN_ROUTE:
            case SMART_MENU_OPEN_DEFAULT:
                //打开文件夹内容或文件预览
                if( data.onEvent ){
                    data.onEvent()
                }
                break;                 
            case SMART_MENU_DELETE_FILE:
                //本地素材---删除到回收站
                const $fileList = $('.file-list-table').find('.file-item.active'),
                      delObj = deleteFile($fileList, false);
                if( delObj ){  
                    this.props.actions.triggerDialogInfo({
                        type: SHOW_DIALOG_CONFIRM,
                        title: '删除文件',
                        text: delObj.text,
                        code: DELETE_FILE_RECYCLE_BIN,
                        codeData: {del: delObj.del, del_scan: delObj.del_scan, delType: 0}
                    }) 
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '请先选择要删除的文件夹或文件',auto: true,speed: 1500,statu: 0})
                }                 
                break;
            case SMART_MENU_DEL:
                //字体助手--删除下载后的字体
                try{
                    if( !isEmpty(data.item) ){
                        let font_id_list;
                        if( data.item.constructor == Array ){
                            font_id_list = (data.item.map(font => font.font_id)).join(',')
                        }else{
                            font_id_list = data.item.font_id
                        }
                        let download_del_result = window.delDownloadRecord(0, font_id_list)
                        download_del_result = JSON.parse(download_del_result)
                        if( download_del_result.result ){
                            if( data.elem ){
                                if( data.elem.constructor == Array ){
                                    data.elem.forEach(el => {
                                        let hidDom = el.querySelector('input[type]=hidden'),
                                            hidId = hidDom && hidDom.value;
                                        data.item.some((di, index) => {
                                            if( di.font_id == hidId ){
                                                di["is_del"] = true
                                            }
                                            return di.font_id == hidId
                                        })
                                        //el.style.display = 'none'
                                    })
                                }else{
                                    data.item["is_del"] = true
                                    //data.elem.style.display = 'none'
                                }
                            }
                            window.JsMsgHandle('download_font_del_t', {error_code: 0, error: '', data: '删除成功', desc: '点击<扫描文件>自己触发，使得已下载列表的序号可以再排序'})
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "删除成功",auto: true,speed: 2000,statu: 0})
                        }else{
                            let errStr = (download_del_result.error && download_del_result.error+"(代码："+ download_del_result.error_code +")") || "删除失败"
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: errStr,auto: true,speed: 2000,statu: 0})
                        }
                    }else{
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "路径不存在，删除失败",auto: true,speed: 2000,statu: 0})
                    }
                }catch(e){
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "删除失败",auto: true,speed: 2000,statu: 0})
                } 
                break;    
            case SMART_MENU_ADD_SCAN:
                //2改版---只往设置里增加扫描路径
                let oldpath = [],
                    newpath = [];            
                if( data.item && !data.item.is_file && data.item.mode == 'ONE' ){
                    //增加单个扫描文件夹
                    newpath.push(data.item.path)
                }else{
                    //增加多个扫描文件夹
                    //增加的扫描路径都为文件夹
                    const elemDom = $('.file-list-table').find('.file-item.active');
                    if( elemDom.length > 0 ){      
                        elemDom.each((index, elem) => {
                            const path = $(elem).data('path'),
                                  isfile = $(elem).data('isfile');
                            if( !isfile ){      
                                newpath.push(path)
                            }
                        })
                    } 
                }
                if( newpath.length > 0 ){
                    try{
                        const result = window.addScannPath(JSON.stringify(newpath))
                        const json_result = $.parseJSON(result)
                        log("添加文件夹为扫描目录：出参和回参")
                        log(newpath)
                        log(json_result)
                        if( json_result && json_result.is_success ){
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设为扫描目录成功",auto: true,speed: 2000,statu: 1})
                            setTimeout(() => {
                                newpath.forEach((item) => {
                                    this.props.actions.eventsCheck({path: item, hasScanPath: true})
                                })
                                this.props.actions.getConfigInfo(null,'INIT_SET_CONFIG_ADD_SCAN')
                            },500)
                        }else{
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: !isEmpty(json_result.error) ? json_result.error : "设为扫描目录失败",auto: true,speed: 2000,statu: 0})
                        }
                    }catch(e){this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设为扫描目录失败",auto: true,speed: 2000,statu: 0})} 
                }else{       
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "目录不存在或不是文件夹",auto: true,speed: 2000,statu: 0}) 
                }                                
                break; 
            case SMART_MENU_OPEN_LOCAL:
            case SMART_MENU_OPEN:
                //打开文件位置
                if( data.item && !isEmpty(data.item.path) ){
                    try{
                        window.openFileRequest(2, data.item.path) 
                    }catch(e){
                        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "打开文件(夹)位置失败",auto: true,speed: 1500,statu: 0})
                    }
                }else{
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "文件(夹)位置不存在",auto: true,speed: 1500,statu: 0})
                }
                break;
            case SMART_MENU_RENAME:
                //重命名
                if( data._this ){
                    data._this.updateFileName(data.item)
                }
                break;
            case SMART_MENU_COPY:
                //复制
                try{
                    log("--触发右键复制事件--")
                    const listDom = $('.file-list-table').find('.file-item.active'); 
                    if( listDom.length > 0 ){
                        const cd = [];
                        listDom.each((index, item) => {
                            const path = $(item).data('path')
                            if( path ){
                                cd.push(path)
                            }
                        })
                        if( cd.length > 0 ){
                            window.copyData(JSON.stringify(cd))
                            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '复制成功',auto: true,speed:1500,statu: 1})
                        } 
                    }                 
                }catch(e){log('复制出错啦')}                
                break;
            case SMART_MENU_PASTE:
                //粘贴
                try{
                   log("--触发右键粘贴事件--")
                   if( data._this ){
                       const route = data._this.props.route.data.path;
                       this.props.actionsLF.asyncPasteData(route)
                   }
                }catch(e){log('粘贴出错啦')}                
                break; 
            case SMART_MENU_NEW_FOLDER:
                //新建文件夹
                try{
                    if( data._this ){
                        data._this.renderCreateNewFolder()
                    }
                }catch(e){log('新建文件夹出错啦')}
                break;
            case SMART_MENU_REFRESH:
                //刷新
                if( data._this ){
                    const newdata = {
                        route: data._this.props.route
                    }
                    newdata.route.data['is_refresh'] = true; 
                    this.props.actions.getInItRoute(newdata);                     
                }               
                break;       
            default:
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "获取数据失败",auto: true,speed: 1500,statu: 0})
                break;
        }
        if( dbody.classList.contains('disable-hover') ){
            dbody.classList.remove('disable-hover')
            $('.mCustomScrollbar').mCustomScrollbar('update')
        }         
        this.props.actions.smartMenuShow(null); 
        return false       
    }
    moveEnterLayer(event) {
        if( event && event.currentTarget ){
            const moreDom = event.currentTarget.querySelector('.smart-menu-more')
            if( moreDom ){
                moreDom.style.display = 'block'
            }
        }
    }
    moveLeaveLayer(event) {
        if( event && event.currentTarget ){
            const moreDom = event.currentTarget.querySelector('.smart-menu-more')
            if( moreDom ){
                moreDom.style.display = 'none'
            }
        }
    }
    oneBodyClick(event) { 
        if( hasClass(event.target, "unbody")){
            return;
        }         
        const smData = this.props.smartMenuData
        if( smData ) {
            if( dbody.classList.contains('disable-hover') ){
                dbody.classList.remove('disable-hover')
                $('.mCustomScrollbar').mCustomScrollbar('update')
            }  
            if( smData.elem ){
                if( smData.elem.constructor == Array ){
                    smData.elem.forEach(el => {
                        el.classList.toggle('active-sm')
                    })
                }else{
                    smData.elem.classList.toggle('active-sm')
                }                
            }           
            this.props.actions.smartMenuShow(null);
        }
    }  
    render() {
        const { smartMenuData } = this.props
        return (
              <div className="abs smart-menu-layer box-layer">
                  {
                    smartMenuData ? 
                        <ul className="smart-menu-list unbody">
                           {
                             smartMenuData.smartMenu && smartMenuData.smartMenu.length > 0 ?
                                smartMenuData.smartMenu.map((elem, index) => {
                                   if( elem.mode == "more-default" ){
                                        return <li className="unbody flex flex-c" key={index} 
                                                    onMouseEnter={this.moveEnterLayer.bind(this)}
                                                    onMouseLeave={this.moveLeaveLayer.bind(this)}>
                                                 {
                                                    !isEmpty(elem.icons) ?
                                                       <i className={elem.icons}></i>
                                                    :
                                                        null   
                                                 }
                                                 <span className="unbody flex-item-gsb-1 item">
                                                    <em className="unbody"></em>
                                                    <span className="unbody">
                                                        {elem.text}
                                                    </span>
                                                 </span>
                                                 {
                                                    elem.mode == "more-default" ?
                                                       <i className="icons icons-10 list-more-bg2 unbody"></i>
                                                    :
                                                        null   
                                                 }
                                                 {
                                                    elem.mode == "more-default" ?
                                                        <ul className="smart-menu-more unbody abs">
                                                            {
                                                                elem.data && elem.data.length > 0 ?
                                                                    elem.data.map((elemM, indexM) => { 
                                                                        return <li className="unbody flex flex-c" key={indexM}
                                                                                    onClick={this.smartMenuFn.bind(this, elemM, smartMenuData)}>
                                                                                    {
                                                                                        !isEmpty(elemM.icons) ?
                                                                                           <i className={elemM.icons}></i>
                                                                                        :
                                                                                            null   
                                                                                    }
                                                                                    <span className="unbody flex-item-gsb-1 item">
                                                                                        <em className="unbody"></em>
                                                                                        <span className="unbody">{elemM.text}</span>
                                                                                    </span>                                                                            
                                                                                </li>
                                                                    })
                                                                :
                                                                    null    
                                                            }
                                                        </ul>
                                                    :
                                                        null  
                                                 }
                                               </li>
                                    }else{
                                        return <li className="unbody flex flex-c" key={index} 
                                                  onClick={this.smartMenuFn.bind(this, elem, smartMenuData)}>
                                                    {
                                                        !isEmpty(elem.icons) ?
                                                           <i className={elem.icons}></i>
                                                        :
                                                            null   
                                                    }
                                                    <span className="unbody flex-item-gsb-1 item">
                                                       <em className="unbody"></em>
                                                       <span className="unbody">{elem.text}</span>
                                                    </span>
                                               </li>
                                    }      
                                })
                             :
                                null  
                           }                                              
                        </ul>
                    :
                        null
                  }         
              </div>
        )
    }
    componentDidMount() {
        dbody.addEventListener('click', this.oneBodyClick)
    }  
    componentDidUpdate(nextProps, nextState) {
        if( this.props.smartMenuData && nextProps.smartMenuLastUpdated !== this.props.smartMenuLastUpdated ){
            const t_smData = this.props.smartMenuData;
            const layer_Elem = document.querySelector('.smart-menu-layer');
            if( !dbody.classList.contains('disable-hover') ){
                dbody.classList.add('disable-hover')
                $('.mCustomScrollbar').mCustomScrollbar('disable')
            }
            if( nextProps.resize && nextProps.resize.h < (t_smData.pageY + 200) ){
                const b = nextProps.resize.h - t_smData.pageY;
                $(layer_Elem).css({top: 'initial', bottom: b, left: t_smData.pageX,});
            }else{
                $(layer_Elem).css({top: t_smData.pageY, bottom:'initial', left: t_smData.pageX,});
            }
        }
    }	
    componentWillUnmount() {
        dbody.removeEventListener('click', this.oneBodyClick)
    }    
}
const mapStateToProps = (state) => {
    log("SmartMenu-->",state)
    return {
        smartMenuData: state.events.smartMenuData,
        smartMenuLastUpdated: state.events.smartMenuLastUpdated
    }
} 
export default connect(
    mapStateToProps
)(immutableRenderDecorator(SmartMenu))