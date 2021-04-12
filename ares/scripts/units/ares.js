const refresh = require("libs/refresh");
const spawn = require('abilities/customUnitSpawn');

function getUnit(){
  const unit = extend(UnitType, "ares", {  
    /*drawWeapons(unit){
    }*/
    load() {
      this.super$load();
      this.region = Core.atlas.find(this.name);
      this.tbase = Core.atlas.find("ares-turret1base");
      this.secondaries = Core.atlas.find("ares-secondaries");
      this.paddle = Core.atlas.find("ares-ares-paddle");
    },
    init(){
      this.super$init();
      this.localizedName = "icarus";
      //print("fajdlkfjdslflkjdlk");
      //reads this when loading the game
    },
    //name:"ares",
    description: "Heavy-hitting battlecruiser with an unusual method of propulsion. It has no movement AI and low HP for its size. Don't fly too close to the enemies.",
    health: 6000,
    //type: flying,
    speed: 1.2,
    accel: 0.004,
    rotateSpeed: 0.3,
    drag: 0.004,
    hitSize: 85,
    armor: 45,
    rotateShooting: false,
    trailLength: 35,
    trailX: 12,        
    trailY: 18,
    trailScl: 2.8,
    research: UnitTypes.eclipse,
    range: 270,
    flying: true,
    engineOffset : 65,
    engineSize : 13.2,
    lowAltitude: true
  });

  unit.constructor = () => extend(UnitEntity, {
    //yes it works, a different var per unit, but will start from different var than saved when loaded
    //h: Math.random(),

    //VERY IMPORTANT DO NOT DELETE OR METHODS NO WORK
    classId: () => unit.classId,
    //update only work when spawn
    update(){
      this.super$update();
    },
    killed(){
      this.super$killed();
      Fx.massiveExplosion.at(this.x,this.y,this.rotation);
    },
  });
  return unit;
}

const a = getUnit();
refresh(a);


//zenith 2
const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {
  classId: () => z.classId,
  killed(){
    this.super$killed();
  }
});

//format ripped from goldmod, (amt, max, rld, range)
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 32,140,180,10);
//const ashield = new JavaAdapter(ShieldRegenFieldAbility, {}, 1500,3000,1000,100);
z.abilities.add(zshield);
//a.abilities.add(ashield);



//custom effects
//(duration, spawner reference)
var aExp = new Effect(80, e => {
  //shockwaves
  Draw.color(Pal.missileYellow);

  e.scaled(10, i => {
    Lines.circle(e.x, e.y, 4 + i.fin() * 72);
  });

  e.scaled(12, i => {
    Lines.circle(e.x, e.y, 4 + i.fin() * 67);
  });

  e.scaled(15, i => {
    Lines.circle(e.x, e.y, 4 + i.fin() * 64);
  });

  //glowing line
  e.scaled(17,i =>{
    Lines.stroke(40 * i.fout());
  });

  //smoke
  Draw.color(Color.gray);

  Angles.randLenVectors(e.id, 45, 5 + 50 * e.finpow(), (x, y) => {
    Fill.circle(e.x + x, e.y + y, e.fout() * 10 + 0.5);
  });

  //
  Draw.color(Pal.missileYellowBack);
  Lines.stroke(e.fout());
  //glowing stuff
  e.scaled(55, i =>{
    //movement
    Angles.randLenVectors(e.id, 26, 5 + 27 * e.finpow(), (x, y) => {
      //circle
      Fill.circle(e.x + x, e.y + y, i.fout() * 7+ 0.5);
    });
  });
  
  //lines i guess
  Angles.randLenVectors(e.id + 1, 19, 1 + 50 * e.finpow(), (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1 + e.fout() * 4);
  });
});

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


const mainshot = extend(ArtilleryBulletType, {
  //will add more later
  update(b){
    this.super$update(b)
  },
  frontColor: Color(255, 137, 0),
  width: 4,
  height: 40,
  shrinkY: 0.4,
  speed: 3.2,
  splashDamageRadius: 110,
  splashDamage: 170,
  damage: 224,
  status: StatusEffects.burning,
  trailEffect: Fx.artilleryTrail,
  lifetime: 164,
  hitEffect: aExp,
  keepVelocity: false,
});

const blankshot = extend(BasicBulletType,{
  lifetime: 0,
  width: 0,
  height: 0
});

var rspeed = 1.2

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
    reload: 103,
    //xRand: 8,
    shootY: 14,
    shootX: span*(i-1),
    recoil: 13,
    inaccuracy: 1.4,
    shots: 1,
    shotDelay: i*delay,
    shootSound: Sounds.artillery,
    bullet: mainshot
  });
  a.weapons.add(w1);
};
//a.weapons.add(wm);

var spawnZenith = spawn(z,0,5,1200);
var spawnFlare = spawn(UnitTypes.flare,0,-17,150);


a.abilities.add(spawnZenith);

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
