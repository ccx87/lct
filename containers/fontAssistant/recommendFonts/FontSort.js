import React, { Component, PropTypes } from 'react'

import { MENU } from '../../../constants/DataConstant'
import { 
	MENU_ALL_CHECK, 
	MENU_COLLECT, 
	MENU_DOWNLOAD,
	SHOW_FONT_SORT_1,
	SHOW_FONT_SORT_2,
	SHOW_FONT_SORT_3,
	SHOW_FONT_SORT_4 
} from '../../../constants/TodoFilters'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { addArray, log } from '../../../constants/UtilConstant'
import ConfigInfo from '../../../constants/ConfigInfo'
import { FOUNDFONT_SORT_TAB } from '../../../constants/DataConstant'

import Switch from '../../../modules/Switch'
import Menu from '../../../modules/functionBarModel/Menu'
import CommonList from '../../../modules/CommonList'

class FontSort extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		filter: SHOW_FONT_SORT_1
    	};
    	log("FontSort");		
	}
  	handleShow(filter) {
  		log(filter)
  		this.setState({ filter })
  	}		
  	onGetFontListData(prevText, fontHeight, fontSize, typeNum, offset, fetchSize, requestNew) {
  	    this.state.initTimeout = window.setTimeout(function(){
  			this.props.actions.installedFontListData(prevText, fontHeight, fontSize, typeNum, offset, fetchSize, requestNew)
  		}.bind(this), 50)
  	}				
  render() {
	const { 
	    todos, 
	    actions, 
	    resize, 
	    menu,
	    type 
    } = this.props 
    const { filter } = this.state
	const hasData = todos.data != null && todos.data.list != null && todos.data.total != null ? true : false      	
    return (
	      <div className="font-sort">
	          <div className="sort-left">
	        	  <Menu 
	        	     todos={todos} 
	        	     actions={actions}
	        	     data={menu} />
	              <div className="content-list">
	                {
	                	hasData ?
                	        todos.data.total > 0 ?							                	
				                <CommonList 
				                     type={type} 
				                     todos={todos}
				                     actions={actions} 
				                     resize={resize} 
				                     less={86}/>
				            :
				               <DataNull />          
				        :
				           loadingHtml(true)            
	                }     
		          </div>	        	     
        	  </div>
        	  <div className="sort-right">
        	      <div className="sort-type">
        	          <div className="title">
        	              <a className="abs pn prev"><i className="icons icons-30 pn-prev-bg"></i></a>
        	              <Switch options={FOUNDFONT_SORT_TAB} filter={filter} onMEShow={this.handleShow.bind(this)}/>
        	              <a className="abs pn next"><i className="icons icons-30 pn-next-bg"></i></a>
        	          </div>
        	          <div className="conent-list">
        	              {
        	              	  FOUNDFONT_SORT_TAB.map((item, index) =>
        	              	      {
        	              	      	
        	              	      	let style_display = {
        	              	      		"display": "none"
        	              	      	}
        	              	      	if( filter === item.action ){
        	              	      		style_display = {
        	              	      			"display": "block"
        	              	      		}
        	              	      	}
        	              	      	const classes = item.action +" type-list"
		        	                return <div className={classes} key={index} style={style_display}>
				        	              	  <a className="active">{item.action}</a>
				        	                  <a>方正字体</a>
				        	                  <a>汉仪字体</a>
				        	                  <a>造字工房</a>
				        	              </div>
		        	              }        	              	  
        	              	  )
        	              }

        	          </div> 
        	      </div>
        	      <div className="sort-lang">
        	          <div className="title">
        	              <a className="text">语言</a>
        	          </div>
        	          <div className="conent-list">
        	              <div className="lang-list">
        	                  <a className="active">简体中文</a>
        	                  <a>蒙文</a>        	                  
        	                  <a>繁体中文</a>
        	                  <a>繁体+简体</a>
        	              </div>
        	          </div>        	          
        	      </div>
        	      <div className="sort-format">
        	          <div className="title">
        	              <a className="text">格式</a>
        	          </div>
        	          <div className="conent-list">
        	              <div className="format-list">
        	                  <a className="active">TTF</a>
        	                  <a>OTF</a>
        	                  <a>TTC</a>
        	                  <a>PSD</a>        	                  
        	              </div>
        	          </div>        	          
        	      </div>        	      
        	      
        	  </div>                  
	      </div>
    )
  }
  componentDidMount() {
		 this.onGetFontListData(
 	          ConfigInfo.previewFont.text, 
 	          ConfigInfo.fontSize.real_value, 
 	          ConfigInfo.fontSize.value, 
 	          this.props.type.value, 
 	          ConfigInfo.page.offset, 
 	          ConfigInfo.page.fetch_size, 
 	          1
 	      );						
  }
  componentWillUnmount() {
  } 	  
}
FontSort.defaultProps = {
	type:{
		search: "",
		text: "全部字体",
		value: 0
	},		
	menu: addArray(MENU, [MENU_ALL_CHECK, MENU_COLLECT, MENU_DOWNLOAD]) 
}
export default FontSort
