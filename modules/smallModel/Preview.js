import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { GET_REGEX_MATCH } from '../../constants/DataConstant'
import { log, isEmpty, dragLineDrop, regexStr, getEncodeURIComponentPath } from '../../constants/UtilConstant'
import { velocityPrveOrNext } from '../../constants/DomConstant'
import { loadingHtml3, NoDataHtml } from '../../constants/RenderHtmlConstant'
import { SELECT_FILE_PREVIEW, NO_PREVIEW, PREVIEW } from '../../constants/TextConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempPage: 1            
        };
        log("Preview");     
    }       
    prevImageBtn(temp, event){
        const fileData = this.props.fmData;
        if( !this.refs.inputPageRef || isEmpty(fileData) || 
            ((isEmpty(fileData.images) || fileData.images.length == 0) && 
            (isEmpty(fileData.path) || fileData.path.length == 0)) ){
            return false;
        }   
        const len = !isEmpty(fileData.images) ? fileData.images.length : !isEmpty(fileData.path) ? fileData.path.length : 0,
              page = parseInt(this.refs.inputPageRef.value);
        if( len == 1 ){
            return false;
        }
        this.state.tempPage = page;
        const li_w = $('.velocity_ul_img').find('li').eq(0).width(),
              index = velocityPrveOrNext('.velocity_ul_img', page, li_w, len, temp);
        if( this.refs.inputPageRef ){
            this.refs.inputPageRef.value = index; //默认值
        }   
    } 
    keyUpPage(event){
        return false;
        const e = event || window.event;
        if( e.keyCode == 8 ){
            return false
        }        
        if( event ){
            const inputDom = event.currentTarget;
            if( inputDom ){
                const regVal = regexStr(inputDom.value, GET_REGEX_MATCH.integer_greater_0)
                if( !regVal ){
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请输入大于等于1的整数",auto: true,speed:1500,statu: 0})
                    inputDom.value = this.state.tempPage
                }else{     
                    const inputVal = parseInt(inputDom.value);
                    if( !isEmpty(inputVal) && this.state.tempPage == inputVal ){
                        return false;
                    }                               
                    let temp = 'left';
                    if( inputVal > this.state.tempPage ){
                        temp = 'right'
                    }
                    this.prevImageBtn(temp)
                }
            }
        }
    }       
    render() {
        const { fmData, active } = this.props;
        return (
            <div className={active ? "detail-item prev-img active" : "detail-item prev-img"}>
                 <a href="javascript:;" className="title flex flex-c">
                    <span className="text">{PREVIEW}</span>
                 </a>
                 <div className="di-main">
                    <div className="previmg-content flex flex-dir-column" 
                        ref="clientHeight1">
                        <div className="con flex-item-gsb-1 flex flex-c" style={{"minHeight":"150"}}>
                            {
                                fmData != null ?
                                    isEmpty(fmData.images) || fmData.images.length == 0 ?
                                        isEmpty(fmData.path) ?
                                            <p className="no-img">{NO_PREVIEW}</p>
                                        :
                                            <ul className="velocity_ul_img flex flex-c flex-self-l">
                                               {
                                                    fmData.path.map((item, index) => {
                                                        const tempItem = {
                                                            thumb_image: {
                                                                path: [item]
                                                            }
                                                        }
                                                        //特殊文件名转码
                                                        const img_src = getEncodeURIComponentPath(tempItem)                                                         
                                                        return <li key={index} className="flex flex-c flex-c-c flex-item-gsb-0">
                                                                <img src={img_src} alt="" />
                                                               </li>     
                                                    })
                                               }
                                            </ul>                                            
                                    :
                                        <ul className="velocity_ul_img flex flex-c flex-self-l">
                                           {
                                            fmData.images.map((item, index) => {
                                              return <li key={index} className="flex flex-c flex-c-c flex-item-gsb-0">
                                                        <img src={"data:image/png;base64,"+ item} alt="" />
                                                     </li>     
                                            })
                                           }
                                        </ul>
                                :
                                    NoDataHtml(SELECT_FILE_PREVIEW)       
                            }
                        </div>
                        {
                            fmData != null ?
                                <p className="db flex-item-gsb-0">
                                    <a className="prev icons-18 icons" onClick={this.prevImageBtn.bind(this, "left")}></a>
                                    <a className="next icons-18 icons" onClick={this.prevImageBtn.bind(this, "right")}></a>
                                    <input type="text" className="page" ref="inputPageRef" defaultValue="0" 
                                        onKeyUp={this.keyUpPage.bind(this)} disabled="true"/>
                                    <span>/</span>
                                    <span>{
                                        !isEmpty(fmData) && !isEmpty(fmData.images) && fmData.images.length > 0 ? 
                                           fmData.images.length 
                                        : 
                                           !isEmpty(fmData) && !isEmpty(fmData.path) && fmData.path.length > 0 ?
                                              fmData.path.length
                                           :
                                              0 
                                        }
                                    </span>
                                </p>
                            :
                                null    
                        }  
                    </div>
                    <a href="javascript:;" className="drag-up-down" ref="dragDivRef2">＝</a>
                 </div>
            </div>   
        )
    }
    componentDidMount() {
        //纵向拖拽
        const dragElem2 = this.refs.dragDivRef2,
              parElem2 = this.refs.clientHeight1;
        if( dragElem2 && parElem2 ){
            dragLineDrop(dragElem2, parElem2, 195, 'bottom')
        } 
        //初始化（一）
        const fd = this.props.fmData;
        if( this.refs.inputPageRef ){
            if( fd ){
                if( fd.images && fd.images.constructor == Array && fd.images.length > 0 ){
                    this.refs.inputPageRef.value = 1; //默认值
                }else{ 
                    if( fd.path && fd.path.constructor == Array && fd.path.length > 0 ){
                        this.refs.inputPageRef.value = 1; //默认值
                    }else{
                        this.refs.inputPageRef.value = 0; //默认值
                    }
                }
            }    
        }        
        if( fd ){
            const $ulElem = $('.velocity_ul_img');
            if( fd.path && fd.path.length > 0 && $ulElem.length > 0 ){
                const par_elem = $('.previmg-content'),
                      ew = par_elem.width(),
                      eh = par_elem.height()-45; 
                $ulElem.css('left', 0);
                $ulElem.find('li').css({'width': ew,'height':eh});
                $ulElem.find('li img').css({'max-width': ew,'max-height':eh});
            }
        }              
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }
    componentDidUpdate(nextProps, nextState){
        //nextProps是前面的数据，this.props是最新的数据
        //初始化（二）
        const fd = this.props.fmData;
        //图片位置输入框
        if( this.refs.inputPageRef ){
            if( fd ){
                if( fd.images && fd.images.constructor == Array && fd.images.length > 0 ){
                    this.refs.inputPageRef.value = 1; //默认值
                }else{ 
                    if( fd.path && fd.path.constructor == Array && fd.path.length > 0 ){
                        this.refs.inputPageRef.value = 1; //默认值
                    }else{
                        this.refs.inputPageRef.value = 0; //默认值
                    }
                }
            }    
        } 
        //图片区域大小调整
        if( fd ){
            const $ulElem = $('.velocity_ul_img');
            if( fd.path && fd.path.length > 0 && $ulElem.length > 0 ){
                const par_elem = $('.previmg-content'),
                      ew = par_elem.width(),
                      eh = par_elem.height()-45; 
                $ulElem.css('left', 0);
                $ulElem.find('li').css({'width': ew,'height':eh});
                $ulElem.find('li img').css({'max-width': ew,'max-height':eh});
            }
        }
    }         
}
export default immutableRenderDecorator(Preview)