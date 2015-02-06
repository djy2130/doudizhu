//时间配置
var ClockCountdown = {Dizhu:20,JiaBei:15,ChuPai:30};
//聊天配置文字
var TalkLayerString = [
"快点啊,等到花儿都谢了","恭喜发财,元宝乖乖来","可惜啊，差点就是好牌","一手好牌,天助我也",
"这把，咱能灭了地主","哎，怎么会这样","你的牌打的忒好了玩","有种再来一把","不好意思，离开一会儿"
];
//主页底下的文字
var BottomRoomLabelString=[
"地主说：[每日奖励]领着领着变成了土豪..",
"农民说：[每日奖励]实在是太丰厚了！",
"游戏中，可以免费领取在线礼包",
"游戏时间越长，在线礼包越丰厚",
"地主：[每日奖励]被重置，万元大奖跑了",
"及时领取[每日奖励]，明天就重置了！",
"游戏中逃跑，系统会酌情扣除您的元宝",
"高级场玩的就是任性，玩的就是心跳"
];
//保证和服务器信息对应  小任务显示信息
var taskStrData = {
		id1:{s:"完成游戏4局",mo:100,max:4},
		id2:{s:"游戏胜利2局",mo:200,max:2},
		id3:{s:"地主赢得1局",mo:200,max:1},
		id4:{s:"完成游戏10局",mo:200,max:10},
		id5:{s:"农民赢得2局",mo:200,max:2},
		id6:{s:"游戏胜利3局",mo:200,max:3},
		id7:{s:"充值任意金额",mo:8000,max:1},
		id8:{s:"完成游戏13局",mo:300,max:13},
		id9:{s:"游戏胜利5局",mo:300,max:5},
		id10:{s:"地主赢得2局",mo:300,max:2},
		id11:{s:"农民赢得3局",mo:400,max:3},
}
//总任务
var taskTolData = {
		id1:{num:3,mo:1000},
		id2:{num:3,mo:3000},
		id3:{num:4,mo:10000},
}
///===========上面是配置信息========
var POPLAYER_TAG = { //房间和主页面都有可能打开的任务页面
	TaskLayer:1998,
	TalksLayer:1011
};
var GameState = {
		Ready:1,//准备
		SelectScene:2,//选场//选择高中低级场
		WaitStart:3,//等待开始
		AllStart:5,//凑齐人数,各项数据准备好
		FaPai:7,//发牌		
		QiangDi:9,//抢地主
		Play:10,//开始玩的阶段
		Finish:12,//结束
};
var PhaseState = {
		chihua:"chihua",//初始化
		fapai:"fapai",//发牌
		jiaodizhu:"jiaodizhu",
		jiabei:"jiabei",//加倍
		mingpai:"mingpai",//明牌		
		chupai:"chupai",//出牌
		zaicsh:"zaicsh",//在初始化
		jieshu:"jieshu",//结束
};
var GameData = GameData||{ //一局游戏中的情况
		state:0,//当前阶段
		nowPlayerTrun:0,//现在轮到谁的回合 0,1,2
		nowCards:null,//现在场面上出的牌
		nowCardsType:0,//出牌的类型
		nowCardsPot:-1,//场面上谁出的牌
		nowCardsAreFirst:-1,//场上的卡是不是第一次出牌时
		
		JiaBeiCount:0,//加倍进行的次数
		isMingPai:false,//明牌
		
		dizhuId:-1,//当前地主的id 
		firstDizhuId:-1,//一开始谁先叫地主//0,1,2
		QiangDizhuCount:-1,//抢地主的次数 每抢一次加1
		
		firstJiao:false,//我第一次有没有抢地主
		secondQiang:false,
		
		threeCards:null,//多余的3张卡
		
		myCards:null,//我的卡 0
		myPlayerId:101,//我的玩家id
		myPlayerPot:0,//我的座次
		
		rightCards:null,//右边玩家的卡 1
		rightPlayerId:102,//下标
		rightPlayerPot:1,//右边玩家的座次
		rightPlayerSex:1,//右边玩家的性别
		
		leftCards:null,//左边的玩家 2
		leftPlayerId:103,//下标
		leftPlayerPot:2,//左边玩家座次
		leftPlayerSex:1,//右边玩家的性别
		
		isCanChuPai:false,//能否出牌了
		TrunCount:0,//回合数
		
		winner:0,//农民赢0 地主赢1
		income:0,//战后收入
		isTuoGuan:false,//是否托管
		
		//男加倍 男不加倍 女加倍 女不加倍
		InitData:function (){
			this.state = GameState.Ready;
			this.nowPlayerTrun = 0;//还没开始出牌
			this.nowCards = null;
			this.nowCardsType = 0;
			this.nowCardsPot = -1;
			this.nowCardsAreFirst=-1;//场上的卡是不是第一次出牌时
			
			this.JiaBeiCount=0;
			this.isMingPai = false;
			
			this.dizhuId = -1;//地主的id 
			this.firstDizhuId = -1;//一开始谁先叫地主
			this.QiangDizhuCount = -1;//地主回合
			this.firstJiao = false;//我第一次有没有抢地主
			this.secondQiang = false;//2,3人有没抢
			
			this.threeCards = null;//多余的3张卡

			this.myCards = null;//我的卡 0
			this.myPlayerId = PlayerData.bId;//我的下标
			this.myPlayerPot= 0;//我对应的下标
			
			this.rightCards=null;//右边玩家的卡 1
			this.rightPlayerId=102;//下标
			this.rightPlayerPot=1;//我对应的下标
			this.rightPlayerSex=1;//右边玩家的性别
			
			this.leftCards=null;//左边的玩家 2
			this.leftPlayerId=103;//下标
			this.leftPlayerPot=2;//我对应的下标
			this.leftPlayerSex=1;//右边玩家的性别
			
			this.isCanChuPai =false;//我能出牌了吗
			
			this.TrunCount= 0;
			this.winner =0;
			this.income =0;
			
			this.isTuoGuan=false;
		},
		//我的座位是什么,其他两家的座位是什么
		InitRolesData:function(myId,tmIdList){
			var myZuoCi = 0;
			for (var i = 0; i < tmIdList.length; i++) {
				var element = tmIdList[i];
				cc.log("zuoci %d %d",i,element);
				if (myId==element) {
					myZuoCi = i;
				}
			}
			this.myPlayerId = PlayerData.bId;//我的下标
			this.myPlayerPot = myZuoCi;//我的座次
			this.rightPlayerPot = this.myPlayerPot+1;
			if (this.rightPlayerPot==3) {//右边玩家座次
				this.rightPlayerPot=0;
			}
			this.rightPlayerId=tmIdList[this.rightPlayerPot];
			this.leftPlayerPot = this.myPlayerPot-1;
			if (this.leftPlayerPot==-1) {//左边玩家座次
				this.leftPlayerPot=2;
			}
			this.leftPlayerId=tmIdList[this.leftPlayerPot];
		}
};