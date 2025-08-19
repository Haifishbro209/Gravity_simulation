const { pass } = require("three/tsl");

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleArray = [];

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    init(mouse.x, mouse.y);

});

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //init(mouse.x,mouse.y);

});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;    //1 bis 6
        this.speedX = Math.random() * 2 - 1; //+1,5 bis -1.5
        this.speedY = Math.random() * 2 - 1;
        this.speedSqr = this.speedX * this.speedX + this.speedY * this.speedY;
        //this.dxCenter = 0;
        //this.dyCenter = 0;
        //this.distanceToCenter = 0;
        let hue = Math.round(Math.random() * 360)
        this.color = 'hsl(' + hue + ', 100%, 50%)';
        this.size = Math.round(Math.random() * 20);

    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        //this.dxCenter = Math.abs(this.x - canvas.width / 2);
        //this.dyCenter = Math.abs(this.y - canvas.height / 2);
        //this.distanceToCenter = Math.sqrt(this.dxCenter * this.dxCenter + this.dyCenter * this.dyCenter);
        //this.size -= 0.03;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


function init(x, y) {

    for (let i = 0; i < 1; i++) {
        particleArray.push(new Particle(x, y));
        console.log(particleArray.length)
    }


}

function handleParticles() {
    for (let i = 0; i < particleArray.length; i++) {
        let s = (particleArray[i].size / 2)
        let too_small = particleArray[i].size < 1;
        if (particleArray[i].x > canvas.x + s || particleArray[i].y > canvas.y + s ||
            particleArray[i].x < 0 - s || particleArray[i].y < 0 - s || too_small) {
            
            particleArray.splice(i, 1);
            i--;
        } else {
            particleArray[i].update();

            particleArray[i].draw();
        }
    }
}

function gravity(index){
    let particle = particleArray[index]
    let x = particle.x
    let y = particle.y


    if (particleArray.length < 2) return;

    for( let i = 0;i ++; i < particleArray.length){
        if (i == index && index != particleArray.length) i ++;
        if (i == particleArray.length) break;


    
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}


animate();