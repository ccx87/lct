import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { 
	RECOMMEND_FONTS_FOUND_FONTS,
	RECOMMEND_FONTS_NEW_FONTS
} from '../../../constants/TodoFilters'
import { log } from '../../../constants/UtilConstant'

import FoundFonts from './FoundFonts'
import NewFonts from './NewFonts'

class RecommendFonts extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("RecommendFonts");		
	}		
  render() {
  	const { subRoute } = this.props 
    return (
	      <div className="main_container">
	          {
	          	subRoute.name === RECOMMEND_FONTS_FOUND_FONTS ?
	          	   <FoundFonts {...this.props} />
	          	:   
	          	subRoute.name === RECOMMEND_FONTS_NEW_FONTS ?
	          	   <NewFonts {...this.props} />
	          	:      	          	   	          		
	          	   null   
	          }	          
	      </div>
    )
  }	  
}
RecommendFonts.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
const mapStateToProps = (state) => {
	return {
		fonts: state.fonts
	}
}
export default connect(
  mapStateToProps
)(RecommendFonts)

