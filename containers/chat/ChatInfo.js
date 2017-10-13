import React, { Component, PropTypes } from 'react'

import { CHAT_ROUTES } from '../../constants/DataConstant'
import { SHOW_ADD_FRIENDS, SHOW_DIALOG_LOGIN_LAYER, SHOW_DIALOG_CONFIRM, NOT_LOGIN_UNACTIVE } from '../../constants/TodoFilters'
import { log, isEmpty } from '../../constants/UtilConstant'

class ChatInfo extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            inputNick: false,
            inputRemark: false
        };
      	log("ChatDefault");		
  	}
    updataNick(event) {
        this.setState({
            inputNick: !this.state.inputNick
        })
    }
    updataRemark(event) {
        this.setState({
            inputRemark: !this.state.inputRemark
        })        
    } 
    inputRemarkBlur(event) {
        const val = event.currentTarget.value;
        if( this.props.route.data && val == this.props.route.data.nick ) {
            this.updataNick()
            return false
        }
        if( isEmpty(val) || !this.props.route.data ){
            this.updataNick()
            return false;
        }
        this.props.Fn.updateFriend(this.props.route.data.account, val)
    } 
    inputNickBlur(event) {
        const val = event.currentTarget.value;
        if( this.props.route.data && val == this.props.route.data.nick ) {
            this.updataNick()
            return false
        }
        if( isEmpty(val) ){
            this.updataNick()
            return false;
        }
    }
    routeFriend(item, event) {
        log("点击菜点--跳转聊天窗口")
        event.stopPropagation();
        event.preventDefault();
        const routeData = CHAT_ROUTES[2];
        routeData['data'] = item;
        setTimeout(() => {
           this.props.actions.getInItRoute({
                route: routeData
            })
        },10)                   
    }        
    render() {
        const { login, route } = this.props
        const { inputRemark, inputNick } = this.state
        return (
            route && route.data ?
                <div className="chat-info flex flex-c flex-c-c col-6">
                    <div className="info-panel flex flex-c flex-c-c flex-dir-column col-9">
                        <p className="info-photo flex flex-c flex-c-c"><img src={!isEmpty(route.data.avatar) ? route.data.avatar : "compress/img/avatar.png"} alt="photo"/></p>
                        <p className="info-name flex flex-c flex-c-c">{!isEmpty(route.data.nick) ? route.data.nick : "--"}</p>
                        <p className="info-item col-3 flex flex-c flex-c-c flex-dir-column">
                           <span className="sp-item flex flex-c flex-l-l">
                              <span className="flex-item-gsb-0">备注：</span>
                              {
                                  !inputRemark ?
                                      <span className="col-6" onClick={this.updataRemark.bind(this)}>{route.data.alias}（点击修改备注）</span>
                                  :
                                      <input type="text" className="input-val input-remark" placeholder="添加备注" onBlur={this.inputRemarkBlur.bind(this)}/>
                              }                              
                           </span> 
                           <span className="sp-item flex flex-c flex-l-l">
                              <span className="flex-item-gsb-0">昵称：</span>
                              <span className="col-6">{route.data.nick}</span>  
                           </span>
                        </p>
                        <button className="button btn-1  flex-item-gsb-0" onClick={this.routeFriend.bind(this, route.data)}>开始聊天</button>
                        <button className="button btn-2  flex-item-gsb-0">删除好友</button>
                        <button className="button btn-2  flex-item-gsb-0">加入黑名单</button>
                    </div>
                </div>
            :
                <div className="chat-info flex flex-c flex-c-c">
                    <p>查无该好友的资料</p>
                </div>    
        )
    } 
    componentDidUpdate(nextProps, nextState) {
        console.log(nextState, this.state)
        if( this.state.inputNick && this.props.route.data ) {
            $('.input-nick').val(this.props.route.data.nick)
            $('.input-nick').focus()
        }
        if( this.state.inputRemark && this.props.route.data ) {
            $('.input-remark').val(this.props.route.data.alias)
            $('.input-remark').focus()
        }        
    }      
}
export default ChatInfo
