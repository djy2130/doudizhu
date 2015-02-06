var isFIXED_WIDTHMODE = false;//是否是适应屏幕的宽屏模式
var FIXED_SCALE = 1;//缩放模式的系数
var MAIN_SCALE = 1;//经过修正的系数
var isTestMode = true;//是否是测试模式,可以一下子出20张牌
var isComeGameScene = false;//是否立刻进入游戏模式
var isNetWork = true;//是否启动网络模式
var isHasStartLoginUI = true;//是否包含登录界面
var versionNumber = 0.9029;//版本号 0.9019
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    if (cc.sys.isNative){ //jsb
    	cc.view.setDesignResolutionSize(450,800, cc.ResolutionPolicy.FIXED_WIDTH);
    	isFIXED_WIDTHMODE = true;
    	//cc.view.setDesignResolutionSize(450,800, cc.ResolutionPolicy.SHOW_ALL);
    }else{
    	if (cc.sys.isMobile){
    		cc.view.setDesignResolutionSize(450,800, cc.ResolutionPolicy.FIXED_WIDTH);
    		isFIXED_WIDTHMODE = true;
    	}else{
    		//网页端显示
    		cc.view.setDesignResolutionSize(450,800, cc.ResolutionPolicy.SHOW_ALL);
    	}
    }
    //cc.log("cc.sys.platform "+cc.sys.platform);//设备类型
    //cc.log("cc.sys.browserType "+cc.sys.browserType);//浏览器的类型
    cc.view.resizeWithBrowserSize(true);
    
    //设置正交投影
    cc.director.setProjection(cc.Director.PROJECTION_2D);

    if (isFIXED_WIDTHMODE) { //或许拿高度的比值就行了 宽度都是450不变了
    	var maxheight = cc.director.getVisibleSize().height;
    	if (cc.director.getVisibleSize().height<cc.director.getVisibleSize().width) {
    		maxheight = cc.director.getVisibleSize().width;
		}
    	//FIXED_SCALE = (maxheight / maxwidth)/1.777;//16/9=1.777
    	FIXED_SCALE = maxheight/800;//标准长度//修正系数
    	if (FIXED_SCALE>=1){FIXED_SCALE=1;}//按照比例一定缩放
    	else{MAIN_SCALE=1-(1-0.9)/(1-0.75)*(1-FIXED_SCALE);}//1-0.9之间
    	cc.log("win %d %d %d",maxheight,FIXED_SCALE,MAIN_SCALE);
    }
    //cc.log("win %d %d",cc.director.getVisibleSize().width,cc.director.getVisibleSize().height);
    //一开始读完load的资源后 读取
    cc.LoaderScene.preload(start_resources,function(){
    	cc.spriteFrameCache.addSpriteFrames(startPlist);
    	MyLoaderScene.preload(g_resources,function(){
    		for (var i in plistRes){
    			cc.spriteFrameCache.addSpriteFrames(plistRes[i]);
    		}
    		GameManager.runStartScene();
    	},this);
    },this);
};
cc.game.run();