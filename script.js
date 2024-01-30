const map = document.getElementById('map');
const SnakeTime = 200;
let timer;

// create snake
function Snake() {
    // set snake height, width, and initial direction
    this.width = 20;
    this.height = 20;
    this.direction = 'right';
    this.body = [{ x: 2, y: 0, flag: null }];

    // display snake
    this.display = function () {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].x != null) {
                const s = document.createElement('div');
                this.body[i].flag = s;
                s.style.width = this.width + 'px';
                s.style.height = this.height + 'px';
                s.style.position = 'absolute';
                s.style.left = this.body[i].x * this.width + 'px';
                s.style.top = this.body[i].y * this.height + 'px';
                s.style.backgroundColor = 'yellow';
                map.appendChild(s);
            }
        }
        // set color of snake head as orange
        this.body[0].flag.style.backgroundColor = 'orange';
    };

    this.run = function () {
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        switch (this.direction) {
            case 'left':
                this.body[0].x -= 1;
                break;
            case 'right':
                this.body[0].x += 1;
                break;
            case 'up':
                this.body[0].y -= 1;
                break;
            case 'down':
                this.body[0].y += 1;
                break;
        }

        // Check if it's out of bounds
        if (this.body[0].x < 0 || this.body[0].x > 150 || this.body[0].y < 0 || this.body[0].y > 60) {
            clearInterval(timer);
            alert("Hit boundary, game over!");
            document.getElementById('beginBox').style.display = 'block';
            // Delete old ones
            for (let i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) {
                    map.removeChild(this.body[i].flag);
                }
            }
            this.body = [{ x: 2, y: 0 }]; // back to initial
            this.direction = 'right';
            this.display(); // display initial
            return false;
        }

        // If snake coordinates match food coordinates
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            this.body.push({ x: null, y: null, flag: null });
            refresh();
            // Clear food, reappear one
            map.removeChild(food.flag);
            food.display();
        }

        // Check if the snake bites itself
        for (let i = 4; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                clearInterval(timer);
                alert("You bit yourself, game over!");
                document.getElementById('beginBox').style.display = 'block';
                for (let i = 0; i < this.body.length; i++) {
                    if (this.body[i].flag != null) {
                        map.removeChild(this.body[i].flag);
                    }
                }
                this.body = [{ x: 2, y: 0 }]; // back to initial
                this.direction = 'right';
                this.display(); // display initial
                return false;
            }
        }

        // Delete initial snake, then display the new one
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].flag != null) {
                map.removeChild(this.body[i].flag);
            }
        }
        this.display();
    };
}

// create food
function Food() {
    this.width = 20;
    this.height = 20;

    this.display = function () {
        const d = document.createElement('div');
        this.flag = d;
        d.style.width = this.width + 'px';
        d.style.height = this.height + 'px';
        d.style.background = 'red';
        d.style.position = 'absolute';
        this.x = Math.floor(Math.random() * 80);
        this.y = Math.floor(Math.random() * 40);
        d.style.left = this.x * this.width + 'px';
        d.style.top = this.y * this.height + 'px';
        map.appendChild(d);
    };
}

const snake = new Snake();
const food = new Food();
// initial display
snake.display();
food.display();

document.body.onkeydown = function (e) {
    const ev = e;
    switch (ev.key) {
        case 'ArrowUp':
            if (snake.direction !== 'down') {
                snake.direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (snake.direction !== 'up') {
                snake.direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (snake.direction !== 'right') {
                snake.direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (snake.direction !== 'left') {
                snake.direction = 'right';
            }
            break;
    }
};

const btn = document.getElementById('begin');
btn.onclick = function () {
    const parent = this.parentNode;
    parent.style.display = 'none';
    let time = SnakeTime;

    timer = setInterval(function () {
        snake.run();
    }, time);
};

function refresh() {
    clearInterval(timer);
    timer = setInterval(function () {
        snake.run();
        console.log(SnakeTime);
    }, SnakeTime);
}

