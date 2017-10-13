import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log, isEmpty } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { LABEL, NO_KEYWORDS } from '../../constants/TextConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

class KeyWord extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            filter: false,
            Tag: []
        };
        this.clickTitleBtn = this.clickTitleBtn.bind(this)
        this.showTagInput = this.showTagInput.bind(this)
        this.addTagKeyDown = this.addTagKeyDown.bind(this)
      	log("KeyWord");		
  	}	
    clickTitleBtn(event) {
          event.stopPropagation();
          event.preventDefault();
          const this_Elem = event.currentTarget,
                sib_Elem = this_Elem.nextSibling,
                i_Elem = this_Elem.querySelector('.open-info-bg');
          showOrHideItem(sib_Elem, i_Elem, 'rotate-90-bg')      
    }  
    showTagInput(event){
        if( this.props.attrData && this.props.attrData.file_scan_sync_flag ){
            this.setState({
                filter: !this.state.filter
            })        
        }else{
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "已扫描的文件才能添加标签",auto: true,speed: 1500,statu: 0})
        }
    }  
    delTag(item, event){
        const _index = this.state.Tag.indexOf(item);
        console.log(_index)
        if( _index > -1 ){
            this.state.Tag.splice(_index, 1)
            this.setState({
                Tag: this.state.Tag
            })
        }
    }
    addTagKeyDown(event) {
        var keyCode = window.event ? event.keyCode : event.which;
        if(keyCode == 13) {
            const input_Elem = document.getElementById('addTagInput'),
                  _index = this.state.Tag.indexOf(input_Elem.value);
            console.log(input_Elem.value)
            if( isEmpty(input_Elem.value) ){
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "请输入标签名称",auto: true,speed: 1500,statu: 0})
                return false;                
            }      
            if( _index > -1 ){
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "不能添加相同的标签",auto: true,speed: 1500,statu: 0})
                return false;
            }
            this.state.Tag.push(input_Elem.value)      
            this.setState({
                filter: false,
                Tag: this.state.Tag
            })
        }
        return false;
    }    		
    render() {
        const { fmData, active } = this.props
        const { filter, Tag } = this.state
        return (
            <div className={active ? "detail-item key-word active" : "detail-item key-word"}>
                 <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn}>
                     <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                     <span className="text">
                         {LABEL}
                         {
                             Tag.length > 0 ?
                                <span>（{Tag.length}）</span>
                             :
                                null   
                         }
                     </span>
                 </a>    
                 {
                     fmData !== null ?                                                               
                         <div className="di-main">
                             <div className="keyword-content flex flex-wrap"> 
                                 {
                                     Tag && Tag.length > 0 ?
                                         Tag.map((item, index) => {
                                              return <a key={index} href="javascript:;" className="kw-item col-6">
                                                         {item}
                                                         <i className="abs icons-local-material icons-20 fn-close-bg" onClick={this.delTag.bind(this, item)}></i> 
                                                     </a>
                                         })                                                                                 
                                     :
                                         null                                           
                                 }                
                                 <a className="add-bnt flex flex-c flex-c-c" onClick={this.showTagInput}>
                                     <i className="icons-local-material icons-20 fn-add-bg"></i>
                                     添加标签
                                 </a>  
                                 {
                                     filter ?
                                         <p className="add-con flex" onKeyDown={this.addTagKeyDown}>
                                             <input type="text" className="add-input" id="addTagInput" placeholder="添加标签，按enter保存"/>
                                         </p>
                                     :
                                         null                                 
                                 }
                             </div>
                         </div>
                     :
                         null           
                 }                 
            </div>   
        )
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }
    componentDidUpdate(nextProps, nextState) { 
        if( this.state.filter ){
            const atiDom = document.getElementById('addTagInput')
            if( atiDom ){
                atiDom.focus()
            }
        } 
    }	  
}
export default immutableRenderDecorator(KeyWord)