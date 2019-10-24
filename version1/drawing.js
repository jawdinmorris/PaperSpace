function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var randomY = []
var randomX = []
for (var i = 0; i < 12; i++) {
    randomY[i] = randomIntFromInterval(100, 500)
    randomX[i] = randomIntFromInterval(100, 500)
}

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
    ctx.shadowInset = true;
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#000";
    options = options || {};

    let angle = (options.angle || 0.5 * Math.PI) / 2;
    let curve1 = options.curve1 || 0.25;
    let curve2 = options.curve2 || 0.75;

    ctx.save();


    if (options.thruster) {
        ctx.save();
        ctx.strokeStyle = "red";
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
        // ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    ctx.lineWidth = options.lineWidth || 3;
    ctx.strokeStyle = options.stroke || "black";
    ctx.fillStyle = options.fill || "red";

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

    // ctx.fill();

    ctx.stroke();
    // draw_rough_ship(radius, ctx);


    ctx.restore();
    // ctx.shadowInset = false;
}

function draw_asteroid(ctx, radius, shape, options) {
    const rc = rough.canvas(document.getElementById('asteroids'));

    options = options || {};
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    noise = options.noise
    ctx.shadowBlur = options.blur
    ctx.save();
    ctx.shadowInset = true;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#000";
    ctx.lineWidth = 1;
    if (radius > 60) {
        rc.ellipse(0, 0, radius * 2.2, radius * 2.2, {
            fillStyle: "zig-zag",
            fill: "rgb(" + ((255 * radius) % 120) + "%," + ((100 * radius) % 255) + "%," + ((100 * radius) % 50) + "%)",
            fillWeight: 1,
            stroke: "rgba(0,0,0,0)"
        });
    } else {
        rc.ellipse(0, 0, radius * 2.2, radius * 1.8, {
            fillStyle: "zig-zag",
            fill: "rgb(" + ((255 * radius) % 120) + "%," + ((100 * radius) % 255) + "%," + ((100 * radius) % 50) + "%)",
            fillWeight: 1,
            stroke: "rgba(0,0,0,0)"
        });
    }
    ctx.beginPath();
    for (let i = 0; i < shape.length; i++) {
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * noise * shape[i], 0);

    }
    ctx.closePath();
    ctx.fillStyle = "rgb(" + ((255 * radius) % 120) + "%," + ((100 * radius) % 255) + "%," + ((100 * radius) % 50) + "%)";
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fill();

    // for (i = -3; i < 3; i++) {
    //     rc.ellipse(radius / i, radius / i, radius / i, radius / i, {
    //         fill: "rgb(10,150,10)",
    //         fillWeight: 3,
    //         stroke: "rgba(0,0,0,0)"
    //     });
    // }


    // draw_rough_circle(radius)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();

    ctx.shadowInset = false;
}

function draw_projectile(ctx, radius, lifetime, options) {
    // options = options || {};
    // ctx.shadowBlur = 0;
    // ctx.shadowInset = true;
    // ctx.shadowColor = "#000";
    // ctx.save();
    // ctx.beginPath();
    // ctx.fillStyle = "rgb(100%, 100%," + (100 * lifetime) + "%)";
    // ctx.strokeStyle = "blue";
    // ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    // ctx.closePath();
    // if (options.guide) {
    //     ctx.strokeStyle = "white";
    //     ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    //     ctx.lineWidth = 0.5;
    //     ctx.beginPath();
    //     ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    //     ctx.stroke();
    //     ctx.fill();
    // }
    // ctx.fill();
    // ctx.stroke();
    // ctx.restore();
    // ctx.shadowInset = false;
    draw_rough_circle(radius * 2);
}

function draw_bomb(ctx, radius, lifetime, options) {
    options = options || {};
    ctx.shadowInset = true;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#000";
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
    ctx.shadowInset = false;
    ctx.restore();
}

function draw_rough_star(ctx, x, y) {

    const rc = rough.canvas(document.getElementById('asteroids'));
    rc.linearPath([
        [0 + x, -15 + y],
        [10 + x, 0 + y],
        [-5 + x, -10 + y],
        [5 + x, -10 + y],
        [-5 + x, 0 + y],
        [0 + x, -15 + y]
    ]);

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
    ctx.save();
    // // set the context styles
    // ctx.lineWidth = 3;

    // ctx.beginPath();
    // ctx.arc(ringX, ringY, ringRadius, 0, PI2);
    // ctx.closePath();
    // ctx.fill()
    // ctx.stroke();
    draw_rough_bullet_upgrade(ctx);
    ctx.restore();



}

