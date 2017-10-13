import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { render } from 'react-dom'

import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { log, isEmpty, hasClass, addClass, removeClass, getmCustomScrollbar2, getChatMessage, getStringCode } from '../../constants/UtilConstant'

class ChatIng extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            msgShow: {
              show: false,
              text: '' 
            }        
        };
      	log("ChatIng");		
  	}	
    stateMsg(text) {
        this.setState({
          msgShow: {
            show: true,
            text: text                 
          }
        })
        setTimeout(() => {
          this.setState({
            msgShow: {
              show: false,
              text: ''
            }
          })              
        },1500)
    }
    eventsKeyDown(event) {
        var keyCode = window.event ? event.keyCode : event.which;
        if( event.ctrlKey && keyCode == 13 ) {
            this.testMessage()
        } 
        return false  
    } 
    testMessage() {
        const inputDom = this.refs.sendMessageRef;
        if( isEmpty(inputDom) ){
            return false; 
        }
        try{
            if( isEmpty($.trim(inputDom.value)) ){
                this.stateMsg('请输入文字信息')
                return false;
            }
        }catch(e){
            this.stateMsg('输入了非法字符')
            return false;
        }

        this.props.Fn.sendText(this.props.route.data.account, inputDom.value)
        if( this.refs.sendMessageRef ){
            this.refs.sendMessageRef.value = ''
        } 
    }  
    inDevelopment(event) {
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "正在开发中，敬请期待",auto: true,speed: 1500,statu: 0})
    }
    renderToNewMessage(item, index) {
        const newtext = getStringCode(item.text)
        return  <div key={index} className="cml-item to-news out-msg">
                    <div className="flex flex-l flex-r-r bg-mode-white col-6">
                        <div className="item-con flex flex-c flex-l-l">
                           <span style={{"whiteSpace": "pre-wrap"}} dangerouslySetInnerHTML={{__html: newtext}}></span>
                           <b className="right-arrow">
                              <i className="right-arrow1"></i>
                              <i className="right-arrow2"></i>
                           </b> 
                        </div>
                        <div className="item-photo flex flex-c flex-c-c flex-item-gsb-0">
                            <img src={this.props.yxData && this.props.yxData.myInfo ? this.props.yxData.myInfo.avatar : "compress/img/avatar.png"} alt=""/>
                        </div>
                    </div>
                </div>
    }
    renderFromNewMessage(item, index) {
        const { route } = this.props
        const newtext = getStringCode(item.text)
        return  <div key={index} className="cml-item from-news in-msg">
                    <div className="flex flex-l flex-l-l bg-mode-dae5f2 col-6">
                        <div className="item-photo flex flex-c flex-c-c flex-item-gsb-0">
                            <img src={route && route.data ? route.data.avatar : "compress/img/avatar.png"} alt=""/>
                        </div>                
                        <div className="item-con flex flex-c flex-l-l">
                          <span style={{"whiteSpace": "pre-wrap"}} dangerouslySetInnerHTML={{__html: newtext}}></span>
                          <b className="left-arrow">
                              <i className="left-arrow1"></i>
                              <i className="left-arrow2"></i>
                          </b> 
                        </div>
                    </div>
                </div>        
    }
    renderWaitDom() {
        return <div className="cml-item wait-dom"></div>
    }
    render() {
      const { route, yxData, chatWindowData } = this.props
      const { msgShow } = this.state
      return (
          <div className="cw-ing flex-in flex-item-gsb-1 flex-dir-column">
              <div className="cw-title font-weight7 chat-to-name flex flex-c flex-c-c flex-item-gsb-0">
                  {
                    route && route.data ?
                       route.data.alias && route.data.alias != 'undefined' ?
                          route.data.alias
                       :    
                          route.data.nick 
                    : 
                       "--"
                  }
              </div>
              <div className="scllorBar-panel">
                  <div className="cw-content chat-news-list flex flex-dir-column flex-item-gsb-1" id="CWConter">
                      {
                          chatWindowData ?
                              chatWindowData.length > 0 ?
                                  chatWindowData.map((item, index) => {
                                      if( item.flow == "out" ){
                                          return this.renderToNewMessage(item, index)
                                      }else{
                                          return this.renderFromNewMessage(item, index)
                                      }
                                  })
                              :
                                  null
                          :
                              null        
                      }
                  </div>
              </div>
              <div className="cw-bottom flex flex-c flex-c-c flex-item-gsb-0 flex-dir-column" onKeyDown={this.eventsKeyDown.bind(this)}>
                  <ul className="flex flex-c flex-l-l send-other-ul">
                      <li className="icons-20" onClick={this.inDevelopment.bind(this)}><i className="icons-local-material icons-20 cw-b-open-file"></i></li>
                      <li className="icons-20" onClick={this.inDevelopment.bind(this)}><i className="icons-local-material icons-20 cw-b-cut"></i></li>
                  </ul>
                  <textarea className="textarea-write flex-item-gsb-1" ref="sendMessageRef" style={{"resize":"none"}}></textarea>
                  <div className="flex flex-c flex-r-r" style={{"width":"100%", "position": "relative"}}>
                      {
                          msgShow.show ?
                              msgAlertHtml(msgShow.text, 'col-3')
                          :
                              null   
                      }                      
                     <button type="button" className="button send-btn" onClick={this.testMessage.bind(this)}>发送</button>
                  </div>
              </div>
          </div>
      )
    } 
    componentDidMount() { 
        console.log('初始化房间！！！！')
        getmCustomScrollbar2($('.scllorBar-panel'), null, 10)
        $('.scllorBar-panel').mCustomScrollbar('scrollTo','bottom')                             
    }
    componentWillReceiveProps(nextProps) {
        console.log("ChatIng----componentWillReceiveProps",nextProps, this.props)
    } 
    componentDidUpdate(nextProps, nextState) {
        console.log("ChatIng----componentDidUpdate",nextState, this.state)
        if( $('.scllorBar-panel').length > 0 ){
            $('.scllorBar-panel').mCustomScrollbar('scrollTo','bottom') 
        }
        if( this.refs.sendMessageRef ){
            this.refs.sendMessageRef.focus()
        }
    }      
}
export default ChatIng
// <button type="button" className="button flex-item-gsb-0">分享文件</button>
// <input type="text" className="input-write flex-item-gsb-1" ref="sendMessageRef" placeholder="输入文字信息"/>