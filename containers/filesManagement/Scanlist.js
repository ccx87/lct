import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, getmCustomScrollbar5, getmCustomScrollbar2 } from '../../constants/UtilConstant'
import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { MY_SCAN_FILES_FILTER } from '../../constants/DataConstant'
import { SHOW_DIALOG_CONFIRM, SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

//- 文件类型
const FOLDER_TYPE = {
    SYS: 0,
    DEF: 1,
    LABEL: 2
};

class Scanlist extends Component {
  	constructor(props) {
      	super(props);
        this.state = {};
        this.delScanPathBtn = item => {
            this.props.actions.triggerDialogInfo({
                type: SHOW_DIALOG_CONFIRM,
                title: '提示',
                text: '此操作不会删除素材原文件，预览图将无法被识图。是否确认移除？',
                confirmBtnText: '移除',
                cancelBtnText: '取消',
                confirmFn: this.delScanPath.bind(this, item)
            });
        }
        this.delScanPath = item => {
            //确认移除扫描路径
            this.props.actions.sendHandleMessage('ScanMsgProcess','delScanDir',{del_path: item.vol_folder});
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '正在移除该扫描路径，请稍候...'})
        }
      	log("Scanlist");
  	}
    render() {
        const { filter, onScanFilter, scanPathArray, scaningPathArray, scanUpdatePathArray } = this.props
        return (
            <div className="m-scan-files" style={{"height":"calc(100% - 35px)"}}>
                <div className="sf-top">
                    <div className="m-left">
                        <span className="sp">筛选：</span>
                        <ul>
                            {
                                MY_SCAN_FILES_FILTER.map(item => {
                                    const classes = item.text == filter.text ? "active" : null
                                    return <li key={item.value} className={classes} onClick={() => onScanFilter(item)}>{item.text}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="sf-table default-table-1" style={{"height":"calc(100% - 30px)"}}>
                    <table className="tb-thead">
                        <thead>
                            <tr style={{"background": "rgb(245, 245, 245)"}}>
                                <td className="td-1">素材文件位置</td>
                                <td className="td-2">
                                    素材状态（
                                    <span className="td-2-col-1"><i className="box"></i>可识图</span>
                                    <span className="td-2-col-2"><i className="box"></i>出错</span>
                                    <span className="td-2-col-3"><i className="box"></i>忽略</span>
                                    ）
                                </td>
                                <td className="td-3">操作</td>
                            </tr>
                        </thead>
                    </table>
                    {
                        scanPathArray ?
                            scanPathArray.length > 0 ?
                                <div className="scroll-list" style={{"height":"calc(100% - 31px)"}}>
                                    <table className="tb-tbody">
                                        <tbody>
                                            {
                                                scanPathArray.map((item, index) => {
                                                    let hasing = false,
                                                        okbfb = 0,
                                                        ngbfb = 0,
                                                        is_exist = true,
                                                        is_online = true,
                                                        is_update = false,
                                                        tr_classes = 'scaned';
                                                    if( item.sum_cnt > 0 ){
                                                        okbfb = parseFloat((item.ok_cnt/item.sum_cnt)*100).toFixed(2);
                                                        ngbfb = parseFloat((item.ng_cnt/item.sum_cnt)*100).toFixed(2);
                                                    }
                                                    if( !item.is_folder_exist ) {
                                                        is_exist = false;
                                                    }
                                                    if( item.vol_type >= 2 && !item.vol_is_online ){
                                                        is_online = false;
                                                    }
                                                    //arr.includes(elem)
                                                    if( scaningPathArray && scaningPathArray.some(elem => item.vol_folder && elem == item.vol_folder.toLowerCase()) ){
                                                        if( item.wait_scan ){
                                                            item.wait_scan = false;
                                                        }
                                                        hasing = true;
                                                    }
                                                    if( scanUpdatePathArray && scanUpdatePathArray.some(elem => item.vol_folder && elem == item.vol_folder.toLowerCase()) ){
                                                        is_update = true;
                                                    }
                                                    if( is_online ){
                                                        if( hasing ){
                                                            tr_classes = 'scaning'
                                                        }
                                                    }else{
                                                        tr_classes = 'offline'
                                                    }
                                                    if( !is_exist ){
                                                        tr_classes = 'unexist'
                                                    }
                                                    return  <tr className={tr_classes} key={index}>
                                                                <td className="td-1">
                                                                    {
                                                                        item.folder_type == FOLDER_TYPE.SYS ?
                                                                            <i className="icons-20 icons-local-material lm-plate5-bg" onClick={() => this.props.actions.openFileRequest(2, item.folder)}></i>
                                                                        :
                                                                        item.folder_type == FOLDER_TYPE.LABEL ?
                                                                            <i className="icons-20 icons-files label-folder-bg" onClick={() => this.props.actions.openFileRequest(2, item.folder)}></i>
                                                                        :
                                                                            <i className="icons-20 icons-local-material sb-file-bg" onClick={() => this.props.actions.openFileRequest(2, item.folder)}></i>
                                                                    }
                                                                    {
                                                                        !is_online ?
                                                                            <span className="td-1-sp">[<span className="col-lan"><i className="icons-20 icons-local-material no-online-bg"></i>设备离线</span>] {item.folder}</span>
                                                                        :
                                                                        !is_exist ?
                                                                            <span className="td-1-sp">[<span className="col-lan"><i className=""></i>文件不存在</span>] {item.folder}</span>
                                                                        :
                                                                            <span className="td-1-sp">{item.folder_type == FOLDER_TYPE.LABEL ? '自动标签文件夹' : item.folder}</span>
                                                                    }

                                                                    {
                                                                        item.folder_type == FOLDER_TYPE.LABEL ?
                                                                        <div className="rel">
                                                                            <i className="icons icons-20 help-question"></i>
                                                                            <div className="abs layer-alert-msg">
                                                                                <span className="top-arrow">
                                                                                    <i className="top-arrow1"></i>
                                                                                    <i className="top-arrow2"></i>
                                                                                </span>
                                                                                <p>自动标签文件夹，链图云将自动为此目录下的素材文件打标签，便于关键字搜索</p>
                                                                            </div>
                                                                        </div>

                                                                        :
                                                                        null
                                                                    }

                                                                </td>
                                                                {
                                                                    hasing ?
                                                                        <td className="td-2">
                                                                            <i className="loading-bg2"></i>
                                                                            <span className="col-6">扫描中...</span>
                                                                        </td>
                                                                    :
                                                                    is_update ?
                                                                        <td className="td-2">
                                                                            <i className="loading-bg2"></i>
                                                                            <span className="col-6">扫描中...</span>
                                                                        </td>
                                                                    :
                                                                        item.wait_scan ?
                                                                            <td className="td-2 td2-wait">
                                                                                <i className="icons-20 icons-local-material lock-wait-bg"></i>
                                                                                <span className="col-6">等待扫描</span>
                                                                            </td>
                                                                        :
                                                                        item.is_init ?
                                                                            <td className={!is_online || !is_exist ? "td-2 opt6" : "td-2"}>
                                                                                <div className={item.sum_cnt > 0 ? "td-2-p" : "td-2-p bor-1"}>
                                                                                    <span className="col-9">初始化中...</span>
                                                                                </div>
                                                                            </td>
                                                                        :
                                                                            <td className={!is_online || !is_exist ? "td-2 opt6" : "td-2"}>
                                                                                <div className={item.sum_cnt > 0 ? "td-2-p" : "td-2-p bor-1"}>
                                                                                    {
                                                                                        item.sum_cnt == 0 ?
                                                                                            <span className="col-6">未扫描到任何素材</span>
                                                                                        :
                                                                                            null
                                                                                    }
                                                                                    {
                                                                                        item.ok_cnt > 0 ?
                                                                                            <span className="td-2-sp1" style={{"width": okbfb+"%"}}></span>
                                                                                        :
                                                                                            null
                                                                                    }
                                                                                    {
                                                                                        item.ng_cnt > 0 ?
                                                                                            <span className="td-2-sp2" style={{"width": ngbfb+"%", "marginLeft": okbfb+"%"}}></span>
                                                                                        :
                                                                                             null
                                                                                    }
                                                                                    <div className="hide-msg">
                                                                                        <p className="hm-sum flex">
                                                                                            <span className="hm-text flex-item-gsb-0">素材总数</span>
                                                                                            <span className="hm-num">{item.sum_cnt}</span>
                                                                                        </p>
                                                                                        <p className="hm-ok flex">
                                                                                            <span className="hm-text flex-item-gsb-0">可识图素材</span>
                                                                                            <span className="hm-num">{item.ok_cnt}</span>
                                                                                        </p>
                                                                                        <p className="hm-ng flex">
                                                                                            <span className="hm-text flex-item-gsb-0">出错的素材</span>
                                                                                            <span className="hm-num">{item.ng_cnt}</span>
                                                                                        </p>
                                                                                        <p className="hm-skip flex">
                                                                                            <span className="hm-text flex-item-gsb-0">忽略的素材</span>
                                                                                            <span className="hm-num">{item.skip_cnt}</span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                }
                                                                <td className="td-3">
                                                                    {
                                                                        !hasing && !is_update ?
                                                                            item.folder_type == FOLDER_TYPE.LABEL ?
                                                                                <button className="del-btn default-button" onClick={() => this.props.actions.openFileRequest(2, item.folder)}>打开</button>
                                                                            :
                                                                                <button className="del-btn default-button" onClick={this.delScanPathBtn.bind(this, item)}>移除</button>
                                                                        :
                                                                            null
                                                                    }
                                                                </td>
                                                            </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            :
                                <div className="default-div" style={{"height":"calc(100% - 26px)"}}>
                                    <div className="no-data">
                                        <img src="compress/img/data-default.png"/>
                                        <p>您未添加任何素材文件夹</p>
                                    </div>
                                </div>
                        :
                            <div className="default-div" style={{"height":"calc(100% - 26px)"}}>
                                {loadingHtml3()}
                            </div>

                    }
                </div>
            </div>
        )
    }
    initMcScroll() {
        const scrollDom = document.querySelector('.m-scan-files .scroll-list');
        if( scrollDom ){
            if( scrollDom.classList.contains('mCustomScrollbar') ){
                getmCustomScrollbar2($('.m-scan-files .scroll-list'), 'update')
            }else{
                getmCustomScrollbar5($('.m-scan-files .scroll-list'))
            }
        }
    }
    componentDidMount() {
        this.initMcScroll()
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }
    componentDidUpdate(nextProps, nextState) {
        if( this.props.scanAt !== nextProps.scanAt ){
            this.initMcScroll()
        }
    }
}
export default (immutableRenderDecorator(Scanlist))
