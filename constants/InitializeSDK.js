module.exports = {
	yxSDK(appKey, account, token, _this) {
		let nim,
		    Fn,
		    db,
		    yxReceivedAt;
		const data = {},    
		inIt = {
			onConnect() {
			    console.log('连接成功');
			},
			onWillReconnect(obj) {
			    // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
			    console.log('即将重连');
			    console.log(obj.retryCount);
			    console.log(obj.duration);
			},
			onDisconnect(error) {
			    // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
			    console.log('丢失连接');
			    console.log(error);
			    if (error) {
			        switch (error.code) {
			        // 账号或者密码错误, 请跳转到登录页面并提示错误
			        case 302:
						_this.setState({
							code: error.code,
							message: error.message
						})			        
			            break;
			        // 被踢, 请提示错误后跳转到登录页面
			        case 'kicked':
			            break;
			        default:
			            break;
			        }
			    }
			},
			onError(error) {
			    console.log(error);
			},

			onLoginPortsChange(loginPorts) {
			    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
			},
			onBlacklist(blacklist) {
			    console.log('收到黑名单', blacklist);
			    data.blacklist = nim.mergeRelations(data.blacklist, blacklist);
			    data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid);
			    console.log(78789,this, inIt)
			    inIt.refreshBlacklistUI();
			},
			onMarkInBlacklist(obj) {
			    console.log(obj);
			    console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
			    if (obj.isAdd) {
			        inIt.addToBlacklist(obj);
			    } else {
			        inIt.removeFromBlacklist(obj);
			    }
			},
			addToBlacklist(obj) {
			    data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
			    inIt.refreshBlacklistUI();
			},
			removeFromBlacklist(obj) {
			    data.blacklist = nim.cutRelations(data.blacklist, obj.record);
			    inIt.refreshBlacklistUI();
			},
			refreshBlacklistUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})
			    // 刷新界面
			},
			onMutelist(mutelist) {
			    console.log('收到静音列表', mutelist);
			    data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
			    data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
			    inIt.refreshMutelistUI();
			},
			onMarkInMutelist(obj) {
			    console.log(obj);
			    console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
			    if (obj.isAdd) {
			        inIt.addToMutelist(obj);
			    } else {
			        inIt.removeFromMutelist(obj);
			    }
			},
			addToMutelist(obj) {
			    data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
			    inIt.refreshMutelistUI();
			},
			removeFromMutelist(obj) {
			    data.mutelist = nim.cutRelations(data.mutelist, obj.record);
			    inIt.refreshMutelistUI();
			},
			refreshMutelistUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onFriends(friends) {
			    console.log('收到好友列表', friends);
			    data.friends = nim.mergeFriends(data.friends, friends);
			    data.friends = nim.cutFriends(data.friends, friends.invalid);
			    inIt.refreshFriendsUI();
			},
			onSyncFriendAction(obj) {
			    console.log(obj);
			    switch (obj.type) {
			    case 'addFriend':
			        console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
			        inIt.onAddFriend(obj.friend);
			        break;
			    case 'applyFriend':
			        console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
			        break;
			    case 'passFriendApply':
			        console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
			        inIt.onAddFriend(obj.friend);
			        break;
			    case 'rejectFriendApply':
			        console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
			        break;
			    case 'deleteFriend':
			        console.log('你在其它端删了一个好友' + obj.account);
			        inIt.onDeleteFriend(obj.account);
			        break;
			    case 'updateFriend':
			        console.log('你在其它端更新了一个好友', obj.friend);
			        inIt.onUpdateFriend(obj.friend);
			        break;
			    }
			},
			onAddFriend(friend) {
			    data.friends = nim.mergeFriends(data.friends, friend);
			    inIt.refreshFriendsUI();
			},
			onDeleteFriend(account) {
			    data.friends = nim.cutFriendsByAccounts(data.friends, account);
			    inIt.refreshFriendsUI();
			},
			onUpdateFriend(friend) {
			    data.friends = nim.mergeFriends(data.friends, friend);
			    inIt.refreshFriendsUI();
			},
			refreshFriendsUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onMyInfo(user) {
			    console.log('收到我的名片', user);
			    data.myInfo = user;
			    inIt.updateMyInfoUI();
			},
			onUpdateMyInfo(user) {
			    console.log('我的名片更新了', user);
			    data.myInfo = NIM.util.merge(data.myInfo, user);
			    inIt.updateMyInfoUI();
			},
			updateMyInfoUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onUsers(users) {
			    console.log('收到用户名片列表', users);
			    data.users = nim.mergeUsers(data.users, users);
			    inIt.refreshTeamsUI();
			},
			onUpdateUser(user) {
			    console.log('用户名片更新了', user);
			    data.users = nim.mergeUsers(data.users, user);
			},
			onTeams(teams) {
			    console.log('群列表', teams);
			    data.teams = nim.mergeTeams(data.teams, teams);
			    inIt.onInvalidTeams(teams.invalid);
			},
			onInvalidTeams(teams) {
			    data.teams = nim.cutTeams(data.teams, teams);
			    data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
			    inIt.refreshTeamsUI();
			},
			onCreateTeam(team) {
			    console.log('你创建了一个群', team);
			    data.teams = nim.mergeTeams(data.teams, team);
			    inIt.refreshTeamsUI();
			    inIt.onTeamMembers({
			        teamId: team.teamId,
			        members: owner
			    });
			},
			refreshTeamsUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onTeamMembers(teamId, members) {
			    console.log('群id', teamId, '群成员', members);
			    var teamId = obj.teamId;
			    var members = obj.members;
			    data.teamMembers = data.teamMembers || {};
			    data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
			    data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
			    inIt.refreshTeamMembersUI();
			},
			onSyncTeamMembersDone() {
			    console.log('同步群列表完成');
			},
			onUpdateTeamMember(teamMember) {
			    console.log('群成员信息更新了', teamMember);
			    inIt.onTeamMembers({
			        teamId: teamMember.teamId,
			        members: teamMember
			    });
			},
			refreshTeamMembersUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onSessions(sessions) {
			    console.log('收到会话列表', sessions);
			    data.sessions = nim.mergeSessions(data.sessions, sessions);
			    inIt.updateSessionsUI();
			},
			onUpdateSession(session) {
			    console.log('会话更新了', session);
			    data.sessions = nim.mergeSessions(data.sessions, session);
			    inIt.updateSessionsUI();
			},
			updateSessionsUI() {
                if( !_this ) return false 
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onRoamingMsgs(obj) {
			    console.log('漫游消息', obj);
			    inIt.pushMsg(obj.msgs);
			},
			onOfflineMsgs(obj) {
			    console.log('离线消息', obj);
			    inIt.pushMsg(obj.msgs);
			},
			onMsg(msg) {
			    console.log('收到消息', msg.scene, msg.type, msg);
			    inIt.pushMsg(msg);
			},
			pushMsg(msgs) {
			    if (!Array.isArray(msgs)) { msgs = [msgs]; }
			    if( msgs.length <= 0 ) {
			    	return false
			    }
			    var sessionId = msgs[0].sessionId;
			    data.msgs = data.msgs || {};
			    data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
			    inIt.refreshMsgsUI();
			},
			refreshMsgsUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxSessionAt: Date.now(),
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onOfflineSysMsgs(sysMsgs) {
			    console.log('收到离线系统通知', sysMsgs);
			    inIt.pushSysMsgs(sysMsgs);
			},
			onSysMsg(sysMsg) {
			    console.log('收到系统通知', sysMsg)
			    inIt.pushSysMsgs(sysMsg);
			},
			onUpdateSysMsg(sysMsg) {
			    inIt.pushSysMsgs(sysMsg);
			},
			pushSysMsgs(sysMsgs) {
			    data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
			    inIt.refreshSysMsgsUI();
			},
			onSysMsgUnread(obj) {
			    console.log('收到系统通知未读数', obj);
			    data.sysMsgUnread = obj;
			    inIt.refreshSysMsgsUI();
			},
			onUpdateSysMsgUnread(obj) {
			    console.log('系统通知未读数更新了', obj);
			    data.sysMsgUnread = obj;
			    inIt.refreshSysMsgsUI();
			},
			refreshSysMsgsUI() {
				if( !_this ) return false
				_this.setState({
					yxData: data,
					nim: nim,
					Fn: Fn,
					db: db,
					yxReceivedAt: Date.now()
				})			
			    // 刷新界面
			},
			onOfflineCustomSysMsgs(sysMsgs) {
			    console.log('收到离线自定义系统通知', sysMsgs);
			},
			onCustomSysMsg(sysMsg) {
			    console.log('收到自定义系统通知', sysMsg);
			},

			onSyncDone() {
			    console.log('同步完成');
			}
		}
		nim = NIM.getInstance({
		    // 初始化SDK
		    //debug: true,
		    appKey: appKey,
		    account: account,
		    token: token,
		    onconnect: inIt.onConnect,
		    onerror: inIt.onError,
		    onwillreconnect: inIt.onWillReconnect,
		    ondisconnect: inIt.onDisconnect,
		    // 多端登录
		    onloginportschange: inIt.onLoginPortsChange,
		    // 用户关系
		    onblacklist: inIt.onBlacklist,
		    onsyncmarkinblacklist: inIt.onMarkInBlacklist,
		    onmutelist: inIt.onMutelist,
		    onsyncmarkinmutelist: inIt.onMarkInMutelist,
		    // 好友关系
		    onfriends: inIt.onFriends,
		    onsyncfriendaction: inIt.onSyncFriendAction,
		    // 用户名片
		    onmyinfo: inIt.onMyInfo,
		    onupdatemyinfo: inIt.onUpdateMyInfo,
		    onusers: inIt.onUsers,
		    onupdateuser: inIt.onUpdateUser,
		    // 群组
		    onteams: inIt.onTeams,
		    onsynccreateteam: inIt.onCreateTeam,
		    onteammembers: inIt.onTeamMembers,
		    onsyncteammembersdone: inIt.onSyncTeamMembersDone,
		    onupdateteammember: inIt.onUpdateTeamMember,
		    // 会话
		    onsessions: inIt.onSessions,
		    onupdatesession: inIt.onUpdateSession,
		    // 消息
		    onroamingmsgs: inIt.onRoamingMsgs,
		    onofflinemsgs: inIt.onOfflineMsgs,
		    onmsg: inIt.onMsg,
		    // 系统通知
		    onofflinesysmsgs: inIt.onOfflineSysMsgs,
		    onsysmsg: inIt.onSysMsg,
		    onupdatesysmsg: inIt.onUpdateSysMsg,
		    onsysmsgunread: inIt.onSysMsgUnread,
		    onupdatesysmsgunread: inIt.onUpdateSysMsgUnread,
		    onofflinecustomsysmsgs: inIt.onOfflineCustomSysMsgs,
		    oncustomsysmsg: inIt.onCustomSysMsg,
		    // 同步完成
		    onsyncdone: inIt.onSyncDone
		});
		db = NIM.support.db;
		Fn = {
			__this: null,
			getUser(account) {
				//获取好友名片
				nim.getUser({
				    account: account,
				    done: Fn.getUserDone
				});
			},
			getUserDone(error, user) {
			    console.log(error);
			    console.log(user);
			    console.log('获取用户名片' + (!error?'成功':'失败'));
			    if (!error) {
			        inIt.onUsers(user);
			    }
			},
			getFriends() {
				//获取好友列表
				//如果开发者在初始化SDK的时候设置了syncFriends为false, 那么就收不到onfriends回调, 可以调用此接口来获取好友列表
				nim.getFriends({
				    done: Fn.getFriendsDone
				});
			},
			getFriendsDone(error, friends) {
			    console.log('获取好友列表' + (!error?'成功':'失败'), error, friends);
			    if (!error) {
			        inIt.onFriends(friends);
			    }
			},						
			addFriend(account, _this) {
				//添加好友
				nim.addFriend({
				    account: account,
				    ps: '',//附言
				    done: Fn.addFriendDone
				});
				Fn.__this = _this;
			},
			addFriendDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('直接加为好友' + (!error?'成功':'失败'));
			    if (!error) {
			        inIt.onAddFriend(obj.friend);
			        Fn.getUser(obj.account); 
			    }
		        if( Fn.__this ){
                    Fn.__this.alertTip('直接加为好友' + (!error?'成功':'失败'))
		    	}			    
			},
			deleteFriend(account, _this) {
				//删除好友
				nim.deleteFriend({
				    account: account,
				    done: Fn.deleteFriendDone
				});
				Fn.__this = _this;
			},
			deleteFriendDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('删除好友' + (!error?'成功':'失败'));
			    if (!error) {
			        inIt.onDeleteFriend(obj.account);
			    }
		        if( Fn.__this ){
                    Fn.__this.alertTip(!error?true:false, '删除好友' + (!error?'成功':'失败'))
		    	}			    
			},
			markInBlacklist(account, isAdd, _this) {
				//加入黑名单/从黑名单移除
				nim.markInBlacklist({
				    account: account,
				    // `true`表示加入黑名单, `false`表示从黑名单移除
				    isAdd: isAdd,
				    done: Fn.markInBlacklistDone
				});
				Fn.__this = _this;
			},
			markInBlacklistDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('将' + obj.account + (obj.isAdd ? '加入黑名单' : '从黑名单移除') + (!error?'成功':'失败'));
			    if (!error) {
			        inIt.onMarkInBlacklist(obj);
			    }
		        if( Fn.__this ){
                    Fn.__this.alertTip(!error?true:false, (obj.isAdd ? '加入黑名单' : '从黑名单移除') + (!error?'成功':'失败'))
		    	}			    
			},			
			updateFriend(account, alias, _this) {
				//更新好友
				nim.updateFriend({
				    account: account,
				    alias: alias,
				    custom: '',
				    done: Fn.updateFriendDone
				});
				Fn.__this = _this;
			},
			updateFriendDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('更新好友' + (!error?'成功':'失败'));
			    if (!error) {
			        inIt.onUpdateFriend(obj);
			    }
		        if( Fn.__this ){
                    Fn.__this.alertTip(!error?false:true,'更新好友' + (!error?'成功':'失败'),!error?true:false)
		    	}			    
			},						
			sendText(account, text) {
				//发送文本消息
				const msg = nim.sendText({
				    scene: 'p2p',
				    to: account,
				    text: text,
				    done: Fn.sendMsgDone
				});	
				console.log('正在发送p2p text消息, id=' + msg.idClient);
				//inIt.pushMsg(msg);				
			},
			sendMsgDone(error, msg) {
			    console.log(error);
			    console.log(msg);
			    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
			    inIt.pushMsg(msg);
			},
			getLocalMsgs(account) {
				//获取本地消息
				nim.getLocalMsgs({
				  sessionId: 'p2p-'+ account,
				  limit: 100,
				  done: Fn.getLocalMsgsDone
				})
			},
			getLocalMsgsDone(error, obj) {
			  	console.log('1获取本地消息' + (!error?'成功':'失败'), error, obj);
			  	inIt.onMsg(obj.msgs)
			},
			getLocalMsgByIdClient(idClient) {
				//获取 idClient = '' or idClients = [] 对应的本地消息
				nim.getLocalMsgByIdClient({
				    idClient: idClient,
				    done: Fn.getLocalMsgByIdClientDone
				})
			},
			getLocalMsgByIdClientDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('2获取本地消息' + (!error?'成功':'失败'));
			    if (!error) {
			        console.log(obj.msg)
			        inIt.onMsg(obj.msgs)
			    }
			},			
			getHistoryMsgs(account) {
				//获取云端消息
				nim.getHistoryMsgs({
				    scene: 'p2p',
				    to: account,
				    done: Fn.getHistoryMsgsDone
				});
			},
			getHistoryMsgsDone(error, obj) {
			    console.log('获取p2p历史消息' + (!error?'成功':'失败'));
			    console.log(error);
			    console.log(obj);
			    if (!error) {
			        console.log(obj.msgs);
			        if( obj.msgs.length > 0 ){
			        	inIt.onMsg(obj.msgs)
			    	}
			    }
			},
			sendMsgReceipt(lastMsg) {
				//消息已读回执
				nim.sendMsgReceipt({
				    msg: lastMsg,
				    done: Fn.sendMsgReceiptDone
				});
			},
			sendMsgReceiptDone(error, obj) {
			    console.log('发送消息已读回执' + (!error?'成功':'失败'), error, obj);
			    if( obj.msgReceipt && obj.msgReceipt.idClient ){
			    	Fn.getLocalMsgByIdClient(obj.msgReceipt.idClient)
				}
			},			
			updateMyInfo() {
				//更新我的名片
				nim.updateMyInfo({
				    nick: 'newNick',
				    avatar: 'http://newAvatar',
				    sign: 'newSign',
				    gender: 'male',
				    email: 'new@email.com',
				    birth: '1900-01-01',
				    tel: '13523578129',
				    custom: '{type: "newCustom", value: "new"}',
				    done: Fn.updateMyInfoDone
				});
			},
			updateMyInfoDone(error, user) {
			    console.log('更新我的名片' + (!error?'成功':'失败'));
			    console.log(error);
			    console.log(user);
			    if (!error) {
			        inIt.onUpdateMyInfo(user);
			    }
			},
			deleteLocalSession(account, _this) {
				//删除本地会话
				nim.deleteLocalSession({
				    id: 'p2p-'+account,
				    done: Fn.deleteLocalSessionDone
				});
				Fn.__this = _this;
			},
			deleteLocalSessionDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('删除本地会话' + (!error?'成功':'失败'));
		        if( Fn.__this ){
                    Fn.__this.alertTip(!error?false:true,'删除会话' + (!error?'成功':'失败'))
		    	}
			},			
			deleteSession(account, _this) {
				//删除服务器上的会话
				nim.deleteSession({
				    scene: 'p2p',
				    to: account,
				    done: Fn.deleteSessionDone
				});
				Fn.__this = _this;
			},
			deleteSessionDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('删除服务器上的会话' + (!error?'成功':'失败'));
		        if( Fn.__this ){
                    Fn.__this.alertTip(!error?false:true,'删除会话' + (!error?'成功':'失败'))
		    	}			    
			},
			updateLocalSession(account) {
				nim.updateLocalSession({
				    id: 'p2p-'+account,
				    localCustom: '',
				    done: Fn.updateLocalSessionDone
				});
			},
			updateLocalSessionDone(error, obj) {
			    console.log(error);
			    console.log(obj);
			    console.log('更新本地会话' + (!error?'成功':'失败'));
			}			

		}		
	}	
}
