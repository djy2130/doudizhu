GroupType = function(name, numPokers) {
	this.name = name;
	this.numPokers = numPokers;
	GroupType[name] = this;
};
GroupType.prototype.toString = function() {
	return this.name
};
//所有牌型
new GroupType("danzhang", 1);//单张
new GroupType("duizi", 2);//对子
new GroupType("huojian", 2);//火箭
new GroupType("sanzhang", 3);//三张
new GroupType("zhadan", 4);//炸弹
new GroupType("sandaiyi", 4);//三带一
new GroupType("wuzhangshunzi", 5);//五张顺子
new GroupType("sandaier", 5);//三带二
new GroupType("liuzhangshunzi", 6);//六张顺子
new GroupType("sanliandui", 6);//三连对
new GroupType("sidaier", 6);//四带二
new GroupType("erlianfeiji", 6);//二连飞机
new GroupType("qizhangshunzi", 7);//七张顺子
new GroupType("bazhangshunzi", 8);//八张顺子
new GroupType("siliandui", 8);//四连对
new GroupType("feijidaichibang", 8);//飞机带翅膀
new GroupType("sidaierdui", 8);//四带二对
new GroupType("jiuzhangshunzi", 9);//九张顺子
new GroupType("sanlianfeiji", 9);//三连飞机
new GroupType("shizhangshunzi", 10);//十张顺子
new GroupType("wuliandui", 10);//五连对
new GroupType("feijidaierdui", 10);//飞机带二对
new GroupType("shiyizhangshunzi", 11);//十一张顺子
new GroupType("shierzhangshunzi", 12);//十二张顺子
new GroupType("liuliandui", 12);//六连对
new GroupType("silianfeiji", 12);//四连飞机
new GroupType("sanlianfeijidaichibang", 12);//三连飞机带翅膀
new GroupType("qiliandui", 14);//七连对
new GroupType("wulianfeiji", 15);//五连飞机
new GroupType("sanlianfeijidaisandui", 15);//三连飞机带三对
new GroupType("baliandui", 16);//八连对
new GroupType("silianfeijidaichibang", 16);//四连飞机带翅膀
new GroupType("jiuliandui", 18);//九连对
new GroupType("liulianfeiji", 18);//六连飞机
new GroupType("shiliandui", 20);//十连对
new GroupType("silianfeijidaisidui", 20);//四连飞机带四对
new GroupType("wulianfeijidaichibang", 20);//五连飞机带翅膀

AIRule = {};
//比较两手牌的大小
AIRule.compare = function(pa, pb) {
	var ta = AIRule.getType(pa);
	var tb = AIRule.getType(pb);
	if (!ta || !tb)
		return false;
	//牌型相同，则比较牌型的第一张牌即可（前提是已经排序）
	if (ta == tb)
		return pa[0].point > pb[0].point;
	//牌型不同，则只有双王和炸弹能跨牌型比较
	if (ta == GroupType.huojian)
		return true;
	else if (ta == GroupType.zhadan && tb != GroupType.huojian)
		return true;
	return false;
}

//获取指定牌的牌型
AIRule.getType = function(pokers) {
	//从大到小排序，便于牌型判断
	AI.sort1(pokers);

	var len = pokers.length;
	switch (len) {
	case 1:
		return GroupType.danzhang;

	case 2:
		if (AIRule.isSame(pokers, 2))
			return GroupType.duizi;
		else if (pokers[0].point == 17 && pokers[1].point == 16)
			return GroupType.huojian;
		return false;

	case 3:
		if (AIRule.isSame(pokers, 3))
			return GroupType.sanzhang;
		return false;

	case 4:
		if (AIRule.isSame(pokers, 4))
			return GroupType.zhadan;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.sandaiyi;
		return false;

	case 5:
		if (AIRule.isStraight(pokers))
			return GroupType.wuzhangshunzi;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.sandaier;
		return false;

	case 6:
		if (AIRule.isStraight(pokers))
			return GroupType.liuzhangshunzi;
		else if (AIRule.isPairLink(pokers))
			return GroupType.sanliandui;
		else if (AIRule.isSame(pokers, 4)) {
			//排序，比如：863333 -> 333386
			var start = -1, count = 0;
			for ( var i = 0; i < len - 1; i++) {
				if (pokers[i].point == pokers[i + 1].point) {
					count++;
					if (count >= 3)
						start = i - 2;
				} else
					count = 0;
			}
			if (start > 0) {
				var four = pokers.splice(start, 4);
				pokers.unshift.apply(pokers, four);
			}
			return GroupType.sidaier;
		} else if (AIRule.isTripleLink(pokers))
			return GroupType.erlianfeiji;
		return false;

	case 7:
		if (AIRule.isStraight(pokers))
			return GroupType.qizhangshunzi;
		return false;

	case 8:
		if (AIRule.isStraight(pokers))
			return GroupType.bazhangshunzi;
		else if (AIRule.isPairLink(pokers))
			return GroupType.siliandui;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.feijidaichibang;
		else if (AIRule.isSame(pokers, 4)) {
			var pair = [];
			for (i = 1; i < pokers.length; i++) {
				var p = pokers[i].point;
				if (pokers[i - 1].point == p) {
					if ((i >= 2 && pokers[i - 2].point == p)
							|| (i < len - 1 && pokers[i + 1].point == p))
						continue;
					pair.push( [ pokers[i - 1], pokers[i] ]);
					i++;
				}
			}
			if (pair.length == 2)
				return GroupType.sidaierdui;
		}
		return false;

	case 9:
		if (AIRule.isStraight(pokers))
			return GroupType.jiuzhangshunzi;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.sanlianfeiji;
		return false;

	case 10:
		if (AIRule.isStraight(pokers))
			return GroupType.shizhangshunzi;
		else if (AIRule.isPairLink(pokers))
			return GroupType.wuliandui;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.feijidaierdui;
		return false;

	case 11:
		if (AIRule.isStraight(pokers))
			return GroupType.shiyizhangshunzi;
		return false;

	case 12:
		if (AIRule.isStraight(pokers))
			return GroupType.shierzhangshunzi;
		else if (AIRule.isPairLink(pokers))
			return GroupType.liuliandui;
		else {
			var num = AIRule.isTripleLink(pokers);
			if (num == 3)
				return GroupType.sanlianfeijidaichibang;
			else if (num == 4)
				return GroupType.silianfeiji;
		}
		return false;

	case 13:
		return false;

	case 14:
		if (AIRule.isPairLink(pokers))
			return GroupType.qiliandui;
		return false;

	case 15:
		if (AIRule.isTripleLink(pokers))
			return GroupType.wulianfeiji;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.sanlianfeijidaisandui;
		return false;

	case 16:
		if (AIRule.isPairLink(pokers))
			return GroupType.baliandui;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.silianfeijidaichibang;
		return false;

	case 17:
		return false;

	case 18:
		if (AIRule.isPairLink(pokers))
			return GroupType.jiuliandui;
		else if (AIRule.isTripleLink(pokers))
			return GroupType.liulianfeiji;
		return false;

	case 19:
		return false;

	case 20:
		if (AIRule.isPairLink(pokers))
			return GroupType.shiliandui;
		else {
			var num = AIRule.isTripleLink(pokers);
			if (num == 5)
				return GroupType.wulianfeijidaichibang;
			else if (num == 4) {
				var pair = [];
				for (i = 1; i < pokers.length; i++) {
					var p = pokers[i].point;
					if (pokers[i - 1].point == p) {
						if ((i >= 2 && pokers[i - 2].point == p)
								|| (i < len - 1 && pokers[i + 1].point == p))
							continue;
						pair.push( [ pokers[i - 1], pokers[i] ]);
						i++;
					}
				}
				if (pair.length == 4)
					return GroupType.silianfeijidaisidui;
			}
		}
		return false;
	}
	return false;
}

//判断给定的牌中是否存在相同的指定数量的牌（已从大到小排序）
AIRule.isSame = function(pokers, amount) {
	var count = 0;
	for ( var i = 0; i < pokers.length - 1; i++) {
		if (pokers[i].point == pokers[i + 1].point) {
			count++;
		} else {
			count = 0;
		}
		if (count >= amount - 1)
			return true;
	}
	return false;
}

//判断给定的牌是否为顺子（已从大到小排序）
AIRule.isStraight = function(pokers) {
	//不能包含2、小王、大王
	if (pokers[0].point >= 15)
		return false;

	for ( var i = 0; i < pokers.length - 1; i++) {
		if (pokers[i].point != pokers[i + 1].point + 1)
			return false;
	}
	return true;
}

//判断给定的牌是否为连对（已从大到小排序）
AIRule.isPairLink = function(pokers) {
	//不能包含2、小王、大王
	if (pokers[0].point >= 15)
		return false;

	for ( var i = 0; i < pokers.length - 2; i += 2) {
		if (pokers[i].point != pokers[i + 1].point
				|| pokers[i].point != pokers[i + 2].point + 1
				|| pokers[i + 2].point != pokers[i + 3].point)
			return false;
	}
	return true;
}

//判断是否为连续三张牌,飞机,飞机带翅膀
AIRule.isTripleLink = function(pokers) {
	var num = 0, len = pokers.length, triples = [], others = [], flag = 0;

	//先找出所有的三张，并从大到小排序
	for ( var i = 2; i < len; i++) {
		if (pokers[i].point == pokers[i - 1].point
				&& pokers[i].point == pokers[i - 2].point) {
			if (flag == 0) {
				flag++;
				num++;
				triples.push(pokers[i - 2], pokers[i - 1], pokers[i]);
			}
		} else {
			flag = 0;
		}
	}
	if (num == 0)
		return false;
	AI.sort1(triples);

	//三张以外的牌，也从大到小排序
	for (i = 0; i < len; i++) {
		var p = pokers[i];
		if (triples.indexOf(p) == -1)
			others.push(p);
	}
	AI.sort1(others);

	//最后组合出适合比较的牌型，比如89555444 -> 55544489
	var temp = triples.concat(others);

	if (num > 1) //当牌组为飞机时
	{
		for ( var i = 0; i < triples.length - 3; i += 3) {
			//2不能当飞机出, 且飞机之间的点数相差1
			if (triples[i].point == 15
					|| triples[i].point != triples[i + 3].point + 1)
				return false;
		}
	}

	var plus = others.length;
	if (plus == num * 2) //或者相同数量的对子
	{
		var numPair = 0;
		for ( var j = 0; j < others.length - 1; j++) {
			if (others[j].point == others[j + 1].point)
				numPair++;
		}
		if (num != numPair)
			return false;
	} else if (!(plus == 0 || plus == num)) //飞机只能带相同数量的单牌（或者不带任何牌）
	{
		return false;
	}

	//把原来的牌组进行排序
	for ( var i = 0; i < len; i++)
		pokers[i] = temp[i];
	return num;
}