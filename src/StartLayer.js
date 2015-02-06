//包含一个登录界面的东西
var StartLayer = cc.Layer.extend({
	startMenu:null,
	haveMenu:null,
    ctor : function (func,objc) {
        this._super();
        this.initBase();
        this.initNetworkLayer(func,objc);
        return true;
    },
    initBase:function(){ 
    	//标题
    	var logoTitle = new cc.Sprite("#startRes_logo.png");
    	logoTitle.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,80)));
    	this.addChild(logoTitle,0);
    	//版本号信息
    	//var versionLabel = new cc.LabelTTF("version:"+versionNumber,s_font,20);
    	var versionLabel = new cc.LabelBMFont("version:"+versionNumber,res.wenzi9);
    	versionLabel.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(150,24)));
    	this.addChild(versionLabel,1);
    },
    initNetworkLayer:function(func,objc){ 
    	//登录自动生成一个账号
    	var randomNumber = Math.floor(Math.random()*800000+100000);
    	PlayerData.myAccount = randomNumber.toString();
    	
    	var startSprite = Helper.createScaleMenuItem("#onLogin_btn.png","#onLogin_char.png",
    			func,objc);
    	this.startMenu = new cc.Menu(startSprite);
    	this.startMenu.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,150)));
    	this.addChild(this.startMenu,1);
    }
});
//等待页面 loading
var WaitLayer = cc.Layer.extend({
	removeTime:null,
	type:null,
	ctor : function (time,type) {
		this._super();
		this.initWaitLayer(time,type);
		return true;
	},
	initWaitLayer: function(time,type) {
		if (time) {
			this.removeTime = time;
		}
		if (type) {
			this.type = type;
		}
		var loadPng = new cc.Sprite("#loadingQuan_0.png");
		loadPng.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,0)));
		this.addChild(loadPng,2);
		var action = cc.sequence(cc.rotateTo(1,180),cc.rotateTo(1,360))
		loadPng.runAction(action.repeatForever());
		
		var loadBao = new cc.Sprite("#loadingQuan_2.png");
		loadBao.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,0)));
		this.addChild(loadBao,0);
		
		if (this.type==1) {
			var loadChar = new cc.Sprite("#loadingQuan_1.png");
			loadChar.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,-130)));
			this.addChild(loadChar,1);
		}
	},
	onEnter:function () {
		this._super();
		var that = this;
		//全部事件都捕获
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				return true;
			},
		}, this);
		if (this.removeTime) {
			this.runAction(cc.sequence(cc.delayTime(this.removeTime),
					cc.callFunc(this.removeSelf,this)));
		}
	},
	removeSelf: function () {
		GameManager.removeWaitLayer();
	}
});
//type的类型
//type==1;默认 只有一个确定按钮
//type==2;确定按钮触发事件,取消按钮关闭页面
//type==3;确定按钮触发事件,取消按钮关闭页面并触发事件
var WarningLayer = cc.Layer.extend({
	targetLabel:null,
	tmpyesFunc:null,
	tmpnoFunc:null,
	ctor:function (sName,parm){
		this._super();
		this.initWarningLayer(sName,parm);
		return true;
	},
	initWarningLayer:function(sName,parm){
		if (parm) {
			if(parm==1) {
				//黑色背景
				var blackLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
				blackLayer.setPosition(-cc.visibleRect.center.x,-cc.visibleRect.center.y);
				this.addChild(blackLayer,0);
			}
		}
		//背景
		var tmpframe = new cc.SpriteFrame(res.warning,cc.rect(0,0,64,64));
		//var capInsets = cc.rect(28,32,32,30);
		var bgSprite = new cc.Scale9Sprite(tmpframe);
		//bgSprite.setCapInsets(capInsets);
		bgSprite.width = 420;
		bgSprite.height = 240;
		bgSprite.setPosition(0,0);
		this.addChild(bgSprite,1);
		//显示文字
		//cc.LabelAutomaticWidth
		this.targetLabel= new cc.LabelBMFont(sName,res.wenzi2,350,cc.TEXT_ALIGNMENT_CENTER);
		this.targetLabel.setAnchorPoint(0.5,1);
		this.targetLabel.setPosition(0,80);
		this.addChild(this.targetLabel,2);
	},
	addYesClosedMenu:function() {
		var menuitem = Helper.createScaleMenuItem("#menu_small1.png","#char_sure.png",
				this.closdThisMenu,this);
		menuitem.setPosition(0,0);
		var btnMenu = new cc.Menu(menuitem);
		btnMenu.setPosition(0,-60);
		this.addChild(btnMenu,1);
	},
	addYesCallbackMenu:function(yesFunc,yesCall,yesTag) {
		var menuitem = Helper.createScaleMenuItem("#menu_small1.png","#char_sure.png",
				this.yesclosdThisMenu,this);
		menuitem.setPosition(0,0);
		menuitem.tag = yesTag;
		this.tmpyesFunc = yesFunc;
		this.tmpyesCall = yesCall;
		var btnMenu = new cc.Menu(menuitem);
		btnMenu.setPosition(0,-60);
		this.addChild(btnMenu,1);
	},
	addYesCallbackNoCloseMenu:function(yesFunc,yesCall,yesTag) {
		var menuitem1 = Helper.createScaleMenuItem("#menu_small1.png","#char_sure.png",
				this.yesclosdThisMenu,this);
		menuitem1.setPosition(-100,0);
		menuitem1.tag = yesTag;
		this.tmpyesFunc = yesFunc;
		this.tmpyesCall = yesCall;

		var menuitem2 = Helper.createScaleMenuItem("#menu_small1.png","#char_cancel.png",
				this.closdThisMenu,this);
		menuitem2.setPosition(100,0);
		var btnMenu = new cc.Menu(menuitem1,menuitem2);
		btnMenu.setPosition(0,-60);
		this.addChild(btnMenu,1);
	},
	addYesCallbackNoCallbackMenu:function(yesFunc,yesCall,yesTag,noFunc,noCall,noTag) {
		var menuitem1 = Helper.createScaleMenuItem("#menu_small1.png","#char_sure.png",
				this.yesclosdThisMenu,this);
		menuitem1.setPosition(-100,0);
		menuitem1.tag = yesTag;
		this.tmpyesFunc = yesFunc;
		this.tmpyesCall = yesCall;
		var menuitem2 = Helper.createScaleMenuItem("#menu_small1.png","#char_cancel.png",
				this.noclosdThisMenu,this);
		menuitem2.setPosition(100,0);
		menuitem2.tag = noTag;
		this.tmpnoFunc = noFunc;
		this.tmpnoCall = noCall;
		var btnMenu = new cc.Menu(menuitem1,menuitem2);
		btnMenu.setPosition(0,-60);
		this.addChild(btnMenu,1);
	},
	yesclosdThisMenu:function(sender) {
		var numTag = sender.tag;
		var tmpNode = new cc.Node();
		tmpNode.tag = numTag;
		this.tmpyesFunc(tmpNode);
		this.removeFromParent(true);
	},
	noclosdThisMenu:function(sender) {
		var numTag = sender.tag;
		var tmpNode = new cc.Node();
		tmpNode.tag = numTag;
		this.tmpnoFunc(tmpNode);
		this.removeFromParent(true);
	},
	closdThisMenu: function() {
		this.removeFromParent(true);
	},
	addYesNormalMenu:function(yesFunc,yesCall,yesTag) {
		var menuitem = Helper.createScaleMenuItem("#menu_small1.png","#char_sure.png",
				yesFunc,yesCall);
		menuitem.tag = yesTag;
		menuitem.setPosition(0,0);
		var btnMenu = new cc.Menu(menuitem);
		btnMenu.setPosition(0,-60);
		this.addChild(btnMenu,1);
	},
	onEnter : function () {
		this._super();
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				return true;
			},
		}, this);
	},
});