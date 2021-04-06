
const a = extend(UnitType, "ares", {
  /*drawWeapons(unit){
  }*/
});
a.constructor = () => extend(UnitEntity, {});

const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {});
//format ripped from goldmod, (amt, max, rld, range)
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 35,140,180,10);
//const ashield = new JavaAdapter(ShieldRegenFieldAbility, {}, 1500,3000,1000,100);
//print(ta); //prints an adapter number, extend() success
z.abilities.add(zshield);
//a.abilities.add(ashield);


//create and then change a controller
/*const controllernew = extend(FlyingAI, {
  UpdateWeapons(){
    let mount = unit.mounts[0];
    let weapon = mount.weapon;
    weapon.aimX = 5;
  }
});
UnitTypes.antumbra.defaultController = () => controllernew;*/

//messed up the game's global.js line 41
/*const t = extend(Turret, {
  shoot(type){
    effects();
  }
});*/

//event listernerns dont need loope
const sbf = extend(BasicBulletType, {
  width: 5,
  height: 7,
  lifetime: 20,
  speed: 12,
  damage: 10,
  drag: 0.03,
  pierce: true,
  despawnEffect: Fx.none,
  hitEffect: Fx.none
});

//sb = secondary bullet
const sb = extend(BasicBulletType, {
  width: 7,
  height: 11,
  shrinkY: 0,
  speed: 12,
  drag: 0,
  damage: 70,
  makeFire: true,
  status: StatusEffects.burning,
  lifetime: 28,
  fragBullets: 2,
  fragCone: 30,
  //add frag
  fragBullet: sbf,
  despawnEffect: Fx.none,
  hitEffect: Fx.none
});

//module.exports = sbf;

//main gun shot -> minshot
const slagfrag = extend(LiquidBulletType,{
  liquid: Liquids.slag,
  lifetime: 18,
  speed: 2,
  damage: 51
});

const mainshot = extend(ArtilleryBulletType, {
  frontColor: Color(255, 137, 0),
  width: 4,
  height: 40,
  shrinkY: 0.01,
  speed: 3.6,
  drag: 0,
  splashDamageRadius: 125,
  splashDamage: 350,
  status: StatusEffects.burning,
  lifetime: 190,
  trailEffect: Fx.artilleryTrail,
  hitEffect: Fx.massiveExplosion,
  keepVelocity: false,
  fragBullets: 13,
  fragBullet: slagfrag
});

const blankshot = extend(BasicBulletType,{
  lifetime: 0,
  width: 0,
  height: 0
});

var rspeed = 1.2
//main gun
const wm = extend(Weapon, "turret1base",{
  load(){this.super$load();this.region = Core.atlas.find("ares-turret1base");},
  x: 0,
  y: 74,
  rotate: true,
  rotateSpeed: rspeed,
  mirror: false,
  recoil: 0,
  reload: 1000,
  bullet: blankshot
});

//im ashamed to bruteforce like this
var span = 5;
var delay = 0;
var sides = ["L","M","R"]
for(let i = 0; i < 3; i++){
  let tempsides = sides[i];
  let w1 = extend(Weapon, "gun"+tempsides,{
    load(){this.super$load();this.region = Core.atlas.find("ares-gun"+tempsides);},
    rotate: true,
    rotateSpeed: rspeed,
    mirror: false,
    x: 0,
    y: 74,
    reload: 95,
    //xRand: 8,
    shootY: 14,
    shootX: span*(i-1),
    recoil: 12,
    inaccuracy: 0,
    shots: 1,
    shotDelay: i*delay,
    shootSound: Sounds.boom,
    bullet: mainshot
  });
  a.weapons.add(w1);
};
a.weapons.add(wm);

//replaced by Shootability
/*
//secondaries
for(let i = 0; i < 5; i++){
  for(let j = -1; j < 2; j += 2){
    var w2 = extendContent(Weapon, "secondaries", {
    //load sprite
    load(){this.super$load();this.region = Core.atlas.find("ares-secondaries");},
    shootY: 10.5,
    reload: 11 + 4*Math.random(),
    x: 25*j,
    y: -36.5 + i * 20, //spacing 20 going up 5 times
    shadow: 1,
    rotateSpeed: 8,
    rotate: true,
    shots: 1,
    shotDelay: 0,
    inaccuracy: 3,
    velocityRnd: 0.2,
    shootSound: Sounds.shoot,
    mirror: false,
    bullet: sb
  });
  a.weapons.add(w2);
}};*/

var spawnZenith = extend(UnitSpawnAbility,{
  load(){this.super$load();},

  //add 'this.' if var undefined
  unit: z,
  spawnX: 0,
  spawnY: 5,
  spawnTime: 1200
});

var spawnFlare = extend(UnitSpawnAbility,{
  load(){this.super$load();},
  unit: UnitTypes.flare,
  spawnX: 0,
  spawnY: -35,
  spawnTime: 120
});

for(let i = 0; i < 3; i++){
a.abilities.add(spawnZenith);
}

//a.abilities.add(shield);
a.abilities.add(spawnFlare);

//make ares unit available to all files
module.exports = a;

let arr = new Array();
for(let i = 0; i < Blocks.airFactory.plans.size; i++){
  arr[i] = Blocks.airFactory.plans.get(i);
}
arr.push(UnitFactory.UnitPlan(a, 60 * 5, ItemStack.with()));
Blocks.airFactory.plans = Seq.with(arr);

//.put()
