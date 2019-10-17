function Asteroid(segments, radius, noise) {
    this.x = context.canvas.width * Math.random();
    this.y = context.canvas.height * Math.random();
    this.angle = 0;
    this.x_speed = context.canvas.width * (Math.random() - 0.5);
    this.y_speed = context.canvas.height * (Math.random() - 0.5);
    this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5);
    this.radius = radius;
    this.noise = noise;
    this.shape = [];
    for (let i = 0; i < segments; i++) {
        this.shape.push(Math.random() - 0.5);
    }
}

Asteroid.prototype.update = function (elapsed) {
    if (this.x - this.radius + elapsed * this.x_speed > context.canvas.width) {
        this.x = -this.radius;
    }
    if (this.x + this.radius + elapsed * this.x_speed < 0) {
        this.x = context.canvas.width + this.radius;
    }
    if (this.y - this.radius + elapsed * this.y_speed > context.canvas.height) {
        this.y = -this.radius;
    }
    if (this.y + this.radius + elapsed * this.y_speed < 0) {
        this.y = context.canvas.height + this.radius;
    }
    this.x += elapsed * this.x_speed;
    this.y += elapsed * this.y_speed;
    this.angle = (this.angle + this.rotation_speed * elapsed) %
        (2 * Math.PI);
}

Asteroid.prototype.draw = function (ctx, guide) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    draw_asteroid(ctx, this.radius, this.shape, {
        guide: guide,
        noise: this.noise
    });
    ctx.restore();
}


//PACMAN
function PacMan(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = 0;
    this.x_speed = speed;
    this.y_speed = 0;
    this.time = 0;
    this.mouth = 0;
}

PacMan.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    draw_pacman(ctx, this.radius, this.mouth);
    ctx.restore();
}

PacMan.prototype.turn = function (direction) {
    if (this.y_speed) {
        // if we are travelling vertically
        // set the horizontal speed and apply the direction
        this.x_speed = -direction * this.y_speed;
        // clear the vertical speed and rotate
        this.y_speed = 0;
        this.angle = this.x_speed > 0 ? 0 : Math.PI;
    } else {
        // if we are travelling horizontally
        // set the vertical speed and apply the direction
        this.y_speed = direction * this.x_speed;
        // clear the horizontal speed and rotate
        this.x_speed = 0;
        this.angle = this.y_speed > 0 ? 0.5 * Math.PI : 1.5 * Math.
        PI;
    }
}

PacMan.prototype.turn_left = function () {
    this.turn(-1);
}
PacMan.prototype.turn_right = function () {
    this.turn(1);
}

PacMan.prototype.update = function (elapsed, width, height) {
    this.time += elapsed;
    this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
}

PacMan.prototype.move_right = function () {
    this.x_speed = this.speed;
    this.y_speed = 0;
    this.angle = 0;
}
PacMan.prototype.move_down = function () {
    this.x_speed = 0;
    this.y_speed = this.speed;
    this.angle = 0.5 * Math.PI;
}
PacMan.prototype.move_left = function () {
    this.x_speed = -this.speed;
    this.y_speed = 0;
    this.angle = Math.PI;
}
PacMan.prototype.move_up = function () {
    this.x_speed = 0;
    this.y_speed = -this.speed;
    this.angle = 1.5 * Math.PI;
}

//GHOST
function Ghost(x, y, radius, speed, colour) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.colour = colour;
}

Ghost.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    draw_ghost(ctx, this.radius, {
        fill: this.colour
    });
    ctx.restore();
}

Ghost.prototype.update = function (target, elapsed) {
    var angle = Math.atan2(target.y - this.y, target.x - this.x);
    var x_speed = Math.cos(angle) * this.speed;
    var y_speed = Math.sin(angle) * this.speed;
    this.x += x_speed * elapsed;
    this.y += y_speed * elapsed;
}