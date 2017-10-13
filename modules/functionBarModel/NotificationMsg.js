import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { connect } from 'react-redux'
import { is } from 'immutable'
import { log, isEmpty } from '../../constants/UtilConstant'

//系统公告
const doc = document;
class NotificationMsg extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            msgData: {
                show: false,
                text: '' 
            }
        };
      	log("NotificationMsg");		
  	}
    closeSysMsg(temp) {
        this.setState({
            msgData: {
                show: false,
                text: ''
            }
        })
        const smDom = doc.querySelector('.search-center .shitu-main'); //搜索中心
        const lfpDom = doc.querySelector('.local-file-panel'); //本地素材
        const fapDom = doc.querySelector('.font-assistant-panel'); //字体助手
        const fmpDom = doc.querySelector('.file-management-panel'); //素材管理
        if( smDom ){
            smDom.style.height = "100%"; 
        }         
        if( lfpDom ){
            lfpDom.style.height = "calc(100% - 36px)"; 
        }
        if( fapDom ){
            fapDom.style.height = "100%";
        }
        if( fmpDom ){
            fmpDom.style.height = "calc(100% - 20px)";
        }
        if( temp )
           this.props.actions.sendHandleMessage('BroadcastMsgProcess', 'clickCloseNotice', '');
    }	   
    render() {   
        const { msgData } = this.state 
        return (
                  msgData.show && !isEmpty(msgData.text) ? 
                       <p className="sys-msg flex flex-c">
                           <span className="msg-text col-6 flex flex-c flex-item-gsb-1">
                              <i className="icons-local-material icons-20 lm-msg-bg"></i>
                              <span className="col-3 font-weight7">提示：</span>
                              <span className="text abs">{msgData.text}</span>
                           </span>
                           <a onClick={this.closeSysMsg.bind(this, true)} title="关闭" className="icons icons-18 close-dialog-bg flex-item-gsb-0"></a>
                       </p>
                  :
                       null                       
               )
    } 
    componentDidMount() {
        this.props.actionsLog.getPcNoticeMessageList()
    }
    componentWillReceiveProps(nextProps) {
        log('componentWillReceiveProps------------NotificationMsg')
        log(nextProps)
        log(this.props)
        //系统消息接收
        if( nextProps.pcNoticeMsg && nextProps.pcNoticeMsgLastUpdated !== this.props.pcNoticeMsgLastUpdated ){
            const pcmsg = nextProps.pcNoticeMsg.data;            
            if( pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                this.setState({
                    msgData: {
                        show: true,
                        text: pcmsg[0].content 
                    }
                })
            }
        }
        //js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;
            switch( jsModule ){
                case 'broadcast_clickCloseNotice':
                    this.closeSysMsg()
                break; 
              default:
                    return false;
              break;
            }                  
        }          
    }
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            if( nextProps.jsMsgHandle.module !== 'broadcast_clickCloseNotice' ){
                return false
            }                  
        }
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }      
}
const mapStateToProps = (state) => {
    return {
        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated                                            
    }
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(NotificationMsg))
