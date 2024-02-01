// Global variables
const map = document.getElementById('map');
const marioTime = 250;
let score= 0;
let boxEatenCount = 0;
let timer;
const blocks = [];
let bestScore = localStorage.getItem('Bestscore') || 0;
document.getElementById('Bestscore').innerText = 'Best Score: ' + bestScore;

// create Mario
function Mario() {
    // set mario height, width, and initial direction
    this.width = 40;
    this.height = 40;
    this.direction = 'right';
    this.body = [{ x: 1, y: 0, flag: null }];
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

    // display mario
    this.display = function () {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].x !== null) {
                const marioElement = document.createElement('div');
                this.body[i].flag = marioElement;
                marioElement.style.width = this.width + 'px';
                marioElement.style.height = this.height + 'px';
                marioElement.style.position = 'absolute';
                marioElement.style.left = this.body[i].x * this.width + 'px';
                marioElement.style.top = this.body[i].y * this.height + 'px';

                if (i === 0) {
                    marioElement.style.backgroundImage = "url('https://i.redd.it/hu1pxnoj2o061.gif')";
                } else {
                    // Randomly select a body image URL
                    marioElement.style.backgroundImage = getRandomBodyImage();
                }

                marioElement.style.backgroundSize = 'cover';
                map.appendChild(marioElement);
            }
        }
    };
    //let mario moving
    this.run=function() {
        for (let i=this.body.length-1;i>0;i--){
            this.body[i].x= this.body[i-1].x;
            this.body[i].y=this.body[i-1].y;
        }
                //mario  direction
        switch (this.direction){
            case "left":
                this.body[0].x -= 1;
                    break;
            case "right":
                this.body[0].x += 1;
                    break;
            case "up":
                this.body[0].y -= 1;
                    break;
            case "down":
                this.body[0].y += 1;
                    break;
                }
     //To determine whether it is out of bounds, judge based on the mario head
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
            score = 0;
            document.getElementById('score').innerText = 'Score: ' + score;
                            //delete old one
                for(let i=0;i<this.body.length;i++){
                    if(this.body[i].flag != null){
                     //if just eat box then die,it will add null
                        map.removeChild(this.body[i].flag);
                                }
                            }
                            for (let j = 0; j < blocks.length; j++) {
                                if (blocks[j].flag !== null && map.contains(blocks[j].flag)) {
                                    map.removeChild(blocks[j].flag);
                                }
                            }
            this.body=[ {x:2,y:0} ] ;//back to inital
            this.direction='right';
            this.display(); // display intial
            return false; // end
                    }
        //if mario xy=box xy, mario get items;
        if (this.body[0].x == box.x && this.body[0].y == box.y) {
                // Increase score
                score++;
                boxEatenCount++;
            
                // Check if  box have been eaten
                if (boxEatenCount === 1) {
                    // Generate a random block
                    block.display();
                    // Reset the counter
                    boxEatenCount = 0;
                }
              // Update the HTML element displaying the score
                 document.getElementById('score').innerText = 'Score: ' + score;
                 if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('Bestscore', bestScore);
                    document.getElementById('Bestscore').innerText = 'Best Score: ' + bestScore;
                }
                
                this.body.push({ x: null, y: null, flag: null });
                    refresh();
                    //clear box, reappear one
                    map.removeChild(box.flag);
                    box.display();
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

                document.getElementById('beginBox').style.display = 'block';
                score = 0;
                document.getElementById('score').innerText = 'Score: ' + score;
        
                // Remove the mario tiem and blocks from the map
                for (let j = 0; j < this.body.length; j++) {
                    if (this.body[j].flag !== null && map.contains(this.body[j].flag)) {
                        map.removeChild(this.body[j].flag);
                    }
                }
                
                // Remove the blocks from the map
                for (let j = 0; j < blocks.length; j++) {
                    if (blocks[j].flag !== null && map.contains(blocks[j].flag)) {
                        map.removeChild(blocks[j].flag);
                    }
                }

                this.body = [{ x: 2, y: 0 }]; // back to initial
                this.direction = 'right';
                this.display(); // display initial
                return false; // end
                }
              }

        //eat itself die, if head xy == body4 , first 4 will never collapse
        for(let i=4;i<this.body.length;i++){
            if(this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y){
                clearInterval(timer);//clear timer
                Swal.fire({
                    title: 'Game Over!',
                    text: ' You hit your items,game over!!',
                    imageUrl: 'https://i.makeagif.com/media/4-09-2019/VbBIjx.gif', // Replace with the actual path to your image
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    confirmButtonText: 'OK'
                });
                document.getElementById('beginBox').style.display = 'block';
                score = 0;
                document.getElementById('score').innerText = 'Score: ' + score;
                for(let i=0;i<this.body.length;i++){
                    if(this.body[i].flag != null){
                     //if just collect box then die,it will add null
                        map.removeChild(this.body[i].flag);
                 }
             }
             for (let j = 0; j < blocks.length; j++) {
                if (blocks[j].flag !== null && map.contains(blocks[j].flag)) {
                    map.removeChild(blocks[j].flag);
                }
            }
            this.body=[ {x:2,y:0} ] ;//back to inital
            this.direction='right';
            this.display(); // display intial
            return false; // end
                    }
            }
            // detele intial sanke , then display new one 
            for( let i=0;i<this.body.length;i++){
                if(this.body[i].flag !=null){
                    map.removeChild(this.body[i].flag);
                }
            }
                this.display();
        }
        
           }
           //create random enermy every  box taken
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
        
            //console.log("Random block coordinates:", this.x, this.y);
            blockElement.style.left = this.x * this.width + 'px';
            blockElement.style.top = this.y * this.height + 'px';
            map.appendChild(blockElement);
            blocks.push({ x: this.x, y: this.y, flag: blockElement });
        }
        function isBlockOnBoxAndMario(x, y) {
            return isBlockOnMario(x, y) && isBlockOnBox(x, y);
        }
    
        };
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

