const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const START_SPEED = 140
var moveSpeed = 0

let score = 0

class Pipe {
    constructor(x) {
        this.width = 40
        this.gap = 41

        this.x = x
        this.startX = x
        this.y = this.getRandomY()

        this.has_scored = false
    }

    getRandomY() {
        return 75 + (Math.random() * 225)
    }

    checkPointColliding(x, y) {
        if ((x > this.x - this.width / 2) && (x < this.x + this.width)) {

            return !(y > this.y - this.gap && y < this.y + this.gap);
            
        }

        return false;
    }

    checkPlayer(p) {
        
        var size = (p.size * 0.8) / 2
        var points = [
            {x: p.x - size * 0.5, y: p.y - size},
            {x: p.x, y: p.y - size},
            {x: p.x + size, y: p.y - size},
            {x: p.x + size, y: p.y},
            {x: p.x + size, y: p.y + size},
            {x: p.x, y: p.y + size},
            {x: p.x - size * 0.5, y: p.y + size},
            {x: p.x - size * 0.5, y: p.y}
        ]

        for (let i = 0; i < points.length; i++) {
            var point = points[i]
            if (this.checkPointColliding(point.x, point.y)) {
                return true;
            }
        }

        return false

    }

    update(deltaTime, p) {

        this.x -= moveSpeed * deltaTime
        var h = 400

        if (p.x - (p.size / 2) > this.x + (this.width / 2) && !this.has_scored) {
            this.has_scored = true
            score += 1
        }

        if (this.checkPlayer(p)) {
            ctx.fillStyle = "red"
            p.dead = true
            moveSpeed = 0
        } else {
            ctx.fillStyle = "green"
        }
        ctx.fillRect(this.x - (this.width / 2), this.y + (this.gap), this.width, h)
        ctx.fillRect(this.x - (this.width / 2), this.y - this.gap - (h), this.width, h)

        ctx.fillStyle = "blue"
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4)
        
        if (this.x <= (0 - this.width)) {
            this.x  = 410
            this.has_scored = false
            this.y = this.getRandomY()
        }
    }
}



let player = { x: 100, y: 200, velocity: 0, size: 17, color: 'blue', dead: true};

function die() {
    player.dead = true
    moveSpeed = 0
}


let pipes = [new Pipe(410), new Pipe(610)]

function tap() {
    if (player.dead) {
        score = 0
        player.dead = false
        player.velocity = 0
        player.y = 200
        moveSpeed = START_SPEED
        pipes[0].x = 410
        pipes[0].has_scored = false
        pipes[1].x = 610
        pipes[1].has_scored = false
    } else {
        player.velocity = -340
    }
}

canvas.addEventListener("mousedown", function(event) {
    if (event.button == 0) {
        tap()
    }
})

document.addEventListener('keydown', function(event) {
    if (event.key = "space" && !event.repeat) {
        tap()
    }
});

// Draw the player
function drawPlayer(deltaTime) {

    ctx.font = "30px Arial";
    ctx.fillStyle = "black"
    ctx.fillText(`${score}`,10,80);

    if (player.dead) { 
        ctx.fillText("Tap or space to start", 10, 160)
    }

    if (!player.dead) {
        player.y += player.velocity * deltaTime
        player.velocity += 20
        
        player.velocity = Math.min(player.velocity, 500)

        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - (player.size / 2), player.y - (player.size / 2), player.size, player.size);

        console.log(player.y)
        if (player.y + (player.size / 2) >= 370) {
            die()
        }
    }

    pipes.forEach(function(v, i, a) {
        v.update(deltaTime, player)
    })

    ctx.fillStyle = "red";
    ctx.fillRect(0, 370, 400, 30)
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
var lastTime = 0
function gameLoop(time) {

    var deltaTime = (time - lastTime) / 1000

    console.log(player.velocity)

    clearCanvas();
    drawPlayer(deltaTime);

    lastTime = time
    requestAnimationFrame(gameLoop);
}


gameLoop(0);