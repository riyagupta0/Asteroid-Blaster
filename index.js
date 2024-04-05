const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");

playerPosition={
    x: canvas.width/2,
    y:canvas.height/2
}
class Player{
    constructor(x,y,radius, color){
        this.x = x;
        this.y= y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,(Math.PI/180)*0, (Math.PI /180)*360, false);
        context.fillStyle = this.color;
        context.fill();
    }

}

//--------------------------
class Weapon {
    constructor(x,y,radius, color,velocity){
        this.x = x;
        this.y= y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,(Math.PI/180)*0, (Math.PI /180)*360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update(){
        this.draw();
        (this.x += this.velocity.x),
        (this.y += this.velocity.y);
    }
}

class Enemy {
    constructor(x,y,radius, color,velocity){
        this.x = x;
        this.y= y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,(Math.PI/180)*0, (Math.PI /180)*360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update(){
        this.draw();
        (this.x += this.velocity.x),
        (this.y += this.velocity.y);
    }
}
const pl = new Player(playerPosition.x   ,playerPosition.y  ,15,
    `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`
    );

const weapons = [];
const enemies =[];

const spawnEnemy = () =>{
    const enemySize = Math.random()* (40 -5) +5; 
    const enemyColor = `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`;

    let random;
    if(Math.random() <0.5){
        random={
            x: Math.random() <0.5 ? canvas.width+enemySize:0 - enemySize,
            y: Math.random() * canvas.height
        }
    }
    else{
      random={
        x: Math.random() * canvas.height, 
        y: Math.random() <0.5 ? canvas.width+enemySize:0 - enemySize
      } ;
        
    }
    const myAngle = Math.atan2(
        canvas.height/2- random.y,
        canvas.width/2 -random.x
    );
    const velocity ={
        x:Math.cos(myAngle)* 5,
        y:Math.sin(myAngle)*5
    };

    enemies.push(new Enemy(random.x, random.y , enemySize , enemyColor, velocity))
}

function animation(){
    requestAnimationFrame(animation);
    context.clearRect(0,0, canvas.width, canvas.height);
    pl.draw();
    weapons.forEach((weapon) =>{
        
        weapon.update();
    });

    enemies.forEach((enemy) =>{
        enemy.update();
    });
}

// setInterval (spawnEnemy, 1000);
canvas.addEventListener("click", (e)=>{
    const myAngle = Math.atan2(
        e.clientY - canvas.height/2,
        e.clientX - canvas.width/2
    );
    const velocity ={
        x:Math.cos(myAngle)* 5,
        y:Math.sin(myAngle)*5
    };
    weapons.push(new Weapon(canvas.width/2, canvas.height/2,6, "white",velocity));
});
animation();
