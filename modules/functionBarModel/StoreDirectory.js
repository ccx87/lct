import React, { Component, PropTypes } from 'react'
import { SHOW_DOWNLOADED, SHOW_DOWNLOADING, SHOW_AUTO_FILL } from '../../constants/TodoFilters'
import { log } from '../../constants/UtilConstant'

class StoreDirectory extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("StoreDirectory");		
	}
	searchDownloadFileBtn() {
		
	}
	render() {
		const { filter } = this.props
		return <div className="function-bar">
		         <div className="download-fb">
		             {
		             	 filter === SHOW_DOWNLOADED ?
				             <div className="ed">
				                  <div className="abs search" style={{"display": "none"}}>
						               <input className="ed-input" type="text" placeholder="搜索已下载的文件" ref="searchDownloadFileRef"/>
						               <a className="ed-abtn" onClick={this.searchDownloadFileBtn.bind(this)}>搜索<i className="icons icons-18 search-bg"></i></a>
				                  </div>
				                  <p className="p-line">储存目录：<span>S/liantuyunfont</span><a className="col-lan ml-abtn" href="javascript:;">打开目录</a></p>
				             </div>
				         :
				         filter === SHOW_DOWNLOADING ?  
				             <div className="ing">
				                  <div className="abs btn">
						               <a className="ing-abtn" onClick={this.searchDownloadFileBtn.bind(this)}><i className="icons icons-18 clear-bg"></i>清空</a>
				                  </div>
				                  <p className="p-line">
				                       <a className="ing-abtn allStart"><i className="icons icons-18 all-start-bg"></i>全部开始</a>
				                       <a className="ing-abtn allPause"><i className="icons icons-18 all-pause-bg"></i>全部暂停</a>
				                       <label>储存目录：<span>S/liantuyunfont</span><a className="col-lan ml-abtn" href="javascript:;">打开目录</a></label>
				                  </p>
				             </div>					         
				         :
				         filter === SHOW_AUTO_FILL ?
				             <div className="right-top title-line title-loca">
				                  <span className="tit">自动补齐</span>
				                  <span className="loca">储存目录：S/liantuyunfont</span>
				                  <a className="col-lan ml-abtn" href="javascript:;">打开目录</a>
				             </div>
				             
				         :   
				             null     		             	 
		             }
		       </div>
		     </div>  
	}	
}
StoreDirectory.propTypes = {
	
}
export default StoreDirectory