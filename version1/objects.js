let f = new FontFace('test', 'url(https://fonts.googleapis.com/css?family=Indie+Flower&display=swap)');

f.load().then(function () {
    // Ready to use the font in a canvas context
    console.log("font loaded");
});

function extend(ChildClass, ParentClass) {
    var parent = new ParentClass();
    ChildClass.prototype = parent;
    ChildClass.prototype.super = parent.constructor;
    ChildClass.prototype.constructor = ChildClass;
}


function Mass(mass, radius, x, y, angle, x_speed, y_speed, rotation_speed) {
    this.mass = mass || 1;
    this.radius = radius;
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.x_speed = x_speed || 0;
    this.y_speed = y_speed || 0;
    this.rotation_speed = rotation_speed || 0;
}

Mass.prototype.update = function (elapsed, c) {
    this.x += this.x_speed * elapsed;
    this.y += this.y_speed * elapsed;
    this.angle += this.rotation_speed * elapsed;
    this.angle %= (2 * Math.PI);
    if (this.x - this.radius > c.canvas.width) {
        this.x = -this.radius;
    }
    if (this.x + this.radius < 0) {
        this.x = c.canvas.width + this.radius;
    }
    if (this.y - this.radius > c.canvas.height) {
        this.y = -this.radius;
    }
    if (this.y + this.radius < 0) {
        this.y = c.canvas.height + this.radius;
    }
}

Mass.prototype.draw = function (c) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    c.beginPath();
    c.arc(0, 0, this.radius, 0, 2 * Math.PI);
    c.lineTo(0, 0);
    c.strokeStyle = "#FFFFFF";
    c.stroke();
    c.restore();
}

Mass.prototype.push = function (angle, force, elapsed) {
    this.x_speed += elapsed * (Math.cos(angle) * force) / this.mass;
    this.y_speed += elapsed * (Math.sin(angle) * force) / this.mass;
}

Mass.prototype.twist = function (force, elapsed) {
    this.rotation_speed += elapsed * force / this.mass;
}

Mass.prototype.speed = function () {
    return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
}

Mass.prototype.movement_angle = function () {
    return Math.atan2(this.y_speed, this.x_speed);
}

function Asteroid(mass, x, y, x_speed, y_speed, rotation_speed) {
    var density = 1; // kg per square pixel
    var radius = Math.sqrt((mass / density) / Math.PI);
    this.super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.ceil(this.circumference / 15);
    this.segments = Math.min(25, Math.max(5, this.segments));
    this.noise = 0.2;
    this.shape = [];
    for (var i = 0; i < this.segments; i++) {
        this.shape.push(2 * (Math.random() - 0.5));
    }
}
extend(Asteroid, Mass);

Asteroid.prototype.draw = function (c, guide) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    draw_asteroid(c, this.radius, this.shape, {
        noise: this.noise,
        guide: guide,
        blur: 20
    });
    c.restore();
}

Asteroid.prototype.child = function (mass) {
    return new Asteroid(
        mass, this.x, this.y, this.x_speed, this.y_speed, this.rotation_speed
    )
}

function Ship(x, y, power, weapon_power) {
    this.thruster_power = power * 10;
    this.steering_power = this.thruster_power / 20;
    this.max_steer = 100;
    this.right_thruster = false;
    this.left_thruster = false;
    this.thruster_on = false;
    this.retro_thruster = false;
    this.weapon_power = weapon_power / 20;
    this.loaded = false;
    this.weapon_reload_time = 0.25; // seconds 
    this.time_until_reloaded = this.weapon_reload_time;
    this.compromised = false;
    this.max_health = 2.0;
    this.health = this.max_health;
    this.bombTrigger = false;
    this.bomb_loaded = false;
    this.bomb_reload_time = 2.0; // seconds 
    this.time_until_bomb_reloaded = this.bomb_reload_time;
    this.super(x, y, 300, 300, 1.5 * Math.PI);
    this.powerup_status = false;
}

extend(Ship, Mass);

Ship.prototype.update = function (elapsed, c) {
    if (this.rotation_speed < 100) {
        this.push(this.angle,
            this.thruster_on * this.thruster_power, elapsed);
    }
    this.push(-this.angle,
        this.retro_thruster * this.thruster_power, elapsed);
    if ((this.rotation_speed >= -10 && this.rotation_speed <= 10)) {
        this.twist(
            (this.right_thruster - this.left_thruster) * this.steering_power, elapsed
        );
    } else if (this.rotation_speed < -10) {
        this.rotation_speed = this.rotation_speed + 1;
    } else if (this.rotation_speed > 10) {
        this.rotation_speed = this.rotation_speed - 1;
    }
    this.loaded = this.time_until_reloaded === 0;
    if (!this.loaded) {
        this.time_until_reloaded -= Math.min(elapsed, this.time_until_reloaded);
    }

    this.bomb_loaded = this.time_until_bomb_reloaded === 0;
    if (!this.bomb_loaded) {
        this.time_until_bomb_reloaded -= Math.min(elapsed, this.time_until_bomb_reloaded);
    }

    if (this.compromised) {
        this.health -= Math.min(elapsed, this.health);
    }
    Mass.prototype.update.apply(this, arguments);
}

Ship.prototype.draw = function (c, guide) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    if (guide && this.compromised) {
        c.save();
        c.fillStyle = "red";
        c.beginPath();
        c.arc(0, 0, this.radius, 0, 2 * Math.PI);
        c.fill();
        c.restore();
    }
    draw_ship(c, this.radius, {
        guide: guide,
        thruster: this.thruster_on
    });
    c.restore();
}

Ship.prototype.projectile = function (elapsed, density) {
    if (!mute) {
        laserSound.play();
    }
    var p = new Projectile(density, 1,
        this.x + Math.cos(this.angle) * this.radius * 1.5,
        this.y + Math.sin(this.angle) * this.radius * 1.5,
        this.x_speed,
        this.y_speed,
        this.rotation_speed);
    if (this.time_until_bomb_reloaded == 0) {
        p.x_speed = p.x_speed / 10;
        p.y_speed = p.y_speed / 10;
        p.lifetime = 1;
    }
    p.push(this.angle, this.weapon_power, elapsed);
    this.push(this.angle + Math.PI, this.weapon_power, elapsed);
    this.time_until_reloaded = this.weapon_reload_time;
    if (this.powerup_status == true) {
        this.time_until_reloaded = this.weapon_reload_time / 4;
    }
    return p;
}

Ship.prototype.bomb = function (elapsed, density) {
    if (!mute) {
        bombSound.play();
    }
    var b = new Bomb(density, 1,
        this.x + Math.cos(this.angle) * this.radius,
        this.y + Math.sin(this.angle) * this.radius,
        this.x_speed,
        this.y_speed,
        this.rotation_speed);

    b.x_speed = b.x_speed / 10;
    b.y_speed = b.y_speed / 10;
    b.lifetime = 2;
    b.push(this.angle, this.weapon_power, elapsed);
    this.push(this.angle + Math.PI, this.weapon_power, elapsed);
    this.time_until_bomb_reloaded = this.bomb_reload_time;
    return b;
}

function Bomb(mass, lifetime, x, y, x_speed, y_speed, rotation_speed) {
    var density = 0.000005; // low density means we can see very light projectiles
    var radius = Math.sqrt((mass / density) / Math.PI);
    this.super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
    this.lifetime = 5;
    this.life = 1.0;
}
extend(Bomb, Mass);

Bomb.prototype.update = function (elapsed, c) {
    this.life -= (elapsed / this.lifetime);
    Mass.prototype.update.apply(this, arguments);
}

Bomb.prototype.draw = function (c, guide) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    draw_bomb(c, this.radius, this.life, guide, {
        noise: this.noise,
        guide: guide
    });
    c.restore();
}

function Powerup(type, mass, lifetime, x, y, x_speed, y_speed, rotation_speed) {
    var density = 0.000005; // low density means we can see very light projectiles
    var radius = Math.sqrt((mass / density) / Math.PI * 3);
    this.super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
    this.lifetime = 5;
    this.life = 1.0;
    this.type = type;
}
extend(Powerup, Mass);

Powerup.prototype.update = function (elapsed, c) {
    this.life -= (elapsed / this.lifetime);
    Mass.prototype.update.apply(this, arguments);
}

Powerup.prototype.draw = function (c, guide) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    if (this.type == "doubleBullets") {
        draw_bullet_powerup(c, this.radius, this.life, guide, {
            noise: this.noise,
            guide: guide,
        });
    } else {
        draw_health_powerup(c, this.radius, this.life, guide, {
            noise: this.noise,
            guide: guide,
        });
    }
    c.restore();
}

function Projectile(mass, lifetime, x, y, x_speed, y_speed, rotation_speed) {
    var density = 0.000001; // low density means we can see very light projectiles
    var radius = Math.sqrt((mass / density) / Math.PI);
    this.super(mass, radius, x, y, 0, x_speed, y_speed, rotation_speed);
    this.lifetime = lifetime;
    this.life = 1.0;
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.ceil(this.circumference / 15);
    this.segments = Math.min(25, Math.max(5, this.segments));
    this.noise = 0.3;
    this.shape = [];
    for (var i = 0; i < this.segments; i++) {
        this.shape.push(2 * (Math.random() - 0.5));
    }
}
extend(Projectile, Mass);

Projectile.prototype.update = function (elapsed, c) {
    this.life -= (elapsed / this.lifetime);
    Mass.prototype.update.apply(this, arguments);
}

Projectile.prototype.draw = function (c, guide) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    draw_projectile(c, this.radius, this.life, guide);
    c.restore();
}

function Indicator(label, x, y, width, height) {
    this.label = label + " ";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Indicator.prototype.draw = function (c, max, level) {
    const rc = rough.canvas(document.getElementById('asteroids'));

    c.save();
    c.strokeStyle = "black";
    c.fillStyle = "black";
    c.font = this.height * 1.5 + "pt Indie Flower";
    var offset = c.measureText(this.label).width;
    c.fillText(this.label, this.x, this.y + this.height - 1);
    c.beginPath();
    // c.rect(offset + this.x, this.y, this.width, this.height);
    rc.rectangle(offset + this.x, this.y, this.width, this.height, {
        roughness: 1,
        fill: "black",
        fillStyle: "solid",
        fillWeight: 3,
        hachureAngle: 60, // angle of hachure,
        hachureGap: 8
    })
    c.stroke();
    c.beginPath();
    c.rect(offset + this.x, this.y, this.width * (max / level), this.height);
    rc.rectangle(offset + this.x, this.y, this.width * (max / level), this.height, {
        roughness: 2,
        fillStyle: "solid",
        fill: "red",
        stroke: "red"
    })

    c.fill();
    c.restore()
}

function IncrementingIndicator(label, x, y, width, height) {
    this.label = label + ": ";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

IncrementingIndicator.prototype.draw = function (c, max, level) {
    const rc = rough.canvas(document.getElementById('asteroids'));

    c.save();
    c.strokeStyle = "black";
    c.fillStyle = "black";
    c.font = this.height * 1.5 + "pt Indie Flower";
    var offset = c.measureText(this.label).width;
    c.fillText(this.label, this.x, this.y + this.height - 1);
    c.beginPath();
    // c.rect(offset + this.x, this.y, this.width, this.height);
    rc.rectangle(offset + this.x, this.y, this.width, this.height, {
        roughness: 1,
        fill: "red",
        fillStyle: "solid",
        fillWeight: 3,
        hachureAngle: 60, // angle of hachure,
        hachureGap: 8
    })
    c.stroke();
    c.beginPath();
    c.rect(offset + this.x, this.y, this.width * (max / level), this.height);
    rc.rectangle(offset + this.x + this.width, this.y, this.width / (-level / max), this.height, {
        roughness: 2,
        fill: "black",
        fillStyle: 'solid',
        stroke: "red"
    })
    c.fill();
    c.restore()
}

function NumberIndicator(label, x, y, options) {
    options = options || {}
    this.label = label + ": ";
    this.x = x;
    this.y = y;
    this.digits = options.digits || 0;
    this.pt = options.pt || 10;
    this.align = options.align || 'end';
}

NumberIndicator.prototype.draw = function (c, value) {
    c.save();
    c.fillStyle = "black";
    c.font = 20 + "pt Indie Flower";
    c.textAlign = this.align;
    c.fillText(
        this.label + value.toFixed(this.digits),
        this.x, this.y + this.pt - 1);
    c.restore();
}

function Message(x, y, options) {
    options = options || {};
    this.x = x;
    this.y = y;
    this.main_pt = options.main_pt || 28;
    this.sub_pt = options.sub_pt || 18;
    this.fill = options.fill || "black";
    this.textAlign = options.align || 'center';
}
Message.prototype.draw = function (c, main, sub) {
    c.save();
    c.fillStyle = this.fill;
    c.textAlign = this.textAlign;
    c.font = this.main_pt + "pt Indie Flower";
    c.fillText(main, this.x, this.y);
    c.font = this.sub_pt + "pt Indie Flower";
    c.fillText(sub, this.x, this.y + this.main_pt);
    c.restore();
}