var ShareLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite(res.arrow);
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 20;
        arrow.y = cc.winSize.height - 100;
        this.addChild(arrow);

        var label = new cc.LabelTTF("请点击右上角的菜单按钮\n再点\"分享到朋友圈\"\n让好友们挑战你的分数！", "宋体", 20, cc.size(cc.winSize.width*0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height - 150;
        label.anchorY = 1;
        this.addChild(label);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
            	return true;
            },
            onTouchEnded: function (touch, event) {
            	TemplateUtils.popScene();
            }
        }, this);
    },
    onExit: function () {
        cc.eventManager.removeListeners(this);
        this._super();
    }
});