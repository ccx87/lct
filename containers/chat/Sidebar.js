import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { CHAT_FRIEND_TAB, CHAT_ROUTES, SMART_MENU } from '../../constants/DataConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_LOGIN_LAYER, 
         SHOW_FRIEND_CONTACTS, SHOW_FRIEND_SESSION, 
         SHOW_ADD_FRIENDS, SMART_MENU_CHECK_DATA,
         SMART_MENU_MODIFY_COMMENTS, SMART_MENU_DELETE_SESSION,
         SMART_MENU_DELETE_FRIEND, SMART_MENU_ADD_BLACKLIST } from '../../constants/TodoFilters'
import { log, getmCustomScrollbar2, objClone, isEmpty, addArray, dateMinDiff, getTime, getStringData } from '../../constants/UtilConstant'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'

import SidebarTop from './SidebarTop'
import Switch from '../../modules/Switch'

const doc = document
class Sidebar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = { 
            clickTime: null,
            filter: SHOW_FRIEND_SESSION,
            filterSearch: {
                show: false,
                value: [],
                similar: []
            }
      	};
      	log("Sidebar");		
  	}
    goLogin(event) {
        this.props.actions.triggerDialogInfo({type:SHOW_DIALOG_LOGIN_LAYER})
    }
    showAdd(event) {
        event.stopPropagation();
        event.preventDefault();        
        this.props.actions.triggerDialogInfo({type: SHOW_ADD_FRIENDS, data: this.props.yxData.friends ? this.props.yxData.friends : []})       
    }
    routeDefault() {
        clearTimeout(this.state.clickTime);
        log("点击菜点--跳转首先")       
        const routeData = CHAT_ROUTES[0];
        setTimeout(() => {
           this.props.actions.getInItRoute({
              route: routeData
            })
        },10)
        return false        
    }  
    routeInfo(item, event) {
        clearTimeout(this.state.clickTime)
        if( event ){
            $(event.currentTarget).addClass('active').siblings('li').removeClass('active');
        }
        this.state.clickTime = setTimeout(() => {
            log("点击菜点--查看资料")
            const routeData = CHAT_ROUTES[1];
            routeData['data'] = item;
            setTimeout(() => {
               this.props.actions.getInItRoute({
                  route: routeData
                })
            },10)            
            return false 
        },300)                
    }      
  	routeFriend(item, event) {
        clearTimeout(this.state.clickTime);
  		  log("点击菜点--跳转聊天窗口")       
        const routeData = CHAT_ROUTES[2];
        routeData['data'] = item;        
        setTimeout(() => {
  	       this.props.actions.getInItRoute({
              isRoute: true,
  	        	route: routeData
  	        })
        },50)
        if( event ){
            $(event.currentTarget).addClass('active').siblings('li').removeClass('active');
            if( $(event.currentTarget).find('.info-num em').length > 0 ){
                $(event.currentTarget).find('.info-num em').hide()
            }
        }
        // if( item.lastMsg ){
        //     this.props.Fn.sendMsgReceipt(item.lastMsg)
        // }
        return false               	
  	}
  	submenuBtn(event) {

  	}	
    handleShow(filter) {
        const target = this
        if( filter === SHOW_FRIEND_CONTACTS ){
            const c_li = $('#SHOW_FRIEND_CONTACTS').find('li');
            $('#SHOW_FRIEND_SESSION').velocity({
                right: this.props.panelWidth
            },150);          
            $('#SHOW_FRIEND_CONTACTS').velocity({
                right: this.props.panelWidth
            },150, () => {
                let data = null
                c_li.each((indexli, elemli) => {
                    if( $(elemli).hasClass('active') ){
                        try{
                            data = JSON.parse($(elemli).find('input[type=hidden]').val())
                        }catch(e){}
                    } 
                })
                console.log(1, data)
                if( data ){
                    target.routeInfo(data)
                }else{
                    target.routeDefault()
                }
            });
        }else if( filter === SHOW_FRIEND_SESSION ){
            const c_li = $('#SHOW_FRIEND_SESSION').find('li');
            $('#SHOW_FRIEND_CONTACTS').velocity({
                right: 0
            },150);          
            $('#SHOW_FRIEND_SESSION').velocity({
                right: 0
            },150, () => {
                let data = null
                c_li.each((indexli, elemli) => {
                    if( $(elemli).hasClass('active') ){
                        try{
                            data = JSON.parse($(elemli).find('input[type=hidden]').val())
                        }catch(e){}
                    } 
                })
                if( data ){
                    target.routeFriend(data)
                }else{
                    target.routeDefault()
                }
            });
        } else {
            return false;
        }
        this.setState({ filter: filter })
    } 
    filterSearchFriends(value) {
        if( !isEmpty(value) && this.props.yxData.friends ){
            const newArr = this.props.yxData.friends.filter((item) => {
                if( item.nick.indexOf(value) > -1 ){
                    return item;
                }
            });
            this.setState({
                filterSearch:{
                    show: true,
                    value: newArr,
                    similar: []
                }              
            })
        }else{
            this.setState({
                filterSearch:{
                    show: true,
                    value: [],
                    similar: this.props.yxData.friends
                }              
            })
        }               
    }
    openSearchFriend() {
        this.setState({
            filterSearch:{
                show: true,
                value: [],
                similar: this.props.yxData.friends
            }              
        })
    }
    closeSearchFriend() {
        this.setState({
            filterSearch: {
                show: false,
                value: [],
                similar: []
            }
        })
    } 
    smartMenuShow(item, event){
        //右键点击菜单
        if( event.button == 2 ){
            const data = {
                   smartMenu: addArray(SMART_MENU, [SMART_MENU_CHECK_DATA, 
                       SMART_MENU_MODIFY_COMMENTS, SMART_MENU_DELETE_SESSION, 
                       SMART_MENU_DELETE_FRIEND, SMART_MENU_ADD_BLACKLIST]),
                   item: item,
                   pageX: event.pageX,
                   pageY: event.pageY
            }
            this.props.actions.smartMenuShow(data);
            $(event.currentTarget).addClass('active').siblings('li').removeClass('active');
        }        
    }  
    getSessionData(data1, data2) {
        let sldata = {},nowTime,lastTime,diff,s_time;
        sldata = objClone(data2);
        sldata['lastMsg'] = data1.lastMsg; 
        nowTime = getTime(Date.now(), "yy-MM-dd")
        lastTime = getTime(data1.lastMsg.time,"yy-MM-dd")  
        diff = dateMinDiff(nowTime,lastTime) 
        if( diff <= 0 ){
            s_time = getTime(data1.lastMsg.time,"hh:mm",false)
        }else{
            s_time = getStringData(nowTime, lastTime)      
        }
        sldata['lastTime'] = data1.lastMsg.time
        sldata['time'] = s_time 
        sldata['unread'] = data1.unread  
        return sldata                            
    } 
    getSessionList() {
        const yxData = this.props.yxData;
        let accountList = [],
            sessionList = [];        
        //重组会话列表           
        if( yxData && yxData.friends && yxData.sessions && yxData.sessions.length > 0 ){
            //检测是否有正在提交的会话，有就把该会话提取到sessions数组的开头
            for( let k = 0; k < yxData.sessions.length; k++ ){
                if( yxData.sessions[k].lastMsg.status == 'sending' && k !== 0 ){
                    const spliceData = yxData.sessions[k].splice(k,1)
                    yxData.sessions.unshift(spliceData[0])
                }
            } 
            //重组会话和去重
            for( let i = 0, leni = yxData.sessions.length; i < leni; i++ ){
                let hasAccid = false;
                for( let j = 0, lenj = yxData.friends.length; j < lenj; j++ ){
                    if( yxData.sessions[i].to.toLowerCase() === yxData.friends[j].account.toLowerCase() ){
                        hasAccid = true
                        const getdata = this.getSessionData(yxData.sessions[i], yxData.friends[j])
                        const hasIndex = accountList.indexOf(getdata.account)
                        if( hasIndex > -1 ){
                            const oldTime = sessionList[hasIndex].lastMsg.time,
                                  newTime = getdata.lastMsg.time;
                            if( newTime > oldTime ){
                                sessionList.splice(hasIndex,1,getdata)
                            }       
                        }else{
                            sessionList = [...sessionList, getdata]
                            accountList = [...accountList, getdata.account]
                        }
                        break;
                    }
                }
                if( !hasAccid ){
                    if( yxData.myInfo && yxData.sessions[i].to.toLowerCase() === yxData.myInfo.account.toLowerCase() ){
                        const inAccid = yxData.sessions[i].lastMsg ? yxData.sessions[i].lastMsg.from : null
                        if( inAccid ){
                            for( let h = 0, lenh = yxData.friends.length; h < lenh; h++ ){
                                if( inAccid.toLowerCase() === yxData.friends[h].account.toLowerCase() ){
                                    const getdata = this.getSessionData(yxData.sessions[i], yxData.friends[h])                    
                                    const hasIndex = accountList.indexOf(getdata.account)
                                    if( hasIndex > -1 ){
                                        const oldTime = sessionList[hasIndex].lastMsg.time,
                                              newTime = getdata.lastMsg.time;
                                        if( newTime > oldTime ){
                                            sessionList.splice(hasIndex,1,getdata)
                                        }       
                                    }else{
                                        sessionList = [...sessionList, getdata]
                                        accountList = [...accountList, getdata.account]                                      
                                    }
                                    break;
                                }
                            }                            
                        }
                    }
                }
            }         
        } 
        return sessionList      
    }  
    render() {  
        const { chats, yxData, nim, Fn, route, login, yxSessionAt } =  this.props
        let { filter, filterSearch } = this.state  
        const onCloseSearch = this.closeSearchFriend.bind(this),
              onFocusFriend = this.openSearchFriend.bind(this),
              onSearchFriends = this.filterSearchFriends.bind(this); 
        //重组一下数据，有备注的显示备注名称。
        if( yxData.friends && yxData.friends.length > 0 && yxData.users  ){
            for( let i = 0, leni = yxData.friends.length; i < leni; i++ ){
                for( let j = 0, lenj = yxData.users.length; j < lenj; j++ ){
                    if( yxData.friends[i].account.toLowerCase() === yxData.users[j].account.toLowerCase() ){
                        yxData.friends[i]['avatar'] = yxData.users[j].avatar
                        yxData.friends[i]['gender'] = yxData.users[j].gender
                        yxData.friends[i]['nick'] = yxData.users[j].nick
                        break;
                    }
                }
            }
        }     
        //排除黑名单的好友
        let blacklist = [];
        if( yxData && yxData.blacklist && yxData.blacklist.length > 0 ){
            blacklist = yxData.blacklist.map((item) => item.account.toLowerCase())
        }  
        const sessionList = this.getSessionList()
        return (
    	      <div className="chat-sidebar flex-item-gsb-0 flex flex-dir-column">
                <SidebarTop 
                   {...this.props} 
                   onCloseSearch={onCloseSearch} 
                   onFocusFriend={onFocusFriend}
                   onSearchFriends={onSearchFriends}/>
                {
                    login.loginUserData && login.loginUserData.id > 0 ?
                        yxData && nim && Fn ?
                            !filterSearch.show ? 
                                <div className="friend-menu flex flex-l flex-l-l flex-dir-column">
                                    <div className="menu-tab flex flex-c">
                                        <Switch options={CHAT_FRIEND_TAB} filter={filter} onShow={this.handleShow.bind(this)} mode={1}/>
                                    </div>
                                    <div className="scllorBar-menu">
                                         <div className="menu-content flex flex-l-l">
                                              <ul className="friend-list scllorBar-friend flex-item-gsb-0" id="SHOW_FRIEND_SESSION">
                                                  {
                                                      sessionList.length > 0 ?
                                                          sessionList.map((item, index) => {
                                                              if( blacklist.length > 0 ){
                                                                  if( blacklist.indexOf(item.account.toLowerCase()) > -1 ){
                                                                      if( sessionList.length == 1 ){
                                                                          return <div key={index} className="no-data flex flex-c flex-c-c col-9 flex-dir-column">
                                                                                      <i className="icons-40 data-default-bg"></i> 
                                                                                      <p className="text">暂无会话记录</p>
                                                                                  </div>                                                                          
                                                                      }
                                                                      return null
                                                                  }
                                                              }                                                            
                                                              let classes = 'friend-item flex flex-c flex-l-l';
                                                              // if( route && route.data && route.data.account == item.account.toLowerCase() ){
                                                              //     classes += ' active' 
                                                              // }                                                           
                                                              return  <li key={index} className={classes} 
                                                                          onClick={this.routeFriend.bind(this,item)}
                                                                          onMouseDown={this.smartMenuShow.bind(this, item)}>
                                                                          <input type="hidden" data-accid={item.account} value={'{"account":"'+ item.account +'","nick":"'+ item.nick +'","avatar":"'+ item.avatar +'","alias":"'+ item.alias +'"}'} />
                                                                          <div className="fi-photo flex flex-c flex-c-c flex-item-gsb-0 bor-s-e1">
                                                                              {
                                                                                  item.avatar ?
                                                                                     <img src={item.avatar} alt=""/>
                                                                                  :
                                                                                     <img src="compress/img/avatar.png" alt=""/>   
                                                                              }
                                                                          </div>
                                                                          <div className="fi-info flex flex-c flex-l-l flex-item-gsb-1 flex-dir-column col-9">
                                                                              <div className="info-item flex flex-c flex-self-l">
                                                                                  <p className="info-name flex flex-c flex-l-l font-size-14 col-3 flex-item-gsb-1">
                                                                                     <span>{item.alias ? item.alias : item.nick}</span>
                                                                                  </p>
                                                                                  <p className="info-time flex flex-c flex-r-r flex-item-gsb-1">{item.time}</p>
                                                                              </div>
                                                                              {
                                                                                  !isEmpty(item.lastMsg) ?
                                                                                      <div className="info-item flex flex-c flex-self-l">
                                                                                          <p className="info-msg flex flex-c flex-l-l flex-item-gsb-1">
                                                                                              <span className="text-of">{item.lastMsg.text}</span>
                                                                                          </p>
                                                                                          <p className="info-num flex flex-c flex-r-r flex-item-gsb-1">
                                                                                              {
                                                                                                  item.unread > 0 ?
                                                                                                    item.unread <= 99 ? 
                                                                                                       <em className="col-bai flex flex-c flex-c-c">{item.unread}</em>
                                                                                                    :
                                                                                                       <em className="col-bai flex flex-c flex-c-c">99++</em>  
                                                                                                  :
                                                                                                    null  
                                                                                              }
                                                                                          </p>                                    
                                                                                      </div>
                                                                                  :
                                                                                      null    
                                                                              } 
                                                                          </div>
                                                                      </li>                                                
                                                          })
                                                      :
                                                          <div className="no-data flex flex-c flex-c-c col-9 flex-dir-column">
                                                              <i className="icons-40 data-default-bg"></i> 
                                                              <p className="text">暂无会话记录</p>
                                                          </div>                                                                                                               
                                                  }
                                              </ul>                                                                                     
                                              <ul className="friend-list scllorBar-friend flex-item-gsb-0" id="SHOW_FRIEND_CONTACTS">
                                                  {
                                                      yxData.friends && yxData.friends.length > 0 ?
                                                          yxData.friends.map((item, index) => {
                                                              if( blacklist.length > 0 ){
                                                                  if( blacklist.indexOf(item.account.toLowerCase()) > -1 ){
                                                                      return null
                                                                  }
                                                              } 
                                                              let classes = 'friend-item flex flex-c flex-l-l';
                                                              // if( route && route.data && route.data.account == item.account.toLowerCase() ){
                                                              //     classes += ' active' 
                                                              // }                                                               
                                                              return  <li key={index} className={classes} 
                                                                          onClick={this.routeInfo.bind(this,item)}
                                                                          onMouseDown={this.smartMenuShow.bind(this, item)}>
                                                                          <input type="hidden" data-accid={item.account} value={'{"account":"'+ item.account +'","nick":"'+ item.nick +'","avatar":"'+ item.avatar +'","alias":"'+ item.alias +'"}'} />
                                                                          <div className="fi-photo flex-in flex-c flex-c-c flex-item-gsb-0 bor-s-e1">
                                                                              {
                                                                                  item.avatar ?
                                                                                     <img src={item.avatar} alt=""/>
                                                                                  :
                                                                                     <img src="compress/img/avatar.png" alt=""/>   
                                                                              }
                                                                          </div>
                                                                          <div className="fi-info flex-in flex-c flex-l-l flex-item-gsb-1 flex-dir-column col-9">
                                                                              <div className="info-item flex flex-c flex-self-l">
                                                                                  <p className="info-name flex flex-c flex-l-l font-size-14 col-3 flex-item-gsb-1">
                                                                                     <span>{item.alias ? item.alias : item.nick}</span>
                                                                                  </p>
                                                                              </div> 
                                                                          </div>
                                                                      </li>                                                
                                                          })
                                                      :
                                                          <div className="no-data flex flex-c flex-c-c col-9 flex-dir-column">
                                                              <i className="icons-40 friend-list-default-bg"></i> 
                                                              <p className="text">您还没有好友，去
                                                                 <a onClick={this.showAdd.bind(this)} className="col-lan">添加好友</a>
                                                                 吧
                                                              </p>
                                                          </div>                                                                  
                                                  }                                                                                                         
                                              </ul>                                                                    
                                          </div>
                                    </div>
                                </div>                    
                            :
                                <div className="friend-search flex flex-l flex-l-l flex-dir-column col-3">
                                     <ul className="search-list scllorBar-search">
                                         {
                                             filterSearch.value.length > 0 ?
                                                filterSearch.value.map((item, index) => {
                                                    let classes = 'search-item flex flex-c flex-l';                                               
                                                    return <li key={index} className={classes} 
                                                             onClick={this.routeFriend.bind(this,item)}>
                                                             <img src={item.avatar} alt=""/>
                                                             <span className="si-text">{item.nick}</span>
                                                           </li>                                            
                                                })
                                             :
                                                <li className="search-item flex flex-c flex-c-c col-9">没有查找到好友...</li>
                                         }
                                     </ul> 
                                     {
                                         filterSearch.similar.length > 0 ?
                                            <div className="similar-search flex flex-l flex-l-l flex-dir-column col-3">
                                               <p className="col-9 left-10">你可能想找</p>
                                               <ul className="search-list">
                                                   {
                                                        filterSearch.similar.map((item, index) => {
                                                            let classes = 'search-item flex flex-c flex-l';                                                      
                                                            return <li key={index} className={classes} 
                                                                     onClick={this.routeInfo.bind(this,item)}
                                                                     onDoubleClick={this.routeFriend.bind(this,item)}>
                                                                     <img src={item.avatar} alt=""/>
                                                                     <span className="si-text">{item.nick}</span>
                                                                   </li>                                            
                                                        })
                                                   }                                       
                                               </ul>
                                            </div>
                                         :
                                            null   
                                     }
                                </div>
                        :
                            loadingHtml2('正在登录中，请稍候') 
                    :
                        <p className="col-6 flex flex-c flex-c-c" style={{"height":"100%"}}><a className="col-lan hover-line" onClick={this.goLogin.bind(this)}>登录</a>，聊天吧</p>               
                }
    	      </div>
        )
    }  
    componentDidMount() {    
        getmCustomScrollbar2($(".scllorBar-menu"), null, 400)
    }  
    componentWillReceiveProps(nextProps) {
        console.log("Sidebar---componentWillReceiveProps", nextProps, this.props)       
    }
    componentWillUpdate(nextProps, nextState) {
        if( nextState.filter !== this.state.filter ) {
            getmCustomScrollbar2($(".scllorBar-menu"),'update')          
        } 
                
    }
    shouldComponentUpdate(nextProps) {
        console.log('Sidebar----shouldComponentUpdate', nextProps, this.props)
        return true
    }
    componentDidUpdate(nextProps, nextState) {
        if( nextState.filterSearch.show && !this.state.filterSearch.show ){
            if( this.state.filter === SHOW_FRIEND_CONTACTS ){
                document.getElementById('SHOW_FRIEND_CONTACTS').style.right = this.props.panelWidth +'px'
                document.getElementById('SHOW_FRIEND_SESSION').style.right = this.props.panelWidth +'px'
            } else if( this.state.filter === SHOW_FRIEND_SESSION ){
                document.getElementById('SHOW_FRIEND_CONTACTS').style.right = 0 +'px'
                document.getElementById('SHOW_FRIEND_SESSION').style.right = 0 +'px'            
            }
        }
        if( $('.scllorBar-friend').length > 0 && $('.scllorBar-menu').length > 0 ){
            $('.scllorBar-friend').height($('.scllorBar-menu').height())
        } 
        //当前会话样式调整
        if( this.props.route && this.props.route.data && this.state.filter === SHOW_FRIEND_SESSION ){
            const $friendElem = $('#SHOW_FRIEND_SESSION').find('li')
            let hasActive = false
            // console.log(this.props.route.data.account)
            // $friendElem.each((inexF, elemF) => {
            //     if( $(elemF).hasClass('active') ){
            //         hasActive = true
            //         const accid = $(elemF).find('input[type=hidden]').data('accid')
            //         console.log(11111, inexF, accid, this.props.route.data.account)
            //         $(elemF).removeClass('active')
            //         // if( accid === this.props.route.data.account ){
                        
            //         //     $friendElem.removeClass('active')
            //         //     
            //         //     return false
            //         // }
            //     }
            // })
            // if( hasActive ){
            //     $friendElem.each((inexF, elemF) => {
            //         const accid = $(elemF).find('input[type=hidden]').data('accid')
            //         console.log(2222,inexF, accid, this.props.route.data.account)
            //         if( accid === this.props.route.data.account ){
            //             console.log(3333)
            //             $friendElem.removeClass('active')
            //             $(elemF).addClass('active')
            //             return false
            //         }
            //     })                
            // }
        }        
    }  
}
Sidebar.defaultProps = {
    panelWidth: 260
}
const mapStateToProps = (state) => {
    log("Sidebar---mapStateToProps")
    log(state)
    return {
        route: state.inIt.route,
        subRoute: state.inIt.subRoute,
        routeLastUpdated: state.inIt.routeLastUpdated
    }
}
export default connect(
    mapStateToProps
)(Sidebar)
