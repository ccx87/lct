import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { log, isEmpty, getmCustomScrollbar, ellipsisStr } from '../../constants/UtilConstant'

import ScanResultPageBar from './ScanResultPageBar'

//扫描结果列表
class ScanResultItem extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            isLoading: false
        };
        this.loadingFn = this.loadingFn.bind(this);
      	log("ScanResultItem--扫描结果列表");		
  	}
    loadingFn() {
        this.setState({
            isLoading: true
        })
        //清除滚动条
        getmCustomScrollbar($('.scllorBar-scan-result'), null, 'destroy');
    }    	   
    openFileLocal(path, event) {
        event.stopPropagation();
        event.preventDefault();
        try{
            window.openFileRequest(2, path) 
        }catch(e){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "打开文件(夹)失败",auto: true,speed: 1500,statu: 0})
        }        
    }    
    render() {
        const { resultData } = this.props
        const { isLoading } = this.state
        return (
                <div className="scllor-content-none h-full flex flex-c flex-dir-column">
                    <div className="flex flex-c sc-head flex-item-gsb-0">
                        <span className="col-6 font-weight7 flex-item-gsb-0 file-path">文件路径</span>
                        <span className="col-6 font-weight7 flex-item-gsb-1 file-fail-type flex flex-c-c">类型</span>
                        <span className="col-6 font-weight7 flex-item-gsb-1 file-fail-info">原因</span>
                    </div>
                    <div className="sc-content scllorBar-scan-result flex-item-gsb-1">
                         {
                            !isLoading ?
                                resultData && resultData.ng_list && resultData.ng_list.length > 0 ?  
                                   <ul className="sc-ul w-full">
                                       {
                                           resultData.ng_list.map((item, index) => {
                                              return <li key={index} className="sc-li flex flex-c col-6">
                                                         <div className="flex flex-c file-path flex-item-gsb-0">
                                                             <i className="icons icons-20 fn-postion flex-item-gsb-0" onClick={this.openFileLocal.bind(this,item.file_path)}></i>
                                                             <span className="text path-text w-full">{item.file_path}</span>
                                                             {
                                                                  !isEmpty(item.file_path) ?
                                                                     <div className="hide-msg">
                                                                         {item.file_path}
                                                                     </div>
                                                                  :
                                                                     null                                                      
                                                             }                                                         
                                                         </div>
                                                         <div className="flex flex-c flex-c-c flex-item-gsb-1 file-fail-type">
                                                             {
                                                                item.is_skipped_error ?
                                                                   <span className="col-6">忽略</span>
                                                                :
                                                                   <span className="col-red">失败</span>    
                                                             } 
                                                         </div>
                                                         <div className="flex flex-c flex-item-gsb-1 file-fail-info">
                                                             <span className="text msg-text w-full">{item.error_info}</span>
                                                             {
                                                                 !isEmpty(item.error_info) ?
                                                                     item.is_skipped_error ?
                                                                         <div className="hide-msg">
                                                                             {item.error_info}
                                                                         </div>
                                                                     :
                                                                         <div className="hide-msg col-red">
                                                                             {item.error_info}
                                                                         </div>                                                                                                                                                     
                                                                  :
                                                                     null                                                      
                                                             }                                                   
                                                         </div>
                                                     </li>
                                            })
                                       }
                                   </ul>                                
                                :
                                    <p className="no-data flex flex-c flex-c-c flex-dir-column">
                                        <i className="icons-50 icons-scan result-bg"></i>
                                        <span className="col-6 font-weight7">当前页暂无失败记录</span>
                                    </p>
                            :
                                <div className="flex flex-c flex-c-c h-full">
                                    {loadingHtml3('请求数据中，请稍候...')}
                                </div>                                                                                                  
                         }
                    </div>
                    <ScanResultPageBar {...this.props} loadingFn={this.loadingFn}/>
                </div>    
        )
    }   
    componentDidMount() {
        //1样式，初始化加载滚动条
        if( this.props.resultData ){
            getmCustomScrollbar($('.scllorBar-scan-result'));
        }
    } 
    componentWillReceiveProps(nextProps) {
        if( nextProps.resultData ){
            if( this.state.isLoading ){
                //更新刷新状态
                this.setState({
                    isLoading: false
                })                        
            } 
        }
    }
    componentDidUpdate(nextProps, nextState) {
        log("ScanResultItem----componentDidUpdate")
        log(nextProps)
        log(this.props)
        //列表滚动条-处理
        if( !this.state.isLoading && this.props.resultData ){
            if($('.scllorBar-scan-result.mCustomScrollbar').length <= 0 ){
                //2样式，初始化加载滚动条
                getmCustomScrollbar($('.scllorBar-scan-result'))
            }else{
                getmCustomScrollbar($('.scllorBar-scan-result'), null, 'update')
            }
        }
    }           	  
}
export default immutableRenderDecorator(ScanResultItem)