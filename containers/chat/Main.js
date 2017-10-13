import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { CHAT_ROUTES } from '../../constants/DataConstant'
import { CHAT_WINDOW, CHAT_DEFAULT, CHAT_INFO } from '../../constants/TodoFilters'
import { log, isEmpty, getChatMessage } from '../../constants/UtilConstant'

import ChatDefault from './ChatDefault'
import ChatInfo from './ChatInfo'
import ChatWindow from './ChatWindow'

class Main extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            route: CHAT_ROUTES[0],
            chatWindowData: null
        };
      	log("Main");		
  	}	
    render() {
      const { yxReceivedAt } = this.state
      const { route, chatWindowData } = this.state
      return (
        <div className="main flex-item-gsb-1" key={yxReceivedAt}>
            {
            	route ?
                    route.menu === CHAT_DEFAULT ?
                       <ChatDefault {...this.props}/>
                    :   
                    route.menu === CHAT_INFO ?
                       <ChatInfo {...this.props}/>
                    :
      	          	route.menu === CHAT_WINDOW ?
                       <ChatWindow {...this.props} chatWindowData={chatWindowData}/>
      	          	:
                       null 
      	        : 
      	            null         
            }
        </div>
      )
    }
    componentWillReceiveProps(nextProps){
        console.log('Main---componentWillReceiveProps',nextProps, this.props)
        const yxData = nextProps.yxData,
              route = nextProps.route;            
        if( nextProps.route && nextProps.routeLastUpdated != this.props.routeLastUpdated ){           
            if( route.menu === CHAT_WINDOW ){                
                if( yxData && yxData.msgs && yxData.myInfo && route && route.data ){
                    setTimeout(() => {
                        this.setState({
                            chatWindowData: getChatMessage(yxData.msgs, yxData.myInfo.account, route.data.account)
                        })
                    },50) 
                }                 
                if( nextProps.route.data ){
                    //获取好友消息记录
                    //this.props.Fn.getLocalMsgs(nextProps.route.data.account)//本地
                    //this.props.Fn.getHistoryMsgs(nextProps.route.data.account)//云端
                    //this.props.Fn.getLocalMsgByIdClient(nextProps.route.data.account)//对应id
                }
                if( this.props.yxData && this.props.yxData.myInfo ){
                    //获取自己的消息记录
                    //this.props.Fn.getLocalMsgs(this.props.yxData.myInfo.account)
                    //this.props.Fn.getHistoryMsgs(this.props.yxData.myInfo.account)
                    //this.props.Fn.getLocalMsgByIdClient(this.props.yxData.myInfo.account)
                }
            }
            this.setState({
                chatWindowData: null,
                route: route
            })                                                
        }
        //检查好友操作后对应的聊天窗口定位。
        if( nextProps.yxReceivedAt !== this.props.yxReceivedAt ){
            if( route && route.data && route.menu !== CHAT_DEFAULT ){
                let hasAccid = false;
                for( let i = 0; i < yxData.friends.length; i++ ){
                    if( yxData.friends[i].account.toLowerCase() === route.data.account.toLowerCase()){
                        hasAccid = true;
                        break;
                    }
                }
                for( let j = 0; j < yxData.blacklist.length; j++ ){
                    if( yxData.blacklist[j].account.toLowerCase() === route.data.account.toLowerCase()){
                        hasAccid = false;
                        break;
                    }
                }                
                if( !hasAccid ){
                    this.setState({
                        route: CHAT_ROUTES[0]
                    })                    
                }
            }

        }
        //会话更新后调用最新数据
        if( nextProps.yxSessionAt !== this.props.yxSessionAt ){
            if( route && route.menu === CHAT_WINDOW ) {
                if( yxData && yxData.msgs && yxData.myInfo && route && route.data ){
                    setTimeout(() => {
                        this.setState({
                            chatWindowData: getChatMessage(yxData.msgs, yxData.myInfo.account, route.data.account)
                        })
                    },50) 
                }                
            }
        }
    }           
}
const mapStateToProps = (state) => {
    log("Main---mapStateToProps")
    log(state)
    return {
        route: state.inIt.route,
        subRoute: state.inIt.subRoute,
        routeLastUpdated: state.inIt.routeLastUpdated
    }
}
export default connect(
    mapStateToProps
)(Main)
