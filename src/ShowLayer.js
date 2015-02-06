var ClockPosition = {Start:0,My:1,Right:2,Left:3,MyTwo:4};
//展示层  十分重要
var ShowLayer = cc.Layer.extend({
	clockSp:null,//时钟层 同一时间只有一个时钟
	clockLabel:null,
	myNode:null,//我的文字节点
	rightNode:null,
	leftNode:null,
	isInManage:false,//是否我是在托管
	ctor : function () {
		this._super();
		this.initShowLayer();
		return true;
	},
	//显示任务层
	initShowLayer:function () {
		this.myNode = new cc.Node();
		this.myNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,340)));//370
		this.addChild(this.myNode,1);

		this.rightNode = new cc.Node();
		this.rightNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,80)));
		this.addChild(this.rightNode,1);

		this.leftNode = new cc.Node();
		this.leftNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,80)));
		this.addChild(this.leftNode,1);
		
		//缩放
		this.myNode.scale = MAIN_SCALE;
		this.rightNode.scale = MAIN_SCALE;
		this.leftNode.scale = MAIN_SCALE;
		
		//闹钟节点
		this.clockSp = new cc.Sprite("#naozhong.png");
		this.clockSp.setPosition(520,0);
		this.addChild(this.clockSp,4);
		//闹钟倒计时
		this.clockLabel = new cc.LabelBMFont("0",res.wenzi3,
				cc.LabelAutomaticWidth,cc.TEXT_ALIGNMENT_CENTER);
		this.clockLabel.setPosition(33,31);//68 66
		//this.clockLabel.color = cc.color(165,28,1);
		this.clockSp.addChild(this.clockLabel);
	},
	setInManage:function (isManage) {//某个状态
		if (this.isInManage!=isManage) {
			this.isInManage=isManage;
			if (isManage) {
				this.clockSp.visible = false;
			}else{
				this.clockSp.visible = true;
			}
		}
	},
	//设置时钟的状态
	setClockSpState:function(state) {
		this.clockSp.visible = true;
		if (state==ClockPosition.Start) {
			this.clockSp.setPosition(520,0);
			this.unschedule(this.timeUpdateGame);
		}else if (state==ClockPosition.My) {
			if (this.isInManage) {
				this.clockSp.visible = false;
			}
			this.clockSp.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,270)));//300
		}else if (state==ClockPosition.Right) {
			this.clockSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,100)));
		}else if (state==ClockPosition.Left) {
			this.clockSp.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,100)));
		}else if (state==ClockPosition.MyTwo) {
			if (this.isInManage) {
				this.clockSp.visible = false;
			}
			this.clockSp.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,340)));
		}
	},
	//from = 一个数字 
	//1，2，3这样的一个临时id 每个玩家都有一个
	//1必定为地主
	//from = 一个卡牌数组，前面必定有东西给他排过序
	showCards:function(posId,cards) {
		//是否是自己出的
		//判断是左边 右边 还是中间
		//从玩家的bid找到当前的posid
		var normalDis = 32;
		if (cards.length>4) {
			normalDis = 18;
		}
		if (posId==GameData.myPlayerPot) {//中间
			this.myNode.removeAllChildren(true);
			for (var i = 0; i < cards.length; i++) {
				var onecard = cards[i];
				var testSp = new CardSprite(onecard);
				testSp.setPosition(-(cards.length-1)*0.5*normalDis+i*normalDis,10);
				testSp.scale = 0.8;
				this.myNode.addChild(testSp,1);
			}
		}else if (posId==GameData.rightPlayerPot) {//右边
			this.rightNode.removeAllChildren(true);
			for (var i = 0; i < cards.length; i++) {
				var onecard = cards[i];
				var testSp = new CardSprite(onecard);
				//testSp.setPosition(400-(cards.length-1)*normalDis+i*normalDis,500);
				testSp.setPosition(cc.p(55-(cards.length-1)*normalDis+i*normalDis,10));
				testSp.scale = 0.8;
				this.rightNode.addChild(testSp,1);
			}
		}else{//左边
			this.leftNode.removeAllChildren(true);
			for (var i = 0; i < cards.length; i++) {
				var onecard = cards[i];
				var testSp = new CardSprite(onecard);
				testSp.setPosition(cc.p(-65+i*normalDis,10));
				//testSp.setPosition(40+i*normalDis,500);
				testSp.scale = 0.8;
				this.leftNode.addChild(testSp,1);
			}
		}
		
	},
	//0 = 不出
	//1 = 不加倍
	//2 = 不叫
	//3 = 不抢
	//4 = 加倍
	//5 = 叫地主
	//6 = 抢地主
	addText:function(posId,type) {
		var testStr = "#show_char"+type+".png";
		var testSp = new cc.Sprite(testStr);
		testSp.setPosition(0,0);
		if (posId == GameData.myPlayerPot) {
			this.myNode.removeAllChildren(true);
			this.myNode.addChild(testSp);
		}else if (posId == GameData.rightPlayerPot) {
			this.rightNode.removeAllChildren(true);
			this.rightNode.addChild(testSp);
		}else{
			this.leftNode.removeAllChildren(true);
			this.leftNode.addChild(testSp);
		}
	},
	clearAfterTime: function(time) {
		this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(this.clearText,this)));
	},
	clearText: function() {
		this.myNode.removeAllChildren(true);
		this.rightNode.removeAllChildren(true);
		this.leftNode.removeAllChildren(true);
	},
	clearAll: function() {
		this.myNode.removeAllChildren(true);
		this.rightNode.removeAllChildren(true);
		this.leftNode.removeAllChildren(true);
	},
	startClockByState:function(clockState){
		this.startClockTime(clockState);
	},
	startClockTime:function(time) {
		this.unschedule(this.timeUpdateGame);
		this.nowTime = time;
		this.clockLabel.setString(this.nowTime.toString());
		this.schedule(this.timeUpdateGame,1);//发布控制命令
	},
	stopClockTime : function () {
		this.unschedule(this.timeUpdateGame);
	},
	timeUpdateGame : function () {
		this.nowTime = this.nowTime - 1;
		this.clockLabel.setString(this.nowTime.toString());
		if (this.nowTime<=0) { //停止
			this.unschedule(this.timeUpdateGame);
		}
	},
})