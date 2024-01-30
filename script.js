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

}