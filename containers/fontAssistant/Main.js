import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { 
	MY_FONTS, 
	MISSING_FONTS,
	RECOMMEND_FONTS, 
	CREATE_SINGLE_FONTS, 
	SHOW_DIALOG_ALERT,
	SHOW_MANUAL_SCAN,
  SEARCH_MAIN 
} from '../../constants/TodoFilters'

import { WIMDOW_INITIALIZE_FONT_DB_REQUEST } from '../../constants/ActionsTypes'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { tableCellDom } from '../../constants/DomConstant'
import { ROUTES } from '../../constants/DataConstant'
import { log, isEmpty } from '../../constants/UtilConstant'

import MyFonts from './myFonts/MyFonts'
import MissingFonts from './missingFonts/MissingFonts'
import RecommendFonts from './recommendFonts/RecommendFonts'
import CreateSingleFonts from './createSingleFonts/CreateCommonFont'
import SearchMain from './searchFonts/SearchMain'

const doc = document
class Main extends Component {
	constructor(props) {
    	super(props);
    	this.state = {isTemp: null};
    	log("Main");		
	}	
  render() {
    const { route, defaultRoute } = this.props 
    return (
      <div className="main">
          {
            !defaultRoute ?
            	  route ?
      	          	route.menu === MY_FONTS ?
      	          	   <MyFonts 
                          {...this.props} />
      	          	:
      	          	route.menu === MISSING_FONTS ?
      	          	   <MissingFonts  
                          {...this.props} mode={1}/>
      	          	:
      	          	route.menu === RECOMMEND_FONTS ?
      	          	   <RecommendFonts  
                          {...this.props}/>
      	          	:          		
      	          	route.menu === CREATE_SINGLE_FONTS ?
      	          	   <CreateSingleFonts 
                          {...this.props}/>
      	          	:  
                    route.menu === SEARCH_MAIN ?              
      	          	   <SearchMain {...this.props}/>
                    :
                       null    
      	        : 
      	            null
            :
                defaultRoute.route && defaultRoute.route.menu === SEARCH_MAIN ?              
                    <SearchMain {...this.props} route={defaultRoute.route} subRoute={defaultRoute.subRoute}/>
                :
                defaultRoute.route && defaultRoute.route.menu === MISSING_FONTS ?
                    <MissingFonts {...this.props} route={defaultRoute.route} subRoute={defaultRoute.subRoute} mode={2}/>
                :
                    null                                     
          }
      </div>
    )
  } 
 getScan(time, option) {
     const data = {
  			type: SHOW_MANUAL_SCAN,
  			title: "扫描字体",
  			code: WIMDOW_INITIALIZE_FONT_DB_REQUEST,
        data: option ? option : null      	
     }
     try{
          //弹出层时关闭拖拽
          //使用场景在首页字体素材搜索页
          setTimeout(() => {
              window.asyncStopGetDragDropFileRequest()
          }, 500)
      }catch(e){}     
     setTimeout(() => {
		    this.props.actions.triggerDialogInfo(data)
     }, time)  	  
  }
  componentDidMount() {
     //询问本地数据库
     setTimeout(() => {
	       this.props.actions.queryInitializeteCompletedRequest()
     },20)    
  } 
  componentWillReceiveProps(nextProps) {
     const actions = this.props.actions,
           n_init_time = nextProps.inititlizeteLastUpdated,
           t_init_time = this.props.inititlizeteLastUpdated,
           n_init = nextProps.inititlizeteCompleted,
           t_init = this.props.inititlizeteCompleted;

     if((n_init_time && n_init_time !== t_init_time)||( nextProps.subRoute && this.props.subRoute && nextProps.subRoute.name !== this.props.subRoute.name && n_init && n_init.data && n_init.data.status == 1)){
          const n_initData = n_init.data;
          if( n_initData ){
              let status = n_initData.status;
              if( status == 1 && t_init && t_init.data.status == 3 ){
                  actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT, text: '扫描字体时出现致命错误，请重启链图云',auto: true,speed: 3000,statu: 0}) 
                  //status = 3
                  return;
              }
              if( status == 1 && t_init && t_init.data.status == 1 ){
                  status = 3
              }              
              if( status == 0 ){
                  if( this.state.isTemp == 1 ){
                       actions.triggerDialogInfo({
                          type: SHOW_MANUAL_SCAN, 
                          data: {out_time: 3}, 
                          title: "扫描字体", 
                          status: n_initData.status, 
                          defaultFn: () => {
                              //字体补齐拖拽
                              //使用场景在首页字体素材搜索页
                              if( this.props.actionsST ){
                                  this.props.actionsST.startGetDragDropFile('FONT') 
                              }                         
                          }
                        })                  
                  }
              }else if( status == 1 ){
                  this.state.isTemp = status
                  this.getScan(10)
              }else if( status == 2 ){
                  this.state.isTemp = status                
                  setTimeout(() => {
                      actions.initializeFontDBRequest()
                  }, 100)    
              }else if( status == 3 ){
                  setTimeout(() => {
                      actions.queryInitializeteCompletedRequest()
                  }, 800)
              }
          } 
     } 
     if( nextProps.fontDBLastUpdated && nextProps.fontDBLastUpdated !== this.props.fontDBLastUpdated ){
          const n_fDB = nextProps.fontDB;
          if( n_fDB && n_fDB.data ){
              if( n_fDB.data.status == 3 ){
                actions.queryInitializeteCompletedRequest()
              }else{
                actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "扫描失败，请重新扫描",auto: true,speed: 1500,statu: 0})
                  this.getScan(500)
              }
          }else{
            actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "扫描失败，请重新扫描",auto: true,speed: 1500,statu: 0})
            this.getScan(500)
          }
     }
  }    
}
const mapStateToProps = (state) => {
	return {
  		route: state.inIt.route,
  		subRoute: state.inIt.subRoute,
  		routeLastUpdated: state.inIt.routeLastUpdated,

  		inititlizeteCompleted: state.inIt.inititlizeteCompleted,
      inititlizeteLastUpdated: state.inIt.inititlizeteLastUpdated,

      fontDB: state.inIt.fontDB,
      fontDBLastUpdated: state.inIt.fontDBLastUpdated,

      downloadIds: state.inIt.downloadIds,
      addDownloadLastUpdated: state.inIt.addDownloadLastUpdated,

      downloadListData: state.inIt.downloadListData,
      downloadLastUpdated: state.inIt.downloadLastUpdated,
      
      downloadBeging: state.inIt.downloadBeging,
      downloadBegingLastUpdated: state.inIt.downloadBegingLastUpdated      
	}
}
export default connect(
  mapStateToProps
)(Main)
