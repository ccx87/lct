import React, { Component, PropTypes } from 'react'

import { FOUNDFONT_TAB } from '../../../constants/DataConstant'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { clientHeight } from '../../../constants/DomConstant'
import { log } from '../../../constants/UtilConstant'

import RankingTable from '../../../modules/tableModel/RankingTable'

class FontRanking extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("FontRanking");		
	}			
  render() {
    return (
	      <div className="font-ranking scllorBar_ranking" ref="clientHeight">
              <div className="ranking-item ranking-download">
                  <div className="title icons icons-300 ranking-download-bg">
                      <div className="abs text">8月1日更新</div>
                      <div className="download-btn abs">
                          <i className="icons icons-40 downloan-btn-bg"></i>
                      </div> 
                  </div>
                  <RankingTable />
                  <div className="fotter">
                      <a>查看全部  &gt;</a>
                  </div>
              </div>
              <div className="ranking-item ranking-collect">
                  <div className="title icons icons-300 ranking-collect-bg">
                      <div className="abs text">8月1日更新</div>
                      <div className="download-btn abs">
                          <i className="icons icons-40 downloan-btn-bg"></i>
                      </div> 
                  </div>
                  <RankingTable />
                  <div className="fotter">
                      <a>查看全部  &gt;</a>
                  </div>
              </div>
              <div className="ranking-item ranking-new-fonts">
                  <div className="title icons icons-300 ranking-new-font-bg">
                      <div className="abs text">8月1日更新</div>
                      <div className="download-btn abs">
                          <i className="icons icons-40 downloan-btn-bg"></i>
                      </div> 
                  </div>
                  <RankingTable />
                  <div className="fotter">
                      <a>查看全部  &gt;</a>
                  </div>
              </div>                            
	      </div>
    )
  }
  componentDidMount() {
	clientHeight(this.refs.clientHeight,this.props.resize.h,68)
	$(".scllorBar_ranking").mCustomScrollbar({
		scrollInertia:550,
		theme:"dark-3"			
	})		 						
  }
  componentDidUpdate(nextProps, nextState) {
	 if(nextProps.resize.h !== this.props.resize.h){
	 	if( this.props.resize.w <= 900 ){
	 		this.refs.clientHeight.style.textAlign = 'left'
	 	}else{
	 		this.refs.clientHeight.style.textAlign = 'center'
	 	}
		clientHeight(this.refs.clientHeight,this.props.resize.h,68,this.refs.clientHeight.firstChild)				
     }
  }   
  componentWillUnmount() {
  } 	  
}
export default FontRanking
