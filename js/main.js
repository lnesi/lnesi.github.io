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
var Enemy = (function () {
    function Enemy(engine) {
    }
    return Enemy;
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
var HeroGun = (function () {
    function HeroGun(ship) {
        this.reloadTime = 500;
        this.bulletSpeed = 500;
        this.deltaTime = 0;
        this.state = ship.state;
        this.ship = ship;
        this.deltaTime = this.state.game.time.now;
        this.bullets = new Phaser.Group(this.state.game, ship.bulletsContainer, 'bulletGroup', false, true, Phaser.Physics.ARCADE);
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
}());
var HeroGunLevel1 = (function (_super) {
    __extends(HeroGunLevel1, _super);
    function HeroGunLevel1(ship) {
        var _this = _super.call(this, ship) || this;
        _this.bulletSpeed = 1000;
        _this.reloadTime = 250;
        _this.gunBody = new Phaser.Sprite(_this.state.game, 0, 0, 'mainsprite', "gun06.png");
        _this.gunBody.y = -_this.gunBody.height;
        ship.displayGroup.add(_this.gunBody, false, 0);
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
        this.bulletsContainer = new Phaser.Group(state.game);
        this.displayGroup = new Phaser.Group(state.game);
        var shipBody = this.state.game.add.sprite(0, 0, 'mainsprite', 'playerShip1_blue.png');
        shipBody.anchor.setTo(0.5, 0.5);
        shipBody.alpha = 1;
        this.physics_body = this.state.add.sprite(0, 0, 'mainsprite', 'playerShip1_blue.png'); //Change to a graphic
        this.state.physics.enable(this.physics_body, Phaser.Physics.ARCADE, true);
        this.physics_body.body.collideWorldBounds = true;
        this.physics_body.anchor.setTo(0.5, 0.5);
        this.physics_body.alpha = 0;
        var shipEngine = this.state.add.sprite(0, 0, 'mainsprite', 'engine3.png');
        shipEngine.anchor.setTo(0.5, 0.5);
        shipEngine.y = shipBody.height / 2 + 5;
        var shipFire = this.state.add.sprite(0, 0, 'mainsprite');
        var frames_fire = Phaser.Animation.generateFrameNames('fire', 8, 10, '.png', 2);
        shipFire.animations.add('on', frames_fire, 30, true);
        shipFire.animations.play('on');
        shipFire.anchor.setTo(0.5, 0.5);
        shipFire.y = shipEngine.y + (shipEngine.height);
        this.displayGroup.add(shipFire);
        this.displayGroup.add(shipEngine);
        this.displayGroup.add(shipBody);
        this.gun = new HeroGunLevel1(this);
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
        this.displayGroup.x = this.physics_body.x;
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
        state.stage.addChildAt(_this, 0);
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
        this.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
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
        var background = new SpaceBackground(this);
        this.hero = new HeroShip(this);
        this.hero.setX(240);
        this.hero.setY(500);
        this.setupControls();
    };
    PlayState.prototype.setupControls = function () {
        this.movementControls = this.game.input.keyboard.createCursorKeys();
        this.fireControl = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    PlayState.prototype.update = function () {
        this.hero.velocity.x = 0;
        if (this.movementControls.left.isDown) {
            this.hero.velocity.x = -this.hero.speed;
        }
        else if (this.movementControls.right.isDown) {
            this.hero.velocity.x = this.hero.speed;
        }
        if (this.fireControl.isDown) {
            this.hero.fire();
        }
        this.hero.update();
    };
    return PlayState;
}(Phaser.State));
//# sourceMappingURL=main.js.map