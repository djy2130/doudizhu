AIPoker = function(point, type) {

	this.point = point;
	this.type = type;

};


AIPoker.prototype.toString = function() {
	return this.type.name+" "+this.point;  
};


AIPoker.newPack = function() {
	var pack = [];
	for ( var i = 3; i <= 15; i++) {
		pack.push(new Poker(i, AIAIPoker.FANGKUAI));
		pack.push(new Poker(i, AIPoker.MEIHUA));
		pack.push(new Poker(i, AIPoker.HONGTAO));
		pack.push(new Poker(i, AIPoker.HEITAO));
	}
	pack.push(new Poker(17, AIPoker.JOKERA));
	pack.push(new Poker(16, AIPoker.JOKERB));
	return pack;
};


AIPoker.TOTAL = 54;
AIPoker.START = 3;
AIPoker.END = 17;

//types
AIPoker.FANGKUAI = {
	name : "fangkuai",
	rank : 1
};
AIPoker.MEIHUA = {
	name : "meihua",
	rank : 2
};
AIPoker.HONGTAO = {
	name : "hongtao",
	rank : 3
};
AIPoker.HEITAO = {
	name : "heitao",
	rank : 4
};

AIPoker.JOKERA = {
	name : "jokera",
};
AIPoker.JOKERB = {
	name : "jokerb",
};
