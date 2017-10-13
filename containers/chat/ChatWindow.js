import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { log, isEmpty } from '../../constants/UtilConstant'

import ChatIng from './ChatIng'
import ChatLog from './ChatLog'

class ChatWindow extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
      	log("ChatWindow");		
  	}	
    render() {
        const { routeLastUpdated } = this.props
        return (
              <div key={routeLastUpdated} className="chat-window flex flex-l flex-l-l">              
                    <ChatIng {...this.props}/>
                    <ChatLog {...this.props}/>              
              </div>              
        )
    }    
}
export default ChatWindow
