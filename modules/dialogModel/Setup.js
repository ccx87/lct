import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter2 } from '../../constants/DomConstant'
import { dragDrop, log, isEmpty } from '../../constants/UtilConstant'
import { GENERAL_SET, PATH_SET } from '../../constants/TodoFilters'
import { msgAlertSuccessHtml } from '../../constants/RenderHtmlConstant'

/* 弹出层--软件设置  */
class Setup extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: GENERAL_SET,
    		fontPath: null,
        thumbPath: null,
    		isAlert: {
    			show: false,
    			text: ''
    		}
    	};
    	log("Setup");		
	}
	setPage(temp, event) {
      event.stopPropagation();
      event.preventDefault();
      const liDom = event.currentTarget,
            allDom = document.querySelectorAll('.set-sidebar .ss-li'),
            temparr = [];
      let _fontPath = null, _thumbPath = null;      
      temparr.forEach.call(allDom, (dom) => {
        	dom.classList.remove('active')
      })       
      liDom.classList.add('active')
      if( temp === PATH_SET ){
			    if( this.props.getConfig && this.props.getConfig.data ){
    				  const t_g = this.props.getConfig.data;
    				  if( t_g.download_path ){
    					    _fontPath = {key: 'download_path', value: t_g.download_path.value}
    				  }
              if( t_g.thumb_base_path ){
                  _thumbPath = {key: 'thumb_base_path', value: t_g.thumb_base_path.value}
              }
			    }        	
      }        
      this.setState({
        	filter: temp,
        	fontPath: _fontPath,
          thumbPath: _thumbPath
      })
	}
	bootSet(event) {

	}
    panelSet(bit, type){
        //修改配置文件--更改面板设置
        type = ""+ type +"";
        const data = [{key:"ExitType", value: type}]
        console.log(data)
        this.props.actions.setConfigRequest(data, 'Software settings'); 
    }
    updataPathBtn(data, event){
    	  data = data || {};
        this.props.actions.openFileRequest(3, data.value, data)
    }    	
    renderSetGeneral(){
        let closeCheck = 0,
            bit = 0,
            circle = 'icons-14 outer-circle flex flex-c flex-c-c',
            circleAc = 'icons-14 outer-circle flex flex-c flex-c-c active';
        if( this.props.getConfig && this.props.getConfig.data && this.props.getConfig.data.ExitType ){
            const etval = this.props.getConfig.data.ExitType.value;
            if( isEmpty(etval) ){
                closeCheck = 0;
                bit = 0;  
            }else{
                closeCheck = parseInt(etval) & 0x01;
                bit = parseInt(etval) & 0x02; 
            }
        }
        return <div className="sc-general flex flex-dir-column w-h-full">
                   <div className="sc-item flex flex-l" style={{"display":"none"}}>
                       <div className="i-left flex flex-r-r col-3">启动：</div>
                       <div className="i-right flex flex-l flex-dir-column col-6">
                            <div className="r-item flex flex-c" onClick={this.bootSet.bind(this)}>
							   <i className="icons icons-18 fn-check right-m-5 flex-item-gsb-0"></i>                                                  
	                           开机时启动链图云
                            </div>
                       </div>
                   </div>
                   <div className="sc-item flex flex-l">
                       <div className="i-left flex flex-r-r col-3">关闭面板：</div>
                       <div className="i-right flex flex-l flex-dir-column col-6">
                            <div className="r-item flex flex-c">
	                            <i className={closeCheck == 0 ? circleAc : circle} onClick={closeCheck == 0 ? null : this.panelSet.bind(this, bit, 2)}>
	                                <em className="icons-6 inner-circle"></em>
	                            </i>                       
	                           最小化到系统
                            </div>
                            <div className="r-item flex flex-c">
	                            <i className={closeCheck == 1 ? circleAc : circle} onClick={closeCheck == 1 ? null : this.panelSet.bind(this, bit, 3)}>
	                                <em className="icons-6 inner-circle"></em>
	                            </i>                       
	                           退出
                            </div>                            
                       </div>
                   </div>
                   <div className="sc-item flex flex-l" style={{"display":"none"}}>
                       <div className="i-left flex flex-r-r col-3">版本更新：</div>
                       <div className="i-right flex flex-l flex-dir-column col-6">
                            <div className="r-item flex flex-c">
	                            <i className="icons-14 outer-circle flex flex-c flex-c-c active">
	                                <em className="icons-6 inner-circle"></em>
	                            </i>                       
	                           自动更新
                            </div>
                            <div className="r-item flex flex-c">
	                            <i className="icons-14 outer-circle flex flex-c flex-c-c">
	                                <em className="icons-6 inner-circle"></em>
	                            </i>                       
	                           有新版本时提醒我
                            </div>                            
                       </div>
                   </div>                                       
               </div>
    }	
    renderSetPath() {
        const pathZt = this.state.fontPath;
        const pathYrt = this.state.thumbPath;
        return <div className="sc-path w-full">
                   <div className="w-full sc-item flex flex-dir-column">
                       <div className="i-top flex col-3">字体下载路径：<span className="col-9">默认将字体下载到该文件夹目录下</span></div>
                       <div className="i-bottom">
                            <span className="path-text col-9">{pathZt ? pathZt.value : ""}</span>
                            <button type="button" className="change-btn col-3 flex-item-gsb-0" onClick={this.updataPathBtn.bind(this, pathZt)}>更改路径</button>                       
                       </div>
                   </div>
                   <div className="w-full sc-item flex flex-dir-column">
                       <div className="i-top flex col-3">预览图缓存路径：<span className="col-9">默认将预览图缓存到该文件夹目录下</span></div>
                       <div className="i-bottom">
                            <span className="path-text col-9">{pathYrt ? pathYrt.value : ""}</span>
                            <button type="button" className="change-btn col-3 flex-item-gsb-0" onClick={this.updataPathBtn.bind(this, pathYrt)}>更改路径</button>                       
                       </div>
                   </div>                   
               </div>
    }    
	render() {
		const { actions, dialogData } = this.props
		const { filter, isAlert } = this.state
		return <div className="dialog g-setup-layer" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>设置</span>
		               <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
		           </div>
		           <div className="dialog-content flex flex-c">
                       <div className="set-sidebar flex">
                           <ul className="ss-ul">
                               <li className="flex flex-c ss-li active" onClick={this.setPage.bind(this, GENERAL_SET)}><span>常规设置</span></li>
                               <li className="flex flex-c ss-li" onClick={this.setPage.bind(this, PATH_SET)}><span>路径设置</span></li>
                           </ul>
                       </div>
                       <div className="set-content flex">
                           {
                           	   filter === 'GENERAL_SET' ?
                                  this.renderSetGeneral()
                               :
                               filter === 'PATH_SET' ?
                                  this.renderSetPath()
                               :
                                   null   
                           }
                       </div>
		           </div>
		           {
		           	    isAlert.show ?
		           	    	msgAlertSuccessHtml(isAlert.text,'false') 
		           	    :
		           	    	null
		           }
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const parElem = document.querySelector('.g-setup-layer'),
			      dragElem = parElem.querySelector('.dialog-title');		
			absVerticalCenter2(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}	
	}
    componentWillReceiveProps(nextProps) {
    	if( nextProps.getConfig && nextProps.configLastUpdated !== this.props.configLastUpdated ){
            const n_g = nextProps.getConfig.data,
                  n_type = nextProps.getConfig.types;
            if(  n_g && n_type == 'Software settings' ){
                console.log(7777, nextProps.getConfig)
                if( n_g.download_path ){
                    this.state.fontPath.value = n_g.download_path.value;
                }
                if( n_g.thumb_base_path ){
                    this.state.thumbPath.value = n_g.thumb_base_path.value;
                }
                this.setState({
                    fontPath: this.state.fontPath,
                    thumbPath: this.state.thumbPath,
                    isAlert: {
                      show: true,
                      text: '设置已更新'
                    }
                })
                setTimeout(() => {
                  this.setState({
                    isAlert: {
                      show: false,
                      text: ''
                    }
                  })
                },3000)                
            } 
        }
        if( nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){
            const path_3 = nextProps.openFilePath_3;
            console.log(5555,nextProps.openFilePath_3)
            if( path_3 && path_3.data && path_3.tempData ){
                let data = [];
                switch(path_3.tempData.key){
                    case 'download_path':
                        this.state.fontPath.value = path_3.data; 
                        data.push(this.state.fontPath);
                    break;
                    case 'thumb_base_path':
                        this.state.thumbPath.value = path_3.data; 
                        data.push(this.state.thumbPath);
                    break;
                    default:
                    break;
                }
                this.props.actions.setConfigRequest(data, 'Software settings'); 
            }            
        }        
    }
    componentDidUpdate(nextProps, nextState) {
    	  const alertDom = document.querySelector('.g-setup-layer .alert-dialog-layer');
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
)(immutableRenderDecorator(Setup))
