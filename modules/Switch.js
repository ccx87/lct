import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../constants/UtilConstant'

class Switch extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		fsListShow: false
    	};
    	log("Switch");
    	this.oneBodyClick = this.oneBodyClick.bind(this)		
	}
	showFsList(event) {
		const i_Elem = event.currentTarget.querySelector('i.drop-down-bg');
		$(i_Elem).addClass('rotate-180-bg');
		this.setState({
			fsListShow: !this.state.fsListShow
		})
		event.stopPropagation()
	}	
	oneBodyClick(event) {
		if(event.target.className === "unbody"){
			return;
		}
		if(this.state.fsListShow){
			$('.switch .drop-down-bg').removeClass('rotate-180-bg');
			this.setState({
				fsListShow: false
			})			
		}
	}	
	renderFilterLink(filter) {
	    const title = filter.name
	    const { filter: selectedFilter, onShow, onMEShow, mode } = this.props
	    const { fsListShow } = this.state
	    if( onShow == null ){
		    return (
		        <a title="1" className={classnames({ selected: filter.action === selectedFilter },{ "table-cell": true })}
		           onMouseEnter={() => onMEShow(filter.action)}>		           
		           {title}		           
		        </a>
		    )	    	
	    }
	    return (
	        <a className={classnames({ selected: filter.action === selectedFilter },{ "table-cell": true })}
	           onClick={() => onShow(filter.action)}>
                {
                	filter.icons ?
                	   <i className={filter.icons}></i>
                	:
                	   null   
                }	           
	           {title}
	           {
	           	  filter.data ?
	           	     <i className="icons icons-20 drop-down-bg"></i>
	           	  :
	           	     null   
	           }
	           {
	           	  filter.data && fsListShow ?
	           	     <ul className="abs sublist">
	           	        {
	           	        	filter.data.map((item, index) => {
	           	        		return <li key={index}>{item.text}</li>
	           	        	})
	           	        }
	           	     </ul>
	           	  :
	           	     null   
	           }	           
	        </a>
	    )
	}	
	render() {
		const { options, arrow, mode } = this.props
		return <ul className="switch">
				   {
			            options.map(filter => {
			            	if( isEmpty(filter.data) ){
				            	return  <li className={filter.classes} key={filter.key}>
						            	    {this.renderFilterLink(filter)}
						            	    {
						            	    	filter.action === this.props.filter && arrow == 'bottom' ?
													<b className="arrow-bottom"><i className="bottom-arrow1"></i><i className="bottom-arrow2"></i></b>
												:
												    null				            	    	 
						            	    }
						            	</li>
					        } else {
				            	return  <li className={filter.classes} key={filter.key} onClick={this.showFsList.bind(this)}>
						            	    {this.renderFilterLink(filter)}
						            	    {
						            	    	filter.action === this.props.filter && arrow == 'bottom' ?
													<b className="arrow-bottom"><i className="bottom-arrow1"></i><i className="bottom-arrow2"></i></b>
												:
												    null				            	    	 
						            	    }
						            	</li>					        	
					        }    	
			            })
		           }
		       </ul>
	}
	componentDidMount() {
		document.body.addEventListener('click', this.oneBodyClick)
	}
	componentWillUnmount() {
		document.body.removeEventListener('click', this.oneBodyClick)
	}	
}
export default immutableRenderDecorator(Switch)
