function draw_grid(ctx, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || "#00FF00";
    fill = fill || "#009900";

    ctx.save();

    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    let width = ctx.canvas.width,
        height = ctx.canvas.height

    for (var x = 0; x < width; x += minor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (x % major == 0) {
            ctx.fillText(x, x, 10);
        }
    }

    for (var y = 0; y < height; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if (y % major == 0) {
            ctx.fillText(y, 0, y + 10);
        }
    }

    ctx.restore();
}

function draw_ship(ctx, radius, options) {
    options = options || {};

    let angle = (options.angle || 0.5 * Math.PI) / 2;
    let curve1 = options.curve1 || 0.25;
    let curve2 = options.curve2 || 0.75;

    ctx.save();

    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    if (options.thruster) {
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(Math.PI + angle * 0.8) * radius / 2,
            Math.sin(Math.PI + angle * 0.8) * radius / 2
        )
        ctx.quadraticCurveTo(-radius * 2, 0,
            Math.cos(Math.PI - angle * 0.8) * radius / 2,
            Math.sin(Math.PI - angle * 0.8) * radius / 2
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curve2,
        Math.sin(angle) * radius * curve2,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    );
    ctx.quadraticCurveTo(-radius * curve1, 0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    );
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curve2,
        Math.sin(-angle) * radius * curve2,
        radius, 0
    );

    ctx.fill();
    ctx.stroke();

    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
        ctx.moveTo(-radius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            Math.cos(angle) * radius * curve2,
            Math.sin(angle) * radius * curve2,
            radius / 40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            Math.cos(-angle) * radius * curve2,
            Math.sin(-angle) * radius * curve2,
            radius / 40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(radius * curve1 - radius, 0, radius / 50, 0, 2 *
            Math.PI);
        ctx.fill();
    }

    ctx.restore();
}

function draw_asteroid(ctx, radius, shape, options) {
    options = options || {};
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    noise = options.noise
    ctx.save();

    ctx.beginPath();
    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * noise * shape[i], 0);
    }
    ctx.closePath();
    ctx.fillStyle = "rgb(" + ((255 * radius) % 120) + "%," + ((100 * radius) % 255) + "%," + ((100 * radius) % 50) + "%)";
    ctx.fill();
    ctx.strokeStyle = "black"
    ctx.stroke();
    if (options.guide) {
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 0.2;
        ctx.arc(0, 0, radius + radius * options.noise, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius - radius * options.noise, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();


}

function draw_projectile(ctx, radius, lifetime, options) {
    options = options || {};
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "rgb(100%, 100%," + (100 * lifetime) + "%)";
    ctx.strokeStyle = "blue";
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    if (options.guide) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();

}

function draw_bomb(ctx, radius, lifetime, options) {
    options = options || {};
    ctx.save();
    ctx.beginPath();
    this.shape = [];
    this.segments = 20;
    for (var i = 0; i < this.segments; i++) {
        this.shape.push(2 * (Math.random() - 0.5));
    }
    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * 0.7 * shape[i], 0);
    }
    ctx.closePath();

    ctx.fillStyle = "rgb(100%, 30%, 30%)";
    ctx.fill();
    ctx.strokeStyle = "black"
    ctx.stroke();

    ctx.restore();
}

