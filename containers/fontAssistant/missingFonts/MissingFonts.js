import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { 
	MISSING_FONTS_AUTO_FILL,
	MISSING_FONTS_HISTORY_RECORD
} from '../../../constants/TodoFilters'
import { log } from '../../../constants/UtilConstant'

import AutoFill from './AutoFill'
import HistoryRecord from './HistoryRecord'


class MissingFonts extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("MissingFonts");		
	}		
  	render() {
	  	const { subRoute, defaultRoute } = this.props
	  	let name;
	  	//mode定义是作为字体页面还是外部调用模块
	  	if( subRoute && subRoute.name ){
	  		name = subRoute.name
	  	}
	    return (
		      <div className="main_container">
		          {
		          	name === MISSING_FONTS_AUTO_FILL ?
		          	   <AutoFill {...this.props}/>
		          	:   
		          	name === MISSING_FONTS_HISTORY_RECORD ?
		          	   <HistoryRecord {...this.props} />
		          	:      	          	   	          		
		          	   null   
		          }	          
		      </div>
	    )
  	}	  
}
const mapStateToProps = (state) => {
	return {
		fonts: state.fonts
	}
}
export default connect(
    mapStateToProps
)(MissingFonts)


