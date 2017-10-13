import React, { Component, PropTypes } from 'react'

import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { log } from '../../../constants/UtilConstant'

import Search from '../../../modules/functionBarModel/Search'
import CommonList from '../../../modules/CommonList'
import DataNull from '../../../modules/DataNull'

//字体列表
class List extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("List");		
	}
	render() {
		return <div className="content-list">
		          <Search {...this.props}/>
		          <CommonList 
	                    hasCheck={0}
		                less={310}
		                {...this.props}/>		          	              
		       </div>
	}
}
List.defaultProps = {
	type:{
		search: "搜索字体单字体",
		value: 0
	}
}
export default List