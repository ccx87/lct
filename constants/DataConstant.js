/**
 * 数据常量类
 * @type {Object}
 */
module.exports = {
	/**
	 * 常用网页字体单Tab数组
	 */
	COMMONFONT_TAB: [
		{ name: "字体列表", classes:"bg-border-style", action: "show_list_cf", key: 1 },
        { name: "效果图（12）", classes:"bg-border-style", action: "show_effectpic_cf", key: 2 },
        { name: "评论（0）", classes:"bg-border-style", action: "show_comment_cf", key: 3 }                 
    ],
    
	/**
	 * 下载Tab数组
	 */    
    DOWNLOAD_TAB: [
		    { name: "已下载", classes:"bg-border-style2", action: "show_downloaded", key: 1 },
        { name: "正在下载", classes:"bg-border-style2", action: "show_downloading", key: 2 }
    ],
    
	/**
	 * 发现字体Tab数组
	 * { name: "分类", classes:"bg-border-style3", action: "show_font_sort", key: 2 },
	 */    
    FOUNDFONT_TAB: [
		{ name: "字体单", classes:"bg-border-style3", action: "show_font_list", key: 1 },
        { name: "排行榜", classes:"bg-border-style3", action: "show_font_ranking", key: 2 }
    ],
    
	/**
	 * 发现字体--分类类型--Tab数组
	 */    
    FOUNDFONT_SORT_TAB: [
		{ name: "推荐品牌", classes:"bg-border-style4", action: "show_font_sort_1", key: 1 },
        { name: "网页常用", classes:"bg-border-style4", action: "show_font_sort_2", key: 2 },
        { name: "书法", classes:"bg-border-style4", action: "show_font_sort_3", key: 3 },
        { name: "可商用", classes:"bg-border-style4", action: "show_font_sort_4", key: 4 }
    ],
    
	/**
	 * 最新字体Tab数组
	 */    
    NEWFONT_TAB: [
		{ name: "中文", classes:"bg-border-style3", action: "show_new_font_1", key: 1 },
        { name: "英文", classes:"bg-border-style3", action: "show_new_font_2", key: 2 },
        { name: "日文", classes:"bg-border-style3", action: "show_new_font_3", key: 3 },
        { name: "韩文", classes:"bg-border-style3", action: "show_new_font_4", key: 4 }
    ],          
       
    /**
     * 页面菜单路由--字体助手 
     * {text: "已安装",name:"INSTALLATION", icons:"btn-installation", value: 2, key: 2},
     * {text: "未安装",name:"UNINSTALL", icons:"fa-uninstall", value: 3, key: 3},
     */
    ROUTES:[
        {menu:"MyFonts", text:"我的字体", classes:"default", value:1, key:1, 
            data:[
                  {text: "本地字体",name:"ALL", icons:"fn-all-bg", value: 1, key: 1, PageName: 0},
                  {text: "我的收藏",name:"COLLECTED", icons:"fn-collect", value: 4, key: 4, PageName: 1},
                  {text: "下载管理",name:"DOWNLOAD_MANAGER", icons:"fa-download-manager", value: 5, key: 5, PageName: 3},
                  {text: "回收站",name:"RECYCLE_BIN", icons:"clear-bg", value: 6, key: 6, PageName: 4},
            ]
       },
       {menu:"MissingFonts", text:"缺失字体", classes:"default", value:2, key:2, 
            data:[{text: "字体补齐",name:"AUTO_FILL", icons:"fa-auto-fill", value: 1, key: 1,PageName:5},
            	  {text: "历史记录",name:"HISTORY_RECORD", icons:"fa-history-record", value: 2, key: 2,PageName:6}
            ]
       },
       // {menu:"RecommendFonts", text:"推荐", classes:"default", value:3, key:3, 
       //      data:[{text: "发现字体",name:"FOUND_FONTS", icons:"fa-font-found", value: 1, key: 1},
       //            {text: "最新字体",name:"NEW_FONTS", icons:"fa-font-new", value: 2, key: 2}
       //      ]
       // },
       // {menu:"CreateSingleFonts", text:"创建的字体单", classes:"", value:4, key:4, 
       //      data:[]
       // },
       // {menu:"SingleFontCollections", text:"收藏的字体单", classes:"", value:5, key:5, 
       //      data:[{text: "收藏1",name:"COLLECT1", icons:"fa-my-font", value: 1, key: 1},
       //            {text: "收藏2",name:"COLLECT2", icons:"fa-my-font", value: 2, key: 2},
       //            {text: "收藏3",name:"COLLECT3", icons:"fa-my-font", value: 3, key: 3},
       //            {text: "收藏4",name:"COLLECT4", icons:"fa-my-font", value: 4, key: 4},
       //            {text: "收藏5",name:"COLLECT5", icons:"fa-my-font", value: 5, key: 5}
       //      ]
       // }, 
       {menu:"SearchMain", text:"搜索", classes:"default", value:6, key:6, 
            data:[{text: "搜索云端字体",name:"SEARCH_FONTS", icons:"", value: 1, key: 1, PageName: 2}]
       }                                   
    ],    
    /**
     * 页面类型
     */    
    PAGE_TYPE: {
        //字体助手
        Font_Assistant: {
            //本地字体
            local_font: {
                search: "搜索本地和云端字体",
                text: "本地字体",
                value: 0,
                PageName: 0
            }, 
            //已安装
            installed_font: {
                search: "搜索本地和云端字体",
                text: "已安装字体",
                value: 0
            },
            //未安装
            uninstall_font: {
                search: "搜索本地和云端字体",
                text: "未安装字体",
                value: 0
            },            
            //我的收藏
            my_collection: {
                search: "搜索本地和云端字体",
                text: "已收藏字体",
                value: 0,
                PageName: 1          
            },
            //下载管理
            download_manager: {
                PageName: 3
            },
            //回收站
            recycle_bin: {
               search: "搜索本地和云端字体",
               text: "回收站",
               value: 5,
               PageName: 4
            },
            //字体补齐
            font_fill: {
                search: "",
                text: "字体补齐",
                value: 6,
                PageName: 5            
            },
            //历史记录
            history_record: {
                search: "搜索已补齐文件",
                text: "历史记录",
                value: 7,
                PageName: 6,           
            },
            //搜索
            search_font: {
                search: "搜索本地和云端字体",
                text: "搜索",
                value: 0,
                PageName: 2                
            }
        }       
    },
    /**
     * 页面菜单路由--设置界面 
     * {text: "意见反馈",name:"FEEDBACK", icons:"fa-feedback", value: 2, key: 2}
     */
    ROUTES_SET:[
        {menu:"Common", text:"常规", classes:"default", value:1, key:1, 
            data:[
                {text: "常规设置",name:"GENERAL_SET", icons:"fn-general-settings", value: 1, key: 1},
                {text: "下载设置",name:"DOWNLOAD_SET", icons:"fn-general-settings", value: 2, key: 2},
                {text: "自动扫描时间设置",name:"SCANTIME_SET", icons:"", value: 3, key: 3},
                {text: "扫描文件格式设置",name:"FILESTYPE_SET", icons:"", value: 4, key: 4}
            ]
       }
    ],   
    /**
     * 菜单功能栏（适用于字体助手）
     */
    MENU:[
       {text: "", id: "font_assistant", icons:"icons icons-20 fn-check", value: "menu_all_check", key: 1},
       {text: "收藏", id: "font_assistant", icons:"icons icons-20 fn-collect", value: "menu_collect", key: 2},
       {text: "取消收藏", id: "font_assistant", icons:"icons icons-20 fn-collect", value: "menu_uncollect", key: 3},
       {text: "安装", id: "font_assistant", icons:"icons icons-20 btn-installation", value: "menu_install", key: 4},
       {text: "卸载", id: "font_assistant", icons:"icons icons-20 btn-uninstall", value: "menu_uninstall", key: 5},
       {text: "下载", id: "font_assistant", icons:"icons icons-20 btn-download", value: "menu_download", key: 6},
       {text: "刷新", id: "font_assistant", icons:"icons icons-20 btn-refresh", value: "menu_refresh", key: 7}, 
    ],
    /**
     * 菜单功能栏（适用于本地素材）
     */    
    FILE_MENU: [
       // {text: "批量编辑", id: "local_material", icons:"unbody icons-local-material icons-20 batch-edit-bg", value: "menu_batch_edit", key: 1},
       // {text: "扫描", id: "local_material", icons:"unbody icons-local-material icons-20 immediately-scan-bg", value: "menu_immediately_scan", key: 2}
       // {text: "删除", id: "local_material", icons:"unbody icons icons-20 clear-bg", value: "menu_del", key: 3},
    ],
    /**
     * 右键点击菜单功能栏
     */    
    SMART_MENU:[
       {text: "收藏到字体单", icons:"unbody icons icons-20 add-csfl-bg", value: "smart_menu_collect1", key: 1},
       {text: "一键安装", icons:"unbody icons icons-20 btn-installation-bg", value: "smart_menu_install", key: 2},
       {text: "打开所在位置", icons:"unbody icons icons-20 fn-postion", value: "smart_menu_open", key: 3},
       {text: "删除文件", icons:"unbody icons icons-20 clear-bg", value: "smart_menu_del", key: 4},
       {text: "查看资料", icons:"", value: "smart_menu_check_data", key: 5},
       {text: "修改备注", icons:"", value: "smart_menu_modify_comments", key: 6},
       {text: "删除会话", icons:"", value: "smart_menu_delete_session", key: 7},
       {text: "删除好友", icons:"", value: "smart_menu_delete_friend", key: 8},
       {text: "加入黑名单", icons:"", value: "smart_menu_add_blacklist", key: 9},
       {text: "预览(空格键)", icons:"", value: "smart_menu_open_default", key: 10},
       {text: "打开", icons:"", value: "smart_menu_open_route", key: 11},
       {text: "复制", icons:"", value: "smart_menu_copy", key: 12},
       {text: "粘贴", icons:"", value: "smart_menu_paste", key: 13},
       {text: "剪切", icons:"", value: "smart_menu_cut", key: 14},
       {text: "删除", icons:"unbody icons icons-20 clear-bg", value: "smart_menu_delete_file", key: 15},
       {text: "重命名", icons:"", value: "smart_menu_rename", key: 16},
       {text: "新建", mode:"more-default", value: "smart_menu_new", key: 17, 
          data:[{text: "文件夹", icons:"unbody icons-local-material icons-20 sb-file-bg", value:"smart_menu_new_folder", key: 17.1}]
       }, 
       {text: "设为扫描文件夹", icons:"unbody icons-local-material icons-20 immediately-scan-bg", value: "smart_menu_add_scan", key: 18},
       {text: "打开所在位置", icons:"unbody icons icons-20 fn-postion", value: "smart_menu_open_local", key: 19},
       {text: "刷新", icons:"", value: "smart_menu_refresh", key: 20}
    ],
    /**
     * 排序列表（适用于字体助手）
     */    
    SORT:[
       {text: "全部字体", value: "sort_all", type: 0},
       {
          text: "按状态", value: "key_type", data:[
             {text: "全部", value: "sort_type_all", type: 0},
             {text: "已安装字体", value: "sort_installed", type: 1},
             {text: "未安装字体", value: "sort_uninstall", type: 2},
             {text: "云端字体", value: "sort_cloud", type: 6}             
          ]
       },
       {
          text: "按语言", value: "key_language", data: [
             {text: "全部", value: "sort_language_all", language: 0x0001},
             {text: "中文", value: "sort_chinese", language: 0x0804},
             {text: "英文", value: "sort_english", language: 0x0809},
             {text: "日文", value: "sort_japanese", language: 0x0411},
             {text: "韩文", value: "sort_korean", language: 0x0412},
             {text: "其它", value: "sort_other", language: 0x0000}          
          ]
       },
       {
          text: "按时间", value: "key_time", data: [
             {text: "全部", value: "sort_time_all", tiem: -1}, 
             {text: "最近一天安装", value: "sort_day", time: 0},
             {text: "最近一周安装", value: "sort_week", time: 1},
             {text: "最近一个月安装", value: "sort_month", time: 2}          
          ]
       }       
    ],
    /**
     * 排序列表（适用于本地素材）
     */    
    FILE_SORT:[
       {
          text: "", value: "short-one", data:[
             {text: "文件名", value: "sort_file_name", key: 0},
             {text: "类型", value: "sort_file_type", key: 1},
             {text: "文件大小", value: "sort_file_size", key: 2},
             {text: "修改时间", value: "sort_file_update_time", key: 3}                         
          ]
       },
       {
          text: "", value: "short-two", data: [
             {text: "升序", value: "sort_asc", key: true},
             {text: "降序", value: "sort_des", key: false}        
          ]
       }       
    ], 
    /**
     * 列表模式（适用于本地素材）
     */   
    LIST_MODE: {
       COLSPAN: 'colspan',
       ROWSPAN: 'rowspan'
    },      
    /**
     * 字体类型
     */      
    FONT_TYPE: {
        all: 0, //所有字体
        install: 1, //已安装字体
        uninstall: 2, //未安装字体
        collected: 3, //已收藏字体
        download: 4, //下载列表
        recyle: 5, //回收站
        cloud: 6 //云端字体
    },
    /**
     * 排序时间、类型
     */ 
    INSTALL_TIME: {
       default: -1,
       day: 0,
       week: 1,
       month: 2
    },  
    /**
     * 语言类型
     */ 
    LANGUAGE_TYPE: {
       All: -1, //所有
       Chinese: 0, //中文
       English: 1, //英文
       Korean: 2, //韩文
       Japanese: 3, //日文
       Othe: 4 //其它
    },

    /**
     * 字体大小
     * //9 10  11 12   14  18  24  36  48  60  72
     */
    FONT_SIZE:[
       {text: "9pt", value: 9, real_value: Math.floor(9/0.68), key: 1},
       {text: "10pt", value: 10, real_value: Math.floor(10/0.68), key: 2},
       {text: "11pt", value: 11, real_value: Math.floor(11/0.68), key: 3},
       {text: "12pt", value: 12, real_value: Math.floor(12/0.68), key: 4},
       {text: "14pt", value: 14, real_value: Math.floor(14/0.68), key: 5},
       {text: "18pt", value: 18, real_value: Math.floor(18/0.68), key: 6},
       {text: "24pt", value: 24, real_value: Math.floor(24/0.68), key: 7},
       {text: "36pt", value: 36, real_value: Math.floor(36/0.68), key: 8},
       {text: "48pt", value: 48, real_value: Math.floor(48/0.68), key: 9},
       {text: "60pt", value: 60, real_value: Math.floor(60/0.68), key: 10},
	   {text: "72pt", value: 72, real_value: Math.floor(72/0.68), key: 11}            
    ],
    /**
     * 获取正则表达式
     */    
    GET_REGEX_MATCH: {
        only_letter: 'ONLY_LETTER',//一位字符
        mobile: 'MOBILE', //手机
        email: 'EMAIL', //邮箱
        password_six: 'PASSWORD_SIX', //密码6位
        integer_greater_0: 'INTEGER_GREATER_0', //大于0的整数
        is_image: 'IS_IMAGE', //是否是图片格式 
        last_suffix: 'LAST_SUFFIX' //最后一个后缀名 
    },    
    /**
     * 字体状态
     * 位操作 
     */
    FONT_STATE :{
        kInstallState: 1, // 字体安装状态 bit val: 0=未安装; 1=已安装 
        kCollectState: 2, // 字体收藏状态 bit val: 0=未收藏; 1=已收藏 
        kLocalState: 4, // 文件本地状态 bit val: 0=在云端; 1=在本地 
        kDownloadEnable: 8, // 是否可下载 bit val: 0=不可下载; 1=可下载
        kServerNotExist: 16, // 云端不存在 bit val: 0=存在; 1=不存在 
        kLocalNewFind: 32,   // 本地扫描到的字体，但是还未装载数据(暂时保留）
        kUploaded: 64,    // 文件已经上传,不需要再上传给服务器
        kNeedUpdate: 128  // 是否需要从云端更新        
    },
    /**
     * 获取字体状态
     */
    GET_FONT_STATE: {
        installed: 1, //已安装
        not_install: 2, //未安装
        download: 3, //可下载
        not_download: 4, //不可下载
        not_find: 5, //云端不存在
        in_needupdate: 6, //已经安装的可更新
        not_in_needupdate: 7 //未安装的可更新
    },
    /**
     * 目录等级
     */       
    DIRECTORY_LEVEL: {
        first: 0,
        second: 1,
        third: 2,
        fourth: 3,
        fifth: 4
    },
    /**
     * 标签列表（字体助手--字体单）
     */
    TAG_LIST: [
       {
          id: 1,
          text: "语言",
          tag: [
             {id:1,text: "中文"},
             {id:2, text:"英文"},
             {id:3, text:"日文"},
             {id:4, text:"韩文"},
             {id:5, text:"阿拉伯文"},
             {id:6, text:"法文"},
             {id:7, text:"德文"},
             {id:8, text:"小语种"}           
          ]
       },
       {
          id: 2,
          text: "风格",
          tag: [
             {id:9, text:"卡通"},
             {id:10, text:"动漫"},
             {id:11, text:"古典"},
             {id:12, text:"中国风"},
             {id:13, text:"炫酷"},
             {id:14, text:"可爱"},
             {id:15, text:"小清新"},
             {id:16, text:"时尚潮流"},
             {id:17, text:"古风"},
             {id:18, text:"书法"},
             {id:19, text:"手写"},
             {id:20, text:"哥特式"},
             {id:21, text:"日式"},
             {id:22, text:"点阵风格"},
             {id:23, text:"奇特搞怪"},
             {id:24, text:"装饰素材"},        
             {id:25, text:"正规严肃"},
             {id:26, text:"经典"},
             {id:27, text:"浪漫"},
             {id:28, text:"热闹喜庆"},
             {id:29, text:"温馨"},
             {id:30, text:"科幻"},
             {id:31, text:"毁坏型"},
             {id:32, text:"老派"},
             {id:33, text:"流行"}
          ]
       },
       {
          id: 3,
          text: "场景",
          tag: [
             {id:33, text:"节日（中秋、春节、圣诞节、情人节、复活节、万圣节）"},
             {id:34, text:"电商"},
             {id:35, text:"淘宝"},
             {id:36, text:"美食"},
             {id:37, text:"广告"},
             {id:38, text:"海报"},
             {id:39, text:"banner"},
             {id:40, text:"黑板报"},
             {id:41, text:"印刷"},
             {id:42, text:"校园"},
             {id:43, text:"游戏"},
             {id:44, text:"婚庆"},
             {id:45, text:"影视"}
          ]
       },              
    ],

    /**
     * 页面菜单路由--本地素材
     */
    FILE_ROUTES:[
       {menu:"LOCAL_FILE_TOTAL_PANELS", value:1, key:1},
       {menu:"LOCAL_FILE_CONTENT", value:1, key:1},
       {menu:"LOCAL_FILE_DESKTOP", value:1, key:1}
    ], 
    /**
     * 目录树过滤条件（适用于本地素材）
     *  array==>object
     */
    TREE_FILTER: [
       {text:"显示全部目录", filter: "show_all_tree", icon: "icons-local-material icons-20 select-allfile-bg flex-item-gsb-0", key: "show_tree", value:1},
       {text:"只显示扫描目录", filter: "show_scan_tree", icon: "icons-local-material icons-20 select-scanfile-bg flex-item-gsb-0", key: "show_tree", value:2}
    ],        
    /**
     * 文件扫描状态（适用于本地素材）
     *  array==>object       {text:"未开始", filter: "no", key:"file_included", value:3},
     *  1 获取文件夹，2 获取扫描文件
     *  去除项：{text:"问题文件", filter: "not", key:"file_included", value:6}
     */
    FILE_INCLUDED: [
       {text:"全部", filter: "all", key:"file_included", value:0},
       {text:"未完成", filter: "nohas", key:"file_included", value:3},
       {text:"完成", filter: "has", key:"file_included", value:4},
       {text:"失败", filter: "fail", key:"file_included", value:5},
       {text:"忽略", filter: "ignore", key:"file_ignore", value:7}
    ],    
    /**
     * 文件扫描状态（适用于本地素材）
     * 位与或
     */
    GET_FILE_INCLUDED: {
       has_included: 1,
       no_included: 0,
       fail_included: -1,
       not_included: -2
    },
    /**
     * 文件类型（适用于本地素材）
     * array==>object
     */
    FILE_0_TYPE: [
       {text:"全部", filter: "all", key:"file_0_type", value:null},
       {text:"普通文件", filter: "ordinary", key:"file_0_type", value:1},
       {text:"共享分文件", filter: "share", key:"file_0_type", value:2},
       {text:"收费文件", filter: "pay", key:"file_0_type", value:3}
    ],
    /**
     * 文件类型（适用于本地素材）
     * 位与或
     */
    GET_FILE_0_TYPE: {
       ordinary_file: 1,
       share_file: 2,
       pay_file: 3,
       xxx_file:0
    },        
    /**
     * 文件类型图标
     * "folder","png","jpg","jpeg","gif","tiff","tif","ai","psd","ps","pdf","txt","xls","xlsx","doc","dot","docx","cdr",
     * "zip","rar","otf","ttf","ttc","7z","eps","dxf","plt","svg","bmp","html","jar","jc1","jc8","jcg","jch","jcs"
     */
    FILE_FORMAT_ICONS: [
        {file_format:"folder",icon:"file-format-folder-bg",size:"20"},{file_format:"html",icon:"file-format-html-bg",size:"20"},
        {file_format:"png",icon:"file-format-png-bg",size:"20"},{file_format:"bmp",icon:"file-format-bmp-bg",size:"20"},
        {file_format:"jpg",icon:"file-format-jpg-bg",size:"20"},{file_format:"jpeg",icon:"file-format-jpeg-bg",size:"20"},
        {file_format:"gif",icon:"file-format-gif-bg",size:"20"},{file_format:"psd",icon:"file-format-psd-bg",size:"20"},
        {file_format:"ai",icon:"file-format-ai-bg",size:"20"},{file_format:"pdf",icon:"file-format-pdf-bg",size:"20"},
        {file_format:"cdr",icon:"file-format-cdr-bg",size:"20"},{file_format:"ps",icon:"file-format-ps-bg",size:"20"},
        {file_format:"txt",icon:"file-format-txt-bg",size:"20"},{file_format:"xls",icon:"file-format-xls-bg",size:"20"},
        {file_format:"xlsx",icon:"file-format-xlsx-bg",size:"20"},{file_format:"doc",icon:"file-format-doc-bg",size:"20"},
        {file_format:"dot",icon:"file-format-dot-bg",size:"20"},{file_format:"docx",icon:"file-format-docx-bg",size:"20"},
        {file_format:"zip",icon:"file-format-zip-bg",size:"20"},{file_format:"rar",icon:"file-format-rar-bg",size:"20"},
        {file_format:"7z",icon:"file-format-7z-bg",size:"20"},{file_format:"otf",icon:"file-format-otf-bg",size:"20"},
        {file_format:"ttf",icon:"file-format-ttf-bg",size:"20"},{file_format:"ttc",icon:"file-format-ttc-bg",size:"20"},
        {file_format:"eps",icon:"file-format-eps-bg",size:"20"},{file_format:"dxf",icon:"file-format-dxf-bg",size:"20"},
        {file_format:"plt",icon:"file-format-plt-bg",size:"20"},{file_format:"svg",icon:"file-format-svg-bg",size:"20"},
        {file_format:"jar",icon:"file-format-jar-bg",size:"20"},{file_format:"jc1",icon:"file-format-jc1-bg",size:"20"},
        {file_format:"jc8",icon:"file-format-jc8-bg",size:"20"},{file_format:"jcg",icon:"file-format-jcg-bg",size:"20"},
        {file_format:"jch",icon:"file-format-jch-bg",size:"20"},{file_format:"js",icon:"file-format-js-bg",size:"20"},
        {file_format:"json",icon:"file-format-json-bg",size:"20"},{file_format:"css",icon:"file-format-css-bg",size:"20"}
    ],
    /**
     * 色调列表（适用于本地素材）
     */
    HUE_LIST: [
        {text:"红色", color:"#E11C12", value: 1},
        {text:"橙色", color:"#FF6C00", value: 2},
        {text:"黄色", color:"#FFC100", value: 3},
        {text:"绿色", color:"#56A813", value: 4},
        {text:"蓝色", color:"#00B7C9", value: 5},
        {text:"紫色", color:"#8A1CD2", value: 6},
        {text:"黑色", color:"#000000", value: 7},
        {text:"白色", color:"#FFFFFF", value: 8}
    ],
    /**
     * 扫描模块类型
     *        {type:"scan-dels", text:"删除已取消扫描文件的预览图", status:1, subarr:[
              {text:"等待删除", key: "wait_cnt", value: null, bg: "lt-bg8"},
              {text:"删除成功", key: "ok_cnt", value: null, bg: "lt-bg7"},
              {text:"删除失败", key: "ng_cnt", value: null, bg: "lt-bg6"}
        ]},
        {type:"scan-has", text:"下载生成预览图所需组件", status:1, subarr:[
              {text:"下载成功", key: "ok_cnt", value: null, bg: "lt-bg7"},
              {text:"下载失败", key: "ng_cnt", value: null, bg: "lt-bg6"}
        ]}, 检测待扫描文件的详细信息 生成扫描文件的预览图  更新预览图到您的链图云  扫描完成 
        {module: "trans_result_t", type:"scan-update", subtext:"正在扫描", text:"更新预览图到您的链图云", status:2, subarr:[
              {text:"更新成功", key: "ok_cnt", value: null, bg: "lt-bg7"},
              {text:"更新失败", key: "ng_cnt", value: null, bg: "lt-bg6"}
        ]}          
     *  
     */     
    SCAN_MODULE_DATA: [
        {module: "scan_result_t", type:"scan-types", subtext:"正在处理", text:"检测待扫描文件的详细信息", status:0, subarr:[
              {text:"变更总数", key:"sum_cnt", value: null, bg: "lt-bg2"},
              {text:"新增", key:"add_cnt", value: null, bg: "lt-bg3"},
              {text:"修改", key:"mod_cnt", value: null, bg: "lt-bg4", hover: '原文件内容有被修改的文件数量'},
              {text:"删除", key:"del_cnt", value: null, bg: "lt-bg5", hover: '原文件在本地文件夹已经被删除的文件数量'},
              {text:"文件类型", key:"file_type", value: null, 'bg': "lt-bg1"}
        ]},
        {module: "view_result_t", type:"scan-gener", subtext:"正在处理", text:"生成扫描文件的预览图", status:1, subarr:[
              {text:"生成成功", key: "ok_cnt", value: null, bg: "lt-bg7"},
              {text:"生成失败", key: "ng_cnt", value: null, bg: "lt-bg6"}
        ]},
        {module: "trans_result_t", type:"scan-update", subtext:"正在处理", text:"更新预览图到您的链图云", status:2, subarr:[
              {text:"更新成功", key: "ok_cnt", value: null, bg: "lt-bg7"},
              {text:"更新失败", key: "ng_cnt", value: null, bg: "lt-bg6"}
        ]}                   
    ], 
    /**
     *  生成预览图所需的组件
     */    
    SCAN_TIP_MODULE: [
        {plugin_name: 'INK', download_progress: 0},
        {plugin_name: 'GSWIN', download_progress: 0},
        {plugin_name: 'PSD2JPG', download_progress: 0},
        {plugin_name: 'JCH', download_progress: 0}
    ], 
    /**
     * 文件夹扫描设置Tab数组
     */    
    FOLDER_SCAN_SET_TAB: [
        { name: "扫描文件夹设置", classes:"bg-border-style5", action: "show_folder_settings", key: 1 },
        { name: "扫描文件格式设置", classes:"bg-border-style5", action: "show_parameter_settings", key: 2 }
        // { name: "设计软件设置", classes:"bg-border-style5", action: "show_software_settings", key: 3 },
    ],
    /**
     * 素材管理--内容切换页
     */    
    FILES_MANAGEMENT_MAIN_TAB: [
        { name: "扫描文件夹", classes:"bg-border-style3", action: "show_my_scan_files", key: 1 },
        { name: "按磁盘统计", classes:"bg-border-style3", action: "show_disk_summary", key: 2 },
        { name: "扫描报告", classes:"bg-border-style3", action: "show_type_summary", key: 3 }
    ],
    /**
     * 素材管理--扫描文件夹筛选项
     */    
    MY_SCAN_FILES_FILTER: [
        { text: "全部", value: -1 },
        { text: "本机磁盘", value: 1 },
        { text: "移动设备", value: 2 }      
    ],
    /**
     * 素材管理--扫描报告筛选项
     * status = 8 获取忽略和错误
     *        = 7 忽略
     *        = 5 错误失败
     */    
    MY_SCAN_MSG_FILTER: [
        { text: "全部", value: 0, key: 0, filter: 8 },
        { text: "出错的素材", value: 0, key: 1, filter: 5 },
        { text: "忽略的素材", value: 0, key: 2, filter: 7 }      
    ],             
    /**
     * 扫描文件类型
     */    
    SCAN_FILE_TYPE: [
        { text:"A", data:["AI","ART"]},
        { text:"B", data:["BMP", "BPG"]},
        { text:"C", data:["CDR","CDT","CDX","CAL","CIN","CGM","CUR","CG4","CUT"]},
        { text:"D", data:["DCM","DCX","DIB","DPX"]},
        { text:"E", data:["EPS","EMF","EPDF","EPI","EPT"]},
        { text:"F", data:["FAX","FIG","FPX"]},
        { text:"G", data:["GIF","GBR"]},
        { text:"H", data:["HPGL"]},
        { text:"I", data:["ICO"]},
        { text:"J", data:["JAR","JBIG","JPG","JP2","JPC","JPEG","JC1","JC8","JCH","JCS"]},
        { text:"M", data:["MAN","MIF","MNG","MPEG","MVG"]},
        { text:"O", data:["OTB"]},
        { text:"P", data:["PSD","PDF","PS","PAM","PBM","PCD","PCDS","PCX","PGM","PICON","PICT","PIX","PNG","PNM","PPM","PS2","PTIF","PWP"]},
        { text:"R", data:["RAS","RAD","RLA","RLE"]},
        { text:"S", data:["SCT","SWF","SGI","STL"]},
        { text:"T", data:["TGA","TIFF","TIF"]},
        { text:"W", data:["WBMP","WMF","WEBP","WPG"]},
        { text:"X", data:["XBM","XPM"]}
    ],
    /**
     * 盘符状态(c++定义)
     */
    DRIVE_STATE :{
        kDriveSystemVol: 0x01, // 该bit为1时，表示【系统盘】;为0时，表示【非系统盘】
        kDriveFixed    : 0x02, // 该bit为1时，表示【固定硬盘】
        kDriveRemovable: 0x04, // 该bit为1时，表示【移动硬盘】
        kDriveCDROM    : 0x08, // 该bit为1时，表示【光驱】
        kDriveUsb      : 0x10 // 该bit为1时表示u盘
    },
    /**
     * 获取盘符状态(js定义)
     */
    GET_DRIVE_STATE: {
        systemVol: 1, //系统盘
        sys_fixed: 1.1, //系统盘--固定硬盘
        sys_removable: 1.2, //系统盘--移动硬盘
        sys_CDROM: 1.3, //系统盘--光驱
        sys_usb: 1.4, //系统盘--U盘
        sys_folder: 1.0, //系统盘--文件夹

        noSystemVol: 2, //非系统盘
        noSys_fixed: 2.1, //非系统盘--固定硬盘
        noSys_removable: 2.2, //非系统盘--移动硬盘
        noSys_CDROM: 2.3, //非系统盘--光驱
        noSys_usb: 2.4, //非系统盘--U盘
        noSys_folder: 2.0 //非系统盘--文件夹
    },
    /**
     * 移动设备插入拔出
     */    
    MOBILE_DRIVE_STATU: {
        pullout: 0,
        insert: 1
    },
    /**
     * 消息中心左侧栏Tab数组
     */    
    CHAT_FRIEND_TAB: [
        { name: "会话", classes:"bg-border-style1", icons:"icons-local-material icons-20 msg-session-bg", action: "show_friend_session", key: 1 },
        { name: "联系人", classes:"bg-border-style1", icons:"icons-local-material icons-20 photo-img-bg", action: "show_friend_contacts", key: 2 }
    ],

    /**
     * 页面菜单路由--消息中心
     */
    CHAT_ROUTES:[
       {menu:"CHAT_DEFAULT", value:0, key:0},
       {menu:"CHAT_INFO", value:1, key:1},
       {menu:"CHAT_WINDOW", value:2, key:2}
    ],
    HISTORY_SESSION_TAB: [
        { name: "全部消息", classes:"bg-border-style6", action: "show_history_session", key: 1 },
        // { name: "全部文件", classes:"bg-border-style6", action: "show_history_file", key: 2,
        //   data: [{text: "已发送文件"},{text: "已接收文件"},{text: "未接收文件"}]}       
    ],
    SEARCH_ROUTES:[
        {menu:"show_shitu_main", text:"识图首页", classes:"default", value:1, key:1},
        {menu:"show_shitu_info", text:"识图列表", classes:"default", value:2, key:2},
        {menu:"show_searchfont_info", text:"文字搜索结果", classes:"default", value:3, key:3},
        {menu:"show_missingfont_info", text:"字体补齐结果", classes:"default", value:4, key:4}
    ],      
    IMG_EXTENSION : "png,jpg,jpeg,gif,bmp,PNG,JPG,JPEG,GIF,BMP",
    IMG_MINI_TYPE : ".png,.jpg,.jpeg,.gif,.bmp,.PNG,.JPG,.JPEG,.GIF,.BMP",
    FORMAT_TYPE: [
        {
            value : 0,
            text : "ALL",
            subText : "所有格式",
            total: 0
        },  
        {
            value : 1,
            text : "PSD",
            subText : "PSD",
            total: 0
        },
        {
            value : 2,
            text : "CDR",
            subText : "CDR",
            total: 0
        },
        {
            value : 3,
            text : "AI",
            subText : "AI",
            total: 0
        },
        {
            value : 4,
            text : "金昌",
            subText : "金昌",
            total: 0,
            data: ["jar", "jc1", "jc8", "jcg", "jch", "jcs"]
        },
        {
            value : 5,
            text : "EPS",
            subText : "EPS",
            total: 0
        },  
        {
            value : 6,
            text : "PDF",
            subText : "PDF",
            total: 0
        },
        {
            value : 7,
            text : "JPG",
            subText : "JPG",
            total: 0,
            data: ["jpg", "jpeg"]
        },
        {
            value : 8,
            text : "PNG",
            subText : "PNG",
            total: 0
        }, 
        {
            value : 9,
            text : "BMP",
            subText : "BMP",
            total: 0
        },
        {
            value : 10,
            text : "TIFF",
            subText : "TIFF",
            total: 0
        },
        {
            value : 100,
            text : "其它",
            subText : "其它",
            total: 0
        }
  ],
  /*
  * typedef enum{
  *    kUnSearch = 0,
  *    kIncluding = 1,     // 包含查询图片
  *    kOnlyTexture = 2,   // 仅外观相似
  *    kBoth = 3,           // 外观和颜色都相似
  * }ResultType
  */
  IMG_CONTAIN_OUTWARD_COLOR : {
      text: 0,
      contain: 1,
      outward: 2,
      outwardColor: 3
  },
  /*
  * IMG_TYPE_CONTENT 用于处理除了里面的格式外的格式。
  */
  IMG_TYPE_CONTENT: ["psd","cdr","ai","jar", "jc1", "jc8", "jcg", "jch", "jcs","eps","pdf","jpg","jpeg","png","bmp","tiff"],
  JIN_CHAN: ["jar", "jc1", "jc8", "jcg", "jch", "jcs"],
  IMG_TYPE_JPG: ["jpg", "jpeg"],
  FILE_TONE: [
        { value : "-100",text : "ALL",subText : "所有颜色", minText : "所有颜色", key:1},  
        { value : "0",text : "黑色调",subText : "黑色",minText : "黑", key:2},
        {value : "1",text : "蓝色调",subText : "蓝色", minText : "蓝", key:3},
        {value : "2",text : "棕色调",subText : "棕色",minText : "棕" , key:4},
        {value : "3",text : "灰色调",subText : "灰色",minText : "灰", key:5},
        { value : "4",text : "绿色调",subText : "绿色", minText : "绿", key:6},
        {value : "5", text : "橙色调",subText : "橙色",minText : "橙", key:7},
        { value : "6",text : "粉色调",subText : "粉色",minText : "粉", key:8},
        {value : "7",text : "紫色调", subText : "紫色",minText : "紫", key:9 },
        {value : "8",text : "红色调",subText : "红色", minText : "红", key:10},
        {value : "9", text : "白色调", subText : "白色", minText : "白", key:11},
        {value : "10", text : "黄色调", subText : "黄色", minText : "黄", key:12}
  ],
  /**
   * 搜索中心Tab数组
   */    
  SEARCH_CENTER_TAB: [
      { name: "图像素材", classes:"bg-border-style2", action: "show_image_material", key: 1 },
      { name: "字体素材", classes:"bg-border-style2", action: "show_font_material", key: 2 }
  ],
  CHANGE_RANGE: {
      loca: { text: "搜本机", subText: '本地', value: 0},
      neighbor: { text: "搜邻居", subText: '局域网', value: 1},
      wide: { text: "广域网", subText: '广域网', value: 2}
  },
  /*
   *识图模式
  */
  SHITU_MODE: {
      image: {
         path: 0,
         base64: 1
      },
      text: 2
  }    
}