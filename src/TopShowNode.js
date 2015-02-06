//游戏页面顶部五个按钮
var TopGameShowNode = cc.Node.extend({
	startX:null,
	startY:null,
	node:null,
	isMoveUp:false,//是否移动到上方了
	isMoving:false,//是否移动中
	moveMenuItem:null,
	ctor: function (func,objc,stPos){
		this._super();
		this.initTopShowNode(func,objc,stPos);
		return true;
	},
	initTopShowNode: function (func,objc,stPos) {
		this.startX = stPos.x;
		this.startY = stPos.y;
		//node 
		this.node = new cc.Node();
		this.node.setPosition(0,0);
		this.addChild(this.node);
		
		var bgSprite = new cc.Sprite("#uitop_bg.png");
		bgSprite.setPosition(0,0);
		this.node.addChild(bgSprite,2);
		
		var btnSpId = [1,2,3,4,5];//按钮编号
		var arrItem = [];
		var everyDis = 70;
		for (var i = 0; i < 5; i++) {
			var itemStr = "#uitop_btn"+btnSpId[i]+".png";
			var itemSprite = Helper.createScaleMenuItem(itemStr,null,func,objc);
			itemSprite.tag = 50+i;//5个按钮 分别对应50,51-54
			itemSprite.setPosition(everyDis*i-(everyDis*4)*0.5,0);
			arrItem.push(itemSprite);
		}
		//鞭炮绳子
		var sheng_bg = new cc.Sprite("#uitop_sheng.png");
		sheng_bg.setPosition(170,-50);
		this.node.addChild(sheng_bg,1);

		var normal_sprite1 = new cc.Sprite("#uitop_up.png");
		var normal_sprite2 = new cc.Sprite("#uitop_up.png");
		var select_sprite1 = new cc.Sprite("#uitop_down.png");
		var select_sprite2 = new cc.Sprite("#uitop_down.png");
		var normal_ItemSprite = new cc.MenuItemSprite(normal_sprite1,normal_sprite2);
		var select_ItemSprite = new cc.MenuItemSprite(select_sprite1,select_sprite2);
		this.moveMenuItem = new cc.MenuItemToggle(
				normal_ItemSprite,
				select_ItemSprite,
				this.setMove,this);
		this.moveMenuItem.setSelectedIndex(0);
		this.moveMenuItem.setPosition(171,-74);
		arrItem.push(this.moveMenuItem);
		
		var btnMenu = new cc.Menu(arrItem);
		btnMenu.setPosition(0,0);
		this.node.addChild(btnMenu,5);
	},
	setOutOfScreen:function(isOut){
		if (isOut) {
			this.setPosition(cc.p(this.startX+2000,this.startY));
		}else{
			this.setPosition(cc.p(this.startX,this.startY));
		}
	},
	changeMoving:function(){
		this.isMoving = !this.isMoving;
		this.isMoveUp = !this.isMoveUp;
		if (this.isMoveUp) {
			this.moveMenuItem.setSelectedIndex(1);
		}else{
			this.moveMenuItem.setSelectedIndex(0);
		}
	},
	setMove:function(){
		if (this.isMoveUp) {
			this.moveMenuItem.setSelectedIndex(1);
		}else{
			this.moveMenuItem.setSelectedIndex(0);
		}
		if (!this.isMoving) {
			if (this.isMoveUp) {
				this.isMoving = true;
				this.node.runAction(cc.sequence(cc.moveTo(0.4,0,0),
						cc.callFunc(this.changeMoving,this)));
			}else{
				this.isMoving = true;
				this.node.runAction(cc.sequence(cc.moveTo(0.4,0,80),
						cc.callFunc(this.changeMoving,this)));
			}
		}
	},
});
//房间节点
var TopRoomNode = cc.Node.extend({
	moveMenuItem:null,
	ctor: function (func,objc) {
		this._super();
		this.initTopRoomNode(func,objc);
		return true;
	},
	initTopRoomNode: function (func,objc) {
		var bgSprite = new cc.Sprite("#uitop_bg.png");
		bgSprite.setPosition(0,0);
		this.addChild(bgSprite,2);

		var btnSpId = [2,3,6];
		var arrItem = [];
		var everyDis = 100;
		//把1改成5就可以开启5个按钮
		for (var i = 0; i < btnSpId.length; i++) {
			var itemStr = "#uitop_btn"+btnSpId[i]+".png";
			var itemSprite = Helper.createScaleMenuItem(itemStr,null,func,objc);
			itemSprite.tag = 50+btnSpId[i]-1;//5个按钮 分别对应50,51-54
			itemSprite.setPosition(everyDis*i-(everyDis*(btnSpId.length-1))*0.5,0);
			arrItem.push(itemSprite);
		}
		var btnMenu = new cc.Menu(arrItem);
		btnMenu.setPosition(0,0);
		this.addChild(btnMenu,5);
	},
});