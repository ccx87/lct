import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, getmCustomScrollbar2 } from '../../constants/UtilConstant'
import { FILES_MANAGEMENT_MAIN_TAB, MY_SCAN_FILES_FILTER, MY_SCAN_MSG_FILTER, MOBILE_DRIVE_STATU } from '../../constants/DataConstant'
import { SHOW_DIALOG_CONFIRM, DO_NOT_LOGIN, SHOW_DIALOG_ALERT, SHOW_MY_SCAN_FILES,
         SHOW_DISK_SUMMARY, SHOW_TYPE_SUMMARY, SHOW_SELECT_FOLDERS } from '../../constants/TodoFilters'

import Switch from '../../modules/Switch'
import Scanlist from './Scanlist'
import Disklist from './Disklist'
import Msglist from './Msglist'

//- 文件类型
const FOLDER_TYPE = {
    SYS: 0,
    DEF: 1,
    LABEL: 2
};
class Content extends Component {
  	constructor(props) {
      	super(props);
        this.state = {
            tab: SHOW_MY_SCAN_FILES,
            scanFilter: MY_SCAN_FILES_FILTER[0],
            msgFilter: MY_SCAN_MSG_FILTER[0],
            scaningPathArray: null,
            scanListArray: null,
            scanPathArray: null,
            scanUpdatePathArray: null,
            scanAt: null,
            diskListArray: null,
            diskLocalArray: null,
            diskMobileArray: null,
            diskOfflineArray: null,
            diskAt: null,
            msgPost: { //扫描报告请求初始化数据
                key:'',
                page_num: 0,
                per_page_size: 15,
                filter: MY_SCAN_MSG_FILTER[0].filter,
                type: 0,
                dir: '',
                is_fresh: true,
                completeAt: true,
                _scllorFn: () => {
                    this.state.msgPost.is_fresh = false;
                    this.state.msgPost.page_num = this.state.msgPost.page_num + 1
                    this.getInitMsgData(this.state.msgPost)
                }
            },
            msgListArray: null,
            msgAt: null
        };
        this.tabPostData = tab => {
            //第一次请求扫描报告列表
            //修改-每次切换都请求!this.state.msgListArray !this.state.diskListArray 8月30
            if( tab === SHOW_TYPE_SUMMARY ){
                setTimeout(() => {this.getInitMsgData()},10)
            }else if( tab === SHOW_DISK_SUMMARY ) {
                setTimeout(() => {
                    this.getInitDiskData()
                },10)
            }
        }
        this.handleShow = tab => {
            //tab切换栏
            this.tabPostData(tab)
            this.setState({ tab })
        }
        this.scanFilterNewData = (arr, filter) => {
            //筛选
            if( !arr ) return [];
            if( filter.value == -1 ) return arr;
            // vol_type < 2的为本地磁盘，其余为移动设备.
            return arr.filter((item) => {
                const type = item.vol_type >= 2 ? 2 : item.vol_type;
                return type === filter.value
            })
        }
        this.dataSort = arr => {
            //标签文件type刚好是2，其余的是0，1。如果有变动，请修改对应的地方。  
            return arr.sort(function(a, b){return b.folder_type - a.folder_type})
        }
        this.mcScrollDestroy = (elem) => {
            const scrollDom = elem && elem.querySelector('.scroll-list');
            if( scrollDom ){
                if( scrollDom.classList.contains('mCustomScrollbar') ){
                    console.log(elem.getAttribute("class")+'删除滚动条')
                    getmCustomScrollbar2($(elem).find('.scroll-list'), 'destroy')
                }
            }
        }
        this.onScanFilter = scanFilter => {
            //先清除滚动条
            this.mcScrollDestroy(document.querySelector('.m-scan-files'))
            //扫描文件夹过滤
            this.setState({
                scanAt: Date.now(),
                scanFilter,
                scanPathArray: this.dataSort(this.scanFilterNewData(this.state.scanListArray, scanFilter))
            })
        }
        this.onMsgFilter = msgFilter => {
            if( msgFilter.filter == this.state.msgFilter.filter ){
                return
            }
            //先清除滚动条
            this.mcScrollDestroy(document.querySelector('.m-type-summary'))
            //扫描报告列表过滤
            const data = {
                key: this.state.msgPost.key,
                page_num: 0,
                per_page_size: this.state.msgPost.per_page_size,
                filter: msgFilter.filter,
                type: this.state.msgPost.type,
                dir: this.state.msgPost.dir,
                is_fresh: true,
                completeAt: true,
                _scllorFn: () => {
                    this.state.msgPost.is_fresh = false;
                    this.state.msgPost.page_num = this.state.msgPost.page_num + 1;
                    this.getInitMsgData(this.state.msgPost);
                }
            }
            this.setState({
                msgFilter,
                msgPost: data,
                msgListArray: null
            })
            this.getInitMsgData(data)
        }
        this.onSearchMsg = text => {
            //先清除滚动条
            this.mcScrollDestroy(document.querySelector('.m-type-summary'))
            //扫描报告搜索
            const data = {
                key: text,
                page_num: 0,
                per_page_size: this.state.msgPost.per_page_size,
                filter: this.state.msgPost.filter,
                type: this.state.msgPost.type,
                dir: this.state.msgPost.dir,
                is_fresh: true,
                completeAt: true,
                _scllorFn: () => {
                    this.state.msgPost.is_fresh = false;
                    this.state.msgPost.page_num = this.state.msgPost.page_num + 1
                    this.getInitMsgData(this.state.msgPost)
                }
            }
            this.setState({
                msgFilter: this.state.msgFilter,
                msgPost: data,
                msgListArray: null
            })
            this.getInitMsgData(data)
        }
      	log("Content");
  	}
    render() {
        const { tab, scanFilter, msgFilter, scanPathArray, scaningPathArray, scanUpdatePathArray, diskListArray,
            diskLocalArray, diskMobileArray, diskOfflineArray, msgPost, msgListArray, scanAt, msgAt, diskAt } = this.state
        return (
        <div className="fm-main" style={{"height":"100%"}}>
            <div className="m-content" style={{"height":"100%"}}>
                <div className="tab-top" style={{"position": "relative"}}>
                    <Switch options={FILES_MANAGEMENT_MAIN_TAB} filter={tab} onShow={this.handleShow} />
                    {/*<div className="m-right" style={{"position": "absolute","top": "5px","right": "10px"}}>*/}
                    <div className="m-right">
                        <button className="add-btn default-button" onClick={() => this.props.actions.triggerDialogInfo({type: SHOW_SELECT_FOLDERS})}>添加文件夹</button>
                    </div>
                </div>
                {
                    tab === SHOW_MY_SCAN_FILES ?
                        <Scanlist
                            scanAt={scanAt}
                            actions={this.props.actions}
                            filter={scanFilter}
                            scanUpdatePathArray={scanUpdatePathArray}
                            scanPathArray={scanPathArray}
                            scaningPathArray={scaningPathArray}
                            onScanFilter={this.onScanFilter}/>
                    :
                    tab === SHOW_DISK_SUMMARY ?
                        <Disklist
                            diskAt={diskAt}
                            diskListArray={diskListArray}
                            diskLocalArray={diskLocalArray}
                            diskMobileArray={diskMobileArray}
                            diskOfflineArray={diskOfflineArray}/>
                    :
                    tab === SHOW_TYPE_SUMMARY ?
                        <Msglist
                            msgAt={msgAt}
                            filter={msgFilter}
                            msgPost={msgPost}
                            actions={this.props.actions}
                            msgListArray={msgListArray}
                            onMsgFilter={this.onMsgFilter}
                            onSearchMsg={this.onSearchMsg}/>
                    :
                        null
                }
            </div>
        </div>
        )
    }
    getInitAllVolData() {
        //扫描状态百分比水球的信息
        this.props.actions.sendHandleMessage('ScanMsgProcess', 'getAllVolSumamry', {cmd: 5})
    }
    getInitMsgData(data) {
        //扫描报告列表
        if( !data && !this.state.msgPost.is_fresh ) {
            this.state.msgPost.page_num = 0;
            this.state.msgPost.is_fresh = true;
        }
        this.props.actions.sendHandleMessage('ScanMsgProcess','getErrorFileList', data ? data : this.state.msgPost);
    }
    getInitDiskData() {
        //盘符列表
        this.props.actions.sendHandleMessage('ScanMsgProcess','getVolumeDetail','');
    }
    getInitScanData(data) {
        data = data || '';
        //扫描路径列表的信息
        this.props.actions.sendHandleMessage('ScanMsgProcess','getScanFolderDetail', data);
    }
    showAlert(text) {
        this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: text, auto: true,speed: 3000})
    }
    componentDidMount() {
        //setTimeout(() => {
        //    this.getInitScanData()
        //},5)
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            //初始化扫描列表第一次状态
            if( !this.state.scaningPathArray && !this.state.scanListArray ){
                try{
                    const pathObj = nextProps.getConfig.data && nextProps.getConfig.data.scan_docs_always_path,
                          arr = (pathObj && !isEmpty(pathObj.value) && JSON.parse(pathObj.value)) || [];

                    if( arr && arr.length > 0 ){
                        const initArray = arr.map((item) => {
                            if( !item ) return {};
                            if( item.path && item.path.length < 3 ){
                                item.folder_type = 0;
                            }
                            const data = {
                                folder: item.path,
                                folder_type: item.folder_type,
                                is_folder_exist: true,
                                ng_cnt: 0,
                                ok_cnt: 0,
                                skip_cnt: 0,
                                sum_cnt: 0,
                                vol_folder: item.vol_folder,
                                vol_is_online: true,
                                vol_type: 1,
                                is_init: true
                            }
                            return data
                        })
                        log("初始化扫描列表第一次状态：")
                        log(arr)
                        log(initArray)
                        if( initArray.length > 0 ){
                            this.setState({
                                scanAt: Date.now(),
                                scanUpdatePathArray: null,
                                scanListArray: initArray,
                                scanPathArray: this.dataSort(this.scanFilterNewData(initArray, this.state.scanFilter))
                            })
                        }
                    }
                }catch(e){
                    log('初始化扫描列表第一次状态解析错误')
                }
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
            if( jsData.error_code !== 0 && jsModule !== 'connect_msg_t' && jsModule !== 'add_scan_path_t' && jsModule !== 'scan_del_path_rsp_t' ){
                log(jsData.error +',(代码：'+ jsData.error_code +')')
                return;
            }
            const jsVal = jsData.data;
            if( isEmpty(jsVal) && jsModule !== 'connect_msg_t' && jsModule !== 'add_scan_path_t' && jsModule !== 'scan_del_path_rsp_t' ){
                log('---返回数据data字段为空---');
                return;
            }
            switch( jsModule ){
                case 'connect_msg_t':
                    if( jsData.error_code == 2501 ){
                        //2501本地服务器挂了
                        const err = isEmpty(jsData.error) ? '本地服务器遇到致命错误（代码：'+ jsData.error_code +'）' : jsData.error;
                        this.showAlert(err)
                        return;
                    }
                    if( jsData.error_code == 0 && jsVal.server == 0 ){
                        //重启后
                        //目前有问题，页面静止状态下会出现跳转
                        if( this.state.scaningPathArray ){
                            //如果在扫描时出现2501错误则停止扫描
                            this.props.actions.sendHandleMessage('ScanMsgProcess','stopScan','');
                        }
                        //如果文件列表和盘符列表没有数据则重新请求一次。
                        if( !this.state.scanListArray ){
                            this.getInitScanData()
                        }
                    }
                break;
                case 'doc_select_folder_t':
                    //跳转到素材管理这，并打开选择文件夹
                    this.props.actions.triggerDialogInfo({type: SHOW_SELECT_FOLDERS})
                break;
                case 'scan_finish_result_summary_msg_t':
                    //获取扫描路径列表
                    this._scan_finish_result_summary_msg_t(jsVal);
                break;
                case 'scan_del_path_rsp_t':
                    //确认移除扫描路径
                    //要判断移除成功已否传jsData
                    this._scan_del_path_rsp_t(jsData);
                break;
                case 'add_scan_path_t':
                    //添加扫描路径后返回的数据
                    //要判断正确已否传jsData
                    this._add_scan_path_t(jsData);
                break;
                case 'start_scan_path_t':
                    //正在扫描的路径
                    this._start_scan_path_t(jsVal);
                break;
                case 'scan_progress_t':
                    //预览图生成进度
                    this._scan_progress_t(jsVal);
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
                    //总识图信息获取完成
                    //扫描流程结束
                    this._get_feature_all_finish_t(jsVal);
                break;
                case 'scan_vol_cnt_msg_t':
                    //获取扫描盘符列表
                    this._scan_vol_cnt_msg_t(jsVal);
                break;
                case 'search_file_by_txt_rsp_t':
                    //获取扫描报告列表
                    this._search_file_by_txt_rsp_t(jsVal);
                break;
                case 'stop_getting_t':
                    //前端控制点击停止获取识图信息
                    this._stop_getting_t(jsVal);
                break;
                case 'setting_regain_t':
                    //收到其它页面设置的消息，当前页面重新调用配置信息接口
                    this.props.actions.getConfigInfo()
                break;
                case 'merge_scan_path_t':
                    //合并文件夹后，返回数据==删除相应路径列表
                    this._merge_scan_path_t(jsVal)
                break;
                case 'device_change_msg':
                    //移动设备添加与移除
                    this._device_change_msg(jsVal);
                break;
                case 'scan_finish_result_summary_req_t':
                    //如识图信息还能回来，一分钟会调用一次
                    this._scan_finish_result_summary_req_t(jsVal);
                break;
                case 'NetNeighborListResult':
                    //获取邻居个数
                    this._NetNeighborListResult(jsVal);
                break;
                default:
                    return false;
                break;
            }
        }
    }
    _scan_finish_result_summary_req_t(jsVal) {
        //如识图信息还能回来，一分钟会调用一次
        switch(jsVal.summary_type){
            case 0:
                this.getInitAllVolData()
            break;
            case 1:
                this.getInitDiskData()
            break;
            case 2:
                this.getInitScanData()
            break;
        }
    }
    _device_change_msg(jsVal) {
        //移动设备添加与移除
        //先清除滚动条
        this.mcScrollDestroy(document.querySelector('.m-disk-summary'))
        let dlText;
        if( jsVal.status == MOBILE_DRIVE_STATU.insert ){
            dlText = '移动设备（'+ jsVal.drive_lable +'）已插入';
        }else{
            dlText = '您的移动设备（'+ jsVal.drive_lable +'）被拔出，如需扫描请重新插入';
        }
        if( this.state.scanListArray && this.state.scanListArray.length > 0 ){
            //查找列表中是否存在该路径下的文件夹
            const newData = this.state.scanListArray.map((item) => {
                const subPath = item.vol_folder.split('\\')[0];
                log("列表截取的盘符名称："+ subPath +"，移动设备的名称："+ jsVal.vol_folder)
                if( subPath.toLowerCase() == jsVal.vol_folder.toLowerCase() ){
                    if( jsVal.status == MOBILE_DRIVE_STATU.insert ){
                        item.vol_is_online = true;
                        const segArray = item.folder.split('\\'),
                              first = segArray[0].toLowerCase();
                        if( first !== jsVal.drive_lable.toLowerCase() ){
                            segArray[0] = jsVal.drive_lable;
                            item.folder = segArray.join('\\');
                        }
                        if( this.state.scaningPathArray ){
                            item['wait_scan'] = true;
                        }
                    }else{
                        item.vol_is_online = false;
                    }
                }
                return item
            })
            this.setState({
                scanAt: Date.now(),
                scanListArray: newData,
                scanPathArray: this.dataSort(this.scanFilterNewData(newData, this.state.scanFilter))
            })
        }
        this.showAlert(dlText)
        setTimeout(() => {
            this.getInitDiskData()
        },10)
    }
    _stop_getting_t(jsVal) {
        //前端控制点击停止获取
        this.getInitScanData()
        //setTimeout(() => {this.getInitDiskData()},5)
        //setTimeout(() => {this.getInitMsgData()},15)
        this.setState({
            scaningPathArray: null
        })
    }
    _scan_stop_completed_t(jsVal) {
        //停止扫描
        if( jsVal.stop_completed ){
            this.getInitScanData()
            //setTimeout(() => {this.getInitDiskData()},10)
            //setTimeout(() => {this.getInitMsgData()},20)
            this.setState({
                scaningPathArray: null
            })
        }
    }
    _merge_scan_path_t(jsVal) {
        //合并文件夹后，返回数据==删除相应路径列表
        if( this.state.scanListArray && this.state.scanListArray.length > 0 ){
            if( jsVal.length == 0 ) return;
            const newArray = this.state.scanListArray.filter((item) => {
                return !(jsVal.some(elem => elem && item.vol_folder && elem.toLowerCase() == item.vol_folder.toLowerCase()))
            })
            this.setState({
                scanAt: Date.now(),
                scanListArray: newArray,
                scanPathArray: this.dataSort(this.scanFilterNewData(newArray, this.state.scanFilter))
            })
        }
    }
    _scan_del_path_rsp_t(jsData) {
        //确认移除扫描路径
        if( jsData.data && jsData.data.del_rsp && jsData.data.del_rsp.length > 0 ){
            //setTimeout(() => {this.getInitDiskData()},5)
            //setTimeout(() => {this.getInitMsgData()},15)
            if( this.state.scanListArray && this.state.scanListArray.length > 0 ){
                //先清除滚动条
                this.mcScrollDestroy(document.querySelector('.m-scan-files'))
                //[del_path可以直接判断本地路径]，vol_folder用来判断移动设备也可以判断本地路径
                const unDelArray = [];
                let atext;
                const newArray = this.state.scanListArray.filter((item) => {
                        return !(jsData.data.del_rsp.some((elem) => {
                            if( elem.result && item.vol_folder && elem.del_path ){
                                return item.vol_folder.toLowerCase() == elem.del_path.toLowerCase();
                            }
                            unDelArray.push(elem.del_path)
                            return false
                        }))
                })

                if( unDelArray.length > 0 ){
                    if( unDelArray.length == jsData.data.del_rsp.length ){
                        atext = '移除扫描路径失败';
                    }else{
                        atext = '移除扫描路径成功，其中有'+unDelArray.length+'条扫描路径移除失败';
                    }
                }else{
                    atext = '移除扫描路径成功'
                }
                this.showAlert(atext)
                this.setState({
                    scanAt: Date.now(),
                    scanListArray: newArray,
                    scanPathArray: this.dataSort(this.scanFilterNewData(newArray, this.state.scanFilter))
                })
                //重新获取一下配置信息里的扫描路径--更新
                const data = [{key:"scan_docs_always_path"}]
                this.props.actions.getConfigInfo(data);
            }
        }else{
            const err = isEmpty(jsData.error) ? '移除扫描路径失败(代码：'+ jsData.error_code +')' : jsData.error;
            this.showAlert(err)
        }
    }
    _get_feature_all_finish_t(jsVal) {
        //总识图信息获取完成
        //扫描流程结束
        if( jsVal.complete ){
            this.setState({
                scaningPathArray: null
            })
            //setTimeout(() => {this.getInitDiskData()},5)
            //setTimeout(() => {this.getInitMsgData()},15)
        }
    }
    _get_feature_progress_t(jsVal) {
        //识图信息进度
        this.getInitScanData({scan_path: jsVal.progress_folder})
        //setTimeout(() => {this.getInitDiskData()},5)
        //setTimeout(() => {this.getInitMsgData()},15)
    }
    _scan_progress_t(jsVal) {
        //预览图生成进度
        if( jsVal.total_progress >= 100 ){
            this.setState({
               scanUpdatePathArray: jsVal.progress_folder.map(item => item && item.toLowerCase())
            })
            this.getInitScanData({scan_path: jsVal.progress_folder})
        }
    }
    _start_scan_path_t(jsVal) {
        //获取当前正在扫描的文件夹
        if( jsVal.scan_path_list && jsVal.scan_path_list.length > 0 ){
            this.setState({
                scaningPathArray: jsVal.scan_path_list.map(item => item.path && item.path.toLowerCase())
            })
        }
    }
    _add_scan_path_t(jsData) {
        //添加扫描路径后返回的数据
        if( jsData.error_code == 0 ){
            let newArray = [];
            if( jsData.data ){
                if( jsData.data === 'All' ){
                    if( this.state.scanListArray ){
                        newArray = this.state.scanListArray.map((item) => {
                            if( item.vol_is_online ){
                                item['wait_scan'] = true
                            }
                            return item
                        })
                    }
                }else{
                    if( Array.isArray(jsData.data) && jsData.data.length > 0 ){
                        newArray = jsData.data.map((item) => {
                            item['wait_scan'] = true
                            return item
                        })
                    }
                }
            }
            if( newArray && newArray.length > 0 ){
                if( jsData.data === 'All' ){
                    this.state.scanListArray = newArray
                }else{
                    if( this.state.scanListArray && this.state.scanListArray.length > 0 ){
                        this.state.scanListArray.unshift(...newArray)
                    }else{
                        this.state.scanListArray = newArray
                    }
                }
                this.setState({
                    scanAt: Date.now(),
                    tab: SHOW_MY_SCAN_FILES,
                    scanListArray: this.state.scanListArray,
                    scanPathArray: this.dataSort(this.scanFilterNewData(this.state.scanListArray, this.state.scanFilter))
                })
            }
        }else{
            let err = !isEmpty(jsData.error) ? jsData.error : '添加扫描路径失败(代码：'+ jsData.error_code +')'
            this.showAlert(err)
        }
    }
    _scan_finish_result_summary_msg_t(jsVal) {
        //扫描路径列表
        //先清除滚动条
        this.mcScrollDestroy(document.querySelector('.m-scan-files'))
        if( this.state.scanListArray && this.state.scanListArray.length > 0 ){
            const resultData = jsVal.scan_summary_result;
            if( resultData && resultData.length > 0 ){
                for( let i = 0, len = resultData.length; i < len; i++ ){
                    for( let j = 0, lens = this.state.scanListArray.length; j < lens; j++ ){
                        if( resultData[i].vol_folder && this.state.scanListArray[j].vol_folder &&
                            resultData[i].vol_folder.toLowerCase() === this.state.scanListArray[j].vol_folder.toLowerCase() ){
                            if( this.state.scanListArray[j].wait_scan && this.state.scanListArray[j].is_init ){
                                resultData[i]['wait_scan'] = true
                                this.state.scanListArray[j].is_init = false
                            }
                            this.state.scanListArray[j] = resultData[i];
                            break;
                        }
                    }
                }
            }
            this.setState({
                scanAt: Date.now(),
                scanUpdatePathArray: null,
                scanListArray: this.state.scanListArray,
                scanPathArray: this.dataSort(this.scanFilterNewData(this.state.scanListArray, this.state.scanFilter))
            })
        }else{
            this.setState({
                scanAt: Date.now(),
                scanUpdatePathArray: null,
                scanListArray: jsVal.scan_summary_result,
                scanPathArray: this.dataSort(this.scanFilterNewData(jsVal.scan_summary_result, this.state.scanFilter))
            })
        }
    }
    _search_file_by_txt_rsp_t(jsVal) {
        const list = jsVal.files || [];
        this.state.msgPost.completeAt = true;
        if( list.length == 0 || jsVal.total_size <= (jsVal.per_page_size*(jsVal.page_num+1)) ){
            //回来没数据了就不再请求数据了
            this.state.msgPost.completeAt = false;
        }
        let filterArray = []
        if( list.length > 0 ){
            if( this.state.msgPost.page_num == 0 || jsVal.page_num == 0 ){
                this.state.msgListArray = null
            }
            filterArray = list
            MY_SCAN_MSG_FILTER[0].value = jsVal.total_size >= 0 ? jsVal.total_size : 0
            //MY_SCAN_MSG_FILTER[1].value = jsVal.error_size >= 0 ? jsVal.error_size : 0
            //MY_SCAN_MSG_FILTER[2].value = jsVal.skip_size >= 0 ? jsVal.skip_size : 0
        }
        if( this.state.msgListArray ){
            this.state.msgListArray.push(...filterArray)
        }else{
            this.state.msgListArray = filterArray
        }
        this.setState({
            msgAt: Date.now(),
            msgListArray: this.state.msgListArray
        })
    }
    diskFilter(arr, type, online) {
        return arr.filter( item => {
            let newtype = item.vol_type;
            if( newtype >= 2 ){
                newtype = 2
            }
            if( online == null ){
                return newtype == type
            }
            return newtype == type && item.vol_is_online == online
        })
    }
    _scan_vol_cnt_msg_t(jsVal) {
        //盘符列表
        if( jsVal.vol_cnts ){
            this.setState({
                diskAt: Date.now(),
                diskListArray: jsVal.vol_cnts,
                diskLocalArray: this.diskFilter(jsVal.vol_cnts, 1),
                diskMobileArray: this.diskFilter(jsVal.vol_cnts, 2, true),
                diskOfflineArray: this.diskFilter(jsVal.vol_cnts, 2, false)
            })
            //右上角tip栏显示有几个移动设备被扫描过且列表存在目录
            const arr = (this.diskFilter(jsVal.vol_cnts, 2) || []).filter(item => item.is_scaned ),
                  lens = arr.length;
            if( document.getElementById('tipMobileDisk') ){
                document.getElementById('tipMobileDisk').innerText = lens
            }
        }
    }
    _NetNeighborListResult(jsVal) {
        const ngDom = document.getElementById('tipNeighbor');
        if( ngDom ){
            ngDom.innerText = (jsVal && jsVal.neighbors && jsVal.neighbors.length) || 0
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }
}
export default (immutableRenderDecorator(Content))
