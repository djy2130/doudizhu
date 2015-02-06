var GAME_DEPTH = {
		Start:2,//开始
		SelectRoom:3,//选择房间
		Game:5,//游戏层
		Wait:8,//等待层
		Warning:9,//警告层
		ShowTips:10//展示信息层
};
var WarningCharType = {
		DisConnent:1,
		NoYuanBao:2,
		LevelRoom:3,
		HaveInRoom:4,
		NotEnoughRoom:5,
		GiveYuanBao:6,
		TooMuchStrong:7,
		NewSafari:8,
		RetryConnect:9
};
//这个基本层只是界面上的一些基本处理
var BaseNodeScene = cc.Scene.extend({
	bgLayer:null,//背景层 基本不会动的
	startLayer:null,//显示一个按钮的层
	gameLayer:null,//游戏层
	waitLayer:null,//等待层
	selectRoomLayer:null,//选择房间的层
	warningLayerTag:1989,//警告层的tag
	nowTipsNumber:0,//当前提示个数
	ctor:function () {
		this._super();
		return true;
	},
	onEnter:function () {
		this.initBaseNodeScene();
		this._super();
	},
	initBaseNodeScene:function (){
		//背景图片
//		this.bgLayer = new cc.LayerColor(cc.color(255,255,255));
//		this.bgLayer.setPosition(0,0);
//		this.addChild(this.bgLayer,0);
		this.bgLayer = new cc.Layer();
		this.bgLayer.setPosition(0,0);
		this.addChild(this.bgLayer,0);
		
		var bgSprite = new cc.Sprite(gamebgJpg);
		bgSprite.setPosition(cc.visibleRect.center);
		this.bgLayer.addChild(bgSprite);
		if (isFIXED_WIDTHMODE) {
			bgSprite.scaleY = FIXED_SCALE;
		}
		if (!cc.sys.isNative) {
			this.bgLayer.bake();//背景图片不再烘焙
		}
	},
	onExit:function () {
		if (!cc.sys.isNative) {
			if (this.bgLayer!=null) {
				this.bgLayer.unbake();
			}
		}
		this._super();
	},
	//初始化当前的窗口
	setView: function (SceneTag) {
		var lastScene = PlayerData.scene;
		//if (lastScene == SceneTag) { return;}
		PlayerData.scene = SceneTag;
		//重新匹配屏幕尺寸 有一些浏览器很奇怪的
		//删除旧的
		if (lastScene == gameSceneTag.StartScene) {
			this.startLayer.removeFromParent(true);
			this.startLayer = null;
		}else if (lastScene == gameSceneTag.GameScene) {
			this.gameLayer.removeFromParent(true);
			this.gameLayer = null;
		}else if (lastScene == gameSceneTag.SelectRoomScene) {
			this.selectRoomLayer.removeFromParent(true);
			this.selectRoomLayer = null;
		}
		//成立新的
		if (SceneTag == gameSceneTag.StartScene) {
			this.startLayer = new StartLayer(this.startMenuCallback,this);
			this.startLayer.setPosition(0,0);
			this.addChild(this.startLayer,GAME_DEPTH.Start);
		}else if (SceneTag == gameSceneTag.GameScene) {
			this.gameLayer = new GameLayer();
			this.gameLayer.setPosition(0,0);
			this.addChild(this.gameLayer,GAME_DEPTH.Game);
		}else if (SceneTag == gameSceneTag.SelectRoomScene) {
			this.selectRoomLayer = new SelectRoomLayer();
			this.selectRoomLayer.setPosition(0,0);
			this.addChild(this.selectRoomLayer,GAME_DEPTH.SelectRoom);
		}
	},
	startMenuCallback:function(){//开始按钮的触发
	},
	//删掉所有的警告层
	deleteAllWarnLayer:function(){
		Helper.deleteAllChildLayerByTag(this,this.warningLayerTag);
	},
	//展示文字 文字从底端往上飘
	showTipsLayer:function(parm,tmptime){
		var showtime = 1;
		if (tmptime) { showtime = tmptime;}
		if (this.nowTipsNumber<5){
			this.nowTipsNumber=this.nowTipsNumber+1;
			var showNode = new cc.Node();
			showNode.setPosition(cc.visibleRect.bottom);
			this.addChild(showNode,GAME_DEPTH.ShowTips);

			var tipbg = new cc.Sprite("#tips_bg.png");
			tipbg.setPosition(0,0);
			showNode.addChild(tipbg,0);

			var label = new cc.LabelBMFont(parm,res.wenzi12,260,cc.TEXT_ALIGNMENT_CENTER);
//			var label = new cc.LabelTTF(parm,s_font,20,cc.size(260,50),
//			cc.TEXT_ALIGNMENT_CENTER,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
			label.setPosition(0,0);
			showNode.addChild(label,1);

			var seqAction = cc.sequence(cc.moveBy(0.5,0,100),cc.delayTime(showtime),
					cc.fadeTo(1,0),cc.callFunc(this.deleteNowTipsNumber,this),cc.callFunc(Helper.removeSelf,this));
			showNode.runAction(seqAction);
		}
	},
	deleteNowTipsNumber:function(){
		if (this.nowTipsNumber>0) {
			this.nowTipsNumber = this.nowTipsNumber -1;
		}
	},
	updataOtherPlayerData:function(list){//更新左右玩家的钱和性别
		for (var i = 0; i < list.length; i++) {
			var element = list[i];
			var tmpGameId = element.getVariable("GameId").value;
			var tmpPlayerMoney = element.getVariable("Money").value;
			var tmpPlayerSex = element.getVariable("Gender").value;
			if(GameData.rightPlayerId==tmpGameId){
				GameData.rightPlayerSex = tmpPlayerSex;
				this.gameLayer.otherPlayerRight.showBaoLabel(tmpPlayerMoney);
				this.gameLayer.otherPlayerRight.setPlayerSex(tmpPlayerSex);
			}else if(GameData.leftPlayerId==tmpGameId){
				GameData.leftPlayerSex = tmpPlayerSex;
				this.gameLayer.otherPlayerLeft.showBaoLabel(tmpPlayerMoney);
				this.gameLayer.otherPlayerLeft.setPlayerSex(tmpPlayerSex);
			}
		}
	},
	//type==1;您已经断开连接(确定)
	//type==2;哎呀，您的元宝太少啦，去补充些\n元宝就能欺负他们了(确定 取消)
	//type==3;地主说：中途离开，小小罚金少不了。确定离开吗(确定 取消)
	//type==4;您还在其他房间对局哟，现在进去看看吧！(确定 取消)
	//type==5;房间数量超过限制(确定)
	//type==6;"您的元宝不足"+showmoney+",系统免费\n送您"+parm1+"元宝,每天4次";(确定)
	//type==7;"你的实力过于强大，还是去别的场瞧瞧吧";(确定，申请进入中级场，点“取消”，关闭对话框)
	//type==8;您的手机可能需要用最新版\n的Safari才能打开游戏
	//type==9;您的网络不太好，点击确定重连试试
	showYesNoTips:function(type,parm1,parm2){
		var tmpStr;
		var warnLayer;
		if (type==WarningCharType.DisConnent) {
			tmpStr="您已经断开连接";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesClosedMenu();
		}else if (type==WarningCharType.NoYuanBao) {
			tmpStr="哎呀,你的元宝太少啦,去补充些\n元宝就能欺负他们了";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesCallbackNoCallbackMenu(this.showYesNoTips_callback,this,type,
					this.showYesNoTips_callback,this,100+WarningCharType.NoYuanBao);
		}else if (type==WarningCharType.LevelRoom) {
			tmpStr="地主说：中途离开，小小罚金\n少不了。确定离开吗";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesCallbackNoCloseMenu(this.showYesNoTips_callback,this,type);
		}else if (type==WarningCharType.HaveInRoom) {
			tmpStr="您还在其他房间对局哟，现在\n进去看看吧！";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesCallbackNoCloseMenu(this.showYesNoTips_callback,this,type);
		}else if (type==WarningCharType.NotEnoughRoom) {
			tmpStr="房间数量超过限制";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesCallbackMenu(this.showYesNoTips_callback,this,type);
		}else if (type==WarningCharType.GiveYuanBao) {
			var showmoney = 1000;
			tmpStr="您的元宝不足"+showmoney+",系统免费送\n您"+parm2+"元宝(已领取"+parm1+"次),每天4次";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesClosedMenu();
		}else if (type==WarningCharType.TooMuchStrong) {//337411 取消返回弹出开始游戏按钮
			var showmoney = 1000;
			tmpStr="你的实力过于强大，还是去别的场\n瞧瞧吧,点“确定”进入中级场";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesCallbackNoCallbackMenu(this.showYesNoTips_callback,this,
					type,this.showYesNoTips_callback,this,5);
		}else if (type==WarningCharType.NewSafari) {
			tmpStr="您的手机可能需要用最新版\n的Safari才能打开游戏";
			warnLayer = new WarningLayer(tmpStr);
			warnLayer.addYesClosedMenu();
		}else if (type==WarningCharType.RetryConnect){
			tmpStr="您的网络不太好，点击“确定”\n重连试试";
			warnLayer = new WarningLayer(tmpStr,1);
			warnLayer.addYesNormalMenu(this.showYesNoTips_callback,this,type);
		}
		warnLayer.setPosition(cc.visibleRect.center);
		warnLayer.tag = this.warningLayerTag;
		this.addChild(warnLayer,GAME_DEPTH.Warning);
	},
	showYesNoTips_callback:function(sender){
	},
	wantToLevelRoom:function(){//尝试离开房间
		this.showYesNoTips(WarningCharType.LevelRoom);
	},
	comeToWaitLayer:function(time,parm){//wait界面会打断当前界面所有动作
		if(this.waitLayer==null){
			this.waitLayer = new WaitLayer(time,parm);
			this.waitLayer.setPosition(0,0);
			this.addChild(this.waitLayer,GAME_DEPTH.Wait);
		}
	},
	removeWaitLayer:function(){//删除等待层
		if(this.waitLayer){
			this.waitLayer.removeFromParent(true);
			this.waitLayer = null;
		}
	}
})