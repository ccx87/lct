import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty, ellipsisStr } from '../../constants/UtilConstant'

import ScanExecution from './ScanExecution'

//当前扫描
class ScanCurrent extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            num: 0
        };
      	log("ScanCurrent--当前扫描");		
  	}	       		
    render() {
        const { thisData, progressData, resultData, activePage, dialogData } = this.props
        let diff = 0; 
        //if( resultData && (activePage == 3 || activePage == 4) ){
        //    diff = resultData.sum_cnt-resultData.ok_cnt-resultData.ng_cnt;
        //    if( isNaN(diff) || !(diff >= 0) ) diff = 0;
        //}
        return (
          <div className="scan-current-panel flex-item-gsb-0">
            <div className="scan-current flex flex-c flex-dir-column flex-item-gsb-1">
              {
                  activePage == 0 ?
                      <div className="w-full sc-runing flex flex-c flex-c-c flex-dir-column">
                          <div className="w-full sc-tit flex-self-l flex flex-c col-bai">
                              <div className="flex-item-gsb-0 sc-tit-text">
                                  <p className="main-t">扫描准备中，请耐心等候...</p>
                              </div>
                              <ScanExecution {...this.props} hideSE={true}/>
                          </div>
                      </div>
                  :
                  activePage == 1 ?
                      <div className="w-full sc-runing flex flex-c flex-c-c flex-dir-column">
                          <div className="w-full sc-tit flex-self-l flex flex-c col-bai">
                              <div className="flex-item-gsb-0 sc-tit-text">
                                 <p className="main-t">{thisData && thisData.scan_content ? thisData.scan_content : "素材预览图生成中..."}</p>
                              </div>
                              <ScanExecution {...this.props}/>
                          </div>
                          <div className="w-full sc-text flex-self-l col-bai flex-dir-column">
                              <p className="run-text flex flex-c">
                                <span className="flex-item-gsb-0 font-weight7">发现素材：</span>
                                <span className="flex-item-gsb-0">{thisData && thisData.sum_cnt > 0 ? thisData.sum_cnt : 0}</span>
                              </p>
                              <p className="run-text flex flex-c">
                                  <span className="flex-item-gsb-0 font-weight7">正在处理：</span>
                                  <span className="flex-item-gsb-0 temp-text">{thisData && thisData.file_path ? thisData.file_path : "--"}</span>
                              </p>
                          </div>
                      </div>
                  :
                  activePage == 2 ?
                      <div className="w-full sc-runing flex flex-c flex-c-c flex-dir-column">
                          <div className="w-full sc-tit flex-self-l flex flex-c col-bai">
                              <div className="flex-item-gsb-0 sc-tit-text">
                                 <p className="main-t">{thisData && thisData.scan_content ? thisData.scan_content : "正在从服务器获取识图信息..."}</p>
                              </div>
                              <ScanExecution {...this.props}/>
                          </div>
                      </div>
                  :
                  activePage == 3 ?
                      <div className="w-full sc-runing flex flex-c flex-c-c flex-dir-column">
                          <div className="w-full sc-tit flex-self-l flex flex-c col-bai">
                              <div className="flex-item-gsb-0 sc-tit-text">
                                 <p className="main-t">{thisData && thisData.scan_content ? thisData.scan_content : "扫描结束"}</p>
                              </div>
                              <ScanExecution {...this.props}/>
                          </div>
                          <div className="w-full flex-self-l note-text opacity9 font-size-12 col-bai">
                              以下信息为预览图生成成功和失败的数量，一个素材可能拥有多个预览图
                          </div>                          
                          <div style={{"marginTop":"5px"}} className="sc-text flex flex-c flex-self-l col-bai font-weight7">
                                <span className="flex-item-gsb-0 flex flex-c">
                                   <i className="icons-20 icons-scan scan-ok-success"></i>
                                   成功：{resultData ? resultData.ok_cnt : 0} 
                                </span>
                                <span className="flex-item-gsb-0 flex flex-c">
                                   <i className="icons-20 icons-scan scan-ok-fail"></i>
                                   失败：{resultData ? resultData.ng_cnt : 0} 
                                </span>
                                <span className="flex-item-gsb-0 flex flex-c">
                                   <i className="icons-20 icons-scan scan-untreated-bg"></i>
                                   忽略：{resultData ? resultData.skip_cnt : 0}
                                </span>                                                                                                                             
                          </div>
                      </div>
                  :
                  activePage == 4 ?
                       <div className="scan-current flex flex-c flex-dir-column flex-item-gsb-1">
                          <div className="sc-text flex flex-c flex-self-l">
                              <span className="flex-item-gsb-0 flex flex-c">
                                 <i className="icons-20 icons-scan scan-ok-success"></i>
                                 成功：{resultData ? resultData.ok_cnt : 0} 
                              </span>
                              <span className="flex-item-gsb-0 flex flex-c">
                                 <i className="icons-20 icons-scan scan-ok-fail"></i>
                                 失败：{resultData ? resultData.ng_cnt : 0} 
                              </span>
                              <span className="flex-item-gsb-0 flex flex-c">
                                 <i className="icons-20 icons-scan scan-untreated-bg"></i>
                                 忽略：{resultData ? resultData.skip_cnt : 0} 
                              </span>                                                                                                          
                          </div>
                      </div>
                  :
                      <div className="w-full sc-runing flex flex-c flex-c-c flex-dir-column">
                          <div className="w-full sc-tit flex-self-l flex flex-c col-bai">
                              <div className="flex-item-gsb-0 sc-tit-text">未获取到扫描页面状态</div>
                              <ScanExecution {...this.props}/>
                          </div>
                      </div>                                              
              }
            </div>
          </div>
        )
    }	
    componentDidUpdate(nextProps, nextState) {
        const tempTextDom = document.querySelector('.temp-text');
        if( tempTextDom ){
            ellipsisStr(tempTextDom.innerText, tempTextDom, 393, 'center')
        }
    }  
}
export default immutableRenderDecorator(ScanCurrent)