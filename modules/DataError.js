import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { log } from '../constants/UtilConstant'

class DataNall extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DataNall");		
	}
	render() {
		return <div className="abs error-data">
		            <p className="col-red">error: 出错啦！</p>  
		       </div>
	}
}
DataNall.propTypes = {
	
}
export default DataNall