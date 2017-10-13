import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { msgConfirmHtml, msgAlertSuccessHtml } from '../../constants/RenderHtmlConstant'
import { absVerticalCenter2 } from '../../constants/DomConstant'
import { SCAN_MODULE_DATA } from '../../constants/DataConstant'
import { log, isEmpty } from '../../constants/UtilConstant'
import { SHOW_DIALOG_SCAN_RESULT, SHOW_DIALOG_CONFIRM, SCAN_RESTART_LOCAL_SERVICE } from '../../constants/TodoFilters'

//扫描操作按扭
class ScanExecution extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            confirm: {
                show: false,
                data: null
            },
            alert: {
                show: false,
                data: null  
            },
            cdTimer: null,
            msgTimer: null,
            isEndClose: false
        };
      	log("ScanExecution--扫描操作按扭");		
  	}	    
    startScan(event) {
        //重新扫描     
        //重新请求一次扫描
        if( this.props.dialogData && this.props.dialogData.codeData ){
            if( event ){
                event.stopPropagation();
                event.preventDefault();
                const btnDom = event.currentTarget;
                if( btnDom ){
                    btnDom.disabled = true;
                }
            }
            //跳转到初始化扫描页面
            window.JsMsgHandle && window.JsMsgHandle('scan_route', {
                error_code: 0, 
                error: '', 
                data: {
                    page: 0
                }
            })
        }else{
            log('----扫描初始化没有参数(codeData)----')
        }                       
    }  
    onClose() {
        const ctDom = document.querySelector('.scan-execution .stop-btn');
        if( ctDom && ctDom.disabled == true ) ctDom.disabled = false; 
        this.setState({
            confirm: {
                show: false,
                data: null
            }
        })        
    }
    onConfirm() {
        //停止扫描
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '')
        this.setState({
            confirm: {
                show: false,
                data: null
            },
            alert: {
                show: true,
                data: '正在停止扫描，请稍候...'
            }
        }) 

    }	
    onCloseDialog() {
        //退出扫描弹窗时先调停止扫描接口，防止扫描接口继续发送信息。
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '');
        this.props.actions.triggerDialogInfo(null)
    }
    stopStatu (event) {
        //询问是否停止扫描
        if( event ){
            event.stopPropagation();
            event.preventDefault();
            const ctDom = event.currentTarget;
            if( ctDom ) ctDom.disabled = true;
        }
        const data = {
            title: '扫描',
            text: '您确定要停止本次扫描吗？',
            onClose: this.onClose.bind(this),
            onConfirm: this.onConfirm.bind(this)
        }
        this.setState({
            confirm: {
                show: true,
                data: data 
            }
        }) 
    }
    countDownFn(cmsgData, times) {
        let errorStr = cmsgData.error;
        if( isEmpty(errorStr) ){
            errorStr = '服务器已断开，正在重新尝试连接...(代码：'+ cmsgData.error_code +')';
        }
        this.state.cdTimer = setInterval(() => {
            times--
            if( times <= 0 ){
                clearInterval(this.state.cdTimer); 
                //未重连成功跳转到完成页面;
                //跳转时先调停止扫描接口，防止扫描接口继续发送信息。
                this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '');                
                window.JsMsgHandle && window.JsMsgHandle('scan_route', {
                    error_code: 0, 
                    error: '', 
                    data: {
                        page: 3,
                        data: {
                            thisData: {},
                            progressData: {total_progress: 100},
                            resultData: null
                        }                    
                    }
                });           
                this.setState({
                    alert: {
                        show: false,
                        data: null
                    },
                    confirm: {
                        show: false,
                        data: null
                    },
                    cdTimer: null,
                    msgTimer: null                     
                })                                
                return false;
            }
            const data = errorStr + '。重新连接：'+times +'秒';
            this.setState({
                alert: {
                    show: true,
                    data: data
                },
                confirm: {
                    show: false,
                    data: null 
                }
            })                    
        }, 1000)                
    } 
    confirmFn(str, times, isClose) {
        clearInterval(this.state.cdTimer);
        clearTimeout(this.state.msgTimer);
        const stopDom = document.querySelector('.scan-execution .stop-btn');    
        if( stopDom ){
            stopDom.disabled = false;
        }                
        if( isClose ){
            //5秒的时候过程中可能会出现server其它错误，所以这里要定义特殊标识符:isEndClose
            this.state.cdTimer = setInterval(() => {
                if( times < 0 ){
                    clearInterval(this.state.cdTimer);   
                    //重新获取一下配置信息---获取扫描结束时间
                    this.props.actions.getConfigInfo();                                                     
                    //关闭扫描窗口，结束扫描
                    this.props.actions.triggerDialogInfo(null);                                   
                    return false;
                }
                const newStr = str + times +'秒';
                const data = {
                    title: '提示',
                    text: newStr,
                    onClose: () => {
                        clearInterval(this.state.cdTimer);   
                        //重新获取一下配置信息---获取扫描结束时间
                        this.props.actions.getConfigInfo();                                                     
                        //关闭扫描窗口，结束扫描
                        this.props.actions.triggerDialogInfo(null);
                    },
                    onConfirm: () => {
                        clearInterval(this.state.cdTimer);   
                        //重新获取一下配置信息---获取扫描结束时间
                        this.props.actions.getConfigInfo();                                                     
                        //关闭扫描窗口，结束扫描
                        this.props.actions.triggerDialogInfo(null);
                    },
                    btnCustomize: {
                        confirm: {
                            text: '立即退出'
                        }
                    }
                }                
                this.setState({
                    confirm: {
                        show: true,
                        data: data
                    },
                    alert: {
                        show: false,
                        data: ''
                    },
                    isEndClose: isEmpty(isClose) ? this.state.isEndClose : isClose
                });
                times--                                    
            }, 1000)
            //扫描时没有新文件需要更新时先调停止扫描接口，防止扫描接口继续发送信息。
            this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '');                         
        }else{
            this.setState({
                confirm: {
                    show: true,
                    data: {
                        title: '提示',
                        text: str
                    }
                },
                alert: {
                    show: false,
                    data: ''
                },
                isEndClose: isEmpty(isClose) ? this.state.isEndClose : isClose
            });            
            this.state.msgTimer = setTimeout(() => {
                this.setState({
                    alert: {
                        show: false,
                        data: ''
                    },
                    cdTimer: null,
                    msgTimer: null                         
                })
            },times*1000);  
        }        
    }
    alertFn(str, times, isClose) {
        clearInterval(this.state.cdTimer);
        clearTimeout(this.state.msgTimer);
        const stopDom = document.querySelector('.scan-execution .stop-btn');    
        if( stopDom ){
            stopDom.disabled = false;
        }                
        if( isClose ){
            //5秒的时候过程中可能会出现server其它错误，所以这里要定义特殊标识符:isEndClose
            this.state.cdTimer = setInterval(() => {
                if( times < 0 ){
                    clearInterval(this.state.cdTimer);   
                    //重新获取一下配置信息---获取扫描结束时间
                    this.props.actions.getConfigInfo();                                                     
                    //关闭扫描窗口，结束扫描
                    this.props.actions.triggerDialogInfo(null);                                   
                    return false;
                }
                const newStr = str + times +'秒';
                this.setState({
                    confirm: {
                        show: false,
                        data: null
                    },
                    alert: {
                        show: true,
                        data: newStr
                    },
                    isEndClose: isEmpty(isClose) ? this.state.isEndClose : isClose
                });
                times--                                    
            }, 1000)
            //扫描时没有新文件需要更新时先调停止扫描接口，防止扫描接口继续发送信息。
            this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '');                         
        }else{
            this.setState({
                confirm: {
                    show: false,
                    data: null
                },
                alert: {
                    show: true,
                    data: str
                },
                isEndClose: isEmpty(isClose) ? this.state.isEndClose : isClose
            });            
            this.state.msgTimer = setTimeout(() => {
                this.setState({
                    alert: {
                        show: false,
                        data: ''
                    },
                    cdTimer: null,
                    msgTimer: null                         
                })
            },times*1000);  
        }               
    } 
    selectDetail() {
        //跳转到扫描结果详情页面
        window.JsMsgHandle && window.JsMsgHandle('scan_route', {
            error_code: 0, 
            error: '', 
            data: {
                page: 4,
                data: {
                    resultData: null
                }                
            }
        })        
    }          
    render() {
        const { dialogData, activePage, hideSE } = this.props
        const { confirm, alert } = this.state
        let seclass = 'scan-execution flex flex-c flex-item-gsb-1 flex-r-r';
        return (
            <div className={seclass}>
                <div className="w-full flex flex-c flex-item-gsb-1 flex-r-r" style={hideSE ? {"display":"none"}: null}>
                    {
                        activePage == 4 ?
                            <div className="scan-ok flex flex-c">
                               <a className="link-btn hover-line link-back col-bai" onClick={() => this.props.actions.triggerDialogInfo(null)}>返回</a>
                               {
                                   dialogData.position == SHOW_DIALOG_SCAN_RESULT ?
                                      null
                                   :
                                      <button className="bor-rad-5 se-btn start-scan-btn active" onClick={this.startScan.bind(this)}>重新扫描</button> 
                               }
                            </div>
                        :
                        activePage == 1 ?
                            <button className="bor-rad-5 se-btn stop-btn active" onClick={this.stopStatu.bind(this)}>停止扫描</button>  
                        :
                        activePage == 3 ?
                            <button className="bor-rad-5 se-btn active" onClick={this.selectDetail.bind(this)}>查看详情</button>
                        :
                            null       
                    } 
                </div>
                {
                    confirm.show ?
                        msgConfirmHtml(confirm.data)
                    :
                        null    
                }  
                {
                    alert.show ?
                        msgAlertSuccessHtml(alert.data, 'false')
                    :
                        null    
                }

            </div>
        )
    }	
    componentDidMount() {
        if( document.querySelector('.start-scan-btn') ){
            document.querySelector('.start-scan-btn').disabled = false;
        }
    } 
    componentWillReceiveProps(nextProps) {
        if( nextProps.stopCompleted && !this.props.stopCompleted ){
            //停止按扭点击-收到信息后处理
            //停止扫描后跳转到扫描完成页面
            window.JsMsgHandle && window.JsMsgHandle('scan_route', {
                error_code: 0, 
                error: '', 
                data: {
                    page: 3,
                    data: {
                        thisData: {},
                        progressData: {total_progress: 100},
                        resultData: null
                    }                    
                }
            });           
            this.setState({
                alert: {
                    show: false,
                    data: null
                }
            })
        }
        if( (nextProps.connectMsg && !this.props.connectMsg) ||
            (nextProps.connectMsg && this.props.connectMsg && 
            nextProps.connectMsg.receivedAt != this.props.connectMsg.receivedAt) ){
            //收到服务崩溃信息后处理
            const stopDom = document.querySelector('.scan-execution .stop-btn'),
                  cmsgData = nextProps.connectMsg;
            if( isEmpty(cmsgData) ){
                return;
            }      
            if( stopDom ){
                stopDom.disabled = true;
            }     
            switch(cmsgData.error_code){
                case 0:
                   const csData = cmsgData.data;
                   if( csData ){
                       switch(csData.server){
                           case 0:
                               //本地服务已经重启
                               //这里不做处理
                           break;
                           case 1:
                           case 2:
                               //1机器学习服务器已经重连成功
                               //2下载服务器已经重连成功
                               //上一次的error_code不能是2001，如果是的话会导致扫描窗口不会退出，会被当前错误提示给冲掉
                                if( nextProps.activePage < 3 && !this.state.isEndClose ) this.alertFn('服务器已恢复正常', 2);
                           break;
                           default:
                              //不处理
                           break;
                       }
                   }
                break;
                case 2001:
                   //文件扫描和上一次扫描对比未有变更 2001
                   //第三个参数为特殊标识，可以作关闭窗口的条件，也可以防server同时出现时的程序错乱
                   this.confirmFn(cmsgData.error, 5, true)
                break;
                case 2501:
                    //本地服务掉线
                    //退出扫描弹窗，弹出提示窗
                    //信息：本地服务遇到致命错误，正在为您重新启动本地服务，请稍候...
                    //连接成功后提示可以继续扫描
                    //退出扫描弹窗时先调停止扫描接口，防止扫描接口继续发送信息。
                    this.props.actions.sendHandleMessage('ScanMsgProcess', 'stopScan', '');
                    const dialogData = nextProps.dialogData;                   
                    const data = {
                        type: SHOW_DIALOG_CONFIRM,
                        title: '扫描',
                        text: '本地服务遇到致命错误 (代码：'+ cmsgData.error_code +')',
                        model: 'SCAN_WAIT',
                        auto: false,
                        timeText: '秒',
                        speed: 60,                         
                        code: SCAN_RESTART_LOCAL_SERVICE,
                        codeData: dialogData.rawData ? dialogData.rawData : dialogData.codeData,
                        allData: dialogData.rawData ? dialogData.rawData.allData : dialogData.allData       
                    }
                    this.props.actions.triggerDialogInfo(data);
                break;
                case 2502:
                case 2503:
                case 2504:
                case 2505:
                   //2502下载服务器掉线，2503下载服务器重连失败，2504 DOC服务器掉线，2505 DOC服务器重连失败
                   //弹出60秒倒计时
                   //若走完60秒还没重连成功的话直接跳转到完成页面
                   //反之重连成功后继续走流程
                   if( !this.state.cdTimer && nextProps.activePage < 3 ){ 
                       this.countDownFn(cmsgData, 60)
                   }                   
                default:
                break;
            }                         
        }
    }  
    componentDidUpdate(nextProps, nextState) {
        const confirmDom = document.querySelector('.confirm-dialog-layer'),
              alertDom = document.querySelector('.alert-dialog-layer');
        if( confirmDom ){
            absVerticalCenter2(confirmDom)
        }
        if( alertDom ){
            absVerticalCenter2(alertDom)
        }
    }
    componentWillUnmount() {
        if( this.state.cdTimer ){
            clearInterval(this.state.cdTimer);
        } 
        if( this.state.msgTimer ){
            clearTimeout(this.state.msgTimer);
        }       
    }   
}
export default immutableRenderDecorator(ScanExecution)