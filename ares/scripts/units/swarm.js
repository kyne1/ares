const refresh = require("libs/refresh");
const fname = require("dir");
const sapbomb = require("bullets/sapbomb");
const comShield = require("abilities/commandShield");
//const searchInterval = 75;

function sprite(name){
    return Core.atlas.find(name);
}

const laser = sprite("laser");
const laserEnd = sprite("laser-end");

function drawLaser(team,  x1,  y1,  x2,  y2,  size1,  size2){
    let angle1 = Angles.angle(x1, y1, x2, y2);
    let vx = Mathf.cosDeg(angle1), vy = Mathf.sinDeg(angle1);
    let len1 = size1 / 2 - 1.5, len2 = size2 / 2 - 1.5;
    //print(Drawf);
    Draw.color(Color.valueOf("#bf8bce"), 0.8);
    Drawf.laser(team, laser, laserEnd, x1 + vx*len1, y1 + vy*len1, x2 - vx*len2, y2 - vy*len2, 0.25);
}
//returns an angle

function toRad(angle){
    return (angle * Math.PI/180);
}

function toDeg(angle){
    return (angle * 180/Math.PI);
}

function angleTo(xf,yf,xi,yi){
    return toDeg(Math.atan2(yf-yi,xf-xi));
};

const swarm = extend(UnitType, "swarm",{
    load(){
        this.super$load();
        this.region = sprite(fname+"-swarm");
    },
    init(){
        this.super$init();
        this.localizedName = "Swarm";
    },
    description: "Carpet bomber with forcefields",
    health: 90,
    speed: 5.4,
    accel: 0.02,
    drag: 0.02,
    armor: 2,
    flying: true,
    hitSize: 6,
    engineOffset: 5,
    engineSize: 2.3,
    rotateShooting: false,
    rotateSpeed: 7,
    research: UnitTypes.flare,
    circleTarget: true,
    targetAir: false,
    range: 140,
    commandLimit: 19,
    lowAltitude: false,
    faceTarget: false,
    mineTier: 1,
    mineSpeed: 0.5,
});

swarm.constructor = () => extend(UnitEntity,{
    classId: () => swarm.classId,
    groupsize: 0,
    maxh: 0,
    sumh: 0,
    update(){
        this.super$update();
        if(this.isCommanding()){
            //kill everyone if pool is near zero
            let helth = 0;
            this.controlling.forEach(u => {
                //this.maxh += u.maxHealth;
                helth += u.health;
                //print(u.shield);
            });
            helth += this.health;
            this.sumh = helth;

            if(this.sumh <= 1){
                this.controlling.forEach(u => {
                    u.kill();
                });
                this.kill();
                //this.formation = null;
            }

            let percentage = this.sumh/this.maxh;
            this.controlling.forEach(u => {
                u.health = u.type.health*percentage;
            });
            this.health = this.type.health*percentage;
        }
    },
    clearCommand(){
        //print(this);
        //undo health pooling
        if(this.isCommanding()){
            this.groupsize = 0;
            this.maxh = 0;
            this.sumh = 0;
            this.controlling.forEach(u => {
                let has = false;
                u.abilities.forEach(ab => {
                    if(ab instanceof ForceFieldAbility){
                        has = true;
                    }
                });
                if(!has){
                    u.shield = 0;
                }
            });
        }
        this.super$clearCommand();
        //inc++;
    },
    command(formation, units){
        this.super$command(formation, units);
        //print(this);
        units.forEach(u => {
            this.maxh += u.maxHealth;
            this.sumh += u.health;
            //print(u.health);
            this.groupsize++;
        });
        //print(this.sumh);
        this.maxh += this.maxHealth;
        this.sumh += this.health;
        //print(this.groupsize);
    },
    draw(){
        this.super$draw();
        if(this.isCommanding()){
            Draw.z(Layer.flyingUnit-1);
            this.controlling.forEach(u=>{
                drawLaser(this.team,
                    this.x,this.y,
                    u.x,u.y,
                    u.type.hitSize,this.type.hitSize);
            });
        }
    },
});

const bomb = sapbomb();
bomb.homingPower =  6;
bomb.homingRange = 70;
bomb.splashDamage = 19;
bomb.splashDamageRadius = 23;
bomb.lifetime = 56;
bomb.speed = 0.1;
bomb.maxSpeed = 1.3;
bomb.drag = 0.036;

bomb.frontColor = bomb.backColor = Color.valueOf("bf92f9");
bomb.width = 9;
bomb.height = 12;
bomb.shrinkY = 0.6;
bomb.shrinkX = 0.4;
bomb.despawnEffect = Fx.flakExplosion;
bomb.maxRange = 85;
//bomb.color = Color.valueOf("bf92f9");


const swarmgun = extend(Weapon, "swarmgun", {
    rotate: false,
    x:0,
    xRand: 0.7,
    y:-2,
    reload: 160,
    mirror: false,
    bullet: bomb,
    ignoreRotation:true,
    shootCone: 180,
    inaccuracy: 15,
    shots: 7,
    shotDelay: 6,
    shootSound: Sounds.none,
});

swarm.weapons.add(swarmgun);

swarm.defaultController = () => extend(FlyingAI,{});

//radius regen max cooldown
const shield = new comShield(15,1,65,50);
const shield1 = new ForceFieldAbility(15,1,65,50);
swarm.abilities.add(shield);
swarm.abilities.add(shield1);

refresh(swarm);