function draw_rough_bullet_upgrade(ctx, x, y) {
    const rc = rough.canvas(document.getElementById('asteroids'));
    var x = 50;
    var y = 160;
    var points = [
        [50 - x, 160 - y],
        [55 - x, 180 - y],
        [70 - x, 180 - y],
        [60 - x, 190 - y],
        [65 - x, 205 - y],
        [50 - x, 195 - y],
        [35 - x, 205 - y],
        [40 - x, 190 - y],
        [30 - x, 180 - y],
        [45 - x, 180 - y],
        [50 - x, 160 - y]
    ];
    // for (let i = 0; i < 20; i++) {
    //     let x = (400 / 20) * i + 10;
    //     let xdeg = (Math.PI / 100) * x;
    //     let y = Math.round(Math.sin(xdeg) * 90) + 500;
    //     points.push([x, y]);
    // }

    rc.curve(points, {
        stroke: 'purple',
        strokeWidth: 2,
        fill: 'black',
        fillStyle: 'solid'
    });
}

function draw_rough_heart(ctx, x, y) {
    const rc = rough.canvas(document.getElementById('asteroids'));
    // var x = 0;
    // var y = 0;
    // var points = [
    //     [0 + x, 0 + y],
    //     [8 + x, -20 + y],
    //     [16 + x, -16 + y],
    //     [24 + x, -4 + y],
    //     [20 + x, 16 + y],
    //     [0 + x, 32 + y],
    //     [-20 + x, 16 + y],
    //     [-24 + x, -4 + y],
    //     [-16 + x, -16 + y],
    //     [-8 + x, -20 + y],
    //     [0 + x, 0 + y]
    // ];
    var points = draw_heart_equation(ctx, x, y);
    rc.curve(points, {
        stroke: 'red',
        strokeWidth: 2,
        fill: 'black',
        fillStyle: 'solid'
    });


}

function draw_heart_equation(ctx, x2, y2) {
    var context = ctx;
    // var i = 0;
    // var j = 0.1
    var t = 0;
    var points = [];
    for (var i = 0; i < 6.5; i = i + 0.1) {
        t = t + 1;
        // i = i + j;
        if (t > 5) {
            t = 0;
        }
        var r = Math.pow(10000 * Math.cos(2 * i), 0.5);
        var x = (160 * Math.sin(i) * Math.sin(i) * Math.sin(i)) * 0.2;
        var y = (-(10 * (13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i))) * 0.2);
        // context.font = "40px Georgia";
        // context.textAlign = 'center';
        // context.fillText('.', x, y);
        // context.fillStyle = 'purple';
        // context.beginPath();
        // context.moveTo(250, 200);
        // context.lineTo(x, y);
        // context.lineCap = 'round';
        // context.strokeStyle = 'rgba(0,0,255,0.6)';
        // context.stroke();
        // context.beginPath();
        // context.moveTo(250, 200);
        // context.arc(x, y, 8, 0, 2 * Math.PI);
        // context.fillStyle = "red";
        // context.fill();
        points.push([x, y]);
        if (i > 6.5) {
            j = -0.1;
            context.clearRect(0, 0, 500, 400);
        }
        if (i < -0.1) {
            j = 0.1;
            context.clearRect(0, 0, 500, 400);
        }
    }
    return points;
}

