const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleArray = [];
const hues = [60,120, 180, 240, 300, 360];

const G = 0.2;



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
    //init(mouse.x, mouse.y);

});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;    //1 bis 6 // radius
        this.speedX = Math.random() * 2 - 1; //+1,5 bis -1.5
        this.speedY = Math.random() * 2 - 1;
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        let hue = hues[Math.round(Math.random() * hues.length)];        // Math.round(Math.random() * 360)
        this.color = 'hsl(' + hue + ', 100%, 50%)';
        this.size = Math.round(Math.random() * 20) || 1;
        this.E_kin = (this.speed ** 2) * 0.5 * this.size;
        this.mass = Math.PI *this.size * this.size; 
        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    update() {
        this.speedX += this.accelerationX;
        this.speedY += this.accelerationY;
        
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        this.E_kin = (this.speed ** 2) * 0.5 * this.mass; 

        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}



function init(x, y) {
    let allowed = true;
    for (let i = 0; i < particleArray.length; i++) {
        let p = particleArray[i];
        let s = p.size;
        if (x < p.x + s && x > p.x - s && y < p.y + s && y > p.y - s) allowed = false;
    }
    if(allowed) particleArray.push(new Particle(x, y));
    console.log(particleArray.length);
}

// Gravitationsfunktion - implementiert Newton's Gravitationsgesetz
// F = G * m1 * m2 / r²
// Die Kraft wird in Beschleunigung umgewandelt: a = F / m
function applyGravity() {
    for (let i = 0; i < particleArray.length; i++) {
        let particle1 = particleArray[i];
        
        for (let j = i + 1; j < particleArray.length; j++) {
            let particle2 = particleArray[j];
            
            // Abstand zwischen den Teilchen berechnen
            let dx = particle2.x - particle1.x;
            let dy = particle2.y - particle1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Minimaler Abstand um Division durch Null zu vermeiden
            // und zu starke Kräfte bei sehr kleinen Abständen zu verhindern
            let minDistance = Math.max(distance, particle1.size + particle2.size);
            
            // Gravitationskraft berechnen: F = G * m1 * m2 / r²
            let force = G * particle1.mass * particle2.mass / (minDistance * minDistance);
            
            // Einheitsvektor in Richtung der Kraft
            let forceX = force * (dx / minDistance);
            let forceY = force * (dy / minDistance);
            
            // Beschleunigung = Kraft / Masse (F = ma, also a = F/m)
            // particle1 wird zu particle2 hingezogen
            particle1.accelerationX += forceX / particle1.mass;
            particle1.accelerationY += forceY / particle1.mass;
            
            // particle2 wird zu particle1 hingezogen (Newton's 3. Gesetz)
            particle2.accelerationX -= forceX / particle2.mass;
            particle2.accelerationY -= forceY / particle2.mass;
        }
    }
}

function handleParticles() {
    // Erst Gravitationskräfte für alle Teilchen berechnen
    applyGravity();
    
    for (let i = 0; i < particleArray.length; i++) {
        let s = (particleArray[i].size / 2);
        let too_small = particleArray[i].size < 1;
        if (particleArray[i].x > canvas.x + s || particleArray[i].y > canvas.y + s ||
            particleArray[i].x < 0 - s || particleArray[i].y < 0 - s || too_small) {

            particleArray.splice(i, 1);
            i--;
        } else {
            particleArray[i].update();
            physics(i);
            if (particleArray[i]) {
                particleArray[i].draw();
            }
        }
    }
}

function physics(index) {
    let particle = particleArray[index];
    if (!particle) {
        return
    }
    if (particleArray.length < 2) {
        return
    }

    for (let i = 0; i < particleArray.length; i++) {
        if (i == index) {
            continue;
        }

        let dx = particleArray[i].x - particle.x;  //negative if particle is right
        let dy = particleArray[i].y - particle.y; //negative if particle lower
        let distance = Math.hypot(dx, dy);



        let collison = distance < (particle.size + particleArray[i].size);
        if (collison) {
            if (particle.color == particleArray[i].color) {
                let combined_area = (Math.PI * particleArray[i].size ** 2) + (Math.PI * particle.size ** 2);
                let combined_radius = Math.sqrt(combined_area / Math.PI);
                if (particle.size > particleArray[i].size) {
                    particle.size = combined_radius;
                    particle.mass = particle.size * particle.size; // Masse aktualisieren
                    particleArray.splice(i, 1);
                    i--;
                } else {
                    particleArray[i].size = combined_radius;
                    particleArray[i].mass = particleArray[i].size * particleArray[i].size; // Masse aktualisieren
                    particleArray.splice(index, 1);
                    break;
                }
            } else {
                let m1 = particle.mass;  // Verwende mass statt size
                let vx1 = particle.speedX;
                let vy1 = particle.speedY;
                let x1 = particle.x;
                let y1 = particle.y;
                let m2 = particleArray[i].mass;  // Verwende mass statt size
                let vx2 = particleArray[i].speedX;
                let vy2 = particleArray[i].speedY;
                let x2 = particleArray[i].x;
                let y2 = particleArray[i].y;

                new_velocities = [[vx1New, vy1New], [vx2New, vy2New]] = calculate_collision(m1, vx1, vy1, x1, y1, m2, vx2, vy2, x2, y2);

                particleArray[index].speedX = new_velocities[0][0];
                particleArray[index].speedY = new_velocities[0][1];

                particleArray[i].speedX = new_velocities[1][0];
                particleArray[i].speedY = new_velocities[1][1];
            }
        }

    }
}

function calculate_collision(m1, vx1, vy1, x1, y1, m2, vx2, vy2, x2, y2) {
    // Step 1: Calculate normal vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(dx * dx + dy * dy);

    // Avoid division by zero (if positions are the same, no collision change)
    if (d === 0) {
        return [[vx1, vy1], [vx2, vy2]];
    }

    const nx = dx / d;
    const ny = dy / d;

    // Tangential vector (perpendicular to normal)
    const tx = -ny;
    const ty = nx;

    // Step 2: Decompose velocities into normal and tangential components
    const v1n = vx1 * nx + vy1 * ny;
    const v1t = vx1 * tx + vy1 * ty;
    const v2n = vx2 * nx + vy2 * ny;
    const v2t = vx2 * tx + vy2 * ty;

    // Step 3: Calculate new normal components for elastic collision
    const v1nNew = (m1 - m2) / (m1 + m2) * v1n + (2 * m2) / (m1 + m2) * v2n;
    const v2nNew = (2 * m1) / (m1 + m2) * v1n + (m2 - m1) / (m1 + m2) * v2n;

    // Tangential components remain unchanged
    const v1tNew = v1t;
    const v2tNew = v2t;

    // Step 4: Reconstruct new velocity vectors
    const vx1New = v1nNew * nx + v1tNew * tx;
    const vy1New = v1nNew * ny + v1tNew * ty;
    const vx2New = v2nNew * nx + v2tNew * tx;
    const vy2New = v2nNew * ny + v2tNew * ty;

    return [[vx1New, vy1New], [vx2New, vy2New]];
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

/*
for(let i = 0; i < 120; i++){
    let x = Math.round(Math.random()*canvas.width);
    let y = Math.round(Math.random()*canvas.height);
    init(x,y);
}*/

animate();