var sfs = null;
var configZoneName = "doudizhu";
var HartConnectTime = 5;//10//心跳时间
var ConnectTimeOut = 4;//9//心跳超时
var GameScene = BaseNodeScene.extend({
	startConnectTimeOut:false,
	isStartHartConnect:false,
	isNowConnect:false,
	isReConnentNet:false,//是否重连
	reConnentState:0,//0无状态 1是在房间中的
	hbtState:0,//1是普通状态下的连接
	isShowReconnentLayer:false,//当前是否展示了重连界面
	ctor:function () {
		this._super();
		this.initScene();
		return true;
	},
	//我收到信息之后  发给你说我收到了
	initScene : function () {
		sfs = null;
		//初始化玩家信息
		PlayerData.initPlayerData();
	},
	onEnter : function () {
		this._super();
		//由其他页面回来的时候 重新加载页面
		//切换出去的时候停止后面的数据处理
		//有一个全局变量 停止各种数据更新
		var that = this;
		//离开页面时做的逻辑
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(event){ 
			//cc.log("cc.game.EVENT_HIDE!");
			//GameManager.MusicComeToBack(true);
//			if (that.isStartHartConnect){
//			that.unschedule(that.sendHartConnectMsg);
//			that.unschedule(that.HartConnectMsgTimeOut);
//			}
		});
		//恢复显示 
		cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(event){ 
			//cc.log("cc.game.EVENT_SHOW"); 
			//GameManager.MusicComeToBack(false);
			//切换回来的时候 socket已经到了 但是还没处理
			if(that.isShowReconnentLayer==false) {
				if(PlayerData.isujz){	//礼品时间
					sfs.send(new SFS2X.Requests.System.ExtensionRequest("rsg",null));
				}
			}
			//立刻询问是否在线 如果不在线则黑屏处理
//			if (that.isStartHartConnect){
//			that.schedule(that.sendHartConnectMsg,HartConnectTime);
//			}
		});
		//监听网络信息
		if (isNetWork) { this.networkInit();}
		//一开始播放音乐
		GameManager.playBgMusic(LoopMusicType.bg);
	},
	//开始按钮的返回
	startMenuCallback:function(){
		this._super();
		sfs.connect();
		this.comeToWaitLayer(10);
	},
	onExit: function() {
		cc.eventManager.removeAllListeners();
		this._super();
	},
	networkInit: function() {//开始网络监听
		var config = {};
		//这里可以设置网址
		config.host = "192.168.55.14";
		config.port = 8888;
		if(!cc.sys.isNative){
			if (myhost) {
				cc.log("your host:"+myhost);
				config.host = myhost;
			}
			if (myport) {
				config.port = myport;
			}
		}
		//config.port = 8843;
		//config.useSSL = true;
		//config.host = "115.29.136.220";//外部服务器端
		config.zone = configZoneName;
		config.debug = false;
		sfs = new SmartFox(config);
		//cc.log("SmartFox API version: " + sfs.version);
		//sfs.setClientDetails("JavaScript","1.2.0");

		sfs.addEventListener(SFS2X.SFSEvent.CONNECTION,this.onConnection,this);//链接时
		sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST,this.onConnectionLost,this);//链接丢失返回
		sfs.addEventListener(SFS2X.SFSEvent.LOGIN,this.onLogin,this);//登录进去后
		sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR,this.onLoginError,this);//登录错误
		sfs.addEventListener(SFS2X.SFSEvent.LOGOUT,this.onLogout,this);

		sfs.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoom, this);
		sfs.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom, this);
		sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoin, this);
		sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR,this.onRoomJoinError, this);//进房间错误

		sfs.addEventListener(SFS2X.SFSEvent.SOCKET_ERROR,this.onSOCKET_ERROR, this);//socket错误

		sfs.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE,this.onUserVariablesUpdate, this);//用户信息更新
		sfs.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE,this.onRoomVarUpdate, this);//用户信息更新
		//sfs.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE,this.onPublicMessage, this);
		//公用信息更新

		sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE,this.onExtensionResponse,this);
	},
	onConnection:function(evtParams){
		if (evtParams.success){
			cc.log("Connected to SmartFoxServer 2X!");
			//this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(this.waitAndSendLoginRequest,this)));
			var uName;
			if (PlayerData.myAccount) {
				uName = PlayerData.myAccount.toString();
			}else{
				var randomNumber = Math.floor(Math.random()*800000+100000);
				uName = randomNumber.toString();
			}
			var loginTable = {};
			loginTable.Version = versionNumber;
			sfs.send(new SFS2X.Requests.System.LoginRequest(uName,"",
					loginTable,configZoneName));
		}else{
			var error = "Connection failed: "+(evtParams.errorMessage ? evtParams.errorMessage + " (code " + evtParams.errorCode + ")" : "is the server running at all?");
			cc.log("error:"+ error);
			if (this.isReConnentNet==true) {
				GameManager.removeWaitLayer();
				this.showTipsLayer("还是无法连接服务器");
			}
		}
	},
	onConnectionLost:function(evtParams){ //连接丢失 回到主界面//服务器强制断开连接
		var reason = "You have been disconnected; reason is: "+evtParams.reason;
		cc.log("reason:"+reason);
		if (this.isShowReconnentLayer==false){
			GameManager.showTipsLayer("你已经断开连接");
			PlayerData.isujz = false;
			this.showYesNoTips(WarningCharType.DisConnent);
			this.unschedule(this.sendHartConnectMsg);
			this.unschedule(this.HartConnectMsgTimeOut);
			GameManager.changeToNextScene(gameSceneTag.StartScene);
		}
	},
	onLoginError:function(evtParams){
		//var errorStr = "Login error:"+evtParams.errorMessage+ " (code: " + evtParams.errorCode + ")";
		GameManager.removeWaitLayer();
		this.showTipsLayer("无法连接服务器,你的版本过低");
	},
	onLogin:function(evtParams){ //登录进去后
		GameManager.removeWaitLayer();
		var user = evtParams.user;
		if (user) { cc.log(user.toString());}
	},
	onLogout:function(evtParams){ //登出
		cc.log("onLogout");
		PlayerData.isujz = false;
	},
	onRoomJoin:function(evtParams){//进房间了
		var room = evtParams.room;
		if (room) { PlayerData.roomId = room.id; }
		cc.log("on Join Room "+PlayerData.roomId);
	},
	onRoomJoinError:function(evtParams){
		var errorStr = "Room join error: " + evtParams.errorMessage + " (code: " + evtParams.errorCode + ")";
		cc.log("error:"+errorStr);
	},
	onSOCKET_ERROR:function(evtParams){
		var errorStr = "SOCKET error: " + evtParams.errorMessage;
		cc.log(errorStr);
	},
	onUserEnterRoom:function(evtParams){ //有玩家进房间
		var room = evtParams.room;
		var user = evtParams.user;
		if (user && room) {
			var userbId = user.getVariable("GameId").value;
			cc.log("User " + userbId + " just joined Room "+room.id);
		}
	},
	onUserExitRoom:function(evtParams){ //有玩家退房间
		var room = evtParams.room;
		var user = evtParams.user;
		if (user && room) {
			var userbId = user.getVariable("GameId").value;
			cc.log("User " + userbId + " just Left Room " + room.id);
			if (user.isItMe){
				cc.log("I Left Room");
				PlayerData.roomId = -1;
			}
		}
	},
	onRoomVarUpdate:function(evtParams){ //房间变量修改的情况
		var changedVars = evtParams.changedVars;
		var room = evtParams.room;
		if (PlayerData.scene!=gameSceneTag.GameScene){//不在游戏界面则全部忽略
			return;
		}
		if (changedVars.indexOf("Phase") != -1){
			var Phase = room.getVariable("Phase").value;
			cc.log("Phase:"+Phase);
			if (Phase=="chihua") {//初始化阶段
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("grk",null,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (Phase=="zaicsh") { //再初始化 没人抢地主
				this.gameLayer.showLayer.clearAll();
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("grk",null,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}else if (Phase=="zaiks") { //再开始
			}else if (Phase=="fapai") { //发牌
				cc.log("发牌");
				GameManager.removeWaitLayer();
				this.gameLayer.setLayerState(GameLayerState.Game);//初始化界面
				GameData.InitData();//当场的数据
				var tmpthree = room.getVariable("BottomCards").value.value;//底牌
				GameData.threeCards = Logic.copyToCards(tmpthree);
				var IdArr = [];
				for (var i = 0; i < 3; i++) {
					var tmStr = i+"Id";
					var element = room.getVariable(tmStr).value;
					IdArr.push(element);
				}
				GameData.InitRolesData(PlayerData.bId,IdArr);//初始化座位号
				for (var i = 0; i < 3; i++) {
					var tmStr = i+"Cards";
					var element = room.getVariable(tmStr).value.value;
					if (i== GameData.myPlayerPot) {
						GameData.myCards = Logic.copyToCards(element);
					}else if(i== GameData.rightPlayerPot){
						GameData.rightCards = Logic.copyToCards(element);
					}else{
						GameData.leftCards = Logic.copyToCards(element);
					}
				}
				Logic.printCards(GameData.threeCards);
				cc.log("pot:my "+GameData.myPlayerPot);
				Logic.printCards(GameData.myCards);
				cc.log("pot:right "+GameData.rightPlayerPot);
				Logic.printCards(GameData.rightCards);
				cc.log("pot:left "+GameData.leftPlayerPot);
				Logic.printCards(GameData.leftCards);
				//其他玩家的元宝信息
				var UserList = room.getUserList();
				this.updataOtherPlayerData(UserList);
				//我的倍数
				var mShuStr = GameData.myPlayerPot+"Factor";
				PlayerData.beiShu = room.getVariable(mShuStr).value;
				this.gameLayer.updataData();//显示倍数
//				//托管
//				for (var i = 0; i < 3; i++) {
//				var element = i+"Auto";
//				var autoState = room.getVariable(element).value;
//				cc.log("Init autoState %d %d",i,autoState);
//				}
				this.gameLayer.playOneGameStartAni();//初始化界面
			}else if (Phase=="jiaodizhu") { //叫地主阶段
			}
		}
		//叫地主界面上的情况
		if (room.getVariable("Phase").value != "jiaodizhu"||
				room.getVariable("Phase").value != "jiabei"){
			for (var i = 0; i < 3; i++) {
				var element = i+"Claim";
				if (changedVars.indexOf(element) != -1){
					var jddState = room.getVariable(element).value;
					cc.log("jddState %d %d",i,jddState);
					if (jddState!=-1) {
						this.gameLayer.showOneQiang(i,jddState);
					}
				}
			}
		}
		//抢地主回合 JDDState 改变就是一个人的行动
		if (changedVars.indexOf("JDDTurn") != -1){
			var nowJDDTurn = room.getVariable("JDDTurn").value;
			GameData.QiangDizhuCount = GameData.QiangDizhuCount + 1;//回合数
			cc.log("JDDTurn:"+GameData.QiangDizhuCount+"who:"+nowJDDTurn);
			//设置抢得初始状态
			this.gameLayer.menuNode.setMenuState(menuNodeCallState.start);
			this.gameLayer.showLayer.setClockSpState(ClockPosition.Start);
			//当前按钮
			if (GameData.firstJiao==true) {
				this.gameLayer.setOneQiang(nowJDDTurn,false);
			}else{
				this.gameLayer.setOneQiang(nowJDDTurn,true);
			}
		}
		//阶段改变
		if (changedVars.indexOf("Phase") != -1){
			var Phase = room.getVariable("Phase").value;
			if (Phase=="jiabei") { //加倍
				//this.gameLayer.showLayer.clearAll();
				if (changedVars.indexOf("Landlord") != -1) {
					cc.log("Landlord:"+room.getVariable("Landlord").value);
					GameData.dizhuId = room.getVariable("Landlord").value;
					//收到新的卡组
					var tmpString = GameData.dizhuId+"Cards";
					var tmpCards = room.getVariable(tmpString).value.value;
					this.gameLayer.showDiZhuFinish(tmpCards);
				}
				//显示我能不能加倍
				var tmpMyJiaStr = GameData.myPlayerPot + "Add";
				var myCanjia = room.getVariable(tmpMyJiaStr).value;
				this.gameLayer.setJiaBei(myCanjia);
			}
		}	
		//倍数有没有增加
		var mybeiShuStr = GameData.myPlayerPot+"Factor";
		if (changedVars.indexOf(mybeiShuStr) != -1){
			PlayerData.beiShu = room.getVariable(mybeiShuStr).value;
			this.gameLayer.updataData();//显示倍数
		}
		//加倍阶段的展示 
		if ((room.getVariable("Phase").value == "jiabei")||
				(room.getVariable("Phase").value == "chupai")) {
			if (changedVars.indexOf("0DoAdd") != -1){
				var jiab = room.getVariable("0DoAdd").value;
				this.gameLayer.showOneJiaBei(0,jiab);
			}
			if (changedVars.indexOf("1DoAdd") != -1){
				var jiab = room.getVariable("1DoAdd").value;
				this.gameLayer.showOneJiaBei(1,jiab);
			}
			if (changedVars.indexOf("2DoAdd") != -1){
				var jiab = room.getVariable("2DoAdd").value;
				this.gameLayer.showOneJiaBei(2,jiab);
			}
		}
		//是否有明牌
		if (changedVars.indexOf("LandlordOpenCard") != -1) {
			GameData.isMingPai = room.getVariable("LandlordOpenCard").value;//0,1
			if (GameData.isMingPai==1){
				GameManager.playSound(MusicType.ming,GameData.dizhuId);
				if (GameData.dizhuId == GameData.rightPlayerPot) {
					this.gameLayer.otherPlayerRight.showMingPai(GameData.rightCards);
				}else if (GameData.dizhuId == GameData.leftPlayerPot) {
					this.gameLayer.otherPlayerLeft.showMingPai(GameData.leftCards);
				}
			}
		}
		//出牌阶段
		if (changedVars.indexOf("Phase") != -1){
			var Phase = room.getVariable("Phase").value;
			if (Phase=="chupai") { //出牌
				this.gameLayer.menuNode.setMenuState(menuNodeCallState.start);
				//能选择控制层了 出牌的初始化阶段
				GameData.isCanChuPai = true;
			}
		}	
		//出牌回合
		if (changedVars.indexOf("CPTurn") != -1){
			var nowCPTurn = room.getVariable("CPTurn").value;
			var Phase = room.getVariable("Phase").value;
			if (Phase == "chupai"||Phase == "jieshu") {//出牌阶段
				var isCardchange = false;//是否有改变
				var isTurnFirstChuPai = false;//是不是回合内的第一个出牌
				if (GameData.TrunCount==0) { //第一个回合的一些特殊情况
					isTurnFirstChuPai = true;
				}else if (GameData.TrunCount==1) {
					this.gameLayer.showLayer.clearAll();
				}
				if (changedVars.indexOf("PresentCards") != -1){	
					var tmpchucards = room.getVariable("PresentCards").value.value;//数组
					GameData.nowCards = null;
					GameData.nowCards = Logic.copyToCards(tmpchucards);
				}
				if (changedVars.indexOf("PresentType") != -1){	
					GameData.nowCardsType = room.getVariable("PresentType").value;
				}
				if (GameData.TrunCount>0){//
					if (changedVars.indexOf("PresentByWho")!=-1){//场上的出牌人改变
						GameData.nowCardsPot = room.getVariable("PresentByWho").value;//-1 0 1
						isCardchange = true;
					}
					if(room.getVariable("PrsentCardsAreFirst").value==1){
						isTurnFirstChuPai = true;
					}
				}
				//我的卡有改变
				for (var i = 0; i < 3; i++) {
					var tmStr = i+"Cards";
					if (changedVars.indexOf(tmStr) != -1){
						var element = room.getVariable(tmStr).value.value;//数组
						if (i== GameData.myPlayerPot) {
							GameData.myCards = Logic.copyToCards(element);//再改变一次
							this.gameLayer.setMyCards(GameData.myCards);
						}else if(i== GameData.rightPlayerPot){
							GameData.rightCards = Logic.copyToCards(element);
							this.gameLayer.otherPlayerRight.showCardNumber(GameData.rightCards);
						}else{
							GameData.leftCards = Logic.copyToCards(element);
							this.gameLayer.otherPlayerLeft.showCardNumber(GameData.leftCards);
						}
					}
				}
				cc.log("turn:"+nowCPTurn+",type:"+GameData.nowCardsType+","+isTurnFirstChuPai);
				//参数:当前谁的回合,是不是他出的牌,是不是出的同样的牌,当前的回合数
				this.gameLayer.showOneTurn(nowCPTurn,isCardchange,isTurnFirstChuPai,GameData.TrunCount);
				this.gameLayer.setOneTurn(nowCPTurn,GameData.TrunCount);
				GameData.TrunCount = GameData.TrunCount + 1;//回合数
			}
		}
		//游戏结束
		if (changedVars.indexOf("Phase") != -1){
			var Phase = room.getVariable("Phase").value;
			if (Phase=="jieshu") {//0农民赢 1地主赢
				var InComeStr = GameData.myPlayerPot+"Income";
				GameData.winner = room.getVariable("Winner").value;
				GameData.income = room.getVariable(InComeStr).value;
				this.gameLayer.addResultLayer();
			}
		}
		//对话层
		if (changedVars.indexOf("Chat") != -1){
			if (this.gameLayer) {
				this.gameLayer.showChatList(room.getVariable("Chat").value);
			}
		}
		//托管
		if (room.getVariable("Phase").value!= "chihua"){
			for (var i = 0; i < 3; i++) {
				var element = i+"Auto";
				if (changedVars.indexOf(element) != -1){
					var autoState = room.getVariable(element).value;
					cc.log("autoState %d %d",i,autoState);
					this.gameLayer.showTuoGuan(i,autoState);
				}
			}
		}
	},
	//用户变量
	onUserVariablesUpdate:function(evtParams){
		var changedVars = evtParams.changedVars;
		var user = evtParams.user;
		if (user.isItMe){
			if (changedVars.indexOf("NickName") != -1){
				var newNamestring = user.getVariable("NickName").value;
				PlayerData.name = newNamestring.toString();
			}
			if (changedVars.indexOf("Money") != -1){
				PlayerData.money = user.getVariable("Money").value;
				cc.log("PlayerData.money:"+PlayerData.money);
			}
			if (changedVars.indexOf("Point") != -1){
				PlayerData.score = user.getVariable("Point").value;
			}
			if (changedVars.indexOf("Exp") != -1){
				PlayerData.nowExp = user.getVariable("Exp").value;
			}
			if (changedVars.indexOf("Gender")!=-1) {
				PlayerData.sex = user.getVariable("Gender").value;
			}
			if (changedVars.indexOf("EverCharge") != -1){
				PlayerData.isFirstRecharge = user.getVariable("EverCharge").value;
			}
			if (PlayerData.scene == gameSceneTag.GameScene) {
				if (this.gameLayer) {
					this.gameLayer.updataData();
				}
			}else if (PlayerData.scene == gameSceneTag.SelectRoomScene) {
				if (this.selectRoomLayer) {
					this.selectRoomLayer.updataRoomData();
				}
			}
		}
	},
	onExtensionResponse:function(evtParams){
		var params = evtParams.params;
		var cmd = evtParams.cmd;
		if (params==null||cmd==null) {
			return;
		}
		cc.log("Received Extension Response: "+cmd);
		switch(cmd)
		{
		case "ujz":{ 
			PlayerData.isujz = true;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("ust",null));//第一次拿数据
		};break;
		case "eust":{//第一次拿 ust
			//for (var i in params){cc.log("i:"+i+" "+params[i]);}
			if (params.NickName!=null){
				var newNamestring = params.NickName+"";
				PlayerData.name = newNamestring.toString();
			}
			if (params.Exp!=null) {
				PlayerData.nowExp = params.Exp;
			}
			if (params.Money!=null){
				PlayerData.money = params.Money;
			}
			if (params.GameId!=null) {
				PlayerData.bId = params.GameId;
			}
			if (params.Point!=null) {
				PlayerData.score = params.Point;
			}
			if (params.Gender!=null) {
				PlayerData.sex = params.Gender;
			}
			if (params.EverCharge!=null) {
				PlayerData.isFirstRecharge = params.EverCharge;
			}
			//SetGender = "sgd";//性别
			//礼品
			if (params.Remain!=null) {
				PlayerData.GiftTime = params.Remain;
			}
			if (params.Reward!=null) {
				PlayerData.GiftNextMoney = params.Reward;
			}
			//任务列表
			if (params.Tasks!=null){
				for (var i = 0;i<3;i++){
					var element = params.Tasks[i];
					PlayerData.taskArr[i]=element.Id;
					PlayerData.taskProArr[i]=element.Progress;
				}
			}
			if (params.ExtraTask!=null){
				PlayerData.taskTol=params.ExtraTask.Id;
				PlayerData.taskTolPro=params.ExtraTask.Progress;
			}
			//这个时候才进入场景
			if (params.SendOK!=null) {
				if (params.SendOK==1) {
					//是否是重连进来的
					if(this.isReConnentNet==false){
						GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
						this.startHartConnect();
					}else{
						//之前在房间中
						PlayerData.nowRidMsg = RID_STATE.TimeOut;
						sfs.send(new SFS2X.Requests.System.ExtensionRequest("rid",null));
					}
				}
			}
		};break;
		case "evd":{//其他玩家的信息 vad
			var tmpplayer = params.Player;
			//cc.log("player %s,%s,%s",tmpplayer.Money,tmpplayer.Id,tmpplayer.Name);
			if (PlayerData.scene == gameSceneTag.GameScene) {
				if (tmpplayer.Id==GameData.rightPlayerId) {
					this.gameLayer.otherPlayerRight.showBaoLabel(tmpplayer.Money);
				}
				if (tmpplayer.Id==GameData.leftPlayerId) {
					this.gameLayer.otherPlayerLeft.showBaoLabel(tmpplayer.Money)
				}
			}
		};break;
		case "fjf":{ //房间进不了的情况
			cc.log("params.Reason "+params.Reason);
			if (params.Reason==3) { //钱太多 3
				this.showYesNoTips(WarningCharType.TooMuchStrong);
			}else if (params.Reason==2) { //钱太少 2
				this.showYesNoTips(WarningCharType.NoYuanBao);
			}else if (params.Reason==1) { //房间超过限制 1
				this.showYesNoTips(WarningCharType.NotEnoughRoom);
			}
			GameManager.removeWaitLayer();
		};break;
		case "stm":{//补贴信息接口
			this.showYesNoTips(WarningCharType.GiveYuanBao,params.Count,params.Amount);
			GameManager.removeWaitLayer();
		};break;
		case "epn":{//房间信息 pon
			cc.log(params.Field1+","+params.Field2+","+params.Field3+","+params.Field4);
			PlayerData.Field1 = params.Field1;
			PlayerData.Field2 = params.Field2;
			PlayerData.Field3 = params.Field3;
			PlayerData.Field4 = params.Field4;
			if (PlayerData.scene == gameSceneTag.SelectRoomScene) {
				this.selectRoomLayer.updataRoomPlayerNum();
			}
		};break;
		case "ersg":{//剩余时间
			cc.log("剩余时间 "+params.Remain);//-1 异常 没有
			PlayerData.GiftTime = params.Remain;
			if (params.Reward!=null) {
				cc.log("下次钱 "+params.Reward);//-1 异常 没有
				PlayerData.GiftNextMoney = params.Reward;
			}
			if (PlayerData.scene == gameSceneTag.GameScene){
				this.gameLayer.showGift();
			}
		};break;
		case "egrg":{//礼品返回
			cc.log("礼品返回 "+params.Money);
			if (params.Money>0) {
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("rsg",null));
				GameManager.showTipsLayer("获得"+params.Money+"元宝");
			}//时间没到
		};break;
		case "egdt":{//任务列表 gdt
			if (params.Tasks!=null){//Id Progress
				for (var i = 0;i<3;i++){
					var element = params.Tasks[i];
					cc.log("task:"+element.Id+" "+element.Progress);
					PlayerData.taskArr[i]=element.Id;
					PlayerData.taskProArr[i]=element.Progress;
				}
			}
			if (params.ExtraTask!=null){//Id Progress
				cc.log("Tasks "+params.ExtraTask.Id+" "+params.ExtraTask.Progress);
				PlayerData.taskTol=params.ExtraTask.Id;
				PlayerData.taskTolPro=params.ExtraTask.Progress;
			}
			if (PlayerData.scene == gameSceneTag.GameScene){
				var child = this.gameLayer.getChildByTag(POPLAYER_TAG.TaskLayer);
				if (child) {
					child.updateTask();
				}
				this.gameLayer.updataJiangNode();
			}else if (PlayerData.scene == gameSceneTag.SelectRoomScene) {
				var child = this.selectRoomLayer.getChildByTag(POPLAYER_TAG.TaskLayer);
				if (child) {
					child.updateTask();
				}
			}
		};break;
		case "erdt":{//任务可领  
			if (params.Money!=null){
				this.showTipsLayer("获得"+params.Money+"元宝");
			}
		};break;
		case "eedt":{//总任务返回 
			if (params.Money!=null){
				this.showTipsLayer("获得"+params.Money+"元宝");
			}
		};break;
		case "kpr":{//结束后超时回到等待界面//
			if (PlayerData.scene == gameSceneTag.GameScene) {
				//this.gameLayer.setLayerState(GameLayerState.Ready);
				//GameManager.removeWaitLayer();
			}
		};break;
		case "rmn":{//rmn
			if (PlayerData.scene == gameSceneTag.GameScene) {
				var params = {};
				params.FieldId = PlayerData.selectChang;
				params.ModeId=1;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("mtp",params));
			}
		};break;
		case "erid":{//rid 进房间时进行判断是不是在房间中
			if (params.RoomId!=null){
				PlayerData.roomId = params.RoomId;
				cc.log("RoomId=="+params.RoomId);
				if(PlayerData.nowRidMsg==RID_STATE.SelectRoom){ //选房间时发生的
					if (PlayerData.roomId>0){ //在房间中重连
						cc.log("在房间中重连");
						GameManager.removeWaitLayer();
						this.showYesNoTips(WarningCharType.HaveInRoom);
					}else{
						cc.log("进等待界面");
						GameManager.removeWaitLayer();
						GameManager.changeToNextScene(gameSceneTag.GameScene);
					}
				}else if(PlayerData.nowRidMsg==RID_STATE.TimeOut){//超时出去的
					if (PlayerData.roomId>0) { //仍在游戏中
						cc.log("仍在游戏中");
						GameManager.comeToWaitLayer();
						var parm = {};
						parm.RoomId = PlayerData.roomId;
						sfs.send(new SFS2X.Requests.System.ExtensionRequest("rar",parm));//恢复游戏进程
					}else{ 
						//退到主页页面
						GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
						//重连结束
						cc.log("在主页的重连结束");
						this.removeWaitLayer();
						this.deleteAllWarnLayer();
						this.isShowReconnentLayer=false;
						this.isReConnentNet=false;
						this.startHartConnect();
					}
				}
			}
		};break;
		case "erar":{//中断之后拿房间变量 rar
			GameManager.removeWaitLayer();
			GameManager.changeToNextScene(gameSceneTag.GameScene);
			//重连结束
			if(this.isShowReconnentLayer==true) {
				cc.log("游戏场的重连结束");
				this.removeWaitLayer();
				this.deleteAllWarnLayer();
				this.isShowReconnentLayer=false;
				this.isReConnentNet=false;
				this.startHartConnect();
			}
			//rsu界面初始化好了
			for (var i in params){cc.log("i:"+i+" "+params[i]);}
			GameData.InitData();//初始化
			if (params.Phase=="chupai") {
				GameData.isCanChuPai = true;//阶段
			}else if (params.Phase=="zaicsh") {
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("grk",
						null,sfs.roomManager.getRoomById(PlayerData.roomId)));
			}
			GameData.isMingPai = params.LandlordOpenCard;//当前是不是明牌
			if (params.Phase!="jiaodizhu") {
				GameData.dizhuId = params.Landlord;//当前谁是地主
			}
			var IdArr = [];//拿玩家列表
			for (var i = 0; i < 3; i++) {
				var tmStr = i+"Id";
				var element = params[tmStr];
				IdArr.push(element);
			}
			GameData.InitRolesData(PlayerData.bId,IdArr);//初始化座位号
			GameData.threeCards = Logic.copyToCards(params.BottomCards.value);//底牌
			if (params.Phase=="jiabei"||params.Phase=="mingpai"||params.Phase=="chupai"){
				//展示场上3张卡
				this.gameLayer.setShowThreeCardNode(GameData.threeCards);
			}
			for (var i = 0; i < 3; i++) {//每个玩家的牌
				var tmStr = i+"Cards"; 
				var element = params[tmStr].value;
				if (i== GameData.myPlayerPot) {
					GameData.myCards = Logic.copyToCards(element);
				} else if(i== GameData.rightPlayerPot){
					GameData.rightCards = Logic.copyToCards(element);
				} else{
					GameData.leftCards = Logic.copyToCards(element);
				}
			}
			//当前的牌
			Logic.printCards(GameData.threeCards);
			cc.log("repot:my "+GameData.myPlayerPot);
			Logic.printCards(GameData.myCards);
			cc.log("repot:right "+GameData.rightPlayerPot);
			Logic.printCards(GameData.rightCards);
			cc.log("repot:left "+GameData.leftPlayerPot);
			Logic.printCards(GameData.leftCards);
			//其他玩家的信息
			var myRoom = sfs.roomManager.getRoomById(PlayerData.roomId);
			if (myRoom) {
				var UserList = myRoom.getUserList();
				this.updataOtherPlayerData(UserList);
			}
			//我的倍数
			var mShuStr = GameData.myPlayerPot+"Factor";
			PlayerData.beiShu = params[mShuStr];
			this.gameLayer.updataData();
			//恢复场上的卡
			if (params.PresentCards!=null){	
				GameData.nowCards = Logic.copyToCards(params.PresentCards);
				Logic.printCards(GameData.nowCards);
			}
			if (params.PresentType!=null){
				GameData.nowCardsType = params.PresentType;
				cc.log("nowCardsType:"+GameData.nowCardsType);
			}
			if (params.PresentByWho!=null){	
				GameData.nowCardsPot = params.PresentByWho;
				cc.log("PresentByWho:"+GameData.nowCardsPot);
			}
			//托管
			for (var i = 0; i < 3; i++) {
				var element = i+"Auto";
				var autoState = params[element];
				if (autoState) {
					cc.log("autoState %d %d",i,autoState);
					this.gameLayer.showTuoGuan(i,autoState);
				}
			}
			//当前回合数
			GameData.TrunCount= params.TurnCount;
			//界面恢复
			this.gameLayer.setLayerState(GameLayerState.Game);
			this.gameLayer.reConnectionThisLayer();
			//界面恢复中 每个小阶段特殊处理
			if (params.Phase=="jiaodizhu") {
				for (var i = 0; i < 3; i++) {
					var element = i+"Claim";
					var jddState = params[element];
					cc.log("jddState %d %d",i,jddState);
					if (jddState!=-1) {
						this.gameLayer.showOneQiang(i,jddState);
					}
				}
				//抢地主回合 JDDState 改变就是一个人的行动
				var nowJDDTurn=params.JDDTurn;
				if (nowJDDTurn==GameData.myPlayerPot) {
					if (GameData.firstJiao==true) {
						this.gameLayer.setOneQiang(nowJDDTurn,false);
					}else{
						this.gameLayer.setOneQiang(nowJDDTurn,true);
					}
				}
			}else if (params.Phase=="jiabei"){
				//让托管跳过这个回合
				for (var i = 0; i < 3; i++) {
					var element = i+"DoAdd";
					var jiabe = params[element];
					if (jiabe){
						cc.log("jiabe %d %d",i,jiabe);
						if (jiabe!=-1) {
							this.gameLayer.showOneJiaBei(i,jiab);
						}
					}
				}
			}else if (params.Phase=="chupai"){//出牌
				//恢复场上情况
				var nowCPTurn = params.CPTurn;//当前是谁的回合
				if (GameData.TrunCount>0){
					//恢复场上卡的状态
					if (GameData.nowCardsPot==GameData.myPlayerPot) {
						//之前当前场上的牌是我出的
						//轮到我的出牌回合
						this.gameLayer.showLayer.showCards(GameData.myPlayerPot,GameData.nowCards);
					}else if (GameData.nowCardsPot==GameData.rightPlayerPot) {//右边出了牌
						this.gameLayer.showLayer.showCards(GameData.rightPlayerPot,GameData.nowCards);
					}else if (GameData.nowCardsPot==GameData.leftPlayerPot) {//左边出了牌
						this.gameLayer.showLayer.showCards(GameData.leftPlayerPot,GameData.nowCards);
						//左边的人是不出
					}
				}
				//this.gameLayer.showOneTurn(nowCPTurn,isCardchange,isTurnFirstChuPai,GameData.TrunCount);
				if (nowCPTurn==GameData.myPlayerPot) {
					//回合数
					this.gameLayer.setOneTurn(nowCPTurn,GameData.TrunCount);
				}
			}
			//地主样式的改变
			if (params.Phase=="jiabei"||params.Phase=="chupai") {
				if (GameData.dizhuId == GameData.rightPlayerPot) {
					this.gameLayer.otherPlayerRight.setDiZhuTexture();
				}else if (GameData.dizhuId == GameData.leftPlayerPot){
					this.gameLayer.otherPlayerLeft.setDiZhuTexture();
				}
			}
		};break;
		case "ehbt":{//心跳连接
			this.isNowConnect = true;
			if(this.hbtState==2){//不在房间的socket重连
				this.hbtState=0;//忽略后面一大堆信息
				cc.log("发送检测我是否在房间");
				//发送检测我是否在房间的检测
				PlayerData.nowRidMsg = RID_STATE.TimeOut;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("rid",null));
				this.unschedule(this.reConnentNet_TimeOut);
			}
		};break;
		default:break;
		}
	},
	startHartConnect:function(){//进行心跳连接
		this.isStartHartConnect = true;
		this.unschedule(this.sendHartConnectMsg);
		this.sendHartConnectMsg();
		this.schedule(this.sendHartConnectMsg,HartConnectTime);
	},
	sendHartConnectMsg:function(){//发送心跳连接信息
		this.isNowConnect = false;
		this.hbtState = 1;
		sfs.send(new SFS2X.Requests.System.ExtensionRequest("hbt",null));
		this.unschedule(this.HartConnectMsgTimeOut);
		this.schedule(this.HartConnectMsgTimeOut,ConnectTimeOut);
	},
	HartConnectMsgTimeOut:function(){//时间到
		this.unschedule(this.HartConnectMsgTimeOut);
		if(this.isNowConnect==false){//断线
			this.isStartHartConnect = false;
			this.unschedule(this.sendHartConnectMsg);
			this.showYesNoTips(WarningCharType.RetryConnect);//断开连接
			this.isShowReconnentLayer=true;
		}
	},
	//重新连接网络 比较重要的部分
	reConnentNetMenu:function(){
		if (PlayerData.scene == gameSceneTag.StartScene){
			this.deleteAllWarnLayer();//开始界面 不做任何处理 直接关闭
		}else{
			if (sfs.isConnected()){ //尝试问我是否在线
				cc.log("尝试问我是否在线");
				this.hbtState = 2;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("hbt",null));//检测我是否在线
				this.schedule(this.reConnentNet_TimeOut,4);
				this.comeToWaitLayer(4);
			}else{//断开连接了重新连接
				cc.log("断开socket了");
				this.hbtState = 0;
				this.comeToWaitLayer(10);
				this.isReConnentNet=true;//重连
				
				//可能要重新创建一个sfs对象
				sfs.connect();
			}
		}
	},
	reConnentNet_TimeOut:function(){
		this.removeWaitLayer();
		this.unschedule(this.reConnentNet_TimeOut);
	},
	onPublicMessage:function(evtParams){//公共的信息
		var sender = evtParams.sender;
		var msg = evtParams.message;
	},
	//警告层的返回处理函数
	showYesNoTips_callback:function(sender){
		var tagNum = sender.tag;
		if (tagNum==WarningCharType.NoYuanBao) { //"哎呀,你的元宝太少啦,去补充些\n元宝就能欺负他们了";
			var scene = cc.director.getRunningScene();
			if (PlayerData.scene == gameSceneTag.GameScene) {
				scene.gameLayer.makeStartGameMenu();
				scene.gameLayer.addShopLayer();
			}
		}else if (tagNum==WarningCharType.LevelRoom) {//"地主说：中途离开，小小罚金\n少不了。确定离开吗";
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("klr",null,
					sfs.roomManager.getRoomById(PlayerData.roomId)));
			GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
		}else if (tagNum==WarningCharType.HaveInRoom) {//"您还在其他房间对局哟，现在\n进去看看吧！";
			GameManager.comeToWaitLayer();
			var parm = {};
			parm.RoomId = PlayerData.roomId;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("rar",parm));
		}else if (tagNum==WarningCharType.NotEnoughRoom){//关闭对话框 显示原来的开始按钮
			var scene = cc.director.getRunningScene();
			if (PlayerData.scene == gameSceneTag.GameScene) {
				scene.gameLayer.makeStartGameMenu();
			}
		}else if (tagNum==WarningCharType.TooMuchStrong){//申请进中级场
			PlayerData.selectChang = 2;
			GameManager.sendMessageToMTP();
			GameManager.comeToWaitLayer(null,1);
		}else if (tagNum==WarningCharType.RetryConnect){//网络不好,点确定重连
			var scene = cc.director.getRunningScene();
			scene.reConnentNetMenu();
		}else if (tagNum==(100+WarningCharType.NoYuanBao)){//返回主页
			GameManager.changeToNextScene(gameSceneTag.SelectRoomScene);
		}
	},
	//发送匹配信息
	sendMessageToMTP:function(){
		var params = {};
		params.FieldId = PlayerData.selectChang;
		params.ModeId=1;
		sfs.send(new SFS2X.Requests.System.ExtensionRequest("mtp",params));
	}
});