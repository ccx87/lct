import React, { Component, PropTypes } from 'react'

import { log } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, NOT_LOGIN_UNACTIVE, SEARCH_FRIENDS, SHOW_ADD_FRIENDS } from '../../constants/TodoFilters'

import SearchInput from '../../modules/smallModel/SearchInput'

class SidebarTop extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("SidebarTop");		
  	}	
    loginPoint() {
        if( !this.props.login.loginUserData || !this.props.login.loginUserData.id ){
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_CONFIRM,
                title: '提示',
                text: '暂不支持添加好友，请登录后添加',
                code: NOT_LOGIN_UNACTIVE,
                model: 'GO_LOGIN'
            })          
            return false
        } 
        return true     
    }    
    showAdd(event){
        event.stopPropagation();
        event.preventDefault();
        // if( !this.loginPoint() ){
        //     return false
        // }        
        this.props.actions.triggerDialogInfo({type: SHOW_ADD_FRIENDS, data: this.props.yxData ? this.props.yxData.users : []})       
    }    
    render() {
        const { login, onCloseSearch, onFocusFriend, onSearchFriends } = this.props
        return (
    	      <div className="sidebar-top flex flex-c flex-item-gsb-0 col-6">
                <SearchInput 
                   {...this.props} 
                   mode={SEARCH_FRIENDS} 
                   onCloseSearch={onCloseSearch}
                   onFocusFriend={onFocusFriend}
                   onSearchFriends={onSearchFriends}/>
                <a className="add-bnt add-friend flex flex-c flex-c-c flex-item-gsb-0 bor-rad-4"
                   onClick={this.showAdd.bind(this)}>+</a>
    	      </div>
        )
    }
    componentDidMount() { 

    }
    componentWillReceiveProps(nextProps){
 
    }	  
}
SidebarTop.defaultProps = {
    type: {
        search: "搜索"
    }
}
export default SidebarTop