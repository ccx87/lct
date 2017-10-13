import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { MY_COMPUTER } from '../../constants/TextConstant'
import { showOrHideItem2 } from '../../constants/DomConstant'
import { SHOW_LOCAL_FOLDER_SCAN_SET, LOCAL_MATERIAL, LOCAL_FILE_CONTENT, LOCAL_FILE_TOTAL_PANELS } from '../../constants/TodoFilters'
import { log, getNavigation, isEmpty, addClass, removeClass, getNewRoute, routesBackLocal } from '../../constants/UtilConstant'

import SearchInput from '../smallModel/SearchInput'

let isClick = true,
    isNav = true;
const doc = document;    
class NavigationBar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            filter: false,
            routeText: null,
            infoList: [],
            hostIndex: -1,
            hiAt: 0,
            searchFileData: null           
        };
        this.oneBodyClick = this.oneBodyClick.bind(this)
      	log("NavigationBar");		
  	}		
    scanStartBtn(event){
        event.stopPropagation();
        event.preventDefault();
    }
    showInfoList(event) {
        event.stopPropagation();
        event.preventDefault();
        const sib_Elem = doc.getElementById('infoList');
        showOrHideItem2(sib_Elem, 150)      
    }     	
    infoMode(event){
        event.stopPropagation();
        event.preventDefault();      
        if( !this.state.filter ){
            this.setState({
                filter: true
            })
        }         
    }
    defaultDriveData () {
        return {file_name:MY_COMPUTER, dir: null, path: null, mode: 'drive',IDS: LOCAL_FILE_TOTAL_PANELS} 
    }
    routesTotalPanelsBtn(elem, event){//点击我的电脑时触发--返回盘符页面
        event.stopPropagation();
        event.preventDefault();
        elem['IDS'] = LOCAL_FILE_TOTAL_PANELS;
        const navData = getNavigation(this.props.route, elem),      
              data = {
                   route: {
                      menu: LOCAL_FILE_TOTAL_PANELS,
                      data: elem,
                      nav:{
                         fore: navData.fore,
                         now: navData.now,
                         after: navData.after
                      },
                      host: !isEmpty(elem.path) ? elem.path.split('\\') : [elem.file_name]
                   }
              };
        this.props.actions.getInItRoute(data);        
    }
    routesFileRefreshBtn(event) {
        //刷新按扭
        const route = this.props.route,
              mode = 'path';
        route.data['is_refresh'] = true;      
        this.routesFileBtn(route.data,mode)
    }
    routesFileBtn(parameter, mode, event){//点击块状地址、下拉地址、重新加载时触发
        if( isEmpty(parameter) ){
            return false
        }
        if( event ){
            event.stopPropagation();
            event.preventDefault();
        }        
        if( isClick ){
            isClick = false
            setTimeout(() => {
                isClick = true
            },500)
            const treefilterDom = doc.getElementById('tree-filter-mode');
            let treefilter = 0,
                data = null;
            if( treefilterDom ){
                treefilter = parseInt(treefilterDom.getAttribute('data-treefilter'));
            }            
            if( parameter.constructor == Object ){
                data = {
                    route: this.props.route
                }
                data.route.data = parameter
            }else{
                let route = this.props.route;
                if( mode ){
                    data = getNewRoute(route,parameter, mode);
                } else {
                    data = getNewRoute(route,parameter);
                }   
            }
           if( treefilter == 2 ){
                data.route.data['get_filter'] = treefilter
            }
            this.props.actions.getInItRoute(data);            
            this.oneBodyClick();            
        }
        return false               
    }   
    routesNavBtn(temp, event){//点击前进、后退时触发
        if( isNav ){
            isNav = false
            setTimeout(() => {
                isNav = true
            },500)
            if( event ){       
                event.stopPropagation();
                event.preventDefault();
            }
            const route = this.props.route,
                  navData = getNavigation(route, null, temp);
            let data = null;
            if( navData ){  
                data = {
                    route: {
                        menu: navData.now ? navData.now.IDS : route.menu,
                        data: navData.now ? navData.now : route.data,
                        nav:{
                            fore: navData.fore ? navData.fore : route.nav.fore,
                            now: navData.now ? navData.now : route.nav.now,
                            after: navData.after ? navData.after : route.nav.after 
                        },
                        host: !isEmpty(navData.now) && !isEmpty(navData.now.path) ? navData.now.path.split('\\') : [MY_COMPUTER]             
                    }
                }
            }else{
                data = {
                    route: route
                }
            }
            this.props.actions.getInItRoute(data); 
        }
        return false               
    }
    routesInputBtn(event){//地址栏变成输入框时按enter键触发
        const keyCode = window.event ? event.keyCode : event.which,
              treefilterDom = doc.getElementById('tree-filter-mode');
        if(keyCode == 13) {
            const input_Val = doc.getElementById('inputMode').value,
                  route = this.props.route;
            if( !isEmpty(input_Val) ){
                const data = getNewRoute(route,input_Val);
                if( treefilterDom ){
                    const treefilter = parseInt(treefilterDom.getAttribute('data-treefilter'));
                    if( treefilter == 2 ){
                        data.route.data['get_filter'] = treefilter;
                    }
                } 
                this.props.actions.getInItRoute(data);
                this.setState({
                    routeText: input_Val
                })                
            }
        }
        return false;         
    }
    routesBackLocal(event) {//点击返回上一级文件夹
        event.stopPropagation();
        event.preventDefault();
        const route = this.props.route,
              newpath = routesBackLocal(route),
              data = getNewRoute(route,newpath);
        this.props.actions.getInItRoute(data);            
    }
    textModeLen() {
        //计算面包屑的长度。
        if( !this.state.filter ){
            if( $('.info-line').length > 0 ){
                //info_w扣除40px,让条目栏最右的时候有空隙
                const info_w = $('.info-line').width() - 40,
                      w_array = [],
                      $p_elem = $('.visible-hidden.host-hidden').find('p'),
                      target = this
                if( $p_elem.length > 0 ){
                    //获取每个条目栏的宽度
                    $p_elem.each((indexP, elemP) => {
                        w_array.push({index: indexP, width: $(elemP).width()}) 
                    })
                }
                if( w_array.length > 0 ){
                    //颠倒数组中元素的顺序
                    w_array.reverse();
                    let _w = 0,
                        hasmore = false;
                    //颠倒后每个条目栏开始相加，如果相加后大于info_w，则调整面包屑的长度    
                    for( let i = 0; i < w_array.length; i++ ){
                        _w += w_array[i].width;
                        if( _w >= info_w ){
                            hasmore = true
                            target.setState({hostIndex: w_array[i].index})
                            break;                            
                        }
                    }
                    if( !hasmore ){
                        //重新初始化
                        target.setState({hostIndex: -1}) 
                    }
                }
            } 
        }        
    }
    oneBodyClick(event) {
        if( event && $(event.target).closest('.navigation-top.unnav').length > 0 ){
            return;
        }
        if( this.state.filter ){
            this.setState({
                filter: false
            })      
        }
        const sib_Elem = doc.getElementById('infoList');
        if( sib_Elem && sib_Elem.style.display == 'block' ){
            showOrHideItem2(sib_Elem, 150)         
        }
    } 
    renderNavBarList(route, forebg, afterbg) {
        return  <p className="p-line flex flex-c">
                        <span className="flex flex-c flex-c-c">
                            {
                                forebg.indexOf('active') > -1 ?
                                    <i className={forebg} onClick={this.routesNavBtn.bind(this, 0)}></i>
                                :
                                    <i className={forebg}></i> 
                            }
                        </span>
                        <span className="flex flex-c flex-c-c">
                            {
                                afterbg.indexOf('active') > -1 ? 
                                   <i className={afterbg} onClick={this.routesNavBtn.bind(this, 1)}></i>
                                :
                                   <i className={afterbg}></i>
                            }
                        </span>
                        <span style={{"display":"none"}} className="flex flex-c flex-c-c">
                            <i className="icons icons-10 list-more-bg"></i>
                        </span>
                        {
                            route && route.host && route.host.length > 0 && route.host[0] != MY_COMPUTER ?
                                <span className="flex flex-c flex-c-c">
                                    <i className="icons-local-material icons-20 back-local-bg"
                                       onClick={this.routesBackLocal.bind(this)}>
                                    </i>
                                </span> 
                            :
                                null                           
                        }
                    </p>
    }
    renderInputMode() {
        return <div className="input-mode flex flex-c" onKeyDown={this.routesInputBtn.bind(this)}>
                    <input type="text" id="inputMode" className="info-input col-0"/>
               </div>        
    } 
    renderSearchMode(route) {
        const data = route.data;
        return  <div className="search">
                    <p className="info-item flex-in flex-c flex-item-gsb-0"
                       onClickCapture={this.routesFileBtn.bind(this,data.file_name,'search')}>
                       “{
                            !isEmpty(data.volume_name) ?
                               data.volume_name
                            :
                            !isEmpty(data.old_file_name) ?
                               data.old_file_name
                            :
                               data.file_name         
                        }
                        ” 中的搜索结果
                       <i className="icons icons-10 list-more-bg2"></i>
                    </p>
                </div>        
    }
    renderTextModeVisHide(route) {
        return  <div className="visible-hidden abs host-hidden">
                    <p className="info-item flex-in flex-c flex-item-gsb-0">
                        {MY_COMPUTER}
                        <i className="icons icons-10 list-more-bg2"></i>
                    </p>                                        
                    {
                        route && route.host && route.host.length > 0 ?
                            route.host.map((item, index) => {
                                if( isEmpty(item) || item == MY_COMPUTER ){
                                    return null
                                }
                                const dlArray = this.getVolumeName(item);
                                return  <p key={index} className="info-item flex-in flex-c flex-item-gsb-0">
                                            { dlArray && dlArray.length > 0 ? dlArray[0].volume_name : item }
                                            <i className="icons icons-10 list-more-bg2"></i>
                                        </p>
                            })
                        :
                            null    
                    }                                    
                </div>                
    }
    renderTextModeOne(route, dirveData, hostIndex) {
        let supText = '';       
        return  <div className="text-mode flex flex-c">
                    <p className="info-item flex-in flex-c flex-item-gsb-0"
                     onClick={this.routesTotalPanelsBtn.bind(this,dirveData)}>
                        {MY_COMPUTER}
                        <i className="icons icons-10 list-more-bg2"></i>
                    </p>                                        
                    {
                        route && route.host && route.host.length > 0 ?
                            route.host.map((item, index) => {
                                if( isEmpty(item) || item == MY_COMPUTER ){
                                    return null
                                }
                                if( index == 0 ){
                                    supText += item;
                                }else{
                                    supText += "\\"+ item;
                                    if( isEmpty(route.host[index-1]) ){
                                        supText = "\\" + supText;
                                    }                                    
                                }
                                const dlArray = this.getVolumeName(item);                             
                                return  <p key={index} data-path={supText} className="info-item flex-in flex-c flex-item-gsb-0"
                                         onClickCapture ={this.routesFileBtn.bind(this, supText,'path')}>
                                            { dlArray && dlArray.length > 0 ? dlArray[0].volume_name : item }
                                            {
                                                index == route.host.length -1 ?
                                                    route.data && route.data.file_name == item && !route.data.is_empty ?
                                                        <i className="icons icons-10 list-more-bg2"></i>
                                                    : 
                                                        null
                                                :
                                                    <i className="icons icons-10 list-more-bg2"></i>    
                                            }                                                                    
                                        </p>
                            })
                        :
                            null    

                    }
                </div>        
    }
    renderTextModeTwo(route, dirveData, hostIndex) {
        let supulText = '',
            supText = '';            
        return  <div className="text-mode flex flex-c">
                    <div className="host-more flex-in flex-c flex-item-gsb-0">
                        <i className="icons-local-material icons-20 host-more-bg">
                        </i>
                        <ul className="hm-ul abs">
                            <li className="info-item flex flex-c" onClick={this.routesTotalPanelsBtn.bind(this,dirveData)}>
                                <i className="icons-local-material icons-20 nav-home-bg"></i>
                                {MY_COMPUTER}
                            </li>
                            {
                                route && route.host && route.host.length > 0 ?
                                    route.host.map((item, index) => {
                                        if( isEmpty(item) || item == MY_COMPUTER ){
                                            return null
                                        }
                                        if( index == 0 ){
                                            supulText += item;
                                        }else{
                                            supulText += "\\"+ item;
                                            if( isEmpty(route.host[index-1]) ){
                                                supText = "\\" + supText;
                                            }                                            
                                        }
                                        const dlArray = this.getVolumeName(item);                                         
                                        if( index < hostIndex ){
                                            return  <li key={index} data-path={supulText} className="info-item flex flex-c"
                                                        onClickCapture ={this.routesFileBtn.bind(this,supulText,'path')}>
                                                        <i className="icons-local-material icons-20 nav-home-bg"></i>
                                                        { dlArray && dlArray.length > 0 ? dlArray[0].volume_name : item }
                                                    </li>
                                        }else{
                                            return null
                                        }        
                                    })
                                :
                                    null    
                            }                                                    
                        </ul>
                    </div>                                        
                    {
                        route && route.host && route.host.length > 0 ?
                            route.host.map((item, index) => {
                                if( isEmpty(item) || item == MY_COMPUTER ){
                                    return null
                                }
                                if( index == 0 ){
                                    supText += item;
                                }else{
                                    supText += "\\"+ item;
                                    if( isEmpty(route.host[index-1]) ){
                                        supText = "\\" + supText;
                                    }                                    
                                }
                                const dlArray = this.getVolumeName(item);                                
                                if( index >= hostIndex ){
                                    return  <p key={index} data-path={supText} className="info-item flex-in flex-c flex-item-gsb-0"
                                             onClickCapture ={this.routesFileBtn.bind(this,supText,'path')}>
                                                { dlArray && dlArray.length > 0 ? dlArray[0].volume_name : item }
                                                {
                                                    index == route.host.length -1 ?
                                                        route.data && route.data.file_name == item && !route.data.is_empty ?
                                                            <i className="icons icons-10 list-more-bg2"></i>
                                                        : 
                                                            null
                                                    :
                                                        <i className="icons icons-10 list-more-bg2"></i>    
                                                }
                                            </p>
                                }else{
                                    return null
                                }        
                            })
                        :
                            null    

                    }
                </div>                
    }  
    renderInfoList(infoList) {
        return  <div className="abs info-list" id="infoList">
                    <ul className="down-ul col-0">                           
                        {
                            infoList && infoList.length > 0 ?
                                infoList.map((item, index) => {
                                    return <li key={index} className="flex flex-c" onClickCapture ={this.routesFileBtn.bind(this,item,'path')}>
                                               <i className="icons-local-material icons-20 nav-home-bg"></i>
                                               {item}
                                           </li>    
                                }) 
                            :
                                null
                        }
                    </ul>
                </div>                
    }
    getVolumeName(path) {
        const files = this.props.files,
              dlData = files.driveLetter && files.driveLetter.data ? files.driveLetter.data : [];
        return dlData.filter((dl) => dl.path === path)
    }
    render() {
        const { route, type } = this.props
        const { filter, infoList, hostIndex } = this.state
        const dirveData = this.defaultDriveData();
        let forebg = 'icons-local-material icons-20 nav-prev nav-prev-bg',
            afterbg = 'icons-local-material icons-20 nav-next nav-next-bg',
            dbstyle = null,
            searchtype = {}; 
        if( route ){
            if( route.host && route.host.constructor === Array ){
                if( route.host[0] != MY_COMPUTER ){
                    //dbstyle = {'width':'100px'}
                }else{
                    //dbstyle = {'width':'80px'}
                }
                const lastHost = route.host[route.host.length-1],
                      getVn = this.getVolumeName(lastHost);
                if( getVn && getVn.length > 0 ){                 
                    searchtype.search = type.search +' “'+ getVn[0].volume_name +'”'
                }else{
                    searchtype.search = type.search +' “'+ lastHost +'”'
                }
            }
            if( route.nav ){
                if( route.nav.fore && route.nav.fore.length > 0 ){
                    forebg += ' active'
                }
                if( route.nav.after && route.nav.after.length > 0 ){
                    afterbg += ' active'
                }
            }
        }   
        return (
    	      <div className="navigation-top flex flex-c unnav">
                <div className="nav-db flex flex-c flex-item-gsb-0" style={dbstyle}>
                     {
                         this.renderNavBarList(route, forebg, afterbg)
                     }
                </div>
                <div className="nav-info flex">
                    <div className="info-con flex col-0">
                        <div className="info-mode flex flex-c flex-c-c flex-item-gsb-0">
                            {
                                route && route.data && route.data.mode == 'search' ?
                                    <i className="icons icons-20 nav-search-bg"></i>
                                :
                                    !filter ?
                                        <i className="icons-local-material icons-20 nav-home-bg"></i>
                                    :
                                        <i className="icons-local-material icons-20 nav-home-bg2"></i>    
                            }
                        </div>
                        <div className="info-line flex flex-c" onClick={this.infoMode.bind(this)}>
                            {
                                route && route.data && route.data.mode == 'search' ?
                                    !filter ?
                                        this.renderSearchMode(route)
                                    :
                                        this.renderInputMode()                                             
                                :
                                    <div className="path" style={{"width":"100%"}}>
                                        {this.renderTextModeVisHide(route)}
                                        {
                                            !filter ?
                                                hostIndex == -1 ?
                                                    this.renderTextModeOne(route, dirveData, hostIndex)
                                                :
                                                    this.renderTextModeTwo(route, dirveData, hostIndex)
                                            :
                                                    this.renderInputMode()
                                        }                                    
                                    </div>
                            }

                        </div>
                        <div style={{"display":"none"}} className="info-option flex flex-c flex-c-c flex-item-gsb-0" onClick={this.showInfoList.bind(this)}>
                            <i className="icons icons-10 list-more-bg"></i>
                        </div>
                        <div className="info-refresh flex flex-c flex-c-c flex-item-gsb-0" onClickCapture ={this.routesFileRefreshBtn.bind(this)}>
                            <i className="icons icons-20 nav-refresh-bg"></i>
                        </div>                                                                                                
                    </div>
                    {this.renderInfoList(infoList)}
                </div>
                <div className="file-search flex-item-gsb-0">
                    <SearchInput 
                       actions={this.props.actions} 
                       type={searchtype} 
                       mode={LOCAL_MATERIAL} 
                       route={route}/>
                </div>
    	      </div>
        )
    }
    componentDidMount() { 
        doc.body.addEventListener('click', this.oneBodyClick)       
    }
    componentWillReceiveProps(nextProps){
        log("NavigationBar---componentWillReceiveProps")
        log(nextProps)
        log(this.props)        
        if( nextProps.files && nextProps.files.filesLastUpdated !== this.props.files.filesLastUpdated ){
            const filesData = nextProps.files.filesData;
            //1地址栏手动输入时处理
            if( !isEmpty(this.state.routeText) ){
                if( filesData && filesData.error_code == 0 ){
                    this.state.infoList.unshift(this.state.routeText);
                    this.setState({
                        infoList: this.state.infoList,
                        routeText: null,
                    })
                    this.oneBodyClick();                     
                }else{
                    this.setState({
                        routeText: null
                    })                    
                }
            }                    
            //2地址发生变化时计算一下地址栏条目
            this.textModeLen()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }	
    componentDidUpdate(nextProps, nextState) {
        //手动输入地址
        if( this.state.filter ){
            const inputMode = doc.getElementById('inputMode'); 
            if( this.props.route && this.props.route.host ){
                let host_val = '';
                this.props.route.host.map((item, index) => {
                    if( index == 0 ){
                        host_val += item
                    }else{
                        host_val += "\\"+ item
                    }
                })
                inputMode.value = host_val;
                inputMode.focus();
                inputMode.select();                  
            }           
        } 
        //界面大小发生变化时计算一下地址栏条目
        if( this.props.resize.w !== nextProps.resize.w ){
            this.textModeLen()
        }      
    }
    componentWillUnmount() {
        doc.body.removeEventListener('click', this.oneBodyClick)
    }     
}
NavigationBar.defaultProps = {
    type: {
        search: '搜索'
    }
}
export default immutableRenderDecorator(NavigationBar)