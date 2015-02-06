//聊天窗口
var CustomTableViewCell = cc.TableViewCell.extend({
	draw:function (ctx) {
		this._super(ctx);
	}
});
//两个层 一个是聊天 一个是表情
var TalkLayer = cc.Layer.extend({
	tableView:null,//聊天层
	emojiLayer:null,//表情层
	isclosdMenu:false,
	isNowTalkLayer:false,
	itemMenu1:null,
	itemMenu2:null,
	
	ctor : function () {
		this._super();
		this.initTalkLayer();
		return true;
	},
	initTalkLayer: function() {
		this.isNowTalkLayer = false;
		
		var capInsets = cc.rect(29,60,10,15);
		var bgSprite = new cc.Scale9Sprite("talk_bg01.png");
		bgSprite.setCapInsets(capInsets);
		bgSprite.width = 418;
		bgSprite.height = 262;
		bgSprite.setPosition(cc.visibleRect.center);
		this.addChild(bgSprite,0);
		//var bgSprite = new cc.Sprite("#talk_bg01.png");
		//bgSprite.setPosition(cc.visibleRect.center);
		//this.addChild(bgSprite,0);
		
		//表情层
		this.emojiLayer = new cc.Layer();
		this.emojiLayer.setPosition(cc.visibleRect.center);
		this.addChild(this.emojiLayer,2);
		//12个不同的按钮
		var btnItemArr = [];
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 4; j++) {
				var string = "#emoji"+(i*4+j+1)+".png";
				var ItemSprite = Helper.createScaleMenuItem(string,null,this.emojiCallback,this);
				ItemSprite.tag = i*4+j+1;
				ItemSprite.setPosition(100*j-150,40-62*i);
				btnItemArr.push(ItemSprite);
			}
		}
		var emojiMenu = new cc.Menu(btnItemArr);
		emojiMenu.setPosition(0,0);
		this.emojiLayer.addChild(emojiMenu,1);
		
		//这里初始化table
		this.tableView = new cc.TableView(this, cc.size(384, 184));
		this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
		//tableView.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-150,-300)));
		this.addChild(this.tableView,1);
		//this.tableView.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-384*0.5,-184*0.5)));
		this.tableView.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(1200,-184*0.5)));
		//tableView.setPosition(cc.p(-384*0.5,-106));
		this.tableView.setDelegate(this);
		this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		this.tableView.reloadData();
		
		var sprite1_on1 = new cc.Sprite("#talk_btn3.png");
		var sprite1_on2 = new cc.Sprite("#talk_btn3.png");
		var sprite1_off1 = new cc.Sprite("#talk_btn4.png");
		var sprite1_off2 = new cc.Sprite("#talk_btn4.png");
		var ItemSprite1_on = new cc.MenuItemSprite(sprite1_on1,sprite1_on2);
		var ItemSprite1_off = new cc.MenuItemSprite(sprite1_off1,sprite1_off2);
		this.itemMenu1 = new cc.MenuItemToggle(ItemSprite1_on,ItemSprite1_off,
				this.btnMenuCallback,this);
		this.itemMenu1.tag = 1;
		this.itemMenu1.setPosition(-86,94);
		this.itemMenu1.setSelectedIndex(1);
		
		var sprite2_on1 = new cc.Sprite("#talk_btn1.png");
		var sprite2_on2 = new cc.Sprite("#talk_btn1.png");
		var sprite2_off1 = new cc.Sprite("#talk_btn2.png");
		var sprite2_off2 = new cc.Sprite("#talk_btn2.png");
		var ItemSprite2_on = new cc.MenuItemSprite(sprite2_on1,sprite2_on2);
		var ItemSprite2_off = new cc.MenuItemSprite(sprite2_off1,sprite2_off2);
		this.itemMenu2 = new cc.MenuItemToggle(ItemSprite2_on,ItemSprite2_off,
				this.btnMenuCallback,this);
		this.itemMenu2.tag = 2;
		this.itemMenu2.setPosition(108,94);
		this.itemMenu2.setSelectedIndex(0);
		
		var btnMenu = new cc.Menu(this.itemMenu1,this.itemMenu2);
		btnMenu.setPosition(cc.visibleRect.center);
		this.addChild(btnMenu,1);
		
		//装饰层talk_sp1
		var zhuangshi_sp1 = new cc.Sprite("#talk_sp1.png");
		var zhuangshi_sp2 = new cc.Sprite("#talk_sp2.png");
		zhuangshi_sp1.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-105,110)));
		zhuangshi_sp2.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(160,110)));
		this.addChild(zhuangshi_sp1,4);
		this.addChild(zhuangshi_sp2,4);
	},
	btnMenuCallback: function (sender) {
		var numTag = sender.tag;
		if (numTag==1) {
			this.itemMenu1.setSelectedIndex(0);
			this.itemMenu2.setSelectedIndex(1);
			if (!this.isNowTalkLayer) {
				this.isNowTalkLayer = true;
				this.changePage();
			}
		}else{
			this.itemMenu1.setSelectedIndex(1);
			this.itemMenu2.setSelectedIndex(0);
			if (this.isNowTalkLayer) {
				this.isNowTalkLayer = false;
				this.changePage();
			}
		}
	},
	changePage:function() {
		if (this.isNowTalkLayer) {
			this.tableView.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-384*0.5,-230*0.5)));
			this.emojiLayer.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(1200,0)));
		}else{
			this.tableView.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(1200,-230*0.5)));
			this.emojiLayer.setPosition(cc.visibleRect.center);
		}
	},
	emojiCallback: function (sender) {
		var numTag = sender.tag;
		if (isNetWork) {
			if (PlayerData.roomId>0) {
				var sNumber = (GameData.myPlayerPot+1)*100 + numTag;
				var params = {};
				params.Chat = sNumber;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cat",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}
			this.closdThisMenu();
		}
	},
	onEnter : function () {
		this._super();
		var that = this;
		var tmppos = cc.pAdd(cc.visibleRect.center,cc.p(-450*0.5,-300*0.5))
		var thisRect = cc.rect(tmppos.x,tmppos.y,450,300);
		//全部事件都捕获//不让你点到下面的层
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				if (!cc.rectContainsPoint(thisRect,touchPoint)) {
					that.isclosdMenu = true;
				}
				return true;
			},
			onTouchEnded: function (touch,event) {
				cc.log("touch end");
				if (that.isclosdMenu) {
					that.closdThisMenu();
				}
			}
		}, this);
	},
	closdThisMenu: function() {
		this.removeFromParent(true);
	},
	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},
	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());
		if (isNetWork) {
			if (PlayerData.roomId>0) {
				var sNumber = (GameData.myPlayerPot+1)*100+cell.getIdx()+50;
				var params = {};
				params.Chat = sNumber;
				sfs.send(new SFS2X.Requests.System.ExtensionRequest("cat",params,
						sfs.roomManager.getRoomById(PlayerData.roomId)));
			}
			var testScene = cc.director.getRunningScene();
			if(testScene.gameLayer){
				var child = testScene.gameLayer.getChildByTag(POPLAYER_TAG.TalksLayer);
				if (child) {
					child.isclosdMenu = true;
				}
			}
		}
	},
	tableCellSizeForIndex:function (table, idx) {
		return cc.size(300,50);
	},
	tableCellAtIndex:function (table, idx) {
		var cell = table.dequeueCell();
		if (!cell) {
			cell = new CustomTableViewCell();
			var sprite = new cc.Sprite("#talk_line.png");
			sprite.anchorX = 0;
			sprite.anchorY = 0;
			sprite.x = 0;
			sprite.y = 0;
			sprite.scaleX = 2;
			sprite.scaleY = 2;
			cell.addChild(sprite);
			
			var strValue = TalkLayerString[idx];
			var label = new cc.LabelBMFont(strValue,res.wenzi6,260,cc.TEXT_ALIGNMENT_LEFT);
			label.color = cc.color(139,72,39);
			label.x = 8;
			label.y = 25;
			label.anchorX = 0;
			label.anchorY = 0.5;
			label.tag = 123;
			cell.addChild(label);
		} else {
			var strValue = TalkLayerString[idx];
			var label = cell.getChildByTag(123);
			label.setString(strValue);
		}
		return cell;
	},
	numberOfCellsInTableView:function (table) {
		return TalkLayerString.length;
	}
});
//两个层 一个是聊天 一个是表情
var TalkShowLayer = cc.Layer.extend({
	myNode:null,
	rightNode:null,
	lefttNode:null,
	rightNodePos:null,
	leftNodePos:null,
	ctor : function(leftPos,rightPos) {
		this._super();
		this.leftNodePos = cc.p(leftPos.x,leftPos.y);
		this.rightNodePos = cc.p(rightPos.x,rightPos.y);
		return true;
	},
	showTalk:function(posId,parm,tmptime) {
		var thisNode = null;
		if (posId==GameData.myPlayerPot) {//轮到我抢地主
			if (!this.myNode) {
				this.myNode = new cc.Node();
				this.addChild(this.myNode);
			}
			if (parm<50){//表情
				this.myNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,370)));
			}else{
				this.myNode.setPosition(cc.pAdd(cc.visibleRect.bottom,cc.p(0,370)));
			}
			thisNode = this.myNode;
		}else if (posId==GameData.rightPlayerPot) {//轮到右边的玩家
			if (!this.rightNode) {
				this.rightNode = new cc.Node();
				this.addChild(this.rightNode);
			}
			if (parm<50){//表情
				this.rightNode.setPosition(this.rightNodePos.x,this.rightNodePos.y);
			}else{
				this.rightNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(120,80)));
			}
			thisNode = this.rightNode;
		}else{//轮到左边玩家
			if (!this.lefttNode) {
				this.lefttNode = new cc.Node();
				this.addChild(this.lefttNode);
			}
			if (parm<50){//表情
				this.lefttNode.setPosition(this.leftNodePos.x,this.leftNodePos.y);
			}else{
				this.lefttNode.setPosition(cc.pAdd(cc.visibleRect.center,cc.p(-120,80)));
			}
			thisNode = this.lefttNode;
		}
		thisNode.removeAllChildren(true);
		
		var showtime = 7;//默认展示时间7s
		if (tmptime) { showtime = tmptime;}
		if (parm<50){//表情
			var string = "#emoji"+parm+".png";
			var ItemSprite = new cc.Sprite(string);
			if (ItemSprite) {
				ItemSprite.setPosition(0,0);
				thisNode.addChild(ItemSprite);
				if (posId==GameData.rightPlayerPot) {
					ItemSprite.setPosition(0,10);
				}else if (posId==GameData.leftPlayerPot){
					ItemSprite.setPosition(0,10);
				}
				var seqAction = cc.sequence(cc.delayTime(showtime),cc.callFunc(Helper.removeSelf,this));
				ItemSprite.runAction(seqAction)
			}
		}else{//对白
			var idx = parm-50;
			var strValue = TalkLayerString[idx];
			var label = new cc.LabelBMFont(strValue,res.wenzi6,260,cc.TEXT_ALIGNMENT_LEFT);
			label.setPosition(0,0);
			thisNode.addChild(label,2);
			var seqAction = cc.sequence(cc.delayTime(showtime),cc.callFunc(Helper.removeSelf,this));
			label.runAction(seqAction);
			
			//背景
			var frames = cc.spriteFrameCache.getSpriteFrame("emoji_pao.png");
			var bgSprite = new cc.Scale9Sprite(frames);
			bgSprite.width = 280;
			bgSprite.height = 44;
			bgSprite.setPosition(0,0);
			thisNode.addChild(bgSprite,1);
			bgSprite.runAction(seqAction.clone());
		
			//小气泡标点
			var qipao2 = new cc.Sprite("#emoji_pao2.png");
			qipao2.setPosition(0,0);
			thisNode.addChild(qipao2,0);
			qipao2.runAction(seqAction.clone());
			//qipao2.color = cc.color(255, 0, 0);
			
			if (posId==GameData.myPlayerPot) {
				label.setPosition(-70,0);
				bgSprite.setPosition(-70,0);
				qipao2.setPosition(-100,-26);
				qipao2.scaleX = -1;
			}else if (posId==GameData.rightPlayerPot) {
				label.setPosition(-50,60+40);
				bgSprite.setPosition(-50,60+40);
				qipao2.setPosition(50,126);
				qipao2.scaleY = -1;
			}else if (posId==GameData.leftPlayerPot){
				label.setPosition(50,40);
				bgSprite.setPosition(50,40);
				qipao2.setPosition(-50,66);
				qipao2.scaleX = -1;
				qipao2.scaleY = -1;
			}
		}
	},
});