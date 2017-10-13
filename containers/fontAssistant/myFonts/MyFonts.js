import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { MY_FONTS_ALL, 
	     MY_FONTS_INSTALLED, 
	     MY_FONTS_UNINSTALL, 
	     MY_FONTS_COLLECTED, 
	     MY_FONTS_DOWNLOAD_MANAGER,
	     MY_FONTS_RECYCLE_BIN
} from '../../../constants/TodoFilters'
import { log } from '../../../constants/UtilConstant'

import All from './All'
import Installed from './Installed'
import Uninstall from './Uninstall'
import Collected from './Collected'
import DownloadManager from './DownloadManager'
import RecycleBin from './RecycleBin'

class MyFonts extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("MyFonts");		
	}	
  render() {
  	const { subRoute } = this.props
    return (
	      <div className="main_container">
	          {
	          	subRoute.name === MY_FONTS_ALL ?
	          	   <All {...this.props} />
	          	:   
	          	subRoute.name === MY_FONTS_INSTALLED ?
	          	   <Installed {...this.props} />
	          	:
	          	subRoute.name === MY_FONTS_UNINSTALL ?
	          	   <Uninstall {...this.props} />
	          	:
	          	subRoute.name === MY_FONTS_COLLECTED ?
	          	   <Collected {...this.props} />
	          	:	
	          	subRoute.name === MY_FONTS_DOWNLOAD_MANAGER ?
	          	   <DownloadManager {...this.props} />
	          	: 
	          	subRoute.name === MY_FONTS_RECYCLE_BIN ?
                   <RecycleBin {...this.props} />
                :   
	          	   null   
	          }
	      </div>
    )
  }	   
}
MyFonts.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
const mapStateToProps = (state, action) => {
	log("MyFonts")
	return {
		fonts: state.fonts
	}
}
export default connect(
  mapStateToProps
)(MyFonts)

