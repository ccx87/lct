import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty } from '../../constants/UtilConstant'
import { msgAlertHtml, msgAlertSuccessHtml, msgAlertErrorHtml } from '../../constants/RenderHtmlConstant'

/* 弹出层--添加好友  */
class AddFriends extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		friend: null,
    		msgShow: false,
    		add: {
    			show: false,
    			text: '' 
    		},
    		unFind: {
    			show: false,
    			text: ''
    		}
    	};
    	log("AddFriends");		
	}
	eventsKeyDown(event) {
		var keyCode = window.event ? event.keyCode : event.which;
		if(keyCode == 13) {
			this.selectFriend()
		}	
		return false	
	}
	selectFriend(event) {
		const inputDom = this.refs.friendNameIdRef;
		if( isEmpty(inputDom) ){
            return false; 
		}
		if( isEmpty(inputDom.value) ){
            this.setState({
            	msgShow: true
            })
            setTimeout(() => {
	            this.setState({
	            	msgShow: false
	            })            	
            },1500)
            return false;
		}
        this.renderResult(inputDom.value)
	}
	renderResult(val) {
		this.props.actionsChat.findYunFriend(val);
		return false;		
	}
	addNewFriend(item, event) {     
        console.log(this.props)
        this.props.Fn.addFriend(item.accid, this);
	}
	hasFriend(friendData, allFriend) {
		const accidArray = allFriend.map((item) => item.account),
              has = accidArray.indexOf(friendData.accid.toLowerCase()) != -1;
        console.log(1,allFriend, accidArray, has)      
        this.setState({
        	add: false,
        	msgShow: false,
        	friend: {
        		isHas: has,
        		nickName: friendData.nickName,
        		headPortrait: friendData.headPortrait,
        		email: friendData.email,
        		loginPhone: friendData.loginPhone,
        		accid: friendData.accid
        	}
        })
	}
	alertTip(text) {
        this.setState({
        	add: {
        		show: true,
        		text: text
        	}
        })
        setTimeout(() => {
	        this.setState({
	        	add: {
	        		show: false,
	        		text: ''
	        	}
	        })
	        this.hasFriend(this.state.friend, this.props.yxData.users ? this.props.yxData.users : [])
        },1500)		
	}
	render() {
		const { actions } = this.props
		const { friend, add, msgShow, unFind } = this.state
		return <div className="dialog add-friend-layer" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>添加朋友</span>
		               <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
		           </div>
		           <div className="dialog-content" onKeyDown={this.eventsKeyDown.bind(this)}>
		               <p className="p-dc">输入链图云帐号添加朋友</p>
		               <div className="searcn-dc flex flex-c">
		                   <input type="text" className="bor-s-e1 search-input flex flex-c flex-item-gsb-1" ref="friendNameIdRef" placeholder="输入邮箱\手机\链图云号来查找"/>
		                   <button className="search-add button flex-item-gsb-0" onClick={this.selectFriend.bind(this)}>查找</button>
		                    {
		                   	    msgShow ?
		                   	        msgAlertHtml('请输入邮箱、手机号或链图云号来查找', 'col-red')
		                   	    :
		                   	        null   
		                    }		                   
		               </div>
		           </div>
		           {
                        friend ?
				            <div className="dialog-content search-result col-3">
				                <p className="p-dc">搜索结果</p>
				                <div className="result-dc flex flex-c flex-self-r">
				                    <img src={friend.headPortrait} alt="头像" className="result-img flex-item-gsb-0"/>
				                    <div className="result-info flex flex-l flex-l-l flex-item-gsb-1 flex-dir-column">
                                        <p className="flex flex-l-l flex-self-l">
                                            <span className="flex-item-gsb-0">昵称：</span>
                                            <span className="col-lan flex-item-gsb-1 r-text">{friend.nickName}</span>
                                        </p> 
                                        <p className="flex flex-l-l flex-self-l">
                                            <span className="flex-item-gsb-0">邮箱：</span>
                                            <span className="flex-item-gsb-1 r-text">{friend.email}</span>
                                        </p>
                                        <p className="flex flex-l-l flex-self-l">
                                            <span className="flex-item-gsb-0">手机：</span>
                                            <span className="flex-item-gsb-1 r-text">{friend.loginPhone}</span>
                                        </p>
				                    </div>
				                    <div className="result-btn">
				                        {
				                        	friend.isHas ?
											    <button className="result-has button" disabled>已添加</button>
				                        	:
				                    			<button className="result-add button" onClick={this.addNewFriend.bind(this, friend)}>添加</button>
				                        }
				                    </div>
				                </div>
				            </div>
				        :
				            null                           
		           }
		           {  
                        add.show ?
                           msgAlertSuccessHtml(add.text)
                        :
                           null      
		           }
		           {
		           	    unFind.show ?
		           	       msgAlertErrorHtml(unFind.text) 
		           	    :
		           	       null   
		           }
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = document.querySelector('.add-friend-layer'),
			      dragElem = parElem.querySelector('.dialog-title');					
			absVerticalCenter2(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}	
	}
	componentWillReceiveProps(nextProps) {
		console.log("AddFriends----componentWillReceiveProps", nextProps, this.props)
		if( nextProps.findYunFriend && nextProps.findYunFriendLastUpdated !== this.props.findYunFriendLastUpdated ){
			if( nextProps.findYunFriend.errorCode == 0 && nextProps.findYunFriend.data ){
				const friendData = nextProps.findYunFriend.data;
				this.hasFriend(friendData, this.props.dialogData.data)
	    	} else {
                this.setState({
                	unFind: {
                		show: true,
                		text: nextProps.findYunFriend.error
                	}
                })
                setTimeout(() => {
	                this.setState({
	                	unFind: {
	                		show: false,
	                		text: ''
	                	}
	                })
                },1500)
	    	}
		}
	}
	componentDidUpdate(nextProps, nextState) {
		if( this.refs.msgAlertSuccessHtmlRef ){
			absVerticalCenter2(this.refs.msgAlertSuccessHtmlRef)
		}
		if( nextState.friend == null && this.state.friend != null ){
			absVerticalCenter2(this.refs.verticalCenter)
		}
		if( $('.alert-dialog-layer').length > 0 ){
			absVerticalCenter2($('.alert-dialog-layer')[0])
		}
	}		
}
const mapStateToProps = (state) => {
    return {
    	findYunFriend: state.events.findYunFriend, 
        findYunFriendLastUpdated: state.events.findYunFriendLastUpdated      
    }
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(AddFriends))
