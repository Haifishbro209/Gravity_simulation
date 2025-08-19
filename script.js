const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleArray = [];
const hues = [60,120,180,240,300,360]


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
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;    //1 bis 6 // radius
        this.speedX = Math.random() * 2 - 1; //+1,5 bis -1.5
        this.speedY = Math.random() * 2 - 1;
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        let hue = hues[Math.round(Math.random()*hues.length)];        // Math.round(Math.random() * 360)
        this.color = 'hsl(' + hue + ', 100%, 50%)';
        this.size = Math.round(Math.random() * 20);
        this.E_kin = (this.speed **2) * 0.5 * this.size// kinetic energy

    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        this.E_kin = (this.speed **2) * 0.5 * this.size// kinetic energy

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
            physics[i];
            particleArray[i].draw();
        }
    }
}

function physics(index){
    let particle = particleArray[index];
    let x = particle.x;
    let y = particle.y;


    if (particleArray.length < 2) return;

    for( let i = 0;i ++; i < particleArray.length){
        if (i == index && index != particleArray.length) i ++;
        if (i == particleArray.length) break;
        let dx = particleArray[i].x - x;  //negative if particle is right
        let dy = particleArray[i].y - y; //negative if particle lower
        let distance = Math.sqrt(dx**2+dy**2);
        let collison = distance < (particle.size + particleArray[i].size);
        if(collison){
            if (particle.color == particleArray[i].color){
                let combined_area= (Math.PI*particleArray[i].size)+(Math.PI * particle.size**2);
                let combined_radius = Math.sqrt(combined_area / Math.PI);
                if(particle.size > particleArray[i].size){
                    particle.size = combined_radius;
                    particleArray.splice(i,1);
                    i--;
                }else{
                    particleArray[i].size = combined_radius;
                    particleArray.splice(index,1);
                    break;
                }
            }
        }
    
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();