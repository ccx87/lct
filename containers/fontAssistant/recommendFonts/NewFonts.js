import React, { Component, PropTypes } from 'react'

import { 
	SHOW_NEW_FONT_1, 
	SHOW_NEW_FONT_2,
	SHOW_NEW_FONT_3,
	SHOW_NEW_FONT_4
} from '../../../constants/TodoFilters'
import { NEWFONT_TAB } from '../../../constants/DataConstant'
import { clientHeight } from '../../../constants/DomConstant'
import { log } from '../../../constants/UtilConstant'

import Switch from '../../../modules/Switch'
import FontPicFlow from '../../../modules/flowModel/FontPicFlow'

class NewFonts extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: SHOW_NEW_FONT_1
    	};
    	log("NewFonts");		
	}
  	handleShow(filter) {
  		this.setState({ filter })
  	}			
  render() {
  	const { resize, subRoute, todos, actions } = this.props
  	const { filter } = this.state
    return (
	      <div className="new-fonts">
	           <Switch options={NEWFONT_TAB} filter={filter} onShow={this.handleShow.bind(this)}/>
               <div className="content-list scllorBar_new_fonts" ref="clientHeight">
                   <FontPicFlow />			            			            			            			                                
               </div>	               
	      </div>
    )
  }
  componentDidMount() {
      clientHeight(this.refs.clientHeight,this.props.resize.h,68)
	  $(".scllorBar_new_fonts").mCustomScrollbar({
	  	 scrollInertia:550,
		 theme:"dark-3"			
	  })      						
  }
  componentDidUpdate(nextProps, nextState) {
	 if(nextProps.resize.h !== this.props.resize.h){
		clientHeight(this.refs.clientHeight,this.props.resize.h,68,this.refs.clientHeight.firstChild)				
     }
  }   
  componentWillUnmount() {
  } 	  
}
NewFonts.propTypes = {
  todos: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
export default NewFonts
