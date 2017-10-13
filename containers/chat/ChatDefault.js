import React, { Component, PropTypes } from 'react'

import { SHOW_ADD_FRIENDS, SHOW_DIALOG_LOGIN_LAYER, SHOW_DIALOG_CONFIRM, NOT_LOGIN_UNACTIVE } from '../../constants/TodoFilters'
import { log } from '../../constants/UtilConstant'

class ChatDefault extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ChatDefault");		
  	}
    goLogin(event) {
        this.props.actions.triggerDialogInfo({type:SHOW_DIALOG_LOGIN_LAYER})
    }         	
    showAdd(event){
        event.stopPropagation();
        event.preventDefault();       
        this.props.actions.triggerDialogInfo({type: SHOW_ADD_FRIENDS, data: this.props.chats.friendList})       
    }       
    render() {
        const { login } = this.props
        return (
            <div className="chat-default flex flex-c flex-c-c">
                <div className="cd-1 flex flex-c flex-c-c flex-dir-column col-9">
                    <i className="chat-default-bg"></i>
                    {
                        login.loginUserData && login.loginUserData.id > 0 ?
                            <p className="text"><a className="col-lan" onClick={this.showAdd.bind(this)}>添加好友</a>，聊天吧</p>
                        :
                            <p className="text"><a className="col-lan hover-line" onClick={this.goLogin.bind(this)}>登录</a>，聊天吧</p> 
                    }
                    
                </div>
            </div>
        )
    }       
}
export default ChatDefault
