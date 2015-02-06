//组合的方式合成的一张牌
var CardSprite = cc.Node.extend({
	isLock:false,//是否已经锁定
	isSelect:false,
	selectCard:null,
	startPosY:null,
	isDiZhu:null,
	ctor : function (cardNumber) {
		this._super();
		this.initCard(cardNumber);
		return true;
	},
	initCard : function (cardNumber) {
		var bgSprite = new cc.Sprite("#pai_bg.png");
		bgSprite.setPosition(0,0);
		this.addChild(bgSprite,0);
		
		var leftNumSp = null;//左顶得数字
		var leftHuaSp = null;//左边小的花色
		var bigSp = null;//中间大的东西
		if (cardNumber == 54) {//大王 
			leftHuaSp = new cc.Sprite("#wang_da.png");
			leftHuaSp.setPosition(-24,10);
			this.addChild(leftHuaSp,1);
			bigSp = new cc.Sprite("#card_dawang.png");
			bigSp.setPosition(5,-5);
			this.addChild(bigSp,1);
		}else if (cardNumber == 53){//小王
			leftHuaSp = new cc.Sprite("#wang_xiao.png");
			leftHuaSp.setPosition(-24,10);
			this.addChild(leftHuaSp,1);
			bigSp = new cc.Sprite("#card_xiaowang.png");
			bigSp.setPosition(5,-5);
			this.addChild(bigSp,1);
		}else{ //1-54
			var daxiao = Logic.getCardValue(cardNumber);//大小 1-17
			var huashe = Logic.getHuaSeValue(cardNumber);//花色
			//cc.log("card %d_%d",huashe,daxiao);
			var numberStr = null;
			if (huashe==1||huashe==3) {
				if (huashe==1){//红
					leftHuaSp = new cc.Sprite("#fk_xiao.png");
					bigSp = new cc.Sprite("#fk_da.png");
				}else{//红
					leftHuaSp = new cc.Sprite("#hx_xiao.png");
					bigSp = new cc.Sprite("#hx_da.png");
				}
				numberStr = this.getCharNumber(2,daxiao);
			}else{
				if (huashe==2){//黑
					leftHuaSp = new cc.Sprite("#hs_xiao.png");
					bigSp = new cc.Sprite("#hs_da.png");
				}else{//黑
					leftHuaSp = new cc.Sprite("#ht_xiao.png");
					bigSp = new cc.Sprite("#ht_da.png");
				}
				numberStr = this.getCharNumber(1,daxiao);
			}
			leftNumSp = new cc.Sprite(numberStr);
			leftNumSp.setPosition(-24,30);
			this.addChild(leftNumSp,1);
			leftHuaSp.setPosition(-24,12);
			this.addChild(leftHuaSp,1);
			bigSp.setPosition(5,-10);
			this.addChild(bigSp,1);
		}
	},
	//数字
	getCharNumber : function (color,num) {
		var resultStr = null;
		if (color==1) {
			if (num<11) {
				resultStr = "#b"+num+".png";
			}else if (num==11){
				resultStr = "#bj.png";
			}else if (num==12){
				resultStr = "#bq.png";
			}else if (num==13){
				resultStr = "#bk.png";
			}else if (num==14){
				resultStr = "#ba.png";
			}else if (num==15){
				resultStr = "#b2.png";
			}
		}else{
			if (num<11) {
				resultStr = "#r"+num+".png";
			}else if (num==11){
				resultStr = "#rj.png";
			}else if (num==12){
				resultStr = "#rq.png";
			}else if (num==13){
				resultStr = "#rk.png";
			}else if (num==14){
				resultStr = "#ra.png";
			}else if (num==15){
				resultStr = "#r2.png";
			}
		}
		return resultStr;
	},
	setLock:function (lock) {
		this.isLock = lock;
	},
	setChangeCard : function () {
		if (this.isLock==false) {
			this.isLock=true;
			if (!this.isSelect) {
				this.setSelectCard();
			}else{
				this.setNormalCard();
			}
		}
	},
	setSelectCard : function () {
		if (this.selectCard==null) {
			this.isSelect = true;
			this.selectCard = new cc.Sprite("#pai_selected.png");
			this.selectCard.setPosition(0,0);
			this.selectCard.scale = 2;
			this.addChild(this.selectCard,0);
			
			this.setPosition(this.getPositionX(),this.getPositionY()+10);
		}
	},
	setNormalCard : function () {
		if (this.selectCard) {
			this.isSelect = false;
			this.selectCard.removeFromParent(true);
			this.selectCard = null;
			
			this.setPosition(this.getPositionX(),this.getPositionY()-10);
		}
	},
	//增加地主的标签
	addDiZhu : function () {
		this.isDiZhu = new cc.Sprite("#dizhu.png");
		this.isDiZhu.setPosition(0,0);
		this.addChild(this.isDiZhu,0);
	}
});