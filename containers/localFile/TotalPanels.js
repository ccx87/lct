import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { GET_DRIVE_STATE } from '../../constants/DataConstant'
import { getFileInitObjectData } from '../../constants/ConfigInfo'
import { loadingHtml3, NoDataTextHtml, msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { log, getDriveState, addClass, getNavigation, objClone } from '../../constants/UtilConstant'
import { LOCAL_FILE_TOTAL_PANELS, LOCAL_FILE_DESKTOP, LOCAL_FILE_CONTENT } from '../../constants/TodoFilters'

import NavigationBar from '../../modules/functionBarModel/NavigationBar'
import NotificationMsg from '../../modules/functionBarModel/NotificationMsg'

class TotalPanels extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
           loading: false,
           tempFiles: null,
           mobileFiles: null
        };
      	log("TotalPanels");		
  	}	
    selectPanelItem(event){
        event.stopPropagation();
        event.preventDefault();
        $(event.currentTarget).siblings('.item').removeClass('active')
        $(event.currentTarget).addClass('active')
    }
    routesFileBtn(elem, event){ 
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
              host: elem.path.split('\\')              
           }
        }
        const treefilter = parseInt(document.getElementById('tree-filter-mode').getAttribute('data-treefilter'));
        if( treefilter == 2 ){
            data.route.data['get_filter'] = treefilter;
        }else{
            data.route.data['get_filter'] = 0;
        }        
        this.props.actions.getInItRoute(data);
    }    
    renderDefualtHtml(item, bg) {
        const noticeMsg = this.props.noticeMsg;
        let classes = 'icons-local-material icons-40 '+ bg,
            isscan = false;      
        if( noticeMsg && !noticeMsg.action && noticeMsg.type == 'SCAN' && item.is_scaning ){
            classes += ' scaning';
            isscan = true;
        }      
        return  <div className="icons-40 bg" >
                    <i className={classes}>
                        {
                            item.file_scan_num != null &&  item.file_scan_num > 0 ?
                               <em className="icons-local-material icons-20 normal-bg abs"></em>
                            :
                               null   
                        }
                    </i>
                    {
                        isscan ? 
                            msgAlertHtml('正在从服务器获取识图信息...')
                        :
                            null    
                    }                    
                </div>            
    }
    render() {
        const { loading, tempFiles, mobileFiles } = this.state;
        const { noticeMsg } = this.props;     
        // 数据预处理
        let cc_array = [], bg_array = [], mg_array = [], other_array = [], gifDrive = [], treefilter = 0;
        if( tempFiles && tempFiles.data && tempFiles.data.length > 0 ){
            const driveLetter = tempFiles.data,
                  len = driveLetter.length,
                  treefilterDom = document.getElementById('tree-filter-mode');
            if( treefilterDom ){
                treefilter = parseInt(treefilterDom.getAttribute('data-treefilter'));
            }  
            //获取正在扫描的区域                    
            if( noticeMsg && !noticeMsg.action && noticeMsg.type == 'SCAN' && noticeMsg.data ){
                const pathArr = noticeMsg.data.map((item) => {
                    return item.split(':')[0] +':' 
                }) 
                //数组去重处理
                for( let k = 0, lenk = pathArr.length; k < lenk; k++ ){
                     if( gifDrive.indexOf(pathArr[k]) == -1 ){
                         gifDrive.push(pathArr[k])
                     }
                }
            }
            //获取收藏夹    
            for( let i = 0; i < len; i++ ) {
                if( getDriveState(driveLetter[i].file_prop) === GET_DRIVE_STATE.noSys_folder ||
                    getDriveState(driveLetter[i].file_prop) === GET_DRIVE_STATE.sys_folder ){
                    cc_array.push(driveLetter[i])
                }
            }
            //获取盘符
            for( let j = 0; j < len; j++ ) {
                if( getDriveState(driveLetter[j].file_prop) === GET_DRIVE_STATE.sys_fixed ||
                    getDriveState(driveLetter[j].file_prop) === GET_DRIVE_STATE.noSys_fixed ){
                    driveLetter[j]['get_filter'] = treefilter;
                    if( gifDrive.length > 0 && gifDrive.indexOf(driveLetter[j].file_name) > -1 ){
                        driveLetter[j]['is_scaning'] = true;
                    } 
                    bg_array.push(driveLetter[j]) 
                }
            }
        }
        //获取移动硬盘
        if( mobileFiles && mobileFiles.data && mobileFiles.data.length > 0 ){
            const mobileLetter = mobileFiles.data,
                  lens = mobileLetter.length;
            //获取盘符
            for( let h = 0; h < lens; h++ ) {
                if( getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.sys_removable ||
                    getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.sys_CDROM ||
                    getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.sys_usb ||
                    getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.noSys_removable ||
                    getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.noSys_CDROM ||
                    getDriveState(mobileLetter[h].file_prop) === GET_DRIVE_STATE.noSys_usb ){
                    mobileLetter[h]['get_filter'] = treefilter;
                    if( gifDrive.length > 0 && gifDrive.indexOf(mobileLetter[h].file_name) > -1 ){
                        mobileLetter[h]['is_scaning'] = true;
                    } 
                    mg_array.push(mobileLetter[h]) 
                }
            }            
        }
        return (
          <div className="total-panels" style={{"height":"100%"}}>
               <NavigationBar {...this.props}/>
               <div className="content">
                   {
                       cc_array.length > 0 ?
                           <div className="panel-item cc-panel">
                               <p className="title box-c">
                                  <span className="tit-txt col-6 font-weight7 flex flex-c">
                                      <i className="icons-local-material icons-10 lm-tit-bg"></i>
                                      常用及收藏文件夹（{cc_array.length}）
                                  </span>
                                  <span className="sp-line abs"></span>
                               </p>
                               <div className="list flex">
                                   {
                                        cc_array.map((item, index) => {
                                            return <div key={index} className="item flex flex-c"
                                                    onDoubleClick={this.routesFileBtn.bind(this,item)}
                                                    onClick={this.selectPanelItem.bind(this)}>
                                                       <i className="icons-local-material icons-40 lm-file1-bg">
                                                          <em className="icons-local-material icons-20 scan-file-bg l-b-style abs"></em>
                                                       </i>
                                                       <span className="info flex">
                                                           <span className="col-0">{item.file_name}</span>
                                                           <span className="col-9">快捷方式</span>
                                                       </span>
                                                   </div>                                                
                                        })
                                   }                                                
                               </div>
                           </div>
                       :
                           null    
                   }
                   <div className="panel-item bg-panel">
                       <p className="title box-c">
                          <span className="tit-txt col-6 font-weight7 flex flex-c">
                              <i className="icons-local-material icons-10 lm-tit-bg"></i>
                              本机硬盘（{bg_array.length}）
                          </span>
                          <span className="sp-line abs"></span>
                       </p>
                       <div className="list flex">
                           {
                                !loading && tempFiles ?
                                    bg_array.length > 0 ?
                                        bg_array.map((item, index) => {
                                            const percentage = parseFloat(item.file_size / item.file_size_max).toFixed(2) * 100; 
                                            return <div className="item flex flex-c" key={index} 
                                                    onDoubleClick={this.routesFileBtn.bind(this,item)}
                                                    onClick={this.selectPanelItem.bind(this)}>
                                                       {
                                                          getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_fixed ?
                                                              this.renderDefualtHtml(item, 'lm-plate0-bg') 
                                                          :
                                                          getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_fixed ?
                                                              this.renderDefualtHtml(item, 'lm-plate1-bg')
                                                          :                                                              
                                                              <i className="icons-local-material icons-40 lm-plate2-bg">
                                                                 <em className="icons-local-material icons-20 scan-file-bg r-t-style abs">
                                                                    {
                                                                        item.file_scan_num != null &&  item.file_scan_num > 0 ?
                                                                           <em className="icons-local-material icons-20 normal-bg abs"></em>
                                                                        :
                                                                           null   
                                                                    }                                                                 
                                                                 </em>
                                                              </i>                                                                
                                                       }
                                                       <div className="info flex">
                                                           <span className="col-0">{item.volume_name}</span>
                                                           {
                                                               percentage >= 0 ?
                                                                   <span className="sp-bar">
                                                                       <i style={{"width": percentage +"%"}} className={ percentage >= 95 ? "bg-red" : "bg-lan"}></i>
                                                                   </span>
                                                               :
                                                                   null                                                                     
                                                           }
                                                           {
                                                               item.file_scan_num != null &&  item.file_scan_num > 0 ?
                                                                  <span className="col-9"><span className="col-lan" style={{"paddingLeft":"2px","paddingRight":"2px"}}>{item.file_scan_num}</span>个可识图素材</span>
                                                               :
                                                                  <span className="col-9">无任何可识图素材</span>    
                                                           }
                                                       </div>
                                                   </div>
                                        })
                                    :
                                        NoDataTextHtml('暂无法获取硬盘数据')
                                :
                                    loadingHtml3()                                
                           }                                                                         
                       </div>
                   </div>
                   <div className="panel-item other-panel">
                       <p className="title box-c">
                          <span className="tit-txt col-6 font-weight7 flex flex-c">
                              <i className="icons-local-material icons-10 lm-tit-bg"></i>
                              移动设备（{mg_array.length}）
                          </span>
                          <span className="sp-line abs"></span>
                       </p>
                       <div className="list flex">
                          {
                              !loading ?
                                  mg_array.length > 0 ?
                                      mg_array.map((item, index) => {
                                          const percentage = parseFloat(item.file_size / item.file_size_max).toFixed(2) * 100; 
                                          return <div className="item flex flex-c" key={index} 
                                                  onDoubleClick={this.routesFileBtn.bind(this,item)}
                                                  onClick={this.selectPanelItem.bind(this)}>
                                                     {
                                                        getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_removable ||
                                                        getDriveState(item.file_prop) === GET_DRIVE_STATE.sys_CDROM ?
                                                            this.renderDefualtHtml(item, 'lm-plate0-bg') 
                                                        :
                                                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_removable ?    
                                                            this.renderDefualtHtml(item, 'lm-plate1-bg')                                                                  
                                                        :
                                                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_CDROM ?        
                                                            this.renderDefualtHtml(item, 'lm-plate3-bg')                                                                   
                                                        :
                                                        getDriveState(item.file_prop) === GET_DRIVE_STATE.noSys_usb ?        
                                                            this.renderDefualtHtml(item, 'lm-plate7-bg')                                                                   
                                                        :                                                         
                                                            <i className="icons-local-material icons-40 lm-plate2-bg">
                                                               <em className="icons-local-material icons-20 scan-file-bg r-t-style abs">
                                                                  {
                                                                      item.file_scan_num != null &&  item.file_scan_num > 0 ?
                                                                         <em className="icons-local-material icons-20 normal-bg abs"></em>
                                                                      :
                                                                         null   
                                                                  }                                                                 
                                                               </em>
                                                            </i>                                                                
                                                     }
                                                     <div className="info flex">
                                                         <span className="col-0">{item.volume_name}</span>
                                                         {
                                                             percentage >= 0 ?
                                                                 <span className="sp-bar">
                                                                     <i style={{"width": percentage +"%"}} className={ percentage >= 95 ? "bg-red" : "bg-lan"}></i>
                                                                 </span>
                                                             :
                                                                 null                                                                     
                                                         }
                                                         {
                                                             item.file_scan_num != null &&  item.file_scan_num > 0 ?
                                                                <span className="col-9"><span className="col-lan" style={{"paddingLeft":"2px","paddingRight":"2px"}}>{item.file_scan_num}</span>个可识图素材</span>
                                                             :
                                                                <span className="col-9">无任何可识图素材</span>    
                                                         }
                                                     </div>
                                                 </div>
                                      }) 
                                :
                                    null
                            :
                                loadingHtml3()                                                 
                          }                                                                                                      
                       </div>
                   </div>

                   <div className="panel-item other-panel" style={{"display":"none"}}>
                       <p className="title box-c">
                          <span className="tit-txt col-6 font-weight7 flex flex-c">
                              <i className="icons-local-material icons-10 lm-tit-bg"></i>
                              我的网络邻居（开发中...）
                          </span>
                          <span className="sp-line abs"></span>
                       </p>
                       <div className="list flex">
                          {
                              !loading || 1 == 1 ?
                                  <div className="item flex flex-c"
                                    onClick={this.selectPanelItem.bind(this)}>
                                       <div className="icons-40" style={{"marginRight": "10px"}}>
                                          <img className="icons-40" src="compress/img/nw-default-photo.png" alt="photo" />
                                       </div>
                                       <div className="info flex">
                                           <span className="col-0">用户名</span>
                                           <span className="col-9">IP:192.168.1.1</span>
                                       </div>
                                   </div>
                             :
                                loadingHtml3()                                                 
                          }                                                                                                      
                       </div>                       
                   </div> 
               </div>
          </div>
        )
    } 
    requestNewData(_route) {
        const data = objClone(getFileInitObjectData);
        data.mode = 1;
        data.is_refresh = true; 
        //keys只执行或存在一次，执行后删除keys属性名
        //路由route是引用传值，不删除的话一直会有keys属性名
        const routeData = _route && _route.data;
        if( routeData && routeData.keys === 'MOBILE-HARD-DISK' ){
            try{ delete routeData.keys }catch(e){
                 log('--删除属性名keys时出错啦--')
            }
        }else{
            //动态硬盘插入与拔出时不启用loading，其它情况启用loading...
            this.setState({loading: true})
        }      
        setTimeout(() => {
            log('---TotalPanels---盘符面板---请求新数据：')
            this.props.actionsLF.asyncgetFileRequest(data)
        }, 30)                
    }
    componentDidMount() {
        log('TotalPanels----->componentDidMount')
        log(this.props)
        if( this.props.files && this.props.files.common ) {
            //初始化common和底部显示信息的数据
            this.props.files.common = objClone(getFileInitObjectData);
            this.props.actions.fileInfoMessage(null);
            this.requestNewData(this.props.route)
        }
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.route && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
            //初始化common和底部显示信息的数据                             
            this.requestNewData(nextProps.route)
        }
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            if( nextProps.getConfig.types === 'INIT_GET_CONFIG_INFO' ||
                nextProps.getConfig.types === 'SET_GET_CONFIG_INFO' ){
                //配置信息修改后刷新
                this.requestNewData(nextProps.route)                   
            }
        }
        if( nextProps.files && nextProps.files.common && nextProps.files.common.mode === 1 && 
            nextProps.files.filesLastUpdated !== this.props.files.filesLastUpdated ){
            this.setState({
                loading: false,
                tempFiles: nextProps.files.driveLetter,
                mobileFiles: nextProps.files.mobileDrive
            })                
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }      
}
export default immutableRenderDecorator(TotalPanels)