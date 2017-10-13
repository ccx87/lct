import React, { Component, PropTypes } from 'react'
import { log } from '../../../constants/UtilConstant'

//评论列表
class Comment extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("Comment");		
	}
	render() {
		return <div className="content-comment-cf">
                   评论三
		       </div>
	}	
}
export default Comment
