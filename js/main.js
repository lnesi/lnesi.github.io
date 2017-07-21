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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpaceShip.prototype.getX = function () {
        return this.shipBody.body.center.x;
    };
    SpaceShip.prototype.getY = function () {
        return this.shipBody.body.center.y;
    };
    return SpaceShip;
}(Phaser.Group));
///<reference path="objects/SpaceShip"/>
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(state, sprite_id, maxSpeed, accelaration) {
        if (maxSpeed === void 0) { maxSpeed = 100; }
        if (accelaration === void 0) { accelaration = 50; }
        var _this = _super.call(this, state.game) || this;
        _this.moveWeight = 0;
        _this.moveRelease = 0;
        _this.accelaration = 0;
        _this.maxSpeed = 0;
        _this.maxSpeed = maxSpeed;
        _this.accelaration = accelaration;
        _this.state = state;
        _this.shipBody = new Phaser.Sprite(state.game, 0, 0, sprite_id);
        state.physics.enable(_this.shipBody, Phaser.Physics.ARCADE);
        _this.shipBody.anchor.setTo(0.5, 0.5);
        _this.addChild(_this.shipBody);
        return _this;
    }
    Enemy.prototype.init = function () {
    };
    Enemy.prototype.getSpeed = function () {
        return Math.sqrt(Math.pow(this.shipBody.body.velocity.x, 2) + Math.pow(this.shipBody.body.velocity.x, 2));
    };
    Enemy.prototype.update = function () {
        //console.log(this.state.hero.physics_body.position.x,this.body.body.position.x);
        //this.body.body.position.x=this.state.hero.physics_body.position.x-(this.body.width/2);
        // this.body.body.position.y=this.state.hero.physics_body.position.y-(this.body.height/2);
        //this.body.body.velocity.x=this.state.hero.physics_body.position.x-(this.getX()+this.moveWeight);
        //this.body.body.velocity.y=this.state.hero.physics_body.position.y-(this.getY()+this.moveWeight);
        //var vY=this.state.hero.physics_body.position.y-this.body.body.position.y-this.moveWeight;
        //this.body.body.velocity.y=vY//> this.moveRelease?vY:this.moveRelease;
        var a = this.state.hero.getX() - this.getX();
        var b = this.state.hero.getY() - this.getY();
        var vx = this.accelaration * Math.sin(Math.atan2(a, b));
        var vy = this.accelaration * Math.cos(Math.atan2(a, b));
        this.shipBody.body.velocity.y = vy;
        this.shipBody.body.velocity.x = vx;
        // if(this.getSpeed()>this.maxSpeed){
        // 	console.log(this.getSpeed());
        //  	this.shipBody.body.acceleration.y=0;
        // 	this.shipBody.body.acceleration.x=0;
        // }else{
        // }
        // if(Math.abs(this.shipBody.body.velocity.y)>this.maxSpeed){
        //   	this.shipBody.body.acceleration.y=0;
        //   	this.shipBody.body.velocity.y=vy;
        // }
        // if(Math.abs(this.shipBody.body.velocity.x)>this.maxSpeed){
        //   	this.shipBody.body.acceleration.x=0;
        //   	this.shipBody.body.velocity.x=vx;
        // }
        //console.log(this.shipBody.body.velocity.y);
        this.shipBody.body.rotation = Math.atan2(a, b) * (-180 / Math.PI);
        this.game.physics.arcade.overlap(this.shipBody, this.state.hero.gun.bullets, this.collisionHandler, null, this);
    };
    Enemy.prototype.collisionHandler = function (enemy, bullet) {
        bullet.kill();
        var explosion = new Phaser.Sprite(this.state.game, this.getX(), this.getY(), 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('explosion');
        explosion.animations.getAnimation('explosion').play(30, false, true);
        this.state.enemyLayer.add(explosion);
        this.destroy(true);
        console.log("COLLISION bullet");
    };
    return Enemy;
}(SpaceShip));
var Enemy01 = (function (_super) {
    __extends(Enemy01, _super);
    function Enemy01(state) {
        return _super.call(this, state, "enemy_01", 10, 200) || this;
    }
    return Enemy01;
}(Enemy));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, 480, 640, Phaser.CANVAS) || this;
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
        _this.offset = 0;
        _this.bulletDamage = 1;
        _this.state = ship.state;
        _this.ship = ship;
        _this.bullets = new Phaser.Group(_this.state.game, ship.state.weaponsLayer, 'bulletGroup', false, true, Phaser.Physics.ARCADE);
        return _this;
    }
    HeroGun.prototype.fire = function () {
        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.ship.getX(), this.ship.getY() - bullet.height + this.offset);
        bullet.body.velocity.y = -this.bulletSpeed;
        this.sfx.play();
    };
    return HeroGun;
}(Phaser.Group));
var HeroGunLevel1 = (function (_super) {
    __extends(HeroGunLevel1, _super);
    function HeroGunLevel1(ship) {
        var _this = _super.call(this, ship) || this;
        _this.bulletSpeed = 1000;
        _this.reloadTime = 300;
        _this.offset = 0;
        _this.bulletDamage = 1;
        _this.bullets.createMultiple(20, 'hero_fire_bullet');
        _this.bullets.setAll('anchor.x', 0.5);
        _this.bullets.setAll('anchor.y', 1);
        _this.bullets.setAll('outOfBoundsKill', true);
        _this.bullets.setAll('checkWorldBounds', true);
        _this.sfx = new Phaser.Sound(_this.state.game, 'sfx_laser1', 0.5);
        return _this;
    }
    return HeroGunLevel1;
}(HeroGun));
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
        _this.deltaTime = 0;
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
        _this.gun = new HeroGunLevel1(_this);
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
        this.gun.fire();
        var cAnimation = this.shipBody.animations.getAnimation(this.moveControls.getDescription());
        cAnimation.play();
        cAnimation.stop(null, false);
        cAnimation.frame = cAnimation.frameTotal - 1;
    };
    HeroShip.prototype.fire = function () {
        if (this.state.game.time.now > this.deltaTime) {
            this.animate('fire_' + this.moveControls.getDescription());
            this.deltaTime = this.state.game.time.now + this.gun.reloadTime;
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
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.load.image('BackgroundDarkPurple', 'assets/img/darkPurple.png');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', 64, 64);
        this.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
        this.load.atlasJSONArray('hero_ship_0', 'assets/sprites/hero_ship_0.png', 'assets/sprites/hero_ship_0.json');
        this.load.atlasJSONArray('enemy_01', 'assets/sprites/enemy_01.png', 'assets/sprites/enemy_01.json');
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
        // this.enemy=new Enemy01(this);
        // this.enemyLayer.addChild(this.enemy);
        // this.enemy.x=0;
        // this.enemy.y=0;
        // this.enemy.init();
    };
    PlayState.prototype.setupControls = function () {
    };
    PlayState.prototype.update = function () {
        // this.hero.velocity.x=0;
        // this.hero.velocity.y=0;
        // this.hero.body.animations.play('standby');
        //this.game.physics.arcade.overlap(this.hero.body, this.enemy.body, this.collisionHandler, null, this);
    };
    PlayState.prototype.collisionHandler = function () {
        console.log("COLLISION");
    };
    PlayState.prototype.render = function () {
        //this.game.debug.body(this.hero.body);
        //this.game.debug.body(this.hero.shipBody);
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