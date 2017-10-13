/**
 * 配置信息
 * @type {Object}
 */
module.exports = {
    /**
     * 分页 
     * offset 页数
     * fetch_size 每页显示条数
     */ 	
  	page: {
  		offset: 0,
  		fetch_size: 10
  	},
    /**
     * 字体大小 
     * value 大小
     * real_value 预览图高度
     */	
  	fontSize: {
  		text: "36pt",
  		value: 36,
  		real_value: Math.floor(36/0.68),
  		key: 8
  	},
    /**
     * 预览文字 
     */		
  	previewFont: {
  		text: ""
  	},
    /**
     * 搜索文字 
     */		
  	searchFont: {
  		text: ""
  	},
    /**
     * 获取字体列表默认参数（适用于字体助手）
     */ 
    getFontInitObjectData: {//直接调用会被引用 
        temp: 0,
        type: null,
        user_id: null,
        InstallTime: -1, 
        offset: 0,
        fetch_size: 10,
        height: Math.floor(36/0.68),
        text_size: 36,
        preview_text: '',
        search_text: '',
        PageName: 0,
        language: 0x0001      
  	},
    /**
     * 获取文件列表默认参数（适用于本地素材）
     */    
    getFileInitObjectData: {//直接调用会被引用 
        dir: null,       //内容路径
        sort_type: 0,    //排序类型
        b_asec: true,    //是否是升序
        is_tab: true,   //是否分页
        offset: 0,       //初始页码 
        fetch_size: 50, //初始条数 
        user_id: 0,      //用户
        get_filter: 0,   //0全部获取，1获取文件夹，2获取扫描文件, 3未完成，4完成，5失败，6问题文件
        is_refresh: false,//是否要刷新
        mode: 0,          //js使用，0表示获取左侧树结构数据但不改变右侧文件列表，1表示获取右侧文件列表但不改变左侧树结构
        pull_load: false  //js使用，0表示不是下拉加载，1表示下拉加载
    },
    getIntervalValue: {
        thumbnail: 3 //缩略图区间阀值
    }
};