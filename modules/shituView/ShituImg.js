import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'

import { SEARCH_ROUTES, FORMAT_TYPE ,IMG_TYPE_CONTENT,JIN_CHAN,IMG_TYPE_JPG,FILE_TONE, 
         IMG_CONTAIN_OUTWARD_COLOR, SHITU_MODE, GET_REGEX_MATCH, CHANGE_RANGE } from '../../constants/DataConstant'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { clientHeight,absVerticalCenter } from '../../constants/DomConstant'
import { dragDrop, isEmpty, log, getMousePos, getmCustomScrollbar2, getmCustomScrollbar4, 
         throttle, getEncodeURIComponentPath, cloneObj, getCss, regexStr } from '../../constants/UtilConstant'
import {SHOW_DIALOG_ALERT, DOWNLOAD_NG_FILE} from '../../constants/TodoFilters'
import Common from './common'

class ShituImg extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
            mainColor: null, //原图的主要颜色数组
            restoreColor: IMG_CONTAIN_OUTWARD_COLOR.outward, //外观与颜色选项卡。2外观相似，3外观和颜色都相似
            imgTypeAll: [], //过滤后的格式种类
            imgType: FORMAT_TYPE[0], //当前选择的格式
            textImg: null, //文字搜索容器
            containImg: null, //包含的列表数组
            outwardColorImg: null, //外观与颜色相似的列表数组
            outwardImg: null, //外观相似的列表数组
            ngGroupData: null, //邻居分组列表
            shituMode: SHITU_MODE.text,
            keyWord: '',
            shituRange: CHANGE_RANGE.loca            
    	}
  	}	
    renderListHtml(elem, index) {
        //如果没有格式返回，则从文件名中获取格式
        let file_type_sp = elem.file_type;
        if( isEmpty(file_type_sp) && !isEmpty(elem.file_name) ){
            //正则--获取最后一个后缀
            const type_arr = regexStr(elem.file_name, GET_REGEX_MATCH.last_suffix);
            file_type_sp = type_arr ? type_arr[type_arr.length-1] : null;
        }
        const imgSrc = getEncodeURIComponentPath(elem);
        const noPath = isEmpty(elem.thumb_image) || isEmpty(elem.thumb_image.path) || ( elem.thumb_image.path.constructor == Array && isEmpty(elem.thumb_image.path[0]) );
        let liClass = 'format-img flex-in flex-c flex-c-c flex-dir-column';
        if( noPath ){
            liClass += ' default-format-img'
        }
        //this.downloadImage(imgSrc)
        return  <li key={index} className={liClass}>
                    <div className='img-box'>
                        {
                            elem.is_exist == false ?
                                <img src='./compress/img/noexite.png' className='no-exite' />
                            :
                                null
                        }
                        <div className='img-center flex flex-c flex-c-c'>
                            {
                                noPath ?
                                    <img src={imgSrc} alt={elem.file_name} style={{"maxHeight": "90px"}}/>
                                :
                                    <img src={imgSrc} alt={elem.file_name}/>   
                            }
                        </div>
                        <div className='img-infoBox'  onClick={this.previewImg.bind(this,elem.path)}>
                            <span className="abs opt"></span>
                            <div className="text">
                                {
                                    this.state.shituRange.value === CHANGE_RANGE.wide.value ?
                                        <p className="font-type">
                                            <span style={{'display': 'block'}}>
                                                价格：￥{elem.price}
                                            </span>
                                        </p>
                                    :
                                        null                                        
                                }
                                {
                                    this.state.shituRange.value === CHANGE_RANGE.neighbor.value ?
                                        <span>
                                            IP：{elem.local_ip ? elem.local_ip : '--'}
                                        </span>
                                    :
                                        null  
                                }
                                <p className="font-type">
                                    <span>
                                        名称：{elem.file_name ? elem.file_name : '--'}
                                    </span>
                                </p>
                                <p  className='font-type' >
                                    <span>
                                        格式：{file_type_sp ? file_type_sp : '--'}
                                    </span>
                                </p>
                                {
                                    !isEmpty(elem.user_name) ?
                                        <p  className='font-type' >
                                            <span>
                                                用户名：{elem.user_name}
                                            </span>
                                        </p>
                                    :
                                        null                                        
                                }
                                {
                                    this.state.shituRange.value === CHANGE_RANGE.loca.value ?
                                        elem.is_exist == false ?
                                            <p  className='font-type' >
                                                <span className='orange'>原文件不存在</span>
                                            </p>
                                        :
                                        noPath ?
                                            <p className="font-type default" style={{"marginTop": "5px"}}>
                                                <span className="orange">缺少预览图，可重新扫描生成预览图</span>
                                            </p>
                                        :                                            
                                            <button className='info-btn' onClick={this.openFileLocation.bind(this,elem.path)}>
                                                <i className='shitu-icon icons-20 file-opt'></i>
                                                <span>打开文件位置</span>
                                            </button>
                                    :
                                    this.state.shituRange.value === CHANGE_RANGE.neighbor.value ?
                                        elem.is_exist == false ?
                                            <p  className='font-type' >
                                                <span className='orange'>原文件不存在</span>
                                            </p>
                                        :
                                            noPath ?
                                                <div>
                                                    <p className="font-type default" style={{"marginTop": "5px"}}>
                                                        <span className="orange">缺少预览图</span>
                                                    </p>
                                                    <button className='info-btn' onClick={this.downloadNgFile.bind(this, elem)}>
                                                        <i className='shitu-icon icons-20 download-opt'></i>
                                                        <span>下载</span>
                                                    </button>                                                    
                                                </div>
                                            :                                         
                                                <button className='info-btn' onClick={this.downloadNgFile.bind(this, elem)}>
                                                    <i className='shitu-icon icons-20 download-opt'></i>
                                                    <span>下载</span>
                                                </button>
                                    :
                                    this.state.shituRange.value === CHANGE_RANGE.wide.value && elem.is_exist ?
                                        <button className='info-btn' onClick={() => {this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "此功能正在开发中",auto: true,speed: 3000,statu: 0})}}>
                                            <i className='shitu-icon icons-20 pay-opt'></i>
                                            <span>购买</span>
                                        </button>
                                    :
                                        null                                                                                        
                                }
                            </div>
                        </div>
                    </div>                                                                                                                                           
                </li>
    }
    renderNoDataHtml(text) {
        return  <div className="no-data1 flex flex-c flex-c-c" style={{"position": "absolute","top": "50%","width": "100%","marginTop": "-20px"}}>
                    <img src='compress/img/no_search.png'/>
                    <span ref="searchTypeText" style={{"marginLeft":"5px"}}> {text}</span>
                </div>        
    }
  	render() {
  	   	const { containImg, outwardColorImg, outwardImg, restoreColor, 
                imgType, imgTypeAll, mainColor, shituMode, textImg, keyWord, shituRange, ngGroupData } = this.state
        const { shituResultData } = this.props
        let imgSrc = './compress/img/photofail.png', total = 0, size = '--', times = '--', 
            classes = 'icons-14 outer-circle flex flex-c flex-c-c', classloca = classes, classng = classes;
        if( shituResultData ){
            if( shituResultData.thumb_image ){
                imgSrc = shituResultData.thumb_image
            }
            if( shituResultData.file_disp_size ){
                size = shituResultData.file_disp_size
            }
            if( shituResultData.feature_update_time ){
                times = shituResultData.feature_update_time
            }
            total = shituResultData.feature_total
        } 
        if( shituRange.value === CHANGE_RANGE.loca.value ){
            classloca += ' active'
        }else if( shituRange.value === CHANGE_RANGE.neighbor.value ){
            classng += ' active'
        }
    	return (
            <div className='shitu-resultBox' style={{"width": "100%", "height": "100%"}}>
                {/* 原图拖拽区块--fixed绝对区块 */}
                {
                    shituMode === SHITU_MODE.image.path || shituMode === SHITU_MODE.image.base64 ? 
                        <div className="fixed-box">
                            <span className="abs"></span>
                            <span className="alert-inner">您查找的图片（可拖拽）</span>
                            <span className="img-box  flex flex-c flex-c-c"  ref="verticalCenter">
                                <img src={imgSrc} />
                            </span>
                        </div>
                    :
                        null                        
                }

                {/* 头部区块 */}
                <div  className='info-title1  flex flex-c'>
                    <div className='info-title'>
                        <span className='search-return shitu-icon' onClick={this.backSearch.bind(this)}> </span>
                    </div>
                    <Common {...this.props} shituRange={shituRange} page={"SHITU_IMG"}/>
                    <div className="info-range filter-line flex flex-c-c">
                        <div className="col-3" style={{"marginRight":"5px"}}>搜索范围：</div>
                        <div className="fl-item" style={{"marginRight":"10px"}}>
                            <a className={shituRange.value === CHANGE_RANGE.loca.value ? "active" : null} 
                               onClick={this.changeRange.bind(this, CHANGE_RANGE.loca)}>
                                <i className={classloca}>
                                    <em className="icons-6 inner-circle"></em>
                                </i>
                                <span>搜本机</span>
                            </a>
                        </div>
                        <div className="fl-item">
                            <a className={shituRange.value === CHANGE_RANGE.neighbor.value ? "active" : null} 
                               onClick={this.changeRange.bind(this, CHANGE_RANGE.neighbor)}
                               onMouseEnter={this.moveEvents.bind(this, 1)}
                               onMouseLeave={this.moveEvents.bind(this, 0)}>
                                <i className={classng}>
                                    <em className="icons-6 inner-circle"></em>
                                </i>
                                <span>搜邻居</span>
                            </a>
                            <i style={{"position":"absolute","right":"-30px", "top":"-2px"}} className="shitu-icon icons-20 select-prob"></i>
                            <div className="hide-msg col-6">
                                搜索同一局域网下登录链图云的用户电脑素材
                            </div>
                        </div>                        
                    </div>
                    { 
                        1 > 1 ?
                            imgTypeAll.length == 0 ?
                                <span className="search-totle">
                                    在 
                                    <span className="search-num">
                                        {total}
                                    </span> 
                                    个可识图素材中未找到相似素材
                                </span>
                            :
                            <span className="search-totle">
                                在 
                                <span className="search-num">
                                    {total}
                                </span> 
                                个可识图素材中，共找到 
                                <span className="search-num">
                                    {imgTypeAll[0].total}
                                </span> 
                                个相似素材
                            </span>
                        : 
                            null    
                    }
                </div>
                {/* 内容区块 */}
                <div className="img-list-table" ref="clientHeight" style={{"height":"calc(100% - 51px)"}}>
                    <div className='result-content'>
                        {/* 原图信息区块 */}
                        {

                            shituMode === SHITU_MODE.text ?
                                <div className='search-imgResult' style={{"height": "25px", "display":"none"}} id='search-imgResult' ref="searchimgResult">
                                    <div className='photofail'>
                                        <div className='ssu-line'>
                                            <div>
                                                <span className='tit tit-word'>关键字“{keyWord}”的搜索结果</span>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>                                    
                            :
                                <div className='search-imgResult' style={{"height": "120px"}} id='search-imgResult' ref="searchimgResult">
                                    <div className='photofail'>
                                        <div className='photofail-inner'>
                                            <div className=' flex flex-c flex-c-c' style={{'height':'100%'}}>
                                                <img src={imgSrc} />
                                            </div>
                                        </div>
                                        <div className='ssu-line'>
                                            <div>
                                                <span className='tit tit-txt'>原图尺寸：</span><span>{size}</span>
                                            </div>
                                            {
                                                shituResultData && shituResultData.tonality1 === 0 ?
                                                    null
                                                :   
                                                    <div>
                                                        <span className='tit tit-txt'>  主色调：</span>
                                                        {
                                                            mainColor && mainColor.length > 0 ?
                                                                mainColor.map ((elem,index) => {  
                                                                    var singleClass = "tone-example-" + elem;
                                                                    var borderClass="sp-orgurl-item tone-border-"+elem
                                                                    var txtClass = "col-text",
                                                                        selectClass = "",
                                                                        icon_b = "icon-b";                                    
                                                                    if(elem == 9 || elem == 10) {
                                                                        txtClass = "col-text col-6";
                                                                    }else{
                                                                        txtClass = "col-text";
                                                                    }
                                                                    const newData = FILE_TONE.filter((item) => {
                                                                        return item.value == elem;
                                                                    });
                                                                    return <span className={borderClass} title={newData && newData.length ?newData[0].subText:'无'} key={index}>
                                                                               <a href="javascript:void(0)" ></a>
                                                                               <em className={singleClass}><i className="icon-b"></i></em>
                                                                               <span className={txtClass}>{newData && newData.length ?newData[0].subText:'无'}</span>
                                                                           </span>
                                                                })
                                                            :
                                                                '暂无主色调'
                                                        }
                                                    </div>                                                     
                                            }
                                        </div>
                                    </div>
                                </div>

                        }
 
                        {/* 筛选栏区块 */}  
                        <div className='format-box clearfix tab-div flex flex-l'>
                            <div className="fb-left flex flex-l flex-item-gsb-1">
                                <span className='format-type1 flex flex-c flex-item-gsb-0'>
                                    <i style={{"marginRight":"5px"}} className="shitu-icon change-format-bg"></i>
                                    格式筛选：
                                </span>
                                <ul className="spi-r-ul">
                                    {
                                        imgTypeAll.map((elem, index) => {                          
                                            var singleClass = "format-example-" + elem.value,
                                                selectClass = "";
                                            if( imgType && imgType.value == elem.value ){
                                                selectClass += "active";
                                            }
                                            return <li key={index} className={selectClass} onClick={this.formatSelection.bind(this, elem)}>
                                                      <span className={singleClass}>
                                                          <span className="format-text">{elem.subText}</span>
                                                          <span>（{elem.total}）</span>
                                                      </span>
                                                   </li>
                                        })
                                    }  
                                </ul>
                            </div>
                            <div className='fb-right flex-item-gsb-0 flex flex-c' style={{"paddingRight":"10px"}}>
                                <p className="format-type1">本地数据更新时间：
                                {times}
                                </p>
                            </div>
                        </div>
                        {/* 结果列表区块 */}
                        {
                            /* 本地和邻居文字搜索 */ 
                            textImg ?
                                <div className="content">
                                    <div className="con-item">                                    
                                        {
                                            Array.isArray(textImg) && textImg.length > 0 ?
                                                <ul className="clearfloat imgData">
                                                    {
                                                        textImg.map((elem,index) => { 
                                                            return this.renderListHtml(elem, index)
                                                        })          
                                                    }                                                   
                                                </ul>
                                            :
                                                this.renderNoDataHtml('在可识图素材中未找到包含关键字的素材')                                                                              
                                        }
                                    </div>
                                </div>
                            :
                                /* 邻居图片搜索 */
                                ngGroupData ?
                                    <div className="content" style={ngGroupData.length == 0 ? {"height": "calc(100% - 200px)"} : null}>
                                    {
                                        ngGroupData.length > 0 ?
                                            ngGroupData.map((item, index) => {
                                                return  <div className="con-item" key={index}> 
                                                            <p className="item-title flex flex-c">
                                                               <i className="base-icon icon-25 icon-display-none flex-item-gsb-0" style={{"cursor": "pointer"}} onClick={this.bolckNone.bind(this)}></i>
                                                               <span className="sp-text flex-item-gsb-0"><span>邻居</span><span>{item[0].user_name}</span><span>({item.length})</span></span>
                                                               <span className="sp-line flex-item-gsb-1"></span>
                                                            </p>
                                                            <ul className='clearfloat imgData'> 
                                                                {
                                                                    item.map((elem, idx) => {
                                                                        return this.renderListHtml(elem, idx)
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                            })
                                        :
                                            <div className="con-item" style={{"height": "100%", "position":"relative"}}>
                                                {this.renderNoDataHtml('未搜索到邻居相似的素材')}                                                 
                                            </div>    
                                    }    
                                    </div>
                                :
                                    /* 本地图片搜索 */
                                    containImg && outwardImg && outwardColorImg ?
                                        <div className="content">
                                            {
                                                Array.isArray(containImg) && containImg.length > 0 ?
                                                    <div className="con-item"> 
                                                        <p className="item-title flex flex-c">
                                                           <i className="base-icon icon-25 icon-display-none flex-item-gsb-0" style={{"cursor": "pointer"}} onClick={this.bolckNone.bind(this)}></i>
                                                           <span className="sp-text flex-item-gsb-0">包含查询图片的素材({containImg ? containImg.length : 0})</span>
                                                           <span className="sp-line flex-item-gsb-1"></span>
                                                        </p>
                                                        <ul className='clearfloat imgData'> 
                                                            {
                                                                containImg.map((elem,index) => { 
                                                                    return this.renderListHtml(elem, index)
                                                                })          
                                                            }  
                                                        </ul>
                                                    </div>
                                                :
                                                    null
                                            }
                                            {
                                                Array.isArray(outwardColorImg) && outwardColorImg.length > 0 ?
                                                    <div className="con-item"> 
                                                        <p className="item-title flex flex-c">
                                                           <i className="base-icon icon-25 icon-display-none flex-item-gsb-0" style={{"cursor": "pointer"}} onClick={this.bolckNone.bind(this)}></i>
                                                           <span className="sp-text flex-item-gsb-0">外观和颜色都相似({outwardColorImg ? outwardColorImg.length : 0 })</span>
                                                           <span className="sp-line flex-item-gsb-1"></span>
                                                        </p>
                                                        <ul className='clearfloat imgData'> 
                                                            {
                                                                outwardColorImg.map((elem,index) => {
                                                                    return this.renderListHtml(elem, index)
                                                                })          
                                                            }  
                                                        </ul>
                                                    </div>
                                                :
                                                    null
                                            } 
                                            {             
                                                Array.isArray(outwardImg) && outwardImg.length > 0 ?              
                                                    <div className="con-item">
                                                        <p className="item-title flex flex-c">
                                                            <i className="base-icon icon-25 icon-display-none flex-item-gsb-0" style={{"cursor": "pointer"}} onClick={this.bolckNone.bind(this)}></i>  
                                                            <span className="sp-text flex-item-gsb-0">外观相似({outwardImg.length})</span> 
                                                            <span className="sp-line flex-item-gsb-1"></span>
                                                        </p>
                                                        <ul className='clearfloat imgData'> 
                                                            {
                                                                outwardImg.map((elem,index) => { 
                                                                    return this.renderListHtml(elem, index)
                                                                })
                                                            }        
                                                        </ul>
                                                    </div>
                                                :
                                                    containImg.length == 0 && outwardColorImg.length == 0 ?
                                                        <div className="con-item">
                                                            <p className="item-title flex flex-c">
                                                                <i className="base-icon icon-25 icon-display-none flex-item-gsb-0"></i>  
                                                                <span className="sp-text flex-item-gsb-0">外观相似({outwardImg.length})</span> 
                                                                <span className="sp-line flex-item-gsb-1"></span>
                                                            </p>
                                                            {this.renderNoDataHtml('在可识图素材中未找到相似素材')}                                        
                                                        </div>
                                                    :
                                                        null    
                                            }
                                        </div>
                                    :
                                        null
                        }         
                    </div>
                </div>
            </div>
    		)
    }
    downloadImage(src) {
        const imgs = new Image();
        imgs.src = src;
        if( imgs.complete ){
            console.log('图片已缓存')
        }else{
            console.time("图片下载时间：")
            imgs.onload = () => {
                console.log('图片下载成功')
            }
            console.timeEnd("图片下载时间：")
        }
    }
    backSearch() {
        const srData = this.props.shituResultData
        if( srData && srData.sendPost && 
            srData.sendPost.mode === SHITU_MODE.text ){
           srData.sendPost.data = ''
        }        
        this.props.setRoute(SEARCH_ROUTES[0])
    }
    downloadNgFile(elem, event) {
        event.stopPropagation()
        event.preventDefault()
        this.props.actions.triggerDialogInfo({type: DOWNLOAD_NG_FILE, data: elem})
    }
    moveEvents(temp, event) {
        const aDom = event.currentTarget,
            alertDom = aDom && aDom.parentNode.querySelector('.layer-alert-msg');
        if( !alertDom ) {
            return
        }
        alertDom.classList.toggle('show')
    }
    changeRange(rg, event) {
        // if( rg.value === CHANGE_RANGE.neighbor.value ){
        //     this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '您还没有链图云邻居，暂时无法搜索邻居素材',auto: true, speed: 2000})
        //     return
        // }
        this.setState({
            shituRange: rg
        })
    }    
    //初始化数据【包含查询图片】、【外观和颜色都相似、仅外观相似】 
    tonaColorInport(data, imgType){
        const allArray = (data && data.data) || [];
        let mode, range;
        if( data && data.sendPost ){
            mode = data.sendPost.mode
            range = data && data.sendPost.range.value
        } 
        if( mode === SHITU_MODE.text ){
            //【文字搜索模式】
            const textImg = this.filterTypeData(allArray, imgType); 
            log("===过滤前的源数据===：")
            log(data)
            log(allArray)
            log(imgType)            
            log("===过滤后的数据===：")
            log(textImg)
            this.setState({
                textImg: textImg,
                shituMode: data.sendPost ? data.sendPost.mode : this.state.shituMode, 
                keyWord: data.sendPost ? data.sendPost.data : '',
                imgType: imgType,
                containImg: null,
                outwardColorImg: null,
                outwardImg: null,
                ngGroupData: null               
            })
        }else{       
            if( range === CHANGE_RANGE.neighbor.value ){
                //按邻居分组
                //代码在这里会重复处理，性能不好。
                //建议在../reducers/shitu.js 第15行到37行作修改。
                const groupData = {},
                      newArray = [];
                const filterData = this.filterTypeData(allArray, imgType);      
                filterData.forEach(item => {
                    let hasKey = false                 
                    for( let key in groupData ){
                        if( key == item.user_id ){
                            hasKey = true
                            break;
                        }
                    }
                    if( hasKey ) {
                        groupData[(""+ item.user_id +"")].push(item)
                    }else{
                        groupData[(""+ item.user_id +"")] = []
                        groupData[(""+ item.user_id +"")].push(item)
                    }
                })
                for( let key in groupData ){
                    newArray.push(groupData[key])
                }  
                log("===过滤前的源数据===：")
                log(allArray)
                log(filterData)
                log(imgType)            
                log("===过滤后的数据===：")
                log(newArray)                
                this.setState({
                    ngGroupData: newArray,
                    imgType: imgType,
                    shituMode: data.sendPost ? data.sendPost.mode : this.state.shituMode,
                    keyWord: '',
                    textImg: null,
                    containImg: null,
                    outwardColorImg: null,
                    outwardImg: null,                                         
                })              
            }else{            
                //【包含查询图片】
                const containImg = this.filterTypeData(this.filterColorData(allArray, IMG_CONTAIN_OUTWARD_COLOR.contain), imgType);
                //【外观和颜色都相似】
                const outwardColorImg = this.filterTypeData(this.filterColorData(allArray, IMG_CONTAIN_OUTWARD_COLOR.outwardColor), imgType);
                //【仅外观相似】
                const outwardImg = this.filterTypeData(this.filterColorData(allArray, IMG_CONTAIN_OUTWARD_COLOR.outward), imgType);
                log("===过滤前的源数据===：")
                log(data)
                log(allArray)
                log(imgType)
                log("===过滤后的数据===：")
                log(containImg)
                log(outwardColorImg)
                log(outwardImg)
                //两个过滤条件一起过滤
                this.setState({
                    containImg: containImg,
                    outwardColorImg: outwardColorImg,
                    outwardImg: outwardImg,
                    imgType: imgType,
                    shituMode: data.sendPost ? data.sendPost.mode : this.state.shituMode,
                    keyWord: '',
                    textImg: null,
                    ngGroupData: null           
                }) 
            }           
        }
    }
    //原图的主要颜色值
    getMainColor() {
        const srData = this.props.shituResultData,
              mainColor = [];
        if( srData ){
            if( parseInt(srData.tonality1) >= 0 ){
                mainColor.push(srData.tonality1)
            }
            if( parseInt(srData.tonality2) >= 0 ){
                mainColor.push(srData.tonality2)
            }
            if( parseInt(srData.tonality3) >= 0 ){
                mainColor.push(srData.tonality3)
            }                        
        }
        this.setState({
            mainColor: mainColor
        })
    }    
    //格式种类重组
    reformattingType(arr){
        //格式重组
        if( !arr ) return;
        const arrTypes = arr.map( item => item.file_type ),
              formaTypes = cloneObj(FORMAT_TYPE);     
        arrTypes.forEach( ats => { 
            let hasFt = false
            if( !isEmpty(ats) && ats.constructor == String ){ 
                formaTypes.forEach( fts => {
                    if( fts.text.toLowerCase() === ats.toLowerCase() ){
                        fts.total++
                        formaTypes[0].total++
                        hasFt = true
                    }else{
                        if( fts.data ){
                            fts.data.forEach( md => {
                                if( md.toLowerCase() === ats.toLowerCase() ){
                                    fts.total++
                                    formaTypes[0].total++
                                    hasFt = true
                                }
                            })
                        }
                    }
                })
            }else{
                //针对错误格式
                formaTypes[formaTypes.length-1].total++
                formaTypes[0].total++
                hasFt = true
            }    
            //针对其它格式        
            if( !hasFt ){
                formaTypes[formaTypes.length-1].total++
                formaTypes[0].total++                
            }
        })
        this.setState({
            imgTypeAll: formaTypes.filter( fts => {return fts.total > 0 })
        })
    }
    //过滤外观与颜色数据
    filterColorData(arr, val) {
        //过滤外观与颜色
        const newData = arr.filter((item) => {
            return item.search_result_type === val
        }); 
        return newData                
    }
    //过滤格式数据
    filterTypeData(newData, type) {
        if( !newData || !type ) return;
        //过滤格式
        let filters = [];
        switch(type.value){
            case 0:
               return newData
            break;
            case 4:
                JIN_CHAN.forEach( jc => {
                    const newArr = this.addByValue( newData, jc );
                    if( newArr.length > 0 ){
                        filters.push(...newArr)
                    }
                })
            break;
            case 7:
                IMG_TYPE_JPG.forEach( jpg => {
                    const newArr = this.addByValue( newData, jpg );
                    if( newArr.length > 0 ){
                        filters.push(...newArr)
                    }
                })
            break;
            case 100:
                newData.forEach( item => {
                    const newArr = this.addNotByValue(IMG_TYPE_CONTENT, item);
                    if( newArr.length > 0 ){
                        filters.push(...newArr)
                    }                     
                })
            break;
            default:
                const newArr = this.addByValue( newData, type.text );
                if( newArr.length > 0 ){
                    filters.push(...newArr)
                }            
            break;
        }
        return filters;
    }    
    //打开本地文件位置
    openFileLocation(path,event) {
        event.stopPropagation()
        event.preventDefault()
        window.openFileRequest(2, path)
    }
    //预览本地图片
    previewImg(path,event){
        event.stopPropagation()
        event.preventDefault()        
        try{
            window.openScanDocsImageRequest(path) 
        }catch(e){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "无法打开预览图",auto: true,speed: 1500,statu: 0})
        }
    }
    //去除相同尾缀的图片
    removeByValue(arr, val) {
        const newData = arr.filter((item) => {
            return item.file_type.toLowerCase() != val.toLowerCase()
        });
        return newData         
    }
    //其它，刚好与addByValue相反
    addNotByValue(arr, val) {
        if( !val ) return [];
        let hasVal = false;
        for( let i = 0, len = arr.length; i < len; i++ ){
            if( !arr[i] ) continue;
            if( arr[i].toLowerCase() == val.file_type.toLowerCase() ){
                hasVal = true;
                break;
            }
        }
        if( !hasVal ) 
            return [val];
        return [];
    }
    //保留相同尾缀的图片 
    addByValue(arr, val) {
        const newData = arr.filter((item) => {
            return item.file_type.toLowerCase() == val.toLowerCase()
        });
        return newData         
    }
    //点击颜色相似按钮
    similarColor(val){      
        if( this.state.restoreColor == val ) return;
        const srData = this.props.shituResultData;
        if( !srData || !srData.data ) return; 
        this.tonaColorInport(srData, this.state.imgType)
        this.setState({
            restoreColor: val
        })
    }    
    //点击过滤格式按扭
    formatSelection(data, event){
        event.stopPropagation();
        event.preventDefault();
        if( !data ) return;
        if( this.state.imgType.value == data.value ) return;
        const srData = this.props.shituResultData;
        if( !srData || !srData.data ) return; 
        const $imgDataDom = $('.con-item').find('.imgData'),
              $iconSelect = $('.con-item .item-title').find('.icon-display-none'); 
        $iconSelect.removeClass('rotate-180-bg');      
        $imgDataDom.removeClass('dom-none');        
        this.tonaColorInport(srData, data)
    }
    // 筛选栏滚动
    scrollByTop() {
        var fixedDom = $('.result-content .format-box'),  
            fixedBox = $('.fixed-box');
        if( fixedDom.length > 0 && fixedDom.offset().top <= 0 ){
            if( fixedBox.length > 0 ){
                fixedBox.css('display','block')
            }
        }else{
            if( fixedBox.length > 0 ){
                fixedBox.css('display','none')
            }
        }
    }
    //图片列表收起展开
    bolckNone(event) {
        if( !event ) return;
        event.stopPropagation();
        event.preventDefault();
        const btnDom = event.currentTarget,
              parDom = btnDom && btnDom.parentNode.parentNode,
              listDom = parDom && parDom.querySelector('.imgData');
        if( listDom ){
            const cssObj = getCss(listDom, 'display')
            if( cssObj == 'block' ){
                listDom.classList.add('dom-none');
                btnDom.classList.add('rotate-180-bg');
            }else{
                listDom.classList.remove('dom-none');
                btnDom.classList.remove('rotate-180-bg');
            }
        } 
    }
    //获取识图结果列表（筛选后的）
    getInitResultData(srData) {
        if( srData ){ 
            //原图信息解析，只执行一次
            this.getMainColor()
            // 格式种类过滤重组，只执行一次
            this.reformattingType(srData.data)                
            //内容列表
            //第二个参数为格式过滤项，初始化时为全部
            this.tonaColorInport(srData, FORMAT_TYPE[0])                                           
            getmCustomScrollbar4( $(".img-list-table"), throttle(this.scrollByTop.bind(this),100))
        }else{
            let errorstr = srData.error
            if( isEmpty(errorstr) ){
                errorstr = '识图失败(代码：'+ srData.error_code +')'
            }
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: errorstr,auto: true,speed: 3000,statu: 0})             
        }        
    }
    componentWillMount() {
        if( this.props.shituResultData && this.props.shituResultData.sendPost &&
            this.props.shituResultData.sendPost.range ){
            this.setState({
                shituRange: this.props.shituResultData.sendPost.range
            })
        }
    }
    componentDidMount() {
        //初始化识图结果列表
        this.getInitResultData(this.props.shituResultData);
    }
    componentWillReceiveProps(nextProps) {
        //触发配置信息数据接收时
        if(nextProps.getConfig && nextProps.configLastUpdated != this.props.configLastUpdated ){
            const srData = nextProps.shituResultData;
            if( srData ){
                this.tonaColorInport(srData, this.state.imgType) 
            }
        }
        if( nextProps.shituResultData && nextProps.shituResultDataLastUpdated !== this.props.shituResultDataLastUpdated ){
            //结果页再进行识图
            this.getInitResultData(nextProps.shituResultData);            
        }
    }
    componentDidUpdate(nextProps, nextState) {  
        if( nextProps.resize.h !== this.props.resize.h ){
            getmCustomScrollbar4($(".img-list-table"), null, "update")
        }
        if( this.state.shituMode != SHITU_MODE.text ){
            //拖拽
            const optElem = document.querySelector('.shitu-main'),
                  parElem = document.querySelector('.fixed-box'),
                  dragElem = parElem && parElem.querySelector('.abs');
            if( dragElem ){              
                dragDrop(dragElem, parElem)
            }
        }             
    }  
}
function mapStateToProps(state) {
    return {
        shituIdData: state.events.openFilePath_0,
        shituIdDataLastUpdated: state.events.openFile0LastUpdate,
    }
}
export default connect(
    mapStateToProps 
)(ShituImg)