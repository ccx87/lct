import React, { Component, PropTypes } from 'react'

import { getFileSize, isEmpty, log, keySort } from '../../constants/UtilConstant'
import { clientHeight } from '../../constants/DomConstant'

class RecordTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("RecordTable");		
	}
	openFileBtn(path, event) {
        event.stopPropagation();
        event.preventDefault();
        window.openFileRequest(2, path);        
	}	
	render() {
		const { fonts } = this.props
		const historyData = fonts.missingHostoryRecord.data.sort(keySort('operate_time', 'DES'))
		return <div className="record-table" style={{"height":"calc(100% - 45px)"}}>
	                <div className="thead">
	                    <div className="col-1"><span></span></div>
	                    <div className="col-2"><span></span></div>
	                    <div className="col-3"><span className="left-10">文件</span></div>
	                    <div className="col-4"><span className="left-10">大小</span></div>
	                    <div className="col-5"><span className="left-10">时间</span></div>
	                </div>
	                <div className="scllorBar_table" ref="clientHeight" style={{"height": "calc(100% - 26px)"}}>
		                <ul className="table">
		                    {
		                    	historyData.map((item, index) => {
		                    		item["type"] = item.file_name.split(".")[1].toLowerCase();
		                    		const i_icons = 'icons-files icons-20 file-format-small-'+ item.type;
		                    	   return  <li key={index}>
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
				                    	            	item.is_exist ?
				                    	            	   <i className="icons icons-18 font-open-bg" onClick={this.openFileBtn.bind(this, item.path)}></i>
				                    	            	:
				                    	            	   <i className="icons icons-18 open-file-unfind-bg" onClick={this.openFileBtn.bind(this, item.path)}></i>   
				                    	            }
				                    	          </span>
				                    	      </div>
				                    	      <div className="title col-3">
				                    	          <span className="left-10 flex-important flex-c">
				                    	             <i className={i_icons}></i>
				                    	             {item.file_name}
				                    	          </span>
				                    	      </div>
				                    	      <div className="col-4"><span className="left-10">{getFileSize(item.file_size, 2)}</span></div>
				                    	      <div className="col-5"><span className="left-10">{item.operate_time}</span></div>
				                    	   </li>
		                    	})   
		                    }
		                </ul>
	                </div>		           
		       </div>
	}
	componentDidMount() {
		$(".scllorBar_table").mCustomScrollbar({
			theme:"dark-3",
			scrollInertia:550			
		})
	}
	componentDidUpdate(nextProps, nextState) { 
		if(nextProps.resize.h !== this.props.resize.h){
			$(".scllorBar_table").mCustomScrollbar("update")
		}
	}	
}
RecordTable.propTypes = {
	
}
export default RecordTable