import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty } from '../../constants/UtilConstant'
import { TREE_FILTER } from '../../constants/DataConstant'
import { msgAlertErrorHtml } from '../../constants/RenderHtmlConstant'

import SidebarFiles from '../../containers/localFile/SidebarFiles'

/* 弹出层--树形多选文件夹  */
class SelectFolder extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
          msg_sys: {
            show: false,
            text: ''
          }       
      };
    	log("SelectFolder");		
	} 
  msgInfo(text){
      this.setState({
          msg_sys: {
            show: true,
            text: text
          }
      })
      setTimeout(() => {
          this.setState({
              msg_sys: {
                show: false,
                text: ''
              }
          })
      }, 1500)    
  }  
  selectFoldersBtn() {
      //获取外层盘符目录
      const startDom = $('#FirstItemP').closest('li').children('div.submenu'), 
            p_elems = startDom.children('ul').children('li').children('.item-p'),
            scanPathArray = [];         
      //更新子目录被移除扫描目录时弹窗提示
      //为符合要求的子目录添加class--hasScanPath
      const nextAddTipFn = elem => {
          if( elem.hasClass('checked') && !elem.hasClass('mode-dialog') ){
              elem.addClass('hasScanPath');
              const nextElem = elem.siblings('div.submenu').children('ul').children('li').children('.item-p');
              if( nextElem.length > 0 ){
                  //自己递归检索
                  nextAddTipFn(nextElem)
              }                
          }
      }        
      //获取需要扫描的路径      
      const nextAddScanFn = elem => { 
          if( elem.hasClass('checked') && !elem.hasClass('mode-dialog') ){
              const scanPath = elem.data('path');
              if( !isEmpty(scanPath) ){ 
                  scanPathArray.push(scanPath);
              }
              nextAddTipFn(elem)   
          }else{
              const nextElem = elem.siblings('div.submenu').children('ul').children('li').children('.item-p');
              if( nextElem.length > 0 ){
                  //开始递归检测
                  getCheckedFn(nextElem)
              }
          }
      }  
      //循环elems检索
      const getCheckedFn = elems => {
          elems.each((index, elem) => {
              nextAddScanFn($(elem))                    
          })
      }
      //开始checked检索
      getCheckedFn(p_elems); 
      if( scanPathArray.length > 0 ){
          //添加文件夹后立即执行扫描
          this.props.actions.sendHandleMessage('ScanMsgProcess', 'addScanPath', {add_path: scanPathArray})
          this.props.actions.triggerDialogInfo(null)
      }else{
          //至少选择一个文件夹
          this.msgInfo('请至少选择一个文件夹')
      } 
  }  
	render() {
		const { actions } = this.props
		const { msg_sys } = this.state
		return <div className="dialog g-select-folders" ref="verticalCenter">
               <div className="dialog-title">
                   <span>选择文件夹</span>
                   <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
               </div>
               <div className="dialog-content">
                   <SidebarFiles 
                        mode={"dialog"}
                        {...this.props} 
                        treeFilter={TREE_FILTER[0]}/>
               </div>
               <div className="dialog-footer">
                    <a className="dialog-btn confirm-btn" onClick={this.selectFoldersBtn.bind(this)}>确认</a>
                    <a className="dialog-btn add-file-btn" onClick={() => actions.triggerDialogInfo(null)}>取消</a>   
               </div>
               {
                   msg_sys.show ?
                      msgAlertErrorHtml(msg_sys.text)
                   :
                      null   
               }                              
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = document.querySelector('.g-select-folders'),
			      dragElem = parElem.querySelector('.dialog-title');		
			absVerticalCenter2(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}	
    //重新获取配置信息
    this.props.actions.getConfigInfo()     
	}
  componentDidUpdate(nextProps, nextState) {
    	const alertDom = document.querySelector('.g-select-folders .alert-dialog-layer');
			alertDom && absVerticalCenter2(alertDom)
  }    			
}
const mapStateToProps = (state) => {
  return {
      openFilePath_3: state.events.openFilePath_3,
      openFile3LastUpdate: state.events.openFile3LastUpdate     
  }
}
export default connect(
  mapStateToProps
)(immutableRenderDecorator(SelectFolder))
