import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { loadingHtml3 } from '../../constants/RenderHtmlConstant'
import { log, isEmpty, getmCustomScrollbar4, getTime } from '../../constants/UtilConstant'

//扫描结果列表分页栏
class ScanResultPageBar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            pageData: null,
            scanTime: null
        };
      	log("ScanResultPageBar--扫描结果列表分页栏");		
  	}
    pageInit(resultData) {
        if( !resultData ) return;
        let pagesize = this.props.page_size > 0 ? this.props.page_size : 50,
            ngcnt = parseInt(resultData.ng_cnt) + parseInt(resultData.skip_cnt),
            pagenum = Math.ceil(ngcnt/pagesize);
        pagenum = pagenum > 0 ? pagenum : 1;  
        const pagearr = new Array(pagenum);
        this.pageBar(pagearr, resultData.error_page_num)        
    }	  
    pageBar(pagearr, num) {
        //初始化分页算法
        if( pagearr ){
            if( !Array.isArray(pagearr) ){
               return;
            }      
            let isReduce = false, len = pagearr.length,  ii = 0, int1 = 6, int3 = int1, int2 = 10, int4 = int2;           
            if( num ){
                num = parseInt(num);
                ii = num-int1 > 0 ? num-int1 : 0;
                //判断页码个数是否小于页码区间最大值int2=10
                if( (len-ii) < int2 ){
                    //如果小于则重新定义ii起始值
                    ii = ii-(int2-(len-ii));
                    ii = ii > 0 ? ii : 0;
                }         
                //重新定义页码区间值(int1=6, int2=10)           
                int1 = int1 + ii;
                int2 = int2 + ii;
            }     
            for( let i = ii, len = len; i < len; i++ ){
               if( (i > int1 && len > int2 && !isReduce) || (len > int4 && num && num >= len-4 && i == ii+2) ){
                   //1.判断是否到最前面int1+1页，如果是则倒数第三页用...表示
                   //2.判断是否到最后面int1+1页，如果是则正数第三页用...表示
                   //len>int4是页数要大于最小初始值int3=10
                   isReduce = true;
                   pagearr[i] = {pagenum: '...', value: -1};
               }else{
                   if( len > int4 && num && num >= len-4 ){
                       //页码大于倒数第4页                           
                       if( i < ii+2 ){        
                           //页码前两页用第一和第二页表示                     
                           pagearr[i-ii] = {pagenum: i-ii+1, value: i-ii};
                       }else{
                           pagearr[i] = {pagenum: i+1, value: i};
                       }
                   }else{
                       //页码小于倒数第4页                      
                       if( isReduce && i < len-2 ){
                           //跳过此页码，统统用上面的...表示。
                           continue;
                       }else{ 
                           if( len > int4 && num && num > int3 ){
                               //这里的代码可以出现第二个...表示的地方
                               //当前页面大于页码区间初始值的最小值
                               if( i < ii+2 ){
                                   //页码前两页用第一和第二页表示                            
                                   pagearr[i-ii] = {pagenum: i-ii+1, value: i-ii};
                               }else{
                                   if( i == ii+2 ){
                                      //中间部分再用...表示
                                      pagearr[i] = {pagenum: '...', value: -1};
                                   }else{
                                      pagearr[i] = {pagenum: i+1, value: i};
                                   }
                               }                                   
                           }else{                        
                               pagearr[i] = {pagenum: i+1, value: i};
                           }
                       }
                   }
               }
            }
            //重新渲染列表页码
            this.setState({
                pageData: pagearr
            })
        }        
    }
    inItConfig(_props) {
        //获取本次扫描时间
        const getConfig = _props.getConfig;
        if( getConfig && getConfig.data && getConfig.data.scan_docs_last_scan_time ) {
            const scantimeval = getConfig.data.scan_docs_last_scan_time.value
            if( !isEmpty(scantimeval) && scantimeval != 'null' ){
                this.setState({
                    scanTime: scantimeval
                }) 
            }
        }      
    }
    pageNumSend(pagenum) {
        if( this.props.resultData ){
            this.props.loadingFn();
            setTimeout(() => {
                this.props.actions.sendHandleMessage('ScanMsgProcess', 'getScanInfo', {cmd:1, error_page_num: pagenum, per_page_size: this.props.page_size})
            },50)
        }
    }      
    render() {
        const { resultData } = this.props
        const { pageData, scanTime } = this.state
        return (
              <div className="flex flex-c w-full col-6 sc-bottom page-bar flex-item-gsb-0">
                   <div className="b-left flex-item-gsb-0">扫描完成时间：{scanTime ? scanTime : '--'}</div>
                   <div className="b-right flex-item-gsb-1 b-right flex flex-c flex-r-r">
                       <span className="flex flex-c flex-item-gsb-0">共<span className="num">{resultData ? (parseInt(resultData.ng_cnt)+parseInt(resultData.skip_cnt)) : 0}</span>条，</span>
                       <span className="flex flex-c flex-item-gsb-0">每页<span className="num">{this.props.page_size}</span>条</span>
                       {
                          resultData && resultData.error_page_num > 0 ?
                              <button className="prev-btn icons-20 icons-scan active" onClick={this.pageNumSend.bind(this, resultData.error_page_num-1)}></button>
                          :
                              <button className="prev-btn icons-20 icons-scan" disabled></button>    
                       }
                       <ul className="sc-ul flex flex-c flex-c-c col-6">
                           {
                               pageData && pageData.length > 0 ?
                                  pageData.map((item, index) => {
                                      let piclass = 'page-item flex-item-gsb-0';
                                      if( index == resultData.error_page_num ){
                                          piclass += ' active';
                                      }
                                      return <li key={index} className={piclass}
                                                onClick={item.value >= 0 ? this.pageNumSend.bind(this, item.value) : null}>
                                                {item.pagenum}
                                             </li>
                                  })
                               :
                                  <li className="page-item active">1</li>   
                           }
                       </ul>
                       {
                          resultData && pageData && resultData.error_page_num < pageData.length-1 ?
                              <button className="next-btn icons-20 icons-scan active" onClick={this.pageNumSend.bind(this, resultData.error_page_num+1)}></button>
                          :
                              <button className="next-btn icons-20 icons-scan" disabled></button>    
                       }                             
                   </div>
              </div>    
        )
    }   
    componentDidMount() {
        //分页
        this.pageInit(this.props.resultData)
        this.inItConfig(this.props)
    } 
    componentWillReceiveProps(nextProps) {
        //分页
        this.pageInit(nextProps.resultData)
        //获取本次扫描时间
        if( nextProps.getConfig && nextProps.configLastUpdated != this.props.configLastUpdated ){
           this.inItConfig(nextProps) 
        }       
    }       	  
}
export default immutableRenderDecorator(ScanResultPageBar)