

const a = extend(UnitType, "ares", {
  /*drawWeapons(unit){
  }*/
  load() {
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.tbase = Core.atlas.find("ares-turret1base");
	}
});
a.constructor = () => extend(UnitEntity, {
  draw(){
    this.super$draw();
    const x = 0;
    const y = 74;
    //routorio code
    const r = this.rotation-90;
    /*const sin = Mathf.sin(r);
		const cos = Mathf.cos(r);*/

    Draw.rect(a.tbase,
      this.x + Angles.trnsx(r, x, y),
			this.y + Angles.trnsy(r, x, y),
      r + this.mounts[0].rotation
    )
  }
});
const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {});
//format ripped from goldmod, (amt, max, rld, range)
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 35,140,180,10);
//const ashield = new JavaAdapter(ShieldRegenFieldAbility, {}, 1500,3000,1000,100);
//print(ta); //prints an adapter number, extend() success
z.abilities.add(zshield);
//a.abilities.add(ashield);

var aExp = new Effect(30, e => {
  //initial sparks and etc
  Draw.color(Pal.missileYellow);

  e.scaled(15, i => {
    Lines.stroke(17 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 50);
  });

  //smoke
  Draw.color(Color.gray);

  Angles.randLenVectors(e.id, 12, 2 + 50 * e.finpow(), (x, y) => {
    Fill.circle(e.x + x, e.y + y, e.fout() * 10 + 0.5);
  });

  //
  Draw.color(Pal.missileYellowBack);
  Lines.stroke(e.fout());

  Angles.randLenVectors(e.id + 1, 6, 1 + 50 * e.finpow(), (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1 + e.fout() * 4);
  });
});





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


const mainshot = extend(ArtilleryBulletType, {
  frontColor: Color(255, 137, 0),
  width: 4,
  height: 40,
  shrinkY: 0.4,
  speed: 3.8,
  splashDamageRadius: 125,
  splashDamage: 150,
  damage: 120,
  status: StatusEffects.burning,
  lifetime: 144,
  trailEffect: Fx.artilleryTrail,
  hitEffect: aExp,
  keepVelocity: false,
  lightning: 2,
  lightningLength: 17.75
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
    reload: 95,
    //xRand: 8,
    shootY: 14,
    shootX: span*(i-1),
    recoil: 12,
    inaccuracy: 1.4,
    shots: 1,
    shotDelay: i*delay,
    shootSound: Sounds.boom,
    bullet: mainshot
  });
  a.weapons.add(w1);
};
//a.weapons.add(wm);

//secondaries replaced by shootability

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
