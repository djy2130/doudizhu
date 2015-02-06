//包含一个登录界面的东西
var SettingLayer = cc.Layer.extend({
	itemMenuToggle:null,
	isclosdMenu:false,
	bgSprite:null,
	ctor : function () {
		this._super();
		//放一堆测试的卡牌上去
		//一开始的按钮
		//只有高于此层的touch有反应 其他没反应
		//3个sprite 3个menu
		return true;
	},
	initSettingLayer: function () {
		//背景
		this.bgSprite = new cc.Sprite("#setting_bg.png");
		this.bgSprite.setPosition(0,0);
		this.bgSprite.scale=1.24;
		this.addChild(this.bgSprite,0);
		
		var lineHeight = [70,0,-70];
		var spriteNameArr = ["#setting_laba.png","#setting_bao.png","#setting_man.png"];
		var charNameArr = ["#setting_mu.png","#setting_char.png","#setting_more.png"];
		for (var i = 0; i < 3; i++) {
			var spElement = spriteNameArr[i];
			var spSprite = new cc.Sprite(spElement);
			spSprite.setPosition(-120,lineHeight[i]);
			this.addChild(spSprite,2);
			
			var charElement = charNameArr[i];
			var tipsSprite = new cc.Sprite(charElement);
			tipsSprite.setPosition(0,lineHeight[i]);
			this.addChild(tipsSprite,2);
		}
		var sprite_on = new cc.Sprite("#setting_kai.png");
		var sprite_off = new cc.Sprite("#setting_guan.png");
		var sprite_on2 = new cc.Sprite("#setting_kai.png");
		var sprite_off2 = new cc.Sprite("#setting_guan.png");
		var ItemSprite_on = new cc.MenuItemSprite(sprite_on,sprite_on2);
		var ItemSprite_off = new cc.MenuItemSprite(sprite_off,sprite_off2);
		//第一个按钮
		this.itemMenuToggle = new cc.MenuItemToggle(ItemSprite_on,ItemSprite_off,this.menuCallback,this);
		this.itemMenuToggle.tag = 1;
		this.itemMenuToggle.setPosition(120,lineHeight[0]);
		//音乐按钮
		if (PlayerData.isMusic) {
			this.itemMenuToggle.setSelectedIndex(0);
		}else{
			this.itemMenuToggle.setSelectedIndex(1);
		}
		
		var itemMenu2 = this.createHideMenuItem("#setting_touch.png",this.menuCallback,this);
		itemMenu2.tag = 2;
		itemMenu2.scale = 2;
		itemMenu2.setPosition(0,lineHeight[1]);
		var biaoqian_2 = new cc.Sprite("#setting_jiantou.png");
		biaoqian_2.setPosition(120,lineHeight[1]);
		this.addChild(biaoqian_2,2);
		//
		var itemMenu3 = this.createHideMenuItem("#setting_touch.png",this.menuCallback,this);
		itemMenu3.tag = 3;
		itemMenu3.scale = 2;
		itemMenu3.setPosition(0,lineHeight[2]);
		var biaoqian_3 = new cc.Sprite("#setting_jiantou.png");
		biaoqian_3.setPosition(120,lineHeight[2]);
		this.addChild(biaoqian_3,2);
		
		var btnMenu = new cc.Menu(this.itemMenuToggle,itemMenu2,itemMenu3);
		btnMenu.setPosition(0,0);
		this.addChild(btnMenu,1);
	},
	onMenuCallback:function(){
		var index = this.itemMenuToggle.getSelectedIndex();
		if (index==0) {
			this.itemMenuToggle.setSelectedIndex(1);
		}else{
			this.itemMenuToggle.setSelectedIndex(0);
		}
	},
	createHideMenuItem:function (sName,func,objc){
		var normal_sprite = new cc.Sprite(sName);
		var select_sprite = new cc.Sprite(sName);
		normal_sprite.setOpacity(0);
		var tmItemSprite = new cc.MenuItemSprite(
				normal_sprite,
				select_sprite,
				func, objc);
		return tmItemSprite;
	},
	menuCallback : function (sender) {
		if (sender.tag==1) {
			GameManager.pauseMusic();//暂停音乐
		}else if (sender.tag==2) {

		}else if (sender.tag==3) {

		}
	},
	onEnter : function () {
		this._super();
		this.initSettingLayer();

		var thisRect = cc.rect(cc.visibleRect.center.x-190,
				cc.visibleRect.center.y-140,380,280);

		var that = this;
		//全部事件都捕获//不让你点到下面的层
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				//cc.log("touch this %d %d",touchPoint.x,touchPoint.y);
				if (!cc.rectContainsPoint(thisRect,touchPoint)) {
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
	onExit: function() {
		cc.eventManager.removeListeners(this);
		this._super();
	}
});