import React, { Component, PropTypes } from 'react'

import { getFileSize, addArray, log, getFontState } from '../../constants/UtilConstant'
import { clientHeight } from '../../constants/DomConstant'
import { SMART_MENU, GET_FONT_STATE } from '../../constants/DataConstant'
import { SHOW_DIALOG_ALERT, SMART_MENU_COLLECT1, SMART_MENU_INSTALL, SMART_MENU_OPEN, SMART_MENU_DEL } from '../../constants/TodoFilters'
import { getmCustomScrollbar } from '../../constants/EventsConstant'

//我的字体--下载管理--已下载
class DownloadedTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DownloadedTable");		
	}
	openFileBtn(path, falg, event) {
        event.stopPropagation();
        event.preventDefault();
        if( falg ){
        	window.openFileRequest(2, path); 
        }else{
			this.props.actions.triggerDialogInfo({
				type: SHOW_DIALOG_ALERT,
				text: "字体文件路径不存在",
				auto: true,
				speed: 1500,
				statu: 0
			})         	
        }       
	}	
	showSmartMenuLayer(event) {
        if( event.which !== 3 ){
        	return false;
        }
        const nsElem = event.currentTarget.querySelector('.smart-menu-layer'),
              optElem = doc.querySelector('.body-opacity-layer'),
              dragElem = nsElem.querySelector('.smart-menu-list');
        if(nsElem.style.display == '' || nsElem.style.display == 'none'){
        	//optElem.style.display = 'block'
        	nsElem.style.cssText = 'top:0px;left:30px;display:block'
        	dragDrop(dragElem, nsElem)
        }
	}	
	smartMenuShow(item, event){
		//右键点击菜单
	    if( event.button == 2 ){
	    	const liDom = document.querySelectorAll('.downloaded_smart_meun li')
	    	let delElem; 
	    	for( let i = 0, lens = liDom.length; i < lens; i++ ){
	    		let fontId;
                const hiddenDom = liDom[i].querySelector('input[type=hidden]')
                if( hiddenDom ){
                    fontId = hiddenDom.value
                    if( fontId == item.font_id ){
                    	delElem = liDom[i]
                    }else{
                    	liDom[i].classList.remove('active-sm')
                    }
                }                
	    	}
	    	if( delElem ){
	    		delElem.classList.toggle('active-sm')
	    	}
	    	const data = {
               smartMenu: addArray(SMART_MENU, [SMART_MENU_OPEN, SMART_MENU_DEL]),
               elem: delElem,
               item: item,
               pageX: event.pageX,
               pageY: event.pageY
	    	}
	    	this.props.actions.smartMenuShow(data);
	    }        
	} 					
	render() {
		const { downloaded } = this.props
        return <div className="downloaded-table" style={{"height": "calc(100% - 55px)"}}>
	                <div className="thead">
	                    <div className="col-1"><span></span></div>
	                    <div className="col-2"><span></span></div>
	                    <div className="col-3"><span className="left-10">字体文件名</span></div>
	                    <div className="col-4"><span className="left-10">大小</span></div>
	                    <div className="col-5"><span className="left-10">时间</span></div>
	                </div>
	                {
	                	downloaded && downloaded.length > 0 ?
			                <ul className="table scllorBar_table downloaded_smart_meun" ref="clientHeight" style={{"height":"calc(100% - 26px)"}}>
			                    {
			                    	downloaded.map((item, index) => { 
		                                const btn_statu = getFontState(item.font_state)
		                                if( item.is_del )return null;
				                    	return  <li key={index+item.font_id} onMouseDown={this.smartMenuShow.bind(this, item)}>
						                    	    <input type="hidden" value={item.font_id}/>
						                    	    <div className="col-1">
						                    	        <span className="center">
						                    	        {
						                               	    index < 9 ?
						                               	        '0'+ (index+1) +''
						                               	    :
						                               	        (index+1)	                    	         	
						                    	        }
						                    	        </span>
						                    	    </div>
						                    	    <div className="col-2">
						                    	        <span className="center">
						                    	            {
		                                                        btn_statu === GET_FONT_STATE.installed || btn_statu === GET_FONT_STATE.not_install ?
		                                                            <i className="icons icons-18 font-open-bg" onClick={this.openFileBtn.bind(this, item.path, true)}></i>
		                                                        :
		                                                            <i className="icons icons-18 open-file-unfind-bg" onClick={this.openFileBtn.bind(this, item.path, false)}></i>    
						                    	            } 
						                    	          	
						                    	        </span>
						                    	    </div>
						                    	    <div className="title col-3">
						                    	          <span className="left-10">
						                    	              <i className=""></i>{item.file_name}
						                    	          </span>
						                    	    </div>
						                    	    <div className="col-4">
						                    	          <span className="left-10">{getFileSize(item.file_size, 2)}</span>
						                    	    </div>
						                    	    <div className="col-5">
						                    	          <span className="left-10">{item.completed_time ? item.completed_time : '刚刚'}</span>
						                    	    </div>
					                    	    </li>
				                    	}   
			                    	)   
			                    }
			                </ul>
	                	:
               	      	    <div className="dm-content">
               	      	     	<div className="abs no-data">
               	      	     	   <p className="flex">暂无已下载的记录</p>
               	      	     	</div>
               	      	    </div>	                	
	                }		           
		       </div>	               
	}
	componentDidMount() {
        getmCustomScrollbar($(".scllorBar_table"))
	}
    componentWillReceiveProps(nextProps) {
	    if( (nextProps.downloaded && this.props.downloaded && nextProps.downloaded.length !== this.props.downloaded.length) ||
	        nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
	          getmCustomScrollbar($(".scllorBar_table"), null, 'destroy')
	    }

	}
	componentDidUpdate(nextProps, nextState) {   

		if(nextProps.resize.h !== this.props.resize.h){
			getmCustomScrollbar($(".scllorBar_table"), null, 'update')
		}
	    if( $(".scllorBar_table.mCustomScrollbar").length == 0 ){
	        getmCustomScrollbar($(".scllorBar_table"))
	    }else{
	        getmCustomScrollbar($(".scllorBar_table"), null, 'update')
	    }		
	}			
}
export default DownloadedTable