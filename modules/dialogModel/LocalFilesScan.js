import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { SCAN_MODULE_DATA, SCAN_TIP_MODULE } from '../../constants/DataConstant'
import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, cloneObj, isEmpty } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT, SHOW_DIALOG_SCAN_RESULT, SHOW_DIALOG_SCAN_SHITU_FEATURE, 
         SHOW_MINMIZE_SHITU_FEATURE } from '../../constants/TodoFilters'

import ScanTop from '../smallModel/ScanTop'
import ScanMain from '../smallModel/ScanMain'
/* 弹出层--扫描主窗口  */
class LocalFilesScan extends Component {
	constructor(props) {
    	super(props);
        let tempPage = 0, tempThis = null, tempProgress = {}, tempTip = cloneObj(SCAN_TIP_MODULE), tempResult = null;
        if( this.props.dialogData && this.props.dialogData.position ){
            const _data = this.props.dialogData;
            switch(_data.position){
                case SHOW_DIALOG_SCAN_RESULT:
                     tempPage = 4
                break;
                case SHOW_DIALOG_SCAN_SHITU_FEATURE:
                    if( _data.codeData ){ 
                         if( _data.codeData.total_progress >= 100 ){
                            tempPage = 3;
                            tempThis = _data.codeData;
                            tempProgress = _data.codeData;
                            tempResult = null;
                            tempThis['scan_content'] = '扫描结束';
                            tempTip = _data.codeData.tipData ? _data.codeData.tipData : tempTip;                        
                         }else{
                            tempPage = 2;
                            tempThis = _data.codeData;
                            tempProgress = _data.codeData;
                            tempThis['scan_content'] = '正在从服务器获取识图信息...'; 
                            tempTip = _data.codeData.tipData ? _data.codeData.tipData : tempTip;                        
                         }
                    }
                break;
                default:                 
                break;     
            }
        }; 
      	this.state = {
            stopCompleted: false, // 停止扫描完成
            thisData: tempThis, //当前扫描数据
            progressData: tempProgress, //扫描总进度
            tipData: tempTip, //扫描下载组件
            resultData: tempResult, //扫描结果
            activePage: tempPage, //界面路由==0为扫描等待界面， 1为扫描界面，2为扫描获取识图信息，3为扫描结束，4为扫描详情页
            connectMsg: null //服务器出错信息
        };
    	log("LocalFilesScan");		
	}
    inItDragAbs(drag, absdom) {
        const parElem = document.querySelector('.local-files-scan-layer');
        if( parElem ){
            const dragElem = parElem.querySelector(drag);
            if( dragElem ){
                dragDrop(dragElem, parElem)
                if( absdom ){
                    absVerticalCenter2(absdom) 
                }
            }
        }            
    }
    didSendFn() {
        //初始化弹窗请求接口处理
        //判断是否扫描还是查看结果页面,只执行一次请求
        const { dialogData } = this.props
        if( dialogData  ){
            //通知其它区域--正在扫描中个别按扭操作是禁止的。
            //这里的allData传递过来其它用途的数据，比如allData.allScanPathData是检测-
            //-那个盘符正在扫描，然后把盘符图标替换成动态的图标
            //可以扫描时先清除一下最小化窗口
            //防止出现两个一样的扫描识图信息最小化的窗口
            this.props.actions.triggerMinmizeInfo({type: SHOW_MINMIZE_SHITU_FEATURE, mode:'del'})
            const allData = dialogData.rawData ? dialogData.rawData.allData : dialogData.allData;
            if( dialogData.position == null ){  
                this.props.actions.noticeMessage({action: false, type: 'SCAN', data: allData.allScanPathData})         
                this.props.actions.sendHandleMessage('ScanMsgProcess', 'startScan', dialogData.codeData)
            }
        }
    }
	render() {
		let { thisData, tipData, progressData, resultData, activePage, stopCompleted, 
              connectMsg } = this.state 
        const { dialogData, actions, getConfig, configLastUpdated } = this.props
        log('----render----LocalFilesScan----render----')
		log(this.props)
        log(this.state)
		return <div className="dialog local-files-scan-layer" ref="verticalCenter">
                    {
                        activePage == 4 ?
                            <div className="dialog-scan-top">
                                 <ScanTop 
                                    dialogData={dialogData}
                                    thisData={thisData}
                                    progressData={progressData}  
                                    resultData={resultData}
                                    activePage={activePage}
                                    actions={actions}/>
                            </div>
                        :
                            null                                
                    }
		            <div className="dialog-scan-main">
		                 <ScanMain
                            dialogData={dialogData}  
		                 	thisData={thisData} 
		                 	tipData={tipData}
		                 	progressData={progressData}
		                 	resultData={resultData}
                            activePage={activePage}
                            actions={actions}
                            stopCompleted={stopCompleted}
                            connectMsg={connectMsg}
                            getConfig={getConfig}
                            configLastUpdated={configLastUpdated}/>
		            </div>
		       </div>  
	}
	componentDidMount() {        
        //弹窗居中和拖拽处理
        if( this.state.activePage == 4 ){
            this.inItDragAbs('.dialog-scan-top', this.refs.verticalCenter);
        } else{
            this.inItDragAbs('.dialog-scan-main', this.refs.verticalCenter);
        }
		//判断是否扫描还是查看结果页面,只执行一次请求
        this.didSendFn()	
	}
    componentWillReceiveProps(nextProps) {
    	//js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
				log('---返回数据为空---')
            	return;
            }      
            if( jsData.error_code != 0 && jsModule != 'connect_msg_t' && jsModule != 'error_info_t' ){
            	log(jsData.error +',(代码：'+ jsData.error_code +')')
            	return;
            } 
            const jsVal = jsData.data;  
            if( isEmpty(jsVal) && jsModule != 'connect_msg_t' && jsModule != 'error_info_t' ){
            	log('---返回数据data字段为空---');
                return;
            }        
            try{
                switch( jsModule ){
                    case 'error_info_t':
                        //开始扫描之前出现的错误
                        //比如：扫描路径解析出错等
                        //传入参数为jsData
                        this._errorInfo(jsData);                      
                    break;
                    case 'scan_route':
                        //跳转扫描对应的页面
                        //不在此js文件里操作跳转页面时使用此方法
                        this._scanRoute(jsVal);                      
                    break;
                    case 'recursive_completed_t':
                       //扫描递归结束
                        this._startScan(jsVal)
                    break;
                	case 'scan_result_t': //第一列
                	case 'view_result_t': //第二列
                	case 'trans_result_t': //第三列
                		//开始启动扫描-接收到数据
						this._viewScan(jsVal)
                	break;
                	case 'scan_progress_t':
                        //整体流程进度条
                        this._scanProgress(jsVal)
                	break;
                	case 'download_progress_t':
                	    //下载组件
                	    this._downProgress(jsVal)
                	break;
                    case 'scan_stop_completed_t':
                        //内部停止扫描完成
                        this._stopCompleted(jsVal)
                    break;
                	case 'scan_finish_result_t':
                	    //扫描结果信息
                        this._finishResult(jsVal)
                	break;
                    case 'connect_msg_t':
                        //链图云服务器崩溃时，客户端须有对应处理方案。
                        //本地服务掉线 2501，下载服务器掉线 2502，下载服务器重连失败 2503，
                        //DOC服务器掉线 2504，DOC服务器重连失败 2505
                        //成功代码均为0
                        //这个方法有返回错误码，所以传入的参数为param
                        this._connectMsg(jsData)
                    break;
                    case 'get_feature_progress_t':
                        //获取识图信息
                        this._featureProgress(jsVal);
                    break; 
                	default:
                        return false;
                	break;
                }
            }catch(e){
                log('扫描出错')
            }
        }
    }	
    _errorInfo(jsData) {
        if( jsData.error_code != 0 ){
            let e_i_str = jsData.error;
            if( isEmpty(e_i_str) ){
                e_i_str = '未知错误，请重新扫描(代码：'+ jsData.error_code +')';
            }
            //提示时先调用停止扫描接口，防止扫描接口继续发送信息。
            //this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', ''); 
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_ALERT,
                text: e_i_str,
                auto: true, 
                speed: 3000
            });  
        }        
    }
    __pageData(str, data) {
        let _thisData = {},
            _progressData = {},
            _resultData = null;   
        if( data.data && data.data.thisData ) _thisData = data.data.thisData; 
        if( data.data && data.data.progressData ) _progressData = data.data.progressData;
        if( data.data && data.data.resultData ) _resultData = data.data.resultData;
        _thisData['scan_content'] = str;
        this.setState({
            activePage: data.page,
            thisData: _thisData,
            progressData: _progressData,
            resultData: _resultData
        })
    }
    _scanRoute(jsVal) {
        //跳转扫描对应的页面
        //不在此js文件里操作跳转页面时使用此方法
        log('--跳转扫描对应的页面：'+ jsVal.page)
        switch(jsVal.page){
            case 0:
                //重新初始化参数
                //请求开始扫描
                //扫描等待界面
                this.setState({
                    stopCompleted: false,
                    thisData: null,
                    progressData: {},
                    tipData: cloneObj(SCAN_TIP_MODULE),
                    resultData: null,
                    activePage: 1,
                    connectMsg: null                               
                })
                const { dialogData } = this.props
                if( dialogData && dialogData.codeData ){
                   setTimeout(() => {
                        this.props.actions.sendHandleMessage('ScanMsgProcess', 'startScan', dialogData.codeData)
                   },50) 
                }                 
            case 1:
                //扫描执行页面
                this.__pageData('素材预览图生成中...', jsVal)                
            break; 
            case 2:
                //扫描获取识图信息页面
                this.__pageData('正在从服务器获取识图信息...', jsVal)                    
            break;
            case 3:
                //扫描完成页面   
                this.__pageData('扫描结束', jsVal)                    
            break;
            case 4:
                //扫描结果页面
                this.__pageData('扫描结果列表', jsVal)
            break;    
            default:
                //不处理
            break;
        }       
    }
    _featureProgress(jsData) {
        //获取识图信息-处理
        if( this.state.activePage != 2 ){
            //判定等于1且识图进度为100时是防止识图进度在扫描进度之前触发
            if( this.state.activePage == 1 && jsData.total_progress == 100 ){
                log('触发了_featureProgress先执行，后再执行_scanProgress。-----_featureProgress')
                this._scanRoute({
                    page: 3, 
                    data: {
                       thisData: jsData,
                       progressData: jsData, 
                       resultData: null                 
                    }
                })                
            }
            //防止回退页面超前。
            log('防止回退页面。-----_featureProgress')
            return;
        }
        if( jsData.total_progress < 100 ){  
            this.setState({
                progressData: jsData
            })         
        }else{
            this._scanRoute({
                page: 3, 
                data: {
                   thisData: jsData,
                   progressData: jsData, 
                   resultData: null                 
                }
            })            
        }
    }
    _connectMsg(jsData) {
        //更新服务出错信息
        jsData['receivedAt'] = Date.now();
        this.setState({
            connectMsg: jsData
        })
    }
    _finishResult(jsData) {
        //更新扫描结果信息
    	this.setState({
    		resultData: jsData
    	})
    }
    _stopCompleted(jsData) {
        if( this.state.activePage != 1 && this.state.activePage != 2 ){
            //这里不能单判断是否在扫描界面，有时可能会在特征界面。
            //防止回退页面。
            log('防止回退页面。-----_stopCompleted')
            return;
        }         
        //更新扫描停止信息
        this.setState({
            stopCompleted: true
        })
    }
    _scanProgress(jsData) {
        if( this.state.activePage != 1 ){
            //防止回退页面或超前。
            log('防止回退页面。-----_scanProgress')
            return;
        }  
        if( jsData.total_progress >= 100 ){
            //跳转到结果模块
            this._scanRoute({
                page: 2, 
                data: {
                    progressData: {},
                    thisData: {}
                }
            })                
        }else{
            //更新进度数据
            this.setState({
                progressData: jsData
            })                                     
        }
    }
    _downProgress(jsData) {
        if( this.state.activePage != 1 ){
            //防止回退页面超前。
            log('防止回退页面。-----_downProgress')
            return;
        }         
        //更新生成预览图所需的组件信息
		const tipdata = this.state.tipData;
		for( let i = 0, len = tipdata.length; i < len; i++ ){
            if( tipdata[i].plugin_name == jsData.plugin_name ){
            	tipdata[i].download_progress = jsData.download_progress;
            	break;
            }
		}
    	this.setState({
    		tipData: this.state.tipData
    	})
    }
    _viewScan(jsData){
        if( this.state.activePage != 1 ){
            //防止回退页面超前。
            log('防止回退页面。-----_viewScan')
            return;
        }         
        //更新扫描文件信息
        ////view时时更新thisData，所有这边要时时加上scan_content
        //jsData['scan_content'] = '素材扫描中...'
        this.setState({
            thisData: jsData
        })
    }
    _startScan(jsData) { 
        if( this.state.activePage != 0 ){
            //防止回退页面超前。
            log('防止回退页面。-----_startScan')
            return;
        }        
        //file_total_count需要更新文件的数量值
        if( jsData.file_total_count > 0 ){
            //跳转到扫描模块
            jsData['sum_cnt'] = jsData.file_total_count;
            this._scanRoute({
                page: 1, 
                data: {
                    thisData: jsData
                }
            })
        }else{
            //不跳转模块
            //文件扫描和上一次扫描对比未有变更 2001
            jsData['receivedAt'] = Date.now();
            jsData['error_code'] = 2001;
            jsData['error'] = '未发现新增扫描的素材文件，即将自动退出';
            this.setState({
                connectMsg: jsData
            })            
        }                		              
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }
    componentDidUpdate(nextProps, nextState) {
        if( this.state.activePage == 4 && nextState.activePage != 4 ){
            this.inItDragAbs('.dialog-scan-top', this.refs.verticalCenter);
        }
        if( this.state.activePage != 4 && this.state.activePage != nextState.activePage ){
            this.inItDragAbs('.dialog-scan-main');
        } 
        if( nextProps.resize.w != this.props.resize.w || nextProps.resize.h != this.props.resize.h ){
            absVerticalCenter2(this.refs.verticalCenter)
        }      
    }
    componentWillUnmount() {
        //销毁组件
        //通知其它区域--扫描完成后解除个别按扭的禁止行为。
        this.props.actions.noticeMessage({action: true, type: 'SCAN'})        
        //退出扫描模块时把扫描按扭重新定义成可用状态。
        const scanBtnDom = document.getElementById('ScanReadButton');
        if( scanBtnDom ){
            scanBtnDom.disabled = false;
            scanBtnDom.classList.remove('opacity8')            
        }               
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
)(immutableRenderDecorator(LocalFilesScan))
