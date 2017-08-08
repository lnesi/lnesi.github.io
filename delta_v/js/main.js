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
var DisplayInterfase = (function (_super) {
    __extends(DisplayInterfase, _super);
    function DisplayInterfase(state) {
        var _this = _super.call(this, state.game) || this;
        _this.lifeBarWidth = 250;
        _this.lifeBarHeight = 20;
        _this.lifeBarColor = 0xffffff;
        _this.lifes = [];
        _this.state = state;
        var background = new Phaser.TileSprite(state.game, 0, 0, Game.globalWidth, 50, "uibg");
        _this.add(background);
        _this.lifeBar = new Phaser.Graphics(state.game);
        _this.add(_this.lifeBar);
        _this.scoreDisplay = new Phaser.BitmapText(_this.game, 0, 10, 'PT Mono', "0", 25);
        _this.add(_this.scoreDisplay);
        var scoreLabel = new Phaser.BitmapText(_this.game, 0, 35, 'PT Mono', "POINTS", 12);
        _this.add(scoreLabel);
        scoreLabel.x = Game.globalWidth - scoreLabel.width - 20;
        var offsetX = 280;
        var separationLife = 25;
        for (var i = 0; i < 3; i++) {
            _this.lifes[i] = new Phaser.Sprite(state.game, offsetX + (separationLife * i), 15, 'vidas', 'vida_on.png');
            _this.lifes[i].animations.add('on', ['vida_on.png'], 24, true);
            _this.lifes[i].animations.add('off', ['vida_off.png'], 24, true);
            _this.lifes[i].animations.play('on');
            _this.add(_this.lifes[i]);
        }
        _this.alpha = 0.75;
        return _this;
    }
    DisplayInterfase.prototype.setScore = function (score) {
        this.scoreDisplay.text = score;
        this.scoreDisplay.x = Game.globalWidth - this.scoreDisplay.width - 20;
    };
    DisplayInterfase.prototype.updateLifes = function () {
        var total = this.state.lifes;
        for (var i = this.lifes.length - 1; i > total - 1; i--) {
            this.animatelifeIndicator(this.lifes[i]);
        }
    };
    DisplayInterfase.prototype.animatelifeIndicator = function (life) {
        if (life.animations.currentAnim.name == "on") {
            life.animations.play("off");
            var tweenBlink = this.game.add.tween(life);
            tweenBlink.to({ alpha: 0.5 }, 200, "Linear", true, 0, 10, true);
        }
    };
    DisplayInterfase.prototype.update = function () {
        if (this.state.hero.life >= 0) {
            this.lifeBar.clear();
            this.lifeBar.beginFill(this.lifeBarColor);
            this.lifeBar.drawRect(20, 15, (this.state.hero.life * this.lifeBarWidth) / 100, this.lifeBarHeight);
            this.lifeBar.endFill();
        }
        else {
        }
        this.setScore(this.state.getGame().currentScore);
    };
    return DisplayInterfase;
}(Phaser.Group));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(firebase) {
        var _this = _super.call(this, Game.globalWidth, Game.globalHeight, Phaser.CANVAS) || this;
        _this.currentScore = 0;
        _this.user = null;
        _this.firebase = firebase;
        _this.setupStates();
        _this.setupScreens();
        //this.setupFireBase();
        _this.state.start("Boot");
        return _this;
    }
    Game.prototype.setupStates = function () {
        this.state.add('Boot', Boot, false);
        this.state.add('PlayState', PlayState, false);
        this.state.add('LandingState', LandingState, false);
        this.state.add('GameOverState', GameOverState, false);
    };
    Game.prototype.setupScreens = function () {
        this.leaderboard = new Leaderboard("leaderboard", this);
    };
    Game.prototype.setupFireBase = function () {
        this.firebase.auth().signInAnonymously()["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        this.firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                this.user = user;
                console.log(this.user);
            }
            else {
            }
            // ...
        }.bind(this));
    };
    Game.prototype.globalWidth = function () {
        return Game.globalWidth;
    };
    Game.prototype.globalHeight = function () {
        return Game.globalHeight;
    };
    Game.prototype.applyMixins = function (derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    };
    return Game;
}(Phaser.Game));
Game.globalWidth = 768; //window.innerWidth* window.devicePixelRatio;
Game.globalHeight = 1024; //window.innerHeight* window.devicePixelRatio;
var Weapon = (function (_super) {
    __extends(Weapon, _super);
    function Weapon(ship, textureID, soundID, fireRate, damage, offset, group) {
        if (fireRate === void 0) { fireRate = null; }
        if (damage === void 0) { damage = 1; }
        if (offset === void 0) { offset = null; }
        if (group === void 0) { group = null; }
        var _this = _super.call(this, ship.state.game, ship.state.game.plugins) || this;
        if (offset) {
            _this.emiterOffset = offset;
        }
        else {
            _this.emiterOffset = new Phaser.Point(0, 0);
        }
        _this.ship = ship;
        if (group) {
            _this.createBullets(20, textureID, 0, group);
        }
        else {
            _this.createBullets(20, textureID);
        }
        //  The bullet will be automatically killed when it leaves the world bounds
        _this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        _this.bulletAngleOffset = 90;
        if (fireRate === null) {
            _this.fireRate = Phaser.Math.between(10, 100);
        }
        else {
            _this.fireRate = fireRate;
        }
        //  The speed at which the bullet is fired
        _this.bulletSpeed = 750;
        //this.bullets = new Phaser.Group(this.state.game,ship.state.weaponsLayer,'bulletGroup',false,true,Phaser.Physics.ARCADE);
        _this.sfx = new Phaser.Sound(ship.state.game, soundID, 0.5);
        _this.trackSprite(ship.shipBody, _this.emiterOffset.x, _this.emiterOffset.y);
        return _this;
    }
    Weapon.prototype.fireWeapon = function () {
        //this.sfx.play();
        return this.fire();
    };
    Weapon.prototype.update = function () {
        console.log("update weapon");
    };
    return Weapon;
}(Phaser.Weapon));
///<reference path="objects/Weapon"/>
var HeroGunLevel1 = (function (_super) {
    __extends(HeroGunLevel1, _super);
    function HeroGunLevel1(ship) {
        return _super.call(this, ship, 'hero_fire_bullet', 'sfx_laser1', 20, 1, new Phaser.Point(0, -ship.shipBody.height / 2), ship.state.heroLayer) || this;
    }
    return HeroGunLevel1;
}(Weapon));
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
    SpaceShip.prototype.setX = function (x) {
        this.shipBody.x = x;
    };
    SpaceShip.prototype.setY = function (y) {
        this.shipBody.y = y;
    };
    SpaceShip.prototype.update = function () {
        if (this.toDestroy) {
            this.shipBody.destroy();
            this.destroy(true);
        }
    };
    return SpaceShip;
}(Phaser.Group));
///<reference path="objects/SpaceShip.ts"/>
var HeroShip = (function (_super) {
    __extends(HeroShip, _super);
    function HeroShip(state) {
        var _this = _super.call(this, state.game) || this;
        _this.life = 100;
        _this.friction = 750;
        _this.maxAcceleration = 750;
        _this.maxSpeed = 500;
        _this.currentMovement = "stand";
        _this.weightEnergy = 10;
        _this.direction = new Phaser.Point(0, 0);
        _this.acceleration = new Phaser.Point(0, 0);
        _this.active = false;
        _this.state = state;
        _this.shipBody = new Phaser.Sprite(state.game, 0, 0, "hero");
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
        _this.shipBody.animations.add('explosion', Phaser.Animation.generateFrameNames('hero_explosion_', 0, 15, '.png', 4), 24, false);
        _this.shipBody.animations.getAnimation("explosion").onComplete.add(_this.state.onHeroKilled.bind(_this.state));
        _this.shipBody.animations.getAnimation("fire_stand").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_up").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_down").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_left").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.getAnimation("fire_right").onComplete.add(_this.gunFire.bind(_this));
        _this.shipBody.animations.play('stand');
        _this.shipBody.anchor.setTo(0.5, 0.5);
        _this.add(_this.shipBody);
        _this.state.physics.enable(_this.shipBody, Phaser.Physics.ARCADE, true);
        _this.shipBody.body.collideWorldBounds = false;
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
        if (this.active) {
            this.shipBody.body.acceleration.y = 0;
            this.shipBody.body.acceleration.x = 0;
            this.moveControls.update(this);
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
            //       if(this.game.input.pointer1.isDown && this.game.input.pointer2.isDown){
            // 	this.fire();
            // }
            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
            this.animate(this.moveControls.getDescription());
            this.shipBody.body.acceleration.x = this.acceleration.x;
            this.shipBody.body.acceleration.y = this.acceleration.y;
        }
        else {
            this.shipBody.body.acceleration.x = 0;
            this.shipBody.body.acceleration.y = 0;
        }
    };
    HeroShip.prototype.hitHandler = function (shipBody, bullet) {
        console.log("Collidion hero");
        bullet.kill();
    };
    HeroShip.prototype.gunFire = function () {
        this.weapon.fireWeapon();
        var cAnimation = this.shipBody.animations.getAnimation(this.moveControls.getDescription());
        cAnimation.play();
        cAnimation.stop(null, false);
        cAnimation.frame = cAnimation.frameTotal - 1;
    };
    HeroShip.prototype.fire = function () {
        //if(this.state.game.time.now>this.deltaTime){
        this.animate('fire_' + this.moveControls.getDescription());
        //	this.deltaTime=this.state.game.time.now+this.weapon.fireRate;
        //}
    };
    HeroShip.prototype.kill = function () {
        //https://garystanton.co.uk/better-explosions-with-phasers-particle-emitter/
        if (this.active) {
            this.active = false;
            var sfx = new Phaser.Sound(this.state.game, 'sfx_explosion', 1);
            //sfx.play();
            this.animate('explosion');
        }
    };
    HeroShip.prototype.reSpawn = function () {
        this.life = 100;
        setTimeout(function () { this.init(); }.bind(this), 500);
    };
    HeroShip.prototype.init = function () {
        this.animate("stand");
        this.shipBody.visible = true;
        this.shipBody.x = Game.globalWidth / 2;
        this.shipBody.y = Game.globalHeight + 200;
        this.alpha = 0.5;
        var tween = this.game.add.tween(this.shipBody);
        var tweenBlink = this.game.add.tween(this);
        tween.to({ x: Game.globalWidth / 2, y: Game.globalHeight / 2 }, 2000, Phaser.Easing.Exponential.Out);
        tweenBlink.to({ alpha: 1 }, 200, "Linear", true, 0, -1, true);
        tween.onComplete.add(function () {
            this.activate();
            tweenBlink.stop();
            this.alpha = 1;
        }, this);
        tween.start();
    };
    HeroShip.prototype.activate = function () {
        this.shipBody.body.collideWorldBounds = true;
        this.active = true;
    };
    HeroShip.prototype.spawn = function () {
    };
    return HeroShip;
}(SpaceShip));
var SpaceBackground = (function (_super) {
    __extends(SpaceBackground, _super);
    function SpaceBackground(state) {
        var _this = _super.call(this, state.game) || this;
        _this.state = state;
        _this.ts = new Phaser.TileSprite(state.game, 0, 0, Game.globalWidth, Game.globalHeight, 'Background_01');
        _this.addChild(_this.ts);
        new BackgroundBlock(_this.state.getGame());
        return _this;
    }
    SpaceBackground.prototype.update = function () {
        this.ts.tilePosition.y += 1;
    };
    return SpaceBackground;
}(Phaser.Group));
var SpaceForeground = (function (_super) {
    __extends(SpaceForeground, _super);
    function SpaceForeground(state, key, speed) {
        var _this = _super.call(this, state.game) || this;
        _this.speed = speed;
        _this.ts = new Phaser.TileSprite(state.game, 0, 0, Game.globalWidth, Game.globalHeight, 'clouds', key);
        _this.addChild(_this.ts);
        return _this;
    }
    SpaceForeground.prototype.update = function () {
        this.ts.tilePosition.y += this.speed;
    };
    return SpaceForeground;
}(Phaser.Group));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(state, sprite_id, type, acceleration, scoreValue, maxSpeed, minSpeed) {
        if (type === void 0) { type = null; }
        if (acceleration === void 0) { acceleration = null; }
        if (scoreValue === void 0) { scoreValue = 10; }
        if (maxSpeed === void 0) { maxSpeed = 500; }
        if (minSpeed === void 0) { minSpeed = 100; }
        var _this = _super.call(this, state.game) || this;
        _this.life = 1;
        _this.on = false;
        _this.clock = 0;
        _this.timeOffset = 0;
        _this.moveTracker = 0;
        _this.enterOrbit = false;
        _this.angleCicle = 0;
        _this.state = state;
        _this.maxSpeed = maxSpeed;
        _this.minSpeed = minSpeed;
        _this.scoreValue = scoreValue;
        _this.target = new Phaser.Point(Phaser.Math.between(Enemy.offsetWidth, Game.globalWidth - Enemy.offsetWidth), Game.globalHeight + Enemy.offsetHeight);
        if (type) {
            _this.type = type;
        }
        else {
            _this.type = Enemy.NORMAL;
        }
        if (acceleration === null) {
            _this.acceleration = Phaser.Math.between(_this.minSpeed, _this.maxSpeed);
        }
        else {
            _this.acceleration = acceleration;
        }
        _this.shipBody = new Phaser.Sprite(state.game, 0, 0, sprite_id);
        state.physics.enable(_this.shipBody, Phaser.Physics.ARCADE);
        _this.shipBody.anchor.setTo(0.5, 0.5);
        //this.shipBody.body.syncBounds=true;
        _this.shipBody.body.setCircle(_this.shipBody.height / 2.5, 0, 0);
        _this.addChild(_this.shipBody);
        _this.shipBody.body.bounce.x = 0.5;
        _this.shipBody.body.bounce.y = 0.5;
        //this.shipBody.body.collideWorldBounds=true;
        _this.shipBody.animations.add('stand', ['stand.png'], 24, true);
        _this.shipBody.animations.add('explosion', Phaser.Animation.generateFrameNames('explosion_', 0, 15, '.png', 4), 24, false);
        _this.shipBody.animations.getAnimation('explosion').onComplete.add(_this.onExplosion.bind(_this));
        _this.shipBody.animations.play('stand');
        return _this;
    }
    Enemy.prototype.addWeapon = function (weapon) {
        this.weapon = weapon;
    };
    Enemy.prototype.init = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        if (!this.weapon)
            this.weapon = new EnemyWeapon(this, 'enemy_fire_bullet', null);
        if (x === null) {
            this.setX(Phaser.Math.between(Enemy.offsetWidth, Game.globalWidth - Enemy.offsetWidth));
        }
        else {
            this.setX(x);
        }
        if (y === null) {
            this.setY(-Enemy.offsetHeight);
        }
        else {
            this.setY(y);
        }
        this.deltaTime = this.state.game.time.now + 1000;
        this.on = true;
    };
    Enemy.prototype.update = function () {
        if (this.on && this.state.game.time.now > this.deltaTime) {
            this.clock++;
            switch (this.type) {
                case 1:
                    this.kamikaze_ai();
                    break;
                case 2:
                    this.circle_ai();
                    break;
                case 3:
                    this.sweep_ai();
                    break;
                default:
                    this.moveToTarget();
                    break;
            }
            this.lookAtHero();
            if (this.life > 0)
                this.checkCollision();
            this.weapon.fireAtSprite(this.state.hero.shipBody);
        }
        this.game.physics.arcade.overlap(this.shipBody, this.state.enemyCollider, this.killHandler, null, this);
        _super.prototype.update.call(this);
    };
    Enemy.prototype.kamikaze_ai = function () {
        this.target = new Phaser.Point(this.state.hero.getX(), this.state.hero.getY());
        this.moveToTarget();
    };
    Enemy.prototype.sweep_ai = function () {
        this.moveTracker += 0.01;
        this.target.x = Math.sin(this.moveTracker) * Game.globalWidth;
        this.moveToTarget();
    };
    Enemy.prototype.circle_ai = function () {
        var difX = this.state.hero.getX() - this.getX();
        var difY = this.state.hero.getY() - this.getY();
        var dif = Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2));
        var radius = 300;
        if (dif <= radius + 50) {
            if (!this.enterOrbit) {
                Math.cos(difX);
                this.angleCicle = Phaser.Math.radToDeg(Math.acos(difX / dif)) + Phaser.Math.radToDeg(Math.asin(difY / dif));
            }
            this.enterOrbit = true;
            this.angleCicle = this.angleCicle + 1;
            var iX = this.state.hero.getX() + (Math.sin(Phaser.Math.degToRad(this.angleCicle)) * radius);
            var iY = this.state.hero.getY() + (Math.cos(Phaser.Math.degToRad(this.angleCicle)) * radius);
            this.target = new Phaser.Point(iX, iY);
            this.moveToTarget();
        }
        else {
            this.kamikaze_ai();
        }
    };
    Enemy.prototype.checkCollision = function () {
        if (this.state.hero.active) {
            this.game.physics.arcade.overlap(this.state.hero.shipBody, this.weapon.bullets, this.weaponHitHandler, null, this);
            this.game.physics.arcade.overlap(this.shipBody, this.state.hero.weapon.bullets, this.hitHandler, null, this);
            this.game.physics.arcade.overlap(this.shipBody, this.state.hero.shipBody, this.collisionHandler, null, this);
        }
    };
    Enemy.prototype.moveToTarget = function (acceleration) {
        if (acceleration === void 0) { acceleration = null; }
        if (acceleration === null)
            acceleration = this.acceleration;
        var a = this.target.x - this.getX();
        var b = this.target.y - this.getY();
        var dx = acceleration * Math.sin(Math.atan2(a, b));
        var dy = acceleration * Math.cos(Math.atan2(a, b));
        this.shipBody.body.velocity.y = dy / 2;
        this.shipBody.body.velocity.x = dx / 2;
    };
    Enemy.prototype.setToTarget = function () {
        this.setX(this.target.x);
        this.setY(this.target.y);
    };
    Enemy.prototype.lookAtTarget = function () {
        var aTarget = this.target.x - this.getX();
        var bTarget = this.target.y - this.getY();
        this.shipBody.body.rotation = Math.atan2(aTarget, bTarget) * (-180 / Math.PI);
    };
    Enemy.prototype.lookAtHero = function () {
        var aHero = this.state.hero.getX() - this.getX();
        var bHero = this.state.hero.getY() - this.getY();
        this.shipBody.body.rotation = Math.atan2(aHero, bHero) * (-180 / Math.PI);
    };
    Enemy.prototype.weaponHitHandler = function (heroBody, bullet) {
        if (this.state.hero.life >= 0) {
            this.state.hero.life = this.state.hero.life - this.weapon.damage;
        }
        else {
            this.state.hero.kill();
        }
        bullet.kill();
    };
    Enemy.prototype.hitHandler = function (enemy, bullet) {
        //this.life=0;
        bullet.kill();
        this.state.getGame().currentScore += this.scoreValue;
        this.explode();
        //console.log("COLLISION bullet");
    };
    Enemy.prototype.explode = function () {
        this.on = false;
        this.shipBody.animations.play('explosion');
    };
    Enemy.prototype.onExplosion = function () {
        this.shipBody.kill();
        this.toDestroy = true;
    };
    Enemy.prototype.collisionHandler = function () {
        //this.life=0;
        this.explode();
        //console.log("COLLISION hero");
    };
    Enemy.prototype.killHandler = function () {
        this.shipBody.kill();
        this.toDestroy = true;
    };
    return Enemy;
}(SpaceShip));
Enemy.NORMAL = 0;
Enemy.KAMIKAZE = 1;
Enemy.SWAP = 2;
Enemy.SWEEP = 3;
Enemy.offsetWidth = 250;
Enemy.offsetHeight = 250;
Enemy.TEXTURES = ['enemy_01', 'enemy_02', 'enemy_03'];
Enemy.AIs = [0, 1, 2, 3];
// ///<reference path="EnemyBase.ts"/>
// class EnemyCircle extends EnemyBase{
// 	public angleCicle=0;
// 	public radius=400;
// 	private enterOrbit:boolean=false;
// 	private orbitAngle=0;
// 	public deltaAcceleration:number=0;
// 	// constructor(state:PlayState,index:number){
// 	// 	super(state,index,"enemy_03",300);
// 	// 	this.orbitAngle=0;
// 	// }
// 	update(){
// 		let difX=this.state.hero.getX()-this.getX();
// 		let difY=this.state.hero.getY()-this.getY();
// 		let dif=Math.sqrt(Math.pow(difX,2)+Math.pow(difY,2));	
// 		if(this.on && this.state.game.time.now>this.deltaTime && (dif<=this.radius+50)){
// 			if(!this.enterOrbit){
// 				Math.cos(difX)
// 				this.angleCicle=Phaser.Math.radToDeg(Math.acos(difX/dif))+Phaser.Math.radToDeg(Math.asin(difY/dif));
// 			}
// 			this.enterOrbit=true;
// 			this.angleCicle=this.angleCicle+1;
// 			let iX=this.state.hero.getX()+(Math.sin(Phaser.Math.degToRad(this.angleCicle))*this.radius);
// 			let iY=this.state.hero.getY()+(Math.cos(Phaser.Math.degToRad(this.angleCicle))*this.radius);
// 			this.target=new Phaser.Point(iX,iY);
// 			this.moveToTarget();
// 			this.lookAtHero();
// 			this.fire();
// 			this.checkCollision();
// 			if(this.state.game.time.now>this.deltaAcceleration){
// 				this.acceleration=Phaser.Math.between(500,1000);
// 				this.deltaAcceleration=this.state.game.time.now+2000;
// 			}
// 		}else{
// 			this.enterOrbit=false;
// 			this.target=new Phaser.Point(this.state.hero.getX(),this.state.hero.getY());
// 			super.update();
// 		}
// 	}
// 	explode(){
// 		this.state.spawnKiller();
// 		super.explode();
// 	}
// }
var EnemyWeapon = (function (_super) {
    __extends(EnemyWeapon, _super);
    function EnemyWeapon(ship, textureID, fireRate, bulletsCount, fireLimit, reloadTime, damage, offset) {
        if (fireRate === void 0) { fireRate = null; }
        if (bulletsCount === void 0) { bulletsCount = 10; }
        if (fireLimit === void 0) { fireLimit = 10; }
        if (reloadTime === void 0) { reloadTime = 2000; }
        if (damage === void 0) { damage = 1; }
        if (offset === void 0) { offset = null; }
        var _this = _super.call(this, ship.state.game, ship.state.game.plugins) || this;
        _this.damage = damage;
        _this.reloadTime = reloadTime;
        if (offset) {
            _this.emiterOffset = offset;
        }
        else {
            _this.emiterOffset = new Phaser.Point(0, 0);
        }
        _this.ship = ship;
        _this.createBullets(bulletsCount, textureID, 0, ship.state.weaponsLayer);
        //  The bullet will be automatically killed when it leaves the world bounds
        _this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        _this.bulletAngleOffset = 90;
        if (fireRate === null) {
            _this.fireRate = Phaser.Math.between(10, 100);
        }
        else {
            _this.fireRate = fireRate;
        }
        _this.fireLimit = fireLimit;
        //  The speed at which the bullet is fired
        _this.bulletSpeed = 750;
        _this.onFireLimit.add(_this.reload.bind(_this));
        //this.bullets = new Phaser.Group(this.state.game,ship.state.weaponsLayer,'bulletGroup',false,true,Phaser.Physics.ARCADE);
        _this.trackSprite(ship.shipBody, _this.emiterOffset.x, _this.emiterOffset.y);
        ship.addWeapon(_this);
        return _this;
    }
    EnemyWeapon.prototype.reload = function () {
        setTimeout(function () {
            this.resetShots();
        }.bind(this), this.reloadTime);
    };
    EnemyWeapon.prototype.update = function () {
        console.log("update weapon");
    };
    return EnemyWeapon;
}(Phaser.Weapon));
var BackgroundBlock = (function (_super) {
    __extends(BackgroundBlock, _super);
    function BackgroundBlock(game) {
        var _this = _super.call(this, game) || this;
        _this.on = false;
        _this.blockWidth = 64;
        _this.blockHeight = 64;
        _this.clock = 0;
        _this.game = game;
        var filas = Math.ceil(game.globalHeight() / _this.blockHeight);
        for (var i = 0; i < filas; i++) {
            var b = new BackgroundRow(_this);
            _this.addChild(b);
            b.y = _this.blockHeight * i;
        }
        _this.addChild(new BackgroundRow(_this));
        _this.clock = 0;
        return _this;
    }
    BackgroundBlock.prototype.update = function () {
        this.clock++;
        if (this.clock % this.blockHeight == 0) {
            this.addChild(new BackgroundRow(this));
        }
        _super.prototype.update.call(this);
    };
    return BackgroundBlock;
}(Phaser.Group));
var BackgroundRow = (function (_super) {
    __extends(BackgroundRow, _super);
    function BackgroundRow(bk) {
        var _this = _super.call(this, bk.game) || this;
        _this.game = bk.game;
        var columns = Math.ceil(_this.game.globalWidth() / bk.blockWidth);
        for (var i = 0; i < columns; i++) {
            var s = new Phaser.Sprite(_this.game, bk.blockWidth * i, 0, 'back_sprite_01', "bge_0" + Phaser.Math.between(1, 6) + ".png");
            _this.addChild(s);
        }
        _this.y = -64;
        return _this;
    }
    BackgroundRow.prototype.update = function () {
        if (this.y > this.game.globalHeight()) {
            this.destroy(true);
        }
        else {
            this.y += 1;
        }
    };
    return BackgroundRow;
}(Phaser.Group));
var LoadableState = (function (_super) {
    __extends(LoadableState, _super);
    function LoadableState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ready = false;
        return _this;
    }
    LoadableState.prototype.init = function () {
        this.preloaderLayer = new Phaser.Group(this.game);
        this.preloadBackground = new Phaser.Image(this.game, 0, 0, 'homescreen_bg');
        this.preloadBar = new Phaser.Sprite(this.game, (Game.globalWidth / 2) - 150, (Game.globalHeight / 2) - 12, 'preload_bar');
    };
    LoadableState.prototype.preload = function () {
        this.preloaderLayer.add(this.preloadBackground);
        this.preloaderLayer.add(this.preloadBar);
        this.load.setPreloadSprite(this.preloadBar);
    };
    LoadableState.prototype.create = function () {
        this.contentLayer = new Phaser.Group(this.game);
        this.preloadBar.destroy();
    };
    LoadableState.prototype.getGame = function () {
        return this.game;
    };
    return LoadableState;
}(Phaser.State));
var HTMLScreen = (function () {
    function HTMLScreen(elementId, game) {
        this.html = document.getElementById(elementId);
        this.game = game;
    }
    HTMLScreen.prototype.show = function () {
        this.html.style.display = "block";
        gsap.TweenMax.to(this.html, 1, { "opacity": 1 });
    };
    HTMLScreen.prototype.hide = function () {
        gsap.TweenMax.to(this.html, 1, { "opacity": 0, onComplete: function () {
                this.html.style.display = "none";
            }.bind(this) });
    };
    return HTMLScreen;
}());
///<reference path="HTMLScreen.ts"/>
var Leaderboard = (function (_super) {
    __extends(Leaderboard, _super);
    function Leaderboard(elementId, game) {
        var _this = _super.call(this, elementId, game) || this;
        for (var i = 0; i < _this.html.childNodes.length; i++) {
            var e = _this.html.childNodes[i];
            if (e.className == "preloader") {
                _this.preloader = e;
            }
            ;
            if (e.className == "tableHolder") {
                _this.table = e;
            }
        }
        _this.table.style.display = "none";
        _this.preloader.style.display = "none";
        return _this;
    }
    Leaderboard.prototype.show = function () {
        this.table.style.display = "none";
        this.preloader.style.display = "block";
        _super.prototype.show.call(this);
    };
    return Leaderboard;
}(HTMLScreen));
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boot.prototype.init = function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.onSizeChange.add(this.sizeChange);
    };
    Boot.prototype.sizeChange = function () {
        var screens = document.getElementsByClassName("htmlScreen");
        for (var i = 0; i < screens.length; i++) {
            screens[i].style.width = document.getElementsByTagName("canvas")[0].clientWidth + "px";
            screens[i].style.height = document.getElementsByTagName("canvas")[0].clientHeight + "px";
        }
        document.getElementById("leaderboard").style.width = document.getElementsByTagName("canvas")[0].clientWidth + "px";
        document.getElementById("leaderboard").style.height = document.getElementsByTagName("canvas")[0].clientHeight + "px";
    };
    Boot.prototype.preload = function () {
        console.log("Boot: Preload");
        this.load.image('homescreen_bg', 'assets/img/homescreen_bg.png');
        this.load.image('preload_bar', 'assets/img/preload_bar.png');
        this.game.input.addPointer();
        this.game.input.addPointer();
        // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        // 
    };
    Boot.prototype.create = function () {
        console.log("Boot: Created");
        this.game.state.start("LandingState");
        this.game.time.advancedTiming = true;
    };
    Boot.prototype.update = function () {
    };
    return Boot;
}(Phaser.State));
var GameOverState = (function (_super) {
    __extends(GameOverState, _super);
    function GameOverState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listening = true;
        return _this;
    }
    GameOverState.prototype.create = function () {
        _super.prototype.create.call(this);
        var gameOverText = new Phaser.BitmapText(this.game, 0, Game.globalHeight / 2, 'PT Mono', "GAME OVER", 40);
        gameOverText.x = (Game.globalWidth / 2) - gameOverText.width / 2;
        this.contentLayer.add(gameOverText);
        var startMessage = new Phaser.BitmapText(this.game, 0, Game.globalHeight - 200, 'PT Mono', "PLAY AGAIN", 20);
        startMessage.x = (Game.globalWidth / 2) - startMessage.width / 2;
        var tween = this.game.add.tween(startMessage);
        tween.to({ alpha: 0.2 }, 500, "Linear", true, 0, -1, true);
        this.contentLayer.add(startMessage);
    };
    GameOverState.prototype.update = function () {
        if (this.listening) {
            this.capturePointer(this.game.input.mousePointer);
            this.capturePointer(this.game.input.pointer1);
        }
    };
    GameOverState.prototype.capturePointer = function (pointer) {
        if (pointer.isDown) {
            this.listening = false;
            this.game.state.start("PlayState");
        }
    };
    return GameOverState;
}(LoadableState));
var LandingState = (function (_super) {
    __extends(LandingState, _super);
    function LandingState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listening = true;
        return _this;
    }
    LandingState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('homescreen_logo', 'assets/img/homescreen_logo.png');
        this.game.load.bitmapFont('PT Mono', 'assets/fonts/ptmono.png', 'assets/fonts/ptmono.xml');
    };
    LandingState.prototype.create = function () {
        _super.prototype.create.call(this);
        var logo = new Phaser.Image(this.game, Game.globalWidth / 2, Game.globalHeight / 2, "homescreen_logo");
        logo.anchor.x = 0.5;
        logo.anchor.y = 0.5;
        this.contentLayer.add(logo);
        var bmpText = new Phaser.BitmapText(this.game, 0, Game.globalHeight - 200, 'PT Mono', "TOUCH TO START", 20);
        bmpText.x = (Game.globalWidth / 2) - bmpText.width / 2;
        var tween = this.game.add.tween(bmpText);
        tween.to({ alpha: 0.2 }, 500, "Linear", true, 0, -1, true);
        this.contentLayer.add(bmpText);
    };
    LandingState.prototype.update = function () {
        if (this.listening) {
            this.capturePointer(this.game.input.mousePointer);
            this.capturePointer(this.game.input.pointer1);
        }
    };
    LandingState.prototype.capturePointer = function (pointer) {
        if (pointer.isDown) {
            this.listening = false;
            this.game.state.start("PlayState");
        }
    };
    return LandingState;
}(LoadableState));
var PlayState = (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clock = 0;
        _this.allowKiller = true;
        _this.lifes = 3;
        return _this;
    }
    PlayState.prototype.init = function () {
        _super.prototype.init.call(this);
        this.lifes = 3;
        this.getGame().currentScore = 0;
        this.allowKiller = true;
        this.indexCount = 0;
        this.clock = 0;
    };
    PlayState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.json('levelData', "data/level.json");
        this.load.image('Background_01', 'assets/img/background_01_0.png');
        this.load.atlasJSONArray('clouds', 'assets/sprites/clouds.png', 'assets/sprites/clouds.json');
        this.load.atlasJSONArray('back_sprite_01', 'assets/sprites/background_01.png', 'assets/sprites/background_01.json');
        this.load.image('uibg', 'assets/img/uibg.png');
        this.load.atlasXML('mainsprite', 'assets/sprites/sheet.png', 'assets/sprites/sheet.xml');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', 100, 100);
        this.load.atlasJSONArray('hero', 'assets/sprites/hero.png', 'assets/sprites/hero.json');
        this.load.atlasJSONArray('enemy_01', 'assets/sprites/enemy_01.png', 'assets/sprites/enemy_01.json');
        this.load.atlasJSONArray('enemy_02', 'assets/sprites/enemy_02.png', 'assets/sprites/enemy_02.json');
        this.load.atlasJSONArray('enemy_03', 'assets/sprites/enemy_03.png', 'assets/sprites/enemy_03.json');
        this.load.atlasJSONArray('vidas', 'assets/sprites/vidas.png', 'assets/sprites/vidas.json');
        this.load.image('enemy_fire_bullet', 'assets/img/enemy_fire_bullet.png');
        this.load.image('hero_fire_bullet', 'assets/img/hero_fire_bullet.png');
        this.load.audio('sfx_laser1', "assets/audio/sfx_laser1.ogg");
        this.load.audio('sfx_explosion', "assets/audio/sfx_explosion.mp3");
        this.game.load.bitmapFont('PT Mono', 'assets/fonts/ptmono.png', 'assets/fonts/ptmono.xml');
    };
    PlayState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.autoCheck = document.getElementById("autospawn");
        this.levelData = this.game.cache.getJSON('levelData');
        new SpaceBackground(this);
        new SpaceForeground(this, "01.png", 1.5);
        this.weaponsLayer = new Phaser.Group(this.game);
        this.enemyLayer = new Phaser.Group(this.game);
        this.heroLayer = new Phaser.Group(this.game);
        new SpaceForeground(this, "02.png", 3);
        this.foregroundLayer = new Phaser.Group(this.game);
        this.enemyCollider = new Phaser.Sprite(this.game, 0, Game.globalHeight + (Enemy.offsetHeight / 2));
        this.physics.enable(this.enemyCollider, Phaser.Physics.ARCADE);
        this.enemyCollider.body.setSize(Game.globalWidth * 2, 10, 0, 0);
        this.enemyCollider.x = -Game.globalWidth / 2;
        this.enemyLayer.add(this.enemyCollider);
        console.log("DATA OK:", this.levelData);
        this.hero = new HeroShip(this);
        this.heroLayer.add(this.hero);
        this.initTime = this.game.time.now;
        this.hero.init();
        // this.enemy=new Enemy(this,0,"enemy_01"),
        // this.enemyLayer.addChild(this.enemy);
        // this.enemy.init();
        // let e=new Enemy01(this,1);
        // this.enemyLayer.addChild(e);
        // e.init();
        this.interfase = new DisplayInterfase(this);
        this.foregroundLayer.add(this.interfase);
    };
    PlayState.prototype.spawn = function () {
        var textureSelect = document.getElementById("texture");
        console.log(textureSelect.value);
        var bullets = document.getElementById("bulletcount");
        var charger = document.getElementById("chargersize");
        var reload = document.getElementById("reload");
        var damage = document.getElementById("damage");
        var firerate = document.getElementById("firerate");
        var aitype = document.getElementById("aitype");
        var acceleration = document.getElementById("acceleration");
        var score = document.getElementById("score");
        console.log("AI", parseInt(aitype.value));
        var e = new Enemy(this, textureSelect.value, parseInt(aitype.value), parseInt(acceleration.value), parseInt(score.value));
        e.addWeapon(new EnemyWeapon(e, "enemy_fire_bullet", parseInt(firerate.value), parseInt(bullets.value), parseInt(charger.value), parseInt(reload.value), parseInt(damage.value)));
        this.enemyLayer.addChild(e);
        e.init();
    };
    PlayState.prototype.getTime = function () {
        this.clock++;
        return this.game.time.now - this.initTime;
    };
    PlayState.prototype.setupControls = function () {
    };
    PlayState.prototype.update = function () {
        this.clock++;
        // if(this.levelData.timeline[this.clock]){
        // 	switch(this.levelData.timeline[this.clock].event){
        // 		case 0:
        // 			this.spawnScriptedEnemey(this.levelData.timeline[this.clock]);
        // 			break;
        // 	}
        // }
        //this.game.physics.arcade.collide(this.bodys);
        if (this.autoCheck.checked)
            this.spawner();
    };
    PlayState.prototype.spawnScriptedEnemey = function (data) {
        var e = new Enemy(this, data.texture, data.type, data.acceleration, data.scoreValue);
        new EnemyWeapon(e, "enemy_fire_bullet", data.fireRate, data.bulletsCount, data.fireLimit, data.reloadTime, data.weaponDamege);
        this.enemyLayer.addChild(e);
        e.init();
    };
    PlayState.prototype.spawner = function () {
        if ((this.clock % 100) == 0) {
            var texture = Enemy.TEXTURES[Phaser.Math.between(0, Enemy.TEXTURES.length - 1)];
            var type = Enemy.AIs[Phaser.Math.between(0, Enemy.AIs.length - 1)];
            var enemy = new Enemy(this, texture, type);
            new EnemyWeapon(enemy, "enemy_fire_bullet");
            this.enemyLayer.addChild(enemy);
            enemy.init();
        }
    };
    PlayState.prototype.collisionHandler = function () {
        console.log("COLLISION at play state");
    };
    PlayState.prototype.onHeroKilled = function () {
        this.lifes--;
        if (this.lifes >= 0) {
            this.interfase.updateLifes();
            this.hero.reSpawn();
        }
        else {
            this.game.state.start("GameOverState");
        }
    };
    PlayState.prototype.render = function () {
        this.game.debug.text("FPS:" + this.game.time.fps.toString(), 2, 14, "#00ff00");
        this.game.debug.text("CLOCK:" + this.clock, 2, 30, "#00ff00");
        // this.game.debug.pointer(this.game.input.mousePointer);
        // this.game.debug.pointer(this.game.input.pointer1);
        //   	this.game.debug.pointer(this.game.input.pointer2);
        //this.game.debug.body(this.enemyCollider);
        //this.game.debug.body(this.enemy1.shipBody);
        //this.game.debug.body(this.enemy2.shipBody);
        //this.game.debug.bodyInfo(this.hero.shipBody,10,10);
    };
    PlayState.prototype.goFullScreen = function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        }
        else {
            this.game.scale.startFullScreen(false);
        }
    };
    return PlayState;
}(LoadableState));
function extend(first, second) {
    var result = {};
    for (var id in first) {
        result[id] = first[id];
    }
    for (var id in second) {
        if (!result.hasOwnProperty(id)) {
            result[id] = second[id];
        }
    }
    return result;
}
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Test.prototype.preload = function () {
        this.load.image('hero_fire_bullet', 'assets/img/enemy_fire_bullet.png');
    };
    Test.prototype.create = function () {
        this.game.physics.arcade.gravity.y = 0;
        var SECOND = 1000;
        var BURST_LIFESPAN = 1.9 * SECOND;
        var BURST_QUANTITY = 500;
        var RED = 'rgba(255,0,0,0.5)';
        var ROCKET_INTERVAL = 1 * SECOND;
        var ROCKET_LIFESPAN = 1 * SECOND;
        var ROCKET_QUANTITY = 1;
        var bounds = this.world.bounds;
        this.rocketLauncher = new Phaser.Particles.Arcade.Emitter(this.game, bounds.centerX, bounds.centerY, 1000);
        this.rocketLauncher.name = "rockets";
        this.rocketLauncher.gravity = 0;
        this.rocketLauncher.minParticleScale = 1;
        this.rocketLauncher.maxParticleScale = 1;
        this.rocketLauncher.setRotation(0, 0);
        this.rocketLauncher.setXSpeed(-500, 500);
        this.rocketLauncher.setYSpeed(-500, 500);
        this.rocketLauncher.makeParticles('hero_fire_bullet');
        this.rocketLauncher.explode(1000, 100);
    };
    Test.prototype.update = function () {
    };
    return Test;
}(Phaser.State));
var KeyInput = (function () {
    function KeyInput() {
    }
    return KeyInput;
}());
var PadControls = (function () {
    function PadControls(game) {
        this.game = game;
        this.direction = new Phaser.Point(0, 0);
        this.keys = game.input.keyboard.createCursorKeys();
    }
    PadControls.prototype.getDescription = function () {
        return this.currentDesctiption;
    };
    PadControls.prototype.get = function () {
        return this.direction;
    };
    PadControls.prototype.update = function (hero) {
        if (this.keys.left.isDown && !this.keys.right.isDown) {
            this.currentDesctiption = "left";
            this.direction.x = -1;
            //this.shipBody.body.acceleration.x=-this.acceleration;
        }
        else if (this.keys.right.isDown && !this.keys.left.isDown) {
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
        this.processPointer(this.game.input.mousePointer, hero);
        if (this.game.input.pointer1.isDown && !this.game.input.pointer2.isDown) {
            this.processPointer(this.game.input.pointer1, hero);
        }
        if (this.game.input.pointer2.isDown && !this.game.input.pointer1.isDown) {
            this.processPointer(this.game.input.pointer2, hero);
        }
    };
    PadControls.prototype.processPointer = function (pointer, hero) {
        if (pointer.isDown) {
            if (pointer.worldY > hero.getY()) {
                this.currentDesctiption = "up";
                this.direction.y = 1;
            }
            else if (pointer.worldY < hero.getY()) {
                this.currentDesctiption = "down";
                this.direction.y = -1;
            }
        }
        if (pointer.isDown) {
            if (pointer.worldX > hero.getX()) {
                this.currentDesctiption = "right";
                this.direction.x = 1;
            }
            else if (pointer.worldX < hero.getX()) {
                this.currentDesctiption = "left";
                this.direction.x = -1;
            }
        }
    };
    return PadControls;
}());
//# sourceMappingURL=main.js.map