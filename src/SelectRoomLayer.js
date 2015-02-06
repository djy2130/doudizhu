//选择哪个房间进行游戏
var SelectRoomLayer = cc.Layer.extend({
	topShowNode:null,
	bottomNode:null,
	btnMenu:null,
	baoNode:null,
	rewardNode:null,
	PlayerNameLabel:null,//玩家的名字
	shouCharSp:null,
	shouCharName:null,
	shouchongbtnMenu:null,
	btnMenuArr:null,
	ctor : function () {
		this._super();
		this.initSelectRoomLayer();
		return true;
	},
	initSelectRoomLayer: function () {
		//顶部的东西
		var topShowNodePos = cc.pAdd(cc.visibleRect.top, cc.p(0,-28));
		this.topShowNode = new TopRoomNode(this.btnCallback,this);
		this.topShowNode.setPosition(topShowNodePos);
		this.addChild(this.topShowNode,1);
		
		//底部的东西
		this.bottomNode = new BottomRoomNode(this.btnCallback,this);
		this.bottomNode.setPosition(cc.visibleRect.bottom);
		this.addChild(this.bottomNode,4);
	},
	//首冲的按钮
	makeOneShouChong:function (){
//		this.shouCharName = new cc.Sprite("#uiroom_shouchar.png");
//		this.shouCharName.setPosition(cc.pAdd(cc.visibleRect.top,cc.p(160,-146)));
//		this.addChild(this.shouCharName,5);
		this.shouCharSp = new cc.Sprite("#uiroom_shousp.png");
		this.shouCharSp.setPosition(cc.pAdd(cc.visibleRect.top,cc.p(160,-100)));
		this.addChild(this.shouCharSp,5);
		var rotateAct = cc.sequence(cc.rotateTo(0.5,-10),cc.rotateTo(0.5,10)).repeatForever();
		this.shouCharSp.runAction(rotateAct);
		
		//#uiroom_shouchar
		var tmItemSprite = new cc.MenuItemSprite(
				new cc.Sprite("#uiroom_shousp.png"),
				new cc.Sprite("#uiroom_shousp.png"),
				this.shouchongCallback,this);
		tmItemSprite.setOpacity(0);
		this.shouchongbtnMenu = new cc.Menu(tmItemSprite);
		this.shouchongbtnMenu.setPosition(cc.pAdd(cc.visibleRect.top,cc.p(160,-100)));
		this.addChild(this.shouchongbtnMenu,5);
	},
	//删除首冲
	deleteShouchong:function (){
		shouCharSp.removeFromParent(true);
		//shouCharName.removeFromParent(true);
		shouchongbtnMenu.removeFromParent(true);
	},
	//首冲事件
	shouchongCallback:function (){
		var testShopLayer = new RechargeLayer();
		testShopLayer.setPosition(0,0);
		this.addChild(testShopLayer,10);
	},
	//新创建的按钮
	newcreateBtnMenuItem:function (){
		//按钮
		this.btnMenuArr = [];
		var midPoint = cc.pAdd(cc.visibleRect.center,cc.p(0,0));
		var everyDis = 212;
		var pointoffsetX = 103+56;
		var pointoffsetY = 103+76;
		var manNumberArr = [PlayerData.Field1,PlayerData.Field2,PlayerData.Field3,PlayerData.Field4];
		for (var i = 0; i < 4; i++) {
			var sName = "#sroom_btn"+i+".png";
			var itemSprite = new cc.Sprite(sName);
			if (i>1) {
				itemSprite.setPosition(midPoint.x+everyDis*(i%2)-everyDis*0.5,midPoint.y-everyDis*0.5);
			}else{
				itemSprite.setPosition(midPoint.x+everyDis*i-everyDis*0.5,midPoint.y+everyDis*0.5);
			}
			this.addChild(itemSprite,2);
			this.btnMenuArr.push(itemSprite);
			//文字
			var manNumLabel = new cc.LabelBMFont(manNumberArr[i]+"人玩",res.wenzi8,
					150,cc.TEXT_ALIGNMENT_RIGHT);
			manNumLabel.tag = 101;
			manNumLabel.setPosition(pointoffsetX,pointoffsetY);
			itemSprite.addChild(manNumLabel,3);
		}
		//getBoundingBox
		//控制事件
		var that = this;
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan:function (touch,event) {
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				var boolTouch = that.onTouchBeganEvent(touchPoint);
				if (boolTouch==true){
					return true;
				}
				return false;
			},
			onTouchMoved:function (touch,event){
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				that.onTouchMovedEvent(touchPoint);
			},
			onTouchEnded:function (touch,event){
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				that.onTouchEndedEvent(touchPoint);
			}
		});
		cc.eventManager.addListener(listener,this);
	},
	onTouchBeganEvent:function(point){
		var hasTouch = false;
		for (var i = 0; i < this.btnMenuArr.length; i++) {
			var element = this.btnMenuArr[i];
			if (hasTouch==false) {
				var mSpriteRect = cc.rect(element.getPositionX()-element.getContentSize().width*0.5,
								element.getPositionY()-element.getContentSize().height*0.5,
								element.getContentSize().width, 
								element.getContentSize().height);
				if (cc.rectContainsPoint(mSpriteRect,point)) {
					hasTouch = true;
					element.scale = 0.95;
				}
			}
		}
		return hasTouch;
	},
	onTouchMovedEvent:function(point){
		var hasTouch = false;
		for (var i = 0; i < this.btnMenuArr.length; i++) {
			var element = this.btnMenuArr[i];
			if (hasTouch==false) {
				var mSpriteRect = cc.rect(element.getPositionX()-element.getContentSize().width*0.5,
						element.getPositionY()-element.getContentSize().height*0.5,
						element.getContentSize().width, 
						element.getContentSize().height);
				if (cc.rectContainsPoint(mSpriteRect,point)) {
					hasTouch = true;
					element.scale = 0.95;
				}else{
					element.scale = 1;
				}
			}else{
				element.scale = 1;
			}
		}
	},
	onTouchEndedEvent:function(point){
		var hasTouch = false;
		for (var i = 0; i < this.btnMenuArr.length; i++) {
			var element = this.btnMenuArr[i];
			element.scale = 1;
			if (hasTouch==false) {
				var mSpriteRect = cc.rect(element.getPositionX()-element.getContentSize().width*0.5,
						element.getPositionY()-element.getContentSize().height*0.5,
						element.getContentSize().width, 
						element.getContentSize().height);
				if (cc.rectContainsPoint(mSpriteRect,point)) {
					hasTouch = true;
					//触发事件
					PlayerData.selectChang = 1+i;
					this.wantToComeScene();
				}
			}
		}
	},
	btnCallback: function (sender) {
		var TagNum = sender.tag;
		cc.log("TagNum %d",TagNum);
		if (TagNum==50) {//返回
		}else if (TagNum==51) {//设置
			var testSettingLayer = new SettingLayer();
			testSettingLayer.setPosition(cc.visibleRect.center);
			this.addChild(testSettingLayer,10);
		}else if (TagNum==52) {//赢 任务
			GameManager.showTipsLayer("暂未开放");
		}else if (TagNum==53) {//机器人
		}else if (TagNum==54) {//聊天
		}else if (TagNum==55) {//广播？
			//sfs.send(new SFS2X.Requests.System.ExtensionRequest("rsg",null));//礼品时间
			GameManager.showTipsLayer("暂未开放");
		}else if (TagNum==56) {//背包
			//sfs.send(new SFS2X.Requests.System.ExtensionRequest("grg",null));//领礼品
			//sfs.send(new SFS2X.Requests.System.ExtensionRequest("pon",null));
			GameManager.showTipsLayer("暂未开放");
		}else if (TagNum==57) {//礼物
			var params = {};
			params.Money = -20000;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("cht",params));
			GameManager.showTipsLayer("暂未开放");
		}else if (TagNum==201) {//商店 这个界面有被缩放
			this.addShopLayer();
		}else if (TagNum==202) {//任务
			var testSettingLayer = new TaskLayer();
			testSettingLayer.setPosition(0,0);
			this.addChild(testSettingLayer,10);
		}else if (TagNum==203) {//头像按钮
			var testSettingLayer = new HandShowLayer(this.handShowCallback,this);
			testSettingLayer.tag = 1870;
			testSettingLayer.setPosition(0,0);
			this.addChild(testSettingLayer,10);
		}
	},
	handShowCallback:function (sender) {
		var TagNum = sender.tag;
		cc.log("TagNum %d",TagNum);
		if (TagNum==101) {//改名字
			var parms = {};
			parms.NickName = PlayerData.sendTmpName;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("cnk",parms));
		}else if (TagNum==102) {//改性别
			var parms = {};
			parms.Gender = 1;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("sgd",parms));
		}else if (TagNum==103) {//改性别
			var parms = {};
			parms.Gender = 2;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("sgd",parms));
		}
	},
	//选房间并进去
	wantToComeScene : function () {
		if (isNetWork) {
			//问服务器我是否已经在房间中
			GameManager.comeToWaitLayer();
			PlayerData.nowRidMsg = RID_STATE.SelectRoom;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("rid",null));
		}else{ //等待函数
			GameManager.changeToNextScene(gameSceneTag.GameScene);
		}
	},
	onEnter:function (){
		this._super();
		this.newcreateBtnMenuItem();
		this.schedule(this.getRoomFromServer,60);
		if(PlayerData.Field1==1000&&PlayerData.Field2==1000&&
				PlayerData.Field3==1000&&PlayerData.Field4==1000){
			this.getRoomFromServer();
		}else{
			this.runAction(cc.sequence(cc.delayTime(10),cc.callFunc(this.getRoomFromServer,
					this)));
		}
		//创建首冲
		if (PlayerData.isFirstRecharge==false) {
			this.makeOneShouChong();
		}
		this.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(this.initPlayerName,this)));
	},
	initPlayerName: function () {
		//玩家名字
		this.PlayerNameLabel = new cc.LabelTTF("","",24);
		this.PlayerNameLabel.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(-50,110)));
		this.addChild(this.PlayerNameLabel,6);
		this.PlayerNameLabel.setString(PlayerData.name);
	},
	getRoomFromServer: function () {
		sfs.send(new SFS2X.Requests.System.ExtensionRequest("pon",null));
	},
	onExit: function() {
		this._super();
		this.btnMenuArr = null;
		this.unschedule(this.getRoomFromServer);
	},
	updataRoomPlayerNum:function () {//更新场人数
		if (this.btnMenuArr!=null) {
			var manNumberArr = [PlayerData.Field1,PlayerData.Field2,PlayerData.Field3,PlayerData.Field4];
			for (var i = 0; i < 4; i++) {
				var element = this.btnMenuArr[i].getChildByTag(101);
				if (element) {
					element.setString(manNumberArr[i]+"人玩");
				}
			}
		}
	},
	updataRoomData:function () {//积分有变化的时候设置
		if (this.bottomNode) {
			if (this.PlayerNameLabel) {
				this.PlayerNameLabel.setString(PlayerData.name);
			}
			this.bottomNode.yuanNumber.setNumber(PlayerData.money);
			var str_score = "积分: "+PlayerData.score;
			this.bottomNode.label_score.setString(str_score);
			this.bottomNode.setHandPngBySex();
		}
	},
	rewardNodeCallback:function(){ //礼品
		sfs.send(new SFS2X.Requests.System.ExtensionRequest("grg",null));//领礼品
	},
	showBaoNode:function() { //礼品节点
		this.baoNode = new cc.Node();
		this.baoNode.setPosition(0,0);
		this.addChild(this.baoNode,0);

		var itemMenu = Helper.createScaleMenuItem("#sTips_daizi.png",null,this.rewardNodeCallback,this);
		itemMenu.setPosition(0,0);
		var btnMenu = new cc.Menu(itemMenu);
		btnMenu.setPosition(0,0);
		this.baoNode.addChild(btnMenu,4);
	},
	addShopLayer:function() { //商店
		var testShopLayer = new ShoppingLayer(MAIN_SCALE);
		testShopLayer.setPosition(0,0);
		this.addChild(testShopLayer,10);
	}
});