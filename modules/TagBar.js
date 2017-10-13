import React, { Component, PropTypes } from 'react'

import { log } from '../constants/UtilConstant'

class TagBar extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("TagBar");		
	}			
  render() {
    return (
	      <div className="tag-bar">
              热门标签：
              <a className="tag-a">中文</a>
              <a className="tag-a">英文</a>
	      </div>
    )
  }	  
}
export default TagBar