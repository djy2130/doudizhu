var MyLoaderScene = cc.Scene.extend({
	_interval : null,
	_className:"MyLoaderScene",
	_bgLayer:null,
	_logoSp:null,
	_moveSp :null,
	_process :null,
	_processBg :null,
	_Eff:null,
	init : function(){
		var self = this;
		//将所有的游戏逻辑放到同一个函数中处理//背景画面
		var bgLayer = self._bgLayer = new cc.Sprite(gamebgJpg);
		bgLayer.setPosition(cc.visibleRect.center);
		self.addChild(bgLayer, 0);
		if (isFIXED_WIDTHMODE) {
			bgLayer.scaleY = cc.director.getVisibleSize().height/800;
		}
		//标题
		self._logoSp = new cc.Sprite("#startRes_logo.png");//410/2=205
		self._logoSp.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0,80)));
		self.addChild(this._logoSp,10);
		
		//下面的图片 一开始就已经加载了
		self._moveSp = new cc.Sprite("#startRes_man.png");//410/2=205
		self._moveSp.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(-205,150)));
		self.addChild(this._moveSp,10);
		//effect
		self._Eff = new cc.Sprite("#startRes_effe.png");
		self._Eff.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(-205,100)));
		self.addChild(this._Eff,12);
		//进度图片
		var procressSp = new cc.Sprite("#startRes_pre.png");
		self._process = new cc.ProgressTimer(procressSp);
		self._process.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,100)));
		self.addChild(self._process,10);
		self._process.scale = 2;
		self._process.type = cc.ProgressTimer.TYPE_BAR;
		self._process.midPoint = cc.p(0,0.5);
		self._process.barChangeRate = cc.p(1,0);
		self._process.percentage = 0;
		
		self._processBg = new cc.Sprite("#startRes_bg.png");
		self._processBg.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,100)));
		self.addChild(this._processBg,11);
		self._processBg.scale = 2;
		
		return true;
	},
	//好像没用
	_initStage: function (img, centerPos) {
		var self = this;
		var texture2d = self._texture2d = new cc.Texture2D();
		texture2d.initWithElement(img);
		texture2d.handleLoadedTexture();
		var logo = self._logo = new cc.Sprite(texture2d);
		logo.setScale(cc.contentScaleFactor());
		logo.x = centerPos.x;
		logo.y = centerPos.y;
		self._bgLayer.addChild(logo, 10);
	},
	onEnter: function () {
		var self = this;
		cc.Node.prototype.onEnter.call(self);
		self.schedule(self._startLoading, 0.3);
	},
	onExit: function () {
		cc.Node.prototype.onExit.call(this);
	},
	initWithResources: function (resources, cb) {
		if(typeof(resources)== "string") resources = [resources];
		this.resources = resources || [];
		this.cb = cb;
	},
	_startLoading: function () {
		var self = this;
		self.unschedule(self._startLoading);
		var res = self.resources;
		cc.loader.load(res,
				function (result, count, loadedCount) {
			var percent = (loadedCount / count * 100) | 0;
			percent = Math.min(percent, 100);
			//cc.log("loadedCount %d %d",loadedCount,count);
			if (self._process) {
				self._process.percentage = percent;
			}
			if (self._moveSp) {
				self._moveSp.setPosition(cc.pAdd(cc.visibleRect.bottom,
						cc.p(-205+410*(0.01*percent),150)));
			}
			if (self._Eff) {
				self._Eff.setPosition(cc.pAdd(cc.visibleRect.bottom,
						cc.p(-205+410*(0.01*percent),100)));
			}
		}, function () {
			if (self.cb){
				self.cb();
			}
		});
	},
});
MyLoaderScene.preload = function(resources, cb){
	var _myLoaderScene = null;
	if(!_myLoaderScene) {
		_myLoaderScene = new MyLoaderScene();
		_myLoaderScene.init();
	}
	_myLoaderScene.initWithResources(resources, cb);

	cc.director.runScene(_myLoaderScene);
	return _myLoaderScene;
};