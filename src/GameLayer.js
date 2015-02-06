var GameLayerDEPTH = {
		result:14,//结果层
		popLayer:13,//弹出的其他层
		cardsAni:12,//卡牌动画层
		ui:11,//顶部和底部的ui
		talkShow:10,//对话的节点
		littleNode:9,//礼物按钮和任务按钮
		manageNode:8,//管理节点
		midmenu:7,//中间按钮
		control:5,//卡牌层的深度
		showLayer:4,//展示层深度
		moreCardNode:3,//多余3张牌的位置
		otherPlayer:2,//其他玩家深度
};
var GameLayerState = {
		Ready:1,//准备
		Game:2,//游戏
};
var PngTipsType = {//打印出来的文字
	youNoMoney:0,
	noRule:1,
	noBigCard:2,
	otherNoMoney:3,
}
var GameLayer = cc.Layer.extend({
	state:GameLayerState.Ready,
	showLayer:null,//展示层//出牌时展示的层
	controlLayer:null,//控制层 放入游戏层中 控制整个卡牌的打出
	menuNode:null,//按钮节点层
	showMoreCardNode:null,//展示多余卡的层
	otherPlayerRight:null,//右边玩家
	otherPlayerLeft:null,//左边玩家
	topShowNode:null,//顶部的节点
	bottomShowNode:null,//底部的节点
	startMenu:null,//开始按钮
	myManageLayer:null,//托管节点
	resultLayer:null,//结果层
	talkShowLayer:null,//对话展示节点
	giftNode:null,//在线礼包节点
	jiangNode:null,//奖励节点
	musicQueueNode:null,
	ctor:function () {
		this._super();
		this.initThisLayer();//初始化上下边界
		return true;
	},
	initThisLayer:function(){ //初始化游戏开始的信息
		//顶部的东西
		var topShowNodePos = cc.pAdd(cc.visibleRect.top,cc.p(0,-28));
		this.topShowNode = new TopGameShowNode(this.btnCallback,this,topShowNodePos);
		this.topShowNode.setPosition(topShowNodePos);
		this.addChild(this.topShowNode,GameLayerDEPTH.ui);
		//底部的东西
		this.bottomShowNode = new BottomShowNode(this.btnCallback,this,PlayerData.selectChang);
		this.bottomShowNode.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,20)));
		this.addChild(this.bottomShowNode,GameLayerDEPTH.ui);
		this.bottomShowNode.setShowLabel(true);
		//展示多余卡的层
		this.showMoreCardNode = new cc.Node();
		this.showMoreCardNode.setPosition(cc.pAdd(cc.visibleRect.center,
				cc.p(-15,Helper.scaleValue(158,128))));
		this.addChild(this.showMoreCardNode,GameLayerDEPTH.moreCardNode);
		//场上的显示层
		this.showLayer = new ShowLayer();
		this.showLayer.setPosition(0,0);
		this.addChild(this.showLayer,GameLayerDEPTH.showLayer);
		//卡牌控制层
		this.controlLayer = new ControlLayer();
		this.controlLayer.setPosition(0,0);
		this.addChild(this.controlLayer,GameLayerDEPTH.control);
		//我的按钮节点
		this.menuNode = new MenuNode(this.menuNodeTouch,this);
		this.menuNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,270)));//300
		this.addChild(this.menuNode,GameLayerDEPTH.midmenu);
		//初始化其他玩家层
		this.initOthersLayer();
		//对话节点对应的接口
		var tmpWorldPosLeft = this.otherPlayerLeft.convertToWorldSpace(cc.p(-1*this.otherPlayerLeft.manageNodeX,
				this.otherPlayerLeft.manageNodeY));
		var tmpWorldPosRight = this.otherPlayerRight.convertToWorldSpace(cc.p(this.otherPlayerRight.manageNodeX,
				this.otherPlayerRight.manageNodeY));
		//对话节点
		this.talkShowLayer = new TalkShowLayer(tmpWorldPosLeft,tmpWorldPosRight);
		this.talkShowLayer.setPosition(0,0);
		this.addChild(this.talkShowLayer,GameLayerDEPTH.talkShow);
		//
		if (PlayerData.GiftTime>-1) { 
			this.showGift();//初始化节点
		}
		
		//任务节点
		this.jiangNode = new MyJiangNode(this.JiangNodeCallback,this);
		this.jiangNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(180,340)));
		this.addChild(this.jiangNode,GameLayerDEPTH.littleNode);	
		this.updataJiangNode();
		
		//声音节点
		this.musicQueueNode = new MusicQueueNode();
		this.musicQueueNode.setPosition(0,0);
		this.addChild(this.musicQueueNode,GameLayerDEPTH.littleNode);
		
		//开始进去的时候
		this.setLayerState(GameLayerState.Ready);
	},
	//设置当前的窗口
	setLayerState: function (layerState) {
		if (layerState == GameLayerState.Ready){
			this.state = GameLayerState.Ready;
			this.makeStartGameMenu();//创建按钮
			//隐藏其他界面
			this.bottomShowNode.setShowLabel(true);
			//奖励节点
			this.jiangNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(180+1000,340)));
			//礼品
			if (this.giftNode) {
				this.giftNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(-180+1000,350)));
			}
		}else if (layerState == GameLayerState.Game){
			this.state = GameLayerState.Game;
			if (this.startMenu){
				this.startMenu.removeFromParent(true);
				this.startMenu = null;
			}
			//显示各种界面
			this.bottomShowNode.setShowLabel(false);
			this.jiangNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(180,340)));
			if (this.giftNode) {
				this.giftNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(-180,350)));
			}
		}
	},
	btnCallback:function(sender) {
		var numTag = sender.tag;
		if (numTag==50) {//离开房间
			if (PlayerData.roomId!=-1) {//还在房间中
				var scene = cc.director.getRunningScene();
				scene.wantToLevelRoom();
				//sfs.send(new SFS2X.Requests.System.ExtensionRequest("klr",null,
				//			sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else{
				GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
				GameManager.removeWaitLayer();
			}
		}else if (numTag==51) {//设置
			var testSettingLayer = new SettingLayer();
			testSettingLayer.setPosition(cc.visibleRect.center);
			this.addChild(testSettingLayer,GameLayerDEPTH.popLayer);
		}else if (numTag==52) {//赢
			if(this.state==GameLayerState.Game) {
				GameManager.showTipsLayer("暂未开放");
			}
		}else if (numTag==53) {//托管
			if(this.state==GameLayerState.Game) {
				if (GameData.isTuoGuan==false) {
					var params = {};
					params.Auto=2;//我手动托管
					sfs.send(new SFS2X.Requests.System.ExtensionRequest("atm",params,
							sfs.roomManager.getRoomById(PlayerData.roomId)));
				}
			}
		}else if (numTag==54) {//聊天 这里是外面选择的窗口
			if(this.state==GameLayerState.Game) {
				var testTalkLayer = new TalkLayer();
				testTalkLayer.tag = POPLAYER_TAG.TalksLayer;
				testTalkLayer.setPosition(0,0);
				this.addChild(testTalkLayer,GameLayerDEPTH.popLayer);
			}
		}else if (numTag==123) {//加钱
			if(this.state==GameLayerState.Game) {
				this.addShopLayer();
			}
		}
	},
	MyManageCallback:function() {
		if (isNetWork) {//托管
			var params = {};params.Auto=1;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("atm",params,
					sfs.roomManager.getRoomById(PlayerData.roomId)));
		}
	},
	//按钮touch函数
	menuNodeTouch : function(sender) {
		var numTag = sender.tag;
		cc.log("numTag %d",numTag);
		if (isNetWork) {
			if (numTag==70) { //70 = 提示 
				//按钮不消失
			}else if(numTag == 75){ //明牌
				this.menuNode.removeMingMenu();//点击了一次明牌后消失不见
			}else if(numTag == 78){ //出牌
			}else{ //其他消失
				this.menuNode.setMenuState(menuNodeCallState.start);//点按钮之后消失
				this.showLayer.setClockSpState(ClockPosition.Start);//时钟消失
			}
			if (numTag==70) {//提示 没有提示就不出牌
				//场上的牌是我出的,当前是我的出牌回合
				if(GameData.nowCardsPot==GameData.myPlayerPot){
					this.controlLayer.aiSelectCards(null,GameData.myCards)
				}else{//不是我的出牌回合
					if(!this.controlLayer.aiSelectCards(GameData.nowCards,GameData.myCards)){
						this.controlLayer.setAllCardsNormal();
						var params = {};
						params.Pass=1;
						sfs.send(new SFS2X.Requests.System.ExtensionRequest("scr",params,
								sfs.roomManager.getRoomById(PlayerData.roomId)));
					}
				}
			}else if (numTag==71) {//1 = 叫地主
				var params = {};
				params.Pass=0;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cll",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==72) {//2 = 不叫
				var params = {};
				params.Pass =1;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cll",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==73) {//3 = 抢地主
				var params = {};
				params.Pass =0;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cll",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==74) {//4 = 不抢
				var params = {};
				params.Pass =1;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cll",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==75) {//5 = 明牌
				var params = {};
				params.Pass =0;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("opc",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==76) {//6 = 加倍
				var params = {};
				params.Pass =0;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("rfc",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==77) {//7 = 不加倍 蓝色
				var params = {};
				params.Pass =1;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("rfc",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (numTag==78) {//8 = 出牌 蓝色
				this.sendMessageToChuPai();
			}else if (numTag==79) {//9 = 不出
				//失败将所有牌清零
				this.controlLayer.setAllCardsNormal();
				var params = {};
				params.Pass=1;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("scr",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}
		}
	},
	//初始化其他玩家
	initOthersLayer:function () {
		var Pianyi = (1-FIXED_SCALE)*200; // 0 - 50
		var PianScale = 1-(1-FIXED_SCALE)*0.72; // 1 - 0.82
		//cc.log("Pianyi %d %d",Pianyi,PianScale)
		this.otherPlayerRight = new OtherPlayerLayer(1);
		this.otherPlayerRight.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(Pianyi,0)));
		this.addChild(this.otherPlayerRight,GameLayerDEPTH.otherPlayer);
		this.otherPlayerRight.scale = PianScale;

		this.otherPlayerLeft = new OtherPlayerLayer(2);
		this.otherPlayerLeft.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-1*Pianyi,0)));
		this.addChild(this.otherPlayerLeft,GameLayerDEPTH.otherPlayer);
		this.otherPlayerLeft.scale = PianScale;
		//这些坐标还要各种调整
		this.otherPlayerRight.setThisNodeVisible(false);
		this.otherPlayerLeft.setThisNodeVisible(false);
		//0.75 - 1 之间调整 坐标整体向左边或者右边偏移
	},
	makeStartGameMenu: function() {//设置开始按钮
		if (this.startMenu==null){
			var startSprite = Helper.createScaleMenuItem("#onLogin_btn.png",
					"#onLogin_char.png",this.startGameCallback,this);
			this.startMenu = new cc.Menu(startSprite);
			this.startMenu.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,-170)));
			this.addChild(this.startMenu,GameLayerDEPTH.ui);
		}
	},
	startGameCallback: function() {//开始搜索玩家开始
		if (this.startMenu){
			this.startMenu.removeFromParent(true);
			this.startMenu = null;
		}
		if (isNetWork) {//这个时候应该已经在房间中	
			GameManager.sendMessageToMTP();
			GameManager.comeToWaitLayer(null,1);
		}	
	},
	//服务器发回的信息
	playOneGameStartAni: function() {//所有人都准备好
		//显示我的牌
		this.setMyCardsAnimate(GameData.myCards);
		//初始化玩家层
		this.otherPlayerRight.setThisNodeVisible(true); 
		this.otherPlayerLeft.setThisNodeVisible(true);
		this.otherPlayerRight.paiNumLabel.setString("17"); 
		this.otherPlayerLeft.paiNumLabel.setString("17");
		//开局不可能托管状态
		if(this.myManageLayer){
			this.myManageLayer.removeFromParent(true);
			this.myManageLayer = null;
		}
		this.menuNode.setInManage(false);
		//倒计时1s后发牌结束
		this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(this.fapaiFinish_callback,this)));
	},
	//发牌完了 开始抢地主
	fapaiFinish_callback: function() {
		if (isNetWork) {
			//客户端准备好了
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("gcr",null,
					sfs.roomManager.getRoomById(PlayerData.roomId)));
		}
	},
	///出牌并发送出牌信息  出牌
	sendMessageToChuPai:function () {
		var childArr = this.controlLayer.getChildren();
		var selectArr = [];
		for (var i = 0; i < childArr.length; i++) {
			var child = childArr[i];
			if (child.isSelect==true) {
				var newValue = GameData.myCards[child.tag];
				selectArr.push(newValue);
			}
		}
		if (selectArr.length>1) {
			selectArr = Logic.sortCards(selectArr);//排序
		}
		var isHuiTui = true;//是否回退
		var checkType = Logic.getNowCardType(selectArr);//牌类型
		cc.log("checkType %s",checkType);
		if (checkType!=CardType.Error) {//错误error
			selectArr = Logic.AdjustCards(selectArr,checkType);
			if (GameData.nowCardsPot==GameData.myPlayerPot) {//轮到我出牌
				isHuiTui = false;
			}else{//不是论到我出牌
				//判断大小能不能出
				if (Logic.comparisonCard(selectArr,checkType,
						GameData.nowCards,GameData.nowCardsType)){
					isHuiTui = false;
				}
			}
		}
		////作弊码/////
		if (isTestMode) {
			if (isHuiTui) {
				if (selectArr.length>15) {
					isHuiTui = false;
					checkType = 1;
				}
			}
		}
		////////////
		if (isHuiTui) {
			this.showPngTips(PngTipsType.noRule);
			//失败将所有牌清零
			//this.controlLayer.setAllCardsNormal();
		}else{
			//成功按钮消失
			this.menuNode.setMenuState(menuNodeCallState.start);//点按钮之后消失
			this.showLayer.setClockSpState(ClockPosition.Start);//时钟消失
			//正确类型 出牌
			Logic.printCards(selectArr);
			if (isNetWork) {
				var params = {};
				params.Pass=0;
				params.Cards= selectArr;
				params.Type= checkType;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("scr",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else{
				GameData.myCards = Logic.selectNewsCards(GameData.myCards,selectArr);
				//全局信息
				GameData.nowCards = selectArr;//现在场上的牌
				GameData.nowCardsType = checkType;//
				GameData.nowCardsPot = GameData.myPlayerId;//这次是我的回合
				//展示场上的牌
				GameManager.comeToNextPlayer();
			}
		}
	},
	///轮到某个人抢地主
	setOneQiang:function (posId,isfirst) {
		if (posId==GameData.myPlayerPot) {//轮到我抢地主
			if(isfirst){
				this.menuNode.setMenuState(menuNodeCallState.first);
			}else{
				this.menuNode.setMenuState(menuNodeCallState.qiang);
			}
			this.showLayer.setClockSpState(ClockPosition.My);
			this.showLayer.startClockByState(ClockCountdown.Dizhu);
			this.showLayer.myNode.removeAllChildren(true);
		}else if (posId==GameData.rightPlayerPot) {//右边的人
			this.showLayer.setClockSpState(ClockPosition.Right);
			this.showLayer.startClockByState(ClockCountdown.Dizhu);
			this.showLayer.rightNode.removeAllChildren(true);
		}else{//左边的人
			this.showLayer.setClockSpState(ClockPosition.Left);
			this.showLayer.startClockByState(ClockCountdown.Dizhu);
			this.showLayer.leftNode.removeAllChildren(true);
		}
	},
	//1叫 2不叫 3抢 4不抢 -1不做处理
	showOneQiang:function (posId,jdstate){
		if (jdstate==1) {  //1叫
			GameData.firstJiao=true;
			GameManager.playSound(MusicType.jiao,posId);
			this.showLayer.addText(posId,5);
		}else if (jdstate==2){//2不叫
			GameManager.playSound(MusicType.bujiao,posId);
			this.showLayer.addText(posId,2);
		}else if (jdstate==3){//3抢
			GameManager.playSound(MusicType.qiang,posId);
			this.showLayer.addText(posId,6);
		}else if (jdstate==4){//4不抢
			GameManager.playSound(MusicType.buqiang,posId);
			this.showLayer.addText(posId,3);
		}
	},
	///轮到加倍阶段
	setJiaBei:function (isCanJia) {
		if (isCanJia==1) { //我能加倍
			this.showLayer.setClockSpState(ClockPosition.My);
			this.showLayer.startClockByState(ClockCountdown.JiaBei);
			this.menuNode.setMenuState(menuNodeCallState.jiabei);
		}else{ //提示我不能加倍
			if (isCanJia==2){//对方不能加倍
				this.showPngTips(PngTipsType.otherNoMoney);
			}else{ //0 自己不能加倍
				this.showPngTips(PngTipsType.youNoMoney);
			}
			this.menuNode.setMenuState(menuNodeCallState.start);//点按钮之后消失
			this.showLayer.setClockSpState(ClockPosition.Start);//时钟消失
			//我不能加倍 自动发信息
			var params = {};
			params.Pass =1;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("rfc",params,
					sfs.roomManager.getRoomById(PlayerData.roomId)));
		}
	},
	//展示一个人的加倍
	showOneJiaBei:function(posId,isJia) {
		cc.log(posId+"JiaBei:"+isJia);
		GameData.JiaBeiCount = GameData.JiaBeiCount + 1;
		if (GameData.JiaBeiCount==1) {
			this.showLayer.clearAll();//清除上一个内容
		}
		var tmpSoundSex=1;
		if (posId==GameData.myPlayerPot){
			tmpSoundSex = PlayerData.sex;
		}else if (posId==GameData.rightPlayerPot){
			tmpSoundSex = GameData.rightPlayerSex;
		}else{
			tmpSoundSex = GameData.leftPlayerSex;
		}
		var tmpData = 0;
		if(isJia==1){
			//1男生加倍//2女生加倍//3男不加倍//4女不加倍
			if (tmpSoundSex==1){tmpData=1;}else{tmpData=2;}
			if(PlayerData.isMusic){
				this.musicQueueNode.play(tmpData);
			}
			//GameManager.playSound(MusicType.jiabei,posId);
			this.showLayer.addText(posId,4);//加倍
		}else if(isJia==0){
			if (tmpSoundSex==1){tmpData=3;}else{tmpData=4;}
			if(PlayerData.isMusic){
				this.musicQueueNode.play(tmpData);
			}
			//GameManager.playSound(MusicType.bujiabei,posId);
			this.showLayer.addText(posId,1);//不加倍
		}
	},
	///轮到某个人明牌
	setMingPai:function () {
		if (GameData.dizhuId==GameData.myPlayerPot) {
			this.menuNode.setMenuState(menuNodeCallState.mingpai);
		}else{
			this.menuNode.setMenuState(menuNodeCallState.start);
		}
	},
	///展示前一个回合场上的情况
	showOneTurn:function (posId,ischangchange,isfirstChuPai,trunNum) {
		if (trunNum>0) {//第一个回合场上没卡
			if (ischangchange) { //上一个玩家出牌了
				var tmpcardLength;
				if (GameData.nowCardsPot==GameData.myPlayerPot) {//之前当前场上的牌是我出的
					this.showLayer.showCards(GameData.myPlayerPot,GameData.nowCards);
					tmpcardLength = GameData.myCards.length;
				}else if (GameData.nowCardsPot==GameData.rightPlayerPot) {//右边出了牌
					this.showLayer.showCards(GameData.rightPlayerPot,GameData.nowCards);
					tmpcardLength = GameData.rightCards.length;
				}else if (GameData.nowCardsPot==GameData.leftPlayerPot) {//左边出了牌
					this.showLayer.showCards(GameData.leftPlayerPot,GameData.nowCards);
					tmpcardLength = GameData.leftCards.length;
				}
				this.showCardAnimate(GameData.nowCardsPot,GameData.nowCardsType);
				//cc.log("tmpcardLength:"+tmpcardLength);
				if (isfirstChuPai){ //场上的牌是第一个回合出的
					GameManager.playCardTypeMusic(GameData.nowCardsType,tmpcardLength,GameData.nowCardsPot);
				}else{ //顶牌
					if(GameData.nowCardsType==CardType.HuoJian){
						GameManager.playSound(MusicType.huojian,GameData.nowCardsPot);//大你
					}else if(GameData.nowCardsType==CardType.Bomb){
						GameManager.playSound(MusicType.bomb,GameData.nowCardsPot);//大你
					}else{
						GameManager.playSound(MusicType.dani,GameData.nowCardsPot);//大你
					}
				}
				//明牌测试
//				if (GameData.nowCardsPot==GameData.leftPlayerPot) {
//					this.otherPlayerLeft.showMingPai(GameData.leftCards);
//				}
				//明牌测试
//				if (GameData.nowCardsPot==GameData.rightPlayerPot) {
//					this.otherPlayerRight.showMingPai(GameData.rightCards);
//				}
				if (GameData.isMingPai==1){ //明牌
					if (GameData.nowCardsPot==GameData.dizhuId){
						if (GameData.nowCardsPot == GameData.rightPlayerPot) {
							this.otherPlayerRight.showMingPai(GameData.rightCards);//当前的卡
						}else if (GameData.nowCardsPot == GameData.leftPlayerPot) {
							this.otherPlayerLeft.showMingPai(GameData.leftCards);
						}
					}
				}
			}else{ //上一个玩家没有出牌
				//上个玩家的位置
				var lastPlayerPot = (posId-1)<0?2:(posId-1);
				GameManager.playSound(MusicType.pass,lastPlayerPot);
				this.showLayer.addText(lastPlayerPot,0);//不出
			}
		}
	},
	///轮到我的回合了
	setOneTurn:function (posId,trunNum) {
		//展示按钮 和 时钟 //到某人的回合
		this.menuNode.setMenuState(menuNodeCallState.start);
		if (posId==GameData.myPlayerPot) {//轮到我出牌
			this.showLayer.myNode.removeAllChildren(true);//我的牌消去
			if (trunNum==0) {//第一回合
				this.menuNode.setMenuState(menuNodeCallState.mingpai);
				this.showLayer.setClockSpState(ClockPosition.MyTwo);
			}else{//不是第一个回合
				if (GameData.nowCardsPot == GameData.myPlayerPot) {//场上的牌是我出的
					this.menuNode.setMenuState(menuNodeCallState.chupai);
					this.showLayer.setClockSpState(ClockPosition.My);
				}else{//不是我出的
					this.menuNode.setMenuState(menuNodeCallState.normal);//正常出牌
					this.showLayer.setClockSpState(ClockPosition.MyTwo);
				}
			}
			if(GameData.isTuoGuan){//托管的时候不显示时钟
				this.showLayer.setClockSpState(ClockPosition.Start);
			}
			this.showLayer.startClockByState(ClockCountdown.ChuPai);
		}else if (posId==GameData.rightPlayerPot) {
			this.showLayer.rightNode.removeAllChildren(true);//我的牌消去
			this.showLayer.setClockSpState(ClockPosition.Right);
			this.showLayer.startClockByState(ClockCountdown.ChuPai);
		}else if (posId==GameData.leftPlayerPot) {
			this.showLayer.leftNode.removeAllChildren(true);//我的牌消去
			this.showLayer.setClockSpState(ClockPosition.Left);
			this.showLayer.startClockByState(ClockCountdown.ChuPai);
		}
	},
	//展示我当前的卡
	setMyCards:function (cards) {
		this.controlLayer.setMyCards(cards);
	},
	//一开始发牌的时候使用 有动画
	setMyCardsAnimate:function (cards) {
		this.controlLayer.setMyCardsAnimate(cards);
	},
	//展示多余的3张牌在桌面
	setShowThreeCardNode :function (cards) {
		this.showMoreCardNode.removeAllChildren(true);
		var normalDis = 16;
		var PianScale = 1-(1-FIXED_SCALE)*0.72;//卡牌的大小
		for (var i = 0; i < cards.length; i++) {
			var testSp = new CardSprite(cards[i]);
			testSp.setPosition(i*normalDis,0);
			testSp.scale = 0.5*PianScale;
			this.showMoreCardNode.addChild(testSp,1);
		}
	},
	//抢地主结束时的操作
	showDiZhuFinish:function (tmpCards) {
		if (GameData.dizhuId == GameData.myPlayerPot) {
			GameData.myCards = null;
			GameData.myCards = Logic.copyToCards(tmpCards);
			this.setMyCards(GameData.myCards);
		}else if (GameData.dizhuId == GameData.rightPlayerPot) {
			GameData.rightCards = null;
			GameData.rightCards = Logic.copyToCards(tmpCards);
			this.otherPlayerRight.showCardNumber(GameData.rightCards);
			this.otherPlayerRight.setDiZhuTexture();
		}else{
			GameData.leftCards = null;
			GameData.leftCards = Logic.copyToCards(tmpCards);
			this.otherPlayerLeft.showCardNumber(GameData.leftCards);
			this.otherPlayerLeft.setDiZhuTexture();
		}
		//展示底牌在屏幕上 多余的卡
		this.setShowThreeCardNode(GameData.threeCards);
	},
	//展示托管和掉线状态
	showTuoGuan:function (posId,autoState) {
		if (posId==GameData.myPlayerPot){
			if (autoState==2) {//1用户 2托管 3Ai 4离线托管
				this.myManageLayer = new MyManageLayer(this.MyManageCallback,this);
				this.myManageLayer.setPosition(0,0);
				this.addChild(this.myManageLayer,GameLayerDEPTH.manageNode);
				this.menuNode.setInManage(true);//设置消失按钮
				this.showLayer.setInManage(true);
				GameData.isTuoGuan=true;
			}else{
				GameData.isTuoGuan=false;
				if(this.myManageLayer){
					this.myManageLayer.removeFromParent(true);
					this.myManageLayer = null;
				}
				this.menuNode.setInManage(false);//设置消失按钮
				this.showLayer.setInManage(false);
			}
		}else if (posId==GameData.rightPlayerPot) {
			if (autoState==2) {//3
				this.otherPlayerRight.showManageNode();
			}else if (autoState==4) {
				this.otherPlayerRight.showUnOnline();
			}else{
				this.otherPlayerRight.hideManageNode();
			}
		}else if (posId==GameData.leftPlayerPot) {
			if (autoState==2){//3
				this.otherPlayerLeft.showManageNode();
			}else if (autoState==4) {
				this.otherPlayerLeft.showUnOnline();
			}else{
				this.otherPlayerLeft.hideManageNode();
			}
		}
	},
	updataData:function () {//更新钱
		if (this.bottomShowNode) {
			this.bottomShowNode.yuanNumber.setNumber(PlayerData.money);
			this.bottomShowNode.beiNumber.setNumber(PlayerData.beiShu);
		}
	},
	addResultLayer:function () {//游戏结束  结果层
		if (!this.resultLayer) {
			this.showLayer.setClockSpState(ClockPosition.Start);
			var ismyWinGame = false;//没赢得游戏
			if (GameData.winner ==1){//地主赢了
				if (GameData.myPlayerPot == GameData.dizhuId){
					ismyWinGame = true;
				}
			}else{ //农民赢了
				if (GameData.myPlayerPot != GameData.dizhuId){
					ismyWinGame = true;
				}
			}
			//按钮
			this.menuNode.setMenuState(menuNodeCallState.start);//正常出牌
			this.showLayer.setClockSpState(ClockPosition.Start);//
			//删除托管
			if(this.myManageLayer){
				this.myManageLayer.removeFromParent(true);
				this.myManageLayer = null;
			}
			
			this.resultLayer = new ResultLayer(ismyWinGame,GameData.income);
			this.resultLayer.setPosition(0,0);
			this.addChild(this.resultLayer,GameLayerDEPTH.result);
		}
	},
	removeResultLayer:function () {
		if (this.resultLayer) {
			this.resultLayer.removeFromParent(true);
			this.resultLayer = null;
		}
	},
	showChatList:function (num) { 
		var whochat = Math.floor(num/100)-1;//谁说的 解析 0,1,2
		var talkchat = num%100;//对话内容
		this.talkShowLayer.showTalk(whochat,talkchat);
	},
	restartGameLayer:function () { //重新开始选场
		cc.log("重新开始选场");
		this.showMoreCardNode.removeAllChildren(true);
		this.showLayer.clearAll();
		this.showLayer.isInManage = false;
		this.showLayer.setClockSpState(ClockPosition.Start);
		this.controlLayer.removeAllChildren(true);
		this.menuNode.setMenuState(menuNodeCallState.start);
		this.otherPlayerRight.restart();
		this.otherPlayerLeft.restart();
		//我取消托管状态
		GameData.isTuoGuan=false;
		
		if(this.myManageLayer){//如果有展示节点 弄消失
			this.myManageLayer.removeFromParent(true);
			this.myManageLayer = null;
		}
		this.menuNode.setInManage(false);
		
		if (PlayerData.roomId==-1) {//不在房间里
			this.otherPlayerRight.setThisNodeVisible(false);
			this.otherPlayerLeft.setThisNodeVisible(false);
		}
		//其他层
		this.removeResultLayer();
	},
	showCardAnimate:function(posId,cardsType) {//展示卡牌动画
		var cardAnimateNode;
		if(cardsType==CardType.ShuangShun) {//ShuangShun//Dan
			cardAnimateNode = new cc.Sprite("#cardAni_2.png");
			this.addChild(cardAnimateNode,GameLayerDEPTH.cardsAni);
			cardAnimateNode.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(Helper.removeSelf,this)));
			if(posId==GameData.myPlayerPot){
				cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,390)));
			}else if (posId==GameData.rightPlayerPot){
				cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,100)));
			}else if (posId==GameData.leftPlayerPot) {
				cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,100)));
			}
		}else if(cardsType==CardType.FeiJi||cardsType==CardType.FeiJiDaiTwo){//FeiJi//DanShun
			cardAnimateNode = new cc.Sprite("#cardAni_0.png");
			this.addChild(cardAnimateNode,GameLayerDEPTH.cardsAni);
			if(posId==GameData.myPlayerPot||posId==GameData.leftPlayerPot){
				cardAnimateNode.setScale(-1,1);
				if(posId==GameData.myPlayerPot){
					cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.left,cc.p(0,30)));
				}else{
					cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.left,cc.p(0,0)));
				}
				cardAnimateNode.runAction(cc.sequence(cc.moveBy(1,450,0),cc.callFunc(Helper.removeSelf,this)));
			}else if (posId==GameData.rightPlayerPot){
				cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.right,cc.p(0,30)));
				cardAnimateNode.runAction(cc.sequence(cc.moveBy(1,-450,0),cc.callFunc(Helper.removeSelf,this)));
			}
		}else if(cardsType==CardType.Bomb){//CardType.Bomb//Shuang
			cardAnimateNode = new cc.Sprite();
			this.addChild(cardAnimateNode,GameLayerDEPTH.cardsAni);
			var tmpAni = Helper.createAnimation("bomb_",0,4,1);
			var tmpAnite = cc.animate(tmpAni);
			cardAnimateNode.scale = 1.6;
			cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,50)));
			cardAnimateNode.runAction(cc.sequence(tmpAnite,
					cc.callFunc(Helper.removeSelf,this)));
		}else if(cardsType==CardType.HuoJian){//HuoJian//San
			cardAnimateNode = new cc.Sprite("#cardAni_1.png");
			this.addChild(cardAnimateNode,GameLayerDEPTH.cardsAni);
			cardAnimateNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,0)));
			var easeAct = cc.moveTo(2,cc.visibleRect.top).easing(cc.easeIn(2.0));
			cardAnimateNode.runAction(cc.sequence(easeAct,cc.callFunc(Helper.removeSelf,this)));
		}
	},
	addShopLayer:function () {//商店页面
		if (PlayerData.isFirstRecharge==false) {//首冲
			var testShopLayer = new RechargeLayer();
			testShopLayer.setPosition(0,0);
			this.addChild(testShopLayer,GameLayerDEPTH.popLayer);
		}else{//商店
			var testShopLayer = new ShoppingLayer(MAIN_SCALE);
			testShopLayer.setPosition(0,0);
			this.addChild(testShopLayer,GameLayerDEPTH.popLayer);
		}
	},
	showGift:function () {//在线礼包
		if (PlayerData.GiftTime==-1) {//没有了
			if (this.giftNode) {
				this.giftNode.removeFromParent(true);
				this.giftNode = null;
			}
		}else{
			if (this.giftNode==null) {
				this.giftNode = new MyGiftNode(this.giftNodeCallback,this);
				this.giftNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(-180,350)));
				this.addChild(this.giftNode,GameLayerDEPTH.littleNode);	
				this.giftNode.startTimeCount();
			}else{
				this.giftNode.startTimeCount();
			}
		}
	},
	giftNodeCallback:function(){//本地可以领的时候更新
		sfs.send(new SFS2X.Requests.System.ExtensionRequest("grg",null));//领礼品
	},
	updataJiangNode:function(){//更新任务节点显示
		if(this.jiangNode){
			var showLingQu = false;
			for (var i = 0; i < 3; i++) {
				if (PlayerData.taskArr[i]>0) {
					var sTolkey = "id"+PlayerData.taskArr[i];
					var taskTolDic = taskStrData[sTolkey];
					var maxTolPro = taskTolDic.max;//多少个目标
					var nowTolPro = PlayerData.taskProArr[i];//当前值
					if (nowTolPro>=maxTolPro){showLingQu=true;}
				}
			}			
			if (PlayerData.taskTol>0) {
				var sTolkey = "id"+PlayerData.taskTol;
				var taskTolDic = taskTolData[sTolkey];
				var maxTolPro = taskTolDic.num;//多少个目标
				var nowTolPro = PlayerData.taskTolPro;//当前值
				if (nowTolPro>=maxTolPro){showLingQu=true;}
			}
			this.jiangNode.setCanLing(showLingQu);	
		}
	},
	JiangNodeCallback:function(){//奖励节点回调
		var testSettingLayer = new TaskLayer();
		testSettingLayer.setPosition(0,0);
		this.addChild(testSettingLayer,GameLayerDEPTH.popLayer);
	},
	reConnectionThisLayer:function(){//断线之后重建整个游戏层
		this.setMyCards(GameData.myCards);
		this.otherPlayerRight.setThisNodeVisible(true); 
		this.otherPlayerLeft.setThisNodeVisible(true);
		this.otherPlayerRight.showCardNumber(GameData.rightCards);
		this.otherPlayerLeft.showCardNumber(GameData.leftCards);
	},
	showPngTips:function(type){//提示信息
		var showtime = 1;
		var showPngTipsNode = new cc.Node();
		showPngTipsNode.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,180)));
		this.addChild(showPngTipsNode,GameLayerDEPTH.ui);
		var tipsStr = "#tipLabel_"+type+".png"
		var tipbg = new cc.Sprite(tipsStr);
		tipbg.setPosition(0,0);
		showPngTipsNode.addChild(tipbg,0);
		var seqAction = cc.sequence(cc.delayTime(showtime),cc.callFunc(Helper.removeSelf,this));
		showPngTipsNode.runAction(seqAction);
	},
});