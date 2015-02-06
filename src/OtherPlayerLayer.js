var OtherPlayerLayer = cc.Node.extend({
	playerSp:null,//玩家图片
	type:null,//1右边 2左边
	showCardsNode:null,//明牌时的牌
	showCardsBg:null,//明牌时的背景图
	paiSp:null,//其他玩家的牌展示
	nameLabel:null,//玩家的名字
	baoLabel:null,//元宝数量
	paiNumLabel:null,//其他玩家的牌展示
	manageNode:null,//展示托管	
	baoSp:null,
	manageNodeX:null,
	manageNodeY:null,
	nowSpId:0,//默认是男的农民
	ctor:function (type) {
		this._super();
		this.type = type;
		this.manageNodeX = 102;
		this.manageNodeY = 224;
		if (type==1) {//右边
			this.initRight();//初始化其他玩家层
		}else{ //左边
			this.initLeft();//初始化其他玩家层
		}
		return true;
	},
	initRight:function () {
		//玩家图片
		this.setChangeTexture(2);
		//展示牌数
		this.paiSp = new cc.Sprite("#show_card.png");
		this.paiSp.setPosition(106,160);
		this.addChild(this.paiSp,3);
		//牌数
		//this.paiNumLabel = new cc.LabelTTF("17",s_font,30);
		this.paiNumLabel = new cc.LabelBMFont("17",res.wenzi10);
		this.paiNumLabel.setPosition(106,160);
		//this.paiNumLabel.color = cc.color(239,236,18);
		this.addChild(this.paiNumLabel,4);
		//明牌
		this.showCardsNode = new cc.Node();
		this.showCardsNode.setPosition(0,0);
		this.addChild(this.showCardsNode,1);
		//明牌测试
		//this.addChild(this.showCardsNode,10);
		//名字信息
//		this.nameLabel = new cc.LabelTTF("测试",s_font,16);
//		this.nameLabel.setPosition(390-225,250);
//		this.nameLabel.color = cc.color(255,234,7);
//		this.addChild(this.nameLabel,4);
		//元宝信息
		this.baoLabel = new cc.LabelBMFont("10000",res.wenzi8,120,
				cc.TEXT_ALIGNMENT_RIGHT);
		this.baoLabel.setAnchorPoint(1,0.5);
		this.baoLabel.setPosition(210,120);
		//this.baoLabel.color = cc.color(255,234,7);
		this.addChild(this.baoLabel,4);
		//元宝 信息
		this.baoSp = new cc.Sprite("#show_bao.png");
		this.baoSp.setPosition(200,144); 
		this.addChild(this.baoSp,3);
	},
	initLeft:function () {
		//玩家图片
		this.setChangeTexture(2);
		//展示牌数
		this.paiSp = new cc.Sprite("#show_card.png");
		this.paiSp.setPosition(-106,160);
		//this.paiSp.scale = 0.5;
		this.addChild(this.paiSp,3);
		//牌数
		//this.paiNumLabel = new cc.LabelTTF("17",s_font,30);
		this.paiNumLabel = new cc.LabelBMFont("17",res.wenzi10);
		this.paiNumLabel.setPosition(-106,160);
		//this.paiNumLabel.color = cc.color(239,236,18);
		this.addChild(this.paiNumLabel,4);
		//明牌
		this.showCardsNode = new cc.Node();
		this.showCardsNode.setPosition(0,0);
		this.addChild(this.showCardsNode,1);
		//名字
//		this.nameLabel = new cc.LabelTTF("测试人物",s_font,16);
//		this.nameLabel.setPosition(60-225,250);
//		this.addChild(this.nameLabel,4);
		//元宝信息
		this.baoLabel = new cc.LabelBMFont("10000",res.wenzi8,120,
				cc.TEXT_ALIGNMENT_LEFT);
		this.baoLabel.setAnchorPoint(0,0.5);
		this.baoLabel.setPosition(-214,120);
		//this.baoLabel.color = cc.color(255,234,7);
		this.addChild(this.baoLabel,4);
		//元宝 信息
		this.baoSp = new cc.Sprite("#show_bao.png");
		this.baoSp.setPosition(-200,144);
		this.addChild(this.baoSp,3);
	},
	showCardNumber:function(cards){
		var num = cards.length;
		this.paiNumLabel.setString(num);
	},
	showBaoLabel:function(num){
		this.baoLabel.setString(num);
	},
	setDiZhuTexture:function(){//设置地主纹理
		if (this.nowSpId==2) {
			this.setChangeTexture(1);
		}else if (this.nowSpId==4){
			this.setChangeTexture(3);
		}
	},
	setChangeTexture:function(spId){//1,2,3,4
		if (this.nowSpId!=spId) {
			this.nowSpId=spId;	
			if (this.playerSp) {
				this.playerSp.removeFromParent(true);
				this.playerSp = null;
			}
			var thisStr = "#show_role"+spId+".png";
			this.playerSp = new cc.Sprite(thisStr);
			if (this.type==1) {//右边
				this.playerSp.setPosition(174,200);
			}else{//左边
				this.playerSp.scaleX = -1;
				this.playerSp.setPosition(-174,200);
			}
			this.addChild(this.playerSp,2);
		}
	},
	showManageNode:function () {
		if (!this.manageNode) {
			this.manageNode = new cc.Sprite("#show_rob1.png");
			this.addChild(this.manageNode,5);
			if (this.type==1) {//右边
				this.manageNode.setPosition(cc.p(this.manageNodeX,this.manageNodeY));
			}else{
				this.manageNode.setPosition(cc.p(-1*this.manageNodeX,this.manageNodeY));
			}
			var animation = Helper.createAnimation("show_rob",1,2,1);
			var thisAction = cc.animate(animation)
			this.manageNode.runAction(thisAction.repeatForever());
		}else{
			this.manageNode.setVisible(true);
		}
	},
	setPlayerSex:function(sex){//1,2 从地主开始匹配
		if (sex==1) {
			this.setChangeTexture(2);
		}else{
			this.setChangeTexture(4);
		}
	},
	hideManageNode:function () {
		if (this.manageNode) { this.manageNode.setVisible(false);}
	},
	restart:function () {//重新开始
		this.hideManageNode();
		this.paiNumLabel.setString("");
		this.showCardsNode.removeAllChildren(true);
		if (this.showCardsBg) {
			this.showCardsBg.removeFromParent(true);
			this.showCardsBg = null;
		}
	},
	showMingPai:function(cards){//展示明牌
		if (cards==null) {
			return;
		}
		//背景bg
		if (this.showCardsBg==null) {
			var tmpframe = new cc.SpriteFrame(res.startEditbox,cc.rect(0,0,20,20));
			this.showCardsBg = new cc.Scale9Sprite(tmpframe);
			this.showCardsBg.width = 190;
			this.showCardsBg.height = 110;
			if (this.type==1){//右边
				this.showCardsBg.setPosition(38,226);
			}else{
				this.showCardsBg.setPosition(-38,226);
			}
			this.addChild(this.showCardsBg,0);
		}
		this.showCardsNode.removeAllChildren(true);
	
		var normalDis = 16;
		//明牌测试 //默认是0 测试是60
		var offsetM = -10;
		if (this.type==1){//右边
			for (var i = 0; i < cards.length; i++) {
				var testSp = new CardSprite(cards[i]);
				testSp.scale = 0.5;
				if (i<10) {
					testSp.setPosition(-25+offsetM+i*normalDis+((cards.length>10)?0:(10-cards.length))*normalDis,250);
					this.showCardsNode.addChild(testSp,i+1);
				}else{
					testSp.setPosition(-25+offsetM+normalDis*9-(i%10)*normalDis,250-46);
					this.showCardsNode.addChild(testSp,22-i);
				}
			}
		}else{//左边
			for (var i = 0; i < cards.length; i++) {
				var testSp = new CardSprite(cards[i]);
				testSp.setPosition(-120-offsetM+(i%10)*normalDis,250-Math.floor(i/10)*46);
				testSp.scale = 0.5;
				this.showCardsNode.addChild(testSp,1);
			}
		}
	},
	showUnOnline:function(){
		if (this.manageNode) { 
			this.manageNode.removeFromParent(true);
			this.manageNode = null;
		}
		this.manageNode = new cc.Sprite("#show_duanline.png");
		this.addChild(this.manageNode,5);
		if (this.type==1) {
			this.manageNode.setPosition(cc.p(120,230));
		}else{
			this.manageNode.setPosition(cc.p(-120,230));
		}
	},
	setSpriteVisible:function(visib){
		this.playerSp.visible = visib;
	},
	setThisNodeVisible:function(visib){
		this.playerSp.visible = visib;
		this.paiSp.visible = visib;
		this.paiNumLabel.visible = visib;
		this.baoLabel.visible = visib;
		this.baoSp.visible = visib;
		if (visib==false) {
			if (this.manageNode) { 
				this.manageNode.removeFromParent(true);
				this.manageNode = null;
			}
			this.showCardsNode.removeAllChildren(true);
			if (this.showCardsBg) {
				this.showCardsBg.removeFromParent(true);
				this.showCardsBg = null;
			}
		}
	}
});