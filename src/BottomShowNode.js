var BottomRoomNode = cc.Node.extend({
	yuanNumber:null,
	bottomLabel:null,
	LevelLabel:null,
	NameLabel:null,
	label_score:null,
//	NameLabel:null,
	headSprite:null,
	nowheadSpriteSex:0,
	ctor: function (func,objc) {
		this._super();
		this.initBottomRoomNode(func,objc);
		return true;
	},
	initBottomRoomNode: function (func,objc){
		//底边
		var bgSprite = new cc.Sprite("#uiroom_bg.png");
		bgSprite.setPosition(0,20);
		bgSprite.scale = 2;
		this.addChild(bgSprite,0);

		//商店
		var itemSprite1 = Helper.createScaleMenuItem("#uiroom_shop.png",null,func,objc);
		itemSprite1.tag = 201;
		itemSprite1.setPosition(106,84);
		//每日奖励  倒计时
		var itemSprite2 = Helper.createScaleMenuItem("#uiroom_task.png",null,func,objc);
		itemSprite2.tag = 202;
		itemSprite2.setPosition(186,72);
		//人头背景
		var itemSprite3 = Helper.createScaleMenuItem("#uiroom_box.png",null,func,objc);
		itemSprite3.tag = 203;
		itemSprite3.setPosition(-170,86);
		var btnMenu = new cc.Menu(itemSprite1,itemSprite2,itemSprite3);
		btnMenu.setPosition(0,0);
		this.addChild(btnMenu,1);
		
		//文字
		//var testStr = "巧:初级场使用的道具,在高级场无效";
		this.bottomLabel = new cc.LabelBMFont("",res.wenzi7,380,cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(this.bottomLabel,1);
		this.bottomLabel.setPosition(0,18);
		//this.bottomLabel.color = cc.color(156,103,85);
		this.updatebottomLabel();
		
		//喇叭
		var smalllaba = new cc.Sprite("#uiroom_laba.png");
		this.addChild(smalllaba,1);
		smalllaba.setPosition(-200,18);
//		//人头背景
//		var headSpriteBg = new cc.Sprite("#uiroom_head.png");
//		this.addChild(headSpriteBg,1);
//		headSpriteBg.setPosition(-170,86);
		//人头
		this.setHandPngBySex();
		//名字背景
		var namebgSp = new cc.Sprite("#uiroom_namebg.png");
		this.addChild(namebgSp,1);
		namebgSp.setPosition(-50,110);

		//元宝
		this.yuanNumber = new NumberLabel(2,PlayerData.money);
		this.yuanNumber.setPosition(-72,76);
		this.addChild(this.yuanNumber,4);
		//元宝背景
		var yuanSprite = new cc.Sprite("#ui_bao.png");
		yuanSprite.setPosition(-102,76);
		yuanSprite.scale = 0.5;
		this.addChild(yuanSprite,0);
		//积分
		var str_score = "积分: "+PlayerData.score;
		this.label_score = new cc.LabelBMFont(str_score,res.wenzi8,200,cc.TEXT_ALIGNMENT_LEFT);
		this.label_score.setAnchorPoint(0,0.5);
		this.label_score.setPosition(-116,50);
		this.addChild(this.label_score,2);
	},
	setHandPngBySex:function(){
		if (PlayerData.sex!=this.nowheadSpriteSex) {
			this.nowheadSpriteSex = PlayerData.sex;
			var spriteName= "#uiroom_head2.png";
			if (PlayerData.sex==1) {
				spriteName= "#uiroom_head1.png";
			}
			if(this.headSprite){
				this.headSprite.removeFromParent(true);
			}
			this.headSprite = new cc.Sprite(spriteName);
			this.addChild(this.headSprite,4);
			this.headSprite.setPosition(-170,86);
		}
	},
	onEnter:function(){
		this._super();
		this.schedule(this.updatebottomLabel,20);
	},
	updatebottomLabel:function () {
		var ranPot = Math.floor(Math.random()*BottomRoomLabelString.length);
		var btnStr = BottomRoomLabelString[ranPot];
		this.bottomLabel.setString(btnStr);
	},
	onExit: function() {
		this.unschedule(this.updatebottomLabel);
		this._super();
	},
});
//底部的几个按钮层
var BottomShowNode = cc.Node.extend({
	bgSprite:null,
	beiNumber:null,
	yuanNumber:null,
	label:null,
	btnMenu:null,
	ctor: function (func,objc,senceChange){
		this._super();
		this.initTopShowNode(func,objc,senceChange);
		return true;
	},
	setYuanNumber: function (number) {
		this.yuanNumber.setNumber(number);
	},
	setBeiNumber: function  (number) {
		this.beiNumber.setNumber(number);
	},
	initTopShowNode: function (func,objc,senceChange){
		var bgSprite = new cc.Sprite("#uibom_bg.png");
		bgSprite.setPosition(0,0);
		this.addChild(bgSprite,2);

		this.beiSp = new cc.Sprite("#uibom_bei.png");
		this.beiSp.setPosition(70,6);
		this.addChild(this.beiSp,4);

		var itemSprite = Helper.createScaleMenuItem("#uibom_baobtn.png",null,func,objc);
		itemSprite.tag = 123;
		itemSprite.setPosition(0,0);
		this.btnMenu = new cc.Menu(itemSprite);
		this.btnMenu.setPosition(-186,2);
		this.addChild(this.btnMenu,5);

		this.beiNumber = new NumberLabel(1,14);
		this.beiNumber.setPosition(100,-3);
		this.addChild(this.beiNumber,4);

		this.yuanNumber = new NumberLabel(2,PlayerData.money);
		this.yuanNumber.setPosition(-140,-3);
		this.addChild(this.yuanNumber,4);
		
		if (senceChange>0) {
			var piaoArr = ["380","980","1980","3980"];
			var fengArr = ["3000","3万","20万","50万"];
			var strValue = "本场门票"+piaoArr[senceChange-1]+"元宝,封顶输赢"+fengArr[senceChange-1]+"元宝";
			this.label = new cc.LabelBMFont(strValue,res.wenzi9);
			//this.label.color = cc.color(140,52,28);
			this.label.setPosition(0,-3);
			this.addChild(this.label,5);
		}
	},
	setShowLabel:function(isShow){
		if(isShow){
			if (this.label) {
				this.label.visible = true;
			}
			this.beiSp.visible = false;
			this.btnMenu.visible = false;
			this.beiNumber.visible = false;
			this.yuanNumber.visible = false;
		}else{
			if (this.label) {
				this.label.visible = false;
			}
			this.beiSp.visible = true;
			this.btnMenu.visible = true;
			this.beiNumber.visible = true;
			this.yuanNumber.visible = true;
		}
	},
});