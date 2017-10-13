import React, { Component, PropTypes } from 'react'

import { clientHeight } from '../../constants/DomConstant'
import { log, isEmpty } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { getmCustomScrollbar } from '../../constants/EventsConstant'

//我的字体--下载管理--正在下载
class DownloadingTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DownloadingTable");		
	}	
  downLoadPass(item, event) {
      event.stopPropagation();
      event.preventDefault();
      setTimeout(() => {
          item["download_state"] = -1
          this.props.actions.addGetDownloadFont(item.font_id, item)
      },10)             
        //this.props.actions.triggerDialogInfo({
        //  type: SHOW_DIALOG_ALERT,
        //  text: "此功能正在开发中",
        //  auto: true,
        //  speed: 1500,
        //  statu: 0
        //})                
  }  
	render() {
        const { downloading } = this.props
        return <div className="downloading-table">
                  <div className="thead">
                      <div className="col-1"><span></span></div>
                      <div className="col-2"><span></span></div>
                      <div className="col-3"><span className="left-10">进度</span></div>
                      <div className="col-4"><span className="left-10">字体文件名</span></div>
                  </div>
                  <ul className="table scllorBar_table" ref="clientHeight">
                      {
                        downloading.map((item, index) => {
                          const dp = isEmpty(item.downloaded_progress) ? 0 : item.downloaded_progress
                    return <li key={index}>
                              <div className="col-1">
                                 <span className="center">
                                 {
                                     index < 9 ?
                                        '0'+ (index+1) +''
                                     :
                                         (index+1)                                  
                                 }
                                 </span>
                              </div>
                              <div className="col-2">
                                  <span className="center">
                                    {
                                         item.download_state == 1 ? 
                                            <i className="icons icons-18 d-ing-bg"></i> 
                                         : 
                                         item.download_state == 2 ?
                                            <i className="icons icons-18 d-paused-bg" title="继续下载" onClick={this.downLoadPass.bind(this, item)}></i>
                                         :
                                         item.download_state == 3 ?
                                            <i className="icons icons-18 d-failed-bg"></i>
                                         :
                                            <i className="icons icons-18 d-queue-bg"></i>
                                    }
                                  </span>
                              </div>
                              <div className="title col-3">
                                  <span className="progress-bar left-10">
                                        <span className="progress-line">
                                           <i style={{"width": dp+"%"}} className="progress"></i>
                                        </span>                                  
                                  </span>
                                  <span className="progress-text">
                                     {
                                         item.download_state == 1 ? 
                                            parseInt(item.speed) + 'KB/s' 
                                         : 
                                         item.download_state == 2 ?
                                            "暂停中"
                                         :
                                         item.download_state == 3 ?
                                            "下载失败"
                                         :
                                            '排队中'      
                                      }
                                  </span>
                              </div>
                              <div className="col-4">
                                  <span className="item left-20">{item.file_name}</span>
                              </div>
                           </li>
                        })   
                      }
                  </ul>              
           </div>	               
	}
  componentDidMount() {
      clientHeight(this.refs.clientHeight,this.props.resize.h,138)
      getmCustomScrollbar($(".scllorBar_table"))
  }
  componentWillReceiveProps(nextProps) {

      if( nextProps.downloading && this.props.downloading && nextProps.downloading.length !== this.props.downloading.length ){
          getmCustomScrollbar($(".scllorBar_table"), null, 'destroy')
      }
  }
  componentDidUpdate(nextProps, nextState) {   
      if(nextProps.resize.h !== this.props.resize.h){
          clientHeight(this.refs.clientHeight,this.props.resize.h, 124) 
          getmCustomScrollbar($(".scllorBar_table"), null, 'update')
      }
      if( $(".scllorBar_table.mCustomScrollbar").length == 0 ){
          getmCustomScrollbar($(".scllorBar_table"))
      }else{
          getmCustomScrollbar($(".scllorBar_table"), null, 'update')
      }
  }  
}
export default DownloadingTable