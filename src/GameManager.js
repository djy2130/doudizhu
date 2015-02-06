var isTestChuPai = 0; //出牌模式的测试,直接跳到出牌阶段,跳出抢地主阶段直接我就是地主
var isTestFaPai = 0; //发牌模式的测试,不用随机牌直接
var GameManager = GameManager || {
	//测试模式
	initOneCardGame: function() {
		//生成一副新卡组
		var NewCardArray = [];
		for (var i = 1; i < 55; i++) {
			NewCardArray.push(i)
		}
		//随机分牌
		var fenpaiArr = Logic.getStartCard(NewCardArray,true);
		//分完牌后没人拿牌
		//展示
		var scene = cc.director.getRunningScene();
		//展示多余的卡
		scene.gameLayer.setShowThreeCardNode(fenpaiArr[3]);
		
		//初始化卡牌
		GameData.myCards = fenpaiArr[0];
		GameData.rightCards = fenpaiArr[1];
		GameData.leftCards  = fenpaiArr[2];
		GameData.threeCards = fenpaiArr[3];//不常使用
		
		//将多余的卡放入地主卡中
		if (isTestChuPai) {
			//我就是地主
			for (var i = 0; i < fenpaiArr[3].length; i++) {
				var element = fenpaiArr[3][i];
				GameData.myCards.push(element);
			}
			//测试卡牌
			if (isTestFaPai) {
				var testarrr=["J1","J2","C3","S3","C3","C4","S4","D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"];
				GameData.myCards = Logic.charConvertToNumArr(testarrr);
			}
			GameData.myCards = Logic.sortCards(GameData.myCards);
		}
		//将所有的卡放到屏幕上
		//scene.gameLayer.setMyCards(GameData.myCards);
		//我的
		scene.gameLayer.setMyCardsAnimate(GameData.myCards);
		//scene.gameLayer.otherPlayerRight.showCards(GameData.rightCards);
		//scene.gameLayer.otherPlayerLeft.showCards(GameData.leftCards);
	},
	playSound:function(type,posId) {//播放音乐
		if(PlayerData.isMusic){
			var tmpSoundSex=1;
			if (posId) {
				if (posId==GameData.myPlayerPot){
					tmpSoundSex = PlayerData.sex;
				}else if (posId==GameData.rightPlayerPot){
					tmpSoundSex = GameData.rightPlayerSex;
				}else{
					tmpSoundSex = GameData.leftPlayerSex;
				}
			}
			var musicFile = getSoundRes(type,tmpSoundSex);
			if(musicFile){
				cc.audioEngine.playEffect(musicFile);
			}
		}
	},
	playCardTypeMusic:function(cardtype,cardsLength,posId){//播放出牌时音乐
		if(cardsLength>2){
			if(cardtype== CardType.Dan){
				GameManager.playSound(MusicType.dan,posId);
			}else if (cardtype== CardType.Shuang) {
				GameManager.playSound(MusicType.shuang,posId);
			}else if (cardtype== CardType.San) { 
				GameManager.playSound(MusicType.san,posId);
			}else if (cardtype== CardType.SanDaiOne){ 
				GameManager.playSound(MusicType.sanone,posId);
			}else if (cardtype== CardType.DanShun){
				GameManager.playSound(MusicType.shunzi,posId);
			}else if (cardtype== CardType.ShuangShun){
				GameManager.playSound(MusicType.shuangshun,posId);
			}else if (cardtype== CardType.SanShun){
				GameManager.playSound(MusicType.sanshun,posId);
			}else if (cardtype== CardType.FeiJi){
				GameManager.playSound(MusicType.feiji,posId);
			}else if (cardtype== CardType.SiDai){
				GameManager.playSound(MusicType.sidai,posId);
			}else if (cardtype== CardType.SanDaiTwo){
				GameManager.playSound(MusicType.santwo,posId);
			}else if (cardtype== CardType.FeiJiDaiTwo){
				GameManager.playSound(MusicType.feiji,posId);
			}else if (cardtype== CardType.Bomb){
				GameManager.playSound(MusicType.bomb,posId);
			}else if (cardtype== CardType.HuoJian){
				GameManager.playSound(MusicType.huojian,posId);
			}
		}else if (cardsLength==2){
			GameManager.playSound(MusicType.lefttwo,posId);
		}else if (cardsLength==1){
			GameManager.playSound(MusicType.leftone,posId);
		}
	},
	pauseMusic: function() {//播放音乐
		PlayerData.isMusic = !PlayerData.isMusic;
		if (cc.audioEngine.isMusicPlaying()) {
		//if (!PlayerData.isMusic) {
			cc.audioEngine.stopAllEffects();
			cc.audioEngine.stopMusic();//恢复音乐
		}else{//恢复背景音乐
			if (!cc.sys.isNative && cc.sys.isMobile){
				GameManager.playBgMusic(LoopMusicType.bg);
//				if (PlayerData.scene == gameSceneTag.GameScene){
//					//var scene = cc.director.getRunningScene();
//					//if(scene.gameLayer.state == GameLayerState.Ready){
//					//	GameManager.playBgMusic(LoopMusicType.bg);
//					//}
//					GameManager.playBgMusic(LoopMusicType.bg);
//				}else if (PlayerData.scene == gameSceneTag.SelectRoomScene) {
//					GameManager.playBgMusic(LoopMusicType.bg);
//				}
			}else{
				GameManager.playBgMusic(LoopMusicType.bg);
			}
		}
	},
	MusicComeToBack:function(isback) {//播放背景音乐
		if (isback) {
			if (PlayerData.isMusic) {
				if (cc.audioEngine.isMusicPlaying()) {
					cc.audioEngine.pauseMusic();
				}
			}
		}else{
			if (PlayerData.isMusic) {
				cc.audioEngine.resumeMusic();
			}
		}
	},
	playBgMusic:function(musicType) {//播放背景音乐
		if(PlayerData.isMusic){
			if(musicType==LoopMusicType.bg){
				cc.audioEngine.playMusic(LoopMusicRes.bg,true);
			}else if(musicType==LoopMusicType.fail){
				cc.audioEngine.playEffect(LoopMusicRes.fail);
			}else if(musicType==LoopMusicType.fapai){
				//cc.audioEngine.playSound(LoopMusicRes.fapai,false);
			}else if(musicType==LoopMusicType.win){
				cc.audioEngine.playEffect(LoopMusicRes.win);
			}
		}
	},
	runStartScene : function () {
		var scene = new GameScene();
		if (isComeGameScene) {
			scene.setView(gameSceneTag.GameScene);//游戏层
		}else{
			scene.setView(gameSceneTag.StartScene);//开始界面
		}
		cc.director.runScene(scene);
	},
	changeToNextScene:function (SceneTag) {
		var scene = cc.director.getRunningScene();
		scene.setView(SceneTag);//3个view
	},
	showTipsLayer:function (parm,tmptime) {
		var scene = cc.director.getRunningScene();
		scene.showTipsLayer(parm,tmptime);
	},
	comeToWaitLayer:function (time,parm) {
		var scene = cc.director.getRunningScene();
		scene.comeToWaitLayer(time,parm);
	},
	removeWaitLayer:function () {
		var scene = cc.director.getRunningScene();
		scene.removeWaitLayer();
	},
	restartGameLayer:function () {
		var scene = cc.director.getRunningScene();
		scene.gameLayer.restartGameLayer();
	},
	sendMessageToMTP:function () {
		var scene = cc.director.getRunningScene();
		scene.sendMessageToMTP();
	},
}