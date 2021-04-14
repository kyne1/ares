const refresh = require("libs/refresh");
const apbullet = require("bullets/armorpiercing");

const tankgun = extend(Weapon, "gaussgun",{
    bullet: apbullet(),
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
    reload: 140,
    //xRand: 8,
    shootY: -4,
    shootX: 0,
    recoil: 3,
    inaccuracy: 1.4,
    //restitution: 0.3,
    shots: 1,
    shootSound: Sounds.shoot,
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
        print(mrotation);
        //print(this.turretcell);
        Draw.reset();
    },
    description: "placeholder",
    health: 680,
    //type: flying,
    speed: 0.78,
    accel: 0.07,
    drag: 0.13,
    hitSize: 30,
    armor: 20,
    rotateShooting: false,
    rotateSpeed: 1.4,
    research: UnitTypes.dagger,
    range: 185,
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