function draw_health_powerup(ctx, radius, lifetime) {
    // variables used to draw & animate the ring
    // ctx.lineWidth = 0;
    // ctx.strokeStyle = "black";
    // ctx.fillStyle = "red";
    ctx.save();

    // triangle
    // ctx.beginPath();
    // ctx.moveTo(0, 8);
    // ctx.lineTo(32.5, 8);
    // ctx.quadraticCurveTo(32, 20, 16, 32)
    // ctx.quadraticCurveTo(-2, 20, 0, 8)
    // ctx.closePath();
    // ctx.fill();

    // //top left circle
    // ctx.beginPath();
    // ctx.arc(8, 9, 8, 0, Math.PI * 2, true);
    // ctx.closePath()
    // ctx.fill();

    // //top right circle
    // ctx.beginPath();
    // ctx.arc(24, 9, 8, 0, Math.PI * 2, true);
    // ctx.closePath();
    // ctx.fill();

    draw_rough_heart(ctx, 0, 0);
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
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;

    let width = ctx.canvas.width,
        height = ctx.canvas.height
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
    for (var y = 0; y < height; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(width / 2, y - 10, width, y)
        // ctx.lineTo(width, y);
        ctx.lineWidth = (y % major == 0) ? 1 : .5;
        ctx.stroke();

    }


    for (var i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.fillStyle = "#dbdbce"
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.arc(25, 25 + (i * 50), 20, 0, Math.PI * 2);
        ctx.arc(25, 25 + (i * 50), 18, 0, Math.PI * 2);
        ctx.arc(25, 25 + (i * 50), 16, 0, Math.PI * 2);
        ctx.closePath();

        ctx.stroke();
        // ctx.fill();
        ctx.beginPath();
        ctx.arc(25, 25 + (i * 50), 14, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        // draw in image to main canvas
        // var img = new Image;
        // img.onload = function () {
        //     ctx.shadowInset = true;
        //     ctx.shadowBlur = 25;
        //     ctx.shadowColor = "#000";
        //     ctx.drawImage(this, 0, 0);
        // }
        // img.src = "circle.png";
        if (i % 1 == 0) {
            ctx.save();
            ctx.rotate((i * 5) * Math.PI / 180);
            draw_rough_star(ctx, randomX[i], randomY[i]);

            ctx.restore();
        }
    }



    // for (var x = 0; x < width; x += minor) {
    //     ctx.beginPath();
    //     ctx.moveTo(x, 0);
    //     ctx.lineTo(x, height);
    //     ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
    //     ctx.stroke();
    // }

    ctx.restore();
}

function draw_foreground(ctx) {
    for (var i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.fillStyle = "#dbdbce"
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.arc(25, 25 + (i * 50), 20, 0, Math.PI * 2);
        ctx.arc(25, 25 + (i * 50), 18, 0, Math.PI * 2);
        ctx.arc(25, 25 + (i * 50), 16, 0, Math.PI * 2);
        ctx.closePath();

        ctx.stroke();
        // ctx.fill();
        ctx.beginPath();
        ctx.arc(25, 25 + (i * 50), 14, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        // draw in image to main canvas
        // var img = new Image;
        // img.onload = function () {
        //     ctx.shadowInset = true;
        //     ctx.shadowBlur = 25;
        //     ctx.shadowColor = "#000";
        //     ctx.drawImage(this, 0, 0);
        // }
        // img.src = "circle.png";

    }
}

function draw_rough_circle(radius) {
    const rc = rough.canvas(document.getElementById('asteroids'));
    rc.circle(0, 0, radius, {
        fill: "red",
        fillWeight: 3 // thicker lines for hachure
    });
}

function draw_rough_ship(radius, ctx) {
    const rc = rough.canvas(document.getElementById('asteroids'));
    ctx.rotate(245 * Math.PI / 180)

    rc.path('m35.620882,1.197892l-14.094948,-5.593808l11.354163,-28.602643c1.013765,-2.552514 -0.231717,-5.448984 -2.791473,-6.462749c-2.559755,-1.013765 -5.452605,0.235338 -6.462749,2.791473l-11.354163,28.602643l-17.668468,-7.013079l11.350543,-28.602642c1.017385,-2.556135 -0.231718,-5.452605 -2.787853,-6.46637c-2.556135,-1.010144 -5.452605,0.235338 -6.462749,2.791473l-11.354163,28.602643l-14.087706,-5.590187l-5.843629,14.721309l7.784264,3.091982l-9.185431,23.139176c-2.208559,5.575705 0.517744,11.886389 6.093449,14.102189l5.887075,2.3389l-3.175255,7.990637c-1.473579,3.711102 0.343956,7.921845 4.062299,9.399045l3.367147,1.335997c3.714723,1.4772 7.921846,-0.343956 9.399045,-4.058679l3.175256,-7.990637l6.727052,2.668373c5.575705,2.212179 11.89001,-0.514123 14.105809,-6.089828l9.17819,-23.139176l6.944287,2.755267l5.840008,-14.721309z', {
        stroke: 'black',
        strokeWidth: 2,
        roughness: 0.3,
        fillStyle: 'solid',
        fill: "white"
    });
    rc.circle(-5, 10, 20, {
        fillStyle: 'solid',
        fill: 'white',
        roughness: 0,
    })
    rc.circle(-5, 10, 20, {
        fill: 'green',
        roughness: 2,
    })


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