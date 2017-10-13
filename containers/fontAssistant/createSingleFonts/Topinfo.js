import React, { Component, PropTypes } from 'react'

import { isEmpty, log } from '../../../constants/UtilConstant'

class Topinfo extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("Topinfo");		
	}
	render() {
		const { subRoute, login } = this.props
        const data = subRoute.data
		return <div className="cf-info cf-top">
		            <div className="font-item-info">
	                    <div className="info-pic abs">
	                        <img src={isEmpty(data.cover_img) ? "compress/temp/cn.png" : data.cover_img} alt=""/>
	                    </div>
	                    <div className="info-con">
	                         <div className="con-title">
	                             <span className="bg-style">字体单</span>
	                             <h2>{data.list_name}</h2>
	                         </div>
	                         <p className="con-user">
	                             <img src={login.loginUserData.headPortrait} className="user-photo" alt="" />
	                             <span className="user-name">{data.create_user}</span>
	                             <span className="user-has">包含<span className="num">0</span>款字体</span>
	                             <span className="user-time">创建于 {data.create_time}</span>
	                         </p>
	                         <p className="con-btn">
	                             <a className="border-style add-font"><i className="icons-18 af-icon icons"></i>添加字体</a>
	                             <a className="border-style collect-font"><i className="icons-18 cf-icon icons"></i>收藏（0）</a>
	                             <a className="border-style share-font"><i className="icons-18 sf-icon icons"></i>分享（0）</a>
	                             <a className="border-style download-font"><i className="icons-18 df-icon icons"></i>下载全部</a>
	                         </p>
	                         <p className="con-label">
	                             标签：
	                             {
	                             	data.tag != null ?
	                             	   <span className="sp-line">{data.tag}</span>
	                             	:
	                             	   null
	                             }
	                             <a className="add-label col-lan">添加标签</a>
	                         </p>
	                         <p className="con-bid">
	                              简介：
	                             {
	                             	data.brief != null ?
	                             	   <span className="sp-line">{data.brief}</span>
	                             	:
	                             	   null
	                             }
	                             <a className="add-bid col-lan">添加简介</a>
	                         </p>
	                    </div>
                    </div>
                </div>
	}
}
Topinfo.propTypes = {
}
export default Topinfo
