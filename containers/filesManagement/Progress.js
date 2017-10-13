import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'

class Progress extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            stnum: 0,
            stbfb: 0,
            isAnimation: false
        };
      	log("Progress");		
  	}	
    render() {
        const { stnum, stbfb, isAnimation } = this.state
        return (
            <div className="t-item scan-progress">
                <div className={isAnimation ? "run-bg" : "run-bg animation-stop"}></div>
                <div className="progress">
                    <div className={stnum == 0 ? "num default" : "num"}>{stnum}</div>
                    <div className="msg">可识图素材</div>
                    <div className={isAnimation ? "water" : "water animation-stop"} style={{"top": stbfb+"%", "display": (stbfb == 100) ? 'none' : 'block'}}></div>
                    <div className={isAnimation ? "water w2" : "water w2 animation-stop"} style={{"top": stbfb+"%", "display": (stbfb == 100)  ? 'none' : 'block'}}></div>                                                        
                </div>
                <div className="temp-animation abs" style={{"visibility": "hidden", "display": ((stbfb == 100) && !isAnimation) ? 'none' : 'block'}}>
                    <div id="runTemp" className="run"></div>
                </div>                
            </div>
        )
    } 
    getInitAllVolData() {
        //扫描状态百分比水球的信息
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getAllVolSumamry', {cmd: 5})       
    }    
    componentWillReceiveProps(nextProps) {
        //获取到配置信息后再调用==初始化请求状态数据
        if( nextProps.getConfig && nextProps.getConfig.types == 'FIRST_INIT_GET_CONFIG_INFO' && 
            nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //初始化请求状态数据
            this.getInitAllVolData()
        }        
        //js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
                log('---返回数据为空---')
                return;
            }      
            if( jsData.error_code !== 0 ){
                log(jsData.error +',(代码：'+ jsData.error_code +')')
                return;
            } 
            const jsVal = jsData.data;  
            if( isEmpty(jsVal) ){
                log('---返回数据data字段为空---');
                return;
            }        
            switch( jsModule ){
                case 'scan_all_cnt_t':
                    //获取扫描静止时的状态
                    this._scan_all_cnt_t(jsVal);
                break;
                case 'scan_del_path_rsp_t':
                    //确认移除扫描路径
                    this._scan_del_path_rsp_t(jsVal); 
                break; 
                case 'add_scan_path_t':
                    //要开始扫描了...
                    this._add_scan_path_t(jsVal); 
                break;                               
                case 'start_scan_path_t':
                    //启动扫描流程
                    this._start_scan_path_t(jsVal);
                break; 
                case 'get_feature_progress_t':
                    //获取识图信息进度
                    this._get_feature_progress_t(jsVal);
                break; 
                case 'scan_stop_completed_t':
                    //停止扫描
                    this._scan_stop_completed_t(jsVal);
                break;                                              
                case 'get_feature_all_finish_t':
                    //扫描流程结束
                    this._get_feature_all_finish_t(jsVal);
                break; 
                case 'stop_getting_t':
                    //前端控制点击停止获取识图信息
                    this._stop_getting_t(jsVal);
                break;                                                        
                default:
                    return false;
                break;
            }
        }
    }   
    _stop_getting_t(jsVal) {
        //前端控制点击停止获取
        this.getInitAllVolData() 
        this.setState({
            isAnimation: false,
            stbfb: 0
        })        
    }
    _scan_stop_completed_t(jsVal) {
        //停止扫描
        if( jsVal.stop_completed ){
            this.getInitAllVolData() 
            this.setState({
                isAnimation: false,
                stbfb: 0
            })                      
        }
    }    
    _scan_del_path_rsp_t(jsVal) {
        //确认移除扫描路径
        if( jsVal.del_rsp && jsVal.del_rsp.length > 0 ){
            this.getInitAllVolData()
        }
    }    
    _get_feature_all_finish_t(jsVal) {
        //扫描流程结束
        this.setState({
            isAnimation: false,
            stbfb: 0
        })
    }
    _get_feature_progress_t(jsVal) {
        //识图信息进度
        this.getInitAllVolData()
    } 
    _add_scan_path_t(jsVal) {
        //启动扫描流程
        this.setState({
            isAnimation: true,
            stbfb: 25
        })        
    }         
    _start_scan_path_t(jsVal) {
        //启动扫描流程
        this.setState({
            isAnimation: true,
            stbfb: 25
        })        
    }  
    _scan_all_cnt_t(jsVal) {
        //const bfb = jsVal.all_cnt == 0 ? 100 : (100 - (parseFloat(jsVal.cnt/jsVal.all_cnt*100).toFixed(2)));
        //stbfb: bfb >= 0 ? bfb : 100
        if( this.state.isAnimation ){
            this.setState({
                stnum: jsVal.cnt       
            })
        }else{
            this.setState({
                stnum: jsVal.cnt,
                stbfb: 0      
            })            
        }
    }   
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }    
}
export default (immutableRenderDecorator(Progress))
