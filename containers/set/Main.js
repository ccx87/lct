import React, { Component, PropTypes } from 'react'

import { 
   SET_OTHER,
   SET_COMMON
} from '../../constants/TodoFilters'

import { WIMDOW_INITIALIZE_FONT_DB_REQUEST } from '../../constants/ActionsTypes'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { tableCellDom } from '../../constants/DomConstant'
import { log } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

import SetCommon from './common/SetCommon'

const doc = document
class Main extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            
        };
      	log("Main");		
  	}	
    render() {
      const { route } = this.props
      return (
        <div className="main">
            {
            	route ?
  	          	route.menu === SET_COMMON ?
  	          	   <SetCommon 
                      {...this.props} />
  	          	:
                   null 
  	        : 
  	            null         
            }
        </div>
      )
    }    
}
export default Main
