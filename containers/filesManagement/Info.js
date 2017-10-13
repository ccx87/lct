import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, getTimeDiff, ellipsisStr, getCss } from '../../constants/UtilConstant'
import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT, LOOP_SCAN_ACTIVE, SHOW_SELECT_FOLDERS, SHOW_GUILD_1 } from '../../constants/TodoFilters'

const defaultText = '计算中...',
      infoMode = {
         INIT: 0,
         VIEW: 1,
         FEATURE: 2,
         STOP: 3,
         BUSY: 4,
         COMPONENT: 5,
         DIFF: 6
      };
class Info extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            isScaning: false,
            stStatu: 0,
            stDiffDate: 0,
            filesTotal: defaultText,
            alwaysPath: defaultText,
            nextScamTime: '--',
            waitFeature: defaultText,
            timer: null,
            isInit: false,
            autoSwitch: true
        };
        this.stopScaning = () => {
            //clearInterval(this.state.timer)//清除获取剩于识图数量定时器
            this.getStopData();
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '正在停止扫描，请稍候...'})
        }
      	log("Status");
  	}
    render() {
        const { stStatu, stDiffDate, filesTotal, alwaysPath, nextScamTime, waitFeature } = this.state
        if( stStatu == infoMode.STOP || stStatu == infoMode.COMPONENT ){
            const getConfig = this.props.getConfig,
            data = getConfig && getConfig.data;
            if( data ){
                if( data.auto_scan_switch && data.auto_scan_switch.value == 1 ){
                    this.state.autoSwitch = true;

                }else{
                    this.state.autoSwitch = false;
                }
            }
        }
        return (
            <div className="t-item scan-info">
                {
                    stStatu === infoMode.INIT ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button add-btn" onClick={() => this.props.actions.triggerDialogInfo({type: SHOW_SELECT_FOLDERS})}>选择文件夹</button>
                            </div>
                            <div className="info-tip">请选择图片素材所在的文件夹</div>
                            <div className="info-msg">系统自动生成素材的预览图，方便您或其它用户识图搜索</div>
                        </div>
                    :
                    stStatu === infoMode.VIEW ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button stop-btn" onClick={this.stopScaning}>停止扫描</button>
                            </div>
                            <div className="info-tip">正在生成预览图，可能需要较长时间请耐心等候...</div>
                            <div className="info-show">
                                <span className="show-field">发现素材：</span>
                                <span className="show-text">{filesTotal}</span>
                            </div>
                            <div className="info-show">
                                <span className="show-field">正在处理：</span>
                                <span className="show-text" id="showFilePath"><span id="filePathName">{alwaysPath}</span></span>
                            </div>
                        </div>
                    :
                    stStatu === infoMode.FEATURE ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button stop-btn" onClick={this.stopScaning}>停止扫描</button>
                            </div>
                            <div className="info-tip">正在上传预览图获取识图信息，请稍候...</div>
                            <div className="info-msg">如服务器繁忙，您可停止此次扫描。剩余识图信息将在下次扫描时重新获取</div>
                            <div className="info-msg">未获取到的识图信息数量：{waitFeature}</div>
                        </div>
                    :
                    stStatu === infoMode.STOP ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button scan-btn" onClick={this.startScanFn.bind(this)}>一键扫描</button>
                            </div>
                            <div className="info-tip">扫描已停止，未扫描的素材需等待下次重新扫描</div>
                            {
                                this.state.autoSwitch ?
                                   <div className="info-msg" style={{"display":"none"}}>下次自动扫描时间：<span className="col-lan">{nextScamTime}</span>，您也可以重新扫描</div>
                                :
                                   <div className="info-msg">自动扫描已关闭，可通过“扫描设置”开启自动扫描</div>
                            }
                        </div>
                    :
                    stStatu === infoMode.BUSY ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button stopgetting-btn" onClick={this.stopgetting.bind(this)}>停止扫描</button>
                            </div>
                            <div className="info-tip">服务器繁忙，请您耐心等候...</div>
                            <div className="info-msg">您可以继续等待或停止扫描，剩余识图信息将等待下次扫描或系统空闲时重新获取</div>
                            <div className="info-msg">未获取到的识图信息数量：{waitFeature}</div>
                        </div>
                    :
                    stStatu === infoMode.COMPONENT ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button search-btn" onClick={this.startScanFn.bind(this)}>一键扫描</button>
                            </div>
                            <div className="info-tip">扫描已完成，请前往“首页”搜图吧！</div>
                            {
                                this.state.autoSwitch ?
                                   <div className="info-msg" style={{"display":"none"}}>下次自动扫描时间：<span className="col-lan">{nextScamTime}</span></div>
                                :
                                   <div className="info-msg">自动扫描已关闭，可通过“扫描设置”开启自动扫描</div>
                            }
                        </div>
                    :
                    stStatu === infoMode.DIFF ?
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button scan-btn" onClick={this.startScanFn.bind(this)}>立即扫描</button>
                            </div>
                            <div className="info-tip">您已经{stDiffDate}天未扫描，是否又新增了许多新素材</div>
                            <div className="info-msg">点击“立即扫描”，更新素材预览图</div>
                        </div>
                    :
                        <div className="info-item">
                            <div className="info-btn">
                                <button className="button add-btn" onClick={() => this.props.actions.triggerDialogInfo({type: SHOW_SELECT_FOLDERS})}>选择文件夹</button>
                            </div>
                            <div className="info-tip">请选择图片素材所在的文件夹</div>
                            <div className="info-msg">系统自动生成素材的预览图，方便您或其它用户识图搜索</div>
                        </div>
                }
            </div>
        )
    }
    docsInitData() {
        //初始化准备
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanDocsInitRequest', '');
    }
    showAlert(text) {
        this.props.actions.triggerDialogInfo({
            type: SHOW_DIALOG_ALERT,
            text: '<img class="icons-40" src="compress/img/loading6.gif"/>'+ text,
            auto: false
        })
    }
    componentDidMount() {
        //初始化扫描准备
        this.docsInitData();
    }
    showGuide(getConfig) {
        //新手引导
        const configObj = getConfig && getConfig.data;
        if( configObj && configObj.user_guide ){
            const ugVal = parseInt(configObj.user_guide.value)
            if( ugVal < 1 ){
                this.props.actions.triggerDialogInfo({type: SHOW_GUILD_1})
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //初始化info第一次状态
            //读取扫描状态
            if( !this.state.isScaning ){
                if( this.state.isInit ){
                    //初始化完成后调用
                    this.showGuide(nextProps.getConfig)
                }
                try{
                    const pathObj = nextProps.getConfig.data && nextProps.getConfig.data.scan_docs_always_path,
                          arr = (pathObj && !isEmpty(pathObj.value) && JSON.parse(pathObj.value)) || [];
                    log(arr)
                    if( arr.length == 0 ){
                        this.state.stStatu = infoMode.INIT;
                    }else{
                        if( this.state.stStatu == infoMode.INIT ){
                            //初始化修改stStatu状态
                            this.state.stStatu = infoMode.DIFF;
                            this.state.stDiffDate = this.diffTimeFn(nextProps);
                            log("扫描相差天数：")
                            log(this.state.stDiffDate)
                            if( this.state.stDiffDate == 0 ){
                                this.state.stStatu = infoMode.COMPONENT;
                            }
                        }
                    }
                }catch(e){
                    log('初始化info第一次状态解析错误')
                }
                this.setState({
                    stStatu: this.state.stStatu,
                    stDiffDate: this.state.stDiffDate
                })
            }
        }
        //js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;
            if( !jsData ){
                log('---返回数据为空---')
                return;
            }
            if( jsData.error_code !== 0 && jsModule !== 'error_info_t' && jsModule !== 'scan_init_status_t' ){
                log(jsData.error +',(代码：'+ jsData.error_code +')')
                return;
            }
            const jsVal = jsData.data;
            if( isEmpty(jsVal) && jsModule !== 'error_info_t' && jsModule !== 'scan_init_status_t' ){
                log('---返回数据data字段为空---');
                return;
            }
            switch( jsModule ){
                case 'error_info_t':
                    //扫描出错时
                    //传入参数为jsData
                    this._error_info_t(jsData);
                break;
                case 'scan_init_status_t':
                    //初始化准备
                    this._scan_init_status_t(jsVal);
                break;
                case 'add_scan_path_t':
                    //要开始扫描了...
                    this._add_scan_path_t(jsVal);
                break;
                case 'start_scan_path_t':
                    //启动扫描流程
                    this._start_scan_path_t(jsVal);
                break;
                case 'recursive_completed_t':
                    //递归扫描目录后返回的数据
                    this._recursive_completed_t(jsVal);
                break;
                case 'view_result_t':
                    //时时更新当前正在处理的文件路径
                    this._view_result_t(jsVal);
                break;
                case 'scan_progress_t':
                    //预览图生成进度
                    this._scan_progress_t(jsVal);
                break;
                case 'scan_preview_all_finish_t':
                    //是否所有的预览图都完成
                    this._scan_preview_all_finish_t(jsVal);
                break;
                case 'get_feature_all_finish_t':
                    //扫描流程结束
                    this._get_feature_all_finish_t(jsVal);
                break;
                case 'scan_stop_completed_t':
                    //停止扫描
                    this._scan_stop_completed_t(jsVal);
                break;
                case 'auto_scan_time_t':
                    //获取下次自动扫描时间
                    this._auto_scan_time_t(jsVal);
                break;
                case 'auto_scan_start_req_t':
                    //触发自动扫描机制
                    this._auto_scan_start_req_t(jsVal);
                break;
                case 'get_wait_feature_cnt_t':
                    //获取剩于识图信息数量
                    this._get_wait_feature_cnt_t(jsVal);
                break;
                default:
                    return false;
                break;
            }
        }
    }
    startScanFn() {
        setTimeout(() => {
            this.props.actions.sendHandleMessage('ScanMsgProcess', 'startScan', '')
        }, 100)
        try{
            window.JsMsgHandle('add_scan_path_t', {error_code: 0, error: '', data: 'All', desc: '点击<立即扫描>自己触发添加全部扫描列表'})
        }catch(e){}
    }
    getInitWaitFeatureData() {
        //获取剩于识图信息数量
        this.props.actions.sendHandleMessage('ScanMsgProcess','getWaitFeatureCount','');
    }
    getInitAutotimeData() {
        //获取下次自动扫描的时间
        if( this.state.autoSwitch ){
            this.props.actions.sendHandleMessage('ScanMsgProcess','getAutoScanTime','');
        }
    }
    getStopData() {
        this.props.actions.sendHandleMessage('ScanMsgProcess','stopScan','');
    }
    stopgetting() {
        //前端控制停止获取按扭
        //3013停止获取识图信息----8月-10号(C++负责)
        this.setState({
            isScaning: false,
            stStatu: infoMode.STOP
        })
        this.getInitAutotimeData()
        try{
            window.JsMsgHandle('stop_getting_t', {error_code: 0, error: '', data: '点击<停止获取>按扭后分发消息'})
        }catch(e){}
    }
    _scan_init_status_t(jsVal) {
        if( !jsVal.init ){
            const err = isEmpty(jsVal.init_info) ? '系统更新中，请稍候...' : jsVal.init_info;
            this.showAlert(err)
            if( this.state.isInit ){
                //重新初始化扫描准备
                this.docsInitData()
            }
        }else{
            setTimeout(() => {
                if( document.getElementById('Alert') ){
                    this.props.actions.triggerDialogInfo(null)
                }
            }, 1000)
            if( !this.state.isInit ){
                this.showGuide(this.props.getConfig)
                this.setState({isInit: true})
                //全部初始化调用的数据在init为true时才能调用
                //扫描路径列表的信息
                this.props.actions.sendHandleMessage('ScanMsgProcess','getScanFolderDetail', '');
            }
        }
    }
    _get_wait_feature_cnt_t(jsVal) {
        //获取剩于识图信息数量
        this.setState({
            waitFeature: jsVal.wait_feature_cnt
        })
    }
    _error_info_t(jsData) {
        //扫描出错时
        switch(jsData.error_code){
            case 3013:
                //jsData.error_code == 3013为获取识图信息10分钟超时。
                if( this.state.stStatu != infoMode.COMPONENT && this.state.stStatu != infoMode.STOP ){
                    //调用停止扫描接口
                    this.getStopData()
                }
            break;
            case 2506:
                //jsData.error_code == 2506==请勾选扫描文件夹后，再扫描 (代码：2506)。
                let err = !isEmpty(jsData.error) ? jsData.error : '当前没有可扫描的文件夹(代码：'+ jsData.error_code +')';
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: err,auto: true,speed: 3000,statu: 0})
                if( this.state.isScaning ){
                    //停止扫描
                    this.getStopData()
                }
            break;
            case 2510:
            case 2511:
                //路径扫描出错时，前端判断自己触发调用剩余流程接口
                try{
                    if( !jsData.data ){
                        return;
                    }
                    setTimeout(() => {
                        //递归完成
                        window.JsMsgHandle('recursive_completed_t', {error_code: 0, error: '', data: {file_total_count: 0}, desc: '前端触发此接口1'})
                    },10)
                    //跳过view层
                    setTimeout(() => {
                        //预览图生成
                        window.JsMsgHandle('scan_progress_t', {error_code: 0, error: '', data: {total_progress: 100, progress_folder: [jsData.data.error_scan_folder]}, desc: '前端触发此接口2'})
                    },20)
                    setTimeout(() => {
                        //识图信息
                        window.JsMsgHandle('get_feature_progress_t', {error_code: 0, error: '', data: {total_progress: 100, progress_folder: [jsData.data.error_scan_folder]}, desc: '前端触发此接口3'})
                    },30)
                    if( jsData.data.all_preview_complete ){
                        setTimeout(() => {
                            //预览图总生成
                            window.JsMsgHandle('scan_preview_all_finish_t', {error_code: 0, error: '', data: {complete: true}, desc: '前端触发此接口4'})
                        },40)
                    }
                }catch(e){}
            break;
            case 2512:
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: jsData.data.error_info+'(错误类型：)'+ jsData.data.error_type,
                    auto: true,
                    speed: 3000
                });
            break;
            default:
                //其它错误：比如磁盘空间不足等
                let e_i_str = jsData.error;
                if( isEmpty(e_i_str) ){
                    e_i_str = '未知错误，请重新扫描(代码：'+ jsData.error_code +')';
                }
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: e_i_str,
                    auto: true,
                    speed: 3000
                });
            break;
        }
    }
    _auto_scan_start_req_t() {
        //触发自动扫描机制
        this.props.actions.triggerDialogInfo({
            type: SHOW_DIALOG_CONFIRM,
            title: '系统提示',
            text: '即将执行定期扫描',
            code: LOOP_SCAN_ACTIVE,
            auto: true,
            timeText: '秒后自动开始',
            speed: 10
        })
    }
    _auto_scan_time_t(jsVal) {
        //获取下次自动扫描时间
        if( jsVal.next_scan_time ) {

            //- 更新设置Tip模块的下次扫描时间
            document.getElementById('nextScanTime').innerText = jsVal.next_scan_time;

            this.setState({
                nextScamTime: jsVal.next_scan_time
            })
        }
    }
    _scan_stop_completed_t(jsVal) {
        //停止扫描
        if( jsVal.stop_completed && this.state.stStatu != infoMode.COMPONENT && this.state.stStatu != infoMode.STOP ){
            this.getInitAutotimeData()
            this.setState({
                isScaning: false,
                stStatu: infoMode.STOP
            })
        }
        setTimeout(() => {
            this.props.actions.triggerDialogInfo(null)
        },1000)
    }
    _get_feature_all_finish_t(jsVal) {
        //clearInterval(this.state.timer)//清除获取剩于识图数量定时器
        //扫描流程结束
        if( jsVal.complete ){
            this.getInitAutotimeData()
            this.setState({
                isScaning: false,
                stStatu: infoMode.COMPONENT
            })
        }
    }
    _scan_progress_t(jsVal) {
        //预览图进度
        if( jsVal.total_progress >= 100 && this.state.stStatu != infoMode.COMPONENT && this.state.stStatu != infoMode.STOP ){
            //filesTotal,alwaysPath初始化
            //不跳转
            this.setState({
                filesTotal: defaultText,
                alwaysPath: defaultText,
                waitFeature: defaultText
            })
        }
    }
    _scan_preview_all_finish_t(jsVal) {
        //是否所有的预览图都已生成
        if( jsVal.complete && this.state.stStatu != infoMode.COMPONENT && this.state.stStatu != infoMode.STOP ){
            //filesTotal,alwaysPath初始化
            //跳转到识图信息进度
            this.setState({
                stStatu: infoMode.FEATURE,
                filesTotal: defaultText,
                alwaysPath: defaultText,
                waitFeature: defaultText
            })
            //获取识图信息中，获取中的识图信息数量每1分钟（暂定）刷新1次
            this.getInitWaitFeatureData()//首先自调用一次
            //clearInterval(this.state.timer)//清除定时器
            //this.state.timer = setInterval(() => {
            //   this.getInitWaitFeatureData()
            //}, 60000)
        }
    }
    _view_result_t(jsVal) {
        //正在处理
        if( jsVal.file_path ){
            this.setState({
                alwaysPath: jsVal.file_path
            })
        }
    }
    _recursive_completed_t(jsVal){
        //递归完后
        if( jsVal.file_total_count >= 0 ){
            this.setState({
                filesTotal: jsVal.file_total_count
            })
        }
    }
    _add_scan_path_t(jsVal) {
        //filesTotal,alwaysPath初始化
        if( !this.state.isScaning ){
            this.setState({
                isScaning: true,
                stStatu: infoMode.VIEW,
                filesTotal: defaultText,
                alwaysPath: defaultText,
                waitFeature: defaultText
            })
        }
    }
    _start_scan_path_t(jsVal) {
        //clearInterval(this.state.timer)//清除获取剩于识图数量定时器
        //启动扫描任务流程
        if( jsVal.scan_path_list && jsVal.scan_path_list.length > 0 ){
            //filesTotal,alwaysPath初始化
            this.setState({
                isScaning: true,
                stStatu: infoMode.VIEW,
                filesTotal: defaultText,
                alwaysPath: defaultText,
                waitFeature: defaultText
            })
        }
    }
    diffTimeFn(nextProps) {
        //天数差
        if( nextProps.getConfig && nextProps.getConfig.data ){
            const last = nextProps.getConfig.data.scan_docs_last_scan_time.value;
            if( !isEmpty(last) ){
                return parseInt(getTimeDiff(new Date(last)))
            }
        }
        return 0
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }
    componentDidUpdate(nextProps, nextState) {
        const showDom = document.getElementById('showFilePath'),
              tempTextDom = document.getElementById('filePathName');
        if( tempTextDom && showDom ){
            const parDom = showDom.parentNode;
            let _w = 0;
            if( parDom ){
               _w = getCss(parDom, 'width');
            }
            //路径太长，中间省略号
            ellipsisStr(tempTextDom.innerText, tempTextDom, (parseInt(_w)-150), 'center')
        }
    }
    componentWillUnmount() {
        //clearInterval(this.state.timer)
    }
}
export default (immutableRenderDecorator(Info))
