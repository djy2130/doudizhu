//任务层
var TaskLayer = TouchCloseLayer.extend({
	oneLineNode:null,
	twoLineNode:null,
	threeLineNode:null,
	totleLineNode:null,
	ctor : function () {
		var thisRect = cc.rect(cc.visibleRect.center.x-430*0.5,
				cc.visibleRect.center.y-360*0.5,430,360);
		this._super(thisRect);
		this.tag = POPLAYER_TAG.TaskLayer;
		this.initLayer();
		return true;
	},
	initLayer:function () {
		var taskBg = new cc.Sprite("#task_bg.png");
		taskBg.setPosition(cc.visibleRect.center);
		this.addChild(taskBg,0);
		
		this.createOneLine(0,PlayerData.taskArr[0],PlayerData.taskProArr[0]);
		this.createOneLine(1,PlayerData.taskArr[1],PlayerData.taskProArr[1]);
		this.createOneLine(2,PlayerData.taskArr[2],PlayerData.taskProArr[2]);
		this.createToltleLine(PlayerData.taskTol,PlayerData.taskTolPro);
	},
	createOneLine:function(line,onetaskId,nowOneProgress){
		//文字
		var tmpNode;
		if (line==0) {
			if (this.oneLineNode) {
				this.oneLineNode.removeFromParent(true);
				this.oneLineNode = null;
			}
			this.oneLineNode = new cc.Node();
			this.oneLineNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,80-70*line)));
			this.addChild(this.oneLineNode,1);
			tmpNode = this.oneLineNode;
		}else if (line==1){
			if (this.twoLineNode) {
				this.twoLineNode.removeFromParent(true);
				this.twoLineNode = null;
			}
			this.twoLineNode = new cc.Node();
			this.twoLineNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,80-70*line)));
			this.addChild(this.twoLineNode,1);
			tmpNode = this.twoLineNode;
		}else if (line==2){
			if (this.threeLineNode) {
				this.threeLineNode.removeFromParent(true);
				this.threeLineNode = null;
			}
			this.threeLineNode = new cc.Node();
			this.threeLineNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,80-70*line)));
			this.addChild(this.threeLineNode,1);
			tmpNode = this.threeLineNode;
		}
		var taskTiao = new cc.Sprite("#task_tiao.png");
		taskTiao.setPosition(cc.p(0,0));
		tmpNode.addChild(taskTiao,0);

		if (onetaskId>0) {
			var skey = "id"+onetaskId;
			var taskDic = taskStrData[skey];
			//cc.log(onetaskId+":s:"+taskDic.s);
			var maxProcess = taskDic.max;//多少个目标
			var nowProcess = nowOneProgress;//当前进度
			var stringProcess = nowProcess+"/"+maxProcess;
			//大文字
			var BMFLabel = new cc.LabelBMFont(taskDic.s,res.wenzi2,cc.LabelAutomaticWidth,
					cc.TEXT_ALIGNMENT_LEFT,cc.p(0, 0));
			BMFLabel.setAnchorPoint(0,0.5);
			tmpNode.addChild(BMFLabel,1);
			BMFLabel.setPosition(cc.p(-140,10));
			//小文字
			var goldLabel = new cc.LabelBMFont("奖励："+taskDic.mo+"元宝",res.wenzi1,cc.LabelAutomaticWidth,
					cc.TEXT_ALIGNMENT_LEFT,cc.p(0,0));
			goldLabel.setAnchorPoint(0,0.5);
			tmpNode.addChild(goldLabel,1);
			goldLabel.setPosition(cc.p(-140,-18));
			//进度条文字
//			var littleProLabel = new cc.LabelTTF(stringProcess,s_font,16);
			var littleProLabel = new cc.LabelBMFont(stringProcess,res.wenzi11);
			tmpNode.addChild(littleProLabel,3);
			littleProLabel.setPosition(cc.p(80,-2));
//			littleProLabel.color = cc.color(23,99,127);
			
			//按钮显示
			if(nowProcess>=maxProcess){
				//按钮
				var menuitem = Helper.createScaleMenuItem("#task_btn1.png","#task_btnchar.png",this.menucallback,this);
				menuitem.setPosition(0,0);
				menuitem.tag = line + 10;
				var btnMenu = new cc.Menu(menuitem);
				btnMenu.setPosition(150,2);
				tmpNode.addChild(btnMenu,1);
			}else{
				//进度条
				var progressBg = new cc.Sprite("#task_btn0.png");
				progressBg.setPosition(cc.p(150,2));
				tmpNode.addChild(progressBg,1);
				var proSp = new cc.Sprite("#task_btn1.png");
				var progress = new cc.ProgressTimer(proSp);
				tmpNode.addChild(progress,2);
				progress.setPosition(progressBg.getPosition());
				progress.type = cc.ProgressTimer.TYPE_BAR;
				progress.midPoint = cc.p(0,0.5);
				progress.barChangeRate = cc.p(1,0);
				var nowpercentage = Math.floor(nowProcess/maxProcess*100);
				if (nowpercentage>100) { nowpercentage = 100;}
				progress.percentage = nowpercentage;
				
				var lingquSp = new cc.Sprite("#task_btnchar.png");
				lingquSp.setPosition(progressBg.getPosition());
				tmpNode.addChild(lingquSp,3);
			}
		}else{
			var nomoreSprite = new cc.Sprite("#task_nomore.png");
			nomoreSprite.setPosition(cc.p(-70,0));
			tmpNode.addChild(nomoreSprite,1);
		}
	},
	createToltleLine:function(toltaskId,nowTolProgress){
		if (this.totleLineNode) {
			this.totleLineNode.removeFromParent(true);
			this.totleLineNode = null;
		}
		this.totleLineNode = new cc.Node();
		this.totleLineNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(0,-144)));
		this.addChild(this.totleLineNode,1);
		
		if(toltaskId>0){
			//进度
			var sTolkey = "id"+toltaskId;
			var taskTolDic = taskTolData[sTolkey];
			var maxTolPro = taskTolDic.num;//多少个目标
			var nowTolPro = nowTolProgress;//当前进度
			var nowTolProNumber = Math.floor(nowTolPro/maxTolPro*100);
			var stringTolPro = nowTolPro+"/"+maxTolPro;
			//完成度
			var targetStr = "完成"+maxTolPro+"个目标 领取大奖";
			var targetLabel= new cc.LabelBMFont(targetStr,res.wenzi1,cc.LabelAutomaticWidth,
					cc.TEXT_ALIGNMENT_LEFT,cc.p(0,0));
			targetLabel.setAnchorPoint(0,0.5);
			targetLabel.setPosition(cc.p(-176,28));
			this.totleLineNode.addChild(targetLabel,1);
			//进度条
			var progressBg = new cc.Sprite("#task_process1.png");
			progressBg.setPosition(cc.p(-60,0));
			this.totleLineNode.addChild(progressBg,1);
			var proSp = new cc.Sprite("#task_process2.png");
			var progress = new cc.ProgressTimer(proSp);
			this.totleLineNode.addChild(progress,2);
			progress.setPosition(progressBg.getPosition());
			progress.type = cc.ProgressTimer.TYPE_BAR;
			progress.midPoint = cc.p(0,0.5);
			progress.barChangeRate = cc.p(1,0);
			progress.percentage = nowTolProNumber;

			//进度条文字
//			var progressLabel = new cc.LabelTTF(stringTolPro,s_font,15);
			var progressLabel = new cc.LabelBMFont(stringTolPro,res.wenzi11);
//			progressLabel.color = cc.color(0,0,0);
			progressLabel.setPosition(progressBg.getPosition());
			this.totleLineNode.addChild(progressLabel,3);
			
			//按钮
			var fonbtn = null;
			if (toltaskId==1) {
				fonbtn = "#task_qian.png";
			}else if (toltaskId==2){
				fonbtn = "#task_san.png";
			}else if (toltaskId==3){
				fonbtn = "#task_wan.png";
			}
			//按钮显示
			if(nowTolPro>=maxTolPro){
				var TolMenuItem = Helper.createScaleMenuItem("#task_btn.png",fonbtn,
						this.menucallback,this);
				TolMenuItem.setPosition(0,0);
				TolMenuItem.tag = 50;
				var TolMenu = new cc.Menu(TolMenuItem);
				TolMenu.setPosition(cc.p(progressBg.getPositionX()+206,progressBg.getPositionY()+6));
				this.totleLineNode.addChild(TolMenu,1);
			}else{
				var LockMenuSprite = new cc.Sprite("#task_btn.png");
				LockMenuSprite.setPosition(cc.p(progressBg.getPositionX()+206,progressBg.getPositionY()+6));
				this.totleLineNode.addChild(LockMenuSprite,1);
				
				var fonbtnSprite = new cc.Sprite(fonbtn);
				fonbtnSprite.setPosition(cc.p(LockMenuSprite.getContentSize().width/2,
						LockMenuSprite.getContentSize().height/2));
				LockMenuSprite.addChild(fonbtnSprite,1);
				
				var LockSp = new cc.Sprite("#task_lock.png");
				LockSp.setPosition(cc.p(LockMenuSprite.getContentSize().width-16,
						LockMenuSprite.getContentSize().height-18));
				LockMenuSprite.addChild(LockSp,2);
			}
		}else{//你太牛 大奖都跟你走了
			var niuSprite = new cc.Sprite("#task_niu.png");
			niuSprite.setPosition(cc.p(0,18));
			this.totleLineNode.addChild(niuSprite,1);
		}
	},
	menucallback:function (sender){
		var tagNum = sender.tag;
		if (tagNum<50) {
			var tmpId;
			if (tagNum==10) {
				tmpId = PlayerData.taskArr[0];
			}else if (tagNum==11) {
				tmpId = PlayerData.taskArr[1];
			}else if (tagNum==12) {
				tmpId = PlayerData.taskArr[2];
			}
			cc.log("send rdt "+tmpId);
			var params = {};
			params.Id = tmpId;
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("rdt",params));
		}else if (tagNum==50) {
			cc.log("send edt ");
			sfs.send(new SFS2X.Requests.System.ExtensionRequest("edt",null));
		}
	},
	updateTask:function(){
		this.createOneLine(0,PlayerData.taskArr[0],PlayerData.taskProArr[0]);
		this.createOneLine(1,PlayerData.taskArr[1],PlayerData.taskProArr[1]);
		this.createOneLine(2,PlayerData.taskArr[2],PlayerData.taskProArr[2]);
		this.createToltleLine(PlayerData.taskTol,PlayerData.taskTolPro);
	}
});