// create box
function Box() {
    this.width = 40;
    this.height = 40;

    this.display = function () {
        // create one div
        const boxElement = document.createElement('div');
        this.flag = boxElement;
        boxElement.style.width = this.width + 'px';
        boxElement.style.height = this.height + 'px';

        // Set background image
        boxElement.style.backgroundImage = "url('https://cdna.artstation.com/p/assets/images/images/061/938/632/original/derend-marvel-ezgif-com-gif-maker-1.gif?1681968838')";
        boxElement.style.backgroundSize = 'cover';

        boxElement.style.position = 'absolute';

        // Generate random coordinates for the box
        do {
            this.x = Math.floor(Math.random() * 35);
            this.y = Math.floor(Math.random() * 15);
        } while (isBoxOnMario(this.x, this.y));

        //console.log("Box coordinates:", this.x, this.y);
        boxElement.style.left = this.x * this.width + 'px';
        boxElement.style.top = this.y * this.height + 'px';
        map.appendChild(boxElement);
    };

    // Helper function to check if the generated box coordinates overlap with the mario
    function isBoxOnMario(x, y) {
        for (let i = 0; i < mario.body.length; i++) {
            if (mario.body[i].x === x && mario.body[i].y === y) {
                return true;
            }
        }
        return false;
    }
}
// Create instances
const mario = new Mario();
const box = new Box();
const block = new GenerateRandomBlock();
// initial display
mario.display();
box.display();

document.body.onkeydown = function (e) {
    // have event, use event
    const ev = e 
    switch (ev.key) {
        case 'ArrowUp':
            // not allow go back
            if (mario.direction != 'down') {
                mario.direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (mario.direction != 'up') {
                mario.direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (mario.direction != 'right') {
                mario.direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (mario.direction != 'left') {
                mario.direction = 'right';
            }
            break;
        // also wasd keywords
        case 'w':
            if (mario.direction != 'down') {
                mario.direction = 'up';
            }
            break;
        case 's':
            if (mario.direction != 'up') {
                mario.direction = 'down';
            }
            break;
        case 'a':
            if (mario.direction != 'right') {
                mario.direction = 'left';
            }
            break;
        case 'd':
            if (mario.direction != 'left') {
                mario.direction = 'right';
            }
            break;
    }
};

const btn = document.getElementById('begin');
// click to start
btn.onclick = function () {
    const parent = this.parentNode;
    // hide start btn
    parent.style.display = 'none';
    // get timer
    let time = marioTime;

    timer = setInterval(function () {
        mario.run();
    }, time);
};
// refresh timer function
function refresh() {
    // stop timer
    clearInterval(timer);
    // reflash time
    timer = setInterval(function () {
        mario.run();
        //console.log(marioTime);
    }, marioTime);
}
