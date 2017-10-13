import React, { Component, PropTypes } from 'react'

import { log } from '../../constants/UtilConstant'

import FontSize from '../FontSize'
import PreviewFont from '../smallModel/PreviewFont'
import SearchInput from '../smallModel/SearchInput'

//搜索条
class Search extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("Search");		
	}
	render() {
		return <div className="function-bar">
		           <div className="search-fb">
                       <FontSize actions={this.props.actions} fonts={this.props.fonts}/>
                       <PreviewFont actions={this.props.actions} fonts={this.props.fonts}/>
                       <SearchInput 
                            onEvents={this.props.onEvents} 
                            mode={this.props.mode} 
                            route={this.props.route}
                            subRoute={this.props.subRoute}
                            actions={this.props.actions}
                            fonts={this.props.fonts}
                            login={this.props.login}
                            onSearchFriends={this.props.onSearchFriends}
                            onFocusFriend={this.props.onFocusFriend}
                            onCloseSearch={this.props.onCloseSearch}
                            type={this.props.type}/>
		           </div>
		       </div>  
	}
}
export default Search
