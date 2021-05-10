const refresh = require("libs/refresh");
const fname = require("dir");
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

function fin(percent){
    return 1 - Math.pow(2,-Math.min(percent,1)*6); //1-2^(-6x)
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
    description: "placeholder",
    health: 70,
    speed: 4.3,
    accel: 0.051,
    drag: 0.05,
    flying: true,
    hitSize: 5,
    engineOffset: 5,
    engineSize: 1,
    armor: 0,
    rotateShooting: true,
    rotateSpeed: 7,
    research: UnitTypes.flare,
    range: 120,
    commandLimit: 19,
    lowAltitude: false,
    mineTier: 1,
    mineSpeed: 0.5,
    buildSpeed:0.3
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
                //print(helth);
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


const swarmbullet = extend(BasicBulletType,{
    damage: 4,
    lifetime: 36,
    width: 7,
    height: 10,
    speed: 5,
});

const swarmgun = extend(Weapon, "swarmgun", {
    rotate: false,
    x:3,
    y:4,
    reload: 15,
    mirror: true,
    bullet: swarmbullet,
    inaccuracy: 6,
});

swarm.weapons.add(swarmgun);

swarm.defaultController = () => extend(BuilderAI,{});

refresh(swarm);
