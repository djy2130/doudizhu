//控制层  确定可以触控的地方
var ControlLayer = cc.Layer.extend({
	oneLieY:180,//215
	twoLieY:85,//120
	ctor : function () {
		this._super();
		return true;
	},
	onEnter : function () {
		this._super();
		var that = this;
		//每列
		var LieHeight = 90;//列高
		//var LittleWidth = 36;
		//var EndWidth = 72;//列宽

		//控制事件
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan:function (touch,event) {
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				//不是我点的回合
				//右边按钮
				//下面的牌，每张只有约一半可以触控，最后一张可以触控整张
				//第一行
				if (touchPoint.y>that.oneLieY-LieHeight*0.5 && touchPoint.y<that.oneLieY+LieHeight*0.5) {
					that.touchOneCard(1,touchPoint.x);
					return true;
				}
				else if (touchPoint.y>that.twoLieY-LieHeight*0.5 && touchPoint.y<that.twoLieY+LieHeight*0.5) {
					///第二行
					that.touchOneCard(2,touchPoint.x);
					return true;
				}
				return false;
			},
			onTouchMoved:function (touch,event){
				var target = event.getCurrentTarget();
				var touchPoint = touch.getLocation();
				//不是我点的回合
				//右边按钮
				//下面的牌，每张只有约一半可以触控，最后一张可以触控整张
				//第一行
				if (touchPoint.y>that.oneLieY-LieHeight*0.5 && touchPoint.y<that.oneLieY+LieHeight*0.5) {
					that.touchOneCard(1,touchPoint.x);
					return true;
				}
				else if (touchPoint.y>that.twoLieY-LieHeight*0.5 && touchPoint.y<that.twoLieY+LieHeight*0.5) {
					///第二行
					that.touchOneCard(2,touchPoint.x);
					return true;
				}
			},
			onTouchEnded:function (touch,event){
				that.setAllCardsLock(false);
			}
		});
		cc.eventManager.addListener(listener,this);
	},
	touchOneCard: function(line,posx) {
		if (GameData.isCanChuPai) {
			//牌的大小72*90
			if (line==1) {
				//按了第几个按钮
				var nowpos = Math.floor( posx/(42-36+36) );
				if (nowpos>9) {
					if (GameData.myCards.length>9) { nowpos=9;}
					else{return;}
				}else{
					//最后一小段的判断
					if (GameData.myCards.length-1 < nowpos) {
						if (posx<((GameData.myCards.length-1)*(42-36+36)+72)) {
							nowpos = nowpos -1;
						}else{
							return;
						}
					}
				}
				this.selectOneCard(nowpos);
				//testSp.setPosition(36+(i%10)*42,215-Math.floor(i/10)*95);
			}else{//line = 2
				if (GameData.myCards.length<11) { return;}
				if (posx>(450-72)) {
					nowpos=0;
				}else{
					var nowpos = Math.floor((450-72-posx)/(42-36+36))+1;
					if (nowpos>9) {
						if (GameData.myCards.length>19) { nowpos=9;}
						else{return;}
					}else{
						if (posx<(450-(GameData.myCards.length-11)*(42-36+36)-72)) {
							return;
						}
					}
				}
				nowpos = nowpos + 10;
				this.selectOneCard(nowpos);
			}
		}
	},
	//展示我当前的卡
	setAllCardsLock:function(lock){
		if (GameData.isCanChuPai) {
			var childArr = this.getChildren();
			for (var i = 0; i < childArr.length; i++) {
				childArr[i].setLock(lock);
			}
		}
	},
	//展示我当前的卡
	setMyCards:function (cards) {
		this.removeAllChildren(true);
		for (var i = 0; i < cards.length; i++) {
			var testSp = new CardSprite(cards[i]);
			testSp.tag = i;
			if (i<10) {
				//正向
				testSp.setPosition(36+i*42,this.oneLieY);
				this.addChild(testSp,i);
			}else{
				//反向
				testSp.setPosition(36+9*42-42*(i%10),this.twoLieY);
				this.addChild(testSp,20-i);
			}
		}
	},
	//一开始设置我的卡的时候的动画 0.4s
	setMyCardsAnimate:function (cards) {
		this.removeAllChildren(true);
		for (var i = 0; i < cards.length; i++) {
			var testSp = new CardSprite(cards[i]);
			testSp.tag = i;
			if (i<10) {
				//正向
				testSp.setPosition(225,this.oneLieY);//225是中间部分
				this.addChild(testSp,i);
				testSp.runAction(cc.sequence(cc.delayTime(0.4),cc.moveTo(0.5,36+i*42,this.oneLieY)));
			}else{
				//反向
				testSp.setPosition(225,this.twoLieY);
				this.addChild(testSp,20-i);
				testSp.runAction(cc.sequence(cc.delayTime(0.4),cc.moveTo(0.5,36+9*42-42*(i%10),this.twoLieY)));
			}
		}
	},
	setDiZhuStyle:function(){//设置地主的样式
		var childArr = this.getChildren();
		if (childArr.length>10) {
			//第2行的
			var twoCards = childArr[9];
			twoCards.addDiZhu();
			var lastCards = childArr[childArr.length-1];
			lastCards.addDiZhu();
		}else{ //第一行的
			var lastCards = childArr[childArr.length-1];
			lastCards.addDiZhu();
		}
	},
	//将所有的卡变回普通状态
	setAllCardsNormal:function () {
		var childArr = this.getChildren();
		for (var i = 0; i < childArr.length; i++) {
			var child = childArr[i];
			if (child.isSelect==true) {
				child.setNormalCard();
			}
		}
	},
	//选择一张牌
	selectOneCard:function (cardTag) {
		var child = this.getChildByTag(cardTag);
		if (child) {
			child.setChangeCard();
		}
	},
	//ai帮你选一张牌
	aiSelectCards:function (preCards,myCards) {
		//Logic.printCards(preCards);
		//Logic.printCards(myCards);
		//this.setAllCardsNormal();
		if (myCards.length>0) {
			//最重要函数 ai 选择出牌
			var resultCards = AI.findBestPokers(preCards,myCards);
			if (resultCards!=null) {//可以出牌
				//Logic.printCards(resultCards);
				var tmpArr = [];
				//这堆牌在原牌中的位置
				for (var i = 0; i < myCards.length; i++) {
					for (var j = 0; j < resultCards.length; j++) {
						if (myCards[i] == resultCards[j]) {
							tmpArr.push(i);
						}
					}
				}
				//能出这堆牌
				var childArr = this.getChildren();
				for (var i = 0; i < childArr.length; i++) {
					var child = childArr[i];
					var selectThisCard = false;
					for (var j = 0; j < tmpArr.length; j++) {
						if (child.tag == tmpArr[j]) {
							selectThisCard = true;
						}
					}
					if(selectThisCard){
						child.setSelectCard();
					}else{
						child.setNormalCard();
					}
				}
				tmpArr = null;
				return true;
			}else{
				cc.log("我选不出牌");
				return false;
			}
		}
		return false;
	},
});