var MusicType = {
		bomb:0,//炸弹
		bujiabei:1,//不加倍
		bujiao:2,//不叫
		buqiang:3,//不抢
		dan:4,//单牌
		dani:5,//大你
		feiji:6,//飞机
		huojian:7,//火箭
		jiabei:8,//加倍
		jiao:9,//叫地主
		leftone:10,//剩一张牌了
		lefttwo:11,//剩2张牌了
		ming:12,//明牌
		pass:13,//pass
		qiang:14,//抢地主
		sanshun:15,//三顺
		san:16,//三张
		sanone:17,//三带1
		santwo:18,//三带2
		shuang:19,//一对
		shuangshun:20,//双顺
		shunzi:21,//顺子
		sidai:22,//四带二
}
var getSoundRes = function (type,sex) {
	var ranMusicNum = 1;
	var sName = null;
	switch (type) {
	case MusicType.bomb:{sName="bomb";}break;
	case MusicType.bujiabei:{sName="bujiabei";}break;
	case MusicType.bujiao:{sName="bujiao";}break;
	case MusicType.buqiang:{sName="buqiang";}break;
	case MusicType.dan:{sName="danpai";}break;
	case MusicType.dani:{sName="dani";ranMusicNum=2;}break;
	case MusicType.feiji:{sName="feiji";}break;
	case MusicType.huojian:{sName="huojian";}break;
	case MusicType.jiabei:{sName="jiabei";}break;
	case MusicType.jiao:{sName="jiao";}break;
	case MusicType.leftone:{sName="leftone";}break;
	case MusicType.lefttwo:{sName="lefttwo";}break;
	case MusicType.ming:{sName="ming";}break;
	case MusicType.pass:{sName="pass";ranMusicNum = 2;}break;
	case MusicType.qiang:{sName="qiang";}break;
	case MusicType.sanshun:{sName="sanshun";}break;
	case MusicType.san:{sName="san";}break;
	case MusicType.sanone:{sName="sanone";}break;
	case MusicType.santwo:{sName="santwo";}break;
	case MusicType.shuang:{sName="duizi";}break;
	case MusicType.shuangshun:{sName="shuangshun";}break;
	case MusicType.shunzi:{sName="shunzi";}break;
	case MusicType.sidai:{sName="sidai";}break;
	default:
		break;
	}
	if (sName) {
		var fileName= null;
		var SoundSex = 1;//woman = 2;
		if(sex==2){ SoundSex = 2;}
		if (ranMusicNum==1) {
			fileName="res/sound"+SoundSex+"/"+sName+".mp3";
		}else{
			var tmprandom = Math.floor(Math.random()*ranMusicNum);//整数
			fileName="res/sound"+SoundSex+"/"+sName+tmprandom+".mp3";
		}
		//cc.log("fileName %s",fileName);
		return fileName;
	}
	return null;
}
var LoopMusicRes = {
		bg:"res/music/bg.mp3",
		fail:"res/music/fail.mp3",
		fapai:"res/music/fapai.mp3",
		win:"res/music/win.mp3"
}
var LoopMusicType = {
		bg:1,
		fail:2,
		fapai:3,
		win:4
}
//声音播放队列，控制同时播放的问题
var MusicQueueNode = cc.Node.extend({
	queue:[],//声音队列 //1男生加倍//2女生加倍//3男不加倍//4女不加倍
	miao:0.5,
	//isPlaying:false,
	nowSound:0,
	ctor:function(){
		this._super();
		return true;
	},
	//0.5s的延迟
	play:function(musicData){
		if (this.nowSound==0) {
			//播放
			this.playSound(musicData);
		}else{
			//存在队列中
			this.queue.push(musicData);
		}
	},
	playSound:function(musicData){
		this.nowSound=musicData;
		this.runAction(cc.sequence(cc.delayTime(this.miao),
				cc.callFunc(this.playSound_callBack,this)));
		var type = MusicType.jiabei;
		var tmpSoundSex = 1;
		if (musicData>2) {
			type = MusicType.bujiabei;
		}
		if (musicData==2||musicData==4) {
			tmpSoundSex = 2;
		}
		var musicFile = getSoundRes(type,tmpSoundSex);
		if(musicFile){
			cc.audioEngine.playEffect(musicFile);
		}
	},
	playSound_callBack:function(sender){
		sender.nowSound=0;
		if (sender.queue.length>0){
			var qian = sender.queue.shift();
			sender.playSound(qian);
		}
	}
})