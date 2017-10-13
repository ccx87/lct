import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { isEmpty, log } from '../constants/UtilConstant'
import { PAGE_TYPE, INSTALL_TIME, FONT_TYPE } from '../constants/DataConstant'

class DataNall extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DataNall");		
	}
	render() {
		const { fonts } = this.props
		return <div className="abs no-data">
		           {
		           	  !isEmpty(fonts.common.search_text) ?
		           	      fonts.common.PageName !== PAGE_TYPE.Font_Assistant.search_font.PageName ?
			           	      <div className="flex">
							   	<p className="p-1">未找到含有 <span className="col-lan">“{fonts.common.search_text}”</span> 的字体</p>
	                          </div>
	                       :
			           	      <div className="flex">
			           	          {
                                      FONT_TYPE.cloud !== fonts.common.type ?
				           	          	  fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
				           	          	      <div>
				           	          	          <p className="p-1">本地未找到含有 “<span className="col-lan">{fonts.common.search_text}</span>” 的字体</p>
				           	          	          <p className="p-1">正在前往云端获取字体信息，请稍候......</p>
				           	          	      </div>
				           	          	  :
				           	          	      <p className="p-1">未找到含有 <span className="col-lan">“{fonts.common.search_text}”</span> 的字体</p> 
                                      :
                                          null 
			           	          }
	                          </div>	                             
		           	  :
		           	       fonts.common.InstallTime == INSTALL_TIME.default ?
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.local_font.PageName ?
                  						   fonts.common.type ==  FONT_TYPE.install ?
				                               <div className="flex">
										           <p className="p-1">本地未找到已安装的字体</p>                              
				                               </div>
				                           :                           
				                           fonts.common.type ==  FONT_TYPE.uninstall ?
				                               <div className="flex">
										           <p className="p-1">本地未找到未安装的字体</p>                              
				                               </div>
				                           :		                               
				                               <div className="flex">
										           <p className="p-1">请安装或下载字体到本地</p>
										           <p className="p-2">方便您对字体的管理、预览！</p>                               
				                               </div>
		                           :
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.installed_font.PageName ?
		                               <div className="flex">
								           <p className="p-1">本地未找到已安装的字体</p>                              
		                               </div>
		                           :                           
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.uninstall_font.PageName ?
		                               <div className="flex">
								           <p className="p-1">本地未找到未安装的字体</p>                              
		                               </div>
		                           :
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.my_collection.PageName ?
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :
			                               <div className="flex">
									           <p className="p-1">暂无收藏的字体</p>
			                               </div>                           
		                           :
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.search_font.PageName ?
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :			  		           	      
				  		           	      <div className="flex">
									           <p className="p-1">字体云端查无此字体</p>
						           	      </div>                           
		                           :
		                           fonts.common.PageName == PAGE_TYPE.Font_Assistant.recycle_bin.PageName ?
			  		           	      <div className="flex">
								           <p className="p-1">回收站很干净</p>
					           	      </div>
					           	   :
			  		           	      <div className="flex">
								           <p className="p-1">未找到字体</p>
					           	      </div>					           	           
				           	:
						           	fonts.common.InstallTime == INSTALL_TIME.day ? 
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :						           	      
			                              <div className="flex">
									          <p className="p-1">未找到最近一天通过字体助手安装的字体</p>                              
			                              </div>
			                        :
						           	fonts.common.InstallTime == INSTALL_TIME.week ?
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :						           	 
			                              <div className="flex">
									          <p className="p-1">未找到最近一周通过字体助手安装的字体</p>                              
			                              </div>
			                        :
						           	fonts.common.InstallTime == INSTALL_TIME.month ?
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :						           	 
			                              <div className="flex">
									          <p className="p-1">未找到最近一个月通过字体助手安装的字体</p>                              
			                              </div>
			                        :
		                               fonts.afterFids && fonts.allList.data && fonts.allList.data.list && fonts.afterFids.length == fonts.allList.data.list.length ?
                                           null
		                               :			                        	                        	                        	                              				           	    
			                              <div className="flex">
									          <p className="p-1">未找到字体</p>                              
			                              </div>				           	          		           	  
		           }
		       </div>
	}
}
export default DataNall