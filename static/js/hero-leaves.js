const LEAF_COLORS = [
    "#15803d", // forest green
    "#166534", // deep dark green
    "#22c55e", // bright fresh green
    "#4ade80", // soft light green
    "#84cc16", // lime/moss green
    "#65a30d"  // olive/sage green
];

const canvas = document.getElementById("leaves-canvas");
const ctx = canvas.getContext("2d");

const leafWind = {

    speed: 1,

    sway: 1,

    rotation: 1

};

window.leafWind = leafWind;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Leaf {

    constructor() {
        this.reset(true);
    }

    reset(initial = false) {

        this.x = Math.random() * canvas.width;

        this.y = initial
            ? Math.random() * canvas.height
            : -40;

        this.depth =

            0.6 + Math.random() * 0.8;

        this.size =

            (10 + Math.random() * 16) *

            this.depth;

        this.speed =
            (0.5 + Math.random() * 1.2) *
            this.depth;

        this.rotation = Math.random() * Math.PI * 2;

        this.rotationSpeed =
            (Math.random() - 0.5) * 0.02;

        this.swayOffset =
            Math.random() * Math.PI * 2;

        this.swayAmount =
            (15 + Math.random() * 25) *
            this.depth;

        this.opacity =
            (0.35 + Math.random() * 0.45) *
            Math.min(this.depth, 1);

        this.color = LEAF_COLORS[
            Math.floor(Math.random() * LEAF_COLORS.length)
];

    }

    update(time) {

        this.y += this.speed * leafWind.speed;

        this.rotation +=

            this.rotationSpeed *

            leafWind.rotation;

        this.x +=

            Math.sin(

                time * 0.001 +

                this.swayOffset

            )

            *

            0.35

            *

            this.depth

            *

            leafWind.sway;

        if (this.y > canvas.height + 40) {
            this.reset();
        }

    }

    draw() {

        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.rotation);

        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            this.size * 0.45,
            this.size,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "#8b5a2b";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(0, -this.size);

        ctx.lineTo(0, this.size);

        ctx.stroke();

        ctx.restore();

    }

}

const leaves = [];

const leafCount = Math.min(
    Math.floor(window.innerWidth / 14),
    120
);

for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf());
}

function animate(time) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    leaves.forEach(leaf => {

        leaf.update(time);

        leaf.draw();

    });

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);

function triggerLeafGust() {

    leafWind.speed = 1.45;
    leafWind.sway = 2.1;
    leafWind.rotation = 1.7;

    setTimeout(() => {

        leafWind.speed = 1;
        leafWind.sway = 1;
        leafWind.rotation = 1;

    }, 2500);

}

function scheduleNextGust() {

    const delay =

        12000 +

        Math.random() * 6000;

    setTimeout(() => {

        triggerLeafGust();

        scheduleNextGust();

    }, delay);

}

scheduleNextGust();