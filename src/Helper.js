var Helper = {};
Helper.plistToSpriteFrames = function (Arr){
	for (var i = 0; i < Arr.length; i++) {
		cc.spriteFrameCache.addSpriteFrames(Arr[i]);
	}
};
//由某个值映射到一段范围  十分重要,正序映射
Helper.scaleValue = function (maxValue,minValue){
	if (FIXED_SCALE<1) { 
		return maxValue - (maxValue-minValue)/(1-0.75)*(1-FIXED_SCALE);
	}else{
		return maxValue;
	}
};
//创建动画
Helper.createAnimation = function (sBegin,from,to,time) {
	var animation = new cc.Animation();
	for (var i = from; i < to+1; i++) {
		var frameName = sBegin + i + ".png";
		var frames = cc.spriteFrameCache.getSpriteFrame(frameName);
		if (frames) {
			animation.addSpriteFrame(frames);
		}
	}
	animation.setDelayPerUnit(time / (to - from + 1));
	animation.setRestoreOriginalFrame(true);
	return animation;
};
//缩放按钮 同一个texture
Helper.createScaleMenuItem = function (sName,iName,func,objc){
	var normal_sprite = new cc.Sprite(sName);
	var select_sprite = new cc.Sprite(sName);
	select_sprite.scaleY = 0.95;
	var posX = normal_sprite.getContentSize().width/2;
	var posY = normal_sprite.getContentSize().height/2;
	if (iName) {
		var top_sprite1 = new cc.Sprite(iName);
		var top_sprite2 = new cc.Sprite(iName);
		top_sprite1.setPosition(posX,posY);
		top_sprite2.setPosition(posX,posY);
		normal_sprite.addChild(top_sprite1);
		select_sprite.addChild(top_sprite2);
	}
	var tmItemSprite = new cc.MenuItemSprite(
			normal_sprite,
			select_sprite,
			func, objc);
	//var spimg = tmItemSprite.getNormalImage();
	//cc.log("spimg %d %d %d %d",spimg.x,spimg.y,spimg.anchorX,spimg.anchorY);
	tmItemSprite.getNormalImage().setAnchorPoint(0.5,0);
	tmItemSprite.getSelectedImage().setAnchorPoint(0.5,0);
	tmItemSprite.getNormalImage().setPosition(posX,0);
	tmItemSprite.getSelectedImage().setPosition(posX,0);
	return tmItemSprite;
};
Helper.removeSelf= function (sender){
	sender.removeFromParent();
};
Helper.deleteAllChildLayerByTag=function (target,childTag){
	var resultArr = [];
	var childArr = target.getChildren();
	for (var i = 0; i < childArr.length; i++) {
		var element = childArr[i];
		if(element.tag==childTag){
			resultArr.push(element);
		}
	}
	for (var i = 0; i < resultArr.length; i++) {
		resultArr[i].removeFromParent(true);
	}
	resultArr = null;
};