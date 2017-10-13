import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty, hasClass, removeClass, toggleClass, getmCustomScrollbar, addClass } from '../../constants/UtilConstant'
import { showOrHideItem, clientHeight, absVerticalCenter2 } from '../../constants/DomConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'
import { SCAN_FILE_TYPE } from '../../constants/DataConstant'
import { msgAlertSuccessHtml,msgConfirmHtml } from '../../constants/RenderHtmlConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

class ParamenterSettings extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            setting:{
               show: false,
               text: ''
            },
            confirm: {
                show: false,
                data: null
            },            
            isoper: false
        };
      	log("ParamenterSettings");		
  	}	
    isallchecked() {
        const $a_Elem = $('.paramenter-settings .div-line').find('.item-a');
        if( $a_Elem.length > 0 ){
            let hasall = true
            $a_Elem.each((inedexA, elemA) => {
                if( !$(elemA).hasClass('active') ){
                    hasall = false 
                }
            }) 
            if( hasall ) {
                $('.paramenter-settings .fn-check').addClass('checked')
            } else {
                $('.paramenter-settings .fn-check').removeClass('checked')
            }
        }      
    }
    changeFileType(event) {
        event.stopPropagation();
        event.preventDefault();
        toggleClass(event.currentTarget, 'active')
        this.isallchecked()
        this.setState({isoper: true})        
    } 
    changeAll(event){
        event.stopPropagation();
        event.preventDefault();
        const checkDom = event.currentTarget.querySelector('.fn-check')
        toggleClass(checkDom,'checked') 
        const $a_Elem = $('.paramenter-settings .div-line').find('.item-a');
        if( hasClass(checkDom, 'checked') ){
            $a_Elem.each((inedexA, elemA) => {
                $(elemA).addClass('active')
            }) 
        }else{
            $a_Elem.each((inedexA, elemA) => {
                $(elemA).removeClass('active')
            })           
        }
        this.setState({isoper: true})
    }
    setParamenterFilter(event){
         const $a_Elem = $('.paramenter-settings .div-line').find('.item-a'),
               filterArray = [];
         $a_Elem.each((inedexA, elemA) => {
              if( $(elemA).hasClass('active') ){
                  const text = $(elemA).text().toLowerCase();
                  filterArray.push(text)
              }
         })
         if( filterArray.length > 0 ){
             setTimeout(() => {
                this.props.actionsLF.setScanDocsFilterRequest(filterArray)
             },1000)
             this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "设置更新中...",auto: false})                                                  
         }else{
             this.setState({
                  setting: {
                     show: true,
                     text: '请至少选择一个扫描文件格式'
                  }
             })
             setTimeout(() => {
                 this.setState({
                      setting: {
                         show: false,
                         text: ''
                      }
                 })
             }, 1500)             
         }
    }  
    closeSet(event) {
        if( this.state.isoper ){
            this.setState({
                confirm: {
                    show: true,
                    data: {
                        title: '扫描设置',
                        text: '扫描设置有修改，要保存修改吗？',
                        onClose: this.onClose.bind(this),
                        onConfirm: this.setParamenterFilter.bind(this)
                    }
                }
            })            
        }else{
            this.props.actions.triggerDialogInfo(null)
        }
    } 
    onClose() {
        this.props.actions.triggerDialogInfo(null)
    }        		
    render() {
        const { actions, getConfig } = this.props
        const { setting, confirm } = this.state

        let scanFilterArray = [];
        if( getConfig && getConfig.data ){
            try{
                const filterObj = getConfig.data.scan_docs_type_filter;
                scanFilterArray = filterObj.value.split(';');              
            }catch(e){}
        }        
        return (
            <div className="paramenter-settings">
                <div className="ps-content flex">
                    <div className="ps-item">
                       <p className="col-3 item-title">扫描文件的格式：<span className="col-9">（单击下方色块选中或取消，已选中的文件格式才可以扫描）</span></p>
                       <div className="item-content col-6 scllorBar_paramenterSet" ref="clientHeight">
                            {
                                SCAN_FILE_TYPE.map((item, index) => {
                                     return <div key={index} className="div-line flex-item-gsb-0 flex flex-l">
                                                <div className="line-l flex flex-c flex-item-gsb-0">
                                                   {item.text}
                                                </div>
                                                <div className="line-r flex flex-wrap">
                                                   {
                                                        item.data.map((item2, index2) => {
                                                           const hasIndex = scanFilterArray.indexOf(item2.toLowerCase());
                                                           if( hasIndex > -1 ){
                                                               return <a key={index2} className="item-a flex flex-c flex-c-c active" onClick={this.changeFileType.bind(this)}>{item2}</a>
                                                           }else{
                                                               return <a key={index2} className="item-a flex flex-c flex-c-c" onClick={this.changeFileType.bind(this)}>{item2}</a>                                                            
                                                           }
                                                        })
                                                   }
                                                </div>
                                            </div>                                     
                                })
                            }                                                                                                                
                       </div>                       
                    </div>
                </div>
                <div className="dialog-footer flex flex-c">
                    <p className="flex flex-c flex-l-l flex-item-gsb-0" onClick={this.changeAll.bind(this)}>
                       <i className="icons icons-20 fn-check right-m-5"></i>
                       全选
                    </p>
                    <p className="flex flex-l-l flex-item-gsb-0" style={{"marginLeft":"10px","display":"none"}}>
                       注：此设置页面以右侧点击“确认”按扭后生效。
                    </p>                    
                    <p className="flex flex-r-r" style={{"width":"100%"}}>
                      <a className="dialog-btn confirm-btn" onClick={this.setParamenterFilter.bind(this)}>确认</a>
                      <a className="dialog-btn cancel-btn" onClick={() => this.props.actions.triggerDialogInfo(null)}>取消</a> 
                    </p>
                </div>
                {
                    setting.show ? 
                        msgAlertSuccessHtml(setting.text)
                    :
                        null
                } 
                {
                    confirm.show && confirm.data ?
                       msgConfirmHtml(confirm.data)
                    :
                       null   
                }                                
            </div>   
        )
    }
    componentDidMount() {
        const this_h = $('.local-folder-scan-set-layer').height();
        clientHeight(this.refs.clientHeight, this_h, 215)      
        this.isallchecked() 
        getmCustomScrollbar($(".scllorBar_paramenterSet"))           
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.colseAt !== this.props.colseAt ){
            this.closeSet()
        }       
    }    
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }    
    componentDidUpdate(nextProps) { 
        getmCustomScrollbar($(".scllorBar_paramenterSet"), null, 'update')
        if( nextProps.resize.h !== this.props.resize.h ){
            const this_h = $('.local-folder-scan-set-layer').height();
            clientHeight(this.refs.clientHeight, this_h, 215)
        }
        if( this.refs.msgAlertSuccessHtmlRef ){
             absVerticalCenter2(this.refs.msgAlertSuccessHtmlRef)
        }
        if( this.refs.msgConfirmHtmlRef ){
            absVerticalCenter2(this.refs.msgConfirmHtmlRef)
        }                               
    }    	  
}
export default immutableRenderDecorator(ParamenterSettings)