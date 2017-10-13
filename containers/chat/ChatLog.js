import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'

import { msgAlertHtml, loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { HISTORY_SESSION_TAB } from '../../constants/DataConstant'
import { SHOW_DIALOG_ALERT, SHOW_HISTORY_SESSION, SHOW_HISTORY_FILE } from '../../constants/TodoFilters'
import { log, isEmpty, hasClass, addClass, removeClass, getmCustomScrollbar, getTime, dateBooleanDiff, getChatMessage, getStringCode } from '../../constants/UtilConstant'

import Switch from '../../modules/Switch'

class ChatLog extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            filter: SHOW_HISTORY_SESSION,
            historyData: null,
            historyFileData: null
        };
      	log("ChatLog");		
  	}	
    handleShow(filter) {
        if( $('.scllorBar-histroy').length > 0 ){
            getmCustomScrollbar($('.scllorBar-histroy'), null, 'destroy') 
        }
        this.setState({ filter })
    }  
    renderTipHtml() {
        return  <div className="no-data flex flex-c flex-c-c col-9" style={{"height":"100%"}}>
                    <div className="flex flex-c flex-c-c flex-dir-column">
                      <i className="icons-40 data-default-bg"></i> 
                      <p className="text">暂无消息记录</p>
                    </div>                                    
                </div>         
    }  
    render() {
        const { yxData, chatWindowData } = this.props
        const { filter, historyData, historyFileData } = this.state
        let classes = 'log-content';
        if( filter === SHOW_HISTORY_SESSION && chatWindowData && chatWindowData.length > 0 ){
            classes += ' scllorBar-histroy';
        }
        if( filter === SHOW_HISTORY_FILE && historyFileData && historyFileData.length > 0 ){
            classes += ' scllorBar-histroy';
        }
        return (
            <div className="cw-log flex flex-item-gsb-0 flex-dir-column">
                <div className="cw-title font-weight7 log-list flex flex-c flex-l-l flex-item-gsb-0">消息记录</div>
                <Switch options={HISTORY_SESSION_TAB} filter={filter} onShow={this.handleShow.bind(this)}/>
                <div className={classes}>
                    {
                        filter === SHOW_HISTORY_SESSION ?
                            chatWindowData ?
                                chatWindowData.length > 0 ?
                                    <ul className="history-session flex flex-dir-column">
                                        {
                                            chatWindowData.map((item, index) => {
                                                const hms = getTime(item.time, "hh:mm:ss"),
                                                      newtext = getStringCode(item.text)
                                                let yMd = getTime(item.time, "yy-MM-dd"),
                                                    prevDate = '',
                                                    anDay = false;      
                                                if( index > 0 ){   
                                                   prevDate = getTime(chatWindowData[index-1].time, "yy-MM-dd");   
                                                   anDay = dateBooleanDiff(yMd, prevDate);
                                                }else{
                                                   prevDate = getTime(chatWindowData[0].time, "yy-MM-dd");   
                                                   anDay = dateBooleanDiff(yMd, prevDate);                                              
                                                }
                                                if( !anDay ){
                                                    return <li key={index} className="flex flex-dir-column">
                                                               {
                                                                   index == 0 ?
                                                                      <p className="day-line flex flex-c flex-c-c col-9">――{prevDate}――</p>
                                                                   :
                                                                      <p className="day-line flex flex-c flex-c-c col-9">――{yMd}――</p>   
                                                               }
                                                               {
                                                                   item.flow == "out" ?
                                                                      <p className="p-info col-21ad74">
                                                                         <span className="out-name">{item.fromNick}</span>
                                                                         <span className="out-time">{hms}</span>
                                                                      </p>
                                                                   :
                                                                      <p className="p-info col-0c73c2">
                                                                         <span className="in-name">{item.fromNick}</span>
                                                                         <span className="in-time">{hms}</span>
                                                                      </p>   
                                                               } 
                                                               <p className="p-con col-6">
                                                                  <span style={{"whiteSpace": "pre-wrap"}} dangerouslySetInnerHTML={{__html: newtext}}></span>
                                                               </p>
                                                           </li>                                            
                                                } else {          
                                                    return <li key={index} className="flex flex-dir-column">
                                                               {
                                                                   index == 0 ?
                                                                      <p className="day-line flex flex-c flex-c-c col-9">――{prevDate}――</p>
                                                                   :
                                                                      null   
                                                               } 
                                                               {
                                                                   item.flow == "out" ?
                                                                      <p className="p-info col-21ad74">
                                                                         <span className="out-name">{item.fromNick}</span>
                                                                         <span className="out-time">{hms}</span>
                                                                      </p>
                                                                   :
                                                                      <p className="p-info col-0c73c2">
                                                                         <span className="in-name">{item.fromNick}</span>
                                                                         <span className="in-time">{hms}</span>
                                                                      </p>   
                                                               } 
                                                               <p className="p-con col-6">
                                                                    <span style={{"whiteSpace": "pre-wrap"}} dangerouslySetInnerHTML={{__html: newtext}}></span>                                                               
                                                               </p>
                                                           </li>
                                                }
                                            })
                                        }
                                    </ul>
                                :    
                                    this.renderTipHtml()
                            :
                                loadingHtml2('正在加载中，请稍候')        
                        :
                            historyFileData ?
                                historyFileData.length > 0 ?
                                    <ul className="history-file">
                                    {
                                        historyFileData.map((item, index) => {
                                            return <li>历史文件</li>
                                        })
                                    }
                                    </ul>
                                :
                                    this.renderTipHtml()
                            :
                                loadingHtml2('正在加载中，请稍候')                   
                    }
                </div>
            </div> 
        )
    }
    componentDidMount() { 
        console.log('初始化历史消息！！！！')               
    } 
    componentWillReceiveProps(nextProps) {
        
    } 
    componentDidUpdate(nextProps) {
        if( !$('.scllorBar-histroy').hasClass('mCustomScrollbar') ){
            getmCustomScrollbar($('.scllorBar-histroy'))
        }
    }       
}
export default ChatLog
