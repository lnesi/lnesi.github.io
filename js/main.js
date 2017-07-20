var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(state) {
        var _this = _super.call(this, state.game) || this;
        _this.state = state;
        _this.body = new Phaser.Sprite(state.game, 0, 0, 'mainsprite', 'enemyBlack2.png');
        state.physics.enable(_this.body, Phaser.Physics.ARCADE);
        _this.body.anchor.setTo(0.5, 0.5);
        _this.addChild(_this.body);
        return _this;
    }
    Enemy.prototype.create = function () {
    };
    Enemy.prototype.update = function () {
        this.game.physics.arcade.overlap(this.body, this.state.hero.gun.bullets, this.collisionHandler, null, this);
    };
    Enemy.prototype.collisionHandler = function () {
        var explosion = new Phaser.Sprite(this.state.game, this.x, this.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('explosion');
        explosion.animations.getAnimation('explosion').play(30, false, true);
        this.state.enemyLayer.add(explosion);
        this.destroy(true);
        console.log("COLLISION bullet");
    };
    return Enemy;
}(Phaser.Group));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, 480, 640, Phaser.CANVAS, 'wrapper') || this;
        _this.state.add('Boot', Boot, false);
        _this.state.add('PlayState', PlayState, false);
        _this.state.start("Boot");
        return _this;
    }
    return Game;
}(Phaser.Game));
Game.globalWidth = 480;
Game.globalHeight = 640;
var HeroGun = (function (_super) {
    __extends(HeroGun, _super);
    function HeroGun(ship) {
        var _this = _super.call(this, ship.state.game) || this;
        _this.reloadTime = 500;
        _this.bulletSpeed = 500;
        _this.deltaTime = 0;
        _this.state = ship.state;
        _this.ship = ship;
        _this.deltaTime = _this.state.game.time.now;
        _this.bullets = new Phaser.Group(_this.state.game, ship.bulletsContainer, 'bulletGroup', false, true, Phaser.Physics.ARCADE);
        return _this;
    }
    HeroGun.prototype.fire = function () {
        if (this.state.game.time.now > this.deltaTime) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.reset(this.ship.getX(), this.ship.getY() - bullet.height + 10);
            bullet.body.velocity.y = -this.bulletSpeed;
            this.deltaTime = this.state.game.time.now + this.reloadTime;
            this.sfx.play();
        }
    };
    return HeroGun;
}(Phaser.Group));
var HeroGunLevel1 = (function (_super) {
    __extends(HeroGunLevel1, _super);
    function HeroGunLevel1(ship) {
        var _this = _super.call(this, ship) || this;
        _this.bulletSpeed = 1000;
        _this.reloadTime = 500;
        _this.gunBody = new Phaser.Sprite(_this.state.game, 0, 0, 'mainsprite', "gun06.png");
        _this.gunBody.y = -_this.gunBody.height;
        _this.add(_this.gunBody, false, 0);
        _this.gunBody.anchor.setTo(0.5, 0.5);
        _this.gunBody.angle = 180;
        _this.bullets.createMultiple(10, 'mainsprite', "laserBlue01.png");
        _this.bullets.setAll('anchor.x', 0.5);
        _this.bullets.setAll('anchor.y', 1);
        _this.bullets.setAll('outOfBoundsKill', true);
        _this.bullets.setAll('checkWorldBounds', true);
        _this.sfx = new Phaser.Sound(_this.state.game, 'sfx_laser1', 0.5);
        return _this;
    }
    return HeroGunLevel1;
}(HeroGun));
var HeroShip = (function () {
    function HeroShip(state) {
        this.speed = 200;
        this.velocity = new Phaser.Point(0, 0);
        this.state = state;
        this.bulletsContainer = new Phaser.Group(state.game, state.heroLayer);
        this.displayGroup = new Phaser.Group(state.game, state.heroLayer);
        this.shipBody = new Phaser.Sprite(state.game, 0, 0, "hero_ship");
        this.shipBody.animations.add('standby', ['standby_01.png', 'standby_02.png'], 20, true);
        this.shipBody.animations.add('left', ['left_01.png', 'left_02.png'], 20, false);
        this.shipBody.animations.add('right', ['right_01.png', 'right_02.png'], 20, false);
        this.shipBody.animations.play('standby');
        this.shipBody.anchor.setTo(0.5, 0.5);
        this.shipBody.alpha = 1;
        this.physics_body = new Phaser.Sprite(state.game, 0, 0, "hero_ship", "standby_01.png");
        this.state.physics.enable(this.physics_body, Phaser.Physics.ARCADE, true);
        this.physics_body.body.collideWorldBounds = true;
        this.physics_body.anchor.setTo(0.5, 0.5);
        this.physics_body.alpha = 0;
        this.physics_body.height = 400;
        state.heroLayer.addChild(this.physics_body);
        var shipEngine = new Phaser.Sprite(state.game, 0, 0, 'mainsprite', 'engine3.png');
        shipEngine.anchor.setTo(0.5, 0.5);
        shipEngine.y = this.shipBody.height / 2 + 5;
        var shipFire = new Phaser.Sprite(this.state.game, 0, 0, 'mainsprite');
        var frames_fire = Phaser.Animation.generateFrameNames('fire', 8, 10, '.png', 2);
        shipFire.animations.add('on', frames_fire, 30, true);
        shipFire.animations.play('on');
        shipFire.anchor.setTo(0.5, 0.5);
        shipFire.y = shipEngine.y + (shipEngine.height);
        this.displayGroup.add(shipFire);
        this.displayGroup.add(shipEngine);
        this.displayGroup.add(this.shipBody);
        this.gun = new HeroGunLevel1(this);
        this.displayGroup.addChildAt(this.gun, 0);
        this.physics_body.height = this.displayGroup.height - 30;
        this.physics_body.width = this.displayGroup.width;
    }
    HeroShip.prototype.setX = function (x) {
        this.displayGroup.x = x;
        this.physics_body.x = x;
        return x;
    };
    HeroShip.prototype.setY = function (y) {
        this.displayGroup.y = y;
        this.physics_body.y = y;
        return y;
    };
    HeroShip.prototype.getX = function () {
        return this.displayGroup.x;
    };
    HeroShip.prototype.getY = function () {
        return this.displayGroup.y;
    };
    HeroShip.prototype.update = function () {
        this.physics_body.body.velocity.x = this.velocity.x;
        this.physics_body.body.velocity.y = this.velocity.y;
        this.displayGroup.x = this.physics_body.x;
        this.displayGroup.y = this.physics_body.y;
    };
    HeroShip.prototype.fire = function () {
        this.gun.fire();
    };
    return HeroShip;
}());
var SpaceBackground = (function (_super) {
    __extends(SpaceBackground, _super);
    function SpaceBackground(state) {
        var _this = _super.call(this, state.game, 0, 0, Game.globalWidth, Game.globalHeight, 'BackgroundDarkPurple') || this;
        state.backgroundLayer.addChild(_this);
        return _this;
    }
    SpaceBackground.prototype.update = function () {
        this.tilePosition.y += 2;
    };
    return SpaceBackground;
}(Phaser.TileSprite));
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boot.prototype.preload = function () {
        console.log("Boot: Preload");
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.load.image('BackgroundDarkPurple', 'assets/img/darkPurple.png');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', 64, 64);
        this.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
        this.load.atlasJSONArray('hero_ship', 'assets/sprites/hero_ship.png', 'assets/sprites/hero_ship.json');
        this.load.audio('sfx_laser1', "assets/audio/sfx_laser1.ogg");
    };
    Boot.prototype.create = function () {
        console.log("Boot: Created");
        this.game.state.start("PlayState");
    };
    Boot.prototype.update = function () {
    };
    return Boot;
}(Phaser.State));
var KeyInput = (function () {
    function KeyInput() {
    }
    return KeyInput;
}());
var PlayState = (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayState.prototype.create = function () {
        this.backgroundLayer = new Phaser.Group(this.game);
        this.enemyLayer = new Phaser.Group(this.game);
        this.heroLayer = new Phaser.Group(this.game);
        this.foregroundLayer = new Phaser.Group(this.game);
        var background = new SpaceBackground(this);
        this.hero = new HeroShip(this);
        this.hero.setX(240);
        this.hero.setY(500);
        this.enemy = new Enemy(this);
        this.enemyLayer.addChild(this.enemy);
        this.enemy.x = 100;
        this.enemy.y = 100;
        this.setupControls();
    };
    PlayState.prototype.setupControls = function () {
        this.movementControls = this.game.input.keyboard.createCursorKeys();
        this.fireControl = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    PlayState.prototype.update = function () {
        this.hero.velocity.x = 0;
        this.hero.velocity.y = 0;
        this.hero.shipBody.animations.play('standby');
        if (this.movementControls.left.isDown) {
            this.hero.shipBody.animations.play('left');
            this.hero.velocity.x = -this.hero.speed;
        }
        if (this.movementControls.right.isDown) {
            this.hero.shipBody.animations.play('right');
            this.hero.velocity.x = this.hero.speed;
        }
        if (this.movementControls.up.isDown) {
            this.hero.velocity.y = -this.hero.speed;
        }
        if (this.movementControls.down.isDown) {
            this.hero.velocity.y = this.hero.speed;
        }
        if (this.fireControl.isDown) {
            this.hero.fire();
        }
        this.game.physics.arcade.overlap(this.hero.physics_body, this.enemy.body, this.collisionHandler, null, this);
        this.hero.update();
    };
    PlayState.prototype.collisionHandler = function () {
        console.log("COLLISION");
    };
    PlayState.prototype.render = function () {
        //this.game.debug.body(this.hero.physics_body);
        //this.game.debug.body(this.enemy.body);
    };
    return PlayState;
}(Phaser.State));
//# sourceMappingURL=main.js.map