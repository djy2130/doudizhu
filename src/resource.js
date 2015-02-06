var s_font = "";
var fontSize = 26;
var res = {
		bomb:"res/bomb.png",
		card: "res/card.png",
		//emoji:"res/emoji.png",
		loadingQuan : "res/loadingQuan.png",

		recharge:"res/recharge.png",
		result:"res/result.png",
		setting:"res/setting.png",
		shopping:"res/shopping.png",

		show:"res/show.png",
		sroom:"res/sroom.png",
		talk:"res/talk.png",
		task:"res/task.png",
		uiAll:"res/uiAll.png",
		//小方块
		startEditbox:"res/box/startEditbox.png",
		warning:"res/box/warning_bg.png",
		lightSpbox:"res/box/lightSpbox.png",
		
		//文字加载
		wenzi1:"res/fnt/wenzi1.fnt",
		wenzi1png:"res/fnt/wenzi1.png",
		wenzi2:"res/fnt/wenzi2.fnt",
		wenzi2png:"res/fnt/wenzi2.png",
		wenzi3:"res/fnt/wenzi3.fnt",
		wenzi3png:"res/fnt/wenzi3.png",
		
		wenzi5:"res/fnt/wenzi5.fnt",
		wenzi5png:"res/fnt/wenzi5.png",
		wenzi6:"res/fnt/wenzi6.fnt",
		wenzi6png:"res/fnt/wenzi6.png",
		wenzi7:"res/fnt/wenzi7.fnt",
		wenzi7png:"res/fnt/wenzi7.png",
		wenzi8:"res/fnt/wenzi8.fnt",//积分 人玩
		wenzi8png:"res/fnt/wenzi8.png",
		wenzi9:"res/fnt/wenzi9.fnt",
		wenzi9png:"res/fnt/wenzi9.png",	
		wenzi10:"res/fnt/wenzi10.fnt",
		wenzi10png:"res/fnt/wenzi10.png",
		wenzi11:"res/fnt/wenzi11.fnt",
		wenzi11png:"res/fnt/wenzi11.png",
		wenzi12:"res/fnt/wenzi12.fnt",
		wenzi12png:"res/fnt/wenzi12.png"
};
var plistRes = {
		bomb:"res/bomb.plist",
		card:"res/card.plist",
		//emoji:"res/emoji.plist",
		loadingQuan:"res/loadingQuan.plist",

		recharge:"res/recharge.plist",
		result:"res/result.plist",
		setting:"res/setting.plist",
		shopping:"res/shopping.plist",

		show:"res/show.plist",
		sroom:"res/sroom.plist",
		talk:"res/talk.plist",
		task:"res/task.plist",
		uiAll:"res/uiAll.plist"
};

var startPng = "res/startRes.png";
var startPlist = "res/startRes.plist";
var gamebgJpg = "res/gamebg.jpg";

//全局游戏ui
var g_resources = [];
for (var i in plistRes) {
	g_resources.push(plistRes[i]);
}
for (var i in res) {
	g_resources.push(res[i]);
}
//开始游戏ui 只包含进度条和一开始的读取界面
var start_resources = [];
start_resources.push(startPng);
start_resources.push(startPlist);
start_resources.push(gamebgJpg);