import React, { Component, PropTypes } from 'react'

import { FOUNDFONT_TAB } from '../../../constants/DataConstant'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { clientHeight } from '../../../constants/DomConstant'
import { log } from '../../../constants/UtilConstant'

import TagBar from '../../../modules/TagBar'

class FoundList extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("FoundList");		
	}			
  render() {
    return (
	      <div className="font-list">
              <TagBar />
              <ul className="list scllorBar_found" ref="clientHeight">
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/home.jpg" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/cn.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e1.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/home.jpg" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/cn.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e1.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li> 
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e2.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e1.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li> 
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e2.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
				  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/home.jpg" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/cn.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>                   
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e2.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e1.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li> 
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e2.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/e3.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
				  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/home.jpg" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>
                  <li>
                     <div className="item-info">
	                     <img className="img" src="../public/compress/temp/cn.png" alt="图片"/>
	                     <div className="abs top">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 add-single-font"></i>1234</div>
	                     </div>
	                     <div className="abs bottom">
	                         <div className="abs opt"></div>
	                         <div className="text"><i className="icons icons-18 create-user-bg"></i>可口可乐</div>
	                     </div>
                     </div>
                     <p className="item-name">晚霞</p>
                  </li>                                                                                                                                 
              </ul>
	      </div>
    )
  }
  componentDidMount() {
	const target = this
	clientHeight(this.refs.clientHeight,this.props.resize.h,84)
	$(".scllorBar_found").mCustomScrollbar({
		scrollInertia:550,
		theme:"dark-3",
		callbacks:{
		    onTotalScroll:function(){}
		}			
	})	
  }
  componentDidUpdate(nextProps, nextState) {
	 if(nextProps.resize.h !== this.props.resize.h){
		clientHeight(this.refs.clientHeight,this.props.resize.h,84,this.refs.clientHeight.firstChild)				
     }
  } 	
  componentWillUnmount() {
  } 	  
}
export default FoundList