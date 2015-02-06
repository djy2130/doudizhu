//全局管理类，主要负责切换场景
var gameSceneTag = {
		NULLScene:0,
		StartScene:1,
		GameScene:2,
		SelectRoomScene:6,
};
//重连状态
var RID_STATE = {Start:0,SelectRoom:1,TimeOut:2};//重连状态
//玩家相关的全局数据
var PlayerData = PlayerData ||{
		myAccount:"",//我的登录账户信息
		password:"",//密码
		passwordSure:"",
		scene:0,//用户当前处在的场景
		bId:100,//玩家id
		sendTmpName:"",
		name:"测试",//玩家名字
		sex:1,//1是男2是女
		level:1,//等级
		money:0,//金钱
		score:100,//积分
		nowExp:0,//当前经验
		nextExp:100,//下一等级经验
		selectChang:1,//选择的是哪个场
		isMusic:false,//是否开启音乐
		isujz:false,//是否已经准备好了
		roomId:-1,//房间编号
		beiShu:0,//主角的倍数
		isFirstRecharge:false,//是不是已经首充了
		isStartInRoom:false,//是不是在房间中
		isConnection:true,//是不是掉线了
		//场
		Field1:1000,
		Field2:1000,
		Field3:1000,
		Field4:1000,
		//礼品时间
		GiftTime:1000,
		GiftNextMoney:500,
		//任务id
		taskArr:null,
		taskProArr:null,
		taskTol:0,
		taskTolPro:0,
		
		//rid的重连状态
		nowRidMsg:0,
		initPlayerData:function(){
			this.scene = 0;//初始界面是0 表示什么都没有
			this.bId = 100;
			this.name = "测试";
			this.money = 0;
			this.sex = 1;
			this.score = 100;
			this.isMusic = true;//开启音乐
			this.isStartInRoom = false;
			this.isConnection = true;
			this.selectChang = 1;
			this.isujz = false;//是不是第一次拿玩家数据
			this.isFirstRecharge=false;
			this.roomId = -1;
			this.beiShu = 0;
			this.Field1 = 1000;
			this.Field2 = 1000;
			this.Field3 = 1000;
			this.Field4 = 1000;
			
			this.taskArr=[];
			this.taskProArr=[];
			this.taskTol=0;
			this.taskTolPro=0;
			for (var i=0;i< 3;i++) {
				this.taskArr[i]=0;
			}
			for (var i=0;i< 3;i++) {
				this.taskProArr[i]=0;
			}
			this.nowRidMsg = RID_STATE.Start;
		},
};