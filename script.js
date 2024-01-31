// Global variables
const map = document.getElementById('map');
const SnakeTime = 200;
let score= 0;
let foodEatenCount = 0;
let timer;
const blocks = [];
let bestScore = localStorage.getItem('Bestscore') || 0;
document.getElementById('Bestscore').innerText = 'Best Score: ' + bestScore;

// create snake
function Snake() {
    // set snake height, width, and initial direction
    this.width = 20;
    this.height = 20;
    this.direction = 'right';
    this.body = [{ x: 2, y: 0, flag: null }];
    this.bodyImage = getRandomBodyImage();

    function getRandomBodyImage() {
        const bodyImages = [
            "url('image/banana.png')",
            "url('image/bullet.png')",
            "url('image/ghost.png')",
            "url('image/mashroom.png')",
            "url('image/star.png')",
            "url('https://mario.wiki.gallery/images/thumb/1/10/SpinyShellMK8.png/1200px-SpinyShellMK8.png')",
        ];
        const randomIndex = Math.floor(Math.random() * bodyImages.length);
        return bodyImages[randomIndex];
    }


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
        if(this.body[0].x<0 || this.body[0].x >139/4 || this.body[0].y<0 || this.body[0].y>59/4 ){
            clearInterval(timer);
             //clear timer
             Swal.fire({
                title: 'Game Over!',
                text: ' You hit the boundry!',
                imageUrl: 'https://www.icegif.com/wp-content/uploads/2023/04/icegif-584.gif', // Replace with the actual path to your image
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Custom image',
                confirmButtonText: 'OK'
            });
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
        //Check for collision with block
        for (let i = 0; i < blocks.length; i++) {
            if (this.body[0].x === blocks[i].x && this.body[0].y === blocks[i].y) {
                // Stop the game
                clearInterval(timer);
                Swal.fire({
                    title: 'Game Over!',
                    text: ' Game Over! Bowser catched you!',
                    imageUrl: 'https://static.wikia.nocookie.net/5604a6b5-8e7e-4d9b-b503-86d3fd2c1162/scale-to-width/755', // Replace with the actual path to your image
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    confirmButtonText: 'OK'
                });

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
function GenerateRandomBlock() {
    this.width = 40;
    this.height = 40;

    this.display = function () {
        // create one div
        const blockElement = document.createElement('div');
        this.flag = blockElement;
        blockElement.style.width = this.width + 'px';
        blockElement.style.height = this.height + 'px';
    // Set background image for the random block
    blockElement.style.backgroundImage = "url('https://i.makeagif.com/media/6-20-2016/RZDH7S.gif')";
    blockElement.style.backgroundSize = 'cover';
    blockElement.style.position = 'absolute';

    // Generate random coordinates for the block
    do {
        this.x = Math.floor(Math.random() * 35);
        this.y = Math.floor(Math.random() * 15);
    } while (isBlockOnMario(this.x, this.y)||isBlockOnBox(this.x, this.y));

    console.log("Random block coordinates:", this.x, this.y);
    blockElement.style.left = this.x * this.width + 'px';
    blockElement.style.top = this.y * this.height + 'px';
    map.appendChild(blockElement);
    blocks.push({ x: this.x, y: this.y, flag: blockElement });
}
function isBlockOnMario(x, y) {
    for (let i = 0; i < mario.body.length; i++) {
        if (mario.body[i].x === x && mario.body[i].y === y) {
            return true;
        }
    }
    return false;
}
function isBlockOnBox(x, y) {
    for (let i = 0; i < blocks.length; i++) {
    if (box.x === x && box.y === y) {
        return true;
    }
    return false;
}      
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