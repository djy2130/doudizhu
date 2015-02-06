var menuNodeCallState = {
	start:2,//啥都没有的状态
	first:3,//叫地主,不叫  
	qiang:4,//抢地主,不抢 
	jiabei:5,//加倍，不加
	normal:6,//不出,提示,出牌
	chupai:7,//提示,出牌
	mingpai:8,//明牌
	canNotjiabei:10 //不能加倍
}
//附带判断当前场上的位置
var MenuNode = cc.Node.extend({
	huashe: 0,
	daxiao: 0,
	state: 0,
	btnArr:null,
	isInManage:false,//是否处于托管中，处于托管中则这些按钮完全点不到
	ctor : function (func,objc) {
		this._super();
		this.isInManage = false;
		this.initMenuNode(func,objc);
		return true;
	},
	initMenuNode : function (func,objc) {	
		//对应减1
		//0 = 提示
		//1 = 叫地主
		//2 = 不叫
		//3 = 抢地主
		//4 = 不抢
		//5 = 明牌
		//6 = 加倍
		//7 = 不加倍蓝色
		//8 = 出牌
		//9 = 不出

		//各种按钮，保存在数组中
		this.btnArr = null;
		this.btnArr = [];
		for (var i = 0; i < 10; i++) {
			var charName = "#char_"+(i+1)+".png";
			var btnName;
			if (i==7||i==8) {
				btnName = "#menu_small2.png";
			}else{
				btnName = "#menu_small1.png";
			}
			var menubtn = Helper.createScaleMenuItem(btnName,charName,func,objc);
			menubtn.setPosition(-110,0);
			menubtn.tag = 70+i;
			this.btnArr.push(menubtn);
		}
		var btnMenu = new cc.Menu(this.btnArr);
		btnMenu.setPosition(0,0);
		this.addChild(btnMenu,4);
		
		//出牌
		this.setMenuState(menuNodeCallState.start);
	},
	setMenuState:function (state) {
		this.state = state;
		if (this.isInManage==true) {
			return;
		}
		
		for (var i = 0; i < this.btnArr.length; i++) {
			this.btnArr[i].setPosition(500,0);
		}
		if (state==menuNodeCallState.start) {
		}else if (state==menuNodeCallState.first){//第一次叫地主
			this.btnArr[2].setPosition(-110,0);
			this.btnArr[1].setPosition(110,0);
		}else if (state==menuNodeCallState.qiang){//抢地主
			this.btnArr[3].setPosition(110,0);
			this.btnArr[4].setPosition(-110,0);
		}else if (state==menuNodeCallState.jiabei){//加倍
			this.btnArr[6].setPosition(-110,0);
			this.btnArr[7].setPosition(110,0);
		}else if (state==menuNodeCallState.normal){//接牌
			this.btnArr[9].setPosition(-140,0);
			this.btnArr[0].setPosition(0,0);
			this.btnArr[8].setPosition(140,0);
		}else if (state==menuNodeCallState.chupai){//出牌
			//this.btnArr[7].setPosition(-110,0);
			this.btnArr[0].setPosition(-110,0);
			this.btnArr[8].setPosition(110,0);
		}else if (state==menuNodeCallState.canNotjiabei){//不能加倍
			this.btnArr[7].setPosition(110,0);
		}else if (state==menuNodeCallState.mingpai){//明牌
			//this.btnArr[5].setPosition(-110,0);
			//this.btnArr[8].setPosition(110,0);
			this.btnArr[5].setPosition(-140,0);
			this.btnArr[0].setPosition(0,0);
			this.btnArr[8].setPosition(140,0);
		}
	},
	removeMingMenu: function () { //移除明牌的按钮 
		this.btnArr[5].setPosition(500,0);
	},
	setInManage:function (isManage) {//某个状态
		if (this.isInManage!=isManage) {
			this.isInManage=isManage;
			if (isManage) {
				for (var i = 0; i < this.btnArr.length; i++) {
					this.btnArr[i].setPosition(500,0);
				}
			}else{
				this.setMenuState(this.state);
			}
		}
	},
	onExit : function () {
		this._super();
	},
});
//我的托管节点
var MyManageLayer = cc.Layer.extend({
	myManageNode:null,
	ctor : function (func,objc) {
		this._super();
		
		this.myManageNode = new cc.Node();
		this.myManageNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,196)));
		this.addChild(this.myManageNode,10);

		var itemMenu = Helper.createScaleMenuItem("#menu_small1.png","#show_char7.png",
				func,objc);
		itemMenu.setPosition(0,0);
		var bmenu = new cc.Menu(itemMenu); 
		bmenu.setPosition(0,0);
		this.myManageNode.addChild(bmenu,2);

		var testSp = new cc.Sprite("#show_rob0.png");
		testSp.setPosition(0,48);
		this.myManageNode.addChild(testSp,1);

		return true;
	},
	onEnter : function () {
		this._super();
		var that = this;
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				return true;
			},
		}, this);
	},
});
//我的礼品节点
var MyGiftNode = cc.Node.extend({
	timeLabel:null,
	tmpfunc:null,
	tmpobjc:null,
	btnMenu:null,
	ctor : function (func,objc) {
		this._super();
		this.tmpfunc = func;
		this.tmpobjc = objc;
		
		var itemMenu = Helper.createScaleMenuItem("#sTips_daizi.png",null,
				this.menucallback,this);
		itemMenu.setPosition(0,0);
		itemMenu.tag = 101;
		this.btnMenu = new cc.Menu(itemMenu);
		this.btnMenu.setPosition(0,0);
		this.addChild(this.btnMenu,1);
		//大文字
		this.timeLabel = new cc.LabelBMFont("0:00",res.wenzi12,
				cc.LabelAutomaticWidth,
				cc.TEXT_ALIGNMENT_CENTER);
		this.timeLabel.scale=0.9;
		this.addChild(this.timeLabel,1);
		this.timeLabel.setPosition(0,-12);
		this.timeLabel.scale = 0.8;
		
//		this.timeLabel = new cc.LabelTTF("00:00",s_font,16);
//		this.addChild(this.timeLabel,1);
//		this.timeLabel.setPosition(0,-12);
		
		return true;
	},
	menucallback:function(){
		if (PlayerData.GiftTime<=0) { //停止时可点击
			this.tmpfunc();//运行这个函数
		}else{
			var resultStr="";
			var num = PlayerData.GiftTime;
			if (num>59) {
				var yushu = num%60;
				var zhengshu = Math.floor(num/60);
				resultStr= "再等"+zhengshu+"分"+yushu+"秒领取"+PlayerData.GiftNextMoney+"元宝";
			}else if (num>-1){
				resultStr= "再等"+num+"秒领取"+PlayerData.GiftNextMoney+"元宝";
			}
			GameManager.showTipsLayer(resultStr);
		}
	},
	startTimeCount:function(){
		if (PlayerData.GiftTime>-1) {
			var child = this.btnMenu.getChildByTag(101);
			child.stopAllActions();
			child.setRotation(0);
			
			this.unschedule(this.timeUpdateGame);
			this.LabelNumberToTime(PlayerData.GiftTime)
			this.schedule(this.timeUpdateGame,1);//发布控制命令
		}
	},
	stopClockTime : function () {
		this.unschedule(this.timeUpdateGame);
	},
	LabelNumberToTime: function(num){//时间转分钟
		if (num>59) {
			var yushu = num%60;
			var zhengshu = Math.floor(num/60);
			var timeStr = null;
			if (yushu>9) { timeStr=zhengshu+":"+yushu;}
			else{timeStr=zhengshu+":0"+yushu;}
			this.timeLabel.setString(timeStr);
		}else if (num>-1){
			var timeStr = null;
			if (num>9) { timeStr="0:"+num;}
			else{timeStr="0:0"+num;}
			this.timeLabel.setString(timeStr);
		}
	},
	timeUpdateGame : function () {
		PlayerData.GiftTime = PlayerData.GiftTime - 1;
		if (PlayerData.GiftTime<=0) { //停止
			this.timeLabel.setString("");
			this.unschedule(this.timeUpdateGame);
			
			var child = this.btnMenu.getChildByTag(101);
			var rotateAct = cc.sequence(cc.rotateTo(0.5,-15),cc.rotateTo(0.5,15)).repeatForever();
			child.runAction(rotateAct);
		}else{
			this.LabelNumberToTime(PlayerData.GiftTime);
		}
	},
	onExit:function () {
		this.unschedule(this.timeUpdateGame);
		this._super();
	},
});
//我的奖励节点
var MyJiangNode = cc.Node.extend({
	toumingSp:null,//透明sprite
	redSp:null,//小红点
	btnMenu:null,
	ctor:function(func,objc){
		this._super();
		var itemMenu = Helper.createScaleMenuItem("#sTips_jiang.png",null,
				func,objc);
		itemMenu.setPosition(0,0);
		itemMenu.setOpacity(0);
		this.btnMenu = new cc.Menu(itemMenu);
		this.btnMenu.setPosition(0,0);
		this.addChild(this.btnMenu,1);

		//有奖励的时候就显示节点
		this.toumingSp = new cc.Sprite("#sTips_jiang.png");
		this.toumingSp.setPosition(0,0);
		this.addChild(this.toumingSp,3);
		this.toumingSp.setOpacity(80);
		
		this.redSp = new cc.Sprite("#sTips_jiang.png");
		this.redSp.setPosition(0,0);
		this.addChild(this.redSp,4);
		var redPoint = new cc.Sprite("#sTips_pot.png");
		redPoint.setPosition(44,36);
		this.redSp.addChild(redPoint);
		
		return true;
	},
	setCanLing:function(isLing){
		if (isLing==true) {
			this.toumingSp.visible=false;
			this.redSp.visible=true;
		}else{
			this.toumingSp.visible=true;
			this.redSp.visible=false;
		}
	}
});