import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, getmCustomScrollbar5, getmCustomScrollbar2 } from '../../constants/UtilConstant'
import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { MY_SCAN_MSG_FILTER } from '../../constants/DataConstant'
import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT, SEARCH_SCAN_MSG } from '../../constants/TodoFilters'

import SearchInput from '../../modules/smallModel/SearchInput'

class Msglist extends Component {
  	constructor(props) {
      	super(props);
        this.state = {};
      	log("Msglist");		
  	}	
    render() {
        const { filter, onMsgFilter, onSearchMsg, msgListArray, msgPost } = this.props
        return (
            <div className="m-type-summary" style={{"height":"calc(100% - 35px)"}}>
                <div className="sf-top">
                    <div className="m-left" style={{"display":"none"}}>
                        <span className="sp">筛选：</span>
                        <ul>
                            {
                                MY_SCAN_MSG_FILTER.map(item => {
                                   const classes = item.text == filter.text ? "active" : null
                                   return <li key={item.key} className={classes} onClick={() => onMsgFilter(item)}>{item.text}</li> 
                                })
                            }
                        </ul>
                    </div>
                    <div className="m-right">
                        <SearchInput type={{search: "请输入文件名称搜索", keyWord: msgPost.key}} mode={SEARCH_SCAN_MSG} onEvents={onSearchMsg}/>
                    </div>
                </div>
                <div className="ts-table default-table-1" style={{"height":"calc(100% - 30px)"}}>
                    <table className="tb-thead">
                        <thead>
                            <tr>
                                <td className="td-1">素材文件位置<span className="col-6">（共 {MY_SCAN_MSG_FILTER[0].value} 条）</span></td>
                                <td className="td-2">类型</td>
                                <td className="td-3">详情</td>
                            </tr>
                        </thead>
                    </table>
                    {
                        msgListArray ?
                            msgListArray.length > 0 ?
                                <div className="scroll-list" style={{"height":"calc(100% - 31px)"}}>
                                    <table className="tb-tbody">
                                        <tbody> 
                                            {
                                                msgListArray.map((item, index) => {
                                                    return  <tr key={index}>
                                                                <td className="td-1">
                                                                    <i className="icons icons-20 font-open-bg" onClick={() => this.props.actions.openFileRequest(2, item.file_path)}></i>
                                                                    <span className="td-1-sp">{isEmpty(item.file_path) ? "--" : item.file_path}</span>
                                                                    {
                                                                        !isEmpty(item.file_path) ?
                                                                            <div className="hide-msg">
                                                                                {item.file_path}
                                                                            </div>
                                                                        :
                                                                            null                                                      
                                                                    }                                                                    
                                                                </td>
                                                                <td className="td-2">
                                                                    {
                                                                        item.is_skipped_error ?
                                                                            <span className="col-6">忽略</span>
                                                                        :
                                                                            <span className="col-red">出错</span>                                                
                                                                    }
                                                                </td>
                                                                <td className="td-3">
                                                                    <p className="msg-info col-6">{isEmpty(item.error_info) ? "--" : item.error_info}</p>
                                                                    {
                                                                        !isEmpty(item.error_info) ?
                                                                            item.is_skipped_error ?
                                                                                <div className="hide-msg col-6">
                                                                                    {item.error_info}
                                                                                </div>
                                                                            :
                                                                                <div className="hide-msg col-red">
                                                                                    {item.error_info}
                                                                                </div>                                                                                                                                                     
                                                                        :
                                                                            null                                                      
                                                                    }                                                                    
                                                                </td>
                                                            </tr>
                                                })
                                            }                                                                                                                                                                                                                        
                                        </tbody>
                                    </table>                                    
                                </div>
                            :
                                <div className="default-div" style={{"height":"calc(100% - 26px)"}}>
                                    <div className="no-data">
                                        <img src="compress/img/data-default.png"/>
                                        <p>没有相应的扫描报告</p>
                                    </div>                                    
                                </div>                                    
                        :
                            <div className="default-div" style={{"height":"calc(100% - 26px)"}}>
                                {loadingHtml3()}
                            </div>
                    }
                </div>
            </div>                  
        )
    }      
    initMcScroll() {
        const scrollDom = document.querySelector('.m-type-summary .scroll-list');
        if( scrollDom ){
            if( scrollDom.classList.contains('mCustomScrollbar') ){
                getmCustomScrollbar2($('.m-type-summary .scroll-list'), 'update')
            }else{
                getmCustomScrollbar5($('.m-type-summary .scroll-list'), this.props.msgPost)
            }
        }        
    }
    componentDidMount() {
        this.initMcScroll()
    }      
    componentDidUpdate(nextProps, nextState) {
        if( this.props.msgAt !== nextProps.msgAt ){
            if( this.props.msgPost.page_num == 0 ){
                this.initMcScroll()
            }else{
                const scrollDom = document.querySelector('.m-type-summary .scroll-list');
                if( scrollDom ){
                    if( scrollDom.classList.contains('mCustomScrollbar') ){
                        getmCustomScrollbar2($('.m-type-summary .scroll-list'), 'update')
                    }
                }            
            } 
        }     
    }      
}
export default (immutableRenderDecorator(Msglist))
