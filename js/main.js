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
var HeroBullet = (function () {
    function HeroBullet(ship) {
        this.engine = ship.engine;
        this.bullet = this.engine.add.sprite(0, 0, 'mainsprite', 'laserBlue01.png');
        this.bullet.anchor.setTo(0.5, 0.5);
        this.bullet.x = ship.getX();
        this.bullet.y = ship.getY();
        this.engine.physics.enable(this.bullet, Phaser.Physics.ARCADE);
        this.updateIndex = this.engine.registerUpdate(this.update.bind(this));
        this.bullet.body.velocity.y = -400;
        //this.physics_body.body.collideWorldBounds = true;
        //
    }
    HeroBullet.prototype.update = function () {
        console.log('bulletAlive', this.updateIndex);
        if (this.bullet.y < -100) {
            this.engine.unregisterUpdate(this.updateIndex);
            this.bullet.destroy();
        }
    };
    return HeroBullet;
}());
var HeroGun = (function () {
    function HeroGun(ship, gunTexture, bulletTexture) {
        this.reloadTime = 500;
        this.bulletSpeed = 500;
        this.deltaTime = 0;
        this.engine = ship.engine;
        this.ship = ship;
        this.gunBody = this.engine.add.sprite(0, 0, 'mainsprite', gunTexture);
        this.gunBody.y = -this.gunBody.height;
        ship.displayGroup.add(this.gunBody, false, 0);
        this.gunBody.anchor.setTo(0.5, 0.5);
        this.gunBody.angle = 180;
        this.deltaTime = this.engine.time.now;
        this.bullets = this.engine.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(10, 'mainsprite', bulletTexture);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.engine.world.setChildIndex(this.bullets, 1);
    }
    HeroGun.prototype.fire = function () {
        if (this.engine.time.now > this.deltaTime) {
            console.log("Fire");
            var bullet = this.bullets.getFirstExists(false);
            bullet.reset(this.ship.getX(), this.ship.getY() - bullet.height + 10);
            bullet.body.velocity.y = -this.bulletSpeed;
            this.deltaTime = this.engine.time.now + this.reloadTime;
        }
    };
    return HeroGun;
}());
var HeroFunLevel1 = (function (_super) {
    __extends(HeroFunLevel1, _super);
    function HeroFunLevel1(ship) {
        var _this = _super.call(this, ship, "gun06.png", "laserBlue01.png") || this;
        _this.bulletSpeed = 500;
        _this.reloadTime = 500;
        return _this;
    }
    return HeroFunLevel1;
}(HeroGun));
var HeroGunLevel2 = (function (_super) {
    __extends(HeroGunLevel2, _super);
    function HeroGunLevel2(ship) {
        var _this = _super.call(this, ship, "gun01.png", "laserRed01.png") || this;
        _this.bulletSpeed = 1000;
        _this.reloadTime = 250;
        return _this;
    }
    return HeroGunLevel2;
}(HeroGun));
var KeyInput = (function () {
    function KeyInput() {
    }
    return KeyInput;
}());
var HeroShip = (function () {
    function HeroShip(engine, x, y) {
        this.horizontal_velicity = 200;
        this.engine = engine;
        this.displayGroup = this.engine.add.group();
        var shipBody = this.engine.add.sprite(0, 0, 'mainsprite', 'playerShip1_blue.png');
        shipBody.anchor.setTo(0.5, 0.5);
        shipBody.alpha = 1;
        this.physics_body = this.engine.add.sprite(0, 0, 'mainsprite', 'playerShip1_blue.png');
        this.engine.physics.enable(this.physics_body, Phaser.Physics.ARCADE, true);
        this.physics_body.body.collideWorldBounds = true;
        this.physics_body.anchor.setTo(0.5, 0.5);
        this.physics_body.alpha = 0;
        var shipEngine = this.engine.add.sprite(0, 0, 'mainsprite', 'engine3.png');
        shipEngine.anchor.setTo(0.5, 0.5);
        var shipFire = this.engine.add.sprite(0, 0, 'mainsprite');
        var frames_fire = Phaser.Animation.generateFrameNames('fire', 8, 10, '.png', 2);
        shipFire.animations.add('on', frames_fire, 30, true);
        shipFire.animations.play('on');
        shipFire.anchor.setTo(0.5, 0.5);
        shipEngine.y = shipBody.height / 2 + 5;
        shipFire.y = shipEngine.y + 20;
        this.displayGroup.add(shipFire);
        this.displayGroup.add(shipEngine);
        this.displayGroup.add(shipBody);
        //this.displayGroup.anchor.setTo(0.5, 0.5);
        // this.displayGroup.enableBody = true;
        // this.displayGroup.enableBodyDebug=true;
        //   	this.displayGroup.physicsBodyType = Phaser.Physics.ARCADE;
        //this.sbody = this.engine.add.sprite(0, 0,  'mainsprite', 'playerShip1_blue.png');
        this.displayGroup.x = x;
        this.displayGroup.y = y;
        this.physics_body.x = x;
        this.physics_body.y = y;
        this.setupControls();
        this.engine.registerUpdate(this.update.bind(this));
        this.gun = new HeroGunLevel2(this);
    }
    HeroShip.prototype.setupControls = function () {
        this.movementControls = this.engine.input.keyboard.createCursorKeys();
        this.fireControl = this.engine.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    HeroShip.prototype.getX = function () {
        return this.displayGroup.x;
    };
    HeroShip.prototype.getY = function () {
        return this.displayGroup.y;
    };
    HeroShip.prototype.update = function () {
        this.physics_body.body.velocity.x = 0;
        if (this.movementControls.left.isDown) {
            this.physics_body.body.velocity.x = -this.horizontal_velicity;
        }
        else if (this.movementControls.right.isDown) {
            this.physics_body.body.velocity.x = this.horizontal_velicity;
        }
        if (this.fireControl.isDown) {
            this.gun.fire();
        }
        this.displayGroup.x = this.physics_body.x;
        this.engine.debug.body(this.physics_body);
        this.engine.debug.bodyInfo(this.physics_body, 32, 32);
    };
    return HeroShip;
}());
var SpaceBackground = (function () {
    function SpaceBackground(engine) {
        this.engine = engine;
        this.field = this.engine.add.tileSprite(0, 0, 480, 640, 'BackgroundDarkPurple');
        this.engine.registerUpdate(this.update.bind(this));
    }
    SpaceBackground.prototype.update = function () {
        this.field.tilePosition.y += 2;
    };
    return SpaceBackground;
}());
var PhaserGame = (function (_super) {
    __extends(PhaserGame, _super);
    function PhaserGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PhaserGame.prototype.registerUpdate = function (callback) {
        return this.customUpdates.push(callback);
    };
    PhaserGame.prototype.unregisterUpdate = function (position) {
        this.customUpdates.splice(position, 1);
    };
    return PhaserGame;
}(Phaser.Game));
var Game = (function () {
    function Game() {
        var w = window.innerWidth * window.devicePixelRatio;
        var h = window.innerHeight * window.devicePixelRatio;
        this.engine = new PhaserGame(480, 640, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.created.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        this.engine.customUpdates = [];
        // this.engine.registerUpdate=function(callback){
        // 	return this.engine.customUpdates.push(callback);
        // }.bind(this);
        // this.engine.unregisterUpdate=function(position){
        // 	this.engine.customUpdates.splice(position,1);
        // }.bind(this);
    }
    Game.prototype.preload = function () {
        var w = window.innerWidth; //*window.devicePixelRatio;
        var h = window.innerHeight; //*window.devicePixelRatio;
        this.engine.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.engine.physics.startSystem(Phaser.Physics.ARCADE);
        //console.log(this.scale.scaleMode=Phaser.ScaleManager.RESIZE);
        //this.scale.setGameSize(w,h);
        this.engine.load.image('BackgroundDarkPurple', 'assets/img/darkPurple.png');
        this.engine.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
    };
    Game.prototype.created = function () {
        this.background = new SpaceBackground(this.engine);
        this.hero = new HeroShip(this.engine, 240, 540);
    };
    Game.prototype.update = function () {
        this.engine.customUpdates.forEach(function (callback) {
            callback();
        });
    };
    Game.prototype.render = function () {
        //this.engine.debug.body(this.hero.physics_body);
    };
    return Game;
}());
