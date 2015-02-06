var NumberLabel = cc.Node.extend({
	clockLabel:null,
	type:null,
	wanSprite:null,
	//type 1=倍数字母 2= 元宝字母
	//firstNumber = 初始化时的数字   
	//倍数字母 5位， 00001这样的倍数
	//元宝字母 1111,1111  达到千万时 末位变成万
	ctor : function (type,firstNumber) {
		this._super();
		this.type = type;
		if (type==1) {
			this.initBeiShuNumber(firstNumber);
		}else{
			this.initYuanBaoNumber(firstNumber);
		}
		return true;
	},
	setNumber: function (number) {
		if (number) {
			if (this.type==1) {
				this.setNumber_BeiShu(number);
			}else{
				this.setNumber_YuanBao(number);
			}
		}
	},
	//倍数
	setNumber_BeiShu: function (number) {
		cc.log("beishu %s",number);//倍数
		var numStr = number.toString();
		if (numStr.length<6) {//字符串补全0
			var buLength = 6 - numStr.length;//3 5-3=2
			for (var i = 0; i < buLength; i++) {
				numStr = "0"+numStr;
			}
			//得到一个5位数的倍数
			this.removeAllChildren(true);//删除掉所有字体
			for (var i = 0; i < numStr.length; i++) {
				//加载其中的一个字体
				var newString = "#num_bei_"+numStr[i]+".png";
				//cc.log("element "+newString);
				var newSprite = new cc.Sprite(newString);
				newSprite.setPosition(0+i*22,0);
				this.addChild(newSprite)
			}
		}
	},
	//元宝方式
	setNumber_YuanBao: function (number) {
		var numStr = number.toString();
		if (numStr.length<8) {
			//得到一个7位数的倍数
			this.removeAllChildren(true);//删除掉所有字体
			for (var i = 0; i < numStr.length; i++) {
				var newString = "#num_yuan_"+numStr[i]+".png";
				//cc.log("element "+newString);
				var newSprite = new cc.Sprite(newString);
				newSprite.setPosition(0+i*22,0);
				this.addChild(newSprite)
			}
		}else{
			//千万 省略万位后面的数
			var length = numStr.length;
			numStr = numStr.substring(0,length-4);
			//得到一个5位数的倍数
			this.removeAllChildren(true);//删除掉所有字体
			var count = 1;
			for (var i = 0; i < numStr.length; i++) {
				//加载其中的一个字体
				count = count + 1;
				var newString = "#num_yuan_"+numStr[i]+".png";
				var newSprite = new cc.Sprite(newString);
				newSprite.setPosition(0+i*22,0);
				this.addChild(newSprite)
			}
			//末尾加一个万字
			var endSprite = new cc.Sprite("#uibom_wan.png");
			endSprite.setPosition(count*22-14,0);
			this.addChild(endSprite)
		}
	},
	initBeiShuNumber : function (firstNumber) {
		this.setNumber_BeiShu(firstNumber);
	},
	initYuanBaoNumber : function (firstNumber) {
		this.setNumber_YuanBao(firstNumber);
	},
})