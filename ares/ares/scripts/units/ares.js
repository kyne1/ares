

const a = extend(UnitType, "ares", {
  /*drawWeapons(unit){
  }*/
  load() {
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.tbase = Core.atlas.find("ares-turret1base");
    this.paddle = Core.atlas.find("ares-ares-paddle");
	},
  init(){
    this.super$init();
    //print("fajdlkfjdslflkjdlk");
    //reads this when loading the game
  },
  localizedName: "ares",
});

a.constructor = () => extend(UnitEntity, {
  //this doesnt even get read at all
  init(){
    this.super$init();
    //this.gru = "h";
    //print(gdafsdfa);
  }
});



//refresh(a);


const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {});
//format ripped from goldmod, (amt, max, rld, range)
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 35,140,180,10);
//const ashield = new JavaAdapter(ShieldRegenFieldAbility, {}, 1500,3000,1000,100);
//print(ta); //prints an adapter number, extend() success
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

//secondaries replaced by shootability

var spawnZenith = extend(UnitSpawnAbility,{
  load(){this.super$load();},
  //add 'this.var' if var undefined
  update(unit){
    this.super$update(unit);
  },
  //@override
  draw(unit){
    //super.draw(unit);
    //this.super$draw(unit);
    Draw.draw(Draw.z(), () => {
        var x = unit.x + Angles.trnsx(unit.rotation, this.spawnY, this.spawnX), y = unit.y + Angles.trnsy(unit.rotation, this.spawnY, this.spawnX);
        
        Drawf.construct(x, y, this.unit.icon(Cicon.full), unit.rotation - 90, Math.min(1, this.timer/this.spawnTime), 1, this.timer);
    });
  },
  unit: z,
  spawnX: 0,
  spawnY: 5,
  spawnTime: 1200
});

var spawnFlare = extend(UnitSpawnAbility,{
  load(){this.super$load();},
  //did this to access the protected var 'timer', dont remove
  update(unit){
    this.super$update(unit);
  },
  //@override
  draw(unit){
    //super.draw(unit);
    //this.super$draw(unit);
    //changed draw to always draw regardless of cancreate. My unit is too plain
    Draw.draw(Draw.z(), () => {
        var x = unit.x + Angles.trnsx(unit.rotation, this.spawnY, this.spawnX), y = unit.y + Angles.trnsy(unit.rotation, this.spawnY, this.spawnX);
        
        Drawf.construct(x, y, this.unit.icon(Cicon.full), unit.rotation - 90, Math.min(1, this.timer/this.spawnTime), 1, this.timer);
    });
  },
  unit: UnitTypes.flare,
  spawnX: 0,
  spawnY: -17,
  spawnTime: 150 //default 120
});

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
