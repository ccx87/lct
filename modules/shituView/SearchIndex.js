import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {  SEARCH_CENTER_TAB, ROUTES } from '../../constants/DataConstant'

import { SHOW_IMAGE_MATERIAL, SHOW_FONT_MATERIAL } from '../../constants/TodoFilters'
import { log, isEmpty } from '../../constants/UtilConstant'
import Switch from '../Switch'
import Search from './Search'
import FontMain from '../fontView/fontMain'
import Main from '../../containers/fontAssistant/Main'

class SearchIndex extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {}
  	}	   
    render() {
        const { filter, onShow } = this.props
      	return (
            <div className='flex flex-c flex-dir-column search-index' style={{"position": "absolute", "top": 0, "left": 0, 'height':'100%','width':'100%'}}>
      		    	<Switch options={SEARCH_CENTER_TAB} filter={filter} onShow={onShow}/>
                {
                   filter === SHOW_IMAGE_MATERIAL ?
                      <Search {...this.props}/>
                   :   
                   filter === SHOW_FONT_MATERIAL ?
                      <div className="font-view">
                          <FontMain {...this.props}/>
                          <div className="fv-missing">
                              <Main 
                                  actions={this.props.actions} 
                                  actionsST={this.props.actionsST}
                                  resize={this.props.resize} 
                                  login={this.props.login}                                  
                                  defaultRoute={{route: ROUTES[1], subRoute: ROUTES[1].data[0]}}/>
                          </div>
                      </div>
                   :
                      null      
                }
            </div>
      	)
    } 
    componentDidMount() {
        if( document.querySelector('.dialog-main #Scan') ){
            this.props.actions.triggerDialogInfo(null)
        }
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.filter != this.props.filter && nextProps.filter === SHOW_FONT_MATERIAL ){          
            //字体补齐拖拽
            this.props.actionsST.startGetDragDropFile('FONT')//重新开启拖拽监听
        }
    }           
}
export default SearchIndex