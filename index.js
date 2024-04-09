//Basic Environment setup ------------------
const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");


let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");


//Basic Function------------



//Event Listener for diificulty form 
document.querySelector("input").addEventListener("click", (e)=>{
    e.preventDefault();

    //making form invisible 
    form.style.display="none";

    //making scoreBoard visible
    scoreBoard.style.display="block";

    //getting difficulty selected by user--------

    const userValue = document.getElementById("difficulty").value;
    if(userValue ==="Easy"){
        setInterval(spawnEnemy,2000);
        return (difficulty= 3);
    }
    if(userValue ==="Medium"){
        setInterval(spawnEnemy,1600);
        return (difficulty= 5);
        
    }
    if(userValue ==="Hard"){
        setInterval(spawnEnemy,1200);
        return (difficulty= 8);
        
    }
    if(userValue ==="Insane"){
        setInterval(spawnEnemy,900);
        return (difficulty= 12);
        
    }
   
});

//----------------Creating Player , Enemy,weapon,Etc classes----------------------

//setting player position to center
playerPosition={
    x: canvas.width/2,
    y:canvas.height/2
}

// creating player class.---------------
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

//----Creating Weapon Class----------------------------------------
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

//Creating enemy class-----------
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




//---------Main Logic Here ----------


//Creating Player Object , Weapons Array, Enemy Array, 
const pl = new Player(playerPosition.x   ,playerPosition.y  ,15,
    "white"
    );

const weapons = [];
const enemies =[];


//Function to Spawn Enemy at Random Location--------
const spawnEnemy = () =>{

    //generating random size for enemy
    const enemySize = Math.random()* (40 -5) +5; 
    
    //generating random color for enemy
    const enemyColor = `hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;

    //random is Enemy Spawn position
    let random;

    //Making enemy location Random but only from outside of screen
    if(Math.random() <0.5){
        //Making X equal to very left off of screen or very right oof of screen and setting Y to any where vertically
        random={
            x: Math.random() <0.5 ? canvas.width+enemySize:0 - enemySize,
            y: Math.random() * canvas.height
        }
    }
    else{
        //Making Y equal to very up of of screen or very down off of screen and setting Y to any where horizontally
      random={
        x: Math.random() * canvas.height, 
        y: Math.random() <0.5 ? canvas.width+enemySize:0 - enemySize
      } ;
    }


    //Fing Angle between center (means Player Position) and (enemy Position)
    const myAngle = Math.atan2(
        canvas.height/2- random.y,
        canvas.width/2 -random.x
    );

    //Mkaing Velocity or spped of enemy by multiplying chosen difficulty to radian
    const velocity ={
        x:Math.cos(myAngle)*3,
        y:Math.sin(myAngle)*3
    };

    //Adding enemy to enemies array 
    enemies.push(new Enemy(random.x, random.y , enemySize , enemyColor, velocity))
}


//--------------Creation Animation Function--------

let animationId ;
function animation(){
    //Making Recursion
    animationId = requestAnimationFrame(animation);

    //Clearing canvas on each frame 
    context.fillStyle = "rgb(49,49,49, 0.2)";
    context.fillRect(0,0, canvas.width, canvas.height);
    //Drawing Player
    pl.draw();

    //Generating Bullets
    weapons.forEach((weapon, weaponIndex) =>{      
        weapon.update();

        if (weapon.x + weapon.radius < 1|| weapon.y + weapon.radius < 1|| weapon.x - weapon.radius > canvas.width ||weapon.y - weapon.radius > canvas.height ){
            weapons.splice(weaponIndex,1);  
        }
    });

    //Generating Enemies


    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        const distancebetweenPlayerAndEnemy = Math.hypot(pl.x - enemy.x , pl.y - enemy.y);

        if (distancebetweenPlayerAndEnemy - pl.radius - enemy.radius < 1){
            cancelAnimationFrame(animationId); 
        }
        weapons.forEach((weapon, weaponIndex) => {

            const distancebetweenWeaponAndEnemy = Math.hypot(weapon.x - enemy.x , weapon.y - enemy.y);

            if(distancebetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1){
               setTimeout(()=>{
                enemies.splice(enemyIndex ,1);
                weapons.splice(weaponIndex,1); 
               }, 0);
            }
        });
    });
}


//--------------Adding Event Listeners----------


//event listener for light weapon aka left click
canvas.addEventListener("click", (e)=>{

    //fing angle between player position and click coordinates 
    const myAngle = Math.atan2(
        e.clientY - canvas.height/2,
        e.clientX - canvas.width/2
    );

    //making const speed for light weapon
    const velocity ={
        x:Math.cos(myAngle)* 6,
        y:Math.sin(myAngle)* 6
    };

    //Adding light weapon in weapons array
    weapons.push(new Weapon(canvas.width/2, canvas.height/2,6, "white",velocity));
});
animation();
