var CardType = {
		Error:0,//错误
		Dan:1,//单
		Shuang:2,//双
		San:3,//三张
		SanDaiOne:4,//三带1
		DanShun:5,//单顺
		ShuangShun:6,//双顺
		SanShun:7,//三顺
		FeiJi:8,//飞机带11
		SiDai:9,//四带二
		SanDaiTwo:10,//三带2
		FeiJiDaiTwo:11,//飞机带二二
		Bomb:12,//炸弹
		HuoJian:13//火箭
};
//首先判断牌型，然后判断张数是否相同，再判断大小，炸弹和火箭可以破坏这个规则
var Logic = {};
//判断单张牌的大小
Logic.getCardValue = function (num) {
	var mainkey = "c"+num.toString();
	var mainValue = numberBigDic[mainkey];
	return mainValue;
};
//判断单张牌的花色
Logic.getHuaSeValue = function (num) {
	if(num==54){
		return 6;
	}else if(num==53){
		return 5;
	}else{
		var reNum = num%4;
		if (reNum==0) {
			return 4;
		}else{
			return reNum;
		}
	}
};
//获取一张随机牌
Logic.getRadomCard = function (cards) {
	if (cards.length==0) return -1;
	var key = Math.round(Math.random()*(cards.length-1));
	return cards.splice(key,1);
};
//得到当前的牌型//比较重要的牌型 返回牌型
Logic.getNowCardType = function (cards) {
	var resultValue = CardType.Error;
	if (cards.length==0) {
		resultValue = CardType.Error;
	}else if (cards.length==1) {
		resultValue = CardType.Dan;
	}else if (cards.length==2) {
		//两张点数相同才能出
		var value1 = Logic.getCardValue(cards[0]);
		var value2 = Logic.getCardValue(cards[1]);
		if (value1==value2) {//点数相同
			resultValue = CardType.Shuang;
		}else{
			if ((value1==16)&&(value2==17)){
				resultValue = CardType.HuoJian;
			}else if ((value1==17)&&(value2==16)){
				resultValue = CardType.HuoJian;
			}
		}
	}else if (cards.length==3) {
		//三张点数相同才能出
		var value1 = Logic.getCardValue(cards[0]);
		var value2 = Logic.getCardValue(cards[1]);
		var value3 = Logic.getCardValue(cards[2]);
		if ((value1==value2)&&(value1==value3)) {
			resultValue = CardType.San;
		}
	}else if (cards.length==4) {
		//出了4张牌 好好判断下
		var card0 = Logic.getCardValue(cards[0]);
		var card1 = Logic.getCardValue(cards[1]);
		var card2 = Logic.getCardValue(cards[2]);
		var card3 = Logic.getCardValue(cards[3]);
		if ((card0==card1)&&(card0==card2)&&(card0==card3)) {
			resultValue = CardType.Bomb;//4张牌相同 是炸弹
		}else { //3带一
			if ((card0==card1)&&(card0==card2)){
				resultValue = CardType.SanDaiOne;
			}else if ((card0==card1)&&(card0==card3)) {
				resultValue = CardType.SanDaiOne;
			}else if ((card0==card2)&&(card0==card3)) {
				resultValue = CardType.SanDaiOne;
			}else if ((card1==card2)&&(card1==card3)) {
				resultValue = CardType.SanDaiOne;
			}
		}
	}else if (cards.length==5) {//5张牌 //单顺//3带2
		if (Logic.isNorWang(cards)) {
			var numberArr = Logic.getCardsRow(cards);//分解
			if (numberArr.length==5) {//5张不同的牌
				if (Logic.isNorCardTwo(cards)) { //排除2和王
					if (Math.abs(numberArr[0][0] - numberArr[4][0])==4) {
						//首尾相加为4则为顺子
						resultValue = CardType.DanShun;
					}
				}
			}else if (numberArr.length==2){//3带2
				if ((numberArr[0].length==3)&&(numberArr[1].length==2)) {
					resultValue = CardType.SanDaiTwo;
				}else if ((numberArr[0].length==2)&&(numberArr[1].length==3)) {
					resultValue = CardType.SanDaiTwo;
				}
			}
		}
	}else{ //6张和以上
		if (Logic.isNorWang(cards)) {//排除王
			var numberArr = Logic.getCardsRow(cards);
			if (cards.length==numberArr.length) {//顺子
				if (Logic.isNorCardTwo(cards)) { //排除2
					if (Math.abs(numberArr[0][0] - numberArr[numberArr.length-1][0])==(numberArr.length-1)) {
						//首尾相减为长度减1
						return CardType.DanShun;//单顺
					}
				}
			}
			var isBomb = false;
			//排除中间有4张的炸弹的情况
			for (var i = 0; i < numberArr.length; i++) {
				if (numberArr[i].length==4){
					isBomb = true;
				}
			}
			//有炸弹
			if (isBomb) {
				//四带二 4444+1+5
				//四带二二 4444+33+55
				if (cards.length==6) {
					if (numberArr.length==3) {
						return CardType.SiDai;
					}
				}else if (cards.length==8) {
					if (numberArr.length==3) {
						var isSiDaiEr = true;
						for (var i = 0; i < numberArr.length; i++) {
							if (numberArr[i].length==1){
								isSiDaiEr = false;
							}
						}
						if (isSiDaiEr) {
							return CardType.SiDai;
						}else{
							return CardType.Error;
						}
					}
				}
			}else{
				if (Logic.isNorCardTwo(cards)) { //排除2
					//没有4张相连的情况
					if (numberArr.length==2) {//三顺的特殊判断
						if (Math.abs(numberArr[0][0] - numberArr[1][0])==1) {
							resultValue = CardType.SanShun;//三顺 必为333444之类情况
						}
					}else{
						//双顺//每个都是2张 并且相连334455
						var twoCount = 0;//双顺个数
						var istwoLianXu = true;//双顺是否连续
						var twoLastValue = 0;//上一个双顺的数
						var threeCount = 0;//三顺个数
						var threeLastValue = 0;//上一个三顺的数
						var isthreeLianXu = true;//三顺是否连续
						//这些顺都没有2
						for (var i = 0; i < numberArr.length; i++) {	
							if (numberArr[i].length==2){
								twoCount = twoCount+1;
								if (twoCount>1){
									if (Math.abs(twoLastValue-numberArr[i][0])!=1) {
										istwoLianXu = false;
									}else{
										twoLastValue = numberArr[i][0];
									}
								}else{
									twoLastValue = numberArr[i][0];
								}
							}else if (numberArr[i].length==3) {
								threeCount = threeCount+1;
								if (threeCount>1){//第2个以后三顺的数
									if (Math.abs(threeLastValue-numberArr[i][0])!=1) {
										isthreeLianXu = false;
									}else{
										threeLastValue = numberArr[i][0];
									}
								}else{
									//第一个三顺的数
									threeLastValue = numberArr[i][0];
								}
							}
						}
						//出的牌必为双数 3344555
						if (cards.length%2==0){
							//双顺
							if (twoCount == numberArr.length) {
								if (istwoLianXu) {//连续
									return CardType.ShuangShun;
								}else{//335566 这样的
									return CardType.Error;
								}
							}
							//三顺 333444
							if (threeCount == numberArr.length) {
								if (isthreeLianXu) {//连续
									return CardType.SanShun;
								}else{
									return CardType.Error;
								}
							}
							///判断是不是飞机 最难判断的类型 飞机的翅膀不能带王和2
							//小翅膀 大翅膀 33345556 判断起来貌似是连续的
							if (threeCount == numberArr.length * 0.5) {
								if (isthreeLianXu) {//3顺连续
									if (twoCount==0) {//单张牌的情况
										return CardType.FeiJi;
									}else{//双张牌情况
										if (twoCount == numberArr.length * 0.5) {
											return CardType.FeiJiDaiTwo;
										}else{
											return CardType.Error;
										}
									}
								}else{
									return CardType.Error;
								}
							}
						}
					}
				}
			}
		}
	}
	return resultValue;
};
//根据牌型调整下牌的位置,最大的放前面
Logic.AdjustCards = function (cards,type) {
	if (type == CardType.SanDaiOne) {//三带1 4443 或 5444->转成4445
		//3张牌的移到前面 ;
		if (Logic.getCardValue(cards[0])>Logic.getCardValue(cards[1])) {
			var resultArr = [];
			for (var i = 0; i < cards.length; i++) {
				var newValue;
				if (i==cards.length-1) {
					newValue = cards[0];
				}else{
					newValue = cards[i+1];
				}
				resultArr.push(newValue);
			}
			return resultArr;
		}else{
			return cards;
		}
	}else if (type == CardType.SanDaiTwo) {//3带2 44433 或 55444->转成44455
		//3张牌的移到前面
		if (Logic.getCardValue(cards[0])>Logic.getCardValue(cards[2])) {
			var resultArr = [];
			for (var i = 0; i < cards.length; i++) {
				var newValue;
				if (i==cards.length-1) {
					newValue = cards[1];
				}else if (i==cards.length-2) {
					newValue = cards[0];
				}else{
					newValue = cards[i+2];
				}
				resultArr.push(newValue);
			}
			return resultArr;
		}else{
			return cards;
		}
	}else if (type == CardType.SiDai) {//4带2 6+5555+3 -> 5555+6+3
		var startPot = 0;//找出4张牌的位置
		var numberArr = Logic.getCardsRow(cards);
		for (var i = 0; i < numberArr.length; i++) {
			if (numberArr[i].length==4) {
				startPot = i;
			}
		}
		if (cards.length==8) { //77 66 5555 或 66 5555 44
			if (startPot==0) {
				startPot=0;
			}else if (startPot==1) {
				startPot=2;
			}else{//2
				startPot=4;
			}
		}
		//创建一个新数组
		var resultArr = [];
		for (var i = 0; i < 4; i++) {
			var newValue = cards[startPot+i];
			resultArr.push(newValue);
		}
		//卡牌
		for (var i = 0; i < cards.length; i++) {
			if ((i==startPot)||(i==startPot+1)||(i==startPot+2)||(i==startPot+3)) {
				//do nothing
			}else{
				var newValue = cards[i];
				resultArr.push(newValue);
			}
		}
		return resultArr;
	}else if (type == CardType.FeiJi||type == CardType.FeiJiDaiTwo) {//飞机 7766555444-> 5554447766
		//还有一种情况 333444555+7799JJ  三对的飞机
		var numberArr = Logic.getCardsRow(cards);
		//标记数组
		var biaojiArr = [];
		for (var i = 0; i < cards.length; i++) {
			biaojiArr[i] = 0;
		}
		var nowPot = 0;//当前遍历的位置
		for (var i = 0; i < numberArr.length; i++) {
			if (numberArr[i].length==3) {
				biaojiArr[nowPot] = 1;
				biaojiArr[nowPot+1] = 1;
				biaojiArr[nowPot+2] = 1;
				nowPot = nowPot + 3;
			}else{//2
				nowPot = nowPot + 2;
			}
		}
		//创建一个新数组
		var resultArr = [];
		var leftArr = [];//剩余的数组
		for (var i = 0; i < cards.length; i++) {
			var newValue = cards[i];
			if (biaojiArr[i]==1) {
				resultArr.push(newValue);
			}else{
				leftArr.push(newValue);
			}
		}
		//新卡组
		for (var i = 0; i < leftArr.length; i++) {
			var newValue = leftArr[i];
			resultArr.push(newValue);
		}
		return resultArr;
	}else{
		return cards;
	}
};
//将卡牌解析成一个2维数组,相同的元素存放在一行中，解析成点数形式存放
//例["D6","D5","D3","C3","H3","S3"] =>[[6],[5],[3,3,3,3]]
Logic.getCardsRow = function (cards) { //
	var resultArr = [];
	var firstValue = Logic.getCardValue(cards[0]);
	var firstArr = [];//第一个小数组
	firstArr.push(firstValue);
	for (var i = 1; i < cards.length; i++) {
		var thisValue = Logic.getCardValue(cards[i]);
		if (thisValue == firstValue) {
			firstArr.push(thisValue);//相同的就加进去
		}else{
			//不同点数
			resultArr.push(firstArr);//前一个放入数组中
			//建立新数组
			firstValue = thisValue;
			firstArr = [];
			firstArr.push(firstValue);
		}
	}
	resultArr.push(firstArr);//最后一个放入数组中
	//打印出来
//	for (var i = 0; i < resultArr.length; i++) {
//	var thisArr = resultArr[i];
//	cc.log("==arr %d==%d",i,thisArr.length);
//	for (var j = 0; j < thisArr.length; j++) {
//	cc.log("%d",thisArr[j]);
//	}
//	}
	return resultArr;
};
//不包含王
Logic.isNorWang= function (cards) {
	var isWang = true;
	for (var i = 0; i < cards.length; i++) {
		var mainValue = Logic.getCardValue(cards[i]);
		if (mainValue==16||mainValue==17) {//排除大小王和2
			isWang = false;
		}
	}
	return isWang;
};
Logic.isNorCardTwo= function (cards) { //不包含2
	var isWang = true;
	for (var i = 0; i < cards.length; i++) {
		var mainValue = Logic.getCardValue(cards[i]);
		if (mainValue==15) {//排除2的情况
			isWang = false;
		}
	}
	return isWang;
};
//一开局的发牌，留下3张底牌
//cards = 传入一开始的牌,num = 3,isSort是否排序
//返回4个数组,1-3是17张牌，4是最后的3张
Logic.getStartCard = function (cards,isSort) {
	var resultArr = [];
	var tempArr = [];
	//首先复制一份
	for (var i = 0; i < cards.length; i++) {
		tempArr.push(cards[i]);
	}
	//每17份一张 取一次
	for (var i = 0; i < 3; i++) {
		var newArr = [];
		for (var j = 0; j < 17; j++) {
			var randomKey = Math.floor(Math.random()*tempArr.length);
			var newValue = tempArr[randomKey];
			newArr.push(newValue);//插入新值
			tempArr.splice(randomKey,1);//删除旧值
		}
		if (isSort) {
			newArr = Logic.sortCards(newArr);
		}
		resultArr.push(newArr);
	}
	//剩下的那份就是剩下的3张
	if (isSort) {
		tempArr = Logic.sortCards(tempArr);
	}
	resultArr.push(tempArr);
	//Logic.printCards(resultArr);
	return resultArr;
};
//给牌排序 从大到小排序
Logic.sortCards = function (cards) {
	var newArr = [];
	for (var i = 0; i < cards.length; i++) {
		newArr.push(cards[i]);
	}
	newArr.sort(function(a,b){return b-a});
	//Logic.printCards(newArr);
	return newArr;
};
//比较我出的牌和当前场上的牌 能不能出
Logic.comparisonCard=function(myCards,myCardType,otherCards,otherCardType){
	if (otherCards==null) {
		return true;
	}
	if (otherCards.length==0) {
		return true;
	}
	if (myCardType==CardType.HuoJian) {
		return true;//我是火箭必定能出
	}
	if (otherCardType==CardType.HuoJian) {
		return false;//敌人火箭必定不能出
	}
	if (otherCardType==CardType.Bomb) {//敌人炸弹 比大小
		if (myCardType==CardType.Bomb) {
			if (myCards[0]>otherCards[0]) {
				return true;
			}
		}
		return false;
	}
	if (myCardType==CardType.Bomb) {//我是炸弹
		return true;//这时必定能出
	}
	if (myCardType == otherCardType) {
		if (myCards.length == otherCards.length) {
			if(Logic.getCardValue(myCards[0])>Logic.getCardValue(otherCards[0])){
				//数值大小
				return true;
			}
		}
	}
	return false;
};
//根据牌的选中的牌,返回新数组
Logic.selectNewsCards = function (oldcards,selectcards) {
	var resultArr = [];
	for (var i = 0; i < oldcards.length; i++) {
		var element = oldcards[i];
		var isAdd = true;
		for (var j = 0; j < selectcards.length; j++) {
			var selectCard = selectcards[j];
			if (element == selectCard) {
				isAdd = false;
			}
		}
		if (isAdd==true) {
			var newelement = element + "";
			resultArr.push(newelement);
		}
	}
	return resultArr;
};
//打印牌
Logic.printCards = function (cards) {
	if (cards!=null) {
		var resultStr = null;
		for (var i = 0; i < cards.length; i++) {
			var element = cards[i];
			if (typeof(element)=="number") {
				if (i == 0) {
					resultStr = numberDic["c"+element.toString()]
				}else{
					resultStr = resultStr+","+numberDic["c"+element.toString()];
				}
			}else{
				cc.log("%d object",i);
				Logic.printCards(element);
			}
		}
		cc.log("%s",resultStr); 
	}
};
//ai出牌,返回一个出牌数组
//通常和Logic.selectNewsCards搭配使用
Logic.aiPlayCards = function (cards) {
	//出最小的一张牌，如果是一对或者相同点数的牌，则一起出
	var resultArr = [];
	var lastValue = cards[cards.length-1]+"";
	var keyValue = bigDic[lastValue];
	resultArr.push(lastValue);
	for (var i = cards.length-2; i>-1  ; i--) {
		var valueDian = cards[i];
		var tempValue = bigDic[valueDian];
		if (tempValue == keyValue) {
			var newValue = valueDian+"";
			resultArr.push(newValue);
		}
	}
	return resultArr;
};
//字符串数组转成数字数组
Logic.charConvertToNumArr = function (cards) {
	var resultArr = [];
	for (var i = 0; i< cards.length; i++) {
		var valueDian = cards[i];
		//cc.log("%s",valueDian);
		var tempValue = sortDic[valueDian];
		resultArr.push(tempValue);
	}
	return resultArr;
};
//复制一个卡组
Logic.copyToCards = function (cards){
	var result = [];
	for (var i = 0; i < cards.length; i++) {
		var value = cards[i];
		result.push(value);
	}
	return result;
};