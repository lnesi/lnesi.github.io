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
var SpaceShip = (function (_super) {
    __extends(SpaceShip, _super);
    function SpaceShip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toDestroy = false;
        _this.deltaTime = 0;
        return _this;
    }
    SpaceShip.prototype.getX = function () {
        return this.shipBody.body.center.x;
    };
    SpaceShip.prototype.getY = function () {
        return this.shipBody.body.center.y;
    };
    SpaceShip.prototype.update = function () {
        if (this.toDestroy)
            this.destroy(true);
    };
    return SpaceShip;
}(Phaser.Group));
///<reference path="objects/SpaceShip"/>
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(state, sprite_id, maxSpeed, accelaration, fireTime) {
        if (maxSpeed === void 0) { maxSpeed = 100; }
        if (accelaration === void 0) { accelaration = 50; }
        if (fireTime === void 0) { fireTime = 1000; }
        var _this = _super.call(this, state.game) || this;
        _this.life = 1;
        _this.fireTime = fireTime;
        _this.maxSpeed = maxSpeed;
        _this.accelaration = accelaration;
        _this.state = state;
        _this.shipBody = new Phaser.Sprite(state.game, 0, 0, sprite_id);
        state.physics.enable(_this.shipBody, Phaser.Physics.ARCADE);
        _this.shipBody.anchor.setTo(0.5, 0.5);
        //this.shipBody.body.syncBounds=true;
        _this.shipBody.body.setCircle(_this.shipBody.height / 2.5, 0, 0);
        _this.addChild(_this.shipBody);
        return _this;
    }
    Enemy.prototype.init = function () {
    };
    Enemy.prototype.getSpeed = function () {
        return Math.sqrt(Math.pow(this.shipBody.body.velocity.x, 2) + Math.pow(this.shipBody.body.velocity.x, 2));
    };
    Enemy.prototype.update = function () {
        var a = this.state.hero.getX() - this.getX();
        var b = this.state.hero.getY() - this.getY();
        var dx = this.accelaration * Math.sin(Math.atan2(a, b));
        var dy = this.accelaration * Math.cos(Math.atan2(a, b));
        this.shipBody.body.velocity.y = dy / 2;
        this.shipBody.body.velocity.x = dx / 2;
        this.shipBody.body.rotation = Math.atan2(a, b) * (-180 / Math.PI);
        if (this.life > 0)
            this.game.physics.arcade.overlap(this.shipBody, this.state.hero.weapon.bullets, this.collisionHandler, null, this);
        if (this.state.game.time.now > this.deltaTime)
            this.fire();
        _super.prototype.update.call(this);
    };
    Enemy.prototype.fire = function () {
        this.deltaTime = this.state.game.time.now + this.fireTime;
        this.weapon.fireAtSprite(this.state.hero.shipBody);
    };
    Enemy.prototype.collisionHandler = function (enemy, bullet) {
        //this.life=0;
        bullet.kill();
        var explosion = new Phaser.Sprite(this.state.game, this.getX(), this.getY(), 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('explosion');
        explosion.animations.getAnimation('explosion').play(30, false, true);
        this.state.enemyLayer.add(explosion);
        this.shipBody.kill();
        this.toDestroy = true;
        console.log("COLLISION bullet");
    };
    return Enemy;
}(SpaceShip));
var Enemy01 = (function (_super) {
    __extends(Enemy01, _super);
    function Enemy01(state) {
        var _this = _super.call(this, state, "enemy_01", 10, 200) || this;
        _this.fireTime = 1000;
        _this.weapon = new Weapon(_this, 'enemy_fire_bullet', 'sfx_laser1');
        return _this;
    }
    return Enemy01;
}(Enemy));
var Enemy02 = (function (_super) {
    __extends(Enemy02, _super);
    function Enemy02(state) {
        var _this = _super.call(this, state, "enemy_02", 10, 200) || this;
        _this.weapon = new Weapon(_this, 'enemy_fire_bullet', 'sfx_laser1');
        return _this;
    }
    return Enemy02;
}(Enemy));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, Game.globalWidth, Game.globalHeight, Phaser.CANVAS) || this;
        _this.state.add('Boot', Boot, false);
        _this.state.add('PlayState', PlayState, false);
        _this.state.start("Boot");
        return _this;
    }
    return Game;
}(Phaser.Game));
Game.globalWidth = window.innerWidth;
Game.globalHeight = window.innerHeight;
var Weapon = (function (_super) {
    __extends(Weapon, _super);
    function Weapon(ship, textureID, soundID) {
        var _this = _super.call(this, ship.state.game, ship.state.game.plugins) || this;
        _this.ship = ship;
        _this.createBullets(20, textureID);
        //  The bullet will be automatically killed when it leaves the world bounds
        _this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        _this.bulletAngleOffset = 90;
        //  The speed at which the bullet is fired
        _this.bulletSpeed = 500;
        //this.bullets = new Phaser.Group(this.state.game,ship.state.weaponsLayer,'bulletGroup',false,true,Phaser.Physics.ARCADE);
        _this.sfx = new Phaser.Sound(ship.state.game, soundID, 0.5);
        _this.trackSprite(ship.shipBody, 0, -(_this.ship.shipBody.height / 2));
        return _this;
    }
    Weapon.prototype.fireWeapon = function () {
        this.sfx.play();
        return this.fire();
    };
    return Weapon;
}(Phaser.Weapon));
///<reference path="objects/Weapon"/>
var HeroGunLevel1 = (function (_super) {
    __extends(HeroGunLevel1, _super);
    function HeroGunLevel1(ship) {
        return _super.call(this, ship, 'hero_fire_bullet', 'sfx_laser1') || this;
    }
    return HeroGunLevel1;
}(Weapon));
///<reference path="objects/SpaceShip"/>
var HeroShip = (function (_super) {
    __extends(HeroShip, _super);
    function HeroShip(state) {
        var _this = _super.call(this, state.game) || this;
        _this.life = 100;
        _this.friction = 500;
        _this.maxAcceleration = 500;
        _this.maxSpeed = 200;
        _this.currentMovement = "stand";
        _this.weightEnergy = 10;
        _this.direction = new Phaser.Point(0, 0);
        _this.acceleration = new Phaser.Point(0, 0);
        _this.state = state;
        _this.shipBody = new Phaser.Sprite(state.game, 0, 0, "hero_ship_0");
        _this.shipBody.animations.add('stand', Phaser.Animation.generateFrameNames('hero_stand_', 0, 5, '.png', 4), 24, true);
        _this.shipBody.animations.add('left', Phaser.Animation.generateFrameNames('hero_left_', 0, 5, '.png', 4), 24, false);
        _this.shipBody.animations.add('right', Phaser.Animation.generateFrameNames('hero_right_', 0, 5, '.png', 4), 24, false);
        _this.shipBody.animations.add('up', Phaser.Animation.generateFrameNames('hero_up_', 0, 5, '.png', 4), 24, false);
        _this.shipBody.animations.add('down', Phaser.Animation.generateFrameNames('hero_down_', 0, 5, '.png', 4), 24, false);
        _this.shipBody.animations.add('fire_stand', Phaser.Animation.generateFrameNames('hero_fire_stand_', 0, 2, '.png', 4), 24, false);
        _this.shipBody.animations.add('fire_up', Phaser.Animation.generateFrameNames('hero_fire_stand_', 0, 2, '.png', 4), 24, false);
        _this.shipBody.animations.add('fire_down', Phaser.Animation.generateFrameNames('hero_fire_stand_', 0, 2, '.png', 4), 24, false);
        _this.shipBody.animations.add('fire_left', Phaser.Animation.generateFrameNames('hero_fire_left_', 0, 2, '.png', 4), 24, false);
        _this.shipBody.animations.add('fire_right', Phaser.Animation.generateFrameNames('hero_fire_right_', 0, 2, '.png', 4), 24, false);
        _this.shipBody.animations.getAnimation("fire_stand").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_up").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_down").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_left").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_right").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.play('stand');
        _this.shipBody.anchor.setTo(0.5, 0.5);
        _this.add(_this.shipBody);
        _this.state.physics.enable(_this.shipBody, Phaser.Physics.ARCADE, true);
        _this.shipBody.body.collideWorldBounds = true;
        _this.shipBody.body.syncBounds = true;
        _this.shipBody.body.setCircle(_this.shipBody.height / 2.8, 0, 0);
        _this.weapon = new HeroGunLevel1(_this);
        _this.moveControls = new PadControls(state.game);
        _this.fireControl = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        _this.deltaTime = _this.state.game.time.now;
        return _this;
    }
    HeroShip.prototype.animate = function (name) {
        if (this.shipBody.animations.currentAnim.name != name && this.shipBody.animations.currentAnim.name.indexOf("fire") === -1)
            return this.shipBody.animations.play(name);
    };
    HeroShip.prototype.getSpeed = function () {
        return Math.sqrt(Math.pow(this.shipBody.body.velocity.x, 2) + Math.pow(this.shipBody.body.velocity.x, 2));
    };
    HeroShip.prototype.getCurrentDirection = function () {
        var x = 0;
        var y = 0;
        if (Math.abs(this.shipBody.body.velocity.x) > 0)
            x = (this.shipBody.body.velocity.x / Math.abs(this.shipBody.body.velocity.x));
        if (Math.abs(this.shipBody.body.velocity.y) > 0)
            y = (this.shipBody.body.velocity.y / Math.abs(this.shipBody.body.velocity.y));
        return new Phaser.Point(x, y);
    };
    HeroShip.prototype.update = function () {
        this.shipBody.body.acceleration.y = 0;
        this.moveControls.update();
        if (this.moveControls.get().x != 0) {
            this.acceleration.x = this.maxAcceleration * this.moveControls.get().x;
        }
        else {
            this.acceleration.x = this.getCurrentDirection().x * -1 * this.friction;
        }
        if (Math.abs(this.shipBody.body.velocity.x) > this.maxSpeed && (this.getCurrentDirection().x == this.moveControls.get().x)) {
            this.acceleration.x = 0;
        }
        if (Math.abs(this.shipBody.body.velocity.x) <= this.weightEnergy && this.moveControls.get().x == 0) {
            this.acceleration.x = 0;
            this.shipBody.body.velocity.x = 0;
        }
        if (this.moveControls.get().y != 0) {
            this.acceleration.y = this.maxAcceleration * this.moveControls.get().y;
        }
        else {
            this.acceleration.y = this.getCurrentDirection().y * -1 * this.friction;
        }
        if (Math.abs(this.shipBody.body.velocity.y) > this.maxSpeed && (this.getCurrentDirection().y == this.moveControls.get().y)) {
            this.acceleration.y = 0;
        }
        if (Math.abs(this.shipBody.body.velocity.y) <= this.weightEnergy && this.moveControls.get().y == 0) {
            this.acceleration.y = 0;
            this.shipBody.body.velocity.y = 0;
        }
        if (this.fireControl.isDown) {
            this.fire();
        }
        this.animate(this.moveControls.getDescription());
        this.shipBody.body.acceleration.x = this.acceleration.x;
        this.shipBody.body.acceleration.y = this.acceleration.y;
    };
    HeroShip.prototype.gunFire = function () {
        this.weapon.fireWeapon();
        var cAnimation = this.shipBody.animations.getAnimation(this.moveControls.getDescription());
        cAnimation.play();
        cAnimation.stop(null, false);
        cAnimation.frame = cAnimation.frameTotal - 1;
    };
    HeroShip.prototype.fire = function () {
        if (this.state.game.time.now > this.deltaTime) {
            this.animate('fire_' + this.moveControls.getDescription());
            this.deltaTime = this.state.game.time.now + this.weapon.fireRate;
        }
    };
    return HeroShip;
}(SpaceShip));
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
        //this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.load.image('BackgroundDarkPurple', 'assets/img/darkPurple.png');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', 64, 64);
        this.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
        this.load.atlasJSONArray('hero_ship_0', 'assets/sprites/hero_ship_0.png', 'assets/sprites/hero_ship_0.json');
        this.load.atlasJSONArray('enemy_01', 'assets/sprites/enemy_01.png', 'assets/sprites/enemy_01.json');
        this.load.atlasJSONArray('enemy_02', 'assets/sprites/enemy_02.png', 'assets/sprites/enemy_02.json');
        this.load.image('enemy_fire_bullet', 'assets/img/enemy_fire_bullet.png');
        this.load.image('hero_fire_bullet', 'assets/img/hero_fire_bullet.png');
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
var PlayState = (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayState.prototype.create = function () {
        this.backgroundLayer = new Phaser.Group(this.game);
        this.weaponsLayer = new Phaser.Group(this.game);
        this.enemyLayer = new Phaser.Group(this.game);
        this.heroLayer = new Phaser.Group(this.game);
        this.foregroundLayer = new Phaser.Group(this.game);
        var background = new SpaceBackground(this);
        this.hero = new HeroShip(this);
        this.hero.x = 240;
        this.hero.y = 500;
        this.heroLayer.add(this.hero);
        this.enemy = new Enemy02(this);
        this.enemyLayer.addChild(this.enemy);
        this.enemy.x = 0;
        this.enemy.y = 0;
        this.enemy.init();
        for (var i = 0; i < 10; i++) {
            var e = new Enemy01(this);
            this.enemyLayer.addChild(e);
            e.x = (Math.random() * Game.globalWidth * 2) - Game.globalWidth;
            e.y = -50 - (Math.random() * 500);
            e.init();
        }
    };
    PlayState.prototype.setupControls = function () {
    };
    PlayState.prototype.update = function () {
    };
    PlayState.prototype.collisionHandler = function () {
        console.log("COLLISION");
    };
    PlayState.prototype.render = function () {
        //this.game.debug.body(this.hero.shipBody);
        this.game.debug.body(this.enemy.shipBody);
        //this.game.debug.bodyInfo(this.hero.shipBody,10,10);
    };
    return PlayState;
}(Phaser.State));
var KeyInput = (function () {
    function KeyInput() {
    }
    return KeyInput;
}());
var PadControls = (function () {
    function PadControls(game) {
        this.direction = new Phaser.Point(0, 0);
        this.keys = game.input.keyboard.createCursorKeys();
    }
    PadControls.prototype.getDescription = function () {
        return this.currentDesctiption;
    };
    PadControls.prototype.get = function () {
        return this.direction;
    };
    PadControls.prototype.update = function () {
        if (this.keys.left.isDown) {
            this.currentDesctiption = "left";
            this.direction.x = -1;
            //this.shipBody.body.acceleration.x=-this.acceleration;
        }
        else if (this.keys.right.isDown) {
            this.currentDesctiption = "right";
            this.direction.x = 1;
            //this.shipBody.body.acceleration.x=this.acceleration;
        }
        else {
            this.direction.x = 0;
        }
        if (this.keys.up.isDown) {
            this.currentDesctiption = "up";
            this.direction.y = -1;
            //this.shipBody.body.acceleration.y=-this.acceleration;
        }
        else if (this.keys.down.isDown) {
            this.currentDesctiption = "down";
            this.direction.y = 1;
            //this.shipBody.body.acceleration.y=this.acceleration;
        }
        else {
            this.direction.y = 0;
        }
        if (this.direction.x == 0 && this.direction.y == 0) {
            this.currentDesctiption = "stand";
        }
    };
    return PadControls;
}());
//# sourceMappingURL=main.js.map