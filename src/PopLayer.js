//点击外部范围之后关闭
var TouchCloseLayer = cc.Layer.extend({
	thisRect: null,
	isclosdMenu: false,
	ctor : function (rect) {
		this._super();
		this.isclosdMenu = false;
		//cc.log("rect %d %d",rect.x,rect.y);
		this.thisRect = cc.rect(rect.x,rect.y,rect.width,rect.height)
		//cc.log("thisRect %d %d",this.thisRect.x,this.thisRect.y);
		return true;
	},
	onEnter : function () {
		this._super();
		var that = this;
		//全部事件都捕获//不让你点到下面的层
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				//cc.log("touch this %d %d",touchPoint.x,touchPoint.y);
				if (!cc.rectContainsPoint(that.thisRect,touchPoint)) {
					that.isclosdMenu = true;
				}
				return true;
			},
			onTouchEnded: function (touch, event) {
				if (that.isclosdMenu) {
					that.closdThisMenu();
				}
			}
		}, this);
	},
	closdThisMenu: function() {
		this.removeFromParent(true);
	},
});
//商店 //414 610
var ShoppingLayer = TouchCloseLayer.extend({
	btnMenu:null,
	ctor : function (tmpscale) {
		var thisRect = cc.rect(cc.visibleRect.center.x-400*0.5*tmpscale,
				cc.visibleRect.center.y-580*0.5*tmpscale,400*tmpscale,580*tmpscale);
		this._super(thisRect);
		this.initLayer();
		this.setScale(tmpscale);
		return true;
	},
	initLayer : function () {
		var shopBg = new cc.Sprite("#shop_bg.png");
		shopBg.setPosition(cc.visibleRect.center);
		shopBg.scale = 1.2;
		this.addChild(shopBg,0);

		var menuPosY = [134,10,-118,-244];
		var menuItemArr = [];
		for (var i = 0; i < 4; i++) {
			var menuitem = Helper.createScaleMenuItem("#shop_btn0.png",null,this.menucallback,this);
			menuitem.setPosition(136,menuPosY[i]);
			menuitem.tag = i + 10;
			menuItemArr.push(menuitem)
		}
		this.btnMenu = new cc.Menu(menuItemArr);
		this.btnMenu.setPosition(cc.visibleRect.center);
		this.addChild(this.btnMenu,1);
	},
	menucallback: function (sender) {
		var numTag = sender.tag;
		cc.log("ShoppingLayer numTag %d",numTag);
	},
});
//首充 
var RechargeLayer = TouchCloseLayer.extend({
	btnMenu:null,
	ctor : function () {
		var thisRect = cc.rect(cc.visibleRect.center.x-370*0.5,
				cc.visibleRect.center.y-510*0.5,370,500);
		this._super(thisRect);
		this.initLayer();
		return true;
	},
	initLayer : function () {
		var shopBg = new cc.Sprite("#recharge_bg.png");
		shopBg.setPosition(cc.visibleRect.center);
		this.addChild(shopBg,0);
		var menuitem = Helper.createScaleMenuItem("#recharge_btn.png","#recharge_bchar.png",this.menucallback,this);
		menuitem.setPosition(0,-180);
		this.btnMenu = new cc.Menu(menuitem);
		this.btnMenu.setPosition(cc.visibleRect.center);
		this.addChild(this.btnMenu,1);
	},
	menucallback: function (sender) {
		//var numTag = sender.tag;
		//cc.log("ShoppingLayer numTag %d",numTag);
	},
});
//推荐
var TuiJianLayer = TouchCloseLayer.extend({
	btnMenu:null,
	ctor : function () {
		var thisRect = cc.rect(cc.visibleRect.center.x-400*0.5,
				cc.visibleRect.center.y-540*0.5,400,540);
		this._super(thisRect);
		this.initLayer();
		return true;
	},
	initLayer : function () {
		var shopBg = new cc.Sprite("#recharge_bg.png");
		shopBg.setPosition(0,0);
		this.addChild(shopBg,0);
		var menuitem = Helper.createScaleMenuItem("#recharge_btn.png","#recharge_bchar.png",this.menucallback,this);
		menuitem.setPosition(0,-200);
		this.btnMenu = new cc.Menu(menuitem);
		this.btnMenu.setPosition(0,0);
		this.addChild(this.btnMenu,1);
	},
	menucallback: function (sender) {
		//var numTag = sender.tag;
		//cc.log("ShoppingLayer numTag %d",numTag);

		//PlayerData.taskArr[i]=element.Id;
		//PlayerData.taskProArr[i]=element.Progress;
	},
});
//背包层
var PackLayer = cc.Layer.extend({
	ctor : function () {
		this._super();
		//Recommend
		return true;
	},
	onEnter : function () {
		this._super();
	},
	onExit: function() {
		this._super();
	}
});
//头像背景
var HandShowLayer = TouchCloseLayer.extend({
	headSprite:null,
	tmpfunc:null,
	selectPotHide:null,
	selectPotShow:null,
	isSelectLeft:false,
	ctor : function(func,objc){
		var thisRect = cc.rect(cc.visibleRect.center.x-400*0.5,
				cc.visibleRect.center.y-240*0.5,400,240);
		this._super(thisRect);
		this.initLayer(func,objc);
		return true;
	},
	initLayer:function(func,objc){
		this.tmpfunc = func;
		//背景
		var capInsets = cc.rect(16,12,28,12); // lightSpbox warning
		var tmpframe = new cc.SpriteFrame(res.lightSpbox,cc.rect(0,0,60,36));
		var bgSprite = new cc.Scale9Sprite(tmpframe);
		bgSprite.setCapInsets(capInsets);
		bgSprite.width = 400;
		bgSprite.height = 240;
		bgSprite.setPosition(cc.visibleRect.center);
		this.addChild(bgSprite,1);
		
		//头像框
		var headBox = new cc.Sprite("#uiroom_box.png");
		headBox.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,50)));
		this.addChild(headBox,3);
		
		//头像
		this.showHandPng(PlayerData.sex);
		
		//元宝背景
		var yuanSprite = new cc.Sprite("#ui_bao.png");
		yuanSprite.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-144,-28)));
		yuanSprite.scale = 0.6;
		this.addChild(yuanSprite,4);
		//元宝
		this.yuanNumber = new NumberLabel(2,PlayerData.money);
		this.yuanNumber.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-104,-28)));
		this.addChild(this.yuanNumber,4);
		
//		//显示文字 名字:  性别:  名字:  性别:  账号:
//		this.targetLabel= new cc.LabelBMFont(sName,res.wenzi2,350,cc.TEXT_ALIGNMENT_CENTER);
//		this.targetLabel.setAnchorPoint(0.5,1);
//		this.targetLabel.setPosition(0,80);
//		this.addChild(this.targetLabel,2);
		
		//账户名:
		var zhanghuLabel = new cc.LabelTTF("账户名 :"+PlayerData.myAccount,s_font,20,cc.size(220,30),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		zhanghuLabel.color = cc.color(139,72,39);
		zhanghuLabel.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,-80)));
		this.addChild(zhanghuLabel,5);
		//积分:
		var jifenLabel = new cc.LabelTTF("积分 :"+PlayerData.score,s_font,20,cc.size(220,30),cc.TEXT_ALIGNMENT_LEFT,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		jifenLabel.color = cc.color(139,72,39);
		jifenLabel.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-60,-80)));
		this.addChild(jifenLabel,5);
		
		//名字
		var editboxString = PlayerData.name;
		var tmpframe = new cc.SpriteFrame(res.startEditbox,cc.rect(0,0,20,20));
		var editbox = new cc.EditBox(cc.size(200,50),
				new cc.Scale9Sprite(tmpframe),
				new cc.Scale9Sprite(tmpframe));
		editbox.setString(editboxString);
		editbox.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(42,70)));
		editbox.setFontColor(cc.color(250, 250, 0));
		editbox.setMaxLength(8);
		editbox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
		editbox.setDelegate(this);
		this.addChild(editbox,1);
		
		//ggmm
		var ggLabel = new cc.LabelTTF("GG:",s_font,20);
		ggLabel.color = cc.color(139,72,39);
		ggLabel.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-30,16)));
		this.addChild(ggLabel,5);
		var mmLabel = new cc.LabelTTF("MM:",s_font,20);
		mmLabel.color = cc.color(139,72,39);
		mmLabel.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(80,16)));
		this.addChild(mmLabel,5);
		
		this.selectPotShow = new cc.Sprite("#selectPot1.png");
		this.selectPotShow.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(10,16)));
		this.addChild(this.selectPotShow,4);
		
		this.selectPotHide = new cc.Sprite("#selectPot2.png");
		this.selectPotHide.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,16)));
		this.addChild(this.selectPotHide,4);
			
		//男
		if (PlayerData.sex==1) {
			this.isSelectLeft=true;
		}else{
			this.isSelectLeft=false;
		}
		
		//笔
		var tmItemSprite1 = Helper.createScaleMenuItem("#selectPane.png",null,func,objc);
		tmItemSprite1.tag = 101;
		tmItemSprite1.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(158,70)));
		
		var tmItemSprite2 = new cc.MenuItemSprite(
				new cc.Sprite("#selectPot1.png"),
				new cc.Sprite("#selectPot1.png"),
				this.makeSexChange,this);
		tmItemSprite2.tag = 102;
		tmItemSprite2.setOpacity(0);
		tmItemSprite2.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(10,16)));
		
		var tmItemSprite3 = new cc.MenuItemSprite(
				new cc.Sprite("#selectPot1.png"),
				new cc.Sprite("#selectPot1.png"),
				this.makeSexChange,this);
		tmItemSprite3.tag = 103;
		tmItemSprite3.setOpacity(0);
		tmItemSprite3.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,16)));

		var penMenu = new cc.Menu(tmItemSprite1,tmItemSprite2,tmItemSprite3);
		penMenu.setPosition(cc.p(0,0));
		this.addChild(penMenu,2);
		
		this.changeSelectNode();
		
		//-144,-28
//		var shopBg = new cc.Sprite("#recharge_bg.png");
//		shopBg.setPosition(cc.visibleRect.center);
//		this.addChild(shopBg,0);
//		var menuitem = Helper.createScaleMenuItem("#recharge_btn.png","#recharge_bchar.png",func,objc);
//		menuitem.setPosition(0,-180);
//		this.btnMenu = new cc.Menu(menuitem);
//		this.btnMenu.setPosition(cc.visibleRect.center);
//		this.addChild(this.btnMenu,1);
	},
	editBoxEditingDidBegin: function (editBox){},
	editBoxEditingDidEnd: function (editBox){},
	editBoxTextChanged: function (editBox,text){},
	editBoxReturn: function (editBox) {
		var tmpAccountStr = editBox.getString();
		if (tmpAccountStr) {
			PlayerData.sendTmpName = tmpAccountStr;
		}
	},
	changeSelectNode:function(){
		if(this.isSelectLeft==true) {
			this.selectPotShow.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(10,16)));
			this.selectPotHide.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,16)));
		}else{
			this.selectPotHide.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(10,16)));
			this.selectPotShow.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,16)));
		}
	},
	makeSexChange:function(sender){
		var NumTag = sender.tag;
		if (NumTag==102) {
			if (this.isSelectLeft==false) {
				this.isSelectLeft=true;
				this.changeSelectNode();
				this.showHandPng(1);
			}
		}else if (NumTag==103) {
			if (this.isSelectLeft==true) {
				this.isSelectLeft=false;
				this.changeSelectNode();
				this.showHandPng(2);
			}
		}
		var newNode = new cc.Node();
		newNode.tag = NumTag;
		this.tmpfunc(newNode);
	},
	showHandPng:function(tmpsex){
		var spriteName= "#uiroom_head2.png";
		if (tmpsex==1) {
			spriteName= "#uiroom_head1.png";
		}
		if(this.headSprite){
			this.headSprite.removeFromParent(true);
		}
		this.headSprite = new cc.Sprite(spriteName);
		this.addChild(this.headSprite,4);
		this.headSprite.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,50)));
	}
});