function draw_star_shape(ctx, cx, cy, spikes, innerRadius, outerRadius, stroke, fill) {
    ctx.save();
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = stroke
    ctx.fillStyle = fill;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

function draw_bullet_powerup(ctx, radius, lifetime) {
    // // variables used to draw & animate the ring
    // var PI2 = Math.PI * 2;
    // var ringX, ringY, ringRadius, ingCounter, ringCounterVelocity;
    // ringX = 0;
    // ringY = 0;
    // ringRadius = radius;
    // ringCounter = lifetime * 150;
    // ringCounterVelocity = 0.5;
    // if (ringCounter < 200) {
    //     // expand the ring using easeInCubic easing
    //     ringRadius = easeInCubic(ringCounter, 0, 15, 100);
    // } else {
    //     // shrink the ring using easeOutCubic easing
    //     ringRadius = easeOutCubic(ringCounter - 100, 15, -15, 100);

    // }
    // ctx.save();
    // // set the context styles
    // ctx.lineWidth = 3;

    // ctx.beginPath();
    // ctx.arc(ringX, ringY, ringRadius, 0, PI2);
    // ctx.closePath();
    // ctx.fill()
    // ctx.stroke();
    // ctx.restore();

    draw_star_shape(ctx, 0, 0, 5, 10, 20, "gold", "purple");


}

function draw_health_powerup(ctx, radius, lifetime) {
    // variables used to draw & animate the ring
    ctx.lineWidth = 0;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.save();

    //triangle
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(32.5, 8);
    ctx.quadraticCurveTo(32, 20, 16, 32)
    ctx.quadraticCurveTo(-2, 20, 0, 8)
    ctx.closePath();
    ctx.fill();

    //top left circle
    ctx.beginPath();
    ctx.arc(8, 9, 8, 0, Math.PI * 2, true);
    ctx.closePath()
    ctx.fill();

    //top right circle
    ctx.beginPath();
    ctx.arc(24, 9, 8, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();


    ctx.restore();
}

function draw_line(ctx, obj1, obj2) {
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(obj1.x, obj1.y);
    ctx.lineTo(obj2.x, obj2.y);
    ctx.stroke();
    ctx.restore();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, ctx) {

}


function draw_background(ctx, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || "#308ea2";
    fill = fill || "#009900";
    // if (Math.random() > 0.98) {
    //     minor = 9;
    //     major = minor * 5;
    //     stroke = "green";
    // } else if (Math.random() > 0.99) {
    //     minor = 8;
    //     major = minor * 5;
    //     stroke = "red";
    // }
    ctx.save();
    ctx.fillStyle = '#fffff0';
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = '#d6d6d4';
    for (var i = 0; i < 12; i++) {
        ctx.arc(25, 25 + (i * 50), 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

    }

    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    let width = ctx.canvas.width,
        height = ctx.canvas.height

    // for (var x = 0; x < width; x += minor) {
    //     ctx.beginPath();
    //     ctx.moveTo(x, 0);
    //     ctx.lineTo(x, height);
    //     ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
    //     ctx.stroke();
    // }

    for (var y = 0; y < height; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.lineWidth = (y % major == 0) ? 1 : .5;
        ctx.stroke();

    }

    ctx.restore();
}

//PACMAN
function draw_pacman(ctx, radius, openValue) {
    radius = radius || 150;
    openValue = openValue / 2 - .1 || .2;
    ctx = ctx;
    ctx.beginPath();
    ctx.arc(0, 0, radius, (0 + openValue) * Math.PI, (2 - openValue) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.closePath()
    ctx.stroke();
}

function draw_ghost(ctx, radius, options) {
    options = options || {}
    var feet = options.feet || 4;
    var head_radius = radius * 0.8;
    var foot_radius = head_radius / feet;
    ctx.save();
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "red";
    ctx.lineWidth = options.lineWidth || radius * 0.05;
    ctx.beginPath();
    for (foot = 0; foot < feet; foot++) {
        ctx.arc(
            (2 * foot_radius * (feet - foot)) - head_radius - foot_radius,
            radius - foot_radius,
            foot_radius, 0, Math.PI
        );
    }
    ctx.lineTo(-head_radius, radius - foot_radius);
    ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 *
        Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function easeInCubic(now, startValue, deltaValue, duration) {
    return deltaValue * (now /= duration) * now * now + startValue;
}

function easeOutCubic(now, startValue, deltaValue, duration) {
    return deltaValue * ((now = now / duration - 1) * now * now + 1) + startValue;
}