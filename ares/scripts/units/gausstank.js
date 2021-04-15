const refresh = require("libs/refresh");
const apbullet = require("bullets/armorpiercing");



//modifiers
function aMod(a){
    //overpen
    if(a<3){
        return 0.3 + 0.1 * a;
    }
    //normal armor mod
    else{
        return -(a-2.5)*(a-25)/20;
    }
}
function pMod(a){
    if(a<4){
        return a*0.5;
    }
    else return Math.pow(a,3)/30;
}

const tankbullet = apbullet(aMod,pMod);
tankbullet.despawnEffect = Fx.flakExplosion;
tankbullet.hitEffect = Fx.hitBulletSmall;
tankbullet.shootEffect = tankbullet.smokeEffect = Fx.thoriumShoot;
tankbullet.lifetime = 24;
tankbullet.speed = 19;
tankbullet.damage = 64;


const tankgun = extend(Weapon, "gaussgun",{
    bullet: tankbullet,
    load(){
        this.super$load();
        this.region = Core.atlas.find("ares-" + this.name);
        this.outlineRegion = Core.atlas.find("ares-"+ this.name + "-outline");
    },
    rotate: true,
    rotateSpeed: 2.1,
    mirror: false,
    x: 0,
    y: 0,
    reload: 150,
    //xRand: 8,
    shootY: 20,
    shootX: 0,
    recoil: 3,
    inaccuracy: 0.9,
    //restitution: 0.3,
    shots: 1,
    shootSound: Sounds.shotgun,
});

const tank = extend(UnitType, "gausstank",{
    
    load(){
        this.super$load();
        this.region = Core.atlas.find(this.name);
        this.turretcell = Core.atlas.find("ares-gaussguncell");
    },
    init(){
        this.super$init();
        this.localizedName = "tank";
    },
    drawWeapons(unit){
        this.super$drawWeapons(unit);
        Draw.z(Layer.groundUnit+1);
        let mrotation = unit.mounts[0].rotation;
        let recoil = -((unit.mounts[0].reload) / tankgun.reload * tankgun.recoil);
        this.applyColor(unit);
        Draw.color(this.cellColor(unit));
        Draw.rect(
            this.turretcell,
            unit.x + Angles.trnsx(unit.rotation-90,tankgun.x,tankgun.y) + Angles.trnsx(mrotation + unit.rotation-90,0,recoil),
            unit.y + Angles.trnsy(unit.rotation-90,tankgun.x,tankgun.y) + Angles.trnsy(mrotation + unit.rotation-90,0,recoil),
            unit.rotation + mrotation - 90
        );
        Draw.reset();
    },
    description: "placeholder",
    health: 560,
    //type: flying,
    speed: 0.78,
    accel: 0.06,
    drag: 0.05,
    hitSize: 24,
    armor: 11,
    rotateShooting: false,
    rotateSpeed: 1.4,
    research: UnitTypes.dagger,
    range: 160,
    //get rid of leg animation
    mechFrontSway: 0,
    mechSideSway: 0,
    mechStride: 0
});
//unit type (mech, sea, fly go here)
tank.constructor = () => extend(MechUnit,{
    classId: () => tank.classId,
    trackmove: [0,0],
});

refresh(tank);

tank.weapons.add(tankgun);

module.exports = tank;

function angleDifference(from, to){
    let difference = to - from;
    while (difference < -180) difference += 360;
    while (difference > 180) difference -= 360;
    return difference;
}