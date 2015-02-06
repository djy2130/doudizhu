//结果层
var ResultLayer = cc.Layer.extend({
	blackLayer:null,
	showTime:1,
    win : false,
    bgSprite : null,
    btnSp:null,
    parm:false,//0是胜利 其他是失败
    money:0,
    ctor : function (parm,money) {
    	this._super();
    	if (parm) {
    		this.parm = parm;
		}
    	if (money) {
    		this.money = money;
		}
        return true;
    },
    onEnter : function () {
        this._super();
        var that = this;
        //全部事件都捕获
        cc.eventManager.addListener({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		return true;
        	},
        	onTouchEnded: function (touch, event) {
        	}
        }, this);
        this.runAction(cc.sequence(cc.delayTime(this.showTime),
        		cc.callFunc(this.initLayer,this)));
    },
    initLayer: function () {
    	//黑色背景
    	this.blackLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
    	this.blackLayer.setPosition(0,0);
    	this.addChild(this.blackLayer);
    	
    	//light
    	var lightSp = new cc.Sprite("#result_light.png");
    	lightSp.scale = 1.8;
    	lightSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,120)));
    	this.addChild(lightSp);
    	
    	var TopStrName;
    	var CharStr;
    	if (this.parm==true) {//胜利
    		TopStrName = "#result_shengli.png";
    		CharStr = "#result_bg0.png";
    		GameManager.playBgMusic(LoopMusicType.win);
    	}else{
    		TopStrName = "#result_shibai.png";
    		CharStr = "#result_bg1.png";
    		GameManager.playBgMusic(LoopMusicType.fail);
    	}
    	var topSp = new cc.Sprite(TopStrName);
    	topSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,200)));
    	this.addChild(topSp);
    	
    	var leftSp = new cc.Sprite(CharStr);
    	leftSp.setAnchorPoint(1,0.5);
    	leftSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,60)));
    	leftSp.getTexture().setAliasTexParameters();
    	this.addChild(leftSp);
    	
    	var rightSp = new cc.Sprite(CharStr);
    	rightSp.setAnchorPoint(1,0.5);
    	rightSp.scaleX = -1;
    	rightSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,60)));//-1
    	rightSp.getTexture().setAliasTexParameters();
    	this.addChild(rightSp);
    	
    	var baoSp = new cc.Sprite("#result_bao.png");
    	baoSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-70,70)));
    	this.addChild(baoSp);
    	
    	//0农民赢 1地主赢
    	var labelString;
    	if (this.money>=0) {
    		labelString = "+"+this.money;
    	}else{
    		labelString = "-"+Math.abs(this.money);
    	}
    	var bmflabel = new cc.LabelBMFont(labelString,res.wenzi5,
    			cc.LabelAutomaticWidth,cc.TEXT_ALIGNMENT_LEFT);
    	bmflabel.scale = 1.2;
    	bmflabel.setAnchorPoint(0,0.5);
    	bmflabel.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-32,72)));
    	this.addChild(bmflabel);
    	
    	var menuitem1 = Helper.createScaleMenuItem("#result_btn0.png","#result_char0.png",this.menucallback,this);
    	menuitem1.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-90,-140)));
    	menuitem1.tag = 211;
    	
    	var menuitem2 = Helper.createScaleMenuItem("#result_btn1.png","#result_char1.png",this.menucallback,this);
    	menuitem2.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(90,-140)));
    	menuitem2.tag = 212;

    	//退出按钮
    	var everyDis = 70;
    	var topShowNodePos = cc.pAdd(cc.visibleRect.top, cc.p(-(everyDis*4)*0.5,-30));
    	var menuitemBack = Helper.createScaleMenuItem("#uitop_btn1.png",null,this.menucallback,this);
    	menuitemBack.setPosition(topShowNodePos);
    	menuitemBack.tag = 210;
    	
    	this.btnMenu = new cc.Menu(menuitem1,menuitem2,menuitemBack);
    	this.btnMenu.setPosition(0,0);
    	this.addChild(this.btnMenu,1);
    },
    menucallback:function(sender){
    	var numTag = sender.tag;
    	if (isNetWork) {
    		if (numTag==210) {//退回选房间界面
    			if (PlayerData.roomId!=-1) {//已经退了房间
    				sfs.send(new SFS2X.Requests.System.ExtensionRequest("klr",null,
    						sfs.roomManager.getRoomById(PlayerData.roomId)));
    			}
    			GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
    			GameManager.removeWaitLayer();
    		}else if (numTag==211) {//继续
    			GameManager.restartGameLayer();
    			GameManager.comeToWaitLayer();
    			GameManager.sendMessageToMTP();//申请进入场
    		}else if (numTag==212) {//分享
    			
    		}
		}
    },
});