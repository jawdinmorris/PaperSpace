function collision(obj1, obj2) {
    return distance_between(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance_between(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}
var bombSound = new Audio('bomb.wav');
var laserSound = new Audio('laser.wav')
var shipCollisionSound = new Audio('shipCollision.wav')
var plopSound = new Audio('plop.mp3')

var AsteroidsGame = function (id) {
    this.canvas = document.getElementById(id);
    this.c = this.canvas.getContext("2d");
    this.canvas.focus();
    this.guide = false;
    this.ship_mass = 20;
    this.ship_radius = 30;
    this.asteroid_mass = 15000; // Mass of asteroids
    this.asteroid_push = 10000000; // max force to apply in one frame
    this.mass_destroyed = 500;
    this.health_indicator = new Indicator("health", 400, 500, 100, 15);
    this.reload_indicator = new IncrementingIndicator("shoot", 400, 530, 100, 15)
    this.bomb_reload_indicator = new IncrementingIndicator("bomb", 400, 560, 100, 15)
    this.level_progress_indicator = new Indicator("", this.canvas.width / 2 - 50, 30, 100, 10)

    this.score_indicator = new NumberIndicator("score", this.canvas.width - 60, 15);
    this.fps_indicator = new NumberIndicator("fps",
        this.canvas.width - 10, this.canvas.height - 15, {
            digits: 2
        }
    );
    this.level_indicator = new NumberIndicator("level", this.canvas.width / 2, 10, {
        align: "center"
    });
    this.message = new Message(this.canvas.width / 2, this.canvas.height * 0.4);
    this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
    this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
    this.reset_game();
}

AsteroidsGame.prototype.reset_game = function () {
    this.game_over = false;
    this.score = 0;
    this.baseScore = 0;
    this.level = 1;
    this.ship = new Ship(
        this.ship_mass,
        this.ship_radius,
        this.canvas.width / 2,
        this.canvas.height / 2,
        100, 100
    );
    this.projectiles = [];
    this.bombs = [];
    this.asteroids = [];
    this.powerups = [];

    this.asteroids.push(this.moving_asteroid());


}
AsteroidsGame.prototype.new_powerup = function (x, y, type) {
    return new Powerup(type, .001, 100, x, y, 0, 0, 0)
}

AsteroidsGame.prototype.moving_asteroid = function (elapsed) {
    var asteroid = this.new_asteroid();
    this.push_asteroid(asteroid, elapsed);
    return asteroid;
}

AsteroidsGame.prototype.new_asteroid = function () {
    return new Asteroid(
        this.asteroid_mass,
        this.canvas.width * Math.random(),
        this.canvas.height * Math.random()
    );
}


AsteroidsGame.prototype.push_asteroid = function (asteroid, elapsed) {
    elapsed = elapsed || 0.015;
    asteroid.push(2 * Math.PI * Math.random(), this.asteroid_push, elapsed);
    asteroid.twist(
        (Math.random() - 0.5) * Math.PI * this.asteroid_push * 0.02,
        elapsed
    );
}

AsteroidsGame.prototype.keyDown = function (e) {
    this.key_handler(e, true);
}
AsteroidsGame.prototype.keyUp = function (e) {
    this.key_handler(e, false);
}

AsteroidsGame.prototype.key_handler = function (e, value) {
    var nothing_handled = false;
    switch (e.key || e.keyCode) {
        case "ArrowLeft":
        case 37: // left arrow
            this.ship.left_thruster = value;
            break;
        case "ArrowUp":
        case 38: // up arrow
            this.ship.thruster_on = value;
            break;
        case "ArrowRight":
        case 39: // right arrow
            this.ship.right_thruster = value;
            break;
        case "ArrowDown":
        case 40:
            this.ship.retro_thruster = value;
            break;
        case " ":
        case 32: //spacebar
            this.ship.trigger = value;
            break;
        case "r":
        case 82: // r for reset
            if (this.game_over) {
                this.reset_game();
                break;
            } else {
                break;
            }
            break;
        case "b":
        case 66: // b for bomb
            this.ship.bombTrigger = value;
            break;
        case "g":
        case 71: // g for guide
            if (value) this.guide = !this.guide;
            break;
        default:
            nothing_handled = true;
    }
    if (!nothing_handled) e.preventDefault();
}

AsteroidsGame.prototype.frame = function (timestamp) {
    if (!this.previous) this.previous = timestamp;
    var elapsed = timestamp - this.previous;
    this.fps = 1000 / elapsed;
    this.update(elapsed / 1000);
    this.draw();
    this.previous = timestamp;
    window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.update = function (elapsed) {
    if (this.asteroids.length == 0) {
        this.level_up();
    }
    this.ship.compromised = false;
    this.asteroids.forEach(function (asteroid) {
        asteroid.update(elapsed, this.c);
        if (collision(asteroid, this.ship)) {
            this.ship.compromised = true;
            if (!this.game_over) {
                shipCollisionSound.play();
            }
        }
    }, this);
    if (this.ship.health <= 0) {
        this.game_over = true;
        return;
    }
    this.ship.update(elapsed, this.c);

    this.projectiles.forEach(function (p, i, projectiles) {
        p.update(elapsed, this.c);
        if (p.life <= 0) {
            projectiles.splice(i, 1);
        } else {
            this.asteroids.forEach(function (asteroid, j) {
                if (collision(asteroid, p)) {
                    projectiles.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    this.split_asteroid(asteroid, elapsed);
                    plopSound.play()
                }
            }, this);
        }
    }, this);

    this.bombs.forEach(function (b, i, bombs) {
        b.update(elapsed, this.c);
        if (b.life <= 0) {
            bombs.splice(i, 1);
        } else {
            this.asteroids.forEach(function (asteroid, j) {
                if (collision(asteroid, b)) {
                    bombs.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    this.split_asteroid(asteroid, elapsed);
                    plopSound.play();
                }
            }, this);
        }
    }, this);

    this.powerups.forEach(function (p, i, powerups) {
        p.update(elapsed, this.c);
        if (p.life <= 0) {
            powerups.splice(i, 1);
        } else {
            if (collision(this.ship, p)) {
                powerups.splice(i, 1);
                if (p.type == "doubleBullets") {
                    this.ship.powerup_status = true;
                    setTimeout(function () {
                        game.ship.powerup_status = false
                    }, 3000);
                } else if (p.type == "health") {
                    this.ship.health = this.ship.max_health;
                }
            }
        }
    }, this);

    if (this.ship.trigger && this.ship.loaded) {
        this.projectiles.push(this.ship.projectile(elapsed, 0.0005));
    }
    if (this.ship.bombTrigger && this.ship.bomb_loaded) {
        this.bombs.push(this.ship.bomb(elapsed, 0.02));
    }
}

AsteroidsGame.prototype.draw = function () {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw_background(this.c)
    this.score_indicator.draw(this.c, this.score);
    this.level_indicator.draw(this.c, this.level);
    this.health_indicator.draw(this.c, this.ship.health, this.ship.max_health);
    this.reload_indicator.draw(this.c, this.ship.time_until_reloaded, this.ship.weapon_reload_time);
    this.bomb_reload_indicator.draw(this.c, this.ship.time_until_bomb_reloaded, this.ship.bomb_reload_time);
    this.level_progress_indicator.draw(this.c, this.score - this.baseScore, (this.level * this.asteroid_mass));
    if (this.guide) {
        draw_grid(this.c);
        this.asteroids.forEach(function (asteroid) {
            draw_line(this.c, asteroid, this.ship);
            this.projectiles.forEach(function (p) {
                draw_line(this.c, asteroid, p);
            }, this);
        }, this);
        this.fps_indicator.draw(this.c, this.fps);
    }
    this.asteroids.forEach(function (asteroid) {
        asteroid.draw(this.c, this.guide);
    }, this);


    if (this.game_over) {
        this.message.draw(this.c, "GAME OVER", "Press R to Reset");
        return;
    }
    this.projectiles.forEach(function (p) {
        p.draw(this.c);
    }, this);
    this.bombs.forEach(function (b) {
        b.draw(this.c);
    }, this);
    this.powerups.forEach(function (po) {
        po.draw(this.c);
    }, this);
    this.ship.draw(this.c, this.guide);




}

AsteroidsGame.prototype.split_asteroid = function (asteroid, elapsed) {
    asteroid.mass -= this.mass_destroyed;
    this.score += this.mass_destroyed;
    var split = 0.25 + 0.5 * Math.random(); // split unevenly
    var ch1 = asteroid.child(asteroid.mass * split);
    var ch2 = asteroid.child(asteroid.mass * (1 - split));
    [ch1, ch2].forEach(function (child) {
        if (child.mass < this.mass_destroyed * 2) {
            this.score += child.mass;

            if (Math.random() > .95) {
                this.drop_powerup(child.x, child.y, "health");
            } else if (Math.random() > .90) {
                this.drop_powerup(child.x, child.y, "doubleBullets");
            }
        } else {
            this.push_asteroid(child, elapsed);
            this.asteroids.push(child);
        }
    }, this);
}

AsteroidsGame.prototype.level_up = function () {
    this.level += 1;
    this.baseScore = this.score;
    for (var i = 0; i < this.level; i++) {
        this.asteroids.push(this.moving_asteroid());
    }
}

AsteroidsGame.prototype.drop_powerup = function (x, y, type) {
    var powerup = this.new_powerup(x, y, type);
    this.powerups.push(powerup);
}