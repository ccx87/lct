import React, { Component, PropTypes } from 'react'
import { 
	SHOW_FONT_LIST, 
	SHOW_FONT_SORT,
	SHOW_FONT_RANKING
} from '../../../constants/TodoFilters'
import { FOUNDFONT_TAB } from '../../../constants/DataConstant'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { log } from '../../../constants/UtilConstant'

import Switch from '../../../modules/Switch'
import FontList from './FontList'
import FontSort from './FontSort'
import FontRanking from './FontRanking'

class FoundFonts extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: SHOW_FONT_LIST
    	};
    	log("FoundFonts");		
	}
  	handleShow(filter) {
  		this.setState({ filter })
  	}			
  render() {
  	const { resize, todos, actions } = this.props
  	const { filter } = this.state
    return (
	      <div className="found-fonts">
	         <Switch options={FOUNDFONT_TAB} filter={filter} onShow={this.handleShow.bind(this)}/>
	         {
	         	filter === SHOW_FONT_LIST ?  
	         	    <FontList 
	          	      todos={todos} 
	          	      actions={actions} 
	          	      resize={resize} />	         	    
	         	:
	         	filter === SHOW_FONT_SORT ? 
	         	    <FontSort 
	          	      todos={todos} 
	          	      actions={actions} 
	          	      resize={resize} />	         	    
	         	:
	         	
	         	filter === SHOW_FONT_RANKING ? 
	         	    <FontRanking
	          	      todos={todos} 
	          	      actions={actions} 
	          	      resize={resize} />
	          	:     	         	    
	         	    null
	         	    
	         }
	      </div>
    )
  }
  componentDidMount() {
		 						
  } 
  componentWillUpdate(nextProps, nextState) {
  	if( nextState.filter !== this.state.filter ){
  		this.props.actions.initializationData();
  	}
  }	    
  componentWillUnmount() {
  } 	  
}
export default FoundFonts

