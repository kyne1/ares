const refresh = require("libs/refresh");

//const searchInterval = 75;

function sprite(name){
    return Core.atlas.find(name);
}

const orbs = 3;
const laser = sprite("laser");
const laserEnd = sprite("laser-end");
const inaccuracy = 3;
const rotateSpeed = 0.9;
const orbReload = 86;

function drawLaser(team,  x1,  y1,  x2,  y2,  size1,  size2){
    let angle1 = Angles.angle(x1, y1, x2, y2);
    let vx = Mathf.cosDeg(angle1), vy = Mathf.sinDeg(angle1);
    let len1 = size1 / 2 - 1.5, len2 = size2 / 2 - 1.5;
    //print(Drawf);
    Draw.color(Color.valueOf("#dfcbfe"), 0.8);
    Draw.z(Layer.flyingUnitLow+0.5);
    Drawf.laser(team, laser, laserEnd, x1 + vx*len1, y1 + vy*len1, x2 - vx*len2, y2 - vy*len2, 0.25);
}

function drawOrb(x, y, size, opacity){
    //Draw.reset();
    Drawf.shadow(x, y, size*2);
    //Drawf.light(x, y, size*3, Color.valueOf("#dfcfef"), 1);
    Draw.color(Color.valueOf("#dfcfef"), 0.7*opacity)
    Fill.circle(x, y, size);
    Draw.color(Color.valueOf("#feeeef"), 0.96*opacity);
    Fill.circle(x, y, size*0.67);
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

const warper = extend(UnitType, "warper",{
    load(){
        this.super$load();
        this.region = sprite("ares-warper");
    },
    init(){
        this.super$init();
        this.localizedName = "Mage";
    },
    description: "Summons and launches electric orbs. Attack from distance. Manual control recommended.",
    health: 560,
    speed: 2.0,
    accel: 0.05,
    drag: 0.03,
    flying: true,
    hitSize: 19,
    engineOffset: 11,
    engineSize: 3.3,
    armor: 4,
    rotateShooting: false,
    rotateSpeed: 7,
    research: UnitTypes.horizon,
    range: 180,
    commandLimit: 9,
    lowAltitude: true,
    buildSpeed: 1.2,
    mineTier: 3,
    mineSpeed: 8,
});

warper.constructor = () => extend(UnitEntity,{
    classId: () => warper.classId,
    groupsize: 0,
    maxh: 0,
    sumh: 0,
    searchTimer: 0,
    orbrot: 0,
    orbpos: {},
    orbready: 0,
    orbtimer: 0,
    update(){
        this.super$update();
        //print(this.isShooting); //will work without weapons
        //print(this.units); //this.units -> formation members
        //print(this.isCommanding()) //isCommanding()
        //print(mount.reload);
        //randomize firing interval
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

        this.orbrot += rotateSpeed*Time.delta;
        for(let i = 0; i < orbs; i++){
            let rot = toRad(this.orbrot + i*360/orbs);
            //print(rot);
            this.orbpos[i] = new Vec2(Math.cos(rot)*this.type.hitSize, Math.sin(rot)*this.type.hitSize);
            //print(this.orbpos[i].x);
        }
        if(this.orbrot >= 360) this.orbrot -= 360;
        else if(this.orbrot <= 0) this.orbrot += 360;

        

        this.orbtimer += Time.delta;
        //slowly gain orbs
        if(this.orbtimer >= orbReload && this.orbready < orbs){
            this.orbready ++;
            this.orbtimer = 0;
        }
        

        if(!this.isPlayer() && !(this.controller instanceof FormationAI)){
            let target = Units.closestTarget(this.team, this.x,this.y, this.type.range)
            if(target != null) this.isShooting = true;
        }
        //if(this.mounts[0].shoot)print(this.mounts[0].shoot);

        if(this.isShooting && this.orbready > 0){
            //print("h");
            for(let i = 0; i < this.orbready; i++){
                let thisx = this.orbpos[i].x + this.x;
                let thisy = this.orbpos[i].y + this.y;
                //print(thisx);
                orbBullet.create(
                    this, this.team,
                    thisx, thisy,
                    angleTo(this.mounts[0].aimX,this.mounts[0].aimY,thisx,thisy) + Mathf.range(inaccuracy)
                )
            }
            Sounds.tractorbeam.at(this.x,this.y);
            this.orbready = 0;
            this.orbtimer = 0;
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
            this.controlling.forEach(u=>{
                drawLaser(this.team,
                    this.x,this.y,
                    u.x,u.y,
                    this.type.hitSize,u.type.hitSize);
            });
        }
        try{
            for(let i = 0; i < this.orbready; i++){
                let thisx = this.orbpos[i].x + this.x;
                let thisy = this.orbpos[i].y + this.y;
                drawOrb(thisx,thisy,3.6,1);
            }
        }   
        catch(e){
            //print(e);
        }
    },
});

const warperbullet = extend(LightningBulletType,{
    damage: 40,
    shootEffect: Fx.none,
    lightningLength: 7,
    lightningLengthRand: 3,
    lightningType: extend(BulletType, {
        lifetime: Fx.lightning.lifetime,
        hitEffect: Fx.none,
        despawnEffect: Fx.none,
        status: StatusEffects.shocked,
        statusDuration: 25,
        hittable: false,
        collidesTeam: false,
    }),
});


const warperbullet2 = extend(BasicBulletType,{
    damage: 15,
    shootEffect: Fx.none,
    lifetime: 40,
    speed: 8,
});

const orbBullet = extend(BasicBulletType,{
    damage: 35,
    splashDamageRadius: 35,
    splashDamage: 12,
    shootEffect: Fx.none,
    despawnEffect: Fx.redgeneratespark,
    hitEffect: Fx.redgeneratespark,
    lifetime: 85,
    speed: 3.5,
    homingPower: 0.07,
    homingRange: 130,
    fragBullets: 2,
    fragBullet: warperbullet,
    draw(b){
        drawOrb(b.x,b.y,3.6,1);
    }
});


/*
for(let i = 0; i < orbs; i++){
    let wpn = extend(Weapon, "magicgun",{
        rotate: true,
        rotateSpeed: 360,
        mirror: false,
        x: 0,
        y: 0,
        reload: 5,
        //xRand: 8,
        shootY: 0,
        shootX: 0,
        recoil: 0,
        inaccuracy: 1.4,
        shots: 1,
        shootSound: Sounds.pew,
        bullet: warperbullet,
    });
    warper.weapons.add(wpn);
}*/

const blankshot = extend(BasicBulletType,{
    lifetime: 0,
    width: 0,
    height: 0,
    damage: 1,
    shootEffect: Fx.none,
    shootSmoke: Fx.none,
    despawnEffect: Fx.none,
    hitEffect: Fx.none,
    speed: orbBullet.speed
});

const fakegun = extend(Weapon, "fakegun",{
    rotate: true,
    x:0,
    y:0,
    reload: 10000,
    recoil: 0,
    mirror: false,
    bullet: blankshot
});

warper.weapons.add(fakegun);

warper.defaultController = () => extend(BuilderAI,{});

const shield = new JavaAdapter(ShieldRegenFieldAbility, {}, 15, 90, 60*3.5, 50);

const heal = new JavaAdapter(RepairFieldAbility, {}, 25, 60*7, 50);

warper.abilities.add(shield);

warper.abilities.add(heal);

refresh(warper);
