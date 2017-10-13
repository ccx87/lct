import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'

import Top from './Top'
import Content from './Content'

class Main extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("Main");		
  	}	
    render() {
        return (
            <div className="flex file-management-panel" style={{"height": "calc(100% - 20px)"}}>
                <Top {...this.props}/>
                <Content {...this.props}/>
            </div>
        )
    } 
    componentWillReceiveProps(nextProps) {  
        if( nextProps.pcNoticeMsg && nextProps.pcNoticeMsgLastUpdated !== this.props.pcNoticeMsgLastUpdated ){
            const pcmsg = nextProps.pcNoticeMsg.data,
                  lfpDom = document.querySelector('.file-management-panel');
            if( lfpDom && pcmsg && pcmsg.constructor == Array && pcmsg.length > 0 ){
                //35px + 20px
               lfpDom.style.height = "calc(100% - 55px)"; 
            }
        }
        //添加文件夹
        if(  nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){
            if( !isEmpty(nextProps.openFilePath_3.data) ){
                //添加文件夹后立即执行扫描
                //开始启动扫描
                this.props.actions.sendHandleMessage('ScanMsgProcess', 'addScanPath', {add_path: nextProps.openFilePath_3.data})
            }
        }                      
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }    
}
const mapStateToProps = (state) => {
  	return {
        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated,

        openFilePath_3: state.events.openFilePath_3,
        openFile3LastUpdate: state.events.openFile3LastUpdate                                                                 
  	}
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(Main))
