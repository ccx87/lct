import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { SHOW_LIST_CF, SHOW_EFFECTPIC_CF, SHOW_COMMENT_CF } from '../../../constants/TodoFilters'
import { COMMONFONT_TAB } from '../../../constants/DataConstant'
import { clientHeight } from '../../../constants/DomConstant'
import { log } from '../../../constants/UtilConstant'

import Switch from '../../../modules/Switch'
import Topinfo from './Topinfo'
import List from './List'
import Effectpic from './Effectpic'
import Comment from './Comment'
import Create from './Create'
import DialogMain from '../../../modules/dialogModel/DialogMain'


//创建的字体单通用模版
class CreateCommonFont extends Component {
  	constructor(props, context) {
    	super(props, context);
    	this.state = { 
    		filter: SHOW_LIST_CF,
    		initTimeout: null
        };
    	log("CreateCommonFont--创建的字体单通用模版");
  	}	
  	handleShow(filter) {
  		this.setState({ filter })
  	}
    render() {
    	const { fonts, actions, resize, subRoute, login } = this.props
        const { filter } = this.state
        log('create-common-font---',this.props)
      return <div className="main_container">
              {    
              	subRoute && subRoute.data ?
		              <div className="common-font">
		                <Topinfo {...this.props}/>    
				        <div className="cf-list cf-bottom">
				            <div className="switch-tab">
					            <Switch 
					                options={COMMONFONT_TAB} 
					                filter={filter} 
					                onShow={this.handleShow.bind(this)}/>
				            </div>
				            <div className="container" ref="clientHeight">
					            {
					            	filter === SHOW_LIST_CF ?					            	
					            	   	<List {...this.props}/>					            	          
					            	:
					            	filter === SHOW_EFFECTPIC_CF ? 
					            	   <Effectpic resize={resize}/> 
					            	:
					            	filter === SHOW_COMMENT_CF ? 
					            	   <Comment {...this.props}/>
					            	:
					            	   null    
					            }
				            </div>
				        </div>
		        	  </div>	
              	:
              	   <Create 
              	       actions={actions} 
              	       {...this.props}/>
              }
              <DialogMain actions={actions} />
        	</div>
    }
	componentDidMount() {
		const t_p = this.props,
		      t_s = t_p.subRoute;
		clientHeight(this.refs.clientHeight, t_p.resize.h, 285)
		if( t_s && t_s.data ){
			t_p.actions.getfontsByFontListID(t_s.id)
		}
	}
	componentWillUpdate(nextProps, nextState) {
		log(nextProps, this.props.subRoute)
	  	if((nextProps.subRoute && this.props.subRoute && nextProps.subRoute.id !== this.props.subRoute.id) || ( nextProps.subRoute && this.props.subRoute == null )){
			this.props.actions.getfontsByFontListID(nextProps.subRoute.id)
	  	}			
	}
	componentDidUpdate(nextProps, nextState) {
		const n_r = nextProps.resize,
		      t_r = this.props.resize;
		if( n_r.h !== t_r.h || nextProps.subRoute !== this.props.subRoute ){
			clientHeight(this.refs.clientHeight, t_r.h, 285)
		}
	}
	componentWillUnmount() {
		this.state.initTimeout = null
	} 
}
CreateCommonFont.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
const mapStateToProps = (state) => {
	return {
		fonts: state.fonts
	}
}
export default connect(
  mapStateToProps
)(CreateCommonFont)
