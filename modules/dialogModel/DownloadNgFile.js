import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty, formatSize, getEncodeURIComponentPath } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { msgAlertSuccessHtml, msgConfirmHtml } from '../../constants/RenderHtmlConstant'

/* 弹出层--素材下载  */
class DownloadNgFile extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
           progress: 0,
           status: 0, //0正在下载，1下载成功，2下载失败
           dlText: '下载中...',
           speed: '0KB/s',
           path: null,
           showAlert: {
              show: false,
              data: null
           },
           showConfirm: {
              show: false,
              data: null
           }
        };
      	log("DownloadNgFile");		
  	}
	  render() {
        const { progress, status, dlText, speed, showConfirm, showAlert } = this.state
        const elem = this.props.dialogData.data || {}
        let imgSrc = elem && elem.thumb_image && elem.thumb_image.path && elem.thumb_image.path[0]
        if( isEmpty(imgSrc) ){
            imgSrc = getEncodeURIComponentPath(elem);          
        }
  		  return <div className="dialog download-ng-layer" ref="verticalCenter">
                   {
                      showConfirm.show ?
                         msgConfirmHtml(showConfirm.data)
                      :
                         null
                   }
                   {
                      showAlert.show ?
                          msgAlertSuccessHtml(showAlert.data, 'false') 
                      : 
                          null 
                   }
                   <div className="dialog-title first-title flex flex-c">
                       <span style={{"width": "100%"}}>素材下载</span>
                       <a className="close-dialog" onClick={this.closeDownload.bind(this)}><i className="shitu-icon icons-20 close-dialog-bg2"></i></a>
                   </div>
                   <div className="dialog-content flex flex-r-r">
                       <img className="photo flex-item-gsb-0" src={imgSrc}/>
                       <div className="info flex-item-gsb-1">
                          <div>邻居名称：{elem.user_name || '--'}</div> 
                          <div>文件名称：{elem.file_name}</div>
                          <div className="flex flex-c">
                             <div className="flex-item-gsb-0">下载进度：</div>
                             {
                                 status === 0 ?
                                   <div className="flex flex-c downloading flex-item-gsb-1">
                                     <div className="progress flex-item-gsb-0">
                                        <i className="val" style={{"width": progress+"%"}}></i>
                                     </div>
                                     <div className="speed flex-item-gsb-1">
                                        <span style={{"marginRight":"10px", "marginLeft":"5px"}}>{progress+"%"}</span>
                                        <span>{speed+"/s"}</span>
                                     </div>  
                                   </div>
                                 :
                                   <div className="result flex-item-gsb-1 flex flex-c">
                                      {
                                          status === 1 ?
                                            <i className="shitu-icon icons-20 scuuess-bg"></i>
                                          :
                                            <i className="shitu-icon icons-20 fail-bg"></i>   
                                      }
                                      {
                                        status === 1 ?
                                           <span className="success">{dlText}</span>
                                        :
                                           <span className="fail">{dlText}</span> 
                                      }
                                   </div>                                 
                             }
                          </div>
                       </div>  
                   </div>
                   {
                       status === 1 ?
                           <div className="dialog-footer flex flex-c flex-r-r">
                                <button className="dialog-btn button confirm-btn" onClick={this.openFile.bind(this)}>打开位置</button>
                                <button className="dialog-btn button cancel-btn" onClick={() => this.props.actions.triggerDialogInfo(null)}>关闭</button>
                           </div>
                       :
                       status === 2 ?
                           <div className="dialog-footer flex flex-c flex-r-r">
                                <button className="dialog-btn button confirm-btn" onClick={this.downloadAgain.bind(this)}>重新下载</button>
                                <button className="dialog-btn button cancel-btn" onClick={() => this.props.actions.triggerDialogInfo(null)}>取消</button>
                           </div>
                       :
                           null                                      
                   }                   
  		         </div>  
  	}
    openFile(event) {
        event.stopPropagation()
        event.preventDefault()
        if( !this.state.path ){
           this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "路径不存在",auto: true,speed: 3000})
           return 
        }
        try{
           window.openFileRequest(2, this.state.path)  
        }catch(e){}
    }
    closeDownload() {
        if( this.state.status != 0 ){
            this.props.actions.triggerDialogInfo(null)
            return
        }
        this.setState({
           showAlert: {
              show: false,
              data: null
           },
           showConfirm: {
              show: true,
              data: {
                 title: '提示',
                 text: '当前正在下载素材，确定要退出下载吗？',
                 onConfirm: () => {
                     const data = this.props.dialogData && this.props.dialogData.data;
                     if( !data ){
                        this.props.actions.triggerDialogInfo(null)
                        return
                     }
                     this.setState({
                         showAlert: {
                            show: true,
                            data: '正在停止下载...'
                         },
                         showConfirm: {
                            show: false,
                            data: null
                         }                          
                     })
                     setTimeout(() => {
                        let ys;
                        try{
                           ys = window.stopDownloadImage(data.user_id, data.local_ip, data.local_port, data.image_id)
                        }catch(e){
                           console.log('调用window.stopDownloadImage出错') 
                        }
                        this.setState({
                           showAlert: {
                              show: false,
                              data: null
                           }
                        })
                        console.log(ys,6666)
                        this.props.actions.triggerDialogInfo(null)
                     }, 100)
                 },
                 onClose: () => {
                    this.setState({
                       showAlert: {
                          show: false,
                          data: null
                       },
                       showConfirm: {
                          show: false,
                          data: null
                       }                          
                    }) 
                 }
              } 
           }
        })
    }
    downloadAgain() {
        this.setState({
            status: 0,
            progress: 0,
            speed: '0KB/s',
            path: null,
            dlText: '下载中',
            showConfirm: {
               show: false,
               data: null
            },
            showAlert: {
               show: false,
               data: null
            }            
        })
        this.getDownloadData(this.props.dialogData.data)
    }
    getDownloadData(data) {
        if( !data ) return;
        try{
            window.downloadImage(data.user_id, data.local_ip, data.local_port, data.image_id)
        }catch(e){
            log('window.downloadImage调用出错')
        }
    }
  	componentDidMount() {
    		if( this.refs.verticalCenter ){
            absVerticalCenter2(this.refs.verticalCenter)
    		}	
        //调用下载接口
        this.getDownloadData(this.props.dialogData.data)       
  	} 
    componentWillReceiveProps(nextProps) { 
        //js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
                log('---返回数据为空---')
                return;
            } 
            const jsVal = jsData.data;        
            switch( jsModule ){
                case 'DownloadImageState':
                    this._DownloadImageState(jsVal)
                break;
            }
        }              
    }   
    componentDidUpdate() {
        //title可拖动
        const parElem = document.querySelector('.download-ng-layer'),
            dragElem = parElem && parElem.querySelector('.first-title'),
            cfDom = document.querySelector('.confirm-dialog-layer'),
            alertDom = document.querySelector('.alert-dialog-layer'); 
        if( dragElem ){         
            dragDrop(dragElem, parElem)
        } 
        if( cfDom ){
           absVerticalCenter2(cfDom)
        }   
        if( alertDom ) {
           absVerticalCenter2(alertDom)
        }    
    }
    _DownloadImageState(jsVal) {
        if( !jsVal ) {
            this.setState({
                status: 2,
                dlText: '下载失败'
            })
        }else{
            if( jsVal.error_code == 0 ){
                if( jsVal.progress < 100 ){
                    this.setState({
                        status: 0,
                        progress: jsVal.progress,
                        speed: formatSize(jsVal.speed),
                        dlText: '下载中'
                    })                    
                }else{
                    this.setState({
                        status: 0,
                        progress: 100,
                        path: jsVal.file_path,
                        speed: formatSize(jsVal.speed),
                        dlText: '下载中',
                        showConfirm: {
                           show: false,
                           data: null
                        },
                        showAlert: {
                           show: false,
                           data: null
                        }
                    })
                    setTimeout(() => {
                        this.setState({
                            status: 1,
                            progress: 100,
                            speed: '0KB/s',
                            path: jsVal.file_path,
                            dlText: '下载成功'
                        })
                    }, 300)
                }
            }else{
                this.setState({
                    status: 2,
                    dlText: jsVal.error_info || '下载失败'
                })
            }
        }
    }			
}
const mapStateToProps = (state) => {
   return {
        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated     
    }
}
export default connect(
  mapStateToProps
)(DownloadNgFile